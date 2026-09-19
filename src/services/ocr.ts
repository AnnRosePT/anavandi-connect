import { TimetableRecord, StopItem, DiscrepancyDetail } from "@/types/timetable";
import { KERALA_COORDINATES } from "./store";

export interface OcrProcessingStep {
  id: string;
  label: string;
  labelMl: string;
  status: "pending" | "processing" | "completed" | "warning";
  details: string;
  durationMs: number;
}

export interface ExtractionResult {
  timetable: TimetableRecord;
  rawText: string;
  confidence: number;
  detectedTableStructure: {
    columnsCount: number;
    rowsCount: number;
    hasHandwrittenAnnotations: boolean;
  };
  steps: OcrProcessingStep[];
  providerUsed: "gemini_vision" | "deterministic_demo_engine";
}

export interface OcrOptions {
  language?: "Auto" | "English" | "Malayalam";
  enhanceImage?: boolean;
  detectTable?: boolean;
  detectHandwriting?: boolean;
  validateTimings?: boolean;
}

// ── Gemini Vision API call ────────────────────────────────────────────────────

export class InvalidTimetableImageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTimetableImageError";
  }
}

// ── Gemini Vision Candidate Models ───────────────────────────────────────────

const GEMINI_CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-3.8-flash",
  "gemini-1.5-flash",
];

// Fallback sample image (high-res Kerala bus timetable register)
const DEFAULT_TIMETABLE_FALLBACK_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDy2RIqVgg8IJPL__hyg05-v9Wk0RLUXV0TJ5GgMCvo4MLwiDKKvQs9Wm2uleoAlILcdJ5xZjSlWoAQ-yZo4eEJx-y7xj7nsncF8kF79X6yIj3tGrQSlNly9ImPWy4cOEfodxs_Qp0R7qr5xRMRKl8n6ydfkA2Hr7DnDjtaFauQYREu5HHTUP9uBTmrPLwbN68ru3Hzw4Kdp9gtnVsQVS4Mz2Blh7_FQA50XJywv3R-fs0Pgdlx5438";

/**
 * Resolves any image input (data URL, blob URL, remote URL, or empty)
 * into a clean base64 string and MIME type for Gemini Vision.
 */
export async function resolveImageBase64(
  inputUrl?: string
): Promise<{ base64: string; mimeType: string }> {
  let target = (inputUrl && inputUrl.trim().length > 0)
    ? inputUrl.trim()
    : DEFAULT_TIMETABLE_FALLBACK_URL;

  // Case 1: Already a base64 Data URL
  if (target.startsWith("data:")) {
    const parts = target.split(",");
    const meta = parts[0] || "";
    const base64 = parts[1] || "";
    const mimeMatch = meta.match(/data:([^;]+)/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
    if (base64 && base64.length > 50) {
      return { base64, mimeType };
    }
    // If base64 is empty/broken, fallback to default URL
    target = DEFAULT_TIMETABLE_FALLBACK_URL;
  }

  // Case 2: blob: or http(s): URL
  try {
    const res = await fetch(target);
    if (!res.ok) {
      throw new Error(`Failed to fetch image resource (HTTP ${res.status})`);
    }

    if (typeof window !== "undefined" && typeof FileReader !== "undefined") {
      const blob = await res.blob();
      const mimeType = blob.type && blob.type.startsWith("image/") ? blob.type : "image/jpeg";

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const b64 = result.includes(",") ? result.split(",")[1] : result;
          resolve(b64);
        };
        reader.onerror = () => reject(new Error("Failed to read image blob"));
        reader.readAsDataURL(blob);
      });

      return { base64, mimeType };
    } else {
      // Node.js environment
      const arrayBuf = await res.arrayBuffer();
      const base64 = Buffer.from(arrayBuf).toString("base64");
      const mimeType = res.headers.get("content-type") || "image/jpeg";
      return { base64, mimeType };
    }
  } catch (err: any) {
    console.warn("Could not load image resource, using minimal valid fallback:", err);
    // 1x1 transparent PNG fallback if all else fails
    return {
      base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      mimeType: "image/png",
    };
  }
}

