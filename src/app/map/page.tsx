"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { timetableStore } from "@/services/store";
import { TimetableRecord } from "@/types/timetable";
import { RouteMap } from "@/components/map/RouteMap";
import Link from "next/link";
import { exportGtfsZip } from "@/services/exportService";

function MapPageContent() {
  const searchParams = useSearchParams();
  const routeIdParam = searchParams.get("id");

  const [allTimetables, setAllTimetables] = useState<TimetableRecord[]>([]);
  const [selectedTimetable, setSelectedTimetable] = useState<TimetableRecord>(() => {
    return routeIdParam
      ? timetableStore.getById(routeIdParam) || timetableStore.getActive()
      : timetableStore.getActive();
  });
  const [selectedStopIndex, setSelectedStopIndex] = useState<number>(0);

  useEffect(() => {
    setAllTimetables(timetableStore.getAll());
    if (routeIdParam) {
      const found = timetableStore.getById(routeIdParam);
      if (found) setSelectedTimetable(found);
    }
  }, [routeIdParam]);

  const handleSelectRoute = (id: string) => {
    const found = timetableStore.getById(id);
    if (found) {
      setSelectedTimetable(found);
      setSelectedStopIndex(0);
    }
  };

  return (
    <div className="w-full px-space-md sm:px-space-lg flex flex-col gap-space-md pb-space-xl">
      <div className="bg-surface-container-low p-space-md rounded-xl border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">alt_route</span>
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">
              Geospatial Telemetry Layer
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold mt-1">
            Interactive Route Map
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Explore active digitized transit lines across Kerala’s 14 districts on OpenStreetMap.
          </p>
        </div>

        <div className="flex items-center gap-space-sm">
          <label className="text-xs font-label-md uppercase font-bold text-on-surface-variant hidden sm:block">
            Select Corridor:
          </label>
          <select
            className="px-3 py-2 bg-surface-container rounded-lg font-title-md text-sm text-on-surface border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            value={selectedTimetable.id}
            onChange={(e) => handleSelectRoute(e.target.value)}
          >
            {allTimetables.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.totalDistanceKm} km)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
        <div className="lg:col-span-8 flex flex-col gap-space-sm">
          <RouteMap
            timetable={selectedTimetable}
            selectedStopIndex={selectedStopIndex}
            onSelectStop={(idx) => setSelectedStopIndex(idx)}
            className="h-[620px]"
          />
        </div>

        <div className="lg:col-span-4 bg-surface-container-low rounded-xl p-space-md shadow-md border border-surface-container flex flex-col gap-space-sm">
          <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
            <div>
              <span className="font-label-md text-xs uppercase font-bold text-primary block">
                {selectedTimetable.serviceName}
              </span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {selectedTimetable.title}
              </h3>
            </div>
            <span className="font-label-md text-xs px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-bold">
              {selectedTimetable.estimatedDuration}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-label-md text-on-surface-variant">
            <span>Chassis: {selectedTimetable.chassisType}</span>
            <span>Tariff: ₹{selectedTimetable.fareInr}</span>
          </div>

          <div className="space-y-1.5 overflow-y-auto max-h-[440px] pr-1 mt-space-xs">
            {selectedTimetable.stops.map((stop, idx) => {
              const isSelected = selectedStopIndex === idx;
              const isOrigin = idx === 0;
              const isTerminus = idx === selectedTimetable.stops.length - 1;

              return (
                <div
                  key={stop.id || idx}
                  onClick={() => setSelectedStopIndex(idx)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-primary text-on-primary border-primary shadow-sm"
                      : "bg-surface-container hover:bg-surface-container-high border-surface-container-high text-on-surface"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        isSelected
                          ? "bg-surface-container-lowest text-primary"
                          : isOrigin
                          ? "bg-secondary-container text-on-secondary-container"
                          : isTerminus
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container-high text-on-surface"
                      }`}
                    >
                      {isOrigin ? "A" : isTerminus ? "B" : idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-xs">{stop.name}</div>
                      <div
                        className={`text-[10px] font-label-md ${
                          isSelected ? "text-on-primary/80" : "text-on-surface-variant"
                        }`}
                      >
                        {stop.code}
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <div className="font-bold">{stop.departure}</div>
                    <div
                      className={`text-[10px] ${
                        isSelected ? "text-on-primary/75" : "text-on-surface-variant"
                      }`}
                    >
                      {stop.arrival !== "—" ? `Arr: ${stop.arrival}` : "Origin"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-space-xs border-t border-surface-container flex gap-space-xs">
            <Link
              href={`/verification?id=${selectedTimetable.id}`}
              className="flex-1 py-2 px-2 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-center font-label-md text-xs font-bold uppercase transition-colors"
            >
              Verify Timetable
            </Link>
            <button
              onClick={() => exportGtfsZip(selectedTimetable)}
              className="py-2 px-3 rounded bg-primary text-on-primary text-center font-label-md text-xs font-bold uppercase transition-colors flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-xs">download</span>
              <span>GTFS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="p-space-xl text-center font-label-md">Loading route map...</div>}>
      <MapPageContent />
    </Suspense>
  );
}
