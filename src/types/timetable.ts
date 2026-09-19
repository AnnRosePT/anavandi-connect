export type ServiceClass = 
  | "ALL"
  | "SUPER_FAST"
  | "FAST_PASSENGER"
  | "MINNAL"
  | "EXPRESS"
  | "ORDINARY";

export type TimetableStatus = 
  | "DRAFT"
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "PUBLISHED";

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface StopItem {
  id: string;
  seq: number;
  name: string;
  nameMl: string;
  code: string;
  arrival: string;     // e.g. "06:15 AM" or "—"
  departure: string;   // e.g. "06:20 AM" or "—"
  confidence: number;  // 0 to 100 percentage (e.g. 98.2)
  status: "verified" | "needs_review" | "corrected" | "rejected";
  isAnomaly?: boolean;
  coordinates?: GeoLocation;
  district?: string;
  platform?: string;
  note?: string;
}

export interface DiscrepancyDetail {
  stopIndex: number;
  stopName: string;
  field: "arrival" | "departure" | "stop_name";
  printedValue: string;
  printedConfidence: number;
  printedTypeface?: string;
  handwrittenValue: string;
  handwrittenConfidence: number;
  handwrittenNote?: string;
  selectedResolution: "none" | "use_handwritten" | "accept_printed" | "custom_corrected" | "flagged";
  customValue?: string;
  diffScoreMins?: number;
}

export interface TimetableRecord {
  id: string;
  tripId: string;
  title: string;
  titleMl: string;
  origin: string;
  originMl: string;
  destination: string;
  destinationMl: string;
  serviceType: ServiceClass;
  serviceName: string;
  serviceNameMl: string;
  vehicleNo: string;
  chassisType: string;
  depotOrigin: string;
  depotDestination: string;
  overallConfidence: number;
  stops: StopItem[];
  status: TimetableStatus;
  discrepancies: DiscrepancyDetail[];
  totalDistanceKm: number;
  estimatedDuration: string;
  fareInr: number;
  sourceFile: string;
  sourceType: "dot_matrix" | "handwritten_log" | "printed_press" | "community_photo";
  language: "English" | "Malayalam" | "Bilingual";
  publishedAt?: string;
  verifiedBy?: string;
  createdAt: string;
  viaSummary: string;
  viaSummaryMl: string;
  routeCode: string;
  isCommunitySubmission?: boolean;
  submitterNotes?: string;
}

export interface SearchQuery {
  origin: string;
  destination: string;
  date: string;
  serviceClass: ServiceClass;
  timeFilter?: string; // e.g. "before 09:00"
}