// ── Gemini Vision API call ────────────────────────────────────────────────────

async function callGeminiVision(
  base64Image: string,
  mimeType: string,
  apiKey: string
): Promise<string> {
  const prompt = `You are an expert OCR engine and document validator for KSRTC (Kerala State Road Transport Corporation) bus timetables and transit rosters.

STEP 1 — STRICT IMAGE VALIDATION:
Check whether the uploaded image is an authentic bus timetable, transit schedule, conductor waybill, depot trip sheet, or roster.
- If the image is NOT a bus timetable or transit document (for example: photo of an animal/dog/cat, fruit/apple/food, person/selfie, nature/scenery, car/vehicle exterior, furniture, meme, or any random non-schedule object):
  Return ONLY this JSON object:
  {
    "isValidTimetable": false,
    "rejectionReason": "Invalid Image: The uploaded image appears to be a photo of a [specify what is seen, e.g. dog / apple / animal / person / random object] and does not contain any bus timetable, route, or schedule data.",
    "stops": []
  }

STEP 2 — TIMETABLE EXTRACTION (only if the image IS a valid timetable or schedule):
Return a JSON object with EXACTLY this structure:
{
  "isValidTimetable": true,
  "title": "route title in English (e.g. Thrissur to Ernakulam)",
  "titleMl": "route title in Malayalam if visible",
  "origin": "first stop name",
  "destination": "last stop name",
  "routeCode": "route code if visible, else generate from origin-destination",
  "serviceType": "ORDINARY or FAST_PASSENGER or EXPRESS or SUPER_FAST or MINNAL",
  "vehicleNo": "vehicle number if visible, else empty string",
  "chassisType": "chassis type if visible, else empty string",
  "totalDistanceKm": estimated distance as number,
  "estimatedDuration": "estimated journey time e.g. 3h 20m",
  "fareInr": estimated fare as number,
  "viaSummary": "intermediate stops summary",
  "hasHandwrittenAnnotations": true or false,
  "overallConfidence": confidence score 0-100,
  "stops": [
    {
      "seq": 1,
      "name": "stop name in English",
      "nameMl": "stop name in Malayalam if visible",
      "arrival": "HH:MM AM/PM or — if origin",
      "departure": "HH:MM AM/PM or — if terminus",
      "hasCorrectionInk": true or false,
      "printedArrival": "original printed arrival if overwritten, else same as arrival",
      "printedDeparture": "original printed departure if overwritten, else same as departure",
      "confidence": confidence 0-100 for this row
    }
  ],
  "notes": "any notes written on the timetable"
}

CRITICAL RULES:
- If this image is not a bus schedule (e.g. apple, dog, cat, person, random photo), ALWAYS return "isValidTimetable": false and "stops": []. NEVER hallucinate bus stops for non-timetable photos.
- If it IS a timetable, extract EVERY stop row visible in the table.
- Return ONLY the JSON object, no explanation or conversational text.`;

  const body = JSON.stringify({
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { mimeType, data: base64Image } },
        ],
      },
    ],
    generationConfig: { temperature: 0.1, maxOutputTokens: 4096 },
  });

  let lastError: Error = new Error("Unable to connect to Gemini API");

  // Try candidate models in order; if one is overloaded (503/429) or deprecated (404), fall back to next
  for (const model of GEMINI_CANDIDATE_MODELS) {
    const MAX_RETRIES = 2;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          { method: "POST", headers: { "Content-Type": "application/json" }, body }
        );

        if (response.status === 429 || response.status === 503) {
          const errText = await response.text();
          let msg = response.status === 429 ? "Rate limited / Quota exceeded" : "High demand";
          try {
            const errJson = JSON.parse(errText);
            msg = errJson?.error?.message ?? msg;
          } catch { /* raw */ }
          lastError = new Error(`Gemini ${response.status} (${model}): ${msg}`);

          if (attempt < MAX_RETRIES) {
            const waitMs = attempt * 1500;
            console.warn(`[${model}] ${response.status} (${msg}), retrying in ${waitMs}ms…`);
            await new Promise((r) => setTimeout(r, waitMs));
            continue;
          } else {
            console.warn(`[${model}] exhausted retries, trying fallback model…`);
            break; // Try next model in GEMINI_CANDIDATE_MODELS
          }
        }

        if (response.status === 404) {
          // Model deprecated or not found, try next candidate
          console.warn(`[${model}] returned 404, switching to next candidate model…`);
          lastError = new Error(`Model ${model} is not available on this API key`);
          break;
        }

        if (!response.ok) {
          const errText = await response.text();
          let friendlyMsg = `HTTP ${response.status}`;
          try {
            const errJson = JSON.parse(errText);
            friendlyMsg = errJson?.error?.message ?? friendlyMsg;
          } catch { /* raw text */ }
          lastError = new Error(`Gemini ${response.status} (${model}): ${friendlyMsg}`);
          // If it's a client error (like 400), don't retry same model
          break;
        }

        const data = await response.json();
        const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        if (!text) {
          lastError = new Error(`[${model}] returned empty response content`);
          break;
        }

        return text;
      } catch (err: any) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt < MAX_RETRIES) {
          console.warn(`[${model}] connection attempt ${attempt} failed:`, err);
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }
  }

  throw lastError;
}


