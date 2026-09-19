"use client";

import React, { useState } from "react";
import { SearchWidget } from "@/components/search/SearchWidget";
import { BusCard } from "@/components/search/BusCard";
import { timetableStore } from "@/services/store";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function SearchPage() {
  const { user, role } = useAuth();
  const [featuredTimetables] = useState(() => timetableStore.getAll().slice(0, 3));
  const isPassenger = role === "passenger";

  return (
    <div className="w-full px-space-md sm:px-space-lg flex flex-col gap-space-lg pb-space-xl">
      {/* Passenger Personalization Greeting */}
      {isPassenger && (
        <div className="bg-[#25803B]/10 border border-[#25803B]/20 rounded-xl p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25803B] text-white flex items-center justify-center font-bold">
              PS
            </div>
            <div>
              <div className="font-headline-sm text-sm sm:text-base font-bold text-on-surface">
                Namaskaram, {user.name}!
              </div>
              <div className="text-xs text-on-surface-variant flex items-center gap-2">
                <span>Frequent Commuter</span>
                {user.preferredRoute && (
                  <>
                    <span>•</span>
                    <span className="font-semibold text-[#25803B]">{user.preferredRoute}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/map"
              className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-base text-[#25803B]">map</span>
              <span>Live Fleet Map</span>
            </Link>
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface-variant flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-base">switch_account</span>
              <span>Switch Account</span>
            </Link>
          </div>
        </div>
      )}

      {/* Top Search Hero */}
      <SearchWidget />

      {/* Live Depot Board & Featured Services */}
      <div className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between bg-surface-container-low px-space-md py-space-sm rounded-lg border border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">departure_board</span>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Featured Trunk Services Synchronized Today
            </h2>
          </div>
          <span className="font-label-md text-label-md text-secondary font-bold uppercase">
            Computerized Depot Dispatch
          </span>
        </div>

        <div className="flex flex-col gap-space-md">
          {featuredTimetables.map((t) => (
            <BusCard key={t.id} timetable={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
