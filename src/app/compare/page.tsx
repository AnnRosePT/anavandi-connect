"use client";

import React, { useState, useEffect } from "react";
import { timetableStore } from "@/services/store";
import { TimetableRecord } from "@/types/timetable";

export default function ComparePage() {
  const [timetables, setTimetables] = useState<TimetableRecord[]>([]);
  const [timetableAId, setTimetableAId] = useState<string>("KL-15-TRV-CAN-0824");
  const [timetableBId, setTimetableBId] = useState<string>("KL-15-TRV-CAN-MN02");

  useEffect(() => {
    const all = timetableStore.getAll();
    setTimetables(all);
    if (all.length >= 2) {
      setTimetableAId(all[0].id);
      setTimetableBId(all[1].id);
    }
  }, []);

  const tA = timetables.find((t) => t.id === timetableAId) || timetables[0];
  const tB = timetables.find((t) => t.id === timetableBId) || timetables[1] || timetables[0];

  return (
    <div className="w-full px-space-md sm:px-space-lg flex flex-col gap-space-lg pb-space-xl">
      {/* Top Banner */}
      <div className="bg-surface-container-low p-space-md rounded-xl border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">difference</span>
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">
              Schedule Difference Analyzer
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold mt-1">
            Timetable Comparison &amp; Revision Diff
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Cross-compare archival printed rosters, conductor modifications, and updated GTFS schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-green-100 text-green-900 border border-green-300 font-label-md text-xs font-bold">
            Green: Unchanged
          </span>
          <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 font-label-md text-xs font-bold">
            Gold: Modified
          </span>
          <span className="px-2.5 py-1 rounded bg-red-100 text-red-900 border border-red-300 font-label-md text-xs font-bold">
            Red: Variance
          </span>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {/* Selector A */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container shadow-sm flex flex-col gap-2">
          <label className="text-xs font-label-md uppercase font-bold text-primary">
            Base Schedule (Version A)
          </label>
          <select
            className="w-full px-3 py-2 bg-surface-container rounded-lg text-sm text-on-surface font-bold border border-surface-container-high outline-none"
            value={timetableAId}
            onChange={(e) => setTimetableAId(e.target.value)}
          >
            {timetables.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.id} - {t.serviceType})
              </option>
            ))}
          </select>
          {tA && (
            <div className="flex items-center justify-between text-xs font-label-md text-on-surface-variant pt-1">
              <span>{tA.stops.length} Stops</span>
              <span>{tA.estimatedDuration}</span>
              <span>₹{tA.fareInr}</span>
            </div>
          )}
        </div>

        {/* Selector B */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container shadow-sm flex flex-col gap-2">
          <label className="text-xs font-label-md uppercase font-bold text-secondary">
            Comparison Schedule (Version B)
          </label>
          <select
            className="w-full px-3 py-2 bg-surface-container rounded-lg text-sm text-on-surface font-bold border border-surface-container-high outline-none"
            value={timetableBId}
            onChange={(e) => setTimetableBId(e.target.value)}
          >
            {timetables.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.id} - {t.serviceType})
              </option>
            ))}
          </select>
          {tB && (
            <div className="flex items-center justify-between text-xs font-label-md text-on-surface-variant pt-1">
              <span>{tB.stops.length} Stops</span>
              <span>{tB.estimatedDuration}</span>
              <span>₹{tB.fareInr}</span>
            </div>
          )}
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      {tA && tB && (
        <div className="bg-surface-container-low rounded-xl p-space-md shadow-md border border-surface-container overflow-hidden">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-sm">
            Waypoint Timing &amp; Station Sequence Diff
          </h3>

          <div className="overflow-x-auto rounded-lg bg-surface-container-lowest border border-surface-container">
            <table className="w-full text-left font-body-md text-body-md border-collapse">
              <thead>
                <tr className="bg-surface-container text-on-surface font-label-md text-label-md uppercase tracking-wider">
                  <th className="py-2.5 px-3">Halt</th>
                  <th className="py-2.5 px-3">Version A Stop</th>
                  <th className="py-2.5 px-3">A (Arr / Dep)</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3">Version B Stop</th>
                  <th className="py-2.5 px-3">B (Arr / Dep)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/50">
                {Array.from({ length: Math.max(tA.stops.length, tB.stops.length) }).map(
                  (_, idx) => {
                    const stopA = tA.stops[idx];
                    const stopB = tB.stops[idx];

                    let matchType: "same" | "diff" | "missing" = "same";
                    if (!stopA || !stopB) {
                      matchType = "missing";
                    } else if (stopA.name !== stopB.name || stopA.departure !== stopB.departure) {
                      matchType = "diff";
                    }

                    const rowBg =
                      matchType === "same"
                        ? "bg-green-50/50 hover:bg-green-100/50"
                        : matchType === "diff"
                        ? "bg-amber-50/70 hover:bg-amber-100/70"
                        : "bg-red-50/60 hover:bg-red-100/60";

                    return (
                      <tr key={idx} className={`transition-colors text-xs font-label-md ${rowBg}`}>
                        <td className="py-2.5 px-3 font-bold text-on-surface-variant">
                          #{idx + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          {stopA ? (
                            <div>
                              <div className="font-bold text-sm text-on-surface font-body-md">
                                {stopA.name}
                              </div>
                              <div className="text-[10px] text-on-surface-variant">{stopA.code}</div>
                            </div>
                          ) : (
                            <span className="text-error italic font-bold">None (Terminal end)</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-on-surface">
                          {stopA ? `${stopA.arrival} / ${stopA.departure}` : "—"}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {matchType === "same" ? (
                            <span className="px-2 py-0.5 rounded bg-green-200 text-green-900 font-bold">
                              EQUAL
                            </span>
                          ) : matchType === "diff" ? (
                            <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">
                              MODIFIED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-red-200 text-red-900 font-bold">
                              VARIANCE
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          {stopB ? (
                            <div>
                              <div className="font-bold text-sm text-on-surface font-body-md">
                                {stopB.name}
                              </div>
                              <div className="text-[10px] text-on-surface-variant">{stopB.code}</div>
                            </div>
                          ) : (
                            <span className="text-error italic font-bold">None (Terminal end)</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-primary">
                          {stopB ? `${stopB.arrival} / ${stopB.departure}` : "—"}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