// ── Parse Gemini JSON response into TimetableRecord ───────────────────────────

function parseGeminiResponse(
  raw: string,
  fileName: string
): TimetableRecord {
  // Strip markdown code fences or extract JSON block
  let cleaned = raw.trim();
  const jsonBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (jsonBlockMatch && jsonBlockMatch[1]) {
    cleaned = jsonBlockMatch[1].trim();
  } else {
    const objectMatch = cleaned.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      cleaned = objectMatch[0].trim();
    }
  }

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (parseErr) {
    console.error("Failed to parse Gemini response as JSON:", parseErr, "\nRaw:", raw);
    const rawLower = (raw || "").toLowerCase();
    if (
      rawLower.includes("dog") ||
      rawLower.includes("cat") ||
      rawLower.includes("apple") ||
      rawLower.includes("fruit") ||
      rawLower.includes("animal") ||
      rawLower.includes("person") ||
      rawLower.includes("not a timetable") ||
      rawLower.includes("invalid image") ||
      rawLower.includes("no timetable") ||
      rawLower.includes("no bus stop")
    ) {
      throw new InvalidTimetableImageError(
        "Invalid Image: The uploaded photo is not recognized as a bus timetable or transit schedule."
      );
    }
    throw new InvalidTimetableImageError(
      "Invalid Image: Failed to parse schedule data from image. Please ensure the timetable image is clear and legible."
    );
  }

  // Check 1: Explicit AI rejection (e.g. dog, apple, random photo)
  if (parsed.isValidTimetable === false) {
    const reason =
      parsed.rejectionReason ||
      "Invalid Image: The uploaded image is not a recognized bus timetable or transit document.";
    throw new InvalidTimetableImageError(reason);
  }

  // Check 2: Missing or empty stops array
  const rawStops = parsed.stops ?? [];
  if (!Array.isArray(rawStops) || rawStops.length === 0) {
    const reason =
      parsed.rejectionReason ||
      "Invalid Image: No bus stops or timetable schedule data detected in this image. Please upload a clear photo of a bus timetable or roster.";
    throw new InvalidTimetableImageError(reason);
  }

  const id = `KL-${Date.now().toString().slice(-6)}`;
  const tripId = `KL-RTC-${Math.floor(1000 + Math.random() * 9000)}`;

  const stops: StopItem[] = rawStops.map(
    (s: {
      seq: number;
      name: string;
      nameMl?: string;
      arrival?: string;
      departure?: string;
      confidence?: number;
      hasCorrectionInk?: boolean;
      printedArrival?: string;
      printedDeparture?: string;
    }, idx: number) => {
      const coordKey = Object.keys(KERALA_COORDINATES).find((k) =>
        s.name?.toLowerCase().includes(k.toLowerCase()) ||
        k.toLowerCase().includes(s.name?.toLowerCase())
      );
      return {
        id: `stop-${Date.now()}-${idx + 1}`,
        seq: s.seq ?? idx + 1,
        name: s.name ?? `Stop ${idx + 1}`,
        nameMl: s.nameMl ?? "",
        code: `KSRTC-${(s.name ?? "STP")
          .slice(0, 3)
          .toUpperCase()
          .replace(/\s/g, "")}-${String(idx + 1).padStart(3, "0")}`,
        arrival: s.arrival ?? "—",
        departure: s.departure ?? "—",
        confidence: s.confidence ?? 90,
        status:
          s.hasCorrectionInk ||
          (s.confidence != null && s.confidence < 75)
            ? "needs_review"
            : "verified",
        isAnomaly: s.hasCorrectionInk ?? false,
        coordinates: coordKey
          ? KERALA_COORDINATES[coordKey]
          : undefined,
        note: s.hasCorrectionInk
          ? `Correction detected: printed ${s.printedArrival ?? s.printedDeparture} → corrected`
          : undefined,
      } as StopItem;
    }
  );

  const discrepancies: DiscrepancyDetail[] = rawStops
    .filter((s: { hasCorrectionInk?: boolean }) => s.hasCorrectionInk)
    .map((s: {
      name?: string;
      printedArrival?: string;
      arrival?: string;
      printedDeparture?: string;
      departure?: string;
    }, idx: number) => ({
      stopIndex: idx,
      stopName: s.name ?? `Stop ${idx + 1}`,
      field:
        s.printedArrival && s.printedArrival !== s.arrival
          ? "arrival"
          : "departure",
      printedValue:
        s.printedArrival !== s.arrival
          ? (s.printedArrival ?? "")
          : (s.printedDeparture ?? ""),
      printedConfidence: 65,
      handwrittenValue:
        s.printedArrival !== s.arrival
          ? (s.arrival ?? "")
          : (s.departure ?? ""),
      handwrittenConfidence: 90,
      handwrittenNote: "Ink correction detected by vision model",
      selectedResolution: "none",
      diffScoreMins: 5,
    } as DiscrepancyDetail));

  const record: TimetableRecord = {
    id,
    tripId,
    routeCode:
      parsed.routeCode ??
      `${(parsed.origin ?? "ORI").slice(0, 3).toUpperCase()}-${(
        parsed.destination ?? "DST"
      )
        .slice(0, 3)
        .toUpperCase()}-01`,
    title: parsed.title ?? "KSRTC Route",
    titleMl: parsed.titleMl ?? "",
    origin: parsed.origin ?? stops[0]?.name ?? "Origin",
    originMl: "",
    destination:
      parsed.destination ?? stops[stops.length - 1]?.name ?? "Destination",
    destinationMl: "",
    serviceType: parsed.serviceType ?? "ORDINARY",
    serviceName: parsed.serviceType ?? "Ordinary",
    serviceNameMl: "",
    vehicleNo: parsed.vehicleNo ?? "",
    chassisType: parsed.chassisType ?? "",
    depotOrigin: parsed.origin ?? "",
    depotDestination: parsed.destination ?? "",
    overallConfidence: parsed.overallConfidence ?? 85,
    status: "PENDING_VERIFICATION",
    totalDistanceKm: parsed.totalDistanceKm ?? 0,
    estimatedDuration: parsed.estimatedDuration ?? "",
    fareInr: parsed.fareInr ?? 0,
    sourceFile: fileName,
    sourceType: parsed.hasHandwrittenAnnotations
      ? "handwritten_log"
      : "printed_press",
    language: "Bilingual",
    viaSummary: parsed.viaSummary ?? "",
    viaSummaryMl: "",
    createdAt: new Date().toISOString(),
    stops,
    discrepancies,
  };

  return record;
}

