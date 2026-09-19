"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, UserRole, DEMO_PROFILES } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const KERALA_DEPOTS = [
  "Thampanoor Central Depot (Trivandrum)",
  "Ernakulam Central Depot",
  "Thrissur Sakthan Thampuran Depot",
  "Kozhikode Mavoor Road Depot",
  "Kannur Municipal Terminal Depot",
  "Alappuzha KSRTC Depot",
  "Kottayam Central Bus Station",
  "Palakkad Municipal Depot",
  "Munnar Depot (Highrange Sector)",
  "Sulthan Bathery Depot (Wayanad Sector)",
];

export default function LoginPage() {
  const router = useRouter();
  const { loginAs, role: currentRole, user: currentUser } = useAuth();
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<UserRole>("official");

  // Official form state
  const [employeeId, setEmployeeId] = useState("KSRTC-PEN-4092");
  const [officialName, setOfficialName] = useState("Soman K.");
  const [selectedDepot, setSelectedDepot] = useState(KERALA_DEPOTS[0]);
  const [officialPin, setOfficialPin] = useState("••••••");

  // Passenger form state
  const [passengerName, setPassengerName] = useState("Anjali Nair");
  const [passengerMobile, setPassengerMobile] = useState("+91 98470 56789");
  const [preferredRoute, setPreferredRoute] = useState("Ernakulam ⇄ Thrissur");

  const handleOfficialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs("official", {
      name: officialName || "Soman K.",
      employeeId: employeeId || "KSRTC-PEN-4092",
      depot: selectedDepot,
      designation: "Station Master / Depot Inspector",
    });
    router.push("/dashboard");
  };

  const handlePassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs("passenger", {
      name: passengerName || "Anjali Nair",
      phone: passengerMobile || "+91 98470 56789",
      preferredRoute: preferredRoute,
      designation: "Daily KSRTC Commuter",
    });
    router.push("/search");
  };

  const handleQuickOfficialLogin = () => {
    loginAs("official", DEMO_PROFILES.official);
    router.push("/dashboard");
  };

  const handleQuickPassengerLogin = () => {
    loginAs("passenger", DEMO_PROFILES.passenger);
    router.push("/search");
  };

  return (
    <div className="w-full px-space-md sm:px-space-lg py-space-lg flex flex-col items-center justify-center min-h-[80vh] max-w-4xl mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-space-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b71c1c]/10 border border-[#b71c1c]/20 text-[#b71c1c] font-label-md text-xs font-bold uppercase tracking-wider mb-2">
          <span className="w-2 h-2 rounded-full bg-[#b71c1c] animate-ping"></span>
          <span>AnaVandi Connect • Unified Auth Gateway</span>
        </div>
        <h1 className="font-display-md text-headline-lg sm:text-display-md font-extrabold text-on-surface tracking-tight">
          Select Your Access Portal
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mt-1">
          Sign in as a verified KSRTC Depot Official or access personalized schedules as a regular passenger.
        </p>
      </div>

      {/* Role Switcher Tabs */}
      <div className="w-full max-w-xl bg-surface-container-low p-1.5 rounded-2xl border border-surface-container shadow-md flex items-center mb-space-lg">
        <button
          type="button"
          onClick={() => setActiveTab("official")}
          className={`flex-1 py-3 px-4 rounded-xl font-label-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "official"
              ? "bg-[#b71c1c] text-white shadow-md scale-[1.01]"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          }`}
        >
          <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
          <span>KSRTC Official Portal</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("passenger")}
          className={`flex-1 py-3 px-4 rounded-xl font-label-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "passenger"
              ? "bg-[#25803B] text-white shadow-md scale-[1.01]"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          }`}
        >
          <span className="material-symbols-outlined text-lg">commute</span>
          <span>Passenger Portal</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-xl bg-surface-container-lowest rounded-2xl p-space-lg sm:p-space-xl border-2 border-surface-container shadow-2xl animate-in fade-in slide-in-from-bottom-2">
        {activeTab === "official" ? (
          /* KSRTC Official Portal Form */
          <div>
            <div className="flex items-center gap-3 pb-space-md border-b border-surface-container mb-space-md">
              <div className="w-12 h-12 rounded-xl bg-[#b71c1c]/15 text-[#b71c1c] border border-[#b71c1c]/30 flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-2xl">verified_user</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-title-lg font-extrabold text-on-surface">
                  Depot Officer &amp; Inspector Login
                </h2>
                <p className="font-body-md text-xs text-on-surface-variant">
                  Access depot telemetry, timetable OCR digitizing, and GTFS feeds.
                </p>
              </div>
            </div>

            {/* Quick 1-Click Demo Login */}
            <div className="p-space-sm rounded-xl bg-amber-500/10 border border-amber-500/30 mb-space-md flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-lg">bolt</span>
                <span className="text-xs text-on-surface font-medium">
                  Testing as Judge / Station Master?
                </span>
              </div>
              <button
                type="button"
                onClick={handleQuickOfficialLogin}
                className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-label-md text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
              >
                1-Click Official Login
              </button>
            </div>

            <form onSubmit={handleOfficialSubmit} className="space-y-space-md">
              <div>
                <label className="block font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  KSRTC Permanent Employee No. (PEN) / ID
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">
                    badge
                  </span>
                  <input
                    type="text"
                    required
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full pl-10 pr-space-md py-2.5 bg-surface-container-low border border-surface-container-high rounded-lg text-on-surface font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#b71c1c]"
                    placeholder="e.g. KSRTC-PEN-4092"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Officer Name &amp; Designation
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    value={officialName}
                    onChange={(e) => setOfficialName(e.target.value)}
                    className="w-full pl-10 pr-space-md py-2.5 bg-surface-container-low border border-surface-container-high rounded-lg text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-[#b71c1c]"
                    placeholder="e.g. Soman K."
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Depot Command Jurisdiction
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">
                    store
                  </span>
                  <select
                    value={selectedDepot}
                    onChange={(e) => setSelectedDepot(e.target.value)}
                    className="w-full pl-10 pr-space-md py-2.5 bg-surface-container-low border border-surface-container-high rounded-lg text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-[#b71c1c] appearance-none"
                  >
                    {KERALA_DEPOTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Security Passcode / Kerala SPARK PIN
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">
                    key
                  </span>
                  <input
                    type="password"
                    required
                    value={officialPin}
                    onChange={(e) => setOfficialPin(e.target.value)}
                    className="w-full pl-10 pr-space-md py-2.5 bg-surface-container-low border border-surface-container-high rounded-lg text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-[#b71c1c]"
                    placeholder="Enter 6-digit PIN"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#b71c1c] hover:bg-[#8f1414] text-white font-label-md text-sm font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:translate-y-0.5 mt-2"
              >
                <span className="material-symbols-outlined text-lg">login</span>
                <span>Authenticate as KSRTC Official</span>
              </button>
            </form>
          </div>
        ) : (
          /* Passenger Portal Form */
          <div>
            <div className="flex items-center gap-3 pb-space-md border-b border-surface-container mb-space-md">
              <div className="w-12 h-12 rounded-xl bg-[#25803B]/15 text-[#25803B] border border-[#25803B]/30 flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-2xl">commute</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-title-lg font-extrabold text-on-surface">
                  Passenger Commuter Access
                </h2>
                <p className="font-body-md text-xs text-on-surface-variant">
                  Search live routes, view bus timings, track buses, and plan trips.
                </p>
              </div>
            </div>

            {/* Quick 1-Click Demo Login */}
            <div className="p-space-sm rounded-xl bg-emerald-500/10 border border-emerald-500/30 mb-space-md flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-lg">bolt</span>
                <span className="text-xs text-on-surface font-medium">
                  Testing as Regular Passenger?
                </span>
              </div>
              <button
                type="button"
                onClick={handleQuickPassengerLogin}
                className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-[#25803B] hover:bg-[#1e6b30] text-white font-label-md text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
              >
                1-Click Passenger Login
              </button>
            </div>

            <form onSubmit={handlePassengerSubmit} className="space-y-space-md">
              <div>
                <label className="block font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full pl-10 pr-space-md py-2.5 bg-surface-container-low border border-surface-container-high rounded-lg text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-[#25803B]"
                    placeholder="e.g. Anjali Nair"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Mobile Number / WhatsApp for Travel Alerts
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">
                    phone_android
                  </span>
                  <input
                    type="tel"
                    required
                    value={passengerMobile}
                    onChange={(e) => setPassengerMobile(e.target.value)}
                    className="w-full pl-10 pr-space-md py-2.5 bg-surface-container-low border border-surface-container-high rounded-lg text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-[#25803B]"
                    placeholder="+91 98470 56789"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Frequently Travelled Route
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">
                    alt_route
                  </span>
                  <input
                    type="text"
                    value={preferredRoute}
                    onChange={(e) => setPreferredRoute(e.target.value)}
                    className="w-full pl-10 pr-space-md py-2.5 bg-surface-container-low border border-surface-container-high rounded-lg text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-[#25803B]"
                    placeholder="e.g. Ernakulam ⇄ Thrissur"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#25803B] hover:bg-[#1e6b30] text-white font-label-md text-sm font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:translate-y-0.5 mt-2"
              >
                <span className="material-symbols-outlined text-lg">directions_bus</span>
                <span>Enter as Passenger</span>
              </button>
            </form>
          </div>
        )}

        {/* Current Session Indicator */}
        <div className="mt-space-md pt-space-sm border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
          <span>Current active session:</span>
          <span className="font-bold text-on-surface">
            {currentUser.name} ({currentUser.role === "official" ? "KSRTC Official" : "Passenger"})
          </span>
        </div>
      </div>
    </div>
  );
}
