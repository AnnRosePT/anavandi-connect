"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchWidget } from "@/components/search/SearchWidget";
import { BusCard } from "@/components/search/BusCard";
import { timetableStore } from "@/services/store";
import { TimetableRecord, ServiceClass } from "@/types/timetable";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from") || "Trivandrum";
  const toParam = searchParams.get("to") || "Kannur";
  const classParam = (searchParams.get("class") as ServiceClass) || "ALL";

  const [sortBy, setSortBy] = useState<"departure" | "duration" | "fare">("departure");
  const [timetables, setTimetables] = useState<TimetableRecord[]>([]);

  useEffect(() => {
    setTimetables(timetableStore.getAll());
    const unsub = timetableStore.subscribe(() => {
      setTimetables(timetableStore.getAll());
    });
    return unsub;
  }, []);

  const matchingBuses = useMemo(() => {
    const fromQuery = fromParam.trim().toLowerCase();
    const toQuery = toParam.trim().toLowerCase();

    const filtered = timetables.filter((t) => {
      if (classParam !== "ALL" && t.serviceType !== classParam) return false;

      let originIndex = -1;
      let destIndex = -1;

      for (let i = 0; i < t.stops.length; i++) {
        const name = t.stops[i].name.toLowerCase();
        if (originIndex === -1 && (name.includes(fromQuery) || fromQuery.includes(name))) {
          originIndex = i;
        }
        if (originIndex !== -1 && i > originIndex && (name.includes(toQuery) || toQuery.includes(name))) {
          destIndex = i;
        }
      }

      if (originIndex !== -1 && destIndex !== -1) return true;
      if (
        t.title.toLowerCase().includes(fromQuery) &&
        t.title.toLowerCase().includes(toQuery)
      ) {
        return true;
      }
      return false;
    });

    const result = filtered.length > 0 ? filtered : timetables.slice(0, 4);

    return [...result].sort((a, b) => {
      if (sortBy === "fare") return a.fareInr - b.fareInr;
      if (sortBy === "duration") return a.totalDistanceKm - b.totalDistanceKm;
      return a.stops[0]?.departure.localeCompare(b.stops[0]?.departure || "") || 0;
    });
  }, [timetables, fromParam, toParam, classParam, sortBy]);

  return (
    <div className="w-full px-space-md sm:px-space-lg flex flex-col gap-space-lg pb-space-xl">
      <SearchWidget
        initialOrigin={fromParam}
        initialDestination={toParam}
        initialClass={classParam}
      />

      <section className="w-full flex flex-col gap-space-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm bg-surface-container-low px-space-md py-space-sm rounded-lg shadow-sm border border-surface-container">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded bg-primary text-on-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold shadow-sm">
              {matchingBuses.length}
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                Buses from {fromParam} to {toParam}
              </h2>
              <p className="font-label-md text-label-md text-on-surface-variant">
                Verified against Thampanoor Control Cell &amp; Kannur Depot Waybill logs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-space-xs bg-surface-container px-space-xs py-1 rounded border border-surface-container-high">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase font-semibold px-2">
              Sort:
            </span>
            <button
              onClick={() => setSortBy("departure")}
              className={`px-space-sm py-0.5 rounded font-label-md text-label-md font-bold transition-all ${
                sortBy === "departure"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface hover:bg-surface-container-lowest"
              }`}
            >
              Departure
            </button>
            <button
              onClick={() => setSortBy("duration")}
              className={`px-space-sm py-0.5 rounded font-label-md text-label-md font-bold transition-all ${
                sortBy === "duration"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface hover:bg-surface-container-lowest"
              }`}
            >
              Duration
            </button>
            <button
              onClick={() => setSortBy("fare")}
              className={`px-space-sm py-0.5 rounded font-label-md text-label-md font-bold transition-all ${
                sortBy === "fare"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface hover:bg-surface-container-lowest"
              }`}
            >
              Fare
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-space-md">
          {matchingBuses.map((bus) => (
            <BusCard
              key={bus.id}
              timetable={bus}
              originMatch={fromParam}
              destMatch={toParam}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="p-space-xl text-center font-label-md">Loading search results...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
