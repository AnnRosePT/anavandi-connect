"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SearchWidget } from "@/components/search/SearchWidget";
import { BusCard } from "@/components/search/BusCard";
import { timetableStore } from "@/services/store";
import { TimetableRecord, ServiceClass } from "@/types/timetable";
import { matchesPlace } from "@/services/locationUtils";

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
    const fromQuery = fromParam.trim();
    const toQuery = toParam.trim();

    const filtered = timetables.filter((t) => {
      if (classParam !== "ALL" && t.serviceType !== classParam) return false;

      let originIndex = -1;
      let destIndex = -1;

      for (let i = 0; i < t.stops.length; i++) {
        const stop = t.stops[i];
        if (originIndex === -1 && matchesPlace(stop.name, fromQuery)) {
          originIndex = i;
        }
        if (originIndex !== -1 && i > originIndex && matchesPlace(stop.name, toQuery)) {
          destIndex = i;
          break;
        }
      }

      if (originIndex !== -1 && destIndex !== -1) return true;

      // Also check route origin/destination directly
      if (matchesPlace(t.origin, fromQuery) && matchesPlace(t.destination, toQuery)) {
        return true;
      }

      return false;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "fare") return a.fareInr - b.fareInr;
      if (sortBy === "duration") return a.totalDistanceKm - b.totalDistanceKm;
      const getDep = (item: TimetableRecord) => {
        const stop = item.stops.find((s) => matchesPlace(s.name, fromQuery)) || item.stops[0];
        return stop?.departure && stop.departure !== "—" ? stop.departure : stop?.arrival || "";
      };
      return getDep(a).localeCompare(getDep(b));
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
                Verified against KSRTC computerized depot schedule logs
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

        {matchingBuses.length === 0 ? (
          <div className="bg-surface-container-low p-space-xl rounded-xl border border-surface-container text-center flex flex-col items-center justify-center gap-space-sm shadow-sm py-12">
            <div className="w-16 h-16 rounded-full bg-secondary-container/50 text-secondary flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-3xl">directions_bus</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              No Direct Services Found
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              No digitized bus route currently connects <strong className="text-on-surface">{fromParam}</strong> directly to <strong className="text-on-surface">{toParam}</strong> in our database.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">Try popular routes:</span>
              <Link
                href="/search/results?from=Trivandrum&to=Kannur"
                className="px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded text-xs font-bold text-primary transition-colors"
              >
                Trivandrum → Kannur
              </Link>
              <Link
                href="/search/results?from=Thrissur&to=Ernakulam"
                className="px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded text-xs font-bold text-primary transition-colors"
              >
                Thrissur → Ernakulam
              </Link>
              <Link
                href="/search/results?from=Trivandrum&to=Palakkad"
                className="px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded text-xs font-bold text-primary transition-colors"
              >
                Trivandrum → Palakkad
              </Link>
              <Link
                href="/search/results?from=Trivandrum&to=Munnar"
                className="px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded text-xs font-bold text-primary transition-colors"
              >
                Trivandrum → Munnar
              </Link>
              <Link
                href="/search/results?from=Kannur&to=Trivandrum"
                className="px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded text-xs font-bold text-primary transition-colors"
              >
                Kannur → Trivandrum (Southbound)
              </Link>
            </div>
          </div>
        ) : (
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
        )}
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
