import { useState } from "react";
import {
  getSchedule,
  parseDate,
  isFuture,
  CAT_STYLES,
  daysUntilBirthday,
} from "../scheduleData";

const QUICK_REASONS = [
  "Woke up late",
  "Office overtime",
  "Felt tired / unwell",
  "Family matter",
  "Commute delay",
  "Got busy with something",
  "Other",
];

export default function DayModal({
  dateStr,
  birthdayDate,
  dayData,
  onToggle,
  onMarkLate,
  onRemoveLate,
  onTimeChange,
  onUpdateField,
  onClose,
}) {
  const date = parseDate(dateStr);
  const sched = getSchedule(dateStr, birthdayDate);
  const future = isFuture(dateStr);
  const dateLabel = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const habits = dayData?.habits || {};
  const timeChanges = dayData?.timeChanges || {};
  const lateEntries = dayData?.lateEntries || {};
  const trackable = sched.blocks.filter((b) => b.key);
  const doneCount = trackable.filter((b) => habits[b.key]).length;

  // UI state
  const [editingTime, setEditingTime] = useState(null); // habit key being time-edited
  const [timeInput, setTimeInput] = useState(""); // temp value for time input
  const [lateForm, setLateForm] = useState(null); // habit key with late form open
  const [lateTime, setLateTime] = useState("");
  const [lateReason, setLateReason] = useState("");
  const [lateCustomReason, setLateCustomReason] = useState("");

  // ── Time editing ──────────────────────────────────────────
  const startEditTime = (key, currentDisplayTime) => {
    setEditingTime(key);
    setTimeInput(currentDisplayTime);
  };

  const saveTimeEdit = (key) => {
    if (timeInput.trim()) {
      onTimeChange(dateStr, key, timeInput.trim());
    }
    setEditingTime(null);
    setTimeInput("");
  };

  const cancelTimeEdit = () => {
    setEditingTime(null);
    setTimeInput("");
  };

  // ── Late form ─────────────────────────────────────────────
  const openLateForm = (key) => {
    setLateForm(key);
    setLateTime("");
    setLateReason("");
    setLateCustomReason("");
  };

  const submitLate = (key) => {
    const finalReason =
      lateReason === "Other" ? lateCustomReason.trim() : lateReason;
    if (!lateTime.trim() || !finalReason) return;
    onMarkLate(dateStr, key, lateTime.trim(), finalReason);
    setLateForm(null);
    setLateTime("");
    setLateReason("");
    setLateCustomReason("");
  };

  const cancelLate = () => {
    setLateForm(null);
    setLateTime("");
    setLateReason("");
    setLateCustomReason("");
  };

  // ── Get display time for a block ──────────────────────────
  const getDisplayTime = (block) => {
    if (block.key && timeChanges[block.key]) return timeChanges[block.key];
    return block.time;
  };

  return (
    <div
      className="modal-overlay fixed inset-0 z-[90] bg-bark/30 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-cream-deep flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display font-bold text-lg">{dateLabel}</h3>
              <span
                className={`${sched.badgeClass} text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mt-1.5`}
              >
                <i className={`fa-solid ${sched.icon}`}></i>
                {sched.label}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-cream-dark flex items-center justify-center text-bark-muted transition-colors"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          {!future && (
            <p className="text-[11px] text-bark-light mt-2">
              <i className="fa-solid fa-pen-to-square mr-1"></i>Click any time
              to reschedule it. Use{" "}
              <i className="fa-solid fa-clock text-gold-dark"></i> to log
              done-late with reason.
            </p>
          )}
        </div>

        {/* Body */}
        <div className="px-5 py-4 overflow-y-auto flex-0.5">
          {future && (
            <div className="text-center py-6 mb-4">
              <div className="w-14 h-14 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-3">
                <i className="fa-solid fa-clock text-bark-light text-xl"></i>
              </div>
              <p className="text-sm font-semibold text-bark-muted">
                This day hasn't come yet
              </p>
              <p className="text-xs text-bark-light mt-1">
                Your planned schedule (times are editable):
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            {sched.blocks.map((b, i) => {
              const cs = CAT_STYLES[b.cat] || CAT_STYLES.routine;
              const checked = b.key ? !!habits[b.key] : null;
              const lateInfo = b.key ? lateEntries[b.key] : null;
              const overriddenTime = b.key ? timeChanges[b.key] : null;
              const displayTime = getDisplayTime(b);
              const isHigh =
                b.cat === "gov" ||
                b.cat === "craft" ||
                b.cat === "pooja" ||
                b.cat === "exercise";
              const isLateFormOpen = lateForm === b.key;
              const isTimeEditing = editingTime === b.key;

              return (
                <div key={i}>
                  {/* Main block row */}
                  <div
                    className={`flex items-center gap-3 ${cs.bg} ${cs.border} border rounded-xl px-3 py-2.5 ${isHigh ? "ring-1 ring-terra/8" : ""} ${lateInfo ? "ring-1 ring-gold/40 bg-gold-pale/50" : ""}`}
                  >
                    {/* Checkbox */}
                    {b.key ? (
                      <input
                        type="checkbox"
                        className="habit-cb"
                        checked={!!checked}
                        disabled={future}
                        onChange={() => toggleHabit(dateStr, b.key)}
                      />
                    ) : (
                      <div className="w-6"></div>
                    )}

                    {/* Time — editable */}
                    <div className="w-[72px] flex-shrink-0">
                      {b.key && (isTimeEditing || future) ? (
                        <input
                          type="text"
                          value={timeInput}
                          onChange={(e) => setTimeInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveTimeEdit(b.key);
                            if (e.key === "Escape") cancelTimeEdit();
                          }}
                          onBlur={() => saveTimeEdit(b.key)}
                          autoFocus
                          className="w-full text-[10px] font-bold text-bark bg-white border border-cream-deep rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-terra/30 uppercase tracking-wider"
                          placeholder={b.time}
                        />
                      ) : (
                        <button
                          onClick={() =>
                            b.key && startEditTime(b.key, displayTime)
                          }
                          className={`text-[10px] font-bold ${cs.text} uppercase tracking-wider hover:underline underline-offset-2 decoration-dotted text-left flex items-center gap-1 ${b.key ? "cursor-pointer" : "cursor-default"}`}
                          title={b.key ? "Click to change time" : ""}
                        >
                          {displayTime}
                          {b.key && overriddenTime && (
                            <i className="fa-solid fa-pen text-[7px] text-bark-light no-underline"></i>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Label */}
                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-xs font-medium ${b.key && checked ? "line-through opacity-50" : ""}`}
                      >
                        {b.label}
                      </span>
                    </div>

                    {/* Duration */}
                    {b.dur && (
                      <span className="text-[10px] text-bark-light font-medium flex-shrink-0">
                        {b.dur}
                      </span>
                    )}

                    {/* Category icon */}
                    {b.cat === "exercise" && (
                      <i className="fa-solid fa-dumbbell text-terra-light/30 text-xs flex-shrink-0"></i>
                    )}
                    {b.cat === "pooja" && (
                      <i className="fa-solid fa-om text-terra/30 text-xs flex-shrink-0"></i>
                    )}
                    {b.cat === "gov" && (
                      <i className="fa-solid fa-book text-terra/30 text-xs flex-shrink-0"></i>
                    )}
                    {b.cat === "genai" && (
                      <i className="fa-solid fa-robot text-teal/30 text-xs flex-shrink-0"></i>
                    )}
                    {b.cat === "craft" && (
                      <i className="fa-solid fa-palette text-gold/30 text-xs flex-shrink-0"></i>
                    )}
                  </div>

                  {/* Late info bar (shown when habit was done late) */}
                  {lateInfo && !future && (
                    <div className="ml-9 mr-3 mt-0.5 mb-1 flex items-center justify-between">
                      <span className="text-[11px] text-gold-dark font-medium">
                        <i className="fa-solid fa-clock mr-1"></i>
                        Done at {lateInfo.actualTime} — {lateInfo.reason}
                      </span>
                      <button
                        onClick={() => onRemoveLate(dateStr, b.key)}
                        className="text-[10px] text-bark-light hover:text-terra transition-colors"
                        title="Remove late entry"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  )}

                  {/* Late form (expandable) */}
                  {isLateFormOpen && !future && (
                    <div className="ml-9 mr-3 mt-1 mb-1 bg-gold-pale border border-gold/20 rounded-xl p-3 space-y-2.5">
                      <div className="text-[11px] font-bold text-gold-dark uppercase tracking-wider">
                        <i className="fa-solid fa-clock mr-1"></i>Done Late —
                        Log Details
                      </div>

                      {/* Actual time */}
                      <div>
                        <label className="text-[10px] text-bark-muted font-semibold block mb-1">
                          When did you actually do it?
                        </label>
                        <input
                          type="text"
                          value={lateTime}
                          onChange={(e) => setLateTime(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") submitLate(b.key);
                          }}
                          placeholder="e.g. 7:30 AM"
                          className="w-full text-xs border border-cream-deep rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold font-medium"
                          autoFocus
                        />
                      </div>

                      {/* Quick reasons */}
                      <div>
                        <label className="text-[10px] text-bark-muted font-semibold block mb-1.5">
                          Why?
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {QUICK_REASONS.map((r) => (
                            <button
                              key={r}
                              onClick={() => setLateReason(r)}
                              className={`text-[10px] px-2.5 py-1 rounded-full border font-medium transition-all ${
                                lateReason === r
                                  ? "bg-gold text-white border-gold"
                                  : "bg-white border-cream-deep text-bark-muted hover:border-gold hover:text-gold-dark"
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom reason input */}
                      {lateReason === "Other" && (
                        <input
                          type="text"
                          value={lateCustomReason}
                          onChange={(e) => setLateCustomReason(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") submitLate(b.key);
                          }}
                          placeholder="Type your reason..."
                          className="w-full text-xs border border-cream-deep rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold font-medium"
                          autoFocus
                        />
                      )}

                      {/* Save / Cancel */}
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => submitLate(b.key)}
                          disabled={
                            !lateTime.trim() ||
                            !lateReason ||
                            (lateReason === "Other" && !lateCustomReason.trim())
                          }
                          className="flex-1 text-[11px] font-bold py-2 rounded-lg bg-gold text-white hover:bg-gold-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <i className="fa-solid fa-check mr-1"></i>Save
                        </button>
                        <button
                          onClick={cancelLate}
                          className="px-3 text-[11px] font-bold py-2 rounded-lg border border-cream-deep text-bark-muted hover:bg-cream transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action buttons for unchecked trackable habits */}
                  {b.key &&
                    !checked &&
                    !lateInfo &&
                    !isLateFormOpen &&
                    !future && (
                      <div className="ml-9 mr-3 mt-0.5 mb-1 flex gap-2">
                        <button
                          onClick={() => onToggle(dateStr, b.key)}
                          className="text-[10px] text-mint font-semibold hover:underline"
                        >
                          <i className="fa-solid fa-check mr-0.5"></i>Done on
                          time
                        </button>
                        <button
                          onClick={() => openLateForm(b.key)}
                          className="text-[10px] text-gold-dark font-semibold hover:underline"
                        >
                          <i className="fa-solid fa-clock mr-0.5"></i>Done late
                        </button>
                      </div>
                    )}
                </div>
              );
            })}
          </div>

          {/* Sleep & craft logging */}
          {!future && (
            <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-cream-deep">
              <div>
                <label className="text-[11px] font-bold text-bark-muted uppercase tracking-wider block mb-1.5">
                  <i className="fa-solid fa-bed text-mint mr-1"></i>Sleep Hours
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="12"
                    step="0.5"
                    value={dayData?.sleepHours ?? ""}
                    placeholder={sched.sleepTarget}
                    onChange={(e) =>
                      onUpdateField(
                        dateStr,
                        "sleepHours",
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    className="w-full border border-cream-deep rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-terra/20 focus:border-terra bg-white"
                  />
                  <span className="text-xs text-bark-light flex-shrink-0">
                    / {sched.sleepTarget}h
                  </span>
                </div>
                {dayData?.sleepHours &&
                  (() => {
                    const diff = Number(dayData.sleepHours) - sched.sleepTarget;
                    let msg = "",
                      cls = "";
                    if (diff >= 0) {
                      msg =
                        diff >= 0.5
                          ? `Exceeded by ${Math.abs(diff)}h`
                          : "Met goal";
                      cls = "text-mint";
                    } else if (diff >= -0.5) {
                      msg = `Slightly under (${diff}h)`;
                      cls = "text-gold-dark";
                    } else {
                      msg = `Under by ${Math.abs(diff)}h — recover tomorrow`;
                      cls = "text-terra";
                    }
                    return (
                      <div className={`mt-1.5 text-[11px] ${cls} font-medium`}>
                        <i className="fa-solid fa-circle-info mr-1"></i>
                        {msg}
                      </div>
                    );
                  })()}
              </div>
              <div>
                <label className="text-[11px] font-bold text-bark-muted uppercase tracking-wider block mb-1.5">
                  <i className="fa-solid fa-palette text-gold mr-1"></i>Craft
                  Minutes
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="600"
                    step="5"
                    value={dayData?.craftMinutes ?? ""}
                    placeholder={sched.craftMins}
                    onChange={(e) =>
                      onUpdateField(
                        dateStr,
                        "craftMinutes",
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    className="w-full border border-cream-deep rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-terra/20 focus:border-terra bg-white"
                  />
                  <span className="text-xs text-bark-light flex-shrink-0">
                    min
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-cream-deep flex-shrink-0">
          {!future ? (
            <div className="flex items-center justify-between">
              <div className="text-xs text-bark-muted">
                {doneCount}/{trackable.length} habits completed
                {Object.keys(lateEntries).length > 0 && (
                  <span className="text-gold-dark ml-1">
                    ({Object.keys(lateEntries).length} late)
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-bark text-cream text-xs font-bold rounded-xl hover:bg-bark/90 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="text-right">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-bark text-cream text-xs font-bold rounded-xl hover:bg-bark/90 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
