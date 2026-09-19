"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { timetableStore } from "@/services/store";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { role, user } = useAuth();
  const [pendingCount, setPendingCount] = useState(7);

  const isOfficial = role === "official";

  useEffect(() => {
    const updateCount = () => {
      setPendingCount(timetableStore.getPendingCount());
    };
    updateCount();
    const unsubscribe = timetableStore.subscribe(updateCount);
    return unsubscribe;
  }, []);

  interface NavItem {
    label: string;
    path: string;
    icon: string;
    badge?: string;
  }

  const officialNavItems: NavItem[] = [
    { label: t("dashboard"), path: "/dashboard", icon: "dashboard" },
    { label: t("uploadTimetable"), path: "/upload", icon: "upload_file" },
    {
      label: t("verificationQueue"),
      path: "/verification",
      icon: "fact_check",
      badge: `${pendingCount} Pending`,
    },
    { label: t("timetableLibrary"), path: "/timetables", icon: "menu_book" },
    { label: t("routesAndStops"), path: "/routes", icon: "alt_route" },
    { label: t("interactiveMap"), path: "/map", icon: "map" },
    { label: t("aiSearch"), path: "/ai-search", icon: "psychology" },
    { label: t("analytics"), path: "/analytics", icon: "query_stats" },
    { label: t("compare"), path: "/compare", icon: "difference" },
    { label: t("settings"), path: "/settings", icon: "settings" },
  ];

  const passengerNavItems: NavItem[] = [
    { label: t("searchBuses"), path: "/search", icon: "directions_bus" },
    { label: t("interactiveMap"), path: "/map", icon: "map" },
    { label: t("aiSearch"), path: "/ai-search", icon: "psychology" },
    { label: t("timetableLibrary"), path: "/timetables", icon: "menu_book" },
    { label: t("compare"), path: "/compare", icon: "difference" },
    { label: t("communityUpload"), path: "/community-upload", icon: "group_add" },
    { label: t("routesAndStops"), path: "/routes", icon: "alt_route" },
    { label: t("settings"), path: "/settings", icon: "settings" },
  ];

  const navItems = isOfficial ? officialNavItems : passengerNavItems;

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 hidden lg:flex flex-col shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Brand Header — KSRTC Swift */}
      <Link href="/" className="h-20 px-space-md flex items-center gap-space-sm bg-[#b71c1c] hover:bg-[#7f0000] transition-colors">
        <img
          alt="AnaVandi KSRTC Logo"
          className="w-14 h-14 rounded-full object-cover shadow-lg border-2 border-[#ffb300]"
          src="/assets/new-logo.png"
        />
        <div className="flex flex-col">
          <span className="font-headline-sm text-headline-sm text-[#ffb300] tracking-tight leading-none font-bold">
            ആനവണ്ടി
          </span>
          <span className="font-label-md text-label-md text-white/90 font-bold">
            AnaVandi Connect
          </span>
          <span className="text-[10px] text-white/60 uppercase tracking-widest">
            {isOfficial ? "Depot Ops · KSRTC" : "Passenger Hub · Kerala"}
          </span>
        </div>
      </Link>

      {/* Role-Specific Strip */}
      <div
        className={`px-space-md py-space-sm flex items-center justify-between border-b ${
          isOfficial
            ? "bg-[#b71c1c]/10 border-[#b71c1c]/20"
            : "bg-[#25803B]/10 border-[#25803B]/20"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isOfficial ? "bg-[#b71c1c] animate-ping" : "bg-[#25803B]"
            }`}
          ></span>
          <span
            className={`font-label-md text-xs uppercase font-bold tracking-wider ${
              isOfficial ? "text-[#b71c1c]" : "text-[#25803B]"
            }`}
          >
            {isOfficial ? "Depot Command Desk" : "Commuter Transit Hub"}
          </span>
        </div>
        <span
          className={`font-label-md text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
            isOfficial ? "bg-[#b71c1c] text-white" : "bg-[#25803B] text-white"
          }`}
        >
          {isOfficial ? "OFFICIAL" : "PASSENGER"}
        </span>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-space-sm py-space-md space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== "/" && pathname?.startsWith(item.path));
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center justify-between px-space-md py-space-sm rounded-lg transition-all ${
                isActive
                  ? "bg-primary-container text-on-primary font-medium shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <div className="flex items-center gap-space-sm">
                <span
                  className={`material-symbols-outlined text-lg ${
                    isActive ? "text-on-primary" : "text-primary"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="font-body-md text-body-md">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-space-xs py-0.5 font-label-md text-label-md rounded font-bold ${
                    isActive
                      ? "bg-secondary text-on-secondary"
                      : "bg-secondary-container text-on-secondary-container"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Link to other portal if Passenger */}
        {!isOfficial && (
          <div className="pt-2 border-t border-surface-container/60 mt-2">
            <Link
              href="/login"
              className="flex items-center justify-between px-space-md py-space-sm rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-base text-amber-500">
                  admin_panel_settings
                </span>
                <span>Depot Officer Portal</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-500/15 px-1.5 py-0.5 rounded">
                Login
              </span>
            </Link>
          </div>
        )}
      </nav>

      {/* Role Footer */}
      <div className="p-space-md bg-[#b71c1c]/5 border-t border-[#b71c1c]/20 mt-auto">
        <div className="p-space-sm rounded-lg bg-surface-container-lowest shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-md text-label-md text-[#b71c1c] font-bold uppercase text-xs">
              Kerala State RTC
            </span>
            <span
              className={`font-label-md text-xs font-bold ${
                isOfficial ? "text-[#b71c1c]" : "text-[#25803B]"
              }`}
            >
              {isOfficial ? "SWIFT Oprs" : "Live Transit"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className={`w-2 h-2 rounded-full ${
                isOfficial ? "bg-[#b71c1c] animate-pulse" : "bg-[#25803B]"
              }`}
            ></span>
            <span className="font-label-md text-label-md text-on-surface text-xs truncate">
              {isOfficial ? (user.depot || "Thampanoor Central") : user.name}
            </span>
          </div>
          <p className="text-[10px] text-on-surface-variant leading-tight">
            {isOfficial
              ? "Depot station master & roster ingest portal."
              : "Live KSRTC bus times, routes & schedules across Kerala."}
          </p>
        </div>
      </div>
    </aside>
  );
};
