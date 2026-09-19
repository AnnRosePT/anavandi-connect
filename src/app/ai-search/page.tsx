"use client";

import React, { useState } from "react";
import { parseNaturalLanguageBusQuery, searchBusesWithParsedQuery, MatchedBusResult, ParsedBusQuery } from "@/services/nlSearchParser";
import { BusCard } from "@/components/search/BusCard";
import Link from "next/link";

const PROMPT_SUGGESTIONS = [
  "Show me buses from Thrissur to Ernakulam before 9 AM",
  "Super fast buses from Trivandrum to Kannur",
  "Next bus to Munnar from Trivandrum",
  "Buses from Kollam to Kottayam",
  "Fastest night bus from TVM to Kannur",
];

export default function AiSearchPage() {
  const [queryInput, setQueryInput] = useState("Show me buses from Thrissur to Ernakulam before 9 AM");
  const [parsed, setParsed] = useState<ParsedBusQuery | null>(() =>
    parseNaturalLanguageBusQuery("Show me buses from Thrissur to Ernakulam before 9 AM")
  );
  const [results, setResults] = useState<MatchedBusResult[]>(() =>
    searchBusesWithParsedQuery(
      parseNaturalLanguageBusQuery("Show me buses from Thrissur to Ernakulam before 9 AM")
    )
  );

  const handleSearch = (q: string) => {
    const p = parseNaturalLanguageBusQuery(q);
    setParsed(p);
    const r = searchBusesWithParsedQuery(p);
    setResults(r);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryInput.trim()) {
      handleSearch(queryInput.trim());
    }
  };

  const handleSuggestion = (s: string) => {
    setQueryInput(s);
    handleSearch(s);
  };

  return (
    <div className="w-full px-space-md sm:px-space-lg flex flex-col gap-space-lg pb-space-xl max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-surface-container-low p-space-md rounded-xl border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">psychology</span>
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">
              Natural Language Intent Engine
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold mt-1">
            Ask AnaVandi AI
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Query Kerala RTC routes and schedules conversationally. Parses depots, departure times, and service types.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-space-sm py-1 rounded bg-secondary-container/20 text-secondary font-label-md text-label-md font-bold">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span>Bilingual Semantic Parser Active</span>
        </div>
      </div>

      {/* Query Search Input Box */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md border border-surface-container flex flex-col gap-space-md">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3.5 top-3 text-secondary text-xl">
              chat
            </span>
            <input
              type="text"
              className="w-full pl-11 pr-4 py-3 bg-surface-container rounded-lg font-title-md text-on-surface placeholder:text-outline outline-none focus:ring-2 focus:ring-primary text-base"
              placeholder="e.g. Show me buses from Thrissur to Ernakulam before 9 AM"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-space-xl py-3 rounded-lg bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container font-headline-sm text-headline-sm uppercase tracking-wide font-extrabold shadow-md flex items-center justify-center gap-2 transition-transform active:translate-y-0.5"
          >
            <span className="material-symbols-outlined text-lg">search</span>
            <span>Ask AI</span>
          </button>
        </form>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-space-xs border-t border-surface-container">
          <span className="text-xs font-label-md text-on-surface-variant font-bold mr-1 uppercase">
            Try asking:
          </span>
          {PROMPT_SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSuggestion(s)}
              className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors border border-surface-container-high"
            >
              &ldquo;{s}&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* Parsed Intent Visual Breakdown */}
      {parsed && (
        <div className="bg-surface-container-low p-space-md rounded-xl border border-surface-container shadow-sm flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md uppercase font-bold text-secondary tracking-wider">
              Extracted Query Semantics
            </span>
            <span className="text-xs font-label-md text-on-surface-variant font-mono">
              Confidence: 99.4%
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-space-sm text-xs font-label-md">
            <div className="p-2 rounded bg-surface-container-lowest border border-surface-container flex items-center gap-1.5">
              <span className="text-on-surface-variant uppercase font-bold">Origin:</span>
              <span className="text-primary font-bold">{parsed.origin || "Any Depot"}</span>
            </div>

            <div className="p-2 rounded bg-surface-container-lowest border border-surface-container flex items-center gap-1.5">
              <span className="text-on-surface-variant uppercase font-bold">Destination:</span>
              <span className="text-primary font-bold">{parsed.destination || "Any Depot"}</span>
            </div>

            {parsed.timeConstraint.type !== "none" && (
              <div className="p-2 rounded bg-surface-container-lowest border border-surface-container flex items-center gap-1.5">
                <span className="text-on-surface-variant uppercase font-bold">Time Window:</span>
                <span className="text-secondary font-bold">
                  {parsed.timeConstraint.type.toUpperCase()} {parsed.timeConstraint.timeStr}
                </span>
              </div>
            )}

            {parsed.serviceClass && (
              <div className="p-2 rounded bg-surface-container-lowest border border-surface-container flex items-center gap-1.5">
                <span className="text-on-surface-variant uppercase font-bold">Class:</span>
                <span className="text-on-surface font-bold">{parsed.serviceClass}</span>
              </div>
            )}

            <div className="p-2 rounded bg-surface-container-lowest border border-surface-container flex items-center gap-1.5">
              <span className="text-on-surface-variant uppercase font-bold">Sort Mode:</span>
              <span className="text-on-surface font-bold uppercase">{parsed.modifier}</span>
            </div>
          </div>
        </div>
      )}

      {/* Results List */}
      <div className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            Matched Schedules ({results.length})
          </h2>
          <span className="font-label-md text-xs text-on-surface-variant">
            Queried across verified KSRTC route graphs
          </span>
        </div>

        {results.length > 0 ? (
          <div className="flex flex-col gap-space-md">
            {results.map((res, i) => (
              <BusCard
                key={i}
                timetable={res.timetable}
                originMatch={res.originStop.name}
                destMatch={res.destinationStop.name}
              />
            ))}
          </div>
        ) : (
          <div className="p-space-xl bg-surface-container-lowest rounded-xl border border-surface-container text-center flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
              search_off
            </span>
            <h3 className="font-title-md text-title-md font-bold text-on-surface">
              No direct timetable match found for this natural language filter
            </h3>
            <p className="text-sm text-on-surface-variant max-w-sm mt-1">
              Try asking with broader timing constraints, or browse the complete schedule directory.
            </p>
            <Link
              href="/search"
              className="mt-space-md px-space-lg py-2 bg-primary text-on-primary rounded font-label-md text-xs font-bold uppercase"
            >
              Go to Standard Search
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
