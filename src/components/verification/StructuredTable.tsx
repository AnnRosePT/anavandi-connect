"use client";

import React, { useState } from "react";
import { TimetableRecord, StopItem } from "@/types/timetable";

interface StructuredTableProps {
  timetable: TimetableRecord;
  selectedStopIndex: number;
  onSelectStop: (index: number) => void;
  onUpdateStop: (index: number, stop: Partial<StopItem>) => void;
  onAddStop: (stop: Omit<StopItem, "id" | "seq">) => void;
  onRemoveStop: (index: number) => void;
}

export const StructuredTable: React.FC<StructuredTableProps> = ({
  timetable,
  selectedStopIndex,
  onSelectStop,
  onUpdateStop,
  onAddStop,
  onRemoveStop,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<StopItem>>({});
  const [isAddingStop, setIsAddingStop] = useState<boolean>(false);
  const [newStopForm, setNewStopForm] = useState({
    name: "",
    nameMl: "",
    code: "",
    arrival: "08:00 AM",
    departure: "08:05 AM",
  });

  const handleStartEdit = (idx: number, stop: StopItem) => {
    setEditingIndex(idx);
    setEditForm({
      name: stop.name,
      arrival: stop.arrival,
      departure: stop.departure,
    });
  };

  const handleSaveEdit = (idx: number) => {
    onUpdateStop(idx, editForm);
    setEditingIndex(null);
  };

  const handleCreateStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStopForm.name) return;

    onAddStop({
      name: newStopForm.name,
      nameMl: newStopForm.nameMl || newStopForm.name,
      code: newStopForm.code || `KSRTC-${newStopForm.name.slice(0, 3).toUpperCase()}-NEW`,
      arrival: newStopForm.arrival,
      departure: newStopForm.departure,
      confidence: 100,
      status: "verified",
    });

    setIsAddingStop(false);
    setNewStopForm({
      name: "",
      nameMl: "",
      code: "",
      arrival: "08:00 AM",
      departure: "08:05 AM",
    });
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-space-md shadow-md flex flex-col space-y-space-sm">
      {/* Table Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-xs">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary">table_chart</span>
          <div>
            <h3 className="font-title-md text-title-md text-on-surface font-bold leading-tight">
              Digital Transit Output
            </h3>
            <p className="font-label-md text-label-md text-on-surface-variant">
              GTFS Specification • stop_times.txt Draft
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-space-sm py-1 bg-surface-container rounded text-on-surface font-label-md text-label-md font-bold">
            Route: {timetable.title} ({timetable.totalDistanceKm} km)
          </span>
          <button
            onClick={() => setIsAddingStop(true)}
            className="px-space-sm py-1 bg-secondary text-on-secondary rounded font-label-md text-label-md hover:bg-secondary-container hover:text-on-secondary-container transition-colors shadow-sm flex items-center gap-1 font-semibold"
          >
            <span className="material-symbols-outlined text-sm">add</span> Add Stop
          </button>
        </div>
      </div>

      {/* Add Stop Modal / Drawer */}
      {isAddingStop && (
        <form
          onSubmit={handleCreateStop}
          className="p-space-sm bg-surface-container-highest rounded-lg border border-secondary/40 flex flex-wrap items-end gap-space-sm animate-in fade-in"
        >
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs font-label-md text-on-surface-variant uppercase font-bold block mb-1">
              Station Name
            </label>
            <input
              type="text"
              required
              className="w-full px-2 py-1 bg-surface-container-lowest rounded text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none"
              placeholder="e.g. Cherthala"
              value={newStopForm.name}
              onChange={(e) => setNewStopForm({ ...newStopForm, name: e.target.value })}
            />
          </div>
          <div className="w-28">
            <label className="text-xs font-label-md text-on-surface-variant uppercase font-bold block mb-1">
              Arrival
            </label>
            <input
              type="text"
              className="w-full px-2 py-1 bg-surface-container-lowest rounded text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none"
              value={newStopForm.arrival}
              onChange={(e) => setNewStopForm({ ...newStopForm, arrival: e.target.value })}
            />
          </div>
          <div className="w-28">
            <label className="text-xs font-label-md text-on-surface-variant uppercase font-bold block mb-1">
              Departure
            </label>
            <input
              type="text"
              className="w-full px-2 py-1 bg-surface-container-lowest rounded text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none"
              value={newStopForm.departure}
              onChange={(e) => setNewStopForm({ ...newStopForm, departure: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              type="submit"
              className="px-3 py-1 bg-primary text-on-primary rounded text-xs font-bold font-label-md uppercase"
            >
              Insert
            </button>
            <button
              type="button"
              onClick={() => setIsAddingStop(false)}
              className="px-2 py-1 bg-surface-container text-on-surface rounded text-xs font-label-md"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Interactive Table */}
      <div className="overflow-x-auto rounded-lg shadow-sm bg-surface-container-lowest border border-surface-container">
        <table className="w-full text-left font-body-md text-body-md border-collapse">
          <thead>
            <tr className="bg-surface-container text-on-surface font-label-md text-label-md uppercase tracking-wider border-b border-surface-container-high">
              <th className="py-space-sm px-space-md">Seq</th>
              <th className="py-space-sm px-space-md">Stop Name & Code</th>
              <th className="py-space-sm px-space-md">Arrival</th>
              <th className="py-space-sm px-space-md">Departure</th>
              <th className="py-space-sm px-space-md text-center">AI Conf.</th>
              <th className="py-space-sm px-space-md text-right">Status</th>
              <th className="py-space-sm px-space-sm text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container/50 text-on-surface">
            {timetable.stops.map((stop, idx) => {
              const isAnomaly = stop.isAnomaly || stop.status === "needs_review";
              const isSelected = selectedStopIndex === idx;
              const isEditing = editingIndex === idx;

              return (
                <tr
                  key={stop.id || idx}
                  onClick={() => onSelectStop(idx)}
                  className={`transition-colors cursor-pointer ${
                    isAnomaly
                      ? "bg-secondary-container/20 hover:bg-secondary-container/30"
                      : isSelected
                      ? "bg-surface-container-low"
                      : "hover:bg-surface-container-low/50"
                  }`}
                >
                  {/* Sequence */}
                  <td className="py-2.5 px-space-md font-label-md text-label-md font-bold text-on-surface-variant">
                    #{stop.seq}
                  </td>

                  {/* Stop Name & Code */}
                  <td className="py-2.5 px-space-md">
                    {isEditing ? (
                      <input
                        type="text"
                        className="px-2 py-0.5 bg-surface-container-lowest border border-primary rounded text-sm w-full"
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <>
                        <div className="font-title-md text-body-lg font-bold text-on-surface flex items-center gap-1.5">
                          <span>{stop.name}</span>
                          {isAnomaly && (
                            <span
                              className="material-symbols-outlined text-secondary text-sm"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              warning
                            </span>
                          )}
                        </div>
                        <div className="font-label-md text-label-md text-on-surface-variant">
                          {stop.code} {isAnomaly ? "• Conflict Detected" : ""}
                        </div>
                      </>
                    )}
                  </td>

                  {/* Arrival */}
                  <td className="py-2.5 px-space-md font-label-lg text-label-lg">
                    {isEditing ? (
                      <input
                        type="text"
                        className="px-1 py-0.5 bg-surface-container-lowest border border-primary rounded text-xs w-20"
                        value={editForm.arrival || ""}
                        onChange={(e) => setEditForm({ ...editForm, arrival: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className={stop.arrival === "—" ? "text-on-surface-variant" : "text-on-surface font-medium"}>
                        {stop.arrival}
                      </span>
                    )}
                  </td>

                  {/* Departure */}
                  <td className="py-2.5 px-space-md font-label-lg text-label-lg">
                    {isEditing ? (
                      <input
                        type="text"
                        className="px-1 py-0.5 bg-surface-container-lowest border border-primary rounded text-xs w-20 font-bold text-primary"
                        value={editForm.departure || ""}
                        onChange={(e) => setEditForm({ ...editForm, departure: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : isAnomaly ? (
                      <div className="inline-flex flex-col">
                        <span className="font-label-lg text-label-lg font-bold text-primary bg-secondary-fixed px-1.5 py-0.5 rounded shadow-sm">
                          {stop.departure}
                        </span>
                        <span className="font-label-md text-[10px] text-secondary font-medium">
                          Was: 09:10
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-primary">{stop.departure}</span>
                    )}
                  </td>

                  {/* AI Confidence */}
                  <td className="py-2.5 px-space-md text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded font-label-md text-label-md font-bold ${
                        isAnomaly
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-surface-container text-on-surface"
                      }`}
                    >
                      {Math.round(stop.confidence)}%
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-space-md text-right">
                    {isAnomaly ? (
                      <span className="px-2.5 py-1 rounded bg-secondary text-on-secondary font-label-md text-label-md font-bold inline-flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-xs">priority_high</span> Needs Review
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-md text-label-md font-semibold inline-flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-xs text-primary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>{" "}
                        Verified
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-2.5 px-space-sm text-center">
                    {isEditing ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveEdit(idx);
                        }}
                        className="p-1 rounded bg-primary text-on-primary hover:bg-primary-container"
                        title="Save Changes"
                      >
                        <span className="material-symbols-outlined text-sm">check</span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(idx, stop);
                          }}
                          className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container"
                          title="Edit Stop Values"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        {timetable.stops.length > 2 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveStop(idx);
                            }}
                            className="p-1 rounded text-on-surface-variant hover:text-error hover:bg-surface-container"
                            title="Remove Stop"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
