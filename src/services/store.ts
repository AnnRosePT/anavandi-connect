import { TimetableRecord, StopItem, DiscrepancyDetail, ServiceClass } from "@/types/timetable";

// Realistic Kerala coordinates for Leaflet Map
export const KERALA_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Thiruvananthapuram Central": { lat: 8.4905, lng: 76.9531 },
  "Trivandrum": { lat: 8.4905, lng: 76.9531 },
  "Thampanoor": { lat: 8.4905, lng: 76.9531 },
  "Attingal": { lat: 8.6964, lng: 76.8142 },
  "Kollam": { lat: 8.8932, lng: 76.6141 },
  "Kollam Bus Station": { lat: 8.8932, lng: 76.6141 },
  "Karunagappally": { lat: 9.0534, lng: 76.5369 },
  "Kayamkulam": { lat: 9.1729, lng: 76.5000 },
  "Haripad": { lat: 9.2882, lng: 76.4589 },
  "Ambalapuzha": { lat: 9.3828, lng: 76.3562 },
  "Alappuzha": { lat: 9.4981, lng: 76.3388 },
  "Alappuzha KSRTC Stand": { lat: 9.4981, lng: 76.3388 },
  "Alappuzha Depo": { lat: 9.4981, lng: 76.3388 },
  "Cherthala": { lat: 9.6845, lng: 76.3323 },
  "Kottayam": { lat: 9.5916, lng: 76.5222 },
  "Kottayam Bypass": { lat: 9.5916, lng: 76.5222 },
  "Ernakulam": { lat: 9.9816, lng: 76.2999 },
  "Ernakulam Central": { lat: 9.9816, lng: 76.2999 },
  "Ernakulam Central Depot": { lat: 9.9816, lng: 76.2999 },
  "Vyttila Hub": { lat: 9.9675, lng: 76.3197 },
  "Aluva": { lat: 10.1076, lng: 76.3516 },
  "Angamaly": { lat: 10.1960, lng: 76.3860 },
  "Chalakudy": { lat: 10.3070, lng: 76.3330 },
  "Thrissur": { lat: 10.5276, lng: 76.2144 },
  "Thrissur Sakthan Thampuran": { lat: 10.5218, lng: 76.2169 },
  "Thrissur Sakthan Stand": { lat: 10.5218, lng: 76.2169 },
  "Wadakkanchery": { lat: 10.6625, lng: 76.2415 },
  "Shoranur": { lat: 10.7634, lng: 76.2796 },
  "Alathur": { lat: 10.6473, lng: 76.5433 },
  "Palakkad": { lat: 10.7867, lng: 76.6548 },
  "Kozhikode": { lat: 11.2588, lng: 75.7804 },
  "Kozhikode (Mavoor Rd)": { lat: 11.2588, lng: 75.7804 },
  "Kozhikode Calicut": { lat: 11.2588, lng: 75.7804 },
  "Vadakara": { lat: 11.6094, lng: 75.5907 },
  "Thalassery": { lat: 11.7491, lng: 75.4890 },
  "Kannur": { lat: 11.8745, lng: 75.3704 },
  "Kannur Main Bus Terminal": { lat: 11.8745, lng: 75.3704 },
  "Kannur Municipal": { lat: 11.8745, lng: 75.3704 },
  "Kannur Central": { lat: 11.8745, lng: 75.3704 },
  "Kasaragod": { lat: 12.4996, lng: 74.9869 },
  "Neyyattinkara": { lat: 8.4024, lng: 77.0877 },
  "Parasala": { lat: 8.3411, lng: 77.1518 },
  "Marthandam": { lat: 8.3072, lng: 77.2272 },
  "Nagercoil": { lat: 8.1833, lng: 77.4119 },
  "Kanyakumari": { lat: 8.0883, lng: 77.5385 },
  "Kottarakkara": { lat: 9.0000, lng: 76.7667 },
  "Muvattupuzha": { lat: 9.9790, lng: 76.5794 },
  "Kothamangalam": { lat: 10.0630, lng: 76.6267 },
  "Adimali": { lat: 10.0402, lng: 76.9535 },
  "Munnar": { lat: 10.0889, lng: 77.0595 },
  "Bangalore": { lat: 12.9716, lng: 77.5946 },
  "Coimbatore": { lat: 11.0168, lng: 76.9558 },
  "Waynand / Kalpetta": { lat: 11.6103, lng: 76.0827 },
};

