"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { role, user, switchRole, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const isOfficial = role === "official";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        {/* Quick Action Button based on Role */}
        {isOfficial ? (
          <Link
            href="/upload"
            className="hidden md:flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg bg-[#b71c1c] text-white font-label-md text-xs font-bold uppercase tracking-wider shadow-sm hover:brightness-110 active:translate-y-0.5 transition-all"
          >
            <span className="material-symbols-outlined text-sm">upload_file</span>
            <span>Digitize Roster</span>
          </Link>
        ) : (
          <Link
            href="/search"
            className="hidden md:flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg bg-[#25803B] text-white font-label-md text-xs font-bold uppercase tracking-wider shadow-sm hover:brightness-110 active:translate-y-0.5 transition-all"
          >
            <span className="material-symbols-outlined text-sm">directions_bus</span>
            <span>Find Buses</span>
          </Link>
        )}

        {/* Live Role Badge */}
        <div
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-label-md font-bold uppercase tracking-wide border ${
            isOfficial
              ? "bg-[#b71c1c]/10 text-[#b71c1c] border-[#b71c1c]/25"
              : "bg-[#25803B]/10 text-[#25803B] border-[#25803B]/25"
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isOfficial ? "bg-[#b71c1c] animate-radar-red" : "bg-[#25803B] animate-radar-green"
            }`}
          ></span>
          <span>{isOfficial ? "KSRTC Official" : "Passenger"}</span>
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
            title="Notifications"
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
                  <div className="text-xs text-on-surface-variant">Thiruvananthapuram → Kasaragod Super Fast service now active.</div>
                </div>
                {isOfficial && (
                  <div className="p-2 rounded bg-surface-container-low text-body-md text-on-surface">
                    <div className="font-bold text-xs text-[#E72A01]">⚠ Timetable Discrepancy</div>
                    <div className="text-xs text-on-surface-variant">Alappuzha depot: Handwritten departure revision requires inspector review.</div>
                  </div>
                )}
                <div className="p-2 rounded bg-surface-container text-body-md text-on-surface">
                  <div className="font-bold text-xs text-secondary">GTFS Feed Distribution</div>
                  <div className="text-xs text-on-surface-variant">Trunk line GTFS feed refreshed for passenger apps.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Role Switcher Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-space-sm p-1 rounded-xl hover:bg-surface-container transition-all"
            title="Account & Portal Switcher"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm font-bold text-white text-xs ${
                isOfficial
                  ? "bg-[#b71c1c] ring-2 ring-[#ffb300]"
                  : "bg-[#25803B] ring-2 ring-emerald-300"
              }`}
            >
              {isOfficial ? "KO" : "PS"}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="font-title-md text-label-lg font-bold leading-tight text-on-surface">
                {user.name}
              </span>
              <span className="font-label-md text-xs text-on-surface-variant truncate max-w-[140px]">
                {isOfficial ? (user.depot?.split(" ")[0] || "Depot Officer") : "Commuter"}
              </span>
            </div>
            <span className="material-symbols-outlined text-sm text-on-surface-variant">
              expand_more
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container p-space-md z-50 animate-fade-in-scale">
              {/* User Card */}
              <div className="flex items-center gap-3 pb-space-sm border-b border-surface-container mb-space-sm">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 ${
                    isOfficial ? "bg-[#b71c1c]" : "bg-[#25803B]"
                  }`}
                >
                  {isOfficial ? "KO" : "PS"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-on-surface truncate">{user.name}</div>
                  <div className="text-xs text-on-surface-variant truncate">{user.designation}</div>
                  <span
                    className={`inline-block px-1.5 py-0.2 mt-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                      isOfficial
                        ? "bg-[#b71c1c]/10 text-[#b71c1c]"
                        : "bg-[#25803B]/10 text-[#25803B]"
                    }`}
                  >
                    {isOfficial ? "KSRTC Official" : "Normal Passenger"}
                  </span>
                </div>
              </div>

              {/* Persona Switch Button */}
              <div className="space-y-1 mb-space-sm">
                <span className="text-[11px] font-label-md font-bold uppercase text-on-surface-variant tracking-wider block mb-1">
                  Quick Portal Switch
                </span>

                {isOfficial ? (
                  <button
                    onClick={() => {
                      switchRole("passenger");
                      setShowProfileMenu(false);
                      router.push("/search");
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl bg-[#25803B]/10 hover:bg-[#25803B]/20 text-[#25803B] font-label-md text-xs font-bold transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">commute</span>
                    <div className="flex-1">
                      <div>Switch to Passenger Mode</div>
                      <div className="text-[10px] text-on-surface-variant font-normal">
                        Browse bus search &amp; live routes
                      </div>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      switchRole("official");
                      setShowProfileMenu(false);
                      router.push("/dashboard");
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl bg-[#b71c1c]/10 hover:bg-[#b71c1c]/20 text-[#b71c1c] font-label-md text-xs font-bold transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">badge</span>
                    <div className="flex-1">
                      <div>Switch to KSRTC Official</div>
                      <div className="text-[10px] text-on-surface-variant font-normal">
                        Access depot roster &amp; verification
                      </div>
                    </div>
                  </button>
                )}
              </div>

              {/* Login Page Link & Sign Out */}
              <div className="pt-space-xs border-t border-surface-container space-y-1">
                <Link
                  href="/login"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full px-3 py-1.5 rounded-lg text-left text-xs font-medium text-on-surface hover:bg-surface-container flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">login</span>
                  <span>Switch Account / Re-login</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                    router.push("/login");
                  }}
                  className="w-full px-3 py-1.5 rounded-lg text-left text-xs font-medium text-red-500 hover:bg-red-50 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
