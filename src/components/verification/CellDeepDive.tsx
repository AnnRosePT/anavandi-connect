"use client";

import React, { useState } from "react";
import { TimetableRecord } from "@/types/timetable";

interface CellDeepDiveProps {
  timetable: TimetableRecord;
  stopIndex: number;
  onResolve: (
    resolution: "use_handwritten" | "accept_printed" | "flagged",
    value: string
  ) => void;
}

export const CellDeepDive: React.FC<CellDeepDiveProps> = ({
  timetable,
  stopIndex,
  onResolve,
}) => {
  const [customValue, setCustomValue] = useState("");
  const [isEditingCustom, setIsEditingCustom] = useState(false);

  const stop = timetable.stops[stopIndex] || timetable.stops[2];
  const discrepancy = timetable.discrepancies.find((d) => d.stopIndex === stopIndex) || {
    stopIndex: 2,
    stopName: stop?.name || "Alappuzha KSRTC Stand",
    field: "departure" as const,
    printedValue: "09:10 AM",
    printedConfidence: 68.4,
    printedTypeface: "Monospace Letterpress (1984)",
    handwrittenValue: "09:15 AM",
    handwrittenConfidence: 92.8,
    handwrittenNote: "Station Master Initials 'S.K.' affixed",
    selectedResolution: "none" as const,
    diffScoreMins: 5,
  };

  const isResolved = discrepancy.selectedResolution !== "none" && !stop?.isAnomaly;

  return (
    <div className="bg-surface-container-low rounded-xl p-space-md shadow-md space-y-space-md border border-secondary/20">
      {/* Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-xs border-b border-surface-container">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary">biotech</span>
          <div>
            <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Cell Deep-Dive Inspection: Stop #{stop?.seq || stopIndex + 1}
            </h4>
            <p className="font-label-md text-label-md text-on-surface-variant">
              {stop?.name || "Alappuzha"} Departure Field • Model Disagreement Analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isResolved && (
            <span className="font-label-md text-label-md px-2 py-1 rounded bg-surface-container font-bold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">check_circle</span> Discrepancy Resolved
            </span>
          )}
          <span className="font-label-md text-label-md px-2 py-1 rounded bg-secondary-container text-on-secondary-container font-bold">
            Diff Score: ±{discrepancy.diffScoreMins || 5} mins
          </span>
        </div>
      </div>

      {/* Comparative Snip Viewer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {/* Printed Snip */}
        <div className="bg-surface-container p-space-md rounded-lg flex flex-col justify-between space-y-space-sm shadow-sm border border-[#D5C6AF]">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md uppercase tracking-wider font-bold text-on-surface-variant">
              A. Printed Log Entry (1984 Typeface)
            </span>
            <span className="text-xs bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface font-label-md">
              Base Layer
            </span>
          </div>

          <div className="h-24 bg-[#EBE0CF] rounded flex items-center justify-center p-space-sm relative overflow-hidden shadow-inner">
            <div className="flex flex-col items-center">
              <span className="font-headline-lg text-headline-lg font-extrabold text-[#382618] line-through tracking-wider">
                {discrepancy.printedValue.replace(" AM", "").replace(" PM", "")}
              </span>
              <span className="font-label-md text-label-md text-error font-semibold">
                Strike-through pen line detected
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between font-label-md text-label-md text-on-surface-variant">
            <span>
              OCR Conf: <strong>{discrepancy.printedConfidence}%</strong>
            </span>
            <span>Font: {discrepancy.printedTypeface || "Letterpress"}</span>
          </div>
        </div>

        {/* Handwritten Snip */}
        <div className="bg-surface-container p-space-md rounded-lg flex flex-col justify-between space-y-space-sm shadow-sm border border-secondary/40">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md uppercase tracking-wider font-bold text-primary">
              B. Conductor Pen Inscription
            </span>
            <span className="text-xs bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-bold font-label-md">
              Depot Correction
            </span>
          </div>

          <div className="h-24 bg-[#FFF8ED] rounded flex items-center justify-center p-space-sm relative overflow-hidden shadow-inner border border-dashed border-secondary">
            <div className="flex flex-col items-center">
              <span className="font-headline-lg text-headline-lg font-bold text-primary italic tracking-widest transform -rotate-2">
                {discrepancy.handwrittenValue.replace(" AM", "").replace(" PM", "")}
              </span>
              <span className="font-label-md text-label-md text-secondary font-semibold">
                {discrepancy.handwrittenNote || "Station Master Initials 'S.K.' affixed"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between font-label-md text-label-md text-on-surface-variant">
            <span>
              Model Conf: <strong>{discrepancy.handwrittenConfidence}%</strong>
            </span>
            <span className="text-primary font-bold">Blue Fountain Ink</span>
          </div>
        </div>
      </div>

      {/* Action Decision Trigger Group */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs bg-surface-container-lowest p-space-sm rounded-lg shadow-sm">
        <span className="font-label-md text-label-md text-on-surface-variant font-bold">
          Resolution Workflow:
        </span>

        {isEditingCustom ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. 09:12 AM"
              className="px-2 py-1 rounded bg-surface-container text-sm font-bold text-primary outline-none focus:ring-1 focus:ring-primary"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
            />
            <button
              onClick={() => {
                if (customValue.trim()) {
                  onResolve("use_handwritten", customValue.trim());
                  setIsEditingCustom(false);
                }
              }}
              className="px-3 py-1 bg-primary text-on-primary rounded text-xs font-bold font-label-md uppercase"
            >
              Apply
            </button>
            <button
              onClick={() => setIsEditingCustom(false)}
              className="px-2 py-1 bg-surface-container text-on-surface rounded text-xs font-label-md"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-space-sm">
            <button
              onClick={() => onResolve("use_handwritten", discrepancy.handwrittenValue)}
              className="px-space-md py-2 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider font-bold rounded shadow hover:bg-primary-container transition-transform active:translate-y-0.5 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">check</span>
              Use Handwritten ({discrepancy.handwrittenValue})
            </button>

            <button
              onClick={() => onResolve("accept_printed", discrepancy.printedValue)}
              className="px-space-md py-2 bg-surface-container text-on-surface font-label-md text-label-md uppercase tracking-wider font-semibold rounded hover:bg-surface-container-high transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">history</span>
              Accept Printed ({discrepancy.printedValue})
            </button>

            <button
              onClick={() => setIsEditingCustom(true)}
              className="px-space-sm py-2 bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md uppercase tracking-wider font-bold rounded hover:bg-surface-container-high transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              Manual Input
            </button>

            <button
              onClick={() => onResolve("flagged", stop.departure)}
              className="px-space-sm py-2 bg-transparent text-secondary font-label-md text-label-md uppercase tracking-wider font-bold rounded hover:bg-secondary-container/20 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">flag</span>
              Flag for Re-Scan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
