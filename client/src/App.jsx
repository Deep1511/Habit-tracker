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
  getDayType,
  fmtDate,
  parseDate,
  isToday,
  isFuture,
  getThreeMonths,
  getMonthGrid,
  daysUntilBirthday,
  getHabitSummary,
  CRAFT_PHASES,
  DAY_NAMES,
  CAT_STYLES,
} from "./scheduleData";
import Calendar from "./components/Calendar";
import DayModal from "./components/DayModal";
import Sidebar from "./components/Sidebar";

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

  const loadMonth = useCallback(async (monthKey) => {
    try {
      const data = await getMonthHabits(monthKey);
      const map = {};
      data.forEach((d) => {
        map[d.date] = d;
      });
      setMonthData(map);
    } catch (err) {
      console.error("Failed to load month:", err);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const [s, c] = await Promise.all([getStreaks(), getCraftTotal()]);
      setStreaks(s);
      setCraftTotal(c.totalMinutes || 0);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const settings = await getSettings();
      setBirthdayDate(settings.birthdayDate);
      const m = getThreeMonths();
      const todayMonth = new Date().getMonth();
      const idx = m.findIndex((x) => x.month === todayMonth);
      setActiveMonth(idx >= 0 ? idx : 0);
      await loadMonth(m[idx >= 0 ? idx : 0].key);
      await loadStats();
    } catch (err) {
      console.error("Init error:", err);
    } finally {
      setLoading(false);
    }
  }, [loadMonth, loadStats]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const switchMonth = async (idx) => {
    setActiveMonth(idx);
    await loadMonth(months[idx].key);
  };

  // ── Helper: build full day data object ────────────────────
  const buildDayPayload = (dateStr, overrides = {}) => {
    const current = monthData[dateStr] || {
      date: dateStr,
      habits: {},
      sleepHours: null,
      craftMinutes: null,
    };
    return {
      habits: overrides.habits ?? current.habits ?? {},
      sleepHours: overrides.sleepHours ?? current.sleepHours ?? null,
      craftMinutes: overrides.craftMinutes ?? current.craftMinutes ?? null,
      timeChanges: overrides.timeChanges ?? current.timeChanges ?? {},
      lateEntries: overrides.lateEntries ?? current.lateEntries ?? {},
    };
  };

  // ── Optimistic save helper ────────────────────────────────
  const optimisticSave = async (dateStr, newDayData) => {
    setMonthData((prev) => ({
      ...prev,
      [dateStr]: { ...newDayData, date: dateStr },
    }));
    try {
      await upsertDay(dateStr, newDayData);
      setTimeout(loadStats, 300);
    } catch (err) {
      // Revert
      setMonthData((prev) => {
        const reverted = { ...prev };
        delete reverted[dateStr];
        return reverted;
      });
      showToast("Failed to save — check server", "warn");
    }
  };

  // ── Toggle habit (done on time) ──────────────────────────
  const toggleHabit = async (dateStr, key) => {
    const current = monthData[dateStr] || {
      habits: {},
      timeChanges: {},
      lateEntries: {},
    };
    const newHabits = { ...current.habits, [key]: !current.habits[key] };
    // If unchecking, also remove any late entry for this key
    const newLate = { ...(current.lateEntries || {}) };
    if (!newHabits[key]) delete newLate[key];
    const payload = buildDayPayload(dateStr, {
      habits: newHabits,
      lateEntries: newLate,
    });
    await optimisticSave(dateStr, payload);

    // Check all done
    const sched = getSchedule(dateStr, birthdayDate);
    const trackable = sched.blocks.filter((b) => b.key);
    if (trackable.every((b) => newHabits[b.key])) {
      showToast("All habits completed!", "success");
    }
  };

  // ── Mark done late ───────────────────────────────────────
  const markDoneLate = async (dateStr, key, actualTime, reason) => {
    const current = monthData[dateStr] || {
      habits: {},
      timeChanges: {},
      lateEntries: {},
    };
    const newHabits = { ...current.habits, [key]: true };
    const newLate = {
      ...(current.lateEntries || {}),
      [key]: { actualTime, reason },
    };
    const payload = buildDayPayload(dateStr, {
      habits: newHabits,
      lateEntries: newLate,
    });
    await optimisticSave(dateStr, payload);
    showToast(`Marked done at ${actualTime}`, "info");

    const sched = getSchedule(dateStr, birthdayDate);
    const trackable = sched.blocks.filter((b) => b.key);
    if (trackable.every((b) => newHabits[b.key])) {
      showToast("All habits completed!", "success");
    }
  };

  // ── Remove late entry (revert to normal done) ────────────
  const removeLateEntry = async (dateStr, key) => {
    const current = monthData[dateStr] || {
      habits: {},
      timeChanges: {},
      lateEntries: {},
    };
    const newLate = { ...(current.lateEntries || {}) };
    delete newLate[key];
    const payload = buildDayPayload(dateStr, { lateEntries: newLate });
    await optimisticSave(dateStr, payload);
  };

  // ── Update time override ─────────────────────────────────
  const updateTimeOverride = async (dateStr, key, newTime) => {
    const current = monthData[dateStr] || {
      habits: {},
      timeChanges: {},
      lateEntries: {},
    };
    const newTC = { ...(current.timeChanges || {}) };
    if (
      newTime &&
      newTime !==
        getSchedule(dateStr, birthdayDate).blocks.find((b) => b.key === key)
          ?.time
    ) {
      newTC[key] = newTime;
    } else {
      delete newTC[key]; // Revert to default
    }
    const payload = buildDayPayload(dateStr, { timeChanges: newTC });
    await optimisticSave(dateStr, payload);
  };

  // ── Update sleep/craft fields ────────────────────────────
  const updateDayField = async (dateStr, field, value) => {
    const payload = buildDayPayload(dateStr, { [field]: value });
    await optimisticSave(dateStr, payload);
  };

  // ── Change birthday date ─────────────────────────────────
  const changeBirthday = async (newDate) => {
    setBirthdayDate(newDate);
    try {
      await updateSettings({ birthdayDate: newDate });
    } catch (err) {
      showToast("Failed to update birthday date", "warn");
    }
  };

  // ── Reset all data ───────────────────────────────────────
  const handleReset = async () => {
    try {
      await resetAllHabits();
      setMonthData({});
      setStreaks({});
      setCraftTotal(0);
      setShowReset(false);
      showToast("All data has been reset", "info");
    } catch (err) {
      showToast("Reset failed", "warn");
    }
  };

  // ── Keyboard ─────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (showReset) setShowReset(false);
        else if (modalDate) setModalDate(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showReset, modalDate]);

  // ── Derived values ───────────────────────────────────────
  const daysLeft = birthdayDate ? daysUntilBirthday(birthdayDate) : 0;
  const isMissionMode = daysLeft > 0;
  const todayStr = fmtDate(new Date());
  const todaySched = birthdayDate ? getSchedule(todayStr, birthdayDate) : null;

  if (loading || !birthdayDate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cream-deep border-t-terra rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-bark-muted font-medium">Loading your tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast show px-4 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 ${
              t.type === "success"
                ? "bg-mint text-white"
                : t.type === "warn"
                  ? "bg-gold text-white"
                  : "bg-bark text-cream"
            }`}
          >
            <i
              className={`fa-solid ${t.type === "success" ? "fa-check-circle" : t.type === "warn" ? "fa-triangle-exclamation" : "fa-circle-info"}`}
            ></i>
            {t.message}
          </div>
        ))}
      </div>

      {/* HEADER */}
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
                <>
                  <div className="text-bark-muted text-sm font-medium">
                    Birthday passed
                  </div>
                </>
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
                Birthday Date
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

      {/* MODE BANNER */}
      {isMissionMode ? (
        <div className="bg-terra text-white text-center py-2 text-sm font-bold tracking-wide">
          <i className="fa-solid fa-bolt mr-2"></i>MISSION MODE — 6hr sleep,
          maximum craft time — {daysLeft} days remaining
        </div>
      ) : (
        <div className="bg-teal text-white text-center py-2 text-sm font-bold tracking-wide">
          <i className="fa-solid fa-leaf mr-2"></i>RECOVERY MODE — Normal sleep
          schedule restored
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* TODAY'S TIMELINE */}
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
                })}
                {" — "}
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
              {todaySched?.sleepTarget}h sleep
            </span>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1">
            {todaySched?.blocks.map((b, i) => {
              const cs = CAT_STYLES[b.cat] || CAT_STYLES.routine;
              const dayD = monthData[todayStr];
              const checked = b.key ? !!dayD?.habits?.[b.key] : null;
              const lateInfo = b.key ? dayD?.lateEntries?.[b.key] : null;
              const overriddenTime = b.key ? dayD?.timeChanges?.[b.key] : null;
              const displayTime = overriddenTime || b.time;
              const isHigh =
                b.cat === "gov" ||
                b.cat === "craft" ||
                b.cat === "pooja" ||
                b.cat === "exercise";
              return (
                <div
                  key={i}
                  className={`tl-card flex-shrink-0 w-[160px] ${cs.bg} ${cs.border} border rounded-xl p-3 ${isHigh ? "ring-1 ring-terra/10" : ""} ${lateInfo ? "ring-1 ring-gold/40" : ""}`}
                >
                  <div
                    className={`text-[10px] font-bold ${cs.text} uppercase tracking-wider mb-1 flex items-center gap-1`}
                  >
                    {displayTime}
                    {overriddenTime && (
                      <i className="fa-solid fa-pen text-[7px] text-bark-light"></i>
                    )}
                  </div>
                  <div
                    className={`text-xs font-medium leading-snug ${b.key && checked ? "line-through opacity-60" : ""}`}
                  >
                    {b.label}
                  </div>
                  {b.dur && (
                    <div className="text-[10px] text-bark-light mt-1">
                      {b.dur}
                    </div>
                  )}
                  {b.key && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        className={`habit-cb habit-cb-sm ${checked ? "checked" : ""}`}
                        checked={!!checked}
                        onChange={() => toggleHabit(todayStr, b.key)}
                      />
                      <span
                        className={`text-[10px] ${checked ? (lateInfo ? "text-gold-dark font-bold" : "text-mint font-bold") : "text-bark-light"}`}
                      >
                        {checked ? (lateInfo ? `Late` : "Done") : "Track"}
                      </span>
                    </div>
                  )}
                  {lateInfo && (
                    <div className="mt-1.5 text-[9px] text-gold-dark font-medium leading-tight">
                      <i class="fa-solid fa-clock mr-0.5"></i>
                      {lateInfo.actualTime} — {lateInfo.reason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* CALENDAR + SIDEBAR */}
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
      </main>

      {/* DAY MODAL */}
      {modalDate && (
        <DayModal
          dateStr={modalDate}
          birthdayDate={birthdayDate}
          dayData={monthData[modalDate] || null}
          onToggle={toggleHabit}
          onMarkLate={markDoneLate}
          onRemoveLate={removeLateEntry}
          onTimeChange={updateTimeOverride}
          onUpdateField={updateDayField}
          onClose={() => setModalDate(null)}
        />
      )}

      {/* RESET MODAL */}
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
            This will clear all tracking data, time changes, late entries, and
            logged hours from the database.
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
