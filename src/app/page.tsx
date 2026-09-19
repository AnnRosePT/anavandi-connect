"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { timetableStore } from "@/services/store";
import { exportGtfsZip } from "@/services/exportService";

export default function LandingPage() {
  const { t } = useLanguage();

  const handleDownloadSampleGtfs = async () => {
    const timetable = timetableStore.getActive();
    await exportGtfsZip(timetable);
  };

  return (
    <div className="w-full px-space-md sm:px-space-lg flex flex-col w-full pb-space-xl">
      {/* Hero Section — KSRTC SWIFT */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#d32f2f] via-[#b71c1c] to-[#7f0000] px-space-md py-space-xl sm:p-space-xl rounded-xl shadow-xl mb-space-xl text-surface">
        <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-[#E72A01]/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-7 flex flex-col space-y-space-md">
            {/* KSRTC SWIFT Badge */}
            <div className="inline-flex items-center gap-space-xs px-space-sm py-1.5 bg-white/10 backdrop-blur-md rounded-lg w-fit border border-white/20">
              <img src="/assets/new-logo.png" alt="AnaVandi" className="w-7 h-7 rounded-full border border-[#ffb300]" />
              <span className="font-label-md text-label-md uppercase tracking-wider text-[#ffb300] font-bold">
                KSRTC-SWIFT | ENTE KSRTC
              </span>
              <span className="font-label-md text-label-md text-[#d32f2f] bg-[#ffb300] px-1.5 py-0.5 rounded font-bold">
                Neo-oprs
              </span>
            </div>

            <h1 className="font-display-lg text-display-lg text-white tracking-tight leading-tight">
              ആനവണ്ടി{" "}
              <span className="text-[#ffb300] drop-shadow-sm">Connect</span>
            </h1>

            <p className="font-body-lg text-body-lg text-white/80 max-w-2xl leading-relaxed">
              <strong className="text-[#ffb300]">LOGIN / SIGNUP</strong> — Connect with Kerala State Road
              Transport Corporation (KSRTC) to earn loyalty benefits.
              AI-powered timetable digitization &amp; GTFS-ready schedule verification.
            </p>

            <div className="pt-space-sm flex flex-wrap items-center gap-space-md">
              <Link
                href="/login"
                className="btn-tactile flex items-center gap-space-xs px-space-lg py-space-sm bg-[#ffb300] text-[#7f0000] font-headline-sm text-headline-sm rounded-lg hover:brightness-110 shadow-lg font-bold transition-all"
              >
                <span className="material-symbols-outlined">person</span>
                <span>Login / Signup</span>
              </Link>

              <Link
                href="/search"
                className="btn-tactile flex items-center gap-space-xs px-space-lg py-space-sm bg-white/10 hover:bg-white/20 text-white font-title-md text-title-md rounded-lg transition-all border border-white/30 backdrop-blur-sm"
              >
                <span className="material-symbols-outlined">search</span>
                <span>{t("searchBuses")}</span>
              </Link>
            </div>

            <div className="pt-space-sm flex flex-wrap items-center gap-space-lg text-white/70">
              <div className="flex items-center gap-1.5 font-label-md text-label-md uppercase">
                <span className="material-symbols-outlined text-[#ffb300] text-sm">verified</span>
                <span>Ashok Leyland Certified Roster</span>
              </div>
              <div className="flex items-center gap-1.5 font-label-md text-label-md uppercase">
                <span className="material-symbols-outlined text-[#ffb300] text-sm">translate</span>
                <span>Malayalam + English OCR</span>
              </div>
              <div className="flex items-center gap-1.5 font-label-md text-label-md uppercase">
                <span className="material-symbols-outlined text-[#ffb300] text-sm">loyalty</span>
                <span>Ente KSRTC Loyalty Points</span>
              </div>
            </div>
          </div>

          {/* Right Column — AnaVandi Logo + Live KSRTC Card */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            <div className="w-full relative rounded-xl overflow-hidden shadow-2xl bg-black/20 p-space-sm border border-white/15 card-interactive">
              {/* Logo Hero */}
              <div className="w-full h-64 sm:h-72 rounded-lg overflow-hidden relative shadow-md bg-[#b71c1c] flex items-center justify-center">
                <img
                  className="w-56 h-56 object-contain drop-shadow-2xl animate-float"
                  alt="AnaVandi KSRTC Swift Logo"
                  src="/assets/new-logo.png"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-space-sm text-white">
                  <span className="font-label-md text-label-md uppercase tracking-wider text-[#ffb300]">
                    KL 15 0007 · Ashok Leyland
                  </span>
                  <p className="font-title-md text-title-md font-bold">
                    KSRTC SWIFT Super Fast Express
                  </p>
                </div>
              </div>

              {/* Live OCR Telemetry Block */}
              <div className="mt-space-sm bg-surface-container-lowest p-space-md rounded-lg shadow-md text-on-surface">
                <div className="flex items-center justify-between pb-space-xs mb-space-xs bg-surface-container-low px-space-sm py-1 rounded">
                  <span className="font-label-md text-label-md uppercase font-bold text-primary">
                    Live OCR Stream
                  </span>
                  <span className="font-label-md text-label-md bg-secondary text-on-secondary px-1.5 py-0.5 rounded animate-pulse">
                    Processing Block #932
                  </span>
                </div>
                <div className="flex items-center justify-between text-on-surface text-body-md font-body-md">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                      Input Source
                    </span>
                    <span className="font-bold">Kollam Depot Dot-Matrix Board</span>
                  </div>
                  <span className="material-symbols-outlined text-secondary">arrow_forward</span>
                  <div className="flex flex-col text-right">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                      Target GTFS
                    </span>
                    <span className="font-bold text-primary">KL-15-0007 Super Fast</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <section className="w-full grid grid-cols-2 md:grid-cols-4 gap-space-md mb-space-xl">
        <div className="card-interactive bg-surface-container p-space-md rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high cursor-default">
          <span className="font-label-md text-label-md uppercase text-on-surface-variant font-bold">
            Active Depots
          </span>
          <div className="my-space-xs flex items-baseline gap-1">
            <span className="font-headline-lg text-headline-lg text-primary font-extrabold">93</span>
            <span className="font-label-md text-label-md text-secondary font-bold">Divisions</span>
          </div>
          <span className="font-body-md text-body-md text-on-surface-variant">
            From Parassala to Kasaragod
          </span>
        </div>

        <div className="card-interactive bg-surface-container p-space-md rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high cursor-default">
          <span className="font-label-md text-label-md uppercase text-on-surface-variant font-bold">
            Archived Sheets
          </span>
          <div className="my-space-xs flex items-baseline gap-1">
            <span className="font-headline-lg text-headline-lg text-primary font-extrabold">42,600+</span>
          </div>
          <span className="font-body-md text-body-md text-on-surface-variant">
            Handwritten &amp; printed schedules
          </span>
        </div>

        <div className="card-interactive bg-surface-container p-space-md rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high cursor-default">
          <span className="font-label-md text-label-md uppercase text-on-surface-variant font-bold">
            Bilingual Engine
          </span>
          <div className="my-space-xs flex items-baseline gap-1">
            <span className="font-headline-lg text-headline-lg text-secondary font-extrabold">100%</span>
            <span className="font-label-md text-label-md text-on-surface-variant font-bold">ML / EN</span>
          </div>
          <span className="font-body-md text-body-md text-on-surface-variant">
            Malayalam script + Indic phonetics
          </span>
        </div>

        <div className="card-interactive bg-surface-container p-space-md rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high cursor-default">
          <span className="font-label-md text-label-md uppercase text-on-surface-variant font-bold">
            Mean Ingestion Speed
          </span>
          <div className="my-space-xs flex items-baseline gap-1">
            <span className="font-headline-lg text-headline-lg text-primary font-extrabold">&lt; 14</span>
            <span className="font-label-md text-label-md text-primary font-bold">Sec</span>
          </div>
          <span className="font-body-md text-body-md text-on-surface-variant">
            Per high-density dispatch sheet
          </span>
        </div>
      </section>

      {/* Tactile Telemetry Pipeline Section */}
      <section className="bg-surface-container-low rounded-xl p-space-lg sm:p-space-xl shadow-md mb-space-xl border border-surface-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-md">
          <div>
            <span className="font-label-md text-label-md uppercase font-bold text-secondary tracking-wider">
              Tactile Telemetry Pipeline
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1 font-bold">
              From depot bulletin pinboards to digital telemetry
            </h2>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-label-md text-label-md uppercase text-on-surface font-semibold">
              Trivandrum Central Depot Sample #KL-TVM-08
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Left Scan Inspection */}
          <div className="lg:col-span-6 bg-surface-container-highest/60 p-space-md rounded-xl shadow-inner flex flex-col border border-surface-container">
            <div className="flex items-center justify-between pb-space-sm mb-space-sm bg-surface-container px-space-sm py-1 rounded">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">filter_vintage</span>
                <span className="font-label-md text-label-md font-bold uppercase text-on-surface">
                  Physical Roster Inspection
                </span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant font-bold">
                OCR Vision Layer
              </span>
            </div>

            <div className="relative w-full h-80 rounded-lg overflow-hidden bg-surface-dim shadow-inner">
              <img
                className="w-full h-full object-cover"
                alt="Vintage dot-matrix timetable scan"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy2RIqVgg8IJPL__hyg05-v9Wk0RLUXV0TJ5GgMCvo4MLwiDKKvQs9Wm2uleoAlILcdJ5xZjSlWoAQ-yZo4eEJx-y7xj7nsncF8kF79X6yIj3tGrQSlNly9ImPWy4cOEfodxs_Qp0R7qr5xRMRKl8n6ydfkA2Hr7DnDjtaFauQYREu5HHTUP9uBTmrPLwbN68ru3Hzw4Kdp9gtnVsQVS4Mz2Blh7_FQA50XJywv3R-fs0Pgdlx5438"
                onError={(e) => {
                  e.currentTarget.src = "/assets/landing-screen.png";
                }}
              />
              <div className="absolute inset-0 bg-primary/10 backdrop-contrast-125 pointer-events-none"></div>

              <div className="absolute top-6 left-6 right-12 p-2 bg-secondary-container/90 text-on-secondary-container rounded shadow-md flex items-center justify-between">
                <span className="font-label-md text-label-md font-bold">തിരുവനന്തപുരം → കണ്ണൂർ (FP-882)</span>
                <span className="font-label-md text-label-md px-1.5 bg-surface-container-lowest text-primary rounded font-bold">
                  98.4% Match
                </span>
              </div>

              <div className="absolute top-24 left-6 right-16 p-2 bg-secondary-container/90 text-on-secondary-container rounded shadow-md flex items-center justify-between">
                <span className="font-label-md text-label-md font-bold">കോട്ടയം വഴി / VIA KOTTAYAM</span>
                <span className="font-label-md text-label-md px-1.5 bg-surface-container-lowest text-primary rounded font-bold">
                  99.1% Match
                </span>
              </div>

              <div className="absolute top-44 left-6 right-14 p-2 bg-secondary-container/90 text-on-secondary-container rounded shadow-md flex items-center justify-between">
                <span className="font-label-md text-label-md font-bold">പുറപ്പെടൽ: 05:30 AM • PLATFORM 4</span>
                <span className="font-label-md text-label-md px-1.5 bg-surface-container-lowest text-primary rounded font-bold">
                  97.8% Match
                </span>
              </div>
            </div>

            <div className="mt-space-sm flex items-center justify-between text-on-surface-variant font-label-md text-label-md">
              <span>Stained ink tolerance: Active</span>
              <span>Dot-matrix glyph reconstruction: Engaged</span>
            </div>
          </div>

          {/* Right GTFS Synthesized Card */}
          <div className="lg:col-span-6 bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between pb-space-sm mb-space-sm bg-surface-container px-space-sm py-1 rounded">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">memory</span>
                  <span className="font-label-md text-label-md font-bold uppercase text-on-surface">
                    Synthesized GTFS Feed
                  </span>
                </div>
                <span className="font-label-md text-label-md px-1.5 py-0.5 bg-secondary-container/30 text-on-secondary-container rounded font-bold">
                  Verified Feed 2024-Q3
                </span>
              </div>

              <div className="space-y-space-sm">
                <div className="p-space-sm bg-surface-container-low rounded flex items-center justify-between border border-surface-container">
                  <div className="flex items-center gap-space-sm">
                    <span className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-label-lg">
                      SF
                    </span>
                    <div>
                      <h4 className="font-title-md text-title-md text-on-surface leading-tight font-bold">
                        Trivandrum → Kannur Super Fast
                      </h4>
                      <span className="font-label-md text-label-md text-on-surface-variant">
                        Trip ID: KL-RTC-SF-0530 • Via MC Road &amp; NH66
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">05:30</span>
                    <span className="block font-label-md text-label-md text-on-surface-variant">
                      Central Bay #4
                    </span>
                  </div>
                </div>

                <div className="p-space-sm bg-surface-container rounded flex flex-col space-y-2 border border-surface-container-high">
                  <div className="flex items-center justify-between font-label-md text-label-md text-on-surface-variant">
                    <span>Waypoint Sequence (12 Major Terminals)</span>
                    <span>482 Kilometers</span>
                  </div>
                  <div className="w-full bg-surface-dim h-2 rounded overflow-hidden">
                    <div className="bg-secondary h-full w-2/3"></div>
                  </div>
                  <div className="flex justify-between font-label-md text-label-md text-on-surface font-semibold">
                    <span>TVM Central (05:30)</span>
                    <span>Kottayam (08:45)</span>
                    <span>Ernakulam (10:15)</span>
                    <span>Kannur (18:10)</span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-space-sm rounded border border-surface-container">
                  <span className="font-label-md text-label-md uppercase text-on-surface-variant block mb-1 font-bold">
                    Generated Static Schedule JSON-LD
                  </span>
                  <pre className="font-label-md text-label-md text-primary bg-surface-container-high p-space-sm rounded overflow-x-auto">
                    <code>
{`{"trip_id":"KL-15-0007","service_type":"SUPER_FAST","stops":[{"stop_id":"TVM_CEN","dep":19800},{"stop_id":"KTYM_DEP","arr":31500},{"stop_id":"KNR_MAIN","arr":65400}]}`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="mt-space-md pt-space-sm flex items-center justify-between border-t border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">thumb_up</span>
                <span className="font-body-md text-body-md text-on-surface font-semibold">
                  Chief Inspector Sign-Off: Ready
                </span>
              </div>
              <Link
                href="/verification"
                className="px-space-md py-1.5 bg-primary text-on-primary font-label-md text-label-md uppercase rounded hover:brightness-110 transition font-bold"
              >
                Inspect &amp; Publish
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Feature Grid */}
      <section className="mb-space-xl">
        <div className="max-w-3xl mb-space-lg">
          <span className="font-label-md text-label-md uppercase font-bold text-secondary tracking-wider">
            Industrial Transport Stack
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1 font-bold">
            Built specifically for the rugged logistics of Kerala RTC
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
            Engineered to decode decades of physical ledger variants, monsoon-bleached boards, and
            depot-level dialect schedules without human bottlenecking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {/* Card 1 */}
          <Link
            href="/upload"
            className="card-interactive bg-surface-container p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary flex items-center justify-center mb-space-md shadow">
                <span className="material-symbols-outlined">document_scanner</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-bold">
                Domain-Specific AI OCR
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Custom models trained on dot-matrix printer artifacts, carbon-copy logs, and chalk-written depot platform rosters.
              </p>
            </div>
            <div className="mt-space-md pt-space-sm flex items-center gap-1 font-label-md text-label-md text-primary font-bold">
              <span>99.2% Character Accuracy</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            href="/ai-search"
            className="card-interactive bg-surface-container p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-secondary text-on-secondary flex items-center justify-center mb-space-md shadow">
                <span className="material-symbols-outlined">translate</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-bold">
                Bilingual Transit NLP
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Seamless cross-lingual resolution between formal Malayalam station stops and Manglish phonetic transliterations.
              </p>
            </div>
            <div className="mt-space-md pt-space-sm flex items-center gap-1 font-label-md text-label-md text-secondary font-bold">
              <span>Malayalam &amp; English Parity</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            href="/verification"
            className="card-interactive bg-surface-container p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-space-md shadow">
                <span className="material-symbols-outlined">fact_check</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-bold">
                Human-in-the-Loop Verification
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Ergonomic depot desk review interface flagging anomalies, overlapping running times, and conflicting driver turnarounds.
              </p>
            </div>
            <div className="mt-space-md pt-space-sm flex items-center gap-1 font-label-md text-label-md text-tertiary font-bold">
              <span>Zero Uninspected Commits</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </Link>

          {/* Card 4 */}
          <Link
            href="/map"
            className="card-interactive bg-surface-container p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary text-on-primary flex items-center justify-center mb-space-md shadow">
                <span className="material-symbols-outlined">alt_route</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-bold">
                Geospatial Route Mapping
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Automatic stop resolution onto OpenStreetMap transit nodes with ghat-section slope compensation and real road transit timings.
              </p>
            </div>
            <div className="mt-space-md pt-space-sm flex items-center gap-1 font-label-md text-label-md text-primary font-bold">
              <span>OSM &amp; Kerala GIS Tied</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </Link>

          {/* Card 5 */}
          <Link
            href="/ai-search"
            className="card-interactive bg-surface-container p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center mb-space-md shadow">
                <span className="material-symbols-outlined">psychology</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-bold">
                Natural Language Bus Queries
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Commuters search naturally: &ldquo;Evening super fast from Aluva to Munnar via Kothamangalam&rdquo; with instantaneous parsed graphs.
              </p>
            </div>
            <div className="mt-space-md pt-space-sm flex items-center gap-1 font-label-md text-label-md text-secondary font-bold">
              <span>Conversational Semantics</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </Link>

          {/* Card 6 */}
          <Link
            href="/timetables"
            className="card-interactive bg-surface-container p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-surface-tint text-on-primary flex items-center justify-center mb-space-md shadow">
                <span className="material-symbols-outlined">dataset</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-bold">
                Instant GTFS &amp; Open Data Export
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Converts local depot schedules into globally consumable GTFS-Static &amp; GTFS-Realtime feeds compatible with navigation services.
              </p>
            </div>
            <div className="mt-space-md pt-space-sm flex items-center gap-1 font-label-md text-label-md text-primary font-bold">
              <span>Standardized Export Specs</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Deployment Ready Callout */}
      <section className="bg-surface-container-high p-space-lg sm:p-space-xl rounded-xl shadow-lg mb-space-xl border border-surface-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
          <div className="lg:col-span-8 flex flex-col space-y-space-xs">
            <span className="font-label-md text-label-md uppercase font-bold text-secondary">
              Transit Operations • Deployment Ready
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Equip your depot with automated schedule ingestion today
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Join station masters and traffic superintendents across 14 Kerala districts modernizing
              schedule availability for millions of daily passengers.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-space-sm justify-center">
            <Link
              href="/dashboard"
              className="px-space-lg py-space-sm bg-primary text-on-primary font-headline-sm text-headline-sm rounded hover:brightness-110 shadow transition flex items-center justify-center gap-2 font-bold"
            >
              <span className="material-symbols-outlined">terminal</span>
              <span>Access Depot Desk</span>
            </Link>
            <button
              onClick={handleDownloadSampleGtfs}
              className="px-space-lg py-space-sm bg-surface-container text-on-surface font-title-md text-title-md rounded hover:bg-surface-dim transition flex items-center justify-center gap-2 border border-surface-container-highest"
            >
              <span className="material-symbols-outlined">download</span>
              <span>Download GTFS Archive</span>
            </button>
          </div>
        </div>
      </section>

      {/* Heritage Footer */}
      <footer className="py-space-md bg-surface-container-low rounded-xl px-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm border border-surface-container">
        <div className="flex items-center gap-space-sm">
          <span className="font-headline-sm text-headline-sm text-primary font-bold">
            AnaVandi Connect
          </span>
          <span className="font-label-md text-label-md text-on-surface-variant">
            Kerala State Road Transport Open Intelligence Initiative
          </span>
        </div>
        <div className="flex items-center gap-space-md font-label-md text-label-md text-on-surface-variant">
          <span>Ashok Leyland Chassis Series #KL-AL-730</span>
          <span>•</span>
          <span>Depot Telemetry Active</span>
        </div>
      </footer>
    </div>
  );
}
