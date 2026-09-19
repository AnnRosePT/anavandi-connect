"use client";

import React, { useState } from "react";
import { SearchWidget } from "@/components/search/SearchWidget";
import { BusCard } from "@/components/search/BusCard";
import { timetableStore } from "@/services/store";

export default function SearchPage() {
  const [featuredTimetables] = useState(() => timetableStore.getAll().slice(0, 3));

  return (
    <div className="w-full px-space-md sm:px-space-lg flex flex-col gap-space-lg pb-space-xl">
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
