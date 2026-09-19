"use client";

import React, { useState, useEffect } from "react";
import { timetableStore } from "@/services/store";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState<"demo" | "gemini">("demo");
  const [defaultDepot, setDefaultDepot] = useState("Trivandrum Central (Thampanoor)");
  const [gtfsAgencyName, setGtfsAgencyName] = useState("Kerala State Road Transport Corporation");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("anavandi_ai_api_key") || "";
      setApiKey(savedKey);
      if (savedKey) setProvider("gemini");

      const savedDepot = localStorage.getItem("anavandi_default_depot");
      if (savedDepot) setDefaultDepot(savedDepot);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("anavandi_ai_api_key", apiKey.trim());
      localStorage.setItem("anavandi_default_depot", defaultDepot);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleResetData = () => {
    if (confirm("Reset all timetable records back to initial hackathon demonstration seeds?")) {
      timetableStore.resetToSeeds();
      alert("Timetable store reset to default KSRTC seed datasets.");
    }
  };

  return (
    <div className="w-full px-space-md sm:px-space-lg flex flex-col gap-space-lg pb-space-xl max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-surface-container-low p-space-md rounded-xl border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">settings</span>
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">
              Depot Telemetry Configuration
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold mt-1">
            Platform Settings
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Configure OCR providers, vision models, GTFS agency metadata, and demo storage state.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-secondary-container text-on-secondary-container rounded-lg font-label-md text-xs font-bold flex items-center gap-2 border border-secondary shadow-sm">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>Configuration saved successfully.</span>
        </div>
      )}

      {/* Settings Form */}
      <form
        onSubmit={handleSave}
        className="bg-surface-container-lowest p-space-lg rounded-xl border border-surface-container shadow-md flex flex-col gap-space-lg"
      >
        {/* AI OCR Provider Section */}
        <div className="space-y-space-sm pb-space-md border-b border-surface-container">
          <span className="font-label-md text-xs font-bold text-secondary uppercase tracking-wider block">
            Vision AI &amp; Extraction Engine
          </span>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            OCR Extraction Provider
          </h3>
          <p className="text-xs text-on-surface-variant">
            AnaVandi Connect includes both a deterministic high-fidelity demo engine and real Vision AI extraction.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-2">
            <div
              onClick={() => setProvider("demo")}
              className={`p-space-sm rounded-lg border cursor-pointer transition-all ${
                provider === "demo"
                  ? "bg-secondary-container/20 border-secondary shadow-sm"
                  : "bg-surface-container border-surface-container-high"
              }`}
            >
              <div className="flex items-center justify-between font-bold text-xs text-on-surface font-label-md">
                <span>Deterministic Demo Mode</span>
                {provider === "demo" && (
                  <span className="material-symbols-outlined text-sm text-secondary">check</span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                Zero API keys required. Reliable 2-minute judge demo flow with pre-calibrated KSRTC discrepancy detection.
              </p>
            </div>

            <div
              onClick={() => setProvider("gemini")}
              className={`p-space-sm rounded-lg border cursor-pointer transition-all ${
                provider === "gemini"
                  ? "bg-primary/10 border-primary shadow-sm"
                  : "bg-surface-container border-surface-container-high"
              }`}
            >
              <div className="flex items-center justify-between font-bold text-xs text-primary font-label-md">
                <span>Vision AI (Gemini / Studio)</span>
                {provider === "gemini" && (
                  <span className="material-symbols-outlined text-sm text-primary">check</span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                Direct visual recognition for ad-hoc uploaded custom timetable photos using Google Gemini Vision API.
              </p>
            </div>
          </div>

          {/* API Key Input */}
          <div className="pt-2">
            <label className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
              AI Vision API Key (Optional)
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-surface-container rounded-lg font-mono text-xs text-on-surface border border-surface-container-high focus:ring-1 focus:ring-primary outline-none"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <span className="text-[11px] text-on-surface-variant mt-1 block">
              Keys are stored strictly in client-side localStorage and never transmitted to third parties.
            </span>
          </div>
        </div>

        {/* Depot Preferences */}
        <div className="space-y-space-sm pb-space-md border-b border-surface-container">
          <span className="font-label-md text-xs font-bold text-secondary uppercase tracking-wider block">
            Depot Operations
          </span>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            Depot Division Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-1">
            <div>
              <label className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
                Default Station Terminal
              </label>
              <select
                className="w-full px-3 py-2 bg-surface-container rounded-lg text-sm text-on-surface border border-surface-container-high outline-none font-medium"
                value={defaultDepot}
                onChange={(e) => setDefaultDepot(e.target.value)}
              >
                <option value="Trivandrum Central (Thampanoor)">Trivandrum Central (Thampanoor)</option>
                <option value="Kollam Bus Station">Kollam Bus Station</option>
                <option value="Ernakulam Central Depot">Ernakulam Central Depot</option>
                <option value="Thrissur Sakthan Stand">Thrissur Sakthan Stand</option>
                <option value="Kozhikode Mavoor Road">Kozhikode Mavoor Road</option>
                <option value="Kannur Municipal Terminal">Kannur Municipal Terminal</option>
              </select>
            </div>

            <div>
              <label className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
                GTFS Agency Label
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-surface-container rounded-lg text-sm text-on-surface border border-surface-container-high outline-none"
                value={gtfsAgencyName}
                onChange={(e) => setGtfsAgencyName(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm pt-2">
          <button
            type="button"
            onClick={handleResetData}
            className="px-space-md py-2 bg-error-container text-on-error-container rounded font-label-md text-xs font-bold uppercase transition-colors hover:brightness-105"
          >
            Reset Demo Database to Seeds
          </button>

          <button
            type="submit"
            className="px-space-lg py-2.5 bg-primary text-on-primary rounded font-label-md text-xs font-bold uppercase shadow hover:bg-primary-container transition-transform active:translate-y-0.5"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
