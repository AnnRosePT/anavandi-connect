"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { timetableStore } from "@/services/store";
import { TimetableRecord, TimetableStatus } from "@/types/timetable";
import { exportTimetableCsv, exportTimetableJson, exportGtfsZip } from "@/services/exportService";

export default function TimetableLibraryPage() {
  const [timetables, setTimetables] = useState<TimetableRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [serviceFilter, setServiceFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  useEffect(() => {
    setTimetables(timetableStore.getAll());
    const unsub = timetableStore.subscribe(() => {
      setTimetables(timetableStore.getAll());
    });
    return unsub;
  }, []);

  const filteredTimetables = useMemo(() => {
    return timetables.filter((t) => {
      if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
      if (serviceFilter !== "ALL" && t.serviceType !== serviceFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesOrigin = t.origin.toLowerCase().includes(q);
        const matchesDest = t.destination.toLowerCase().includes(q);
        const matchesId = t.id.toLowerCase().includes(q);
        const matchesStop = t.stops.some((s) => s.name.toLowerCase().includes(q));
        return matchesTitle || matchesOrigin || matchesDest || matchesId || matchesStop;
      }
      return true;
    });
  }, [timetables, searchQuery, statusFilter, serviceFilter]);

  return (
    <div className="w-full px-space-md sm:px-space-lg flex flex-col gap-space-lg pb-space-xl">
      {/* Header */}
      <div className="bg-surface-container-low p-space-md rounded-xl border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">menu_book</span>
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">
              Central Depot Repository
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold mt-1">
            Timetable Library
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Explore, filter, verify, and export all ingested Kerala State Road Transport schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/upload"
            className="px-space-md py-2 bg-primary text-on-primary rounded font-label-md text-label-md uppercase tracking-wider font-bold shadow-sm hover:brightness-110 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">upload_file</span>
            <span>Upload New</span>
          </Link>
          <Link
            href="/compare"
            className="px-space-md py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-label-md text-label-md uppercase tracking-wider font-bold shadow-sm flex items-center gap-1.5 border border-surface-container-high"
          >
            <span className="material-symbols-outlined text-base">difference</span>
            <span>Compare Versions</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container shadow-sm flex flex-wrap items-center justify-between gap-space-sm">
        <div className="relative flex-1 min-w-[240px]">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-base">
            search
          </span>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 bg-surface-container rounded-lg text-sm text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search by route, stop name, depot, or schedule ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            className="px-3 py-2 bg-surface-container rounded-lg text-xs font-label-md uppercase font-bold text-on-surface border border-surface-container-high outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="VERIFIED">Verified Only</option>
            <option value="PENDING_VERIFICATION">Pending Review</option>
            <option value="DRAFT">Drafts</option>
          </select>

          {/* Service Filter */}
          <select
            className="px-3 py-2 bg-surface-container rounded-lg text-xs font-label-md uppercase font-bold text-on-surface border border-surface-container-high outline-none"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
          >
            <option value="ALL">All Services</option>
            <option value="SUPER_FAST">Super Fast</option>
            <option value="FAST_PASSENGER">Fast Passenger</option>
            <option value="MINNAL">Minnal</option>
            <option value="EXPRESS">Express</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-surface-container rounded p-0.5 border border-surface-container-high">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "table" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"
              }`}
              title="Table View"
            >
              <span className="material-symbols-outlined text-base">table_rows</span>
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "cards" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"
              }`}
              title="Card Grid View"
            >
              <span className="material-symbols-outlined text-base">grid_view</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results View */}
      {viewMode === "table" ? (
        <div className="bg-surface-container-low rounded-xl p-space-md shadow-md border border-surface-container overflow-hidden">
          <div className="overflow-x-auto rounded-lg bg-surface-container-lowest border border-surface-container">
            <table className="w-full text-left font-body-md text-body-md border-collapse">
              <thead>
                <tr className="bg-surface-container text-on-surface font-label-md text-label-md uppercase tracking-wider">
                  <th className="py-2.5 px-space-md">Trip &amp; Route</th>
                  <th className="py-2.5 px-space-md">Origin → Terminus</th>
                  <th className="py-2.5 px-space-md">Class</th>
                  <th className="py-2.5 px-space-md text-center">Stops</th>
                  <th className="py-2.5 px-space-md text-center">Distance</th>
                  <th className="py-2.5 px-space-md text-center">AI Confidence</th>
                  <th className="py-2.5 px-space-md text-center">Status</th>
                  <th className="py-2.5 px-space-md text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/50">
                {filteredTimetables.map((t) => (
                  <tr key={t.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-3 px-space-md">
                      <div className="font-bold text-on-surface font-title-md">{t.title}</div>
                      <div className="font-label-md text-xs text-on-surface-variant font-mono">
                        {t.id}
                      </div>
                    </td>
                    <td className="py-3 px-space-md">
                      <div className="font-medium text-on-surface">
                        {t.origin} → {t.destination}
                      </div>
                      <div className="text-xs text-on-surface-variant">{t.viaSummary}</div>
                    </td>
                    <td className="py-3 px-space-md">
                      <span className="px-2 py-0.5 rounded font-label-md text-xs font-bold bg-surface-container text-on-surface">
                        {t.serviceType}
                      </span>
                    </td>
                    <td className="py-3 px-space-md text-center font-bold font-label-md">
                      {t.stops.length}
                    </td>
                    <td className="py-3 px-space-md text-center font-label-md text-xs">
                      {t.totalDistanceKm} km
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
                      {t.status === "VERIFIED" ? (
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-md text-xs font-semibold inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-primary">check_circle</span>
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-secondary text-on-secondary font-label-md text-xs font-bold inline-flex items-center gap-1">
                          Pending Review
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-space-md text-right space-x-1 whitespace-nowrap">
                      <Link
                        href={`/verification?id=${t.id}`}
                        className="px-2 py-1 bg-surface-container hover:bg-primary hover:text-on-primary rounded font-label-md text-xs font-bold uppercase transition-colors inline-block"
                      >
                        Verify
                      </Link>
                      <Link
                        href={`/map?id=${t.id}`}
                        className="px-2 py-1 bg-surface-container hover:bg-secondary hover:text-on-secondary rounded font-label-md text-xs font-bold uppercase transition-colors inline-block"
                      >
                        Map
                      </Link>
                      <button
                        onClick={() => exportTimetableCsv(t)}
                        className="p-1 hover:text-primary transition-colors text-on-surface-variant"
                        title="Export CSV"
                      >
                        <span className="material-symbols-outlined text-sm">download</span>
                      </button>
                      <button
                        onClick={() => exportGtfsZip(t)}
                        className="p-1 hover:text-primary transition-colors text-on-surface-variant"
                        title="Export GTFS Zip"
                      >
                        <span className="material-symbols-outlined text-sm">folder_zip</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {filteredTimetables.map((t) => (
            <div
              key={t.id}
              className="bg-surface-container-lowest rounded-xl p-space-md shadow-md border border-surface-container flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-label-md text-xs font-bold uppercase">
                    {t.serviceType}
                  </span>
                  <span className="font-label-md text-xs text-on-surface-variant">{t.id}</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
                  {t.title}
                </h3>
                <p className="text-xs text-on-surface-variant mb-space-sm">{t.viaSummary}</p>
                <div className="flex items-center justify-between text-xs font-label-md py-1 border-t border-b border-surface-container mb-space-sm">
                  <span>{t.stops.length} Scheduled Stops</span>
                  <span>{t.estimatedDuration}</span>
                  <span className="font-bold text-primary">₹{t.fareInr}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 pt-space-xs">
                <Link
                  href={`/verification?id=${t.id}`}
                  className="flex-1 py-1.5 bg-primary text-on-primary rounded text-center text-xs font-bold uppercase font-label-md"
                >
                  Verify
                </Link>
                <Link
                  href={`/map?id=${t.id}`}
                  className="px-3 py-1.5 bg-surface-container text-on-surface rounded text-center text-xs font-bold uppercase font-label-md"
                >
                  Map
                </Link>
                <button
                  onClick={() => exportGtfsZip(t)}
                  className="px-2.5 py-1.5 bg-secondary text-on-secondary rounded text-xs font-bold"
                  title="Export GTFS"
                >
                  GTFS
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