const SEED_TIMETABLES: TimetableRecord[] = [
  {
    id: "KL-15-TRV-CAN-0824",
    tripId: "KL-RTC-SF-0530",
    routeCode: "TRV-CAN-01",
    title: "Trivandrum → Kannur Super Fast",
    titleMl: "തിരുവനന്തപുരം → കണ്ണൂർ സൂപ്പർ ഫാസ്റ്റ്",
    origin: "Trivandrum (തമ്പാനൂർ)",
    originMl: "തിരുവനന്തപുരം (തമ്പാനൂർ)",
    destination: "Kannur (കണ്ണൂർ)",
    destinationMl: "കണ്ണൂർ (മെയിൻ ബസ് സ്റ്റാൻഡ്)",
    serviceType: "SUPER_FAST",
    serviceName: "Super Fast (#SF-104)",
    serviceNameMl: "സൂപ്പർ ഫാസ്റ്റ്",
    vehicleNo: "KL 15 0007",
    chassisType: "Ashok Leyland 210WB / 12M",
    depotOrigin: "Thampanoor Central Depot",
    depotDestination: "Kannur Municipal Terminal",
    overallConfidence: 94.6,
    status: "PENDING_VERIFICATION",
    totalDistanceKm: 478,
    estimatedDuration: "8h 45m",
    fareInr: 485,
    sourceFile: "KSRTC_LOG_1984_OCT_CAN0824.TIFF",
    sourceType: "dot_matrix",
    language: "Bilingual",
    viaSummary: "Via Kollam, Alappuzha, Ernakulam, Thrissur & Calicut",
    viaSummaryMl: "കൊല്ലം, ആലപ്പുഴ, എറണാകുളം, തൃശ്ശൂർ, കോഴിക്കോട് വഴി",
    createdAt: "2026-09-18T05:30:00Z",
    discrepancies: [
      {
        stopIndex: 2,
        stopName: "Alappuzha KSRTC Stand",
        field: "departure",
        printedValue: "09:10 AM",
        printedConfidence: 68.4,
        printedTypeface: "Monospace Letterpress (1984)",
        handwrittenValue: "09:15 AM",
        handwrittenConfidence: 92.8,
        handwrittenNote: "Blue fountain ink revision by Station Master 'S.K.' affixed",
        selectedResolution: "none",
        diffScoreMins: 5,
      },
    ],
    stops: [
      {
        id: "stop-1",
        seq: 1,
        name: "Thiruvananthapuram Central",
        nameMl: "തിരുവനന്തപുരം സെൻട്രൽ (തമ്പാനൂർ)",
        code: "KSRTC-TRV-001",
        arrival: "—",
        departure: "06:15 AM",
        confidence: 98.2,
        status: "verified",
        coordinates: KERALA_COORDINATES["Thiruvananthapuram Central"],
        district: "Thiruvananthapuram",
        platform: "Bay #4",
      },
      {
        id: "stop-2",
        seq: 2,
        name: "Kollam Bus Station",
        nameMl: "കൊല്ലം ബസ് സ്റ്റാൻഡ്",
        code: "KSRTC-QLN-012",
        arrival: "07:30 AM",
        departure: "07:35 AM",
        confidence: 96.5,
        status: "verified",
        coordinates: KERALA_COORDINATES["Kollam"],
        district: "Kollam",
        platform: "Bay #2",
      },
      {
        id: "stop-3",
        seq: 3,
        name: "Alappuzha KSRTC Stand",
        nameMl: "ആലപ്പുഴ കെ.എസ്.ആർ.ടി.സി സ്റ്റാൻഡ്",
        code: "KSRTC-ALP-024",
        arrival: "09:05 AM",
        departure: "09:15 AM*",
        confidence: 72.1,
        status: "needs_review",
        isAnomaly: true,
        coordinates: KERALA_COORDINATES["Alappuzha"],
        district: "Alappuzha",
        platform: "Bay #1",
        note: "Conflict: printed 09:10 vs handwritten 09:15",
      },
      {
        id: "stop-4",
        seq: 4,
        name: "Ernakulam Central Depot",
        nameMl: "എറണാകുളം സെൻട്രൽ ഡിപ്പോ",
        code: "KSRTC-ERS-033",
        arrival: "10:45 AM",
        departure: "10:55 AM",
        confidence: 94.3,
        status: "verified",
        coordinates: KERALA_COORDINATES["Ernakulam"],
        district: "Ernakulam",
        platform: "Bay #6",
      },
      {
        id: "stop-5",
        seq: 5,
        name: "Thrissur Sakthan Thampuran",
        nameMl: "തൃശ്ശൂർ ശക്തൻ തമ്പുരാൻ സ്റ്റാൻഡ്",
        code: "KSRTC-TCR-048",
        arrival: "12:35 PM",
        departure: "12:45 PM",
        confidence: 97.8,
        status: "verified",
        coordinates: KERALA_COORDINATES["Thrissur"],
        district: "Thrissur",
        platform: "Bay #3",
      },
      {
        id: "stop-6",
        seq: 6,
        name: "Kozhikode (Mavoor Rd)",
        nameMl: "കോഴിക്കോട് (മാവൂർ റോഡ് ഡിപ്പോ)",
        code: "KSRTC-CLT-062",
        arrival: "03:10 PM",
        departure: "03:20 PM",
        confidence: 93.9,
        status: "verified",
        coordinates: KERALA_COORDINATES["Kozhikode"],
        district: "Kozhikode",
        platform: "Bay #5",
      },
      {
        id: "stop-7",
        seq: 7,
        name: "Kannur Main Bus Terminal",
        nameMl: "കണ്ണൂർ മെയിൻ ബസ് ടെർമിനൽ",
        code: "KSRTC-CAN-089",
        arrival: "05:30 PM",
        departure: "—",
        confidence: 99.1,
        status: "verified",
        coordinates: KERALA_COORDINATES["Kannur"],
        district: "Kannur",
        platform: "Terminus",
      },
    ],
  },
  {
    id: "KL-15-TRV-CAN-MN02",
    tripId: "KL-RTC-MN-2100",
    routeCode: "TRV-CAN-EXP",
    title: "Trivandrum → Kannur Minnal Deluxe",
    titleMl: "തിരുവനന്തപുരം → കണ്ണൂർ മിന്നൽ ഡീലക്സ്",
    origin: "Trivandrum (തമ്പാനൂർ)",
    originMl: "തിരുവനന്തപുരം",
    destination: "Kannur (കണ്ണൂർ)",
    destinationMl: "കണ്ണൂർ",
    serviceType: "MINNAL",
    serviceName: "Minnal Deluxe (#MN-02 Night Rider)",
    serviceNameMl: "മിന്നൽ ഡീലക്സ് (നൈറ്റ് റൈഡർ)",
    vehicleNo: "KL 15 9402",
    chassisType: "Leyland Viking Air-Suspension",
    depotOrigin: "Trivandrum Night Wing",
    depotDestination: "Kannur Central",
    overallConfidence: 98.4,
    status: "VERIFIED",
    totalDistanceKm: 478,
    estimatedDuration: "7h 15m",
    fareInr: 540,
    sourceFile: "MINNAL_NIGHT_RIDER_DISPATCH_OCT.TIFF",
    sourceType: "printed_press",
    language: "Bilingual",
    viaSummary: "Non-stop Highway Corridor via Kottayam Bypass & Vyttila",
    viaSummaryMl: "കോട്ടയം ബൈപ്പാസ്, വൈറ്റില ഹബ്ബ് വഴി നോൺ-സ്റ്റോപ്പ്",
    createdAt: "2026-09-17T18:00:00Z",
    publishedAt: "2026-09-17T20:30:00Z",
    verifiedBy: "Inspector R. Kurup (TRV-Div)",
    discrepancies: [],
    stops: [
      {
        id: "mn-1",
        seq: 1,
        name: "Thiruvananthapuram Central",
        nameMl: "തിരുവനന്തപുരം സെൻട്രൽ",
        code: "KSRTC-TRV-001",
        arrival: "—",
        departure: "09:00 PM",
        confidence: 99.4,
        status: "verified",
        coordinates: KERALA_COORDINATES["Thiruvananthapuram Central"],
        district: "Thiruvananthapuram",
      },
      {
        id: "mn-2",
        seq: 2,
        name: "Kottayam Bypass",
        nameMl: "കോട്ടയം ബൈപ്പാസ്",
        code: "KSRTC-KTM-BYP",
        arrival: "11:45 PM",
        departure: "11:50 PM",
        confidence: 98.1,
        status: "verified",
        coordinates: KERALA_COORDINATES["Kottayam"],
        district: "Kottayam",
      },
      {
        id: "mn-3",
        seq: 3,
        name: "Vyttila Hub",
        nameMl: "വൈറ്റില മൊബിലിറ്റി ഹബ്ബ്",
        code: "KSRTC-ERS-HUB",
        arrival: "01:10 AM",
        departure: "01:15 AM",
        confidence: 97.9,
        status: "verified",
        coordinates: KERALA_COORDINATES["Vyttila Hub"],
        district: "Ernakulam",
      },
      {
        id: "mn-4",
        seq: 4,
        name: "Kozhikode Calicut",
        nameMl: "കോഴിക്കോട് ബൈപ്പാസ്",
        code: "KSRTC-CLT-BYP",
        arrival: "03:15 AM",
        departure: "03:20 AM",
        confidence: 98.6,
        status: "verified",
        coordinates: KERALA_COORDINATES["Kozhikode"],
        district: "Kozhikode",
      },
      {
        id: "mn-5",
        seq: 5,
        name: "Kannur Central",
        nameMl: "കണ്ണൂർ സെൻട്രൽ",
        code: "KSRTC-CAN-089",
        arrival: "04:15 AM",
        departure: "—",
        confidence: 99.0,
        status: "verified",
        coordinates: KERALA_COORDINATES["Kannur"],
        district: "Kannur",
      },
    ],
  },
  {
    id: "KL-15-TRV-CAN-FP218",
    tripId: "KL-RTC-FP-0715",
    routeCode: "TRV-CAN-FP",
    title: "Trivandrum → Kannur Fast Passenger",
    titleMl: "തിരുവനന്തപുരം → കണ്ണൂർ ഫാസ്റ്റ് പാസഞ്ചർ",
    origin: "Trivandrum (തമ്പാനൂർ)",
    originMl: "തിരുവനന്തപുരം",
    destination: "Kannur (കണ്ണൂർ)",
    destinationMl: "കണ്ണൂർ",
    serviceType: "FAST_PASSENGER",
    serviceName: "Fast Passenger (#FP-218)",
    serviceNameMl: "ഫാസ്റ്റ് പാസഞ്ചർ",
    vehicleNo: "KL 15 4831",
    chassisType: "Ashok Leyland 160hp Comet",
    depotOrigin: "Attingal / TVM Rural",
    depotDestination: "Kannur Old Bus Stand",
    overallConfidence: 96.2,
    status: "VERIFIED",
    totalDistanceKm: 485,
    estimatedDuration: "9h 30m",
    fareInr: 440,
    sourceFile: "FP218_RURAL_ROSTER.PDF",
    sourceType: "dot_matrix",
    language: "Malayalam",
    viaSummary: "Main Highway stopping at 24 major towns",
    viaSummaryMl: "എല്ലാ പ്രധാന പട്ടണങ്ങളിലും സ്റ്റോപ്പുകൾ",
    createdAt: "2026-09-16T12:00:00Z",
    publishedAt: "2026-09-17T09:00:00Z",
    verifiedBy: "Inspector V. Nair (TRV)",
    discrepancies: [],
    stops: [
      { id: "fp-1", seq: 1, name: "Thiruvananthapuram Central", nameMl: "തിരുവനന്തപുരം", code: "TRV-01", arrival: "—", departure: "07:15 AM", confidence: 99, status: "verified", coordinates: KERALA_COORDINATES["Trivandrum"] },
      { id: "fp-2", seq: 2, name: "Attingal", nameMl: "ആറ്റിങ്ങൽ", code: "ATG-02", arrival: "07:55 AM", departure: "08:00 AM", confidence: 97, status: "verified", coordinates: KERALA_COORDINATES["Attingal"] },
      { id: "fp-3", seq: 3, name: "Kollam", nameMl: "കൊല്ലം", code: "QLN-03", arrival: "08:45 AM", departure: "08:50 AM", confidence: 96, status: "verified", coordinates: KERALA_COORDINATES["Kollam"] },
      { id: "fp-4", seq: 4, name: "Alappuzha", nameMl: "ആലപ്പുഴ", code: "ALP-04", arrival: "10:15 AM", departure: "10:20 AM", confidence: 95, status: "verified", coordinates: KERALA_COORDINATES["Alappuzha"] },
      { id: "fp-5", seq: 5, name: "Ernakulam", nameMl: "എറണാകുളം", code: "ERS-05", arrival: "11:55 AM", departure: "12:05 PM", confidence: 98, status: "verified", coordinates: KERALA_COORDINATES["Ernakulam"] },
      { id: "fp-6", seq: 6, name: "Thrissur", nameMl: "തൃശ്ശൂർ", code: "TCR-06", arrival: "01:45 PM", departure: "01:55 PM", confidence: 97, status: "verified", coordinates: KERALA_COORDINATES["Thrissur"] },
      { id: "fp-7", seq: 7, name: "Kozhikode", nameMl: "കോഴിക്കോട്", code: "CLT-07", arrival: "03:50 PM", departure: "04:00 PM", confidence: 94, status: "verified", coordinates: KERALA_COORDINATES["Kozhikode"] },
      { id: "fp-8", seq: 8, name: "Kannur", nameMl: "കണ്ണൂർ", code: "CAN-08", arrival: "04:45 PM", departure: "—", confidence: 98, status: "verified", coordinates: KERALA_COORDINATES["Kannur"] },
    ],
  },
  {
    id: "KL-15-TRV-CAPE-882",
    tripId: "KL-RTC-IS-0600",
    routeCode: "TRV-CAPE-IS",
    title: "Trivandrum → Kanyakumari Inter-State",
    titleMl: "തിരുവനന്തപുരം → കന്യാകുമാരി ഇന്റർസ്റ്റേറ്റ്",
    origin: "Trivandrum (തമ്പാനൂർ)",
    originMl: "തിരുവനന്തപുരം",
    destination: "Kanyakumari (കന്യാകുമാരി)",
    destinationMl: "കന്യാകുമാരി",
    serviceType: "FAST_PASSENGER",
    serviceName: "Fast Passenger (#FP-882)",
    serviceNameMl: "ഫാസ്റ്റ് പാസഞ്ചർ",
    vehicleNo: "KL 15 2209",
    chassisType: "Ashok Leyland Cheetah",
    depotOrigin: "Trivandrum Central",
    depotDestination: "Kanyakumari Depot",
    overallConfidence: 97.5,
    status: "VERIFIED",
    totalDistanceKm: 87,
    estimatedDuration: "2h 30m",
    fareInr: 95,
    sourceFile: "INTER_STATE_CAPE_ROSTER.PNG",
    sourceType: "printed_press",
    language: "English",
    viaSummary: "Via Neyyattinkara, Parasala, Marthandam & Nagercoil",
    viaSummaryMl: "നെയ്യാറ്റിൻകര, പാറശ്ശാല, മാർത്താണ്ഡം, നാഗർകോവിൽ വഴി",
    createdAt: "2026-09-17T06:00:00Z",
    publishedAt: "2026-09-17T08:00:00Z",
    verifiedBy: "Inspector M. Pillai",
    discrepancies: [],
    stops: [
      { id: "cape-1", seq: 1, name: "Thiruvananthapuram Central", nameMl: "തിരുവനന്തപുരം", code: "TRV-01", arrival: "—", departure: "06:00 AM", confidence: 99, status: "verified", coordinates: KERALA_COORDINATES["Trivandrum"] },
      { id: "cape-2", seq: 2, name: "Neyyattinkara", nameMl: "നെയ്യാറ്റിൻകര", code: "NYK-02", arrival: "06:35 AM", departure: "06:40 AM", confidence: 98, status: "verified", coordinates: KERALA_COORDINATES["Neyyattinkara"] },
      { id: "cape-3", seq: 3, name: "Parasala", nameMl: "പാറശ്ശാല", code: "PSL-03", arrival: "07:00 AM", departure: "07:05 AM", confidence: 97, status: "verified", coordinates: KERALA_COORDINATES["Parasala"] },
      { id: "cape-4", seq: 4, name: "Marthandam", nameMl: "മാർത്താണ്ഡം", code: "MTD-04", arrival: "07:25 AM", departure: "07:30 AM", confidence: 96, status: "verified", coordinates: KERALA_COORDINATES["Marthandam"] },
      { id: "cape-5", seq: 5, name: "Nagercoil", nameMl: "നാഗർകോവിൽ", code: "NGL-05", arrival: "08:05 AM", departure: "08:10 AM", confidence: 98, status: "verified", coordinates: KERALA_COORDINATES["Nagercoil"] },
      { id: "cape-6", seq: 6, name: "Kanyakumari", nameMl: "കന്യാകുമാരി", code: "CAPE-06", arrival: "08:30 AM", departure: "—", confidence: 99, status: "verified", coordinates: KERALA_COORDINATES["Kanyakumari"] },
    ],
  },
  {
    id: "KL-15-TRV-MNR-EXP",
    tripId: "KL-RTC-MNR-0500",
    routeCode: "TRV-MNR-01",
    title: "Trivandrum → Munnar High Range Express",
    titleMl: "തിരുവനന്തപുരം → മൂന്നാർ ഹൈറേഞ്ച് എക്സ്പ്രസ്",
    origin: "Trivandrum (തമ്പാനൂർ)",
    originMl: "തിരുവനന്തപുരം",
    destination: "Munnar (മൂന്നാർ)",
    destinationMl: "മൂന്നാർ",
    serviceType: "SUPER_FAST",
    serviceName: "High Range Super Fast",
    serviceNameMl: "ഹൈറേഞ്ച് സൂപ്പർ ഫാസ്റ്റ്",
    vehicleNo: "KL 15 5512",
    chassisType: "Ashok Leyland 12M Mountain Gear",
    depotOrigin: "Trivandrum Central",
    depotDestination: "Munnar Depot",
    overallConfidence: 96.8,
    status: "VERIFIED",
    totalDistanceKm: 278,
    estimatedDuration: "8h 15m",
    fareInr: 340,
    sourceFile: "MUNNAR_HIGHRANGE_WALL_SHEET.TIFF",
    sourceType: "dot_matrix",
    language: "Bilingual",
    viaSummary: "Via Kottarakkara, Kottayam, Muvattupuzha, Kothamangalam & Adimali",
    viaSummaryMl: "കൊട്ടാരക്കര, കോട്ടയം, മൂവാറ്റുപുഴ, കോതമംഗലം, അടിമാലി വഴി",
    createdAt: "2026-09-17T05:00:00Z",
    publishedAt: "2026-09-17T07:15:00Z",
    verifiedBy: "Inspector S. Thomas",
    discrepancies: [],
    stops: [
      { id: "mnr-1", seq: 1, name: "Thiruvananthapuram Central", nameMl: "തിരുവനന്തപുരം", code: "TRV-01", arrival: "—", departure: "05:00 AM", confidence: 99, status: "verified", coordinates: KERALA_COORDINATES["Trivandrum"] },
      { id: "mnr-2", seq: 2, name: "Kottarakkara", nameMl: "കൊട്ടാരക്കര", code: "KTR-02", arrival: "06:30 AM", departure: "06:35 AM", confidence: 98, status: "verified", coordinates: KERALA_COORDINATES["Kottarakkara"] },
      { id: "mnr-3", seq: 3, name: "Kottayam", nameMl: "കോട്ടയം", code: "KTM-03", arrival: "08:15 AM", departure: "08:25 AM", confidence: 96, status: "verified", coordinates: KERALA_COORDINATES["Kottayam"] },
      { id: "mnr-4", seq: 4, name: "Muvattupuzha", nameMl: "മൂവാറ്റുപുഴ", code: "MVP-04", arrival: "09:45 AM", departure: "09:50 AM", confidence: 97, status: "verified", coordinates: KERALA_COORDINATES["Muvattupuzha"] },
      { id: "mnr-5", seq: 5, name: "Kothamangalam", nameMl: "കോതമംഗലം", code: "KTMG-05", arrival: "10:15 AM", departure: "10:20 AM", confidence: 96, status: "verified", coordinates: KERALA_COORDINATES["Kothamangalam"] },
      { id: "mnr-6", seq: 6, name: "Adimali", nameMl: "അടിമാലി", code: "ADL-06", arrival: "11:45 AM", departure: "11:50 AM", confidence: 95, status: "verified", coordinates: KERALA_COORDINATES["Adimali"] },
      { id: "mnr-7", seq: 7, name: "Munnar", nameMl: "മൂന്നാർ", code: "MNR-07", arrival: "01:15 PM", departure: "—", confidence: 99, status: "verified", coordinates: KERALA_COORDINATES["Munnar"] },
    ],
  },
  {
    id: "KL-15-TCR-ERS-SHUTTLE",
    tripId: "KL-RTC-TCR-0730",
    routeCode: "TCR-ERS-SH",
    title: "Thrissur → Ernakulam City Shuttle",
    titleMl: "തൃശ്ശൂർ → എറണാകുളം സിറ്റി ഷട്ടിൽ",
    origin: "Thrissur (തൃശ്ശൂർ)",
    originMl: "തൃശ്ശൂർ",
    destination: "Ernakulam (എറണാകുളം)",
    destinationMl: "എറണാകുളം",
    serviceType: "FAST_PASSENGER",
    serviceName: "Fast Passenger (#FP-44)",
    serviceNameMl: "ഫാസ്റ്റ് പാസഞ്ചർ",
    vehicleNo: "KL 15 3119",
    chassisType: "Ashok Leyland 12M",
    depotOrigin: "Thrissur Sakthan Depot",
    depotDestination: "Ernakulam South Depot",
    overallConfidence: 99.1,
    status: "VERIFIED",
    totalDistanceKm: 76,
    estimatedDuration: "1h 45m",
    fareInr: 85,
    sourceFile: "TCR_ERS_COMMUTER_SCHEDULE.PDF",
    sourceType: "printed_press",
    language: "Bilingual",
    viaSummary: "Via Chalakudy, Angamaly & Aluva",
    viaSummaryMl: "ചാലക്കുടി, അങ്കമാലി, ആലുവ വഴി",
    createdAt: "2026-09-17T07:00:00Z",
    publishedAt: "2026-09-17T07:15:00Z",
    verifiedBy: "Inspector G. Menon",
    discrepancies: [],
    stops: [
      { id: "tcr-1", seq: 1, name: "Thrissur Sakthan Stand", nameMl: "തൃശ്ശൂർ ശക്തൻ സ്റ്റാൻഡ്", code: "TCR-01", arrival: "—", departure: "07:30 AM", confidence: 99, status: "verified", coordinates: KERALA_COORDINATES["Thrissur"] },
      { id: "tcr-2", seq: 2, name: "Chalakudy", nameMl: "ചാലക്കുടി", code: "CKY-02", arrival: "08:05 AM", departure: "08:10 AM", confidence: 99, status: "verified", coordinates: KERALA_COORDINATES["Chalakudy"] },
      { id: "tcr-3", seq: 3, name: "Angamaly", nameMl: "അങ്കമാലി", code: "ANG-03", arrival: "08:25 AM", departure: "08:30 AM", confidence: 99, status: "verified", coordinates: KERALA_COORDINATES["Angamaly"] },
      { id: "tcr-4", seq: 4, name: "Aluva", nameMl: "ആലുവ", code: "ALV-04", arrival: "08:45 AM", departure: "08:50 AM", confidence: 99, status: "verified", coordinates: KERALA_COORDINATES["Aluva"] },
      { id: "tcr-5", seq: 5, name: "Ernakulam Central", nameMl: "എറണാകുളം സെൻട്രൽ", code: "ERS-05", arrival: "09:15 AM", departure: "—", confidence: 99, status: "verified", coordinates: KERALA_COORDINATES["Ernakulam"] },
    ],
  },
  {
    id: "KL-15-TRV-PGT-SF",
    tripId: "KL-RTC-SF-0645",
    routeCode: "TRV-PGT-01",
    title: "Trivandrum → Palakkad Super Fast",
    titleMl: "തിരുവനന്തപുരം → പാലക്കാട് സൂപ്പർ ഫാസ്റ്റ്",
    origin: "Trivandrum (തമ്പാനൂർ)",
    originMl: "തിരുവനന്തപുരം",
    destination: "Palakkad (പാലക്കാട്)",
    destinationMl: "പാലക്കാട്",
    serviceType: "SUPER_FAST",
    serviceName: "Super Fast (#SF-312)",
    serviceNameMl: "സൂപ്പർ ഫാസ്റ്റ്",
    vehicleNo: "KL 15 6780",
    chassisType: "Ashok Leyland 210WB",
    depotOrigin: "Thampanoor Central Depot",
    depotDestination: "Palakkad KSRTC Stand",
    overallConfidence: 97.2,
    status: "VERIFIED",
    totalDistanceKm: 342,
    estimatedDuration: "7h 30m",
    fareInr: 360,
    sourceFile: "TRV_PGT_SUPERFAST_ROSTER.PDF",
    sourceType: "printed_press",
    language: "Bilingual",
    viaSummary: "Via Kollam, Alappuzha, Ernakulam, Thrissur & Alathur",
    viaSummaryMl: "കൊല്ലം, ആലപ്പുഴ, എറണാകുളം, തൃശ്ശൂർ, ആലത്തൂർ വഴി",
    createdAt: "2026-09-17T06:45:00Z",
    publishedAt: "2026-09-17T08:00:00Z",
    verifiedBy: "Inspector K. Unnithan",
    discrepancies: [],
    stops: [
      { id: "pgt-1", seq: 1, name: "Thiruvananthapuram Central", nameMl: "തിരുവനന്തപുരം സെൻട്രൽ", code: "TRV-01", arrival: "—", departure: "06:45 AM", confidence: 99, status: "verified", coordinates: KERALA_COORDINATES["Trivandrum"] },
      { id: "pgt-2", seq: 2, name: "Kollam Bus Station", nameMl: "കൊല്ലം", code: "QLN-02", arrival: "08:05 AM", departure: "08:10 AM", confidence: 97, status: "verified", coordinates: KERALA_COORDINATES["Kollam"] },
      { id: "pgt-3", seq: 3, name: "Alappuzha KSRTC Stand", nameMl: "ആലപ്പുഴ", code: "ALP-03", arrival: "09:35 AM", departure: "09:40 AM", confidence: 96, status: "verified", coordinates: KERALA_COORDINATES["Alappuzha"] },
      { id: "pgt-4", seq: 4, name: "Ernakulam Central Depot", nameMl: "എറണാകുളം", code: "ERS-04", arrival: "11:15 AM", departure: "11:25 AM", confidence: 98, status: "verified", coordinates: KERALA_COORDINATES["Ernakulam"] },
      { id: "pgt-5", seq: 5, name: "Thrissur Sakthan Thampuran", nameMl: "തൃശ്ശൂർ", code: "TCR-05", arrival: "01:05 PM", departure: "01:15 PM", confidence: 97, status: "verified", coordinates: KERALA_COORDINATES["Thrissur"] },
      { id: "pgt-6", seq: 6, name: "Alathur", nameMl: "ആലത്തൂർ", code: "ALT-06", arrival: "01:55 PM", departure: "02:00 PM", confidence: 96, status: "verified", coordinates: KERALA_COORDINATES["Alathur"] },
      { id: "pgt-7", seq: 7, name: "Palakkad", nameMl: "പാലക്കാട്", code: "PGT-07", arrival: "02:15 PM", departure: "—", confidence: 99, status: "verified", coordinates: KERALA_COORDINATES["Palakkad"] },
    ],
  },
  {
    id: "KL-15-CAN-TRV-MN03",
    tripId: "KL-RTC-MN-1930",
    routeCode: "CAN-TRV-MN",
    title: "Kannur → Trivandrum Minnal Deluxe",
    titleMl: "കണ്ണൂർ → തിരുവനന്തപുരം മിന്നൽ ഡീലക്സ്",
    origin: "Kannur (കണ്ണൂർ)",
    originMl: "കണ്ണൂർ",
    destination: "Trivandrum (തമ്പാനൂർ)",
    destinationMl: "തിരുവനന്തപുരം",
    serviceType: "MINNAL",
    serviceName: "Minnal Deluxe (#MN-03 Southbound)",
    serviceNameMl: "മിന്നൽ ഡീലക്സ് (സൗത്ത് ബൗണ്ട്)",
    vehicleNo: "KL 15 9403",
    chassisType: "Leyland Viking Air-Suspension",
    depotOrigin: "Kannur Central",
    depotDestination: "Thampanoor Central Depot",
    overallConfidence: 98.6,
    status: "VERIFIED",
    totalDistanceKm: 478,
    estimatedDuration: "7h 15m",
    fareInr: 540,
    sourceFile: "MINNAL_SOUTH_CAN_TRV.TIFF",
    sourceType: "printed_press",
    language: "Bilingual",
    viaSummary: "Non-stop Highway Corridor via Kozhikode, Thrissur, Vyttila & Kollam",
    viaSummaryMl: "കോഴിക്കോട്, തൃശ്ശൂർ, വൈറ്റില ഹബ്ബ്, കൊല്ലം വഴി",
    createdAt: "2026-09-17T17:00:00Z",
    publishedAt: "2026-09-17T19:00:00Z",
    verifiedBy: "Inspector R. Kurup",
    discrepancies: [],
    stops: [
      { id: "can-trv-1", seq: 1, name: "Kannur Central", nameMl: "കണ്ണൂർ", code: "CAN-01", arrival: "—", departure: "07:30 PM", confidence: 99, status: "verified", coordinates: KERALA_COORDINATES["Kannur"] },
      { id: "can-trv-2", seq: 2, name: "Kozhikode Calicut", nameMl: "കോഴിക്കോട്", code: "CLT-02", arrival: "08:35 PM", departure: "08:40 PM", confidence: 98, status: "verified", coordinates: KERALA_COORDINATES["Kozhikode"] },
      { id: "can-trv-3", seq: 3, name: "Thrissur Sakthan Thampuran", nameMl: "തൃശ്ശൂർ", code: "TCR-03", arrival: "10:45 PM", departure: "10:50 PM", confidence: 98, status: "verified", coordinates: KERALA_COORDINATES["Thrissur"] },
      { id: "can-trv-4", seq: 4, name: "Vyttila Hub", nameMl: "വൈറ്റില ഹബ്ബ്", code: "ERS-04", arrival: "12:15 AM", departure: "12:20 AM", confidence: 98, status: "verified", coordinates: KERALA_COORDINATES["Vyttila Hub"] },
      { id: "can-trv-5", seq: 5, name: "Alappuzha KSRTC Stand", nameMl: "ആലപ്പുഴ", code: "ALP-05", arrival: "01:25 AM", departure: "01:30 AM", confidence: 97, status: "verified", coordinates: KERALA_COORDINATES["Alappuzha"] },
      { id: "can-trv-6", seq: 6, name: "Kollam Bus Station", nameMl: "കൊല്ലം", code: "QLN-06", arrival: "02:30 AM", departure: "02:35 AM", confidence: 98, status: "verified", coordinates: KERALA_COORDINATES["Kollam"] },
      { id: "can-trv-7", seq: 7, name: "Thiruvananthapuram Central", nameMl: "തിരുവനന്തപുരം", code: "TRV-07", arrival: "03:45 AM", departure: "—", confidence: 99, status: "verified", coordinates: KERALA_COORDINATES["Trivandrum"] },
    ],
  },
  {
    id: "KL-15-ERS-TCR-SHUTTLE",
    tripId: "KL-RTC-ERS-1730",
    routeCode: "ERS-TCR-SH",
    title: "Ernakulam → Thrissur City Shuttle",
    titleMl: "എറണാകുളം → തൃശ്ശൂർ സിറ്റി ഷട്ടിൽ",
    origin: "Ernakulam (എറണാകുളം)",
    originMl: "എറണാകുളം",
    destination: "Thrissur (തൃശ്ശൂർ)",
    destinationMl: "തൃശ്ശൂർ",
    serviceType: "FAST_PASSENGER",
    serviceName: "Fast Passenger (#FP-45)",
    serviceNameMl: "ഫാസ്റ്റ് പാസഞ്ചർ",
    vehicleNo: "KL 15 3120",
    chassisType: "Ashok Leyland 12M",
    depotOrigin: "Ernakulam Central Depot",
    depotDestination: "Thrissur Sakthan Depot",
    overallConfidence: 98.9,
    status: "VERIFIED",
    totalDistanceKm: 76,
    estimatedDuration: "1h 45m",
    fareInr: 85,
    sourceFile: "ERS_TCR_COMMUTER_ROSTER.PDF",
    sourceType: "printed_press",
    language: "Bilingual",
    viaSummary: "Via Aluva, Angamaly & Chalakudy",
    viaSummaryMl: "ആലുവ, അങ്കമാലി, ചാലക്കുടി വഴി",
    createdAt: "2026-09-17T16:00:00Z",
    publishedAt: "2026-09-17T16:30:00Z",
    verifiedBy: "Inspector G. Menon",
    discrepancies: [],
    stops: [
      { id: "ers-1", seq: 1, name: "Ernakulam Central Depot", nameMl: "എറണാകുളം സെൻട്രൽ", code: "ERS-01", arrival: "—", departure: "05:30 PM", confidence: 99, status: "verified", coordinates: KERALA_COORDINATES["Ernakulam"] },
      { id: "ers-2", seq: 2, name: "Aluva", nameMl: "ആലുവ", code: "ALV-02", arrival: "06:00 PM", departure: "06:05 PM", confidence: 99, status: "verified", coordinates: KERALA_COORDINATES["Aluva"] },
      { id: "ers-3", seq: 3, name: "Angamaly", nameMl: "അങ്കമാലി", code: "ANG-03", arrival: "06:20 PM", departure: "06:25 PM", confidence: 99, status: "verified", coordinates: KERALA_COORDINATES["Angamaly"] },
      { id: "ers-4", seq: 4, name: "Chalakudy", nameMl: "ചാലക്കുടി", code: "CKY-04", arrival: "06:45 PM", departure: "06:50 PM", confidence: 99, status: "verified", coordinates: KERALA_COORDINATES["Chalakudy"] },
      { id: "ers-5", seq: 5, name: "Thrissur Sakthan Stand", nameMl: "തൃശ്ശൂർ ശക്തൻ സ്റ്റാൻഡ്", code: "TCR-05", arrival: "07:15 PM", departure: "—", confidence: 99, status: "verified", coordinates: KERALA_COORDINATES["Thrissur"] },
    ],
  },
];

