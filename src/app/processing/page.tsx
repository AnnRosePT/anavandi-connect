"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { processTimetableImage, OcrProcessingStep, ExtractionResult } from "@/services/ocr";
import { timetableStore } from "@/services/store";
import { RoleGate } from "@/components/auth/RoleGate";

export default function ProcessingPage() {
  const router = useRouter();
  const [steps, setSteps] = useState<OcrProcessingStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [fileName, setFileName] = useState<string>("KSRTC_LOG_1984_OCT_CAN0824.TIFF");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    let unmounted = false;

    let activeFileName = "KSRTC_LOG_1984_OCT_CAN0824.TIFF";
    let activePreviewUrl = "";

    // Load uploaded metadata from storage
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("anavandi_pending_upload");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.fileName) {
            activeFileName = parsed.fileName;
            setFileName(parsed.fileName);
          }
          if (parsed.previewUrl) {
            activePreviewUrl = parsed.previewUrl;
            setPreviewUrl(parsed.previewUrl);
          }
        }
      } catch (err) {
        console.error("Error reading upload state:", err);
      }
    }

    async function runPipeline() {
      try {
        const extraction = await processTimetableImage(
          activePreviewUrl,
          activeFileName,
          {},
          (idx, step) => {
            if (!unmounted) {
              setCurrentStepIndex(idx);
              setSteps((prev) => {
                const copy = [...prev];
                copy[idx] = step;
                return copy;
              });
            }
          }
        );

        if (!unmounted) {
          setResult(extraction);
          // Save extracted timetable to store
          timetableStore.addTimetable(extraction.timetable);
          timetableStore.setActiveId(extraction.timetable.id);
          setIsDone(true);
        }
      } catch (err: any) {
        console.error("Processing pipeline failed:", err);
        if (!unmounted) {
          setIsFailed(true);
          const msg =
            err?.message ||
            "Invalid Image: The uploaded image does not contain any bus timetable, route, or schedule data.";
          setErrorMessage(msg);
          setSteps((prev) => {
            const copy = [...prev];
            const activeIdx = Math.min(currentStepIndex, copy.length - 1);
            if (copy[activeIdx]) {
              copy[activeIdx] = {
                ...copy[activeIdx],
                status: "warning",
                details: msg,
              };
            }
            return copy;
          });
        }
      }
    }

    runPipeline();

    return () => {
      unmounted = true;
    };
  }, []);

  const handleGoToVerification = () => {
    router.push("/verification");
  };

  useEffect(() => {
    if (isDone && result && !isFailed) {
      const timer = setTimeout(() => {
        router.push("/verification");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isDone, result, isFailed, router]);

  return (
    <RoleGate
      requiredRole="official"
      fallbackTitle="AI Timetable Extraction (Prototype)"
      fallbackMessage="This is a prototype module for the hackathon. It demonstrates how paper schedules are ingested and digitized."
    >
      <div className="w-full px-space-md sm:px-space-lg flex flex-col gap-space-lg pb-space-xl max-w-5xl mx-auto">
      {/* Title */}
      <div className="bg-surface-container-low p-space-md rounded-xl border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isFailed ? "bg-red-500" : "bg-secondary animate-ping"
              }`}
            ></span>
            <span
              className={`font-label-md text-label-md uppercase tracking-wider font-bold ${
                isFailed ? "text-red-500" : "text-secondary"
              }`}
            >
              Autonomous Document Intelligence
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold mt-1">
            Processing Timetable Roster
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant font-mono">
            Source File: {fileName}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-surface-container px-space-sm py-1 rounded">
          <span
            className={`font-label-md text-label-md font-bold ${
              isFailed ? "text-red-500" : "text-on-surface"
            }`}
          >
            {isFailed
              ? "Extraction Rejected"
              : isDone
              ? "Extraction Complete"
              : `Step ${currentStepIndex + 1} of 6`}
          </span>
        </div>
      </div>

      {/* Main Processing Card */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-lg border border-surface-container flex flex-col gap-space-lg">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-md text-label-md uppercase font-bold text-on-surface">
              Pipeline Stage:{" "}
              <span className={isFailed ? "text-red-500 font-bold" : "text-primary"}>
                {isFailed
                  ? "Rejected: Invalid Timetable Image"
                  : isDone
                  ? "Validated GTFS Ready"
                  : steps[currentStepIndex]?.label || "Initializing"}
              </span>
            </span>
            <span
              className={`font-headline-sm text-headline-sm font-bold ${
                isFailed ? "text-red-500" : "text-primary"
              }`}
            >
              {isFailed
                ? "Failed"
                : isDone
                ? "100%"
                : `${Math.round(((currentStepIndex + 1) / 6) * 100)}%`}
            </span>
          </div>

          <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden border border-surface-container-high">
            <div
              className={`h-full transition-all duration-300 ${
                isFailed
                  ? "bg-red-500"
                  : "bg-gradient-to-r from-primary via-secondary to-primary"
              }`}
              style={{
                width: isFailed
                  ? "100%"
                  : isDone
                  ? "100%"
                  : `${((currentStepIndex + 1) / 6) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Step-by-Step Telemetry List */}
        <div className="space-y-space-sm">
          {steps.map((step, idx) => {
            const isWarning = step.status === "warning";
            const isFinished = step.status === "completed";
            const isCurrent = currentStepIndex === idx && !isDone && !isFailed;

            return (
              <div
                key={step.id}
                className={`p-space-sm rounded-lg flex items-center justify-between transition-all border ${
                  isWarning
                    ? "bg-red-950/20 border-red-500/60 text-on-surface"
                    : isFinished
                    ? "bg-surface-container-low border-surface-container text-on-surface"
                    : isCurrent
                    ? "bg-secondary-container/20 border-secondary text-on-surface shadow-sm"
                    : "bg-surface-container-lowest border-surface-container/40 text-on-surface-variant opacity-60"
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  {isWarning ? (
                    <div className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-sm">priority_high</span>
                    </div>
                  ) : isFinished ? (
                    <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-sm">check</span>
                    </div>
                  ) : isCurrent ? (
                    <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold animate-spin">
                      <span className="material-symbols-outlined text-sm">autorenew</span>
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center text-xs font-bold font-label-md">
                      {idx + 1}
                    </div>
                  )}

                  <div>
                    <div className="font-bold text-sm text-on-surface font-title-md">
                      {step.label}
                    </div>
                    <div
                      className={`text-xs ${
                        isWarning ? "text-red-400 font-medium" : "text-on-surface-variant"
                      }`}
                    >
                      {step.details}
                    </div>
                  </div>
                </div>

                <div className="text-right font-label-md text-xs font-bold">
                  {isWarning ? (
                    <span className="text-red-500 font-bold">REJECTED</span>
                  ) : isFinished ? (
                    <span className="text-primary font-bold">COMPLETE</span>
                  ) : isCurrent ? (
                    <span className="text-secondary animate-pulse">PROCESSING...</span>
                  ) : (
                    <span className="text-on-surface-variant">QUEUED</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Error / Invalid Image Block */}
        {isFailed && (
          <div className="p-space-md sm:p-space-lg rounded-xl bg-red-950/25 border-2 border-red-500 shadow-xl animate-in fade-in flex flex-col gap-space-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md">
              <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-500 border border-red-500/40 flex items-center justify-center shrink-0 shadow-md">
                <span className="material-symbols-outlined text-3xl">cancel</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-extrabold uppercase tracking-wider bg-red-600 text-white font-label-md shadow-sm">
                    Invalid Image
                  </span>
                  <span className="text-xs text-red-400 font-mono font-bold">
                    Schedule Extraction Aborted
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-extrabold text-on-surface mt-1.5">
                  Not a Valid Bus Timetable
                </h3>
                <p className="font-body-md text-body-md text-red-300 mt-1 font-semibold">
                  {errorMessage ||
                    "The uploaded image does not contain any bus stops, schedule timings, or transit roster data."}
                </p>
              </div>
            </div>

            {/* Diagnostic Context */}
            <div className="p-space-sm sm:p-space-md rounded-lg bg-surface-container-lowest/80 border border-red-500/30 text-xs text-on-surface-variant space-y-1">
              <div className="font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-red-400">info</span>
                <span>Why was this upload rejected?</span>
              </div>
              <p className="leading-relaxed text-on-surface-variant">
                The Gemini Vision OCR engine examined the uploaded picture (e.g. photo of an apple, dog, vehicle exterior, or non-schedule document) and confirmed that no bus route stops, arrival/departure timings, or depot table structures were detected.
              </p>
              <p className="leading-relaxed text-on-surface-variant">
                AnaVandi Connect strictly requires legitimate KSRTC bus timetables, conductor trip logs, waybills, or printed route rosters.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-end gap-space-sm pt-space-xs border-t border-red-500/20">
              <button
                onClick={() => router.push("/upload")}
                className="px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-sm font-bold transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span>Choose Another File</span>
              </button>
              <button
                onClick={() => router.push("/upload")}
                className="px-space-lg py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-label-md text-sm font-bold uppercase tracking-wider shadow-lg transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">upload_file</span>
                <span>Upload Timetable Scan</span>
              </button>
            </div>
          </div>
        )}

        {/* Success Transition Block */}
        {isDone && result && !isFailed && (
          <div className="p-space-md rounded-xl bg-secondary-container/20 border-2 border-secondary shadow-md animate-in fade-in flex flex-col sm:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow">
                <span className="material-symbols-outlined text-2xl">verified</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Extraction Successful ({result.confidence}% Confidence)
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Parsed {result.timetable.stops.length} stops ({result.timetable.origin} → {result.timetable.destination}) • {result.timetable.discrepancies.length} ink annotations flagged for depot review.
                </p>
              </div>
            </div>

            <button
              onClick={handleGoToVerification}
              className="px-space-lg py-3 rounded bg-primary text-on-primary font-headline-sm text-title-md font-bold uppercase tracking-wider shadow-md hover:bg-primary-container transition-transform active:translate-y-0.5 flex items-center gap-2 whitespace-nowrap"
            >
              <span>Open Human Verification</span>
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
    </RoleGate>
  );
}
