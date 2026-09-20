"use client";

import React, { useEffect, useRef, useState } from "react";
import { TimetableRecord } from "@/types/timetable";
import { KERALA_COORDINATES } from "@/services/store";
import { getCanonicalStationName } from "@/services/locationUtils";

interface RouteMapProps {
  timetable: TimetableRecord;
  selectedStopIndex?: number;
  onSelectStop?: (index: number) => void;
  className?: string;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  timetable,
  selectedStopIndex,
  onSelectStop,
  className = "h-[560px]",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      try {
        const L = (await import("leaflet")).default;

        // Clean up previous instance
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Calculate center or bounds
        const validCoords = timetable.stops
          .map((s) => s.coordinates || KERALA_COORDINATES[s.name] || KERALA_COORDINATES[getCanonicalStationName(s.name)])
          .filter(Boolean) as { lat: number; lng: number }[];

        const centerLat = validCoords.length > 0 ? validCoords[Math.floor(validCoords.length / 2)].lat : 10.0;
        const centerLng = validCoords.length > 0 ? validCoords[Math.floor(validCoords.length / 2)].lng : 76.3;

        const map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom: 8,
          scrollWheelZoom: false,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(map);

        // Polyline points
        const polylinePoints = validCoords.map((c) => [c.lat, c.lng] as [number, number]);

        if (polylinePoints.length > 1) {
          // Route casing
          L.polyline(polylinePoints, {
            color: "#2D2520",
            weight: 6,
            opacity: 0.7,
          }).addTo(map);

          // Route inner line
          L.polyline(polylinePoints, {
            color: "#B82828",
            weight: 4,
            opacity: 0.95,
          }).addTo(map);

          map.fitBounds(L.latLngBounds(polylinePoints), { padding: [40, 40] });
        }

        // Add markers
        timetable.stops.forEach((stop, idx) => {
          const coords = stop.coordinates || KERALA_COORDINATES[stop.name] || KERALA_COORDINATES[getCanonicalStationName(stop.name)];
          if (!coords) return;

          const isOrigin = idx === 0;
          const isTerminus = idx === timetable.stops.length - 1;
          const isSelected = selectedStopIndex === idx;

          const pinColor = isOrigin
            ? "#F5B027"
            : isTerminus
            ? "#950913"
            : isSelected
            ? "#7E5700"
            : "#B82828";

          const customIcon = L.divIcon({
            className: "custom-ksrtc-pin",
            html: `
              <div style="
                background-color: ${pinColor};
                color: #ffffff;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: bold;
                box-shadow: 0 2px 6px rgba(0,0,0,0.35);
                border: 2px solid #ffffff;
              ">
                ${isOrigin ? "A" : isTerminus ? "B" : idx + 1}
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          const marker = L.marker([coords.lat, coords.lng], { icon: customIcon }).addTo(map);

          const popupHtml = `
            <div style="font-family: 'Work Sans', sans-serif; padding: 4px; min-width: 170px;">
              <div style="font-size: 10px; font-weight: bold; color: #7E5700; text-transform: uppercase; font-family: 'JetBrains Mono', monospace;">
                Stop #${stop.seq} • ${stop.code}
              </div>
              <div style="font-size: 14px; font-weight: bold; color: #211A15; margin: 2px 0;">
                ${stop.name}
              </div>
              ${stop.nameMl ? `<div style="font-size: 12px; color: #5A403E; margin-bottom: 4px;">${stop.nameMl}</div>` : ""}
              <div style="font-size: 12px; border-top: 1px solid #efe0d8; padding-top: 4px; display: flex; justify-content: space-between;">
                <span>Arr: <b>${stop.arrival}</b></span>
                <span>Dep: <b style="color: #950913;">${stop.departure}</b></span>
              </div>
            </div>
          `;

          marker.bindPopup(popupHtml);

          marker.on("click", () => {
            if (onSelectStop) onSelectStop(idx);
          });
        });

        mapInstanceRef.current = map;
        if (isMounted) setMapLoaded(true);
      } catch (err) {
        console.warn("Leaflet map initialization failed, activating fallback schematic:", err);
        if (isMounted) setUseFallback(true);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [timetable, selectedStopIndex]);

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-md bg-surface-container-low border border-surface-container ${className}`}>
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-20 bg-surface/90 backdrop-blur-md px-space-md py-space-xs rounded-lg shadow-md border border-surface-container flex items-center gap-space-sm">
        <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
        <div>
          <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold block">
            Kerala RTC Transit GIS
          </span>
          <span className="font-title-md text-title-md font-bold text-on-surface">
            {timetable.title}
          </span>
        </div>
      </div>

      {/* Fallback Schematic if offline */}
      {useFallback ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-space-lg bg-[#FAF5EC]">
          <div className="text-center max-w-md mb-space-md">
            <span className="material-symbols-outlined text-4xl text-primary mb-2">alt_route</span>
            <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Kerala Transit Route Schematic
            </h4>
            <p className="font-body-md text-body-md text-on-surface-variant">
              High-precision linear corridor representation for {timetable.title}
            </p>
          </div>

          <div className="w-full max-w-lg space-y-3">
            {timetable.stops.map((stop, idx) => (
              <div
                key={stop.id || idx}
                onClick={() => onSelectStop && onSelectStop(idx)}
                className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all ${
                  selectedStopIndex === idx
                    ? "bg-primary text-on-primary shadow-md"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-surface-container-lowest text-primary font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-sm">{stop.name}</div>
                    <div className="text-xs opacity-75">{stop.code}</div>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div>Dep: <b>{stop.departure}</b></div>
                  <div className="opacity-75">{stop.arrival !== "—" ? `Arr: ${stop.arrival}` : "Origin"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div ref={mapContainerRef} className="w-full h-full" />
      )}
    </div>
  );
};
