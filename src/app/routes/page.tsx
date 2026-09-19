"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { timetableStore } from "@/services/store";
import { TimetableRecord } from "@/types/timetable";

export default function RoutesPage() {
  const [timetables, setTimetables] = useState<TimetableRecord[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("KL-15-TRV-CAN-0824");

  useEffect(() => {
    setTimetables(timetableStore.getAll());
  }, []);

  const activeRoute = timetables.find((t) => t.id === selectedRouteId) || timetables[0];

  return (
    <div className="w-full px-space-md sm:px-space-lg flex flex-col gap-space-lg pb-space-xl">
      {/* Header */}
      <div className="bg-surface-container-low p-space-md rounded-xl border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">alt_route</span>
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">
              Kerala State Road Transport Corridors
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold mt-1">
            Routes &amp; Waypoint Directory
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Official KSRTC trunk lines, arterial connectors, and inter-state express routes.
          </p>
        </div>

        <Link
          href={`/map?id=${activeRoute?.id}`}
          className="px-space-md py-2 bg-primary text-on-primary rounded font-label-md text-label-md uppercase tracking-wider font-bold shadow-sm hover:brightness-110 flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">map</span>
          <span>View on Map</span>
        </Link>
      </div>

      {/* Grid: Route List (4 cols) & Route Halts Detailed Breakdown (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
        {/* Route Selector List */}
        <div className="lg:col-span-4 bg-surface-container-low p-space-md rounded-xl border border-surface-container shadow-sm space-y-2">
          <span className="font-label-md text-xs font-bold uppercase text-secondary tracking-wider block mb-2">
            Select Active Corridor ({timetables.length})
          </span>
          <div className="space-y-1.5 overflow-y-auto max-h-[600px] pr-1">
            {timetables.map((r) => {
              const isSelected = r.id === selectedRouteId;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRouteId(r.id)}
                  className={`w-full p-3 rounded-lg text-left transition-all border ${
                    isSelected
                      ? "bg-primary text-on-primary border-primary shadow-sm"
                      : "bg-surface-container hover:bg-surface-container-high border-surface-container-high text-on-surface"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-label-md mb-1">
                    <span className="font-bold">{r.serviceType}</span>
                    <span className={isSelected ? "text-on-primary/80" : "text-primary font-bold"}>
                      {r.totalDistanceKm} km
                    </span>
                  </div>
                  <div className="font-bold text-sm font-title-md">{r.title}</div>
                  <div
                    className={`text-xs mt-1 truncate ${
                      isSelected ? "text-on-primary/80" : "text-on-surface-variant"
                    }`}
                  >
                    {r.viaSummary}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Route Waypoints & Timing Profile */}
        {activeRoute && (
          <div className="lg:col-span-8 bg-surface-container-lowest p-space-lg rounded-xl border border-surface-container shadow-md flex flex-col gap-space-md">
            <div className="flex flex-wrap items-center justify-between pb-space-sm border-b border-surface-container gap-space-sm">
              <div>
                <span className="font-label-md text-xs uppercase font-bold text-secondary">
                  Corridor Profile • {activeRoute.routeCode}
                </span>
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface mt-0.5">
                  {activeRoute.title}
                </h2>
                <p className="text-xs text-on-surface-variant font-label-md">
                  Vehicle: {activeRoute.vehicleNo} ({activeRoute.chassisType}) • Depot: {activeRoute.depotOrigin}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded bg-surface-container text-right">
                  <span className="block text-[10px] font-label-md uppercase text-on-surface-variant">Est. Duration</span>
                  <span className="font-bold text-sm text-primary">{activeRoute.estimatedDuration}</span>
                </div>
                <div className="p-2 rounded bg-surface-container text-right">
                  <span className="block text-[10px] font-label-md uppercase text-on-surface-variant">Fare</span>
                  <span className="font-bold text-sm text-primary">₹{activeRoute.fareInr}</span>
                </div>
              </div>
            </div>

            {/* Waypoint Chronology Table */}
            <div className="overflow-x-auto rounded-lg border border-surface-container">
              <table className="w-full text-left font-body-md text-body-md border-collapse">
                <thead>
                  <tr className="bg-surface-container text-on-surface font-label-md text-label-md uppercase tracking-wider">
                    <th className="py-2.5 px-space-md">Halt</th>
                    <th className="py-2.5 px-space-md">Station &amp; Code</th>
                    <th className="py-2.5 px-space-md">District</th>
                    <th className="py-2.5 px-space-md">Arrival</th>
                    <th className="py-2.5 px-space-md">Departure</th>
                    <th className="py-2.5 px-space-md text-right">Platform</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/50">
                  {activeRoute.stops.map((stop, idx) => (
                    <tr key={stop.id || idx} className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-2.5 px-space-md font-label-md text-xs font-bold text-primary">
                        #{stop.seq}
                      </td>
                      <td className="py-2.5 px-space-md">
                        <div className="font-bold text-sm text-on-surface">{stop.name}</div>
                        <div className="text-[11px] font-label-md text-on-surface-variant">{stop.code}</div>
                      </td>
                      <td className="py-2.5 px-space-md text-xs text-on-surface-variant">
                        {stop.district || "Kerala"}
                      </td>
                      <td className="py-2.5 px-space-md text-xs font-label-md">
                        {stop.arrival}
                      </td>
                      <td className="py-2.5 px-space-md text-xs font-label-md font-bold text-primary">
                        {stop.departure}
                      </td>
                      <td className="py-2.5 px-space-md text-right text-xs font-label-md text-on-surface-variant">
                        {stop.platform || "Main Bay"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Action Footer */}
            <div className="flex justify-end gap-space-sm pt-space-xs border-t border-surface-container">
              <Link
                href={`/verification?id=${activeRoute.id}`}
                className="px-space-md py-2 bg-surface-container hover:bg-surface-container-high rounded font-label-md text-xs font-bold uppercase text-on-surface transition-colors"
              >
                Inspect Archival Log
              </Link>
              <Link
                href={`/map?id=${activeRoute.id}`}
                className="px-space-md py-2 bg-primary text-on-primary rounded font-label-md text-xs font-bold uppercase shadow hover:bg-primary-container transition-colors"
              >
                Launch Route GIS Map
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
