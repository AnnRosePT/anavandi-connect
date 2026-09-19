import { StopItem } from "@/types/timetable";
import { KERALA_COORDINATES } from "./store";

export function parseRawTableToStops(rawLines: string[]): StopItem[] {
  const stops: StopItem[] = [];
  let seq = 1;

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length < 3) continue;

    // Detect format like "01. Station Name ARR 06:15 DEP 06:20" or "Station | 06:15 | 06:20"
    const pipeParts = trimmed.split("|").map((p) => p.trim());
    if (pipeParts.length >= 3) {
      const name = pipeParts[0].replace(/^\d+[\.\)]\s*/, "");
      const arr = pipeParts[1] || "—";
      const dep = pipeParts[2] || "—";
      const coords = KERALA_COORDINATES[name] || { lat: 9.9, lng: 76.3 };

      stops.push({
        id: `parsed-${seq}`,
        seq: seq++,
        name,
        nameMl: name,
        code: `KSRTC-${name.slice(0, 3).toUpperCase()}-${String(seq).padStart(3, "0")}`,
        arrival: arr,
        departure: dep,
        confidence: 95.0,
        status: "verified",
        coordinates: coords,
      });
      continue;
    }

    // Regex fallback
    const match = trimmed.match(/^(?:\d+[\.\)]\s*)?([A-Za-z\s]+?)(?:\s+(?:ARR|arr)\s+([\d:]+\s*(?:AM|PM)?))?(?:\s+(?:DEP|dep)\s+([\d:]+\s*(?:AM|PM)?))?$/i);
    if (match) {
      const name = match[1].trim();
      const arr = match[2] || "—";
      const dep = match[3] || "—";
      const coords = KERALA_COORDINATES[name] || { lat: 9.9, lng: 76.3 };

      stops.push({
        id: `parsed-${seq}`,
        seq: seq++,
        name,
        nameMl: name,
        code: `KSRTC-${name.slice(0, 3).toUpperCase()}-${String(seq).padStart(3, "0")}`,
        arrival: arr,
        departure: dep,
        confidence: 92.0,
        status: "verified",
        coordinates: coords,
      });
    }
  }

  return stops;
}
