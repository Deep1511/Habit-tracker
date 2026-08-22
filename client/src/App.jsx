import { useState, useEffect, useCallback } from "react";
import {
  getSettings,
  updateSettings,
  getMonthHabits,
  upsertDay,
  resetAllHabits,
  getStreaks,
  getMernTotal,
} from "./api";
import {
  getSchedule,
  getDayTasks,
  fmtDate,
  isToday,
  isFuture,
  nowTimeStr,
  getThreeMonths,
  daysUntilTarget,
  getHabitSummary,
  getTopicForDay,
  MERN_PHASES,
  DAY_NAMES,
  CAT_STYLES,
} from "./scheduleData";
import Calendar from "./components/Calendar";
import DayModal from "./components/DayModal";
import Sidebar from "./components/Sidebar";
import ExamTracker from "./components/ExamTracker";
import MernTracker from "./components/MernTracker";
import BookRecommendations from "./components/BookRecommendations";
import TaskDetailModal from "./components/TaskDetailModal";

export default function App() {
  const [startDate, setStartDate] = useState("2026-08-24");
  const [targetDate, setTargetDate] = useState("");
  const [monthData, setMonthData] = useState({});
  const [streaks, setStreaks] = useState({});
  const [mernTotal, setMernTotal] = useState(0);
  const [activeMonth, setActiveMonth] = useState(0);
  const [modalDate, setModalDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [showReset, setShowReset] = useState(false);
  const [showBooks, setShowBooks] = useState(false);
  const [activeTrackerTab, setActiveTrackerTab] = useState("mern"); // 'mern' | 'gov'
  const months = getThreeMonths();

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      2800,
    );
  }, []);

  const loadMonth = useCallback(async (mk) => {
    try {
      const d = await getMonthHabits(mk);
      const m = {};
      d.forEach((x) => (m[x.date] = x));
      setMonthData(m);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const [s, m] = await Promise.all([getStreaks(), getMernTotal()]);
      setStreaks(s);
      setMernTotal(m.totalMinutes || 0);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const s = await getSettings();
      setStartDate(s.startDate || "2026-08-24");
      setTargetDate(s.targetDate || s.birthdayDate || "2026-11-24");
      const m = getThreeMonths(),
        tm = new Date().getMonth(),
        idx = m.findIndex((x) => x.month === tm);
      setActiveMonth(idx >= 0 ? idx : 0);
      await loadMonth(m[idx >= 0 ? idx : 0].key);
      await loadStats();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [loadMonth, loadStats]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const switchMonth = async (i) => {
    setActiveMonth(i);
    await loadMonth(months[i].key);
  };

  // ── Build full payload ────────────────────────────────────
  const buildPayload = (ds, ov = {}) => {
    const c = monthData[ds] || {};
    return {
      habits: ov.habits ?? c.habits ?? {},
      sleepHours: ov.sleepHours ?? c.sleepHours ?? null,
      mernMinutes: ov.mernMinutes ?? c.mernMinutes ?? c.craftMinutes ?? null,
      craftMinutes: ov.mernMinutes ?? c.mernMinutes ?? c.craftMinutes ?? null,
      taskOrder: ov.taskOrder ?? c.taskOrder ?? null,
      customTasks: ov.customTasks ?? c.customTasks ?? null,
      pinnedTimes: ov.pinnedTimes ?? c.pinnedTimes ?? null,
      lateEntries: ov.lateEntries ?? c.lateEntries ?? {},
    };
  };

  // ── Optimistic save ───────────────────────────────────────
  const save = async (ds, payload) => {
    setMonthData((prev) => ({ ...prev, [ds]: { ...payload, date: ds } }));
    try {
      await upsertDay(ds, payload);
      setTimeout(loadStats, 300);
    } catch (e) {
      setMonthData((prev) => {
        const r = { ...prev };
        delete r[ds];
        return r;
      });
      showToast("Save failed", "warn");
    }
  };

  // ── Habit actions ─────────────────────────────────────────
  const toggleHabit = async (ds, key) => {
    const c = monthData[ds] || {};
    const h = { ...c.habits, [key]: !c.habits?.[key] };
    const le = { ...c.lateEntries };
    if (!h[key]) delete le[key];
    await save(ds, buildPayload(ds, { habits: h, lateEntries: le }));
    const tasks = getDayTasks(ds, targetDate, { ...c, habits: h });
    if (tasks.filter((t) => t.trackable).every((t) => h[t.key]))
      showToast("All daily habits completed! Excellent work!", "success");
  };

  const markDoneLate = async (ds, key, actualTime, reason) => {
    const c = monthData[ds] || {};
    const h = { ...c.habits, [key]: true };
    const le = { ...c.lateEntries, [key]: { actualTime, reason } };
    await save(ds, buildPayload(ds, { habits: h, lateEntries: le }));
    showToast(`Marked done at ${actualTime}`, "info");
  };

  const removeLateEntry = async (ds, key) => {
    const c = monthData[ds] || {};
    const le = { ...c.lateEntries };
    delete le[key];
    await save(ds, buildPayload(ds, { lateEntries: le }));
  };

  // ── Schedule manipulation actions ─────────────────────────
  const insertTask = async (ds, afterKey, task) => {
    const c = monthData[ds] || {};
    const sched = getSchedule(ds, targetDate);
    const order = c.taskOrder || sched.blocks.map((b) => b.key);
    const custom = { ...c.customTasks };
    const newKey = `custom_${Date.now()}`;
    custom[newKey] = task;
    const idx = order.indexOf(afterKey);
    const newOrder = [...order];
    newOrder.splice(idx + 1, 0, newKey);
    await save(
      ds,
      buildPayload(ds, { taskOrder: newOrder, customTasks: custom }),
    );
    showToast("Task slot added — times reshuffled", "info");
  };

  const deleteTask = async (ds, key) => {
    const c = monthData[ds] || {};
    const custom = { ...c.customTasks };
    delete custom[key];
    const order = (c.taskOrder || []).filter((k) => k !== key);
    const pin = { ...c.pinnedTimes };
    delete pin[key];
    const h = { ...c.habits };
    delete h[key];
    const le = { ...c.lateEntries };
    delete le[key];
    await save(
      ds,
      buildPayload(ds, {
        taskOrder: order,
        customTasks: custom,
        pinnedTimes: pin,
        habits: h,
        lateEntries: le,
      }),
    );
    showToast("Task slot removed — times reshuffled", "info");
  };

  const moveTask = async (ds, key, direction) => {
    const c = monthData[ds] || {};
    const order = [
      ...(c.taskOrder ||
        getSchedule(ds, targetDate).blocks.map((b) => b.key)),
    ];
    const idx = order.indexOf(key);
    if (idx < 0) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= order.length) return;
    [order[idx], order[newIdx]] = [order[newIdx], order[idx]];
    await save(ds, buildPayload(ds, { taskOrder: order }));
  };

  const pinTime = async (ds, key, time) => {
    const c = monthData[ds] || {};
    const pin = { ...c.pinnedTimes };
    if (time) pin[key] = time;
    else delete pin[key];
    await save(ds, buildPayload(ds, { pinnedTimes: pin }));
  };

  const moveToNow = async (ds, key) => {
    await pinTime(ds, key, nowTimeStr());
    showToast(`Moved to ${nowTimeStr()} — times reshuffled`, "info");
  };

  const resetSchedule = async (ds) => {
    await save(
      ds,
      buildPayload(ds, {
        taskOrder: null,
        customTasks: null,
        pinnedTimes: null,
      }),
    );
    showToast("Schedule reset to default", "info");
  };

  const updateDayField = async (ds, f, v) => {
    await save(ds, buildPayload(ds, { [f]: v }));
  };

  const changeTargetDate = async (v) => {
    setTargetDate(v);
    try {
      await updateSettings({ targetDate: v, birthdayDate: v });
      showToast("Target date updated", "info");
    } catch (e) {}
  };

  const handleReset = async () => {
    try {
      await resetAllHabits();
      setMonthData({});
      setStreaks({});
      setMernTotal(0);
      setShowReset(false);
      showToast("All habit data reset", "info");
    } catch (e) {
      showToast("Reset failed", "warn");
    }
  };

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") {
        if (showReset) setShowReset(false);
        else if (modalDate) setModalDate(null);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [showReset, modalDate]);

  const daysLeft = targetDate ? daysUntilTarget(targetDate) : 0;
  const todayStr = fmtDate(new Date());
  const todayTasks = targetDate
    ? getDayTasks(todayStr, targetDate, monthData[todayStr])
    : [];
  const todaySched = targetDate ? getSchedule(todayStr, targetDate) : null;
  const todayTopic = getTopicForDay(todayStr);

  if (loading || !targetDate)
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cream-deep border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-bark-muted font-medium">Loading Habit Tracker...</p>
        </div>
      </div>
    );

  return (
    <>
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast show px-4 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 ${t.type === "success" ? "bg-emerald-600 text-white" : t.type === "warn" ? "bg-amber-600 text-white" : "bg-bark text-cream"}`}
          >
            <i
              className={`fa-solid ${t.type === "success" ? "fa-circle-check" : t.type === "warn" ? "fa-triangle-exclamation" : "fa-circle-info"}`}
            ></i>
            {t.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="border-b border-cream-deep bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-teal-600 flex items-center justify-center shadow-sm">
              <i className="fa-solid fa-layer-group text-white text-sm"></i>
            </div>
            <div>
              <h1 className="font-display font-black text-xl leading-tight text-bark">
                Habit Tracker
              </h1>
              <p className="text-bark-muted text-xs font-semibold">
                MERN Full-Stack & Govt Exam Sprint
              </p>
            </div>
          </div>

          <div className="sm:ml-auto flex items-center gap-4">
            <div className="text-right">
              {daysLeft < 0 ? (
                <div className="text-teal-700 text-xs font-bold bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                  Target Reached / Mastery Mode
                </div>
              ) : daysLeft === 0 ? (
                <div className="countdown-num font-display font-black text-3xl text-emerald-600 leading-none">
                  Target Day!
                </div>
              ) : (
                <>
                  <div className="countdown-num font-display font-black text-3xl text-indigo-600 leading-none">
                    {daysLeft}
                  </div>
                  <div className="text-xs font-bold text-bark-muted">
                    days to interview sprint
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBooks(true)}
                className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                title="View Recommended Books & Amazon Links"
              >
                <i className="fa-solid fa-book-open text-purple-600"></i>
                <span className="hidden sm:inline">Book List</span>
              </button>

              <div className="flex flex-col items-end gap-1">
                <label className="text-[10px] uppercase tracking-wider text-bark-muted font-bold">
                  Target Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => changeTargetDate(e.target.value)}
                  className="text-xs border border-cream-deep rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-semibold w-[150px]"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Banner */}
      {daysLeft > 0 ? (
        <div className="bg-gradient-to-r from-indigo-600 via-teal-600 to-indigo-700 text-white text-center py-2 px-4 text-xs sm:text-sm font-bold tracking-wide shadow-xs flex items-center justify-center gap-2">
          <i className="fa-solid fa-bolt"></i>
          <span>SPRINT MODE — {daysLeft} days remaining for MERN & Govt Exam mastery</span>
        </div>
      ) : (
        <div className="bg-teal-700 text-white text-center py-2 px-4 text-xs sm:text-sm font-bold tracking-wide shadow-xs flex items-center justify-center gap-2">
          <i className="fa-solid fa-trophy"></i>
          <span>MAINTENANCE & MASTERY MODE — Keep the daily streak alive</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* TODAY SCHEDULE & CURRICULUM TIMELINE */}
        <section className="bg-white rounded-2xl border border-cream-deep p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base text-bark">
                  Today's Schedule & Routine
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {todayTopic.dayName}: {todayTopic.badge}
                </span>
              </div>
              <p className="text-xs text-bark-muted mt-0.5">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}{" "}
                —{" "}
                <span className="font-semibold text-indigo-700">
                  {todaySched?.label}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-bark-muted hidden sm:inline">
                Sleep target:
              </span>
              <span
                className={`${todaySched?.badgeClass} text-xs font-bold px-3 py-1 rounded-full shadow-xs`}
              >
                <i className={`fa-solid ${todaySched?.icon} mr-1`}></i>
                {todaySched?.sleepTarget}h
              </span>
            </div>
          </div>

          {/* Timeline horizontal scroll cards */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1">
            {todayTasks.map((t, i) => {
              const cs = CAT_STYLES[t.cat] || CAT_STYLES.routine;
              const dd = monthData[todayStr];
              const ck = t.trackable ? !!dd?.habits?.[t.key] : null;
              const li = t.key ? dd?.lateEntries?.[t.key] : null;
              const hi =
                t.cat === "gov" ||
                t.cat === "mern" ||
                t.cat === "pooja" ||
                t.cat === "exercise";

              return (
                <div
                  key={i}
                  onClick={() => setSelectedTask(t)}
                  className={`tl-card flex-shrink-0 w-[170px] ${cs.bg} ${cs.border} border rounded-xl p-3 cursor-pointer hover:shadow-md hover:border-indigo-300 transition-all ${hi ? "ring-1 ring-black/5" : ""} ${li ? "ring-1 ring-amber-400" : ""} ${t.isCustom ? "ring-1 ring-bark-light/30" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div
                      className={`text-[10px] font-bold ${cs.text} uppercase tracking-wider flex items-center gap-1`}
                    >
                      <i className={`fa-solid ${cs.icon} text-[9px]`}></i>
                      {t.time}
                      {t.pinned && (
                        <i className="fa-solid fa-thumbtack text-[7px] text-bark-light"></i>
                      )}
                      {t.isCustom && (
                        <i className="fa-solid fa-plus text-[7px] text-bark-light"></i>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(t);
                      }}
                      className="text-bark-light hover:text-indigo-600 transition-colors p-0.5"
                      title="View description & instructions"
                    >
                      <i className="fa-solid fa-circle-info text-[11px]"></i>
                    </button>
                  </div>

                  <div
                    className={`text-xs font-medium leading-snug ${t.trackable && ck ? "line-through opacity-60 text-bark" : "text-bark"}`}
                  >
                    {t.label}
                  </div>

                  {t.durMins > 0 && (
                    <div className="text-[10px] text-bark-light mt-1">
                      {t.durMins} min
                    </div>
                  )}

                  {t.trackable && (
                    <div
                      className="mt-2 flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className={`habit-cb habit-cb-sm ${ck ? "checked" : ""}`}
                        checked={!!ck}
                        onChange={() => toggleHabit(todayStr, t.key)}
                      />
                      <span
                        className={`text-[10px] ${ck ? (li ? "text-amber-700" : "text-emerald-700") + " font-bold" : "text-bark-light"}`}
                      >
                        {ck ? (li ? "Late" : "Done") : "Track"}
                      </span>
                    </div>
                  )}

                  {li && (
                    <div className="mt-1 text-[9px] text-amber-700 font-semibold truncate">
                      <i className="fa-solid fa-clock mr-0.5"></i>
                      {li.actualTime} — {li.reason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* CALENDAR & SIDEBAR GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Calendar
            months={months}
            activeMonth={activeMonth}
            onSwitchMonth={switchMonth}
            startDate={startDate}
            targetDate={targetDate}
            monthData={monthData}
            onOpenDay={setModalDate}
          />
          <Sidebar
            startDate={startDate}
            targetDate={targetDate}
            mernTotal={mernTotal}
            streaks={streaks}
            monthData={monthData}
            onOpenBooks={() => setShowBooks(true)}
            onReset={() => setShowReset(true)}
          />
        </div>

        {/* SYLLABUS & TRACKER SECTION (TABS: MERN / GOV EXAM) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-cream-deep pb-3">
            <button
              onClick={() => setActiveTrackerTab("mern")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${activeTrackerTab === "mern" ? "bg-indigo-600 text-white shadow-sm" : "bg-white text-bark-muted hover:bg-cream-dark border border-cream-deep"}`}
            >
              <i className="fa-solid fa-code"></i>
              MERN & DSA Interview Master Tracker
            </button>
            <button
              onClick={() => setActiveTrackerTab("gov")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${activeTrackerTab === "gov" ? "bg-terra-dark text-white shadow-sm" : "bg-white text-bark-muted hover:bg-cream-dark border border-cream-deep"}`}
            >
              <i className="fa-solid fa-book-bookmark"></i>
              Government Exam Tracker
            </button>
          </div>

          {activeTrackerTab === "mern" ? <MernTracker /> : <ExamTracker />}
        </div>
      </main>

      {/* DAY DETAIL MODAL */}
      {modalDate && (
        <DayModal
          dateStr={modalDate}
          targetDate={targetDate}
          dayData={monthData[modalDate] || null}
          onToggle={toggleHabit}
          onMarkLate={markDoneLate}
          onRemoveLate={removeLateEntry}
          onInsertTask={insertTask}
          onDeleteTask={deleteTask}
          onMoveTask={moveTask}
          onPinTime={pinTime}
          onMoveToNow={moveToNow}
          onResetSchedule={resetSchedule}
          onUpdateField={updateDayField}
          onClose={() => setModalDate(null)}
        />
      )}

      {/* TASK DETAIL MODAL */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          dateStr={fmtDate(new Date())}
          onClose={() => setSelectedTask(null)}
          onToggle={(key) => toggleHabit(fmtDate(new Date()), key)}
          isDone={!!monthData[fmtDate(new Date())]?.habits?.[selectedTask.key]}
        />
      )}

      {/* BOOK RECOMMENDATIONS MODAL */}
      {showBooks && (
        <BookRecommendations onClose={() => setShowBooks(false)} />
      )}

      {/* RESET CONFIRMATION MODAL */}
      <div
        className={`modal-overlay fixed inset-0 z-[95] bg-bark/30 backdrop-blur-sm flex items-center justify-center p-4 ${showReset ? "" : "hidden"}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowReset(false);
        }}
      >
        <div className="modal-panel bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-triangle-exclamation text-red-500 text-xl"></i>
          </div>
          <h3 className="font-display font-bold text-lg mb-2 text-bark">
            Reset All Habit Data?
          </h3>
          <p className="text-bark-muted text-xs mb-5">
            This will clear all daily tracking, custom schedule reshuffles, logged study minutes, and late entries.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowReset(false)}
              className="flex-1 py-2.5 rounded-xl border border-cream-deep font-semibold text-xs hover:bg-cream transition-colors text-bark"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-xs hover:bg-red-700 transition-colors shadow-sm"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
