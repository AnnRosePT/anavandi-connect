"use client";

import React from "react";
import Link from "next/link";
import { TimetableRecord } from "@/types/timetable";

interface BusCardProps {
  timetable: TimetableRecord;
  originMatch?: string;
  destMatch?: string;
}

export const BusCard: React.FC<BusCardProps> = ({
  timetable,
  originMatch,
  destMatch,
}) => {
  const originStop = timetable.stops[0];
  const destStop = timetable.stops[timetable.stops.length - 1];

  const isMinnal = timetable.serviceType === "MINNAL";
  const isSuperFast = timetable.serviceType === "SUPER_FAST";

  const ribbonColor = isMinnal ? "bg-primary" : "bg-secondary-container";
  const badgeColor = isMinnal
    ? "bg-primary-container text-on-primary"
    : isSuperFast
    ? "bg-primary text-on-primary"
    : "bg-surface-variant text-on-surface";

  return (
    <article className="relative bg-surface-container-lowest rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden flex flex-col xl:flex-row border border-surface-container">
      {/* Left Heritage Accent Ribbon */}
      <div className={`w-full xl:w-2.5 ${ribbonColor} h-2.5 xl:h-auto`}></div>

      {/* Left Header Block */}
      <div className="p-space-md xl:w-80 bg-surface-container-low flex flex-col justify-between border-b xl:border-b-0 xl:border-r border-surface-container">
        <div>
          <div className="flex items-center justify-between gap-space-xs mb-2">
            <span
              className={`px-space-xs py-0.5 rounded font-label-md text-label-md font-bold tracking-wider uppercase flex items-center gap-1 ${badgeColor}`}
            >
              {isMinnal && <span className="material-symbols-outlined text-xs">bolt</span>}
              {timetable.serviceName.split(" ")[0]} {timetable.serviceName.split(" ")[1] || ""}
            </span>
            <span className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wider">
              {timetable.serviceNameMl || "ആനവണ്ടി"}
            </span>
          </div>

          <div className="flex items-center gap-space-xs mb-1">
            <span className="font-headline-sm text-headline-sm font-extrabold text-on-surface">
              #{timetable.tripId.split("-").pop() || "SF-104"}
            </span>
            <span className="px-space-xs py-0.5 rounded bg-secondary-container/40 text-on-secondary-container font-label-md text-label-md font-semibold truncate">
              {timetable.chassisType}
            </span>
          </div>

          <p className="font-label-md text-label-md text-on-surface-variant font-medium">
            Depot: {timetable.depotOrigin}
          </p>
        </div>

        <div className="mt-space-md pt-space-sm bg-surface-container/50 p-space-xs rounded">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase font-semibold">
              Data Confidence
            </span>
            <span className="font-label-md text-label-md text-primary font-bold">
              {timetable.overallConfidence}% {timetable.status === "VERIFIED" ? "Verified" : "Pending Review"}
            </span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isMinnal ? "bg-secondary" : "bg-primary"}`}
              style={{ width: `${timetable.overallConfidence}%` }}
            ></div>
          </div>
          <p className="font-label-md text-label-md text-on-surface-variant mt-1 text-right truncate">
            {timetable.viaSummary}
          </p>
        </div>
      </div>

      {/* Middle Journey Schedule Diagram */}
      <div className="p-space-md flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md items-center mb-space-md">
          {/* Departure */}
          <div className="flex flex-col">
            <span className="font-headline-lg text-headline-lg font-extrabold text-primary leading-none">
              {originStop?.departure || "06:30 AM"}
            </span>
            <span className="font-title-md text-title-md font-bold text-on-surface mt-1">
              {originMatch || originStop?.name || "Origin"}
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant">
              {originStop?.platform || "Main Terminal Bay"}
            </span>
          </div>

          {/* Route Duration Timeline */}
          <div className="flex flex-col items-center justify-center px-space-xs">
            <span className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wider mb-1">
              {timetable.estimatedDuration} Duration
            </span>
            <div className="w-full flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
              <div className="h-0.5 flex-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
              <span className="material-symbols-outlined text-secondary text-base">
                directions_bus
              </span>
              <div className="h-0.5 flex-1 bg-gradient-to-r from-secondary via-primary to-primary"></div>
              <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant mt-1">
              {timetable.stops.length} Scheduled Halts ({timetable.totalDistanceKm} km)
            </span>
          </div>

          {/* Arrival */}
          <div className="flex flex-col md:text-right">
            <span className="font-headline-lg text-headline-lg font-extrabold text-on-surface leading-none">
              {destStop?.arrival || "03:15 PM"}
            </span>
            <span className="font-title-md text-title-md font-bold text-on-surface mt-1">
              {destMatch || destStop?.name || "Terminus"}
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant">
              {destStop?.platform || "Arrival Terminal"}
            </span>
          </div>
        </div>

        {/* Halts Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-on-surface-variant bg-surface-container-low px-space-sm py-1.5 rounded">
          <span className="font-label-md text-label-md uppercase font-bold text-primary mr-1">
            Stops:
          </span>
          {timetable.stops.slice(0, 7).map((s, idx) => (
            <React.Fragment key={s.id || idx}>
              <span className="font-label-md text-label-md">{s.name}</span>
              {idx < Math.min(timetable.stops.length - 1, 6) && (
                <span className="text-outline">→</span>
              )}
            </React.Fragment>
          ))}
          {timetable.stops.length > 7 && (
            <span className="font-label-md text-label-md text-secondary font-bold">
              +{timetable.stops.length - 7} more
            </span>
          )}
        </div>
      </div>

      {/* Right Side Fare & Reservation Action */}
      <div className="p-space-md xl:w-64 bg-surface-container flex flex-col justify-between items-end border-t xl:border-t-0 xl:border-l border-surface-container">
        <div className="text-right w-full">
          <span className="font-label-md text-label-md uppercase text-on-surface-variant font-bold">
            Standard Tariff
          </span>
          <div className="font-headline-lg text-headline-lg font-extrabold text-primary leading-tight">
            ₹{timetable.fareInr}
            <span className="font-body-md text-body-md text-on-surface-variant font-normal"> /seat</span>
          </div>
          <span className="px-space-xs py-0.5 rounded bg-secondary-container/40 text-on-secondary-container font-label-md text-label-md font-semibold inline-block mt-0.5">
            Ordinary Luggage Free
          </span>
        </div>

        <div className="w-full mt-space-md flex flex-col gap-space-xs">
          <Link
            href={`/map?id=${timetable.id}`}
            className="w-full py-2.5 rounded bg-primary hover:bg-primary-container text-on-primary font-title-md text-title-md font-bold shadow-md transition-colors flex items-center justify-center gap-1"
          >
            <span>View Route on Map</span>
            <span className="material-symbols-outlined text-sm">map</span>
          </Link>
          <Link
            href={`/verification?id=${timetable.id}`}
            className="w-full py-1 rounded text-on-surface-variant hover:text-primary font-label-md text-label-md uppercase font-bold tracking-wider text-center"
          >
            Inspect Timetable Log
          </Link>
        </div>
      </div>
    </article>
  );
};
