"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { timetableStore } from "@/services/store";
import { TimetableRecord, StopItem } from "@/types/timetable";
import { ScanViewer } from "@/components/verification/ScanViewer";
import { StructuredTable } from "@/components/verification/StructuredTable";
import { CellDeepDive } from "@/components/verification/CellDeepDive";
import { validateTimetable, ValidationResult } from "@/services/validation";
import { exportTimetableCsv, exportTimetableJson, exportGtfsZip, exportTimetablePdf } from "@/services/exportService";

function VerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const timetableId = searchParams.get("id");

  const [timetable, setTimetable] = useState<TimetableRecord>(() => {
    return timetableId
      ? timetableStore.getById(timetableId) || timetableStore.getActive()
      : timetableStore.getActive();
  });

  const [selectedStopIndex, setSelectedStopIndex] = useState<number>(2);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showPublishSuccess, setShowPublishSuccess] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [isPdfExporting, setIsPdfExporting] = useState<boolean>(false);

  useEffect(() => {
    const update = () => {
      const active = timetableId
        ? timetableStore.getById(timetableId) || timetableStore.getActive()
        : timetableStore.getActive();
      setTimetable(active);
    };
    update();
    const unsub = timetableStore.subscribe(update);
    return unsub;
  }, [timetableId]);

  const pendingIssuesCount = timetable.stops.filter(
    (s) => s.isAnomaly || s.status === "needs_review" || s.confidence < 80
  ).length;

  const handleUpdateStop = (index: number, stopData: Partial<StopItem>) => {
    timetableStore.updateStop(timetable.id, index, stopData);
  };

  const handleResolveDiscrepancy = (
    resolution: "use_handwritten" | "accept_printed" | "flagged",
    newValue: string
  ) => {
    timetableStore.resolveDiscrepancy(timetable.id, selectedStopIndex, resolution, newValue);
  };

  const handleAddStop = (newStop: Omit<StopItem, "id" | "seq">) => {
    timetableStore.addStop(timetable.id, newStop);
  };

  const handleRemoveStop = (index: number) => {
    timetableStore.removeStop(timetable.id, index);
  };

  const handleExportPdf = async () => {
    setIsPdfExporting(true);
    try {
      await exportTimetablePdf(timetable);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setIsPdfExporting(false);
    }
  };

  const handlePublish = () => {
    const res = validateTimetable(timetable);
    setValidationResult(res);

    if (!res.isValid) {
      setShowErrorModal(true);
      return;
    }

    timetableStore.verifyAndPublish(timetable.id, "Depot Officer V. Nair (TRV)");
    setShowPublishSuccess(true);
  };

  return (
    <div className="w-full px-space-md sm:px-space-lg flex flex-col w-full pb-20 space-y-space-md">
      {/* Top Breadcrumb & Metadata Strip */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low px-space-md py-space-sm rounded-lg shadow-sm border border-surface-container">
        <div className="flex flex-wrap items-center gap-space-sm">
          <span className="material-symbols-outlined text-primary text-xl">fact_check</span>
          <div className="flex items-center gap-1.5 font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
            <span>Verification Queue</span>
            <span className="text-outline">/</span>
            <span className="font-bold text-primary">{timetable.id}</span>
            <span className="text-outline">/</span>
            <span className="text-secondary font-semibold">Human Verification Mode</span>
          </div>
        </div>

        <div className="flex items-center gap-space-sm">
          {timetable.status === "VERIFIED" ? (
            <span className="px-space-sm py-0.5 rounded bg-surface-container text-primary font-label-md text-label-md font-bold uppercase tracking-wide flex items-center gap-1 shadow-sm border border-primary/20">
              <span className="material-symbols-outlined text-sm">verified</span>
              Verified &amp; Published
            </span>
          ) : (
            <span className="px-space-sm py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold uppercase tracking-wide flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
              In Review (Needs Sign-off)
            </span>
          )}
          <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
            Assigned: Inspector V. Nair (TRV-Central)
          </span>
        </div>
      </div>

      {/* Warm Amber Alert Banner */}
      {pendingIssuesCount > 0 ? (
        <div className="relative overflow-hidden bg-secondary-container/25 rounded-xl p-space-md flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md shadow-sm border border-secondary/30">
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-secondary-container"></div>
          <div className="flex items-start gap-space-md pl-space-xs">
            <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0 shadow-sm">
              <span
                className="material-symbols-outlined text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {pendingIssuesCount} Critical Discrepancy Needs Review
                </h2>
                <span className="bg-primary text-on-primary font-label-md text-label-md px-1.5 py-0.5 rounded">
                  Stop #{selectedStopIndex + 1}
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                Auto-detected {timetable.stops.length} log points •{" "}
                <strong className="text-on-surface font-semibold">
                  {timetable.overallConfidence}% overall extraction confidence
                </strong>
                . Handwritten ink correction overprinted at {timetable.stops[selectedStopIndex]?.name || "Alappuzha"} departure register.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-space-sm self-end md:self-center shrink-0">
            <button
              onClick={() => setSelectedStopIndex(2)}
              className="px-space-md py-1.5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider font-bold rounded shadow hover:bg-primary-container transition-transform active:translate-y-0.5"
            >
              Jump to Anomaly
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container p-space-sm px-space-md rounded-xl border border-surface-container-high flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <span className="material-symbols-outlined">verified</span>
            <span>All station records verified with 100% agreement. Ready for Public Transit Grid publish.</span>
          </div>
          <span className="font-label-md text-xs bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-bold">
            0 Pending Issues
          </span>
        </div>
      )}

      {/* Main Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <div className="lg:col-span-5 flex flex-col space-y-space-sm">
          <ScanViewer
            timetable={timetable}
            selectedStopIndex={selectedStopIndex}
            onSelectStop={(idx) => setSelectedStopIndex(idx)}
          />
        </div>

        <div className="lg:col-span-7 flex flex-col space-y-space-md">
          <StructuredTable
            timetable={timetable}
            selectedStopIndex={selectedStopIndex}
            onSelectStop={(idx) => setSelectedStopIndex(idx)}
            onUpdateStop={handleUpdateStop}
            onAddStop={handleAddStop}
            onRemoveStop={handleRemoveStop}
          />

          <CellDeepDive
            timetable={timetable}
            stopIndex={selectedStopIndex}
            onResolve={handleResolveDiscrepancy}
          />
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-0 z-30 bg-surface-container-lowest rounded-xl p-space-md shadow-xl flex flex-col md:flex-row items-center justify-between gap-space-md border border-surface-container">
        <div className="flex flex-wrap items-center gap-space-lg text-on-surface">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary font-bold">
              <span className="material-symbols-outlined text-lg">alt_route</span>
            </div>
            <div>
              <div className="font-label-md text-label-md text-on-surface-variant uppercase font-bold">
                Stops Matched
              </div>
              <div className="font-headline-sm text-headline-sm font-bold text-on-surface leading-tight">
                {timetable.stops.length} / {timetable.stops.length}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-secondary font-bold">
              <span className="material-symbols-outlined text-lg">percent</span>
            </div>
            <div>
              <div className="font-label-md text-label-md text-on-surface-variant uppercase font-bold">
                OCR Pass Rate
              </div>
              <div className="font-headline-sm text-headline-sm font-bold text-on-surface leading-tight">
                {timetable.overallConfidence}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-tertiary font-bold">
              <span className="material-symbols-outlined text-lg">schedule</span>
            </div>
            <div>
              <div className="font-label-md text-label-md text-on-surface-variant uppercase font-bold">
                Est. Journey Time
              </div>
              <div className="font-headline-sm text-headline-sm font-bold text-on-surface leading-tight">
                {timetable.estimatedDuration}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="flex items-center bg-surface-container rounded p-0.5 border border-surface-container-high">
            <button
              onClick={() => exportTimetableCsv(timetable)}
              className="px-2.5 py-1 text-on-surface-variant hover:text-on-surface font-label-md text-label-md font-bold uppercase rounded hover:bg-surface-container-lowest transition-colors"
              title="Export CSV"
            >
              CSV
            </button>
            <button
              onClick={() => exportTimetableJson(timetable)}
              className="px-2.5 py-1 text-on-surface-variant hover:text-on-surface font-label-md text-label-md font-bold uppercase rounded hover:bg-surface-container-lowest transition-colors"
              title="Export JSON"
            >
              JSON
            </button>
            <button
              onClick={() => exportGtfsZip(timetable)}
              className="px-2.5 py-1 text-on-surface-variant hover:text-on-surface font-label-md text-label-md font-bold uppercase rounded hover:bg-surface-container-lowest flex items-center gap-0.5 transition-colors"
              title="Export GTFS Zip"
            >
              <span className="material-symbols-outlined text-xs">folder_zip</span> GTFS
            </button>
            <button
              onClick={handleExportPdf}
              disabled={isPdfExporting}
              className="px-2.5 py-1 text-on-surface-variant hover:text-on-surface font-label-md text-label-md font-bold uppercase rounded hover:bg-surface-container-lowest flex items-center gap-0.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export PDF"
            >
              {isPdfExporting ? (
                <span className="material-symbols-outlined text-xs animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-xs">picture_as_pdf</span>
              )}
              {isPdfExporting ? "Generating…" : "PDF"}
            </button>
          </div>

          <button
            onClick={handlePublish}
            className="px-space-lg py-2.5 bg-primary text-on-primary font-headline-sm text-title-md font-bold rounded shadow-md hover:bg-primary-container transition-transform active:translate-y-0.5 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">publish</span>
            <span>Verify &amp; Publish to Public Network</span>
          </button>
        </div>
      </div>

      {showErrorModal && validationResult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-space-lg shadow-2xl border border-error animate-in zoom-in-95">
            <div className="flex items-center gap-2 text-error mb-space-sm">
              <span className="material-symbols-outlined text-2xl">error</span>
              <h3 className="font-headline-sm text-headline-sm font-bold">
                Validation Errors Detected
              </h3>
            </div>
            <p className="text-sm text-on-surface-variant mb-space-md">
              Please correct the following issues before publishing to the live transit grid:
            </p>
            <ul className="space-y-1 mb-space-lg text-sm list-disc pl-5 text-on-surface">
              {validationResult.errors.map((err, i) => (
                <li key={i} className="text-error font-medium">
                  {err}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full py-2 bg-primary text-on-primary rounded font-bold uppercase font-label-md"
            >
              Close &amp; Review Fields
            </button>
          </div>
        </div>
      )}

      {showPublishSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-space-xl shadow-2xl border-2 border-primary animate-in zoom-in-95 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-space-md shadow-lg">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>

            <h3 className="font-headline-lg text-headline-lg font-bold text-primary mb-1">
              Timetable Verified &amp; Published!
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-space-lg">
              {timetable.title} has been verified and committed to the Kerala State Road Transport GTFS
              transit grid. Commuter journey searches and route maps are now live.
            </p>

            <div className="flex flex-wrap gap-space-sm justify-center w-full">
              <button
                onClick={() => router.push(`/map?id=${timetable.id}`)}
                className="flex-1 py-2.5 px-space-md bg-primary text-on-primary rounded font-label-md text-label-md font-bold uppercase shadow flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-base">map</span>
                <span>View Route Map</span>
              </button>
              <button
                onClick={() => exportGtfsZip(timetable)}
                className="py-2.5 px-space-md bg-secondary text-on-secondary rounded font-label-md text-label-md font-bold uppercase shadow flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-base">download</span>
                <span>Export GTFS Zip</span>
              </button>
              <button
                onClick={() => setShowPublishSuccess(false)}
                className="w-full mt-1 py-2 bg-surface-container text-on-surface rounded font-label-md text-xs font-semibold"
              >
                Continue In Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense fallback={<div className="p-space-xl text-center font-label-md">Loading verification workspace...</div>}>
      <VerificationContent />
    </Suspense>
  );
}
