import { useState, useEffect, useCallback } from "react";
import {
  getSettings,
  updateSettings,
  getMonthHabits,
  upsertDay,
  resetAllHabits,
  getStreaks,
  getCraftTotal,
} from "./api";
import {
  getSchedule,
  getDayTasks,
  fmtDate,
  isToday,
  isFuture,
  nowTimeStr,
  getThreeMonths,
  daysUntilBirthday,
  getHabitSummary,
  CRAFT_PHASES,
  DAY_NAMES,
  CAT_STYLES,
} from "./scheduleData";
import Calendar from "./components/Calendar";
import DayModal from "./components/DayModal";
import Sidebar from "./components/Sidebar";
import ExamTracker from "./components/ExamTracker";
export default function App() {
  const [birthdayDate, setBirthdayDate] = useState("");
  const [monthData, setMonthData] = useState({});
  const [streaks, setStreaks] = useState({});
  const [craftTotal, setCraftTotal] = useState(0);
  const [activeMonth, setActiveMonth] = useState(0);
  const [modalDate, setModalDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [showReset, setShowReset] = useState(false);
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
      const [s, c] = await Promise.all([getStreaks(), getCraftTotal()]);
      setStreaks(s);
      setCraftTotal(c.totalMinutes || 0);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const s = await getSettings();
      setBirthdayDate(s.birthdayDate);
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
      craftMinutes: ov.craftMinutes ?? c.craftMinutes ?? null,
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
    const tasks = getDayTasks(ds, birthdayDate, { ...c, habits: h });
    if (tasks.filter((t) => t.trackable).every((t) => h[t.key]))
      showToast("All habits completed!", "success");
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
    const sched = getSchedule(ds, birthdayDate);
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
    showToast("Task added — times reshuffled", "info");
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
    showToast("Task removed — times reshuffled back", "info");
  };

  const moveTask = async (ds, key, direction) => {
    const c = monthData[ds] || {};
    const order = [
      ...(c.taskOrder ||
        getSchedule(ds, birthdayDate).blocks.map((b) => b.key)),
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
  const changeBirthday = async (v) => {
    setBirthdayDate(v);
    try {
      await updateSettings({ birthdayDate: v });
    } catch (e) {}
  };
  const handleReset = async () => {
    try {
      await resetAllHabits();
      setMonthData({});
      setStreaks({});
      setCraftTotal(0);
      setShowReset(false);
      showToast("All data reset", "info");
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

  const daysLeft = birthdayDate ? daysUntilBirthday(birthdayDate) : 0;
  const todayStr = fmtDate(new Date());
  const todayTasks = birthdayDate
    ? getDayTasks(todayStr, birthdayDate, monthData[todayStr])
    : [];
  const todaySched = birthdayDate ? getSchedule(todayStr, birthdayDate) : null;

  if (loading || !birthdayDate)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cream-deep border-t-terra rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-bark-muted font-medium">Loading...</p>
        </div>
      </div>
    );

  return (
    <>
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast show px-4 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 ${t.type === "success" ? "bg-mint text-white" : t.type === "warn" ? "bg-gold text-white" : "bg-bark text-cream"}`}
          >
            <i
              className={`fa-solid ${t.type === "success" ? "fa-check-circle" : t.type === "warn" ? "fa-triangle-exclamation" : "fa-circle-info"}`}
            ></i>
            {t.message}
          </div>
        ))}
      </div>

      <header className="border-b border-cream-deep bg-white/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-terra flex items-center justify-center">
              <i className="fa-solid fa-calendar-check text-white text-sm"></i>
            </div>
            <div>
              <h1 className="font-display font-black text-xl leading-tight">
                Habit Tracker
              </h1>
              <p className="text-bark-muted text-xs font-medium">
                Birthday Gift Mission
              </p>
            </div>
          </div>
          <div className="sm:ml-auto flex items-center gap-4">
            <div className="text-right">
              {daysLeft < 0 ? (
                <div className="text-bark-muted text-sm font-medium">
                  Birthday passed
                </div>
              ) : daysLeft === 0 ? (
                <div className="countdown-num font-display font-black text-4xl text-gold leading-none">
                  Today!
                </div>
              ) : (
                <>
                  <div className="countdown-num font-display font-black text-4xl text-terra leading-none">
                    {daysLeft}
                  </div>
                  <div className="text-sm font-semibold text-bark-muted">
                    days left
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <label className="text-[10px] uppercase tracking-wider text-bark-muted font-semibold">
                Birthday
              </label>
              <input
                type="date"
                value={birthdayDate}
                onChange={(e) => changeBirthday(e.target.value)}
                className="text-sm border border-cream-deep rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-terra/30 focus:border-terra font-medium w-[160px]"
              />
            </div>
          </div>
        </div>
      </header>

      {daysLeft > 0 ? (
        <div className="bg-terra text-white text-center py-2 text-sm font-bold tracking-wide">
          <i className="fa-solid fa-bolt mr-2"></i>MISSION MODE — {daysLeft}{" "}
          days remaining
        </div>
      ) : (
        <div className="bg-teal text-white text-center py-2 text-sm font-bold tracking-wide">
          <i className="fa-solid fa-leaf mr-2"></i>RECOVERY MODE
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* TODAY TIMELINE */}
        <section className="bg-white rounded-2xl border border-cream-deep p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-base">
                Today's Schedule
              </h2>
              <p className="text-xs text-bark-muted mt-0.5">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}{" "}
                —{" "}
                <span
                  className={`font-semibold ${todaySched?.color === "terra" ? "text-terra" : todaySched?.color === "teal" ? "text-teal" : "text-gold-dark"}`}
                >
                  {todaySched?.label}
                </span>
              </p>
            </div>
            <span
              className={`${todaySched?.badgeClass} text-xs font-bold px-3 py-1 rounded-full`}
            >
              <i className={`fa-solid ${todaySched?.icon} mr-1`}></i>
              {todaySched?.sleepTarget}h
            </span>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1">
            {todayTasks.map((t, i) => {
              const cs = CAT_STYLES[t.cat] || CAT_STYLES.routine;
              const dd = monthData[todayStr];
              const ck = t.trackable ? !!dd?.habits?.[t.key] : null;
              const li = t.key ? dd?.lateEntries?.[t.key] : null;
              const hi =
                t.cat === "gov" ||
                t.cat === "craft" ||
                t.cat === "pooja" ||
                t.cat === "exercise";
              return (
                <div
                  key={i}
                  className={`tl-card flex-shrink-0 w-[160px] ${cs.bg} ${cs.border} border rounded-xl p-3 ${hi ? "ring-1 ring-terra/10" : ""} ${li ? "ring-1 ring-gold/40" : ""} ${t.isCustom ? "ring-1 ring-bark-light/30" : ""}`}
                >
                  <div
                    className={`text-[10px] font-bold ${cs.text} uppercase tracking-wider mb-1 flex items-center gap-1`}
                  >
                    {t.time}
                    {t.pinned && (
                      <i className="fa-solid fa-thumbtack text-[7px] text-bark-light"></i>
                    )}
                    {t.isCustom && (
                      <i className="fa-solid fa-plus text-[7px] text-bark-light"></i>
                    )}
                  </div>
                  <div
                    className={`text-xs font-medium leading-snug ${t.trackable && ck ? "line-through opacity-60" : ""}`}
                  >
                    {t.label}
                  </div>
                  {t.durMins > 0 && (
                    <div className="text-[10px] text-bark-light mt-1">
                      {t.durMins} min
                    </div>
                  )}
                  {t.trackable && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        className={`habit-cb habit-cb-sm ${ck ? "checked" : ""}`}
                        checked={!!ck}
                        onChange={() => toggleHabit(todayStr, t.key)}
                      />
                      <span
                        className={`text-[10px] ${ck ? (li ? "text-gold-dark" : "text-mint") + " font-bold" : "text-bark-light"}`}
                      >
                        {ck ? (li ? "Late" : "Done") : "Track"}
                      </span>
                    </div>
                  )}
                  {li && (
                    <div className="mt-1 text-[9px] text-gold-dark font-medium">
                      <i className="fa-solid fa-clock mr-0.5"></i>
                      {li.actualTime} — {li.reason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Calendar
            months={months}
            activeMonth={activeMonth}
            onSwitchMonth={switchMonth}
            birthdayDate={birthdayDate}
            monthData={monthData}
            onOpenDay={setModalDate}
          />
          <Sidebar
            birthdayDate={birthdayDate}
            craftTotal={craftTotal}
            streaks={streaks}
            monthData={monthData}
            onReset={() => setShowReset(true)}
          />
        </div>
        <ExamTracker />
      </main>

      {modalDate && (
        <DayModal
          dateStr={modalDate}
          birthdayDate={birthdayDate}
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
          <h3 className="font-display font-bold text-lg mb-2">
            Reset All Data?
          </h3>
          <p className="text-bark-muted text-sm mb-5">
            Clears all tracking, custom tasks, reshuffles, and late entries.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowReset(false)}
              className="flex-1 py-2.5 rounded-xl border border-cream-deep font-semibold text-sm hover:bg-cream transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