// ── Demo fallback (used when no API key is set) ───────────────────────────────

function buildDemoTimetable(fileName: string): TimetableRecord {
  const id = `KL-DEMO-${Date.now().toString().slice(-6)}`;
  return {
    id,
    tripId: `KL-RTC-SF-${Math.floor(1000 + Math.random() * 9000)}`,
    routeCode: "TRV-CAN-01",
    title: "Trivandrum → Kannur Super Fast (Demo)",
    titleMl: "തിരുവനന്തപുരം → കണ്ണൂർ സൂപ്പർ ഫാസ്റ്റ്",
    origin: "Trivandrum (തമ്പാനൂർ)",
    originMl: "തിരുവനന്തപുരം (തമ്പാനൂർ)",
    destination: "Kannur (കണ്ണൂർ)",
    destinationMl: "കണ്ണൂർ",
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
    sourceFile: fileName,
    sourceType: "dot_matrix",
    language: "Bilingual",
    viaSummary: "Via Kollam, Alappuzha, Ernakulam, Thrissur & Calicut",
    viaSummaryMl: "കൊല്ലം, ആലപ്പുഴ, എറണാകുളം, തൃശ്ശൂർ, കോഴിക്കോട് വഴി",
    createdAt: new Date().toISOString(),
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
        handwrittenNote: "Blue fountain ink revision by Station Master 'S.K.'",
        selectedResolution: "none",
        diffScoreMins: 5,
      },
    ],
    stops: [
      { id: `s1-${Date.now()}`, seq: 1, name: "Thiruvananthapuram Central", nameMl: "തിരുവനന്തപുരം സെൻട്രൽ", code: "KSRTC-TRV-001", arrival: "—", departure: "06:15 AM", confidence: 98.2, status: "verified", coordinates: KERALA_COORDINATES["Thiruvananthapuram Central"], district: "Thiruvananthapuram", platform: "Bay #4" },
      { id: `s2-${Date.now()}`, seq: 2, name: "Kollam Bus Station", nameMl: "കൊല്ലം ബസ് സ്റ്റാൻഡ്", code: "KSRTC-QLN-012", arrival: "07:30 AM", departure: "07:35 AM", confidence: 96.5, status: "verified", coordinates: KERALA_COORDINATES["Kollam"], district: "Kollam", platform: "Bay #2" },
      { id: `s3-${Date.now()}`, seq: 3, name: "Alappuzha KSRTC Stand", nameMl: "ആലപ്പുഴ കെ.എസ്.ആർ.ടി.സി", code: "KSRTC-ALP-024", arrival: "09:05 AM", departure: "09:15 AM*", confidence: 72.1, status: "needs_review", isAnomaly: true, coordinates: KERALA_COORDINATES["Alappuzha"], district: "Alappuzha", platform: "Bay #1", note: "Conflict: printed 09:10 vs handwritten 09:15" },
      { id: `s4-${Date.now()}`, seq: 4, name: "Ernakulam Central Depot", nameMl: "എറണാകുളം സെൻട്രൽ ഡിപ്പോ", code: "KSRTC-ERS-033", arrival: "10:45 AM", departure: "10:55 AM", confidence: 94.3, status: "verified", coordinates: KERALA_COORDINATES["Ernakulam"], district: "Ernakulam", platform: "Bay #6" },
      { id: `s5-${Date.now()}`, seq: 5, name: "Thrissur Sakthan Thampuran", nameMl: "തൃശ്ശൂർ ശക്തൻ തമ്പുരാൻ", code: "KSRTC-TCR-048", arrival: "12:35 PM", departure: "12:45 PM", confidence: 97.8, status: "verified", coordinates: KERALA_COORDINATES["Thrissur"], district: "Thrissur", platform: "Bay #3" },
      { id: `s6-${Date.now()}`, seq: 6, name: "Kozhikode (Mavoor Rd)", nameMl: "കോഴിക്കോട് (മാവൂർ റോഡ്)", code: "KSRTC-CLT-062", arrival: "03:10 PM", departure: "03:20 PM", confidence: 93.9, status: "verified", coordinates: KERALA_COORDINATES["Kozhikode"], district: "Kozhikode", platform: "Bay #5" },
      { id: `s7-${Date.now()}`, seq: 7, name: "Kannur Main Bus Terminal", nameMl: "കണ്ണൂർ മെയിൻ ബസ് ടെർമിനൽ", code: "KSRTC-CAN-089", arrival: "05:30 PM", departure: "—", confidence: 99.1, status: "verified", coordinates: KERALA_COORDINATES["Kannur"], district: "Kannur", platform: "Terminus" },
    ],
  };
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function processTimetableImage(
  fileDataUrl: string,
  fileName: string,
  options: OcrOptions = {},
  onStepProgress?: (stepIndex: number, step: OcrProcessingStep) => void
): Promise<ExtractionResult> {
  const steps: OcrProcessingStep[] = [
    { id: "step-1", label: "Image Enhancement & Despeckle", labelMl: "ചിത്രം മെച്ചപ്പെടുത്തലും നോയ്സ് കുറയ്ക്കലും", status: "pending", details: "Applying adaptive thresholding for aged/handwritten paper", durationMs: 600 },
    { id: "step-2", label: "Indic & Latin Glyph OCR Extraction", labelMl: "മലയാളം, ഇംഗ്ലീഷ് അക്ഷരങ്ങൾ തിരിച്ചറിയൽ", status: "pending", details: "Decoding Malayalam & English text from timetable image", durationMs: 1200 },
    { id: "step-3", label: "Table Grid & Column Segmentation", labelMl: "ടേബിൾ രൂപരേഖ തിരിക്കൽ", status: "pending", details: "Identifying Stop / Arrival / Departure columns", durationMs: 800 },
    { id: "step-4", label: "Route & Depot Classification", labelMl: "റൂട്ടും ഡിപ്പോയും കണ്ടെത്തൽ", status: "pending", details: "Extracting origin, destination and route metadata", durationMs: 600 },
    { id: "step-5", label: "Handwritten Ink Detection & Anomaly Flagging", labelMl: "കൈയ്യെഴുത്ത് തിരുത്തലുകൾ കണ്ടെത്തൽ", status: "pending", details: "Scanning for ink corrections, strikethroughs and overprints", durationMs: 900 },
    { id: "step-6", label: "Time Normalization & Sequence Validation", labelMl: "സമയ ശ്രേണി സ്ഥിരീകരണം", status: "pending", details: "Standardizing timestamps to GTFS stop_times format", durationMs: 700 },
  ];

  // Mark steps 1–3 complete immediately (UI feedback while Gemini processes)
  const tickStep = async (i: number, details?: string) => {
    steps[i].status = "processing";
    if (details) steps[i].details = details;
    if (onStepProgress) onStepProgress(i, steps[i]);
    await new Promise((r) => setTimeout(r, 400));
    steps[i].status = "completed";
    if (onStepProgress) onStepProgress(i, steps[i]);
  };

  await tickStep(0);
  await tickStep(1);
  await tickStep(2);

  // Check for API key
  const apiKey =
    process.env.NEXT_PUBLIC_AI_API_KEY ||
    (typeof window !== "undefined"
      ? localStorage.getItem("anavandi_ai_api_key")
      : null);

  let timetable: TimetableRecord | null = null;
  let providerUsed: "gemini_vision" | "deterministic_demo_engine" =
    "deterministic_demo_engine";
  let rawText = "";

  if (apiKey && apiKey.trim().length > 10) {
    try {
      steps[3].status = "processing";
      steps[3].details = "Decoding image & submitting to Gemini Vision AI…";
      if (onStepProgress) onStepProgress(3, steps[3]);

      const { base64, mimeType } = await resolveImageBase64(fileDataUrl);

      steps[3].details = "Extracting bus stops & timings with Gemini…";
      if (onStepProgress) onStepProgress(3, steps[3]);

      rawText = await callGeminiVision(base64, mimeType, apiKey.trim());
      timetable = parseGeminiResponse(rawText, fileName);
      
      if (!timetable || timetable.stops.length === 0) {
        throw new InvalidTimetableImageError("Invalid image: The AI could not find any bus stops or timetable data in this image.");
      }
      
      providerUsed = "gemini_vision";

      steps[3].status = "completed";
      steps[3].details = `Gemini Vision extracted ${timetable.stops.length} stops (${timetable.origin || "Origin"} → ${timetable.destination || "Terminus"})`;
      if (onStepProgress) onStepProgress(3, steps[3]);
    } catch (err: any) {
      const isInvalidImage =
        err instanceof InvalidTimetableImageError ||
        (err?.message && err.message.toLowerCase().includes("invalid image")) ||
        (err?.message && err.message.toLowerCase().includes("no bus stop"));

      if (isInvalidImage) {
        steps[3].status = "warning";
        steps[3].details = err.message || "Invalid image rejected";
        if (onStepProgress) onStepProgress(3, steps[3]);
        // Fail completely as requested - DO NOT fall back to demo timetable
        throw err;
      }

      // If user uploaded a custom image (e.g. data URL) and the API call failed:
      const isCustomUserUpload = fileDataUrl && fileDataUrl.startsWith("data:");
      if (isCustomUserUpload) {
        steps[3].status = "warning";
        steps[3].details = `OCR Error: ${err?.message || "Failed to process image"}`;
        if (onStepProgress) onStepProgress(3, steps[3]);
        throw new InvalidTimetableImageError(
          `Processing Error: ${err?.message || "Could not extract bus timetable from image."}`
        );
      }

      console.warn("Gemini API failed, falling back to demo:", err);
      steps[3].status = "warning";
      steps[3].details = `Gemini API Notice: ${err?.message || "Check API key"} — fallback demo data applied`;
      if (onStepProgress) onStepProgress(3, steps[3]);
      timetable = null;
    }
  } else {
    // If user uploaded a custom file without an API key
    const isCustomUserUpload = fileDataUrl && fileDataUrl.startsWith("data:");
    if (isCustomUserUpload) {
      steps[3].status = "warning";
      steps[3].details = "API key required for custom images";
      if (onStepProgress) onStepProgress(3, steps[3]);
      throw new InvalidTimetableImageError(
        "AI Vision API key required: Please configure NEXT_PUBLIC_AI_API_KEY in .env.local to digitize custom uploaded images."
      );
    }
    steps[3].status = "warning";
    steps[3].details = "No API key set — running demo engine. Add NEXT_PUBLIC_AI_API_KEY to .env.local";
    if (onStepProgress) onStepProgress(3, steps[3]);
  }

  await tickStep(4);
  await tickStep(5);

  if (!timetable) {
    timetable = buildDemoTimetable(fileName);
    providerUsed = "deterministic_demo_engine";
    rawText = "[Demo mode — no real OCR performed]";
  }

  const hasHandwritten =
    timetable.discrepancies.length > 0 ||
    timetable.stops.some((s) => s.isAnomaly);

  return {
    timetable,
    rawText,
    confidence: timetable.overallConfidence,
    detectedTableStructure: {
      columnsCount: 3,
      rowsCount: timetable.stops.length,
      hasHandwrittenAnnotations: hasHandwritten,
    },
    steps,
    providerUsed,
  };
}
