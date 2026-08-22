import { useState } from "react";
import {
  getDayTasks,
  getSchedule,
  isFuture,
  isToday,
  CAT_STYLES,
  daysUntilTarget,
  getTopicForDay,
  nowTimeStr,
} from "../scheduleData";
import TaskDetailModal from "./TaskDetailModal";

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
  "mern",
  "reading",
  "brain",
  "work",
  "break",
];

export default function DayModal({
  dateStr,
  targetDate,
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
  const tasks = getDayTasks(dateStr, targetDate, dayData);
  const habits = dayData?.habits || {};
  const lateEntries = dayData?.lateEntries || {};
  const trackable = tasks.filter((t) => t.trackable);
  const doneCount = trackable.filter((t) => habits[t.key]).length;
  const sched = getSchedule(dateStr, targetDate);
  const dayTopic = getTopicForDay(dateStr);
  const dateLabel = new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const [selectedTask, setSelectedTask] = useState(null);
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
      <div className="modal-panel bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-cream-deep flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-bark">{dateLabel}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`${sched.badgeClass} text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1`}
                >
                  <i className={`fa-solid ${sched.icon}`}></i>
                  {sched.label}
                </span>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                  {dayTopic.badge}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-cream-dark flex items-center justify-center text-bark-muted"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Topic of Day Quick Card */}
          <div className="mt-3 bg-indigo-50/70 border border-indigo-100 rounded-xl p-2.5">
            <div className="text-[10px] font-bold text-indigo-800 uppercase flex items-center gap-1 mb-0.5">
              <i className="fa-solid fa-graduation-cap text-indigo-600"></i> {dayTopic.dayName} Syllabus Focus
            </div>
            <div className="text-xs text-bark font-semibold">
              <span className="text-indigo-700">DSA:</span> {dayTopic.dsa}
            </div>
            <div className="text-xs text-bark font-semibold mt-0.5">
              <span className="text-teal-700">MERN:</span> {dayTopic.mern}
            </div>
          </div>
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
                <i className="fa-solid fa-rotate-left"></i> Reset to default schedule
              </button>
            </div>
          )}

          {future && (
            <div className="text-center py-3 mb-3 bg-cream rounded-xl">
              <p className="text-xs text-bark-muted font-semibold">
                Future day — preview curriculum & customize schedule slots
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
              t.cat === "mern" ||
              t.cat === "pooja" ||
              t.cat === "exercise";

            return (
              <div key={t.key || i} className="relative group">
                <div
                  className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${cs.bg} border ${cs.border} mb-2 ${hi ? "ring-1 ring-black/5" : ""} ${li ? "ring-1 ring-amber-400" : ""}`}
                >
                  {/* Time */}
                  <div className="flex-shrink-0 w-[72px]">
                    {isTE ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={timeInput}
                          onChange={(e) => setTimeInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && saveTime(t.key)}
                          className="w-16 text-xs px-1 py-0.5 border border-cream-deep rounded bg-white font-bold"
                          autoFocus
                        />
                        <button
                          onClick={() => saveTime(t.key)}
                          className="text-[10px] text-mint font-bold"
                        >
                          ✓
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => !future && startTimeEdit(t.key, t.time)}
                        className={`text-xs font-bold ${cs.text} hover:underline flex items-center gap-1 text-left`}
                        title="Click to edit time"
                      >
                        {t.time}
                        {t.pinned && (
                          <i className="fa-solid fa-thumbtack text-[8px] text-bark-light"></i>
                        )}
                      </button>
                    )}
                    {t.durMins > 0 && (
                      <div className="text-[10px] text-bark-light">
                        {t.durMins} min
                      </div>
                    )}
                  </div>

                  {/* Task details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <div
                        onClick={() => setSelectedTask(t)}
                        className={`text-xs font-medium leading-snug cursor-pointer hover:text-indigo-700 transition-colors ${t.trackable && ck ? "line-through opacity-60 text-bark" : "text-bark"}`}
                        title="Click to view task description & strategy"
                      >
                        {t.label}
                      </div>
                      <button
                        onClick={() => setSelectedTask(t)}
                        className="text-bark-light hover:text-indigo-600 p-0.5 transition-colors"
                        title="View task description & instructions"
                      >
                        <i className="fa-solid fa-circle-info text-[10px]"></i>
                      </button>
                    </div>

                    {li && (
                      <div className="mt-1 text-[10px] text-amber-700 font-semibold flex items-center gap-1">
                        <i className="fa-solid fa-clock"></i> Completed late at {li.actualTime} ({li.reason})
                        <button
                          onClick={() => onRemoveLate(dateStr, t.key)}
                          className="text-bark-light hover:text-red-500 ml-1"
                          title="Remove late mark"
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    )}

                    {/* Late form */}
                    {isLF && (
                      <div className="mt-2 p-2.5 bg-white border border-amber-300 rounded-xl space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. 10:30 PM"
                            value={lateTime}
                            onChange={(e) => setLateTime(e.target.value)}
                            className="w-24 text-xs px-2 py-1 border rounded bg-white"
                          />
                          <select
                            value={lateReason}
                            onChange={(e) => setLateReason(e.target.value)}
                            className="flex-1 text-xs px-2 py-1 border rounded bg-white"
                          >
                            <option value="">Select reason...</option>
                            {QUICK_REASONS.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>
                        {lateReason === "Other" && (
                          <input
                            type="text"
                            placeholder="Enter custom reason"
                            value={lateCustom}
                            onChange={(e) => setLateCustom(e.target.value)}
                            className="w-full text-xs px-2 py-1 border rounded bg-white"
                          />
                        )}
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setLateForm(null)}
                            className="text-xs px-2 py-1 text-bark-muted"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => submitLate(t.key)}
                            className="text-xs px-3 py-1 bg-amber-600 text-white font-bold rounded"
                          >
                            Save Late Entry
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tracking Checkbox & Actions */}
                  {!future && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {t.trackable && (
                        <div className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={!!ck}
                            onChange={() => onToggle(dateStr, t.key)}
                            className="habit-cb habit-cb-sm"
                          />
                          <button
                            onClick={() => openLate(t.key)}
                            className="text-[10px] text-bark-light hover:text-amber-600 px-1 py-0.5 rounded hover:bg-black/5"
                            title="Mark completed at different time"
                          >
                            Late
                          </button>
                        </div>
                      )}

                      {/* Move / Delete */}
                      <div className="flex items-center opacity-40 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onMoveTask(dateStr, t.key, -1)}
                          disabled={i === 0}
                          className="p-1 text-[10px] text-bark-light hover:text-bark disabled:opacity-20"
                          title="Move up"
                        >
                          <i className="fa-solid fa-arrow-up"></i>
                        </button>
                        <button
                          onClick={() => onMoveTask(dateStr, t.key, 1)}
                          disabled={i === tasks.length - 1}
                          className="p-1 text-[10px] text-bark-light hover:text-bark disabled:opacity-20"
                          title="Move down"
                        >
                          <i className="fa-solid fa-arrow-down"></i>
                        </button>
                        {t.isCustom && (
                          <button
                            onClick={() => onDeleteTask(dateStr, t.key)}
                            className="p-1 text-[10px] text-rose-500 hover:text-rose-700"
                            title="Delete custom task"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Insert Task Form */}
                {isIA && (
                  <div className="mb-2 p-3 bg-cream rounded-xl border border-cream-deep space-y-2">
                    <input
                      type="text"
                      placeholder="Task description..."
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded border bg-white"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <select
                        value={newCat}
                        onChange={(e) => setNewCat(e.target.value)}
                        className="text-xs px-2 py-1 rounded border bg-white"
                      >
                        {CAT_OPTIONS.map((c) => (
                          <option key={c} value={c}>
                            {c.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="5"
                        max="240"
                        step="5"
                        value={newDur}
                        onChange={(e) => setNewDur(Number(e.target.value))}
                        className="w-20 text-xs px-2 py-1 rounded border bg-white"
                      />
                      <span className="text-xs text-bark-muted self-center">
                        mins
                      </span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setInsertAfter(null)}
                        className="text-xs px-2 py-1 text-bark-muted"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => submitInsert(t.key)}
                        className="text-xs px-3 py-1 bg-bark text-cream font-bold rounded"
                      >
                        Insert
                      </button>
                    </div>
                  </div>
                )}

                {/* Insert button between tasks */}
                {!future && i < tasks.length - 1 && insertAfter !== t.key && (
                  <div className="flex justify-center my-0.5">
                    <button
                      onClick={() => openInsert(t.key)}
                      className="text-[9px] text-bark-light/40 hover:text-indigo-600 transition-colors flex items-center gap-1 py-0.5 px-2 rounded-full hover:bg-cream-dark"
                    >
                      <i className="fa-solid fa-plus text-[7px]"></i> insert slot
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Sleep & MERN Study logging */}
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
                    placeholder={String(sched.sleepTarget)}
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
              </div>
              <div>
                <label className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block mb-1.5">
                  <i className="fa-solid fa-code text-indigo-600 mr-1"></i>MERN & DSA Mins
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="600"
                    step="5"
                    value={dayData?.mernMinutes ?? dayData?.craftMinutes ?? ""}
                    placeholder={String(sched.mernMins || 120)}
                    onChange={(e) =>
                      onUpdateField(
                        dateStr,
                        "mernMinutes",
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    className="w-full border border-cream-deep rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
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
                <span className="font-bold text-bark">{doneCount}/{trackable.length}</span> habits done
                {Object.keys(lateEntries).length > 0 && (
                  <span className="text-amber-700 ml-1 font-semibold">
                    ({Object.keys(lateEntries).length} late)
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-bark text-cream text-xs font-bold rounded-xl hover:bg-bark/90 transition-colors shadow-sm"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="text-right">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-bark text-cream text-xs font-bold rounded-xl hover:bg-bark/90 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TASK DETAIL MODAL */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          dateStr={dateStr}
          onClose={() => setSelectedTask(null)}
          onToggle={(key) => onToggle(dateStr, key)}
          isDone={!!habits[selectedTask.key]}
        />
      )}
    </div>
  );
}
