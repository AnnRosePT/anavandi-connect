"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ServiceClass } from "@/types/timetable";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchWidgetProps {
  initialOrigin?: string;
  initialDestination?: string;
  initialClass?: ServiceClass;
  onSearch?: (origin: string, dest: string, serviceClass: ServiceClass) => void;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({
  initialOrigin = "Trivandrum",
  initialDestination = "Kannur",
  initialClass = "ALL",
  onSearch,
}) => {
  const router = useRouter();
  const { t } = useLanguage();

  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [travelDate, setTravelDate] = useState("Today, 24 Oct");
  const [serviceClass, setServiceClass] = useState<ServiceClass>(initialClass);
  const [currentTime, setCurrentTime] = useState("06:14:28 IST");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", { hour12: false }) + " IST"
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(origin, destination, serviceClass);
    } else {
      router.push(
        `/search/results?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(
          destination
        )}&class=${encodeURIComponent(serviceClass)}`
      );
    }
  };

  const handleTrunkRoute = (from: string, to: string) => {
    setOrigin(from);
    setDestination(to);
    if (onSearch) {
      onSearch(from, to, serviceClass);
    } else {
      router.push(
        `/search/results?from=${encodeURIComponent(from)}&to=${encodeURIComponent(
          to
        )}&class=${encodeURIComponent(serviceClass)}`
      );
    }
  };

  const serviceClasses: { id: ServiceClass; label: string; labelMl?: string; icon?: string }[] = [
    { id: "ALL", label: "All Types" },
    { id: "SUPER_FAST", label: "Super Fast", labelMl: "സൂപ്പർ ഫാസ്റ്റ്" },
    { id: "FAST_PASSENGER", label: "Fast Passenger", labelMl: "FP" },
    { id: "MINNAL", label: "Minnal", labelMl: "മിന്നൽ", icon: "bolt" },
    { id: "EXPRESS", label: "Express", labelMl: "SFX" },
  ];

  return (
    <section className="relative w-full bg-surface-container-low rounded-xl shadow-md p-space-md sm:p-space-lg overflow-hidden border border-surface-container">
      {/* KSRTC Golden Gradient Atmosphere */}
      <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
      <div className="absolute -left-12 -top-12 w-64 h-64 rounded-full bg-primary/10 blur-2xl pointer-events-none"></div>

      {/* Header & Master Clock */}
      <div className="relative z-10 flex flex-col xl:flex-row gap-space-md justify-between items-start xl:items-center mb-space-lg">
        <div>
          <div className="flex items-center gap-space-xs mb-1">
            <span className="px-space-xs py-0.5 bg-primary text-on-primary rounded font-label-md text-label-md uppercase tracking-wider font-bold">
              Aana Vandi State Transit
            </span>
            <span className="font-label-md text-label-md text-secondary font-semibold uppercase tracking-wider">
              Kerala RTC Fleet Grid
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-extrabold flex items-baseline gap-space-sm flex-wrap">
            <span>{t("whereToGo")}</span>
            <span className="font-body-lg text-title-md text-on-surface-variant font-normal tracking-normal">
              (എവിടേക്കാണ് പോകേണ്ടത്?)
            </span>
          </h1>
        </div>

        {/* Live Depot Master Clock */}
        <div className="bg-surface-container px-space-md py-space-sm rounded-lg flex items-center gap-space-sm self-stretch xl:self-auto justify-between shadow-sm border border-surface-container-high">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-lg">
              departure_board
            </span>
            <span className="font-label-md text-label-md uppercase text-on-surface-variant font-bold">
              Thampanoor Master Clock
            </span>
          </div>
          <span className="font-label-lg text-label-lg font-bold text-primary">
            {currentTime}
          </span>
        </div>
      </div>

      {/* Form Input Row */}
      <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center">
        {/* Origin */}
        <div className="md:col-span-4 bg-surface-container-lowest p-space-sm rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-primary transition-all border border-surface-container">
          <label className="block font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold mb-0.5 flex items-center justify-between">
            <span>{t("boardingOrigin")}</span>
            <span className="material-symbols-outlined text-primary text-sm">trip_origin</span>
          </label>
          <input
            className="w-full bg-transparent font-title-md text-title-md text-on-surface font-semibold focus:outline-none placeholder:text-outline truncate"
            placeholder="Search Origin Depot..."
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </div>

        {/* Swap Button */}
        <div className="hidden md:flex md:col-span-1 justify-center -mx-4 z-20">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Interchange Locations"
            className="w-10 h-10 rounded-full bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container shadow-md flex items-center justify-center transition-transform hover:rotate-180"
          >
            <span className="material-symbols-outlined text-base font-bold">swap_horiz</span>
          </button>
        </div>

        {/* Destination */}
        <div className="md:col-span-4 bg-surface-container-lowest p-space-sm rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-primary transition-all border border-surface-container">
          <label className="block font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold mb-0.5 flex items-center justify-between">
            <span>{t("destination")}</span>
            <span className="material-symbols-outlined text-secondary text-sm">location_on</span>
          </label>
          <input
            className="w-full bg-transparent font-title-md text-title-md text-on-surface font-semibold focus:outline-none placeholder:text-outline truncate"
            placeholder="Search Destination Depot..."
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        {/* Travel Date */}
        <div className="md:col-span-3 bg-surface-container-lowest p-space-sm rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-primary transition-all border border-surface-container">
          <label className="block font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold mb-0.5 flex items-center justify-between">
            <span>{t("travelDate")}</span>
            <span className="material-symbols-outlined text-primary text-sm">calendar_month</span>
          </label>
          <input
            className="w-full bg-transparent font-title-md text-title-md text-on-surface font-semibold focus:outline-none truncate"
            type="text"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
          />
        </div>

        {/* Service Class Chips */}
        <div className="md:col-span-9 flex flex-wrap items-center gap-space-xs pt-space-xs">
          <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold mr-1">
            Service Class:
          </span>
          {serviceClasses.map((sc) => {
            const isSelected = serviceClass === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => setServiceClass(sc.id)}
                className={`px-space-sm py-1 rounded font-label-md text-label-md font-bold shadow-sm flex items-center gap-1 transition-all ${
                  isSelected
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-on-surface hover:bg-surface-variant"
                }`}
              >
                {sc.icon && <span className="material-symbols-outlined text-xs">{sc.icon}</span>}
                <span>{sc.label}</span>
                {sc.labelMl && <span className="opacity-75">({sc.labelMl})</span>}
              </button>
            );
          })}
        </div>

        {/* Find Buses Action */}
        <div className="md:col-span-3 pt-space-xs">
          <button
            type="submit"
            className="w-full py-3 px-space-md rounded bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container font-headline-sm text-headline-sm uppercase tracking-wide font-extrabold shadow-md flex items-center justify-center gap-space-xs transition-all active:translate-y-0.5"
          >
            <span className="material-symbols-outlined text-xl">directions_bus</span>
            <span>{t("findBuses")}</span>
          </button>
        </div>
      </form>

      {/* Popular Trunk Routes Quick Pills */}
      <div className="relative z-10 mt-space-md pt-space-sm border-t border-surface-container-high/60 flex flex-wrap items-center gap-space-xs">
        <span className="font-label-md text-label-md text-secondary uppercase font-bold tracking-wider mr-1">
          Popular Trunk Routes:
        </span>
        <button
          onClick={() => handleTrunkRoute("Trivandrum", "Kanyakumari")}
          className="px-space-sm py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1"
        >
          <span>Trivandrum → Kanyakumari</span>
          <span className="text-primary font-bold">87 km</span>
        </button>
        <button
          onClick={() => handleTrunkRoute("Trivandrum", "Kochi")}
          className="px-space-sm py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1"
        >
          <span>Trivandrum → Kochi</span>
          <span className="text-primary font-bold">206 km</span>
        </button>
        <button
          onClick={() => handleTrunkRoute("Trivandrum", "Munnar")}
          className="px-space-sm py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1"
        >
          <span>Trivandrum → Munnar</span>
          <span className="text-primary font-bold">278 km</span>
        </button>
        <button
          onClick={() => handleTrunkRoute("Trivandrum", "Palakkad")}
          className="px-space-sm py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1"
        >
          <span>Trivandrum → Palakkad</span>
          <span className="text-primary font-bold">342 km</span>
        </button>
        <button
          onClick={() => handleTrunkRoute("Trivandrum", "Kannur")}
          className="px-space-sm py-0.5 rounded bg-secondary-container/30 text-on-secondary-container font-label-md text-label-md font-bold transition-colors flex items-center gap-1"
        >
          <span>Trivandrum → Kannur</span>
          <span className="text-primary font-extrabold">478 km</span>
        </button>
      </div>
    </section>
  );
};
