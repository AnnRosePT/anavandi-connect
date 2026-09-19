"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { timetableStore } from "@/services/store";
import { TimetableRecord } from "@/types/timetable";

export default function CommunityUploadPage() {
  const router = useRouter();
  const [routeTitle, setRouteTitle] = useState("");
  const [depotLocation, setDepotLocation] = useState("Thiruvananthapuram");
  const [language, setLanguage] = useState<"English" | "Malayalam" | "Bilingual">("Bilingual");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeTitle.trim()) return;

    const newCommunityId = `COMMUNITY-${Date.now().toString().slice(-6)}`;
    const newRecord: TimetableRecord = {
      id: newCommunityId,
      tripId: `KL-COMM-${Math.floor(1000 + Math.random() * 9000)}`,
      routeCode: "COMM-SUBMIT",
      title: routeTitle.trim(),
      titleMl: routeTitle.trim(),
      origin: routeTitle.split("→")[0]?.trim() || "Local Depot",
      originMl: routeTitle.split("→")[0]?.trim() || "ഡിപ്പോ",
      destination: routeTitle.split("→")[1]?.trim() || "Terminus",
      destinationMl: routeTitle.split("→")[1]?.trim() || "ടെർമിനൽ",
      serviceType: "ORDINARY",
      serviceName: "Community Submission (Ordinary / FP)",
      serviceNameMl: "ജനകീയ സമർപ്പണം",
      vehicleNo: "KL 15 PENDING",
      chassisType: "Public Photo Roster",
      depotOrigin: depotLocation,
      depotDestination: "Kerala Transit Node",
      overallConfidence: 82.0,
      status: "PENDING_VERIFICATION",
      totalDistanceKm: 120,
      estimatedDuration: "2h 45m",
      fareInr: 90,
      sourceFile: fileName || "COMMUNITY_WALL_PHOTO.JPG",
      sourceType: "community_photo",
      language,
      viaSummary: description || "Submitted by commuter at depot bulletin pinboard",
      viaSummaryMl: "യാത്രക്കാർ നേരിട്ട് സമർപ്പിച്ചത്",
      createdAt: new Date().toISOString(),
      isCommunitySubmission: true,
      submitterNotes: description,
      discrepancies: [
        {
          stopIndex: 1,
          stopName: "Intermediate Depot Halt",
          field: "departure",
          printedValue: "08:15 AM",
          printedConfidence: 65.0,
          handwrittenValue: "08:20 AM",
          handwrittenConfidence: 85.0,
          selectedResolution: "none",
        },
      ],
      stops: [
        {
          id: `comm-1`,
          seq: 1,
          name: routeTitle.split("→")[0]?.trim() || "Origin Depot",
          nameMl: "ഡിപ്പോ",
          code: "COMM-ORIGIN",
          arrival: "—",
          departure: "07:30 AM",
          confidence: 88,
          status: "needs_review",
        },
        {
          id: `comm-2`,
          seq: 2,
          name: "Intermediate Halt",
          nameMl: "ഇടത്താവളം",
          code: "COMM-HALT",
          arrival: "08:15 AM",
          departure: "08:20 AM",
          confidence: 72,
          status: "needs_review",
          isAnomaly: true,
        },
        {
          id: `comm-3`,
          seq: 3,
          name: routeTitle.split("→")[1]?.trim() || "Destination Stand",
          nameMl: "ടെർമിനസ്",
          code: "COMM-DEST",
          arrival: "09:45 AM",
          departure: "—",
          confidence: 85,
          status: "needs_review",
        },
      ],
    };

    timetableStore.addTimetable(newRecord);
    setSubmittedSuccess(true);
  };

  return (
    <div className="w-full px-space-md sm:px-space-lg flex flex-col gap-space-lg pb-space-xl max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-surface-container-low p-space-md rounded-xl border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">group_add</span>
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">
              Crowdsourced Transit Open Data
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold mt-1">
            Community Timetable Submission
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Help digitalize remote Kerala depot rosters and local bus stand boards. Submissions enter the depot verification queue.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-space-sm py-1 rounded bg-secondary-container/30 text-on-secondary-container font-label-md text-label-md font-bold">
          <span className="material-symbols-outlined text-sm">lock_clock</span>
          <span>Zero Uninspected Commits Policy</span>
        </div>
      </div>

      {submittedSuccess ? (
        <div className="bg-surface-container-lowest p-space-xl rounded-xl border-2 border-primary shadow-xl text-center flex flex-col items-center animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-space-md shadow-md">
            <span className="material-symbols-outlined text-3xl">task_alt</span>
          </div>
          <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-1">
            Submission Queued For Verification
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-space-lg">
            Thank you for contributing! Your photo roster has been queued under{" "}
            <strong className="text-primary">PENDING VERIFICATION</strong>. It will be verified by
            the station master before becoming official public transit data.
          </p>
          <div className="flex gap-space-sm">
            <button
              onClick={() => router.push("/verification")}
              className="px-space-lg py-2.5 bg-primary text-on-primary rounded font-label-md text-xs font-bold uppercase shadow"
            >
              View in Verification Queue
            </button>
            <button
              onClick={() => {
                setSubmittedSuccess(false);
                setRouteTitle("");
                setDescription("");
              }}
              className="px-space-md py-2.5 bg-surface-container text-on-surface rounded font-label-md text-xs font-bold uppercase"
            >
              Submit Another
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-surface-container-lowest p-space-lg sm:p-space-xl rounded-xl border border-surface-container shadow-md flex flex-col gap-space-md"
        >
          {/* Route Title */}
          <div>
            <label className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
              Route Name (Origin → Destination) *
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-surface-container rounded-lg font-title-md text-on-surface border border-surface-container-high focus:ring-1 focus:ring-primary outline-none"
              placeholder="e.g. Kottayam → Kumily (via Mundakkayam)"
              value={routeTitle}
              onChange={(e) => setRouteTitle(e.target.value)}
            />
          </div>

          {/* Location Depot & Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
                Depot / Bus Stand Location *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 bg-surface-container rounded-lg font-title-md text-sm text-on-surface border border-surface-container-high focus:ring-1 focus:ring-primary outline-none"
                placeholder="e.g. Pala KSRTC Depot"
                value={depotLocation}
                onChange={(e) => setDepotLocation(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
                Schedule Script / Language
              </label>
              <select
                className="w-full px-3 py-2 bg-surface-container rounded-lg font-title-md text-sm text-on-surface border border-surface-container-high focus:ring-1 focus:ring-primary outline-none"
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value as "English" | "Malayalam" | "Bilingual")
                }
              >
                <option value="Bilingual">Bilingual (English + മലയാളം)</option>
                <option value="Malayalam">Malayalam Only (മലയാളം)</option>
                <option value="English">English Only</option>
              </select>
            </div>
          </div>

          {/* Photo Roster Upload */}
          <div>
            <label className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
              Timetable Photo / Scanned Document
            </label>
            <div className="border border-dashed border-outline-variant p-space-md rounded-lg text-center bg-surface-container-low flex flex-col items-center">
              <span className="material-symbols-outlined text-2xl text-secondary mb-1">photo_camera</span>
              <span className="text-xs text-on-surface font-semibold">
                {fileName || "Select photo taken at depot wall board or counter"}
              </span>
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                id="community-file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFileName(e.target.files[0].name);
                  }
                }}
              />
              <label
                htmlFor="community-file"
                className="mt-2 px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded text-xs font-label-md font-bold uppercase cursor-pointer text-primary"
              >
                Choose Photo
              </label>
            </div>
          </div>

          {/* Submitter Notes */}
          <div>
            <label className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
              Additional Notes (e.g. Sunday timings, platform bay)
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 bg-surface-container rounded-lg font-body-md text-sm text-on-surface border border-surface-container-high focus:ring-1 focus:ring-primary outline-none"
              placeholder="Provide any context about the bus service frequency or conductor updates..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container font-headline-sm text-headline-sm uppercase tracking-wider font-extrabold rounded-lg shadow-md transition-transform active:translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">send</span>
            <span>Submit to Verification Queue</span>
          </button>
        </form>
      )}
    </div>
  );
}
