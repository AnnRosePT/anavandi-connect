"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { timetableStore } from "@/services/store";
import { TimetableRecord } from "@/types/timetable";
import { useLanguage } from "@/contexts/LanguageContext";
import { exportTimetableCsv, exportGtfsZip } from "@/services/exportService";
import { RoleGate } from "@/components/auth/RoleGate";

export default function DashboardPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalDigitized: 1248,
    pendingVerification: 37,
    routesProcessed: 486,
    avgConfidence: 96.8,
  });
  const [timetables, setTimetables] = useState<TimetableRecord[]>([]);

  useEffect(() => {
    const update = () => {
      setStats(timetableStore.getStats());
      setTimetables(timetableStore.getAll());
    };
    update();
    const unsubscribe = timetableStore.subscribe(update);
    return unsubscribe;
  }, []);

  return (
    <RoleGate
      requiredRole="official"
      fallbackTitle="Operations Dashboard (Prototype)"
      fallbackMessage="This is a prototype dashboard for the Anavandi Connect Hackathon."
    >
      <div className="w-full px-space-md sm:px-space-lg flex flex-col gap-space-lg pb-space-xl">
      {/* Top Banner */}
      <div className="telemetry-scan-bar flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-low p-space-md rounded-xl border border-surface-container shadow-sm animate-fade-in-down">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#b71c1c] animate-radar-red"></span>
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold flex items-center gap-1.5">
              <span>Operations Dashboard (Prototype)</span>
              <span className="text-[10px] bg-secondary-container/40 px-1.5 py-0.2 rounded font-mono text-on-secondary-container">LIVE TELEMETRY</span>
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold mt-1">
            Kerala RTC Transit Telemetry
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Live ingestion monitoring, schedule anomaly queue, and GTFS distribution feed status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <Link
            href="/upload"
            className="btn-tactile px-space-md py-2 bg-primary text-on-primary rounded font-label-md text-label-md uppercase tracking-wider font-bold shadow-md hover:shadow-lg hover:bg-primary-container flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-base animate-bus-cruise">upload_file</span>
            <span>Digitize Roster</span>
          </Link>
          <Link
            href="/verification"
            className="btn-tactile px-space-md py-2 bg-secondary text-on-secondary rounded font-label-md text-label-md uppercase tracking-wider font-bold shadow-md hover:shadow-lg hover:bg-secondary-container hover:text-on-secondary-container flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-base">fact_check</span>
            <span>Review Queue ({stats.pendingVerification})</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="card-interactive bg-surface-container p-space-md rounded-xl shadow-sm border border-surface-container-high flex flex-col justify-between animate-fade-in-up stagger-1 cursor-default">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md uppercase text-on-surface-variant font-bold">
              Timetables Digitized
            </span>
            <span className="material-symbols-outlined text-primary text-xl">dataset</span>
          </div>
          <div className="my-space-sm flex items-baseline gap-2">
            <span className="font-display-lg text-display-lg text-primary font-extrabold">
              {stats.totalDigitized.toLocaleString()}
            </span>
            <span className="shimmer-badge font-label-md text-label-md text-secondary font-bold px-1.5 py-0.5 rounded bg-secondary-container/30 border border-secondary-container">+12 today</span>
          </div>
          <span className="font-body-md text-xs text-on-surface-variant">
            State-wide depot registers ingested
          </span>
        </div>

        <div className="card-interactive bg-surface-container p-space-md rounded-xl shadow-sm border border-secondary/30 flex flex-col justify-between relative overflow-hidden animate-fade-in-up stagger-2 cursor-default">
          <div className="absolute top-0 right-0 w-16 h-16 bg-secondary-container/20 rounded-bl-full pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md uppercase text-on-surface-variant font-bold">
              Pending Verification
            </span>
            <span className="material-symbols-outlined text-secondary text-xl">fact_check</span>
          </div>
          <div className="my-space-sm flex items-baseline gap-2">
            <span className="font-display-lg text-display-lg text-secondary font-extrabold">
              {stats.pendingVerification}
            </span>
            <span className="shimmer-badge font-label-md text-label-md bg-secondary-container px-2 py-0.5 rounded font-bold text-on-secondary-container border border-secondary/20 animate-pulse">
              Requires Sign-off
            </span>
          </div>
          <span className="font-body-md text-xs text-on-surface-variant">
            Awaiting station master or inspector review
          </span>
        </div>

        <div className="card-interactive bg-surface-container p-space-md rounded-xl shadow-sm border border-surface-container-high flex flex-col justify-between animate-fade-in-up stagger-3 cursor-default">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md uppercase text-on-surface-variant font-bold">
              Routes Processed
            </span>
            <span className="material-symbols-outlined text-primary text-xl">alt_route</span>
          </div>
          <div className="my-space-sm flex items-baseline gap-2">
            <span className="font-display-lg text-display-lg text-primary font-extrabold">
              {stats.routesProcessed}
            </span>
            <span className="font-label-md text-label-md text-secondary font-bold">Corridors</span>
          </div>
          <span className="font-body-md text-xs text-on-surface-variant">
            NH66, MC Road, Ghat routes &amp; Inter-State
          </span>
        </div>

        <div className="card-interactive bg-surface-container p-space-md rounded-xl shadow-sm border border-surface-container-high flex flex-col justify-between animate-fade-in-up stagger-4 cursor-default">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md uppercase text-on-surface-variant font-bold">
              Average AI Confidence
            </span>
            <span className="material-symbols-outlined text-secondary text-xl">analytics</span>
          </div>
          <div className="my-space-sm flex items-baseline gap-2">
            <span className="font-display-lg text-display-lg text-secondary font-extrabold">
              {stats.avgConfidence}%
            </span>
            <span className="font-label-md text-label-md text-primary font-bold">High Precision</span>
          </div>
          <span className="font-body-md text-xs text-on-surface-variant">
            Across printed, typewriter and handwritten logs
          </span>
        </div>
      </div>

      {/* Recent Timetables Ingestion Table */}
      <div className="bg-surface-container-low rounded-xl p-space-md shadow-md border border-surface-container flex flex-col gap-space-sm animate-fade-in-up stagger-5">
        <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary animate-pulse">schedule</span>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Recent Timetables &amp; Ingestion Stream
            </h2>
          </div>
          <Link
            href="/timetables"
            className="btn-tactile font-label-md text-label-md uppercase text-secondary hover:text-primary font-bold transition-colors flex items-center gap-1"
          >
            <span>View All ({timetables.length})</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="overflow-x-auto rounded-lg bg-surface-container-lowest border border-surface-container shadow-inner">
          <table className="w-full text-left font-body-md text-body-md border-collapse">
            <thead>
              <tr className="bg-surface-container text-on-surface font-label-md text-label-md uppercase tracking-wider">
                <th className="py-2.5 px-space-md">Trip ID &amp; Route</th>
                <th className="py-2.5 px-space-md">Origin → Terminus</th>
                <th className="py-2.5 px-space-md">Service Class</th>
                <th className="py-2.5 px-space-md text-center">Halts</th>
                <th className="py-2.5 px-space-md text-center">AI Confidence</th>
                <th className="py-2.5 px-space-md text-center">Status</th>
                <th className="py-2.5 px-space-md text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container/50">
              {timetables.map((t) => {
                const isPending = t.status === "PENDING_VERIFICATION" || t.status === "DRAFT";
                return (
                  <tr key={t.id} className="hover:bg-surface-container-low transition-all hover:scale-[1.002]">
                    <td className="py-3 px-space-md">
                      <div className="font-bold text-on-surface font-title-md">{t.title}</div>
                      <div className="font-label-md text-xs text-on-surface-variant font-mono">
                        {t.id} • {t.vehicleNo}
                      </div>
                    </td>
                    <td className="py-3 px-space-md">
                      <div className="font-medium text-on-surface">
                        {t.origin} → {t.destination}
                      </div>
                      <div className="text-xs text-on-surface-variant truncate max-w-xs">
                        {t.viaSummary}
                      </div>
                    </td>
                    <td className="py-3 px-space-md">
                      <span className="px-2 py-0.5 rounded font-label-md text-xs font-bold bg-surface-container text-on-surface">
                        {t.serviceType}
                      </span>
                    </td>
                    <td className="py-3 px-space-md text-center font-bold font-label-md">
                      {t.stops.length} stops
                    </td>
                    <td className="py-3 px-space-md text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded font-label-md text-xs font-bold ${
                          t.overallConfidence >= 95
                            ? "bg-surface-container text-primary"
                            : "bg-secondary-container text-on-secondary-container"
                        }`}
                      >
                        {t.overallConfidence}%
                      </span>
                    </td>
                    <td className="py-3 px-space-md text-center">
                      {isPending ? (
                        <span className="px-2 py-0.5 rounded bg-secondary text-on-secondary font-label-md text-xs font-bold inline-flex items-center gap-1.5 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-surface animate-ping"></span>
                          Pending Sign-off
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-md text-xs font-semibold inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-primary">check_circle</span>
                          Verified
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-space-md text-right space-x-1">
                      <Link
                        href={`/verification?id=${t.id}`}
                        className="btn-tactile px-2.5 py-1 bg-surface-container hover:bg-primary hover:text-on-primary rounded font-label-md text-xs font-bold uppercase transition-all inline-block shadow-sm"
                      >
                        Verify
                      </Link>
                      <Link
                        href={`/map?id=${t.id}`}
                        className="btn-tactile px-2.5 py-1 bg-surface-container hover:bg-secondary hover:text-on-secondary rounded font-label-md text-xs font-bold uppercase transition-all inline-block shadow-sm"
                      >
                        Map
                      </Link>
                      <button
                        onClick={() => exportTimetableCsv(t)}
                        className="btn-tactile p-1 hover:text-primary transition-all text-on-surface-variant align-middle hover:scale-110 active:scale-95"
                        title="Export CSV"
                      >
                        <span className="material-symbols-outlined text-sm">download</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </RoleGate>
  );
}
