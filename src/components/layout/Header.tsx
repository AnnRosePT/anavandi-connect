"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-md sm:px-space-lg">
      {/* Left: Mobile hamburger + KSRTC logo (mobile) + Search */}
      <div className="flex items-center gap-space-sm sm:gap-space-md flex-1 max-w-lg">
        {/* Mobile KSRTC logo - only visible on mobile */}
        <Link href="/" className="lg:hidden flex items-center gap-1.5 flex-shrink-0">
          <img
            alt="AnaVandi"
            className="w-9 h-9 rounded-full object-cover border-2 border-[#ffb300]"
            src="/assets/new-logo.png"
          />
        </Link>

        <form onSubmit={handleSearch} className="relative w-full flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-sm">
            search
          </span>
          <input
            className="w-full pl-9 pr-space-md py-2 bg-surface-container rounded-lg text-on-surface placeholder:text-on-surface-variant font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-[#b71c1c]"
            placeholder={
              language === "ml"
                ? "ബസുകൾ, സമയങ്ങൾ, ഡിപ്പോകൾ തിരയുക..."
                : "Search KSRTC buses, routes, depots..."
            }
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-space-xs sm:gap-space-md">
        {/* Book a Ticket Quick Button */}
        <Link
          href="/upload"
          className="hidden md:flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg bg-[#d32f2f] text-white font-label-md text-label-md font-bold uppercase tracking-wider shadow-sm hover:brightness-110 active:translate-y-0.5 transition-all"
        >
          <span className="material-symbols-outlined text-sm">directions_bus</span>
          <span>Book Ticket</span>
        </Link>

        {/* KSRTC Swift Live Status Badge */}
        <div className="hidden sm:flex items-center gap-space-xs px-space-sm py-1 rounded bg-[#b71c1c]/10 border border-[#b71c1c]/20">
          <span className="w-2 h-2 rounded-full bg-[#b71c1c] animate-ping"></span>
          <span className="font-label-md text-label-md uppercase font-semibold text-[#b71c1c]">
            KSRTC SWIFT Live
          </span>
        </div>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === "en" ? "ml" : "en")}
          className="flex items-center gap-1 px-space-sm py-1 bg-surface-container rounded font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
          title="Toggle Language (English / മലയാളം)"
        >
          <span className={language === "en" ? "font-bold text-primary" : ""}>EN</span>
          <span className="text-outline">|</span>
          <span className={language === "ml" ? "font-bold text-primary" : ""}>മലയാളം</span>
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
            title="Depot Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container p-space-md z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container mb-space-xs">
                <span className="font-title-md text-title-md font-bold text-on-surface">KSRTC Alerts</span>
                <span className="font-label-md text-label-md bg-[#E72A01] text-white px-1.5 py-0.5 rounded font-bold">3 New</span>
              </div>
              <div className="space-y-space-xs">
                <div className="p-2 rounded bg-[#25803B]/5 border border-[#25803B]/10 text-body-md text-on-surface">
                  <div className="font-bold text-xs text-[#25803B]">✓ KSRTC SWIFT Booking Open</div>
                  <div className="text-xs text-on-surface-variant">Thiruvananthapuram → Kasaragod Super Fast service now bookable online.</div>
                </div>
                <div className="p-2 rounded bg-surface-container-low text-body-md text-on-surface">
                  <div className="font-bold text-xs text-[#E72A01]">⚠ Timetable Discrepancy</div>
                  <div className="text-xs text-on-surface-variant">KL-15-TRV-CAN-0824: Handwritten departure correction at Alappuzha depot requires review.</div>
                </div>
                <div className="p-2 rounded bg-surface-container text-body-md text-on-surface">
                  <div className="font-bold text-xs text-secondary">GTFS Feed Updated</div>
                  <div className="text-xs text-on-surface-variant">Parassala – Kasaragod trunk line GTFS feed regenerated at 05:40 AM IST.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-space-sm pl-space-xs">
          <div className="w-8 h-8 rounded-full bg-[#b71c1c] flex items-center justify-center shadow-sm ring-2 ring-[#ffb300] font-bold text-white text-xs">
            KD
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="font-title-md text-label-lg font-bold leading-tight text-on-surface">
              KSRTC Officer
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant">
              Thampanoor Depot
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
