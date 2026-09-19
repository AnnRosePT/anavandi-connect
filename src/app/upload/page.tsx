"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { RoleGate } from "@/components/auth/RoleGate";

interface SampleFile {
  id: string;
  name: string;
  type: string;
  size: string;
  previewUrl: string;
  description: string;
}

const DEMO_SAMPLES: SampleFile[] = [
  {
    id: "sample-1",
    name: "KSRTC_LOG_1984_OCT_CAN0824.TIFF",
    type: "image/tiff",
    size: "1.4 MB",
    previewUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDy2RIqVgg8IJPL__hyg05-v9Wk0RLUXV0TJ5GgMCvo4MLwiDKKvQs9Wm2uleoAlILcdJ5xZjSlWoAQ-yZo4eEJx-y7xj7nsncF8kF79X6yIj3tGrQSlNly9ImPWy4cOEfodxs_Qp0R7qr5xRMRKl8n6ydfkA2Hr7DnDjtaFauQYREu5HHTUP9uBTmrPLwbN68ru3Hzw4Kdp9gtnVsQVS4Mz2Blh7_FQA50XJywv3R-fs0Pgdlx5438",
    description: "Thampanoor Central Dot-Matrix Archival Register with handwritten correction at Alappuzha",
  },
  {
    id: "sample-2",
    name: "MUNNAR_HIGHRANGE_WALL_SHEET.PNG",
    type: "image/png",
    size: "820 KB",
    previewUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDy2RIqVgg8IJPL__hyg05-v9Wk0RLUXV0TJ5GgMCvo4MLwiDKKvQs9Wm2uleoAlILcdJ5xZjSlWoAQ-yZo4eEJx-y7xj7nsncF8kF79X6yIj3tGrQSlNly9ImPWy4cOEfodxs_Qp0R7qr5xRMRKl8n6ydfkA2Hr7DnDjtaFauQYREu5HHTUP9uBTmrPLwbN68ru3Hzw4Kdp9gtnVsQVS4Mz2Blh7_FQA50XJywv3R-fs0Pgdlx5438",
    description: "Munnar Depot Ghat Corridor Dispatch schedule with bilingual Malayalam stops",
  },
  {
    id: "sample-3",
    name: "TCR_ERS_COMMUTER_SCHEDULE.PDF",
    type: "application/pdf",
    size: "540 KB",
    previewUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDy2RIqVgg8IJPL__hyg05-v9Wk0RLUXV0TJ5GgMCvo4MLwiDKKvQs9Wm2uleoAlILcdJ5xZjSlWoAQ-yZo4eEJx-y7xj7nsncF8kF79X6yIj3tGrQSlNly9ImPWy4cOEfodxs_Qp0R7qr5xRMRKl8n6ydfkA2Hr7DnDjtaFauQYREu5HHTUP9uBTmrPLwbN68ru3Hzw4Kdp9gtnVsQVS4Mz2Blh7_FQA50XJywv3R-fs0Pgdlx5438",
    description: "Sakthan Thampuran Thrissur Commuter Shuttle Roster (Printed press 2024)",
  },
];

