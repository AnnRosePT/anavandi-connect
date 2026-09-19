"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { timetableStore } from "@/services/store";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [pendingCount, setPendingCount] = useState(7);

  useEffect(() => {
    const updateCount = () => {
      setPendingCount(timetableStore.getPendingCount());
    };
    updateCount();
    const unsubscribe = timetableStore.subscribe(updateCount);
    return unsubscribe;
  }, []);

  const navItems = [
    { label: t("dashboard"), path: "/dashboard", icon: "dashboard" },
    { label: t("searchBuses"), path: "/search", icon: "directions_bus" },
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
    { label: t("compare"), path: "/compare", icon: "difference" },
    { label: t("analytics"), path: "/analytics", icon: "query_stats" },
    { label: t("communityUpload"), path: "/community-upload", icon: "group_add" },
    { label: t("settings"), path: "/settings", icon: "settings" },
  ];

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
            KSRTC SWIFT · Kerala
          </span>
        </div>
      </Link>

      {/* KSRTC Control Desk Strip */}
      <div className="px-space-md py-space-sm bg-[#E72A01]/10 flex items-center justify-between border-b border-[#E72A01]/20">
        <span className="font-label-md text-label-md uppercase text-[#E72A01] font-bold tracking-wider">
          {t("depotControlDesk")}
        </span>
        <span className="font-label-md text-label-md px-space-xs py-0.5 bg-[#E72A01] text-white rounded font-bold text-xs">
          KSRTC-SWIFT
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
      </nav>

      {/* KSRTC Footer */}
      <div className="p-space-md bg-[#b71c1c]/5 border-t border-[#b71c1c]/20 mt-auto">
        <div className="p-space-sm rounded-lg bg-surface-container-lowest shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-md text-label-md text-[#b71c1c] font-bold uppercase text-xs">
              Kerala State RTC
            </span>
            <span className="font-label-md text-label-md text-[#d32f2f] font-bold text-xs">SWIFT</span>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#b71c1c] animate-pulse"></span>
            <span className="font-label-md text-label-md text-on-surface text-xs">Ente KSRTC Neo-oprs</span>
          </div>
          <p className="text-[10px] text-on-surface-variant leading-tight">
            Book your bus ticket for a comfortable &amp; hassle free journey.
          </p>
        </div>
      </div>
    </aside>
  );
};
