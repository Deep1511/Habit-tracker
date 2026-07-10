import { useState } from "react";
import {
  getDayTasks,
  getSchedule,
  isFuture,
  isToday,
  CAT_STYLES,
  daysUntilBirthday,
  nowTimeStr,
} from "../scheduleData";

const QUICK_REASONS = [
  "Woke up late",
  "Office overtime",
  "Felt tired / unwell",
  "Family matter",
  "Commute delay",
  "Got busy",
  "Other",
];
const CAT_OPTIONS = [
  "routine",
  "exercise",
  "pooja",
  "gov",
  "genai",
  "craft",
  "work",
  "break",
];

export default function DayModal({
  dateStr,
  birthdayDate,
  dayData,
  onToggle,
  onMarkLate,
  onRemoveLate,
  onInsertTask,
  onDeleteTask,
  onMoveTask,
  onPinTime,
  onMoveToNow,
  onResetSchedule,
  onUpdateField,
  onClose,
}) {
  const future = isFuture(dateStr);
  const isT = isToday(dateStr);
  const tasks = getDayTasks(dateStr, birthdayDate, dayData);
  const habits = dayData?.habits || {};
  const lateEntries = dayData?.lateEntries || {};
  const trackable = tasks.filter((t) => t.trackable);
  const doneCount = trackable.filter((t) => habits[t.key]).length;
  const sched = getSchedule(dateStr, birthdayDate);
  const dateLabel = new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const [editingTime, setEditingTime] = useState(null);
  const [timeInput, setTimeInput] = useState("");
  const [lateForm, setLateForm] = useState(null);
  const [lateTime, setLateTime] = useState("");
  const [lateReason, setLateReason] = useState("");
  const [lateCustom, setLateCustom] = useState("");
  const [insertAfter, setInsertAfter] = useState(null);
  const [newLabel, setNewLabel] = useState("");
  const [newDur, setNewDur] = useState(15);
  const [newCat, setNewCat] = useState("routine");

  // ── Time editing ──
  const startTimeEdit = (key, cur) => {
    setEditingTime(key);
    setTimeInput(cur);
  };
  const saveTime = (key) => {
    if (timeInput.trim()) onPinTime(dateStr, key, timeInput.trim());
    setEditingTime(null);
  };
  const cancelTime = () => {
    setEditingTime(null);
  };

  // ── Late form ──
  const openLate = (key) => {
    setLateForm(key);
    setLateTime("");
    setLateReason("");
    setLateCustom("");
  };
  const submitLate = (key) => {
    const r = lateReason === "Other" ? lateCustom.trim() : lateReason;
    if (!lateTime.trim() || !r) return;
    onMarkLate(dateStr, key, lateTime.trim(), r);
    setLateForm(null);
  };

  // ── Insert form ──
  const openInsert = (key) => {
    setInsertAfter(key);
    setNewLabel("");
    setNewDur(15);
    setNewCat("routine");
  };
  const submitInsert = (afterKey) => {
    if (!newLabel.trim()) return;
    onInsertTask(dateStr, afterKey, {
      label: newLabel.trim(),
      durMins: newDur,
      cat: newCat,
    });
    setInsertAfter(null);
  };

  // ── Check if schedule is modified ──
  const isModified = dayData?.taskOrder || dayData?.customTasks;

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
              className="w-8 h-8 rounded-lg hover:bg-cream-dark flex items-center justify-center text-bark-muted"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          {!future && (
            <div className="flex items-center gap-3 mt-3 text-[10px] text-bark-light">
              <span>
                <i className="fa-solid fa-pen-to-square mr-1"></i>Click time to
                change
              </span>
              <span>
                <i className="fa-solid fa-thumbtack mr-1"></i>Thumbtack = pinned
                (won't auto-shift)
              </span>
              <span>
                <i className="fa-solid fa-plus mr-1"></i>Insert tasks between
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-5 py-4 overflow-y-auto flex-1 space-y-0">
          {/* Reset button */}
          {isModified && !future && (
            <div className="mb-3 flex justify-end">
              <button
                onClick={() => onResetSchedule(dateStr)}
                className="text-[11px] font-semibold text-bark-light hover:text-terra transition-colors flex items-center gap-1"
              >
                <i className="fa-solid fa-rotate-left"></i> Reset to default
                schedule
              </button>
            </div>
          )}

          {future && (
            <div className="text-center py-4 mb-3">
              <p className="text-xs text-bark-muted font-semibold">
                Future day — plan your schedule by inserting/reordering tasks
              </p>
            </div>
          )}

          {tasks.map((t, i) => {
            const cs = CAT_STYLES[t.cat] || CAT_STYLES.routine;
            const ck = t.trackable ? !!habits[t.key] : null;
            const li = t.key ? lateEntries[t.key] : null;
            const isTE = editingTime === t.key;
            const isLF = lateForm === t.key;
            const isIA = insertAfter === t.key;
            const hi =
              t.cat === "gov" ||
              t.cat === "craft" ||
              t.cat === "pooja" ||
              t.cat === "exercise";

            return (
              <div key={t.key}>
                {/* ── INSERT FORM ── */}
                {isIA && (
                  <div className="ml-9 mr-3 my-2 bg-cream border-2 border-dashed border-cream-deep rounded-xl p-3 space-y-2">
                    <div className="text-[10px] font-bold text-bark-muted uppercase tracking-wider">
                      <i className="fa-solid fa-plus mr-1"></i>Insert New Task
                    </div>
                    <input
                      type="text"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitInsert(t.key);
                      }}
                      placeholder="Task name..."
                      autoFocus
                      className="w-full text-xs border border-cream-deep rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-terra/20 font-medium"
                    />
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-[9px] text-bark-light font-semibold block mb-0.5">
                          Duration (min)
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="480"
                          step="5"
                          value={newDur}
                          onChange={(e) => setNewDur(Number(e.target.value))}
                          className="w-full text-xs border border-cream-deep rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-terra/20 font-medium"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] text-bark-light font-semibold block mb-0.5">
                          Category
                        </label>
                        <select
                          value={newCat}
                          onChange={(e) => setNewCat(e.target.value)}
                          className="w-full text-xs border border-cream-deep rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-terra/20 font-medium"
                        >
                          {CAT_OPTIONS.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-0.5">
                      <button
                        onClick={() => submitInsert(t.key)}
                        disabled={!newLabel.trim()}
                        className="flex-1 text-[11px] font-bold py-1.5 rounded-lg bg-terra text-white hover:bg-terra-dark transition-colors disabled:opacity-40"
                      >
                        <i className="fa-solid fa-plus mr-1"></i>Insert &
                        Reshuffle
                      </button>
                      <button
                        onClick={() => setInsertAfter(null)}
                        className="px-3 text-[11px] font-bold py-1.5 rounded-lg border border-cream-deep text-bark-muted hover:bg-cream transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* ── TASK ROW ── */}
                <div
                  className={`flex items-center gap-2 ${cs.bg} ${cs.border} border rounded-xl px-3 py-2.5 ${hi ? "ring-1 ring-terra/8" : ""} ${li ? "ring-1 ring-gold/40 bg-gold-pale/40" : ""} ${t.isCustom ? "ring-1 ring-bark-light/20" : ""}`}
                >
                  {/* Reorder arrows */}
                  {!future && (
                    <div className="flex flex-col gap-0.5 flex-shrink-0">
                      <button
                        onClick={() => onMoveTask(dateStr, t.key, -1)}
                        disabled={i === 0}
                        className="w-4 h-3.5 flex items-center justify-center text-bark-light hover:text-bark disabled:opacity-20 disabled:cursor-not-allowed text-[8px]"
                      >
                        <i className="fa-solid fa-caret-up"></i>
                      </button>
                      <button
                        onClick={() => onMoveTask(dateStr, t.key, 1)}
                        disabled={i === tasks.length - 1}
                        className="w-4 h-3.5 flex items-center justify-center text-bark-light hover:text-bark disabled:opacity-20 disabled:cursor-not-allowed text-[8px]"
                      >
                        <i className="fa-solid fa-caret-down"></i>
                      </button>
                    </div>
                  )}

                  {/* Checkbox */}
                  {t.trackable ? (
                    <input
                      type="checkbox"
                      className="habit-cb"
                      checked={!!ck}
                      disabled={future}
                      onChange={() => onToggle(dateStr, t.key)}
                    />
                  ) : (
                    <div className="w-6 flex-shrink-0"></div>
                  )}

                  {/* Time — editable */}
                  <div className="w-[76px] flex-shrink-0">
                    {isTE ? (
                      <input
                        type="text"
                        value={timeInput}
                        onChange={(e) => setTimeInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveTime(t.key);
                          if (e.key === "Escape") cancelTime();
                        }}
                        onBlur={() => saveTime(t.key)}
                        autoFocus
                        className="w-full text-[10px] font-bold text-bark bg-white border border-cream-deep rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-terra/30 uppercase tracking-wider"
                        placeholder={t.time}
                      />
                    ) : (
                      <button
                        onClick={() => !future && startTimeEdit(t.key, t.time)}
                        className={`text-[10px] font-bold ${cs.text} uppercase tracking-wider hover:underline underline-offset-2 decoration-dotted text-left flex items-center gap-1 w-full ${future ? "cursor-default" : ""}`}
                      >
                        {t.time}
                        {t.pinned && (
                          <i className="fa-solid fa-thumbtack text-[7px] text-bark-light no-underline"></i>
                        )}
                        {t.isCustom && (
                          <i className="fa-solid fa-star text-[7px] text-gold no-underline"></i>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-xs font-medium ${t.trackable && ck ? "line-through opacity-50" : ""}`}
                    >
                      {t.label}
                    </span>
                  </div>

                  {/* Duration */}
                  {t.durMins > 0 && (
                    <span className="text-[10px] text-bark-light font-medium flex-shrink-0">
                      {t.durMins}m
                    </span>
                  )}

                  {/* Pin toggle */}
                  {!future && t.key && (
                    <button
                      onClick={() =>
                        t.pinned
                          ? onPinTime(dateStr, t.key, null)
                          : onPinTime(dateStr, t.key, t.time)
                      }
                      title={
                        t.pinned
                          ? "Unpin (revert to auto-time)"
                          : "Pin this time"
                      }
                      className={`w-5 h-5 flex items-center justify-center rounded text-[9px] transition-colors flex-shrink-0 ${t.pinned ? "text-terra" : "text-bark-light/40 hover:text-bark-light"}`}
                    >
                      <i className="fa-solid fa-thumbtack"></i>
                    </button>
                  )}

                  {/* Delete custom */}
                  {t.isCustom && !future && (
                    <button
                      onClick={() => onDeleteTask(dateStr, t.key)}
                      title="Remove task"
                      className="w-5 h-5 flex items-center justify-center rounded text-[9px] text-bark-light/40 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  )}

                  {/* Category icon */}
                  <i
                    className={`fa-solid ${cs.icon} text-[10px] ${cs.dot} opacity-30 flex-shrink-0`}
                  ></i>
                </div>

                {/* Late info */}
                {li && !future && (
                  <div className="ml-[52px] mr-3 mt-0.5 mb-0.5 flex items-center justify-between">
                    <span className="text-[11px] text-gold-dark font-medium">
                      <i className="fa-solid fa-clock mr-1"></i>Done at{" "}
                      {li.actualTime} — {li.reason}
                    </span>
                    <button
                      onClick={() => onRemoveLate(dateStr, t.key)}
                      className="text-[10px] text-bark-light hover:text-terra"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                )}

                {/* Late form */}
                {isLF && !future && (
                  <div className="ml-[52px] mr-3 mt-1 mb-1 bg-gold-pale border border-gold/20 rounded-xl p-3 space-y-2">
                    <div className="text-[10px] font-bold text-gold-dark uppercase tracking-wider">
                      <i className="fa-solid fa-clock mr-1"></i>Done Late
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={lateTime}
                        onChange={(e) => setLateTime(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submitLate(t.key);
                        }}
                        placeholder="e.g. 7:30 AM"
                        autoFocus
                        className="flex-1 text-xs border border-cream-deep rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 font-medium"
                      />
                      <button
                        onClick={() => submitLate(t.key)}
                        disabled={
                          !lateTime.trim() ||
                          !lateReason ||
                          (lateReason === "Other" && !lateCustom.trim())
                        }
                        className="px-3 text-[11px] font-bold py-2 rounded-lg bg-gold text-white hover:bg-gold-dark disabled:opacity-40"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setLateForm(null)}
                        className="px-3 text-[11px] font-bold py-2 rounded-lg border border-cream-deep text-bark-muted hover:bg-cream"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_REASONS.map((r) => (
                        <button
                          key={r}
                          onClick={() => setLateReason(r)}
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-medium transition-all ${lateReason === r ? "bg-gold text-white border-gold" : "bg-white border-cream-deep text-bark-muted hover:border-gold"}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                    {lateReason === "Other" && (
                      <input
                        type="text"
                        value={lateCustom}
                        onChange={(e) => setLateCustom(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submitLate(t.key);
                        }}
                        placeholder="Type reason..."
                        autoFocus
                        className="w-full text-xs border border-cream-deep rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 font-medium"
                      />
                    )}
                  </div>
                )}

                {/* Done-late / Move-to-now buttons */}
                {t.trackable && !ck && !li && !isLF && !future && (
                  <div className="ml-[52px] mr-3 mt-0.5 mb-0.5 flex gap-3">
                    <button
                      onClick={() => onToggle(dateStr, t.key)}
                      className="text-[10px] text-mint font-semibold hover:underline"
                    >
                      <i className="fa-solid fa-check mr-0.5"></i>Done on time
                    </button>
                    <button
                      onClick={() => openLate(t.key)}
                      className="text-[10px] text-gold-dark font-semibold hover:underline"
                    >
                      <i className="fa-solid fa-clock mr-0.5"></i>Done late
                    </button>
                    {isT && (
                      <button
                        onClick={() => onMoveToNow(dateStr, t.key)}
                        className="text-[10px] text-teal font-semibold hover:underline"
                      >
                        <i className="fa-solid fa-forward mr-0.5"></i>Move to
                        now
                      </button>
                    )}
                  </div>
                )}

                {/* Insert button between tasks */}
                {!future && i < tasks.length - 1 && insertAfter !== t.key && (
                  <div className="flex justify-center my-1">
                    <button
                      onClick={() => openInsert(t.key)}
                      className="text-[9px] text-bark-light/40 hover:text-terra transition-colors flex items-center gap-1 py-0.5 px-2 rounded-full hover:bg-cream-dark"
                    >
                      <i className="fa-solid fa-plus text-[7px]"></i> insert
                      task
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Sleep & craft logging */}
          {!future && (
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-cream-deep">
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
                    className="w-full border border-cream-deep rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-terra/20 bg-white"
                  />
                  <span className="text-xs text-bark-light">
                    / {sched.sleepTarget}h
                  </span>
                </div>
                {dayData?.sleepHours &&
                  (() => {
                    const d = Number(dayData.sleepHours) - sched.sleepTarget;
                    let m = "",
                      c = "";
                    if (d >= 0) {
                      m = d >= 0.5 ? `+${Math.abs(d)}h` : "Met";
                      c = "text-mint";
                    } else if (d >= -0.5) {
                      m = `${d}h`;
                      c = "text-gold-dark";
                    } else {
                      m = `${d}h — recover`;
                      c = "text-terra";
                    }
                    return (
                      <div className={`mt-1 text-[11px] ${c} font-medium`}>
                        {m}
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
                    className="w-full border border-cream-deep rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-terra/20 bg-white"
                  />
                  <span className="text-xs text-bark-light">min</span>
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
                {doneCount}/{trackable.length} done
                {Object.keys(lateEntries).length > 0 && (
                  <span className="text-gold-dark ml-1">
                    ({Object.keys(lateEntries).length} late)
                  </span>
                )}
                {dayData?.customTasks &&
                  Object.keys(dayData.customTasks).length > 0 && (
                    <span className="text-bark-light ml-1">
                      (+{Object.keys(dayData.customTasks).length} custom)
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
