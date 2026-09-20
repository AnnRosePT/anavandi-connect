"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { soundService } from "@/services/soundEffects";

interface RoleModalPromptProps {
  forceOpen?: boolean;
  onClose?: () => void;
  reason?: "upload_intent" | "welcome" | "manual";
}

export function openRolePrompt(reason: "upload_intent" | "welcome" | "manual" = "manual") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-role-modal", { detail: { reason } }));
  }
}

export const RoleModalPrompt: React.FC<RoleModalPromptProps> = ({
  forceOpen = false,
  onClose,
  reason: initialReason = "welcome",
}) => {
  const router = useRouter();
  const { role, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState<"upload_intent" | "welcome" | "manual">(initialReason);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const handleOpenEvent = (e: any) => {
      if (e?.detail?.reason) {
        setReason(e.detail.reason);
      }
      setIsOpen(true);
      soundService.playTransitChime();
    };

    window.addEventListener("open-role-modal", handleOpenEvent);
    return () => window.removeEventListener("open-role-modal", handleOpenEvent);
  }, []);

  useEffect(() => {
    // Check if triggered manually or if first time visiting
    if (forceOpen) {
      setIsOpen(true);
      if (soundEnabled) {
        soundService.playTransitChime();
      }
      return;
    }

    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("anavandi_initial_role_prompt_seen");
      if (!seen) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem("anavandi_initial_role_prompt_seen", "true");
          // Play transit chime announcement
          soundService.playTransitChime();
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [forceOpen]);

  const handleSelectOfficial = () => {
    switchRole("official");
    soundService.playTransitChime();
    setIsOpen(false);
    if (onClose) onClose();
    router.push("/upload");
  };

  const handleSelectPassengerSearch = () => {
    switchRole("passenger");
    soundService.playTransitChime();
    setIsOpen(false);
    if (onClose) onClose();
    router.push("/search");
  };

  const handleSelectPassengerCommunityUpload = () => {
    switchRole("passenger");
    soundService.playTransitChime();
    setIsOpen(false);
    if (onClose) onClose();
    router.push("/community-upload");
  };

  const handleDismiss = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleTestChime = () => {
    soundService.playTransitChime();
  };

  const handleTestAlarm = () => {
    soundService.playAlarmAlert();
  };

  if (!isOpen) return null;

  const isUploadContext = reason === "upload_intent";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-surface-container-lowest border-2 border-[#ffb300]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Top Decorative Banner / Alert Bar */}
        <div className="bg-gradient-to-r from-[#b71c1c] via-[#8f1414] to-[#ffb300] px-space-md py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400"></span>
            </span>
            <div className="flex items-center gap-1.5 font-label-md text-xs font-bold uppercase tracking-wider text-yellow-200">
              <span className="material-symbols-outlined text-sm">notifications_active</span>
              <span>KSRTC Transit Alert • Portal Selection</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio chimes buttons */}
            <button
              onClick={handleTestChime}
              title="Play Transit Ding-Dong Chime"
              className="px-2 py-0.5 rounded bg-white/15 hover:bg-white/30 text-white text-[11px] font-bold flex items-center gap-1 transition-all"
            >
              <span className="material-symbols-outlined text-xs">volume_up</span>
              <span>Chime</span>
            </button>
            <button
              onClick={handleTestAlarm}
              title="Play Station Alert Tone"
              className="px-2 py-0.5 rounded bg-white/15 hover:bg-white/30 text-white text-[11px] font-bold flex items-center gap-1 transition-all"
            >
              <span className="material-symbols-outlined text-xs">crisis_alert</span>
              <span>Alarm</span>
            </button>
            <button
              onClick={handleDismiss}
              className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white text-xs transition-colors ml-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-space-md sm:p-space-lg flex flex-col gap-space-md">
          {/* Main Question */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffb300]/15 text-[#7f0000] border border-[#ffb300]/40 text-xs font-bold uppercase mb-2">
              <span className="material-symbols-outlined text-sm">swap_horiz</span>
              <span>
                {isUploadContext
                  ? "Upload Timetable: Official vs Passenger"
                  : "Welcome to AnaVandi Connect"}
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md font-extrabold text-on-surface">
              {isUploadContext
                ? "How would you like to upload this timetable?"
                : "Which experience do you need today?"}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto mt-1">
              Select your access portal to enter the dedicated workflow tailored for your role.
            </p>
          </div>

          {/* Persona Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mt-1">
            {/* Card 1: KSRTC Official */}
            <div className="group relative rounded-xl border-2 border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 p-space-md flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-xl">verified_user</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-primary/15 text-primary text-[11px] font-extrabold uppercase tracking-wide">
                    Depot Officer
                  </span>
                </div>

                <h3 className="font-title-lg text-title-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                  KSRTC Official Portal
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                  Designed for Station Masters, Depot Inspectors, and Transit Operators.
                </p>

                <ul className="text-xs text-on-surface space-y-1.5 pt-2 border-t border-primary/15 font-medium">
                  <li className="flex items-center gap-1.5 text-primary">
                    <span className="material-symbols-outlined text-sm">document_scanner</span>
                    <span>Upload &amp; AI OCR Vision Pipeline</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-primary">
                    <span className="material-symbols-outlined text-sm">rate_review</span>
                    <span>Verify handwritten corrections</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-primary">
                    <span className="material-symbols-outlined text-sm">folder_zip</span>
                    <span>Generate verified GTFS feeds</span>
                  </li>
                </ul>
              </div>

              <div className="pt-space-md mt-2">
                <button
                  onClick={handleSelectOfficial}
                  className="w-full py-2.5 px-space-sm rounded-lg bg-primary hover:bg-[#8f1414] text-white font-label-md text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 group-hover:brightness-105 active:translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-sm">upload_file</span>
                  <span>{isUploadContext ? "Upload as Official (AI OCR)" : "Enter as KSRTC Official"}</span>
                </button>
              </div>
            </div>

            {/* Card 2: Passenger / Commuter */}
            <div className="group relative rounded-xl border-2 border-[#25803B]/30 hover:border-[#25803B] bg-[#25803B]/5 hover:bg-[#25803B]/10 p-space-md flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-[#25803B] text-white flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-xl">directions_bus</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#25803B]/15 text-[#25803B] text-[11px] font-extrabold uppercase tracking-wide">
                    Passenger Portal
                  </span>
                </div>

                <h3 className="font-title-lg text-title-lg font-bold text-on-surface group-hover:text-[#25803B] transition-colors">
                  Passenger &amp; Commuter
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                  Designed for daily commuters, students, and travelers exploring Kerala bus routes.
                </p>

                <ul className="text-xs text-on-surface space-y-1.5 pt-2 border-t border-[#25803B]/15 font-medium">
                  <li className="flex items-center gap-1.5 text-[#25803B]">
                    <span className="material-symbols-outlined text-sm">search</span>
                    <span>Search bus timings &amp; intermediate halts</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-[#25803B]">
                    <span className="material-symbols-outlined text-sm">map</span>
                    <span>Live route GIS map &amp; departure board</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-[#25803B]">
                    <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                    <span>Crowdsource depot timetable photos</span>
                  </li>
                </ul>
              </div>

              <div className="pt-space-md mt-2 flex flex-col gap-1.5">
                {isUploadContext ? (
                  <button
                    onClick={handleSelectPassengerCommunityUpload}
                    className="w-full py-2.5 px-space-sm rounded-lg bg-[#25803B] hover:bg-[#1e662f] text-white font-label-md text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 active:translate-y-0.5"
                  >
                    <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                    <span>Submit Community Photo</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSelectPassengerSearch}
                      className="w-full py-2 px-space-sm rounded-lg bg-[#25803B] hover:bg-[#1e662f] text-white font-label-md text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 active:translate-y-0.5"
                    >
                      <span className="material-symbols-outlined text-sm">search</span>
                      <span>Find Buses &amp; Timings</span>
                    </button>
                    <button
                      onClick={handleSelectPassengerCommunityUpload}
                      className="w-full py-1.5 px-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-xs">add_photo_alternate</span>
                      <span>Upload Community Roster</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bottom helper note */}
          <div className="flex items-center justify-between text-xs text-on-surface-variant pt-space-xs border-t border-surface-container mt-1">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[#ffb300]">info</span>
              <span>You can freely switch portals anytime via the header profile menu.</span>
            </div>
            <button
              onClick={handleDismiss}
              className="text-primary hover:underline font-bold"
            >
              Continue with current role ({role.toUpperCase()}) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
