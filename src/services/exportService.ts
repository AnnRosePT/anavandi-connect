import JSZip from "jszip";
import { saveAs } from "file-saver";
import { TimetableRecord } from "@/types/timetable";

// Re-export PDF service so callers can import all exports from one place
export { exportTimetablePdf } from "./pdfExportService";

function convertTimeToGtfs(timeStr: string, defaultHour: number = 6): string {
  if (!timeStr || timeStr === "—" || timeStr === "-") return "00:00:00";
  const cleaned = timeStr.replace("*", "").trim();
  const match = cleaned.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return `${String(defaultHour).padStart(2, "0")}:00:00`;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
}

export function exportTimetableCsv(timetable: TimetableRecord) {
  const headers = [
    "Sequence",
    "Stop_Code",
    "Stop_Name",
    "Stop_Name_Malayalam",
    "Arrival_Time",
    "Departure_Time",
    "District",
    "Platform",
    "AI_Confidence",
    "Verification_Status",
  ];

  const rows = timetable.stops.map((stop) => [
    stop.seq,
    `"${stop.code}"`,
    `"${stop.name.replace(/"/g, '""')}"`,
    `"${(stop.nameMl || "").replace(/"/g, '""')}"`,
    `"${stop.arrival}"`,
    `"${stop.departure}"`,
    `"${stop.district || "Kerala"}"`,
    `"${stop.platform || "Main Bay"}"`,
    `${stop.confidence}%`,
    `"${stop.status}"`,
  ]);

  const csvContent = "\uFEFF" + [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const filename = `${timetable.id}_schedule.csv`;
  saveAs(blob, filename);
  return filename;
}

export function exportTimetableJson(timetable: TimetableRecord) {
  const jsonContent = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "BusTrip",
      agency: {
        "@type": "Organization",
        name: "Kerala State Road Transport Corporation (KSRTC)",
        alternateName: "ആനവണ്ടി (Aana Vandi)",
        url: "https://onlineksrtcswift.com",
      },
      timetableId: timetable.id,
      tripId: timetable.tripId,
      title: timetable.title,
      titleMalayalam: timetable.titleMl,
      serviceClass: timetable.serviceType,
      chassisType: timetable.chassisType,
      vehicleRegistration: timetable.vehicleNo,
      depotOrigin: timetable.depotOrigin,
      depotDestination: timetable.depotDestination,
      totalDistanceKm: timetable.totalDistanceKm,
      estimatedDuration: timetable.estimatedDuration,
      standardTariffInr: timetable.fareInr,
      extractionConfidenceScore: timetable.overallConfidence,
      verificationStatus: timetable.status,
      verifiedBy: timetable.verifiedBy || "Pending Review",
      publishedTimestamp: timetable.publishedAt || new Date().toISOString(),
      stops: timetable.stops.map((s) => ({
        sequence: s.seq,
        stopCode: s.code,
        name: s.name,
        nameMalayalam: s.nameMl,
        arrival: s.arrival,
        departure: s.departure,
        gtfsArrival: convertTimeToGtfs(s.arrival, 6),
        gtfsDeparture: convertTimeToGtfs(s.departure, 6),
        confidence: s.confidence,
        status: s.status,
        coordinates: s.coordinates || null,
      })),
      discrepanciesCount: timetable.discrepancies.length,
      discrepancies: timetable.discrepancies,
    },
    null,
    2
  );

  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
  const filename = `${timetable.id}_feed.json`;
  saveAs(blob, filename);
  return filename;
}

export async function exportGtfsZip(timetable: TimetableRecord) {
  const zip = new JSZip();

  // 1. agency.txt
  const agencyTxt = [
    "agency_id,agency_name,agency_url,agency_timezone,agency_lang,agency_phone",
    'KSRTC,"Kerala State Road Transport Corporation",https://onlineksrtcswift.com,Asia/Kolkata,ml,0471-2463799',
  ].join("\r\n");
  zip.file("agency.txt", agencyTxt);

  // 2. routes.txt
  const routesTxt = [
    "route_id,agency_id,route_short_name,route_long_name,route_type,route_color,route_text_color",
    `${timetable.routeCode},KSRTC,"${timetable.serviceType}","${timetable.title}",3,B82828,FFFFFF`,
  ].join("\r\n");
  zip.file("routes.txt", routesTxt);

  // 3. stops.txt
  const stopsLines = ["stop_id,stop_name,stop_lat,stop_lon,zone_id"];
  timetable.stops.forEach((s) => {
    const lat = s.coordinates?.lat || 8.5;
    const lng = s.coordinates?.lng || 76.9;
    stopsLines.push(`${s.code},"${s.name.replace(/"/g, '""')}",${lat},${lng},KERALA_TRANSIT`);
  });
  zip.file("stops.txt", stopsLines.join("\r\n"));

  // 4. trips.txt
  const tripsTxt = [
    "route_id,service_id,trip_id,trip_headsign,direction_id,wheelchair_accessible",
    `${timetable.routeCode},DAILY_01,${timetable.tripId},"${timetable.destination.replace(/"/g, '""')}",0,1`,
  ].join("\r\n");
  zip.file("trips.txt", tripsTxt);

  // 5. stop_times.txt
  const stopTimesLines = [
    "trip_id,arrival_time,departure_time,stop_id,stop_sequence,pickup_type,drop_off_type",
  ];
  timetable.stops.forEach((s, idx) => {
    const arrTime = convertTimeToGtfs(s.arrival, 6 + idx);
    const depTime = convertTimeToGtfs(s.departure, 6 + idx);
    stopTimesLines.push(
      `${timetable.tripId},${arrTime},${depTime},${s.code},${s.seq},0,0`
    );
  });
  zip.file("stop_times.txt", stopTimesLines.join("\r\n"));

  // 6. calendar.txt
  const calendarTxt = [
    "service_id,monday,tuesday,wednesday,thursday,friday,saturday,sunday,start_date,end_date",
    "DAILY_01,1,1,1,1,1,1,1,20260101,20261231",
  ].join("\r\n");
  zip.file("calendar.txt", calendarTxt);

  // Generate zip
  const content = await zip.generateAsync({ type: "blob" });
  const filename = `${timetable.id}_GTFS_Package.zip`;
  saveAs(content, filename);
  return filename;
}
