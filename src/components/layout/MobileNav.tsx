"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { role } = useAuth();

  const isOfficial = role === "official";

  const officialItems = [
    { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { label: "Upload", path: "/upload", icon: "upload_file" },
    { label: "Verify", path: "/verification", icon: "fact_check" },
    { label: "Routes", path: "/routes", icon: "alt_route" },
    { label: "Map", path: "/map", icon: "map" },
  ];

  const passengerItems = [
    { label: "Home", path: "/", icon: "home" },
    { label: "Search", path: "/search", icon: "directions_bus" },
    { label: "Map", path: "/map", icon: "map" },
    { label: "AI Search", path: "/ai-search", icon: "psychology" },
    { label: "Timetables", path: "/timetables", icon: "menu_book" },
  ];

  const items = isOfficial ? officialItems : passengerItems;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container border-t border-surface-container-high z-50 flex items-center justify-around px-2 shadow-lg">
      {items.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              isActive ? "text-primary font-bold" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span className="text-[10px] font-label-md mt-0.5 tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
