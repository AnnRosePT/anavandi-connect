"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { processTimetableImage, OcrProcessingStep, ExtractionResult } from "@/services/ocr";
import { timetableStore } from "@/services/store";

export default function ProcessingPage() {
  const router = useRouter();
  const [steps, setSteps] = useState<OcrProcessingStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
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
      } catch (err) {
        console.error("Processing pipeline failed:", err);
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

  return (
    <div className="w-full px-space-md sm:px-space-lg flex flex-col gap-space-lg pb-space-xl max-w-5xl mx-auto">
      {/* Title */}
      <div className="bg-surface-container-low p-space-md rounded-xl border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping"></span>
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">
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
          <span className="font-label-md text-label-md text-on-surface font-bold">
            {isDone ? "Extraction Complete" : `Step ${currentStepIndex + 1} of 6`}
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
              <span className="text-primary">
                {isDone ? "Validated GTFS Ready" : steps[currentStepIndex]?.label || "Initializing"}
              </span>
            </span>
            <span className="font-headline-sm text-headline-sm font-bold text-primary">
              {isDone ? "100%" : `${Math.round(((currentStepIndex + 1) / 6) * 100)}%`}
            </span>
          </div>

          <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden border border-surface-container-high">
            <div
              className="bg-gradient-to-r from-primary via-secondary to-primary h-full transition-all duration-300"
              style={{
                width: isDone ? "100%" : `${((currentStepIndex + 1) / 6) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Step-by-Step Telemetry List */}
        <div className="space-y-space-sm">
          {steps.map((step, idx) => {
            const isFinished = step.status === "completed";
            const isCurrent = currentStepIndex === idx && !isDone;

            return (
              <div
                key={step.id}
                className={`p-space-sm rounded-lg flex items-center justify-between transition-all border ${
                  isFinished
                    ? "bg-surface-container-low border-surface-container text-on-surface"
                    : isCurrent
                    ? "bg-secondary-container/20 border-secondary text-on-surface shadow-sm"
                    : "bg-surface-container-lowest border-surface-container/40 text-on-surface-variant opacity-60"
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  {isFinished ? (
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
                    <div className="text-xs text-on-surface-variant">{step.details}</div>
                  </div>
                </div>

                <div className="text-right font-label-md text-xs font-bold">
                  {isFinished ? (
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

        {/* Success Transition Block */}
        {isDone && result && (
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
                  Parsed 7 stops, 2 terminal hubs • 1 ink annotation flagged for depot review.
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
  );
}
