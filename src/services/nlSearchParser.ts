import { TimetableRecord, ServiceClass } from "@/types/timetable";
import { timetableStore } from "./store";

export interface ParsedBusQuery {
  rawQuery: string;
  origin: string | null;
  destination: string | null;
  timeConstraint: {
    type: "before" | "after" | "at" | "none";
    timeStr: string | null;
    minutes: number | null;
  };
  serviceClass: ServiceClass | null;
  modifier: "next" | "last" | "cheapest" | "fastest" | "all";
}

function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const meridiem = match[3]?.toLowerCase();

  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function parseNaturalLanguageBusQuery(query: string): ParsedBusQuery {
  const q = query.trim().toLowerCase();

  let origin: string | null = null;
  let destination: string | null = null;
  let timeType: "before" | "after" | "at" | "none" = "none";
  let timeStr: string | null = null;
  let timeMinutes: number | null = null;
  let serviceClass: ServiceClass | null = null;
  let modifier: "next" | "last" | "cheapest" | "fastest" | "all" = "all";

  if (q.includes("next bus")) modifier = "next";
  else if (q.includes("last bus")) modifier = "last";
  else if (q.includes("fastest")) modifier = "fastest";
  else if (q.includes("cheapest")) modifier = "cheapest";

  if (q.includes("super fast") || q.includes("superfast")) serviceClass = "SUPER_FAST";
  else if (q.includes("fast passenger") || q.includes("fp")) serviceClass = "FAST_PASSENGER";
  else if (q.includes("minnal")) serviceClass = "MINNAL";
  else if (q.includes("express")) serviceClass = "EXPRESS";

  // Time extraction
  const beforeMatch = q.match(/before\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  const afterMatch = q.match(/after\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  const atMatch = q.match(/at\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);

  if (beforeMatch) {
    timeType = "before";
    timeStr = beforeMatch[1];
    timeMinutes = parseTimeToMinutes(timeStr);
  } else if (afterMatch) {
    timeType = "after";
    timeStr = afterMatch[1];
    timeMinutes = parseTimeToMinutes(timeStr);
  } else if (atMatch) {
    timeType = "at";
    timeStr = atMatch[1];
    timeMinutes = parseTimeToMinutes(timeStr);
  }

  // Origin to Destination patterns:
  // "from X to Y", "X to Y", "between X and Y", "buses to Y from X"
  const fromToMatch = q.match(/from\s+([a-z\s]+?)\s+to\s+([a-z\s]+?)(?:\s+before|\s+after|\s+at|$)/i);
  const toFromMatch = q.match(/to\s+([a-z\s]+?)\s+from\s+([a-z\s]+?)(?:\s+before|\s+after|\s+at|$)/i);
  const directMatch = q.match(/([a-z]+)\s+to\s+([a-z]+)/i);

  if (fromToMatch) {
    origin = cleanStationName(fromToMatch[1]);
    destination = cleanStationName(fromToMatch[2]);
  } else if (toFromMatch) {
    destination = cleanStationName(toFromMatch[1]);
    origin = cleanStationName(toFromMatch[2]);
  } else if (directMatch) {
    origin = cleanStationName(directMatch[1]);
    destination = cleanStationName(directMatch[2]);
  }

  return {
    rawQuery: query,
    origin,
    destination,
    timeConstraint: {
      type: timeType,
      timeStr,
      minutes: timeMinutes,
    },
    serviceClass,
    modifier,
  };
}

function cleanStationName(str: string): string {
  return str
    .replace(/\b(show|me|buses|bus|find|get|the|all|any|running)\b/gi, "")
    .trim();
}

export interface MatchedBusResult {
  timetable: TimetableRecord;
  originStop: { name: string; departure: string; departureMinutes: number };
  destinationStop: { name: string; arrival: string; arrivalMinutes: number };
  durationMinutes: number;
  fareInr: number;
  serviceType: string;
}

export function searchBusesWithParsedQuery(parsed: ParsedBusQuery): MatchedBusResult[] {
  const all = timetableStore.getAll();
  const results: MatchedBusResult[] = [];

  const originQuery = parsed.origin ? parsed.origin.toLowerCase() : "";
  const destQuery = parsed.destination ? parsed.destination.toLowerCase() : "";

  for (const t of all) {
    if (parsed.serviceClass && parsed.serviceClass !== "ALL" && t.serviceType !== parsed.serviceClass) {
      continue;
    }

    let originIndex = -1;
    let destIndex = -1;

    // Search stops
    for (let i = 0; i < t.stops.length; i++) {
      const stopName = t.stops[i].name.toLowerCase();
      if (originQuery && originIndex === -1 && stopName.includes(originQuery)) {
        originIndex = i;
      }
      if (destQuery && originIndex !== -1 && i > originIndex && stopName.includes(destQuery)) {
        destIndex = i;
      }
    }

    // If both specified and found in proper direction
    if (originQuery && destQuery) {
      if (originIndex === -1 || destIndex === -1 || originIndex >= destIndex) continue;
    } else if (originQuery && !destQuery) {
      if (originIndex === -1) continue;
      destIndex = t.stops.length - 1;
    } else if (!originQuery && destQuery) {
      if (destIndex === -1) {
        // Find if destination stop exists
        const found = t.stops.findIndex((s) => s.name.toLowerCase().includes(destQuery));
        if (found === -1) continue;
        destIndex = found;
        originIndex = 0;
      }
    } else {
      // Default: match all
      originIndex = 0;
      destIndex = t.stops.length - 1;
    }

    const oStop = t.stops[originIndex];
    const dStop = t.stops[destIndex];

    const depMinutes = parseTimeToMinutes(oStop.departure || oStop.arrival) || 360;
    const arrMinutes = parseTimeToMinutes(dStop.arrival || dStop.departure) || 720;

    // Time filter
    if (parsed.timeConstraint.type === "before" && parsed.timeConstraint.minutes !== null) {
      if (depMinutes >= parsed.timeConstraint.minutes) continue;
    } else if (parsed.timeConstraint.type === "after" && parsed.timeConstraint.minutes !== null) {
      if (depMinutes <= parsed.timeConstraint.minutes) continue;
    }

    let duration = arrMinutes - depMinutes;
    if (duration < 0) duration += 1440; // overnight

    results.push({
      timetable: t,
      originStop: {
        name: oStop.name,
        departure: oStop.departure,
        departureMinutes: depMinutes,
      },
      destinationStop: {
        name: dStop.name,
        arrival: dStop.arrival,
        arrivalMinutes: arrMinutes,
      },
      durationMinutes: duration,
      fareInr: Math.round(t.fareInr * ((destIndex - originIndex) / (t.stops.length - 1 || 1))),
      serviceType: t.serviceName,
    });
  }

  // Handle modifier
  if (parsed.modifier === "fastest") {
    results.sort((a, b) => a.durationMinutes - b.durationMinutes);
  } else if (parsed.modifier === "cheapest") {
    results.sort((a, b) => a.fareInr - b.fareInr);
  } else if (parsed.modifier === "next") {
    results.sort((a, b) => a.originStop.departureMinutes - b.originStop.departureMinutes);
  } else if (parsed.modifier === "last") {
    results.sort((a, b) => b.originStop.departureMinutes - a.originStop.departureMinutes);
  }

  return results;
}