class TimetableStore {
  private timetables: TimetableRecord[] = [];
  private activeId: string = "KL-15-TRV-CAN-0824";
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("anavandi_timetables");
        if (saved) {
          const loaded: TimetableRecord[] = JSON.parse(saved);
          const existingIds = new Set(loaded.map((t) => t.id));
          const missingSeeds = SEED_TIMETABLES.filter((s) => !existingIds.has(s.id));
          this.timetables = [...loaded, ...missingSeeds];
        } else {
          this.timetables = [...SEED_TIMETABLES];
          this.saveToStorage();
        }
        const active = localStorage.getItem("anavandi_active_id");
        if (active) this.activeId = active;
      } catch (err) {
        console.error("Failed to load store:", err);
        this.timetables = [...SEED_TIMETABLES];
      }
    } else {
      this.timetables = [...SEED_TIMETABLES];
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("anavandi_timetables", JSON.stringify(this.timetables));
        localStorage.setItem("anavandi_active_id", this.activeId);
      } catch (err) {
        console.error("Failed to save store:", err);
      }
    }
    this.notify();
  }

  public subscribe(fn: () => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getAll(): TimetableRecord[] {
    return [...this.timetables];
  }

  public getById(id: string): TimetableRecord | undefined {
    return this.timetables.find((t) => t.id === id);
  }

  public getActive(): TimetableRecord {
    const found = this.getById(this.activeId);
    return found || this.timetables[0] || SEED_TIMETABLES[0];
  }

  public setActiveId(id: string) {
    this.activeId = id;
    this.saveToStorage();
  }

  public addTimetable(record: TimetableRecord) {
    this.timetables.unshift(record);
    this.activeId = record.id;
    this.saveToStorage();
  }

  public updateTimetable(id: string, partial: Partial<TimetableRecord>) {
    const index = this.timetables.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.timetables[index] = { ...this.timetables[index], ...partial };
      this.saveToStorage();
    }
  }

  public updateStop(timetableId: string, stopIndex: number, stopData: Partial<StopItem>) {
    const timetable = this.getById(timetableId);
    if (!timetable || !timetable.stops[stopIndex]) return;

    timetable.stops[stopIndex] = {
      ...timetable.stops[stopIndex],
      ...stopData,
      status: "corrected",
      confidence: 100,
    };

    // If an anomaly was resolved, check discrepancies
    const disc = timetable.discrepancies.find((d) => d.stopIndex === stopIndex);
    if (disc) {
      disc.selectedResolution = "custom_corrected";
      timetable.stops[stopIndex].isAnomaly = false;
    }

    this.saveToStorage();
  }

  public resolveDiscrepancy(
    timetableId: string,
    stopIndex: number,
    resolution: "use_handwritten" | "accept_printed" | "flagged",
    newValue: string
  ) {
    const timetable = this.getById(timetableId);
    if (!timetable || !timetable.stops[stopIndex]) return;

    const stop = timetable.stops[stopIndex];
    if (resolution === "use_handwritten") {
      stop.departure = newValue;
      stop.confidence = 98.5;
      stop.status = "verified";
      stop.isAnomaly = false;
    } else if (resolution === "accept_printed") {
      stop.departure = newValue;
      stop.confidence = 90.0;
      stop.status = "verified";
      stop.isAnomaly = false;
    } else if (resolution === "flagged") {
      stop.status = "needs_review";
      stop.isAnomaly = true;
    }

    const disc = timetable.discrepancies.find((d) => d.stopIndex === stopIndex);
    if (disc) {
      disc.selectedResolution = resolution;
    }

    // Recalculate overall confidence
    const sum = timetable.stops.reduce((acc, s) => acc + s.confidence, 0);
    timetable.overallConfidence = Number((sum / timetable.stops.length).toFixed(1));

    this.saveToStorage();
  }

  public addStop(timetableId: string, stop: Omit<StopItem, "id" | "seq">) {
    const timetable = this.getById(timetableId);
    if (!timetable) return;

    const newStop: StopItem = {
      ...stop,
      id: `stop-${Date.now()}`,
      seq: timetable.stops.length + 1,
      confidence: 100,
      status: "verified",
    };

    timetable.stops.push(newStop);
    this.saveToStorage();
  }

  public removeStop(timetableId: string, stopIndex: number) {
    const timetable = this.getById(timetableId);
    if (!timetable) return;

    timetable.stops.splice(stopIndex, 1);
    timetable.stops.forEach((s, i) => (s.seq = i + 1));
    this.saveToStorage();
  }

  public verifyAndPublish(timetableId: string, verifiedBy: string = "Depot Officer V. Nair") {
    const timetable = this.getById(timetableId);
    if (!timetable) return;

    timetable.status = "VERIFIED";
    timetable.verifiedBy = verifiedBy;
    timetable.publishedAt = new Date().toISOString();
    timetable.stops.forEach((s) => {
      if (s.status === "needs_review") s.status = "verified";
      s.isAnomaly = false;
    });

    this.saveToStorage();
  }

  public getPendingCount(): number {
    return this.timetables.filter((t) => t.status === "PENDING_VERIFICATION" || t.status === "DRAFT").length;
  }

  public getStats() {
    const totalDigitized = this.timetables.length;
    const pendingVerification = this.timetables.filter((t) => t.status === "PENDING_VERIFICATION" || t.status === "DRAFT").length;
    const routesProcessed = new Set(this.timetables.map(t => t.routeCode)).size;
    const avgConfidence = this.timetables.length > 0 
      ? Number((this.timetables.reduce((acc, t) => acc + t.overallConfidence, 0) / this.timetables.length).toFixed(1))
      : 0;

    return {
      totalDigitized,
      pendingVerification,
      routesProcessed,
      avgConfidence,
    };
  }

  public resetToSeeds() {
    this.timetables = [...SEED_TIMETABLES];
    this.activeId = "KL-15-TRV-CAN-0824";
    this.saveToStorage();
  }
}

export const timetableStore = new TimetableStore();
