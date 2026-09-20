"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { soundService } from "@/services/soundEffects";

interface RoleGateProps {
  requiredRole: UserRole;
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

export const RoleGate: React.FC<RoleGateProps> = ({
  requiredRole,
  children,
  fallbackTitle,
  fallbackMessage,
}) => {
  const { role, user, switchRole } = useAuth();
  const router = useRouter();

  if (role === requiredRole) {
    return <>{children}</>;
  }

  // If role does not match, show restriction gate
  const isOfficialRequired = requiredRole === "official";

  return (
    <div className="w-full px-space-md sm:px-space-lg py-space-xl flex flex-col items-center justify-center min-h-[70vh]">
      <div className="max-w-xl w-full bg-surface-container-low border-2 border-surface-container rounded-2xl p-space-lg sm:p-space-xl shadow-xl text-center flex flex-col items-center gap-space-md animate-in fade-in">
        {/* Shield Icon */}
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-inner ${
            isOfficialRequired
              ? "bg-[#b71c1c]/15 text-[#b71c1c] border-2 border-[#b71c1c]/30"
              : "bg-secondary-container/30 text-secondary"
          }`}
        >
          <span className="material-symbols-outlined text-4xl">
            {isOfficialRequired ? "verified_user" : "lock"}
          </span>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>Access Restricted • Role Required: {requiredRole.toUpperCase()}</span>
        </div>

        {/* Heading */}
        <h2 className="font-headline-md text-headline-md font-extrabold text-on-surface">
          {fallbackTitle || (isOfficialRequired ? "KSRTC Official Portal" : "Passenger Access Only")}
        </h2>

        {/* Message */}
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          {fallbackMessage ||
            (isOfficialRequired
              ? `You are currently logged in as a Passenger (${user.name}). This module (Roster Digitization & Verification) is reserved for authenticated KSRTC Station Masters and Depot Staff.`
              : "This section is dedicated for passenger travel and public route inquiries.")}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-space-sm w-full pt-space-sm border-t border-surface-container mt-space-xs">
          {isOfficialRequired ? (
            <>
              <button
                onClick={() => {
                  soundService.playTransitChime();
                  switchRole("official");
                }}
                className="w-full sm:w-auto flex-1 py-3 px-space-md rounded-lg bg-[#b71c1c] hover:bg-[#8f1414] text-white font-label-md text-sm font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">badge</span>
                <span>Switch to KSRTC Official</span>
              </button>

              <Link
                href="/community-upload"
                className="w-full sm:w-auto py-3 px-space-md rounded-lg bg-[#25803B] hover:bg-[#1e662f] text-white font-label-md text-sm font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">add_photo_alternate</span>
                <span>Passenger Upload</span>
              </Link>

              <Link
                href="/login"
                className="w-full sm:w-auto py-3 px-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-sm font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">login</span>
                <span>Login</span>
              </Link>
            </>
          ) : (
            <button
              onClick={() => switchRole("passenger")}
              className="w-full sm:w-auto flex-1 py-3 px-space-md rounded-lg bg-secondary hover:bg-secondary-container text-on-secondary font-label-md text-sm font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">commute</span>
              <span>Switch to Passenger Mode</span>
            </button>
          )}

          <Link
            href="/search"
            className="w-full sm:w-auto py-3 px-space-md rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-md text-sm font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">directions_bus</span>
            <span>Bus Search</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
