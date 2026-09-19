"use client";

import React, { useState } from "react";
import { TimetableRecord } from "@/types/timetable";

interface ScanViewerProps {
  timetable: TimetableRecord;
  selectedStopIndex?: number;
  onSelectStop?: (index: number) => void;
}

export const ScanViewer: React.FC<ScanViewerProps> = ({
  timetable,
  selectedStopIndex = 2,
  onSelectStop,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [showOcrBoxes, setShowOcrBoxes] = useState<boolean>(true);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 1.8));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.7));
  const handleResetZoom = () => {
    setZoom(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  return (
    <div className="flex flex-col space-y-space-sm bg-surface-container-low rounded-xl p-space-md shadow-md">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-space-xs">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary">document_scanner</span>
          <div>
            <h3 className="font-title-md text-title-md text-on-surface font-bold leading-tight">
              Source Timetable Scan
            </h3>
            <p className="font-label-md text-label-md text-on-surface-variant">
              Archival Log Sheet • Physical Register #4735
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-surface-container px-2 py-1 rounded text-on-surface font-label-md text-label-md">
          <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
          <span>400 DPI • Grayscale TIFF</span>
        </div>
      </div>

      {/* Scan Controls Toolbar */}
      <div className="flex items-center justify-between bg-surface-container px-space-sm py-1 rounded">
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomIn}
            className="p-1 rounded hover:bg-surface-container-high text-on-surface transition-colors"
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-lg">zoom_in</span>
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1 rounded hover:bg-surface-container-high text-on-surface transition-colors"
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-lg">zoom_out</span>
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1 rounded hover:bg-surface-container-high text-on-surface transition-colors"
            title="Fit Width"
          >
            <span className="material-symbols-outlined text-lg">fit_screen</span>
          </button>
          <button
            onClick={handleRotate}
            className="p-1 rounded hover:bg-surface-container-high text-on-surface transition-colors"
            title="Rotate"
          >
            <span className="material-symbols-outlined text-lg">rotate_right</span>
          </button>
          <span className="text-xs font-label-md text-on-surface-variant ml-2">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
          <span>Layer:</span>
          <button
            onClick={() => setShowOcrBoxes(!showOcrBoxes)}
            className={`font-bold px-1.5 py-0.5 rounded shadow-sm transition-colors ${
              showOcrBoxes
                ? "text-primary bg-surface-container-lowest"
                : "text-on-surface-variant bg-surface-container"
            }`}
          >
            OCR Boxes ({showOcrBoxes ? "ON" : "OFF"})
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="overflow-auto max-h-[560px] bg-[#EAE2D5] rounded-lg p-space-sm">
        <div
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: "top center",
            transition: "transform 0.2s ease-out",
          }}
          className="relative bg-[#F4EDE2] rounded-lg p-space-md shadow-inner flex flex-col space-y-space-md select-none border border-[#D5C6AF]"
        >
          {/* Header of paper log */}
          <div className="flex justify-between items-start pb-space-sm border-b border-[#D5C6AF]/60">
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm font-bold text-[#422B1E] tracking-tight uppercase">
                K.S.R.T.C. CENTRAL BUS STATION
              </span>
              <span className="font-label-md text-label-md font-bold text-[#703C00]">
                തിരുവനന്തപുരം സെൻട്രൽ ഡിപ്പോ • TRIP LOG SHEET
              </span>
              <span className="font-label-md text-label-md text-[#5A403E]">
                Vehicle No:{" "}
                <strong className="text-[#950913]">
                  {timetable.vehicleNo} ({timetable.chassisType})
                </strong>
              </span>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-1 bg-[#E8DCC8] rounded text-[#2E1500] font-label-md text-label-md font-bold">
                SCH: {timetable.routeCode || "TRV-CAN SF"}
              </span>
              <div className="text-[10px] text-[#5A403E] mt-1 font-label-md">
                DATE: 24-OCT-1984
              </div>
            </div>
          </div>

          {/* Render scan items */}
          <div className="space-y-2 font-label-lg text-label-lg text-[#281900]">
            {timetable.stops.map((stop, idx) => {
              const isAnomaly = stop.isAnomaly || stop.confidence < 80;
              const isSelected = selectedStopIndex === idx;

              return (
                <div
                  key={stop.id || idx}
                  onClick={() => onSelectStop && onSelectStop(idx)}
                  className={`relative p-2.5 rounded transition-all cursor-pointer flex items-center justify-between ${
                    isAnomaly
                      ? "bg-[#FFF2D6] shadow-sm border border-secondary"
                      : isSelected
                      ? "bg-[#F3E8D5] ring-2 ring-primary"
                      : "bg-[#FAF5EC] hover:bg-[#F5ECE0]"
                  }`}
                >
                  {/* OCR Box Highlight */}
                  {showOcrBoxes && (
                    <div
                      className={`absolute inset-0 rounded pointer-events-none ${
                        isAnomaly
                          ? "bg-secondary-container/20 border border-dashed border-secondary animate-pulse"
                          : "bg-primary/5 border border-primary/20"
                      }`}
                    ></div>
                  )}

                  <div className="flex items-center gap-2 relative z-10">
                    <span className="text-primary font-bold">{String(idx + 1).padStart(2, "0")}.</span>
                    <span className={`font-semibold ${isAnomaly ? "text-on-surface font-bold" : ""}`}>
                      {stop.name.toUpperCase()} {stop.nameMl ? `(${stop.nameMl.split(" ")[0]})` : ""}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 relative z-10">
                    {isAnomaly ? (
                      <div className="flex items-center gap-2">
                        <span className="line-through text-on-surface-variant text-xs">09:10</span>
                        <span className="font-bold text-primary text-sm bg-surface-container-lowest px-1 rounded shadow-sm">
                          {stop.departure}
                        </span>
                        <span className="material-symbols-outlined text-secondary text-base">
                          edit_note
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#7E5700] text-xs">
                        {stop.arrival !== "—" ? `ARR ${stop.arrival} / ` : ""}DEP {stop.departure}
                      </span>
                    )}

                    <span
                      className={`text-[10px] px-1 rounded font-label-md font-bold ${
                        isAnomaly
                          ? "bg-secondary text-on-secondary"
                          : "bg-secondary-container/40 text-on-secondary"
                      }`}
                    >
                      {Math.round(stop.confidence)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rubber Stamp */}
          <div className="self-end transform -rotate-6 px-3 py-1 bg-primary/15 rounded text-primary font-label-md text-label-md font-bold uppercase tracking-widest shadow-sm">
            SUPER FAST • CERTIFIED LOG
          </div>
        </div>
      </div>

      {/* Meta Footer */}
      <div className="flex items-center justify-between text-on-surface-variant font-label-md text-label-md pt-1">
        <span>
          File: <code className="text-on-surface">{timetable.sourceFile}</code>
        </span>
        <span className="flex items-center gap-1 text-secondary font-semibold">
          <span className="material-symbols-outlined text-sm">verified_user</span> Kerala RTC Archival Vault
        </span>
      </div>
    </div>
  );
};
