import { TimetableRecord } from "@/types/timetable";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr || timeStr === "—" || timeStr === "-") return null;
  // Clean asterisk or extra symbols
  const cleaned = timeStr.replace("*", "").trim();
  const match = cleaned.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function validateTimetable(timetable: TimetableRecord): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!timetable.title || timetable.title.trim() === "") {
    errors.push("Missing route title.");
  }

  if (!timetable.stops || timetable.stops.length < 2) {
    errors.push("A valid timetable requires at least 2 terminal stops (Origin and Terminus).");
    return { isValid: false, errors, warnings };
  }

  const seenStops = new Set<string>();
  let previousDepartureMinutes: number | null = null;

  timetable.stops.forEach((stop, idx) => {
    if (!stop.name || stop.name.trim() === "") {
      errors.push(`Stop #${stop.seq || idx + 1} has an empty station name.`);
    }

    const normName = stop.name.trim().toLowerCase();
    if (seenStops.has(normName)) {
      errors.push(`Duplicate stop detected: "${stop.name}" appears more than once.`);
    }
    seenStops.add(normName);

    // Sequence check for times
    const arrMin = parseTimeToMinutes(stop.arrival);
    const depMin = parseTimeToMinutes(stop.departure);

    // First stop must have departure
    if (idx === 0) {
      if (depMin === null) {
        errors.push(`Origin stop "${stop.name}" must have a valid departure time.`);
      }
      previousDepartureMinutes = depMin;
    } else if (idx === timetable.stops.length - 1) {
      // Last stop must have arrival
      if (arrMin === null) {
        errors.push(`Destination terminus "${stop.name}" must have a valid arrival time.`);
      }
      if (arrMin !== null && previousDepartureMinutes !== null && arrMin < previousDepartureMinutes) {
        warnings.push(`Terminus arrival time (${stop.arrival}) is earlier than previous departure time. Check for overnight crossing.`);
      }
    } else {
      // Intermediate stops
      if (arrMin === null && depMin === null) {
        errors.push(`Intermediate stop "${stop.name}" must have at least an arrival or departure time.`);
      }

      if (arrMin !== null && depMin !== null && depMin < arrMin) {
        errors.push(`Stop "${stop.name}": Departure (${stop.departure}) cannot be earlier than Arrival (${stop.arrival}).`);
      }

      if (arrMin !== null && previousDepartureMinutes !== null && arrMin < previousDepartureMinutes) {
        warnings.push(`Stop "${stop.name}" arrival (${stop.arrival}) is earlier than previous station departure.`);
      }

      if (depMin !== null) {
        previousDepartureMinutes = depMin;
      } else if (arrMin !== null) {
        previousDepartureMinutes = arrMin;
      }
    }

    if (stop.confidence < 80) {
      warnings.push(`Stop "${stop.name}" has low AI confidence (${stop.confidence}%). Human review recommended.`);
    }

    if (stop.status === "needs_review") {
      warnings.push(`Stop "${stop.name}" is flagged as requiring verification review.`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