export default function UploadPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number | string;
    type: string;
    preview: string;
  } | null>({
    name: DEMO_SAMPLES[0].name,
    size: DEMO_SAMPLES[0].size,
    type: DEMO_SAMPLES[0].type,
    preview: DEMO_SAMPLES[0].previewUrl,
  });

  const [dragActive, setDragActive] = useState(false);
  const [language, setLanguage] = useState<"Auto" | "English" | "Malayalam">("Auto");
  const [enhanceImage, setEnhanceImage] = useState(true);
  const [detectTable, setDetectTable] = useState(true);
  const [detectHandwriting, setDetectHandwriting] = useState(true);
  const [validateTimings, setValidateTimings] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setErrorMsg(null);

    // Validate type: JPG, PNG, PDF, TIFF
    const validTypes = ["image/jpeg", "image/png", "image/tiff", "application/pdf", "image/webp"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|pdf|tiff)$/i)) {
      setErrorMsg("Please select a valid image (JPG, PNG, TIFF) or PDF document.");
      return;
    }

    // Validate size: max 15MB
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("File size exceeds 15 MB limit.");
      return;
    }

    const fallbackUrl = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = (e.target?.result as string) || fallbackUrl;
      setSelectedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        type: file.type || "image/jpeg",
        preview: dataUrl,
      });
    };
    reader.onerror = () => {
      setSelectedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        type: file.type || "image/jpeg",
        preview: fallbackUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: SampleFile) => {
    setErrorMsg(null);
    setSelectedFile({
      name: sample.name,
      size: sample.size,
      type: sample.type,
      preview: sample.previewUrl,
    });
  };

  const handleStartExtraction = () => {
    if (!selectedFile) {
      setErrorMsg("Please upload or select a timetable image first.");
      return;
    }

    // Save configuration in session/local storage
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "anavandi_pending_upload",
        JSON.stringify({
          fileName: selectedFile.name,
          previewUrl: selectedFile.preview,
          language,
          enhanceImage,
          detectTable,
          detectHandwriting,
          validateTimings,
          uploadedAt: new Date().toISOString(),
        })
      );
    }

    // Navigate to processing workflow
    router.push("/processing");
  };

  return (
    <RoleGate
      requiredRole="official"
      fallbackTitle="KSRTC Depot Ingestion (Official Portal)"
      fallbackMessage="The OCR Roster Digitize engine is restricted to authenticated KSRTC Depot Officials. Passengers can submit community crowdsourced timetables via Community Upload."
    >
      <div className="w-full px-space-md sm:px-space-lg flex flex-col gap-space-lg pb-space-xl">
      {/* Title Header */}
      <div className="bg-surface-container-low p-space-md rounded-xl border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">upload_file</span>
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">
              AI Timetable Ingestion Module
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold mt-1">
            {t("uploadTimetable")}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Upload paper timetables, conductor waybills, or depot wall roster photos to extract structured GTFS schedules.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-space-sm py-1 rounded bg-secondary-container/30 text-on-secondary-container font-label-md text-label-md font-bold">
          <span className="material-symbols-outlined text-sm">security</span>
          <span>Depot Grade OCR Engine v2.4</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-space-sm bg-error-container text-on-error-container rounded-lg font-label-md text-sm flex items-center gap-2 border border-error">
          <span className="material-symbols-outlined text-error">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid: Left Upload Dropzone, Right Options & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Left Column: Dropzone & Sample Picker (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          {/* Dropzone Box */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-space-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
              dragActive
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-outline-variant hover:border-primary bg-surface-container-low hover:bg-surface-container"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,.tiff"
              onChange={handleFileInput}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-space-md shadow-md">
              <span className="material-symbols-outlined text-3xl">cloud_upload</span>
            </div>

            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-1">
              Drag &amp; drop timetable scan here
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Supports high-resolution JPG, PNG, Grayscale TIFF, or PDF depot sheets (up to 15 MB).
            </p>

            <button
              type="button"
              className="mt-space-md px-space-lg py-2 rounded bg-surface-container-lowest text-primary font-label-md text-label-md uppercase font-bold tracking-wider shadow-sm border border-surface-container-high hover:bg-surface-dim transition-colors"
            >
              Browse Local Files
            </button>
          </div>

          {/* 3 Quick-Pick Demo Samples for Judges */}
          <div className="bg-surface-container-low p-space-md rounded-xl border border-surface-container shadow-sm flex flex-col gap-space-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-md text-label-md uppercase font-bold text-secondary tracking-wider">
                Hackathon Demo Presets (1-Click Select)
              </span>
              <span className="text-xs font-label-md text-on-surface-variant">
                Pre-configured for live testing
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
              {DEMO_SAMPLES.map((sample) => {
                const isSelected = selectedFile?.name === sample.name;
                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className={`p-space-sm rounded-lg text-left transition-all border ${
                      isSelected
                        ? "bg-secondary-container/25 border-secondary shadow-sm"
                        : "bg-surface-container hover:bg-surface-container-high border-surface-container-high"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-primary font-label-md">
                      <span>{sample.type.split("/")[1].toUpperCase()}</span>
                      <span>{sample.size}</span>
                    </div>
                    <div className="font-bold text-xs text-on-surface truncate mt-1">
                      {sample.name}
                    </div>
                    <div className="text-[11px] text-on-surface-variant line-clamp-2 mt-1 leading-tight">
                      {sample.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Preview & Pipeline Config (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          {/* File Preview Card */}
          {selectedFile && (
            <div className="bg-surface-container-low p-space-md rounded-xl border border-surface-container shadow-sm">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container mb-space-sm">
                <span className="font-label-md text-label-md uppercase font-bold text-on-surface-variant">
                  Source Scan Preview
                </span>
                <span className="font-label-md text-label-md bg-secondary text-on-secondary px-1.5 py-0.5 rounded font-bold">
                  {selectedFile.size}
                </span>
              </div>

              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-surface-dim border border-surface-container shadow-inner mb-space-sm">
                <img
                  src={selectedFile.preview}
                  alt="Timetable Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/10 pointer-events-none"></div>
                <div className="absolute bottom-2 left-2 right-2 p-1.5 bg-black/75 backdrop-blur-sm rounded text-surface text-xs font-label-md truncate">
                  {selectedFile.name}
                </div>
              </div>
            </div>
          )}

          {/* OCR Engine Pipeline Settings */}
          <div className="bg-surface-container-low p-space-md rounded-xl border border-surface-container shadow-sm flex flex-col gap-space-md">
            <div>
              <span className="font-label-md text-label-md uppercase font-bold text-secondary tracking-wider block mb-1">
                Extraction Pipeline Options
              </span>
              <h3 className="font-title-md text-title-md font-bold text-on-surface">
                Tune Vision &amp; Parser Settings
              </h3>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block font-label-md text-label-md uppercase font-bold text-on-surface-variant mb-1">
                Primary Language:
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(["Auto", "English", "Malayalam"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`py-1.5 px-2 rounded font-label-md text-xs font-bold transition-all ${
                      language === lang
                        ? "bg-primary text-on-primary shadow-sm"
                        : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    {lang === "Malayalam" ? "മലയാളം" : lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2 text-sm text-on-surface">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enhanceImage}
                  onChange={(e) => setEnhanceImage(e.target.checked)}
                  className="rounded border-outline text-primary focus:ring-primary w-4 h-4"
                />
                <span>Enhance aged paper contrast &amp; despeckle</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={detectTable}
                  onChange={(e) => setDetectTable(e.target.checked)}
                  className="rounded border-outline text-primary focus:ring-primary w-4 h-4"
                />
                <span>Detect tabular grid &amp; column boundaries</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={detectHandwriting}
                  onChange={(e) => setDetectHandwriting(e.target.checked)}
                  className="rounded border-outline text-primary focus:ring-primary w-4 h-4"
                />
                <span>Detect conductor pen annotations &amp; strike-throughs</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={validateTimings}
                  onChange={(e) => setValidateTimings(e.target.checked)}
                  className="rounded border-outline text-primary focus:ring-primary w-4 h-4"
                />
                <span>Validate sequential departure &amp; arrival chronology</span>
              </label>
            </div>

            {/* Start AI Extraction CTA */}
            <button
              onClick={handleStartExtraction}
              className="w-full py-3 px-space-md rounded-lg bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container font-headline-sm text-headline-sm uppercase tracking-wide font-extrabold shadow-md flex items-center justify-center gap-2 transition-all active:translate-y-0.5"
            >
              <span className="material-symbols-outlined text-xl">psychology</span>
              <span>{t("startAiExtraction")}</span>
            </button>
          </div>
        </div>
      </div>
      </div>
    </RoleGate>
  );
}
