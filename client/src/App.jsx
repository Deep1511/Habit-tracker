import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getSettings,
  updateSettings,
  getMonthHabits,
  upsertDay,
  resetAllHabits,
  getStreaks,
  getMernTotal,
  getLocalCache,
} from "./api";
import {
  getSchedule,
  getDayTasks,
  fmtDate,
  isToday,
  isFuture,
  nowTimeStr,
  timeToMins,
  minsToTime,
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
import GenaiTracker from "./components/GenaiTracker";
import DigitalDetoxGuard from "./components/DigitalDetoxGuard";
import TodayLiveHUD from "./components/TodayLiveHUD";
import MernTracker from "./components/MernTracker";
import BookRecommendations from "./components/BookRecommendations";
import TaskDetailModal from "./components/TaskDetailModal";
import StudySessionLogger from "./components/StudySessionLogger";
import MentalModelsModal from "./components/MentalModelsModal";
import ChronoAdvisor from "./components/ChronoAdvisor";
import SmartCopilotAdvisor from "./components/SmartCopilotAdvisor";
import BedtimeSummaryModal from "./components/BedtimeSummaryModal";
import RevisionRadar from "./components/RevisionRadar";
import EmergencyRescueModal from "./components/EmergencyRescueModal";
import RapidDrillModal from "./components/RapidDrillModal";
import MorningSession from "./components/MorningSession";
import MasterSchedule24H from "./components/MasterSchedule24H";
import NaukriProManager from "./components/NaukriProManager";
import StickyNotesStudioModal from "./components/StickyNotesStudioModal";
import AdaptiveTopicModal from "./components/AdaptiveTopicModal";

export default function App() {
  const cachedSettings = getLocalCache("settings", {});
  const [startDate, setStartDate] = useState(
    cachedSettings.startDate && cachedSettings.startDate >= "2026-10-12"
      ? cachedSettings.startDate
      : "2026-10-12"
  );
  const [targetDate, setTargetDate] = useState(
    cachedSettings.targetDate || cachedSettings.birthdayDate || "2026-11-24"
  );

  // Tomorrow calculation (Day 1 kickoff)
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  };
  const tomorrowStr = fmtDate(getTomorrowDate());
  const actualTodayStr = fmtDate(new Date());

  // Default active tracking date to tomorrow since user requested to start from tomorrow and not display today
  const [activeDateStr, setActiveDateStr] = useState(tomorrowStr);
  const isTomorrowActive = activeDateStr === tomorrowStr;

  const [monthData, setMonthData] = useState(() => {
    const tmKey = tomorrowStr.slice(0, 7);
    const cached = getLocalCache(`habits_${tmKey}`, []);
    const m = {};
    cached.forEach((x) => (m[x.date] = x));
    return m;
  });
  const [streaks, setStreaks] = useState(() => getLocalCache("streaks", {}));
  const [mernTotal, setMernTotal] = useState(
    () => getLocalCache("mern_total", { totalMinutes: 0 })?.totalMinutes || 0
  );
  const [activeMonth, setActiveMonth] = useState(() => {
    const m = getThreeMonths(),
      tm = new Date().getMonth(),
      idx = m.findIndex((x) => x.month === tm);
    return idx >= 0 ? idx : 0;
  });
  const [modalDate, setModalDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [showReset, setShowReset] = useState(false);
  const [showBooks, setShowBooks] = useState(false);
  const [showMentalVault, setShowMentalVault] = useState(false);
  const [showStickyNotesModal, setShowStickyNotesModal] = useState(false);
  const [showAdaptiveTopicModal, setShowAdaptiveTopicModal] = useState(false);
  const [curriculumVersion, setCurriculumVersion] = useState(0);

  useEffect(() => {
    const handleCurriculumUpdate = () => setCurriculumVersion((v) => v + 1);
    window.addEventListener("curriculum_updated", handleCurriculumUpdate);
    return () => window.removeEventListener("curriculum_updated", handleCurriculumUpdate);
  }, []);
  const [showBedtimeSummary, setShowBedtimeSummary] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);
  const [todayMission, setTodayMission] = useState(() => {
    return (
      localStorage.getItem("today_mission_" + tomorrowStr) ||
      localStorage.getItem("tomorrow_goal_" + tomorrowStr) ||
      "🏃‍♂️ Day 1: 5:30 AM Outdoor Running + Striver DSA + MERN & GenAI Sprint"
    );
  });
  const [isEditingMission, setIsEditingMission] = useState(false);
  const [missionInput, setMissionInput] = useState("");
  const [showRescueModal, setShowRescueModal] = useState(false);
  const [showRapidDrill, setShowRapidDrill] = useState(false);
  const [activeTrackerTab, setActiveTrackerTab] = useState("mern"); // 'mern' | 'genai'
  const [mainDashboardTab, setMainDashboardTab] = useState("today"); // 'today' | 'trackers' | 'detox' | 'calendar' | 'mindset'
  const [showCopilotCompanion, setShowCopilotCompanion] = useState(false);
  const [showCardioGuide, setShowCardioGuide] = useState(false);
  const [trackerRefreshTrigger, setTrackerRefreshTrigger] = useState(0);
  const [use24HourMasterSchedule, setUse24HourMasterSchedule] = useState(() => {
    return localStorage.getItem("use_24h_master_schedule") === "true";
  });
  const months = getThreeMonths();

  const toggleUse24HourMasterSchedule = () => {
    setUse24HourMasterSchedule((prev) => {
      const next = !prev;
      localStorage.setItem("use_24h_master_schedule", String(next));
      showToast(
        next
          ? "📅 Switched timetable to 24-Hour Master Schedule (MERN Stack • GenAI • Screen Detox)"
          : "📅 Restored default adaptive daily schedule",
        "info"
      );
      return next;
    });
  };

  const handleSaveRescueSession = async (sessionData) => {
    const todayStr = fmtDate(new Date());
    const dd = monthData[todayStr] || {};
    const currentHabits = dd.habits || {};
    const updatedHabits = { ...currentHabits };

    if (sessionData.track === "mern") {
      updatedHabits.mern = true;
      updatedHabits.mernMorning = true;
    } else if (sessionData.track === "genai" || sessionData.track === "gov") {
      updatedHabits.genai = true;
      updatedHabits.genaiNight = true;
    } else if (sessionData.track === "detox") {
      updatedHabits.screenTimeDetox = true;
      updatedHabits.noInstagram = true;
    } else {
      updatedHabits.roomClean = true;
    }

    const newLog = {
      id: `rescue_${Date.now()}`,
      ...sessionData,
      timestamp: new Date().toISOString(),
      timeStr: nowTimeStr(),
      time: nowTimeStr(),
      autoTicked: true,
    };

    const updatedLogs = [newLog, ...(dd.studyLogs || [])];
    const prevMern = dd.mernMinutes || 0;
    const updatedMern = sessionData.track === "mern" ? prevMern + 15 : prevMern;

    const payload = {
      ...dd,
      habits: updatedHabits,
      studyLogs: updatedLogs,
      mernMinutes: updatedMern,
      craftMinutes: updatedMern,
    };

    await save(todayStr, payload);
    setTrackerRefreshTrigger((prev) => prev + 1);
  };

  const handleShiftSchedule = async (shiftMins = 60) => {
    const todayStr = fmtDate(new Date());
    const dd = monthData[todayStr] || {};
    const tasks = getDayTasks(todayStr, targetDate, dd);
    const nowMins = timeToMins(nowTimeStr());

    // Find the first uncompleted task from now onwards, or next pending task
    let targetTask = tasks.find((t) => {
      const taskTimeMins = timeToMins(t.time);
      const isDone = t.trackable && dd?.habits?.[t.key];
      return !isDone && taskTimeMins >= nowMins - 30;
    });

    if (!targetTask) {
      targetTask = tasks.find((t) => t.trackable && !dd?.habits?.[t.key]) || tasks[0];
    }

    if (targetTask) {
      const currentTaskMins = timeToMins(targetTask.time);
      const newMins = currentTaskMins + shiftMins;
      const newTimeStr = minsToTime(newMins);

      const updatedPinned = {
        ...(dd.pinnedTimes || {}),
        [targetTask.key]: newTimeStr,
      };

      await save(todayStr, buildPayload(todayStr, { pinnedTimes: updatedPinned }));
      showToast(
        `🔄 Shifted schedule by +${shiftMins}m! (Next: ${targetTask.label} at ${newTimeStr})`,
        "success"
      );
    } else {
      showToast("No remaining tasks found to shift!", "info");
    }
  };

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
      if (Array.isArray(d)) {
        const m = {};
        d.forEach((x) => (m[x.date] = x));
        setMonthData((prev) => ({ ...prev, ...m }));
      }
    } catch (e) {
      console.warn("Month fetch fallback:", e);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const [s, m] = await Promise.all([getStreaks(), getMernTotal()]);
      if (s) setStreaks(s);
      if (m?.totalMinutes !== undefined) setMernTotal(m.totalMinutes);
    } catch (e) {
      console.warn("Stats fetch fallback:", e);
    }
  }, []);

  const loadAll = useCallback(async () => {
    setIsSyncing(true);
    try {
      const s = await getSettings().catch(() => null);
      if (s?.startDate) setStartDate(s.startDate);
      if (s?.targetDate || s?.birthdayDate) {
        setTargetDate(s.targetDate || s.birthdayDate);
      }
      const m = getThreeMonths(),
        tm = new Date().getMonth(),
        idx = m.findIndex((x) => x.month === tm);
      const activeIdx = idx >= 0 ? idx : 0;
      setActiveMonth(activeIdx);
      await Promise.all([
        loadMonth(m[activeIdx].key),
        loadStats(),
      ]);
    } catch (e) {
      console.warn("Background sync info:", e);
    } finally {
      setIsSyncing(false);
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
      studyLogs: ov.studyLogs ?? c.studyLogs ?? [],
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

  const handleTrackersUpdated = (trackType, updatedData) => {
    setTrackerRefreshTrigger((prev) => prev + 1);
    setTimeout(loadStats, 300);
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
      await updateSettings({
        startDate: "2026-10-12",
        targetDate: "2026-11-24",
        birthdayDate: "2026-11-24",
      });

      // Reset MERN & GenAI trackers to covered: false, testDone: false
      try {
        const mern = await getMernTracker();
        if (mern?.subjects) {
          const cleared = mern.subjects.map((s) => ({
            ...s,
            topics: (s.topics || []).map((t) => ({ ...t, covered: false, testDone: false })),
          }));
          await updateMernTracker(cleared);
        }
      } catch (e) {}

      try {
        const genai = await getGenaiTracker();
        if (genai?.subjects) {
          const cleared = genai.subjects.map((s) => ({
            ...s,
            topics: (s.topics || []).map((t) => ({ ...t, covered: false, testDone: false })),
          }));
          await updateGenaiTracker(cleared);
        }
      } catch (e) {}

      // Clear all cached habits, streaks, missions in localStorage
      if (typeof window !== "undefined") {
        Object.keys(localStorage)
          .filter(
            (k) =>
              k.startsWith("ht_cache_") ||
              k.startsWith("today_mission_") ||
              k.startsWith("tomorrow_goal_")
          )
          .forEach((k) => localStorage.removeItem(k));
      }

      setMonthData({});
      setStreaks({});
      setMernTotal(0);
      setStartDate("2026-10-12");
      setActiveDateStr(tomorrowStr);
      setTodayMission("🏃‍♂️ Day 1: 5:30 AM Outdoor Running + Striver DSA + MERN & GenAI Sprint");
      localStorage.setItem(
        "today_mission_" + tomorrowStr,
        "🏃‍♂️ Day 1: 5:30 AM Outdoor Running + Striver DSA + MERN & GenAI Sprint"
      );
      setShowReset(false);
      setTrackerRefreshTrigger((p) => p + 1);
      showToast("✨ Everything reset to zero! Day 1 starts tomorrow at 5:00 AM (5:30 AM Outdoor Running).", "success");
    } catch (e) {
      showToast("Reset failed: " + e.message, "warn");
    }
  };

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") {
        if (showReset) setShowReset(false);
        else if (showMentalVault) setShowMentalVault(false);
        else if (showBooks) setShowBooks(false);
        else if (selectedTask) setSelectedTask(null);
        else if (modalDate) setModalDate(null);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [showReset, showMentalVault, showBooks, selectedTask, modalDate]);

  const daysLeft = targetDate ? daysUntilTarget(targetDate) : 0;
  const todayStr = activeDateStr; // Map todayStr to active working date (tomorrow by default so today is not displayed)
  const todayTasks = targetDate
    ? getDayTasks(todayStr, targetDate, monthData[todayStr], use24HourMasterSchedule ? "master24h" : null)
    : [];
  const todaySched = targetDate
    ? getSchedule(todayStr, targetDate, use24HourMasterSchedule ? "master24h" : null)
    : null;
  const todayTopic = useMemo(
    () => getTopicForDay(todayStr, startDate),
    [todayStr, startDate, curriculumVersion]
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
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-xl leading-tight text-bark">
                  Habit Tracker
                </h1>
                {isSyncing && (
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    <i className="fa-solid fa-rotate text-[9px] fa-spin"></i>
                    Syncing
                  </span>
                )}
              </div>
              <p className="text-bark-muted text-xs font-semibold">
                MERN Full-Stack, Generative AI & Screen Detox Sprint
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

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowRescueModal(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer animate-pulse"
                title="Low energy or busy? 15-Minute Emergency Day-Rescue to save your streak"
              >
                <i className="fa-solid fa-bolt text-amber-200 text-[11px]"></i>
                <span className="hidden sm:inline">⚡ Day Rescue</span>
                <span className="sm:hidden">Rescue</span>
              </button>

              <button
                onClick={() => setShowRapidDrill(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white text-xs font-black rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="60-Second Rapid-Fire Interview & Exam Flash Drill"
              >
                <i className="fa-solid fa-gamepad text-teal-200 text-[11px]"></i>
                <span className="hidden sm:inline">🥊 60s Drill</span>
                <span className="sm:hidden">Drill</span>
              </button>

              <button
                id="header-bedtime-btn"
                onClick={() => setShowBedtimeSummary(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-indigo-950 to-purple-950 hover:from-indigo-900 hover:to-purple-900 text-white text-xs font-black rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Bedtime Whole Day Review & Tomorrow's Improvement Compass"
              >
                <i className="fa-solid fa-moon text-amber-400 text-[11px]"></i>
                <span className="hidden sm:inline">Bedtime Review</span>
                <span className="sm:hidden">Review</span>
              </button>

              <button
                onClick={() => setShowMentalVault(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Bored or Lazy? Read 30-Sec MERN Analogies & Psychology Tricks"
              >
                <i className="fa-solid fa-lightbulb text-white text-[11px]"></i>
                <span className="hidden sm:inline">Anti-Boredom Vault</span>
                <span className="sm:hidden">Vault</span>
              </button>

              <button
                id="header-sticky-notes-btn"
                onClick={() => setShowStickyNotesModal(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-600 via-amber-700 to-stone-800 hover:from-amber-700 hover:to-stone-900 text-white text-xs font-black rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Physical Wall Sticky Notes & Highlighters Blueprint"
              >
                <span className="text-[11px]">📌</span>
                <span className="hidden sm:inline">Wall Sticky Notes</span>
                <span className="sm:hidden">Notes</span>
              </button>

              <button
                id="header-morning-btn"
                onClick={() => {
                  setMainDashboardTab("today");
                  setShowCardioGuide(true);
                  showToast("🌅 Switched to 5:30 AM Outdoor Running & Morning Protocol", "info");
                }}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white text-xs font-black rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="5:30 AM Outdoor Running & Morning Routine Guide"
              >
                <span>🏃‍♂️</span>
                <span className="hidden sm:inline">5:30 AM Running</span>
                <span className="sm:hidden">Running</span>
              </button>

              <button
                id="header-24h-schedule-btn"
                onClick={() => {
                  setMainDashboardTab("today");
                  setShowCardioGuide(false);
                  showToast("📅 Switched to Today's Flow & 24H Master Timetable", "info");
                }}
                className="px-3 py-1.5 bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                title="View Whole Day Timetable & Live Tasks"
              >
                <i className="fa-solid fa-calendar-days text-amber-600"></i>
                <span className="hidden sm:inline">24H Timetable</span>
              </button>

              <button
                id="header-trackers-btn"
                onClick={() => {
                  setMainDashboardTab("trackers");
                  showToast("💻 Switched to MERN Stack & GenAI Curriculum Roadmaps", "info");
                }}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-900 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                title="MERN & GenAI Roadmaps"
              >
                <i className="fa-solid fa-code text-indigo-600"></i>
                <span className="hidden sm:inline">MERN & GenAI</span>
              </button>

              <button
                id="header-detox-btn"
                onClick={() => {
                  setMainDashboardTab("detox");
                  showToast("📵 Switched to Digital Detox & Screen Time Guard (< 30m)", "info");
                }}
                className="px-3 py-1.5 bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-300 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                title="Jump to Digital Detox & Instagram Screen Time Guard (< 30m)"
              >
                <i className="fa-solid fa-mobile-screen-button text-rose-600"></i>
                <span className="hidden sm:inline">Screen Detox (&lt;30m)</span>
              </button>

              <button
                id="header-books-btn"
                onClick={() => setShowBooks(true)}
                className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                title="View Recommended Books & Amazon Links"
              >
                <i className="fa-solid fa-book-open text-purple-600"></i>
                <span className="hidden sm:inline">Books</span>
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
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white text-center py-2 px-4 text-xs sm:text-sm font-bold tracking-wide shadow-xs flex items-center justify-center gap-2">
          <i className="fa-solid fa-bolt"></i>
          <span>
            {isTomorrowActive
              ? `🚀 DAY 1 SPRINT LAUNCH — Starting Tomorrow (Monday, Oct 12) • ${daysLeft} days remaining • Starting everything from zero`
              : `SPRINT MODE — ${daysLeft} days remaining for MERN Stack & Generative AI Mastery (Screen Time < 30m)`}
          </span>
        </div>
      ) : (
        <div className="bg-teal-700 text-white text-center py-2 px-4 text-xs sm:text-sm font-bold tracking-wide shadow-xs flex items-center justify-center gap-2">
          <i className="fa-solid fa-trophy"></i>
          <span>MAINTENANCE & MASTERY MODE — Keep the daily streak alive</span>
        </div>
      )}

      {/* TODAY'S #1 CORE MISSION ACTIVE BANNER */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-4 py-2.5 shadow-xs border-b border-amber-600/60 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 flex-1 min-w-[260px]">
          <span className="w-7 h-7 rounded-lg bg-black/20 text-amber-200 flex items-center justify-center text-xs font-black flex-shrink-0 shadow-inner">
            <i className="fa-solid fa-crosshairs"></i>
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-amber-100 flex-shrink-0">
            {isTomorrowActive ? "Day 1 Launch Target (Tomorrow):" : "Today's #1 Mission:"}
          </span>
          {isEditingMission ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (missionInput.trim()) {
                  const val = missionInput.trim();
                  setTodayMission(val);
                  localStorage.setItem("today_mission_" + todayStr, val);
                  localStorage.setItem("tomorrow_goal_" + todayStr, val);
                  setIsEditingMission(false);
                  showToast("🎯 Core Target locked in!", "success");
                }
              }}
              className="flex items-center gap-2 flex-1 max-w-md"
            >
              <input
                type="text"
                value={missionInput}
                onChange={(e) => setMissionInput(e.target.value)}
                placeholder="e.g. Master Binary Search + Clean Room..."
                className="text-xs px-2.5 py-1 rounded-lg bg-white text-bark font-bold flex-1 focus:outline-none focus:ring-2 focus:ring-amber-300"
                autoFocus
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-black/30 hover:bg-black/40 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingMission(false)}
                className="text-xs font-bold text-white/80 hover:text-white cursor-pointer px-1"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2 text-xs font-extrabold text-white truncate">
              <span className={monthData[todayStr]?.habits?.coreMission ? "line-through opacity-75" : ""}>
                {todayMission || (isTomorrowActive ? "5:30 AM Outdoor Run + Striver DSA + MERN & GenAI Sprint" : "Click 'Set Goal' to lock in target!")}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {todayMission && !isEditingMission && (
            <button
              type="button"
              onClick={() => {
                toggleHabit(todayStr, "coreMission");
                const nextState = !monthData[todayStr]?.habits?.coreMission;
                if (nextState) {
                  showToast("🎉 Core Mission Accomplished! Incredible focus!", "success");
                }
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                monthData[todayStr]?.habits?.coreMission
                  ? "bg-emerald-700 text-white border border-emerald-500"
                  : "bg-white text-amber-900 hover:bg-amber-50"
              }`}
            >
              <i
                className={`fa-solid ${
                  monthData[todayStr]?.habits?.coreMission
                    ? "fa-circle-check text-emerald-300"
                    : "fa-circle text-amber-400"
                }`}
              ></i>
              <span>
                {monthData[todayStr]?.habits?.coreMission
                  ? "Mission Accomplished! 🎉"
                  : "Mark Done"}
              </span>
            </button>
          )}

          {!isEditingMission && (
            <button
              type="button"
              onClick={() => {
                setMissionInput(todayMission);
                setIsEditingMission(true);
              }}
              className="px-2.5 py-1 bg-black/20 hover:bg-black/30 text-white text-[11px] font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1"
              title="Edit target"
            >
              <i className="fa-solid fa-pen-to-square text-[10px]"></i>
              <span>{todayMission ? "Edit" : "Set Goal"}</span>
            </button>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ══════════════════════════════════════════════════════════════
            TOP EXECUTIVE NAVIGATION SYSTEM (5 DEDICATED APP HUBS)
        ══════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-cream-deep p-2 sm:p-2.5 shadow-sm">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {/* TAB 1: TODAY / TOMORROW FLOW */}
            <button
              onClick={() => {
                setMainDashboardTab("today");
                setShowCardioGuide(false);
              }}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                mainDashboardTab === "today"
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/25"
                  : "text-bark-muted hover:text-bark hover:bg-cream/60"
              }`}
            >
              <i className="fa-solid fa-compass text-amber-400"></i>
              <span>{isTomorrowActive ? "🚀 Tomorrow's Flow & 24H Timetable" : "🎯 Today's Flow & 24H Timetable"}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

            {/* TAB 2: TRACKERS */}
            <button
              onClick={() => setMainDashboardTab("trackers")}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                mainDashboardTab === "trackers"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "text-bark-muted hover:text-bark hover:bg-cream/60"
              }`}
            >
              <i className="fa-solid fa-code text-indigo-300"></i>
              <span>💻 MERN & GenAI Roadmaps</span>
            </button>

            {/* TAB 3: NAUKRI PRO RECRUITER ENGINE */}
            <button
              onClick={() => setMainDashboardTab("naukri")}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                mainDashboardTab === "naukri"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25"
                  : "text-bark-muted hover:text-bark hover:bg-cream/60"
              }`}
            >
              <i className="fa-solid fa-crown text-amber-500"></i>
              <span>💼 Naukri Pro Engine</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-slate-900 text-amber-300">
                10 AM
              </span>
            </button>

            {/* TAB 4: DETOX */}
            <button
              onClick={() => setMainDashboardTab("detox")}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                mainDashboardTab === "detox"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/25"
                  : "text-bark-muted hover:text-bark hover:bg-cream/60"
              }`}
            >
              <i className="fa-solid fa-mobile-screen-button text-rose-300"></i>
              <span>📵 Screen Detox Guard (&lt;30m)</span>
            </button>

            {/* TAB 5: CALENDAR */}
            <button
              onClick={() => setMainDashboardTab("calendar")}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                mainDashboardTab === "calendar"
                  ? "bg-teal-700 text-white shadow-md shadow-teal-700/25"
                  : "text-bark-muted hover:text-bark hover:bg-cream/60"
              }`}
            >
              <i className="fa-solid fa-calendar-days text-teal-300"></i>
              <span>📅 Monthly Calendar & Streaks</span>
            </button>

            {/* TAB 6: MINDSET */}
            <button
              onClick={() => setMainDashboardTab("mindset")}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                mainDashboardTab === "mindset"
                  ? "bg-purple-700 text-white shadow-md shadow-purple-700/25"
                  : "text-bark-muted hover:text-bark hover:bg-cream/60"
              }`}
            >
              <i className="fa-solid fa-brain text-purple-300"></i>
              <span>🧠 Mindset & Drills</span>
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TAB 1: TODAY / TOMORROW MASTER TIMETABLE (DEFAULT HUB)
        ══════════════════════════════════════════════════════════════ */}
        {mainDashboardTab === "today" && (
          <div className="space-y-6">
            {/* Core Hero HUD: Tomorrow Day 1 launch countdown, 5:30 AM outdoor running, daily vitals, and 24H timetable */}
            <TodayLiveHUD
              todayStr={todayStr}
              todayTopic={todayTopic}
              dayData={monthData[todayStr] || {}}
              onToggleHabit={toggleHabit}
              showToast={showToast}
              onOpenTaskDetail={setSelectedTask}
              onOpenDetox={() => setMainDashboardTab("detox")}
              onOpenNaukri={() => setMainDashboardTab("naukri")}
              onOpenStickyNotes={() => setShowStickyNotesModal(true)}
              onOpenAdaptiveTopic={() => setShowAdaptiveTopicModal(true)}
              isTomorrow={isTomorrowActive}
              displayDateStr={activeDateStr}
              onSwitchDate={(toTomorrow) => setActiveDateStr(toTomorrow ? tomorrowStr : actualTodayStr)}
              onResetAllToZero={handleReset}
            />

            {/* Power Drawer Bar: Expand Running Protocol / Expand AI Copilot */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border border-cream-deep p-3 sm:p-4 shadow-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-bark-muted">
                  Quick Focus Tools:
                </span>
                <button
                  type="button"
                  onClick={() => setShowCardioGuide(!showCardioGuide)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    showCardioGuide
                      ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                      : "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100"
                  }`}
                >
                  <i className="fa-solid fa-person-running"></i>
                  <span>{showCardioGuide ? "Hide Running Guide" : "🏃‍♂️ 5:30 AM Outdoor Running Guide"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCopilotCompanion(!showCopilotCompanion)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    showCopilotCompanion
                      ? "bg-indigo-600 text-white border-indigo-700 shadow-xs"
                      : "bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100"
                  }`}
                >
                  <i className="fa-solid fa-robot"></i>
                  <span>{showCopilotCompanion ? "Hide AI Copilot" : "🤖 AI Copilot & Chrono Advisor"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowStickyNotesModal(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 shadow-2xs"
                  title="View 6 Wall Sticky Notes & Highlighters Guide"
                >
                  <span>📌</span>
                  <span>Wall Sticky Notes &amp; Highlighters</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMainDashboardTab("trackers")}
                  className="px-3 py-1.5 bg-cream/70 hover:bg-cream-dark text-bark text-xs font-bold rounded-xl border border-cream-deep transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <i className="fa-solid fa-arrow-right text-[10px] text-indigo-600"></i>
                  <span>Open Full Syllabus</span>
                </button>
              </div>
            </div>

            {/* Optional Expandable: 5:30 AM Outdoor Running & Morning Routine Deep Dive */}
            {showCardioGuide && (
              <div className="animate-fadeIn">
                <MorningSession
                  todayStr={todayStr}
                  dayData={monthData[todayStr] || {}}
                  onToggleHabit={toggleHabit}
                  showToast={showToast}
                />
              </div>
            )}

            {/* Optional Expandable: AI Chrono Advisor & Copilot Hub */}
            {showCopilotCompanion && (
              <div className="space-y-5 animate-fadeIn">
                <ChronoAdvisor
                  onSelectTrack={(track) => {
                    setActiveTrackerTab(track === "mern" ? "mern" : "genai");
                    setMainDashboardTab("trackers");
                    showToast(`Switched view to ${track === "mern" ? "MERN & DSA" : "Generative AI & Autonomous Agents"} Track`, "info");
                  }}
                  onOpenVault={() => setShowMentalVault(true)}
                  onOpenBedtimeSummary={() => setShowBedtimeSummary(true)}
                />

                <SmartCopilotAdvisor
                  monthData={monthData}
                  todayStr={todayStr}
                  todaySched={todaySched}
                  todayTopic={todayTopic}
                  daysLeft={daysLeft}
                  onSelectTrack={(track) => {
                    setActiveTrackerTab(track === "mern" ? "mern" : "genai");
                    setMainDashboardTab("trackers");
                    showToast(`Switched view to ${track === "mern" ? "MERN & DSA" : "Generative AI & Autonomous Agents"} Track`, "info");
                  }}
                  onOpenDrill={() => setShowRapidDrill(true)}
                  onOpenVault={() => setShowMentalVault(true)}
                  onOpenRescue={() => setShowRescueModal(true)}
                  onShiftSchedule={handleShiftSchedule}
                  showToast={showToast}
                />
              </div>
            )}

            {/* Quick Study Session Logger directly accessible on today page */}
            <StudySessionLogger
              dateStr={todayStr}
              dayData={monthData[todayStr] || {}}
              onSaveDay={save}
              onTrackersUpdated={handleTrackersUpdated}
              showToast={showToast}
              refreshTrigger={trackerRefreshTrigger}
              onOpenVault={() => setShowMentalVault(true)}
              onOpenBedtimeSummary={() => setShowBedtimeSummary(true)}
            />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 2: MERN & GENAI CURRICULUM ROADMAPS
        ══════════════════════════════════════════════════════════════ */}
        {mainDashboardTab === "trackers" && (
          <div id="master-trackers-section" className="space-y-6">
            <div className="bg-white rounded-2xl border border-cream-deep p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-black text-lg text-bark">
                  Master Technical Curriculums & Interview Drills
                </h2>
                <p className="text-xs text-bark-muted">
                  Full topic checklists, LeetCode / Striver DSA patterns, system architecture, and Agentic AI workflows.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTrackerTab("mern")}
                  className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                    activeTrackerTab === "mern"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-cream/60 text-bark-muted hover:bg-cream border border-cream-deep"
                  }`}
                >
                  <i className="fa-solid fa-code"></i>
                  <span>MERN & DSA Tracker</span>
                </button>
                <button
                  onClick={() => setActiveTrackerTab("genai")}
                  className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                    activeTrackerTab === "genai" || activeTrackerTab === "gov"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-cream/60 text-bark-muted hover:bg-cream border border-cream-deep"
                  }`}
                >
                  <i className="fa-solid fa-robot"></i>
                  <span>GenAI & Autonomous Agents</span>
                </button>
              </div>
            </div>

            {activeTrackerTab === "mern" ? (
              <MernTracker
                refreshTrigger={trackerRefreshTrigger}
                onTrackerChanged={() => setTrackerRefreshTrigger((p) => p + 1)}
              />
            ) : (
              <GenaiTracker
                refreshTrigger={trackerRefreshTrigger}
                onTrackerChanged={() => setTrackerRefreshTrigger((p) => p + 1)}
              />
            )}

            <StudySessionLogger
              dateStr={todayStr}
              dayData={monthData[todayStr] || {}}
              onSaveDay={save}
              onTrackersUpdated={handleTrackersUpdated}
              showToast={showToast}
              refreshTrigger={trackerRefreshTrigger}
              onOpenVault={() => setShowMentalVault(true)}
              onOpenBedtimeSummary={() => setShowBedtimeSummary(true)}
            />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 3: DIGITAL DETOX & SCREEN TIME GUARD (< 30 MINS)
        ══════════════════════════════════════════════════════════════ */}
        {mainDashboardTab === "detox" && (
          <div id="digital-detox-section" className="space-y-6">
            <DigitalDetoxGuard
              todayStr={todayStr}
              dayData={monthData[todayStr] || {}}
              onToggleHabit={toggleHabit}
              showToast={showToast}
            />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 4: MONTHLY CALENDAR & STREAKS
        ══════════════════════════════════════════════════════════════ */}
        {mainDashboardTab === "calendar" && (
          <div className="space-y-6">
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
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 5: MINDSET, WEAKNESS RADAR & RAPID DRILLS
        ══════════════════════════════════════════════════════════════ */}
        {mainDashboardTab === "mindset" && (
          <div className="space-y-6">
            {/* Quick Action Launchpad */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setShowRapidDrill(true)}
                className="p-5 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg mb-3">
                  <i className="fa-solid fa-gamepad"></i>
                </div>
                <h3 className="font-bold text-sm">60-Second Rapid Drill</h3>
                <p className="text-xs text-white/80 mt-1">
                  High-speed flash recall on MERN, DSA & GenAI concepts.
                </p>
                <div className="mt-3 text-[11px] font-black uppercase tracking-wider text-teal-100 flex items-center gap-1">
                  <span>Start Drill</span>
                  <i className="fa-solid fa-arrow-right text-[9px]"></i>
                </div>
              </div>

              <div
                onClick={() => setShowMentalVault(true)}
                className="p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg mb-3">
                  <i className="fa-solid fa-lightbulb"></i>
                </div>
                <h3 className="font-bold text-sm">Anti-Boredom Vault</h3>
                <p className="text-xs text-white/80 mt-1">
                  Intuitive analogies and mindset shifts to crush procrastination.
                </p>
                <div className="mt-3 text-[11px] font-black uppercase tracking-wider text-amber-100 flex items-center gap-1">
                  <span>Open Vault</span>
                  <i className="fa-solid fa-arrow-right text-[9px]"></i>
                </div>
              </div>

              <div
                onClick={() => setShowRescueModal(true)}
                className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg mb-3">
                  <i className="fa-solid fa-bolt"></i>
                </div>
                <h3 className="font-bold text-sm">15-Min Emergency Rescue</h3>
                <p className="text-xs text-white/80 mt-1">
                  Busy or low energy? Save your daily streak in just 15 minutes.
                </p>
                <div className="mt-3 text-[11px] font-black uppercase tracking-wider text-indigo-100 flex items-center gap-1">
                  <span>Save Streak</span>
                  <i className="fa-solid fa-arrow-right text-[9px]"></i>
                </div>
              </div>

              <div
                onClick={() => setShowBedtimeSummary(true)}
                className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-500/30 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg mb-3">
                  <i className="fa-solid fa-moon text-amber-400"></i>
                </div>
                <h3 className="font-bold text-sm">Bedtime Reflection</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Review today's hours, lock in tomorrow's #1 goal, and sleep deeply.
                </p>
                <div className="mt-3 text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <span>Start Review</span>
                  <i className="fa-solid fa-arrow-right text-[9px]"></i>
                </div>
              </div>
            </div>

            {/* Spaced Repetition & Revision Radar */}
            <RevisionRadar
              allDays={monthData}
              onSelectTopicForReview={(item) => {
                setActiveTrackerTab("mern");
                setMainDashboardTab("trackers");
                showToast(`Loaded "${item.topicName}" for spaced recall!`, "info");
              }}
            />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB: NAUKRI PRO RECRUITER INFLUX ENGINE & PLAYBOOK
        ══════════════════════════════════════════════════════════════ */}
        {mainDashboardTab === "naukri" && (
          <NaukriProManager showToast={showToast} />
        )}
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
        <BookRecommendations
          onClose={() => setShowBooks(false)}
          onSelectBookForLogger={(bookTitle) => {
            const el = document.getElementById("study-session-logger-section");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
            showToast(`Selected "${bookTitle}" for 30m Reading Session! Check the logger below.`, "success");
          }}
        />
      )}

      {/* ANTI-BOREDOM & MENTAL MODELS VAULT MODAL */}
      {showMentalVault && (
        <MentalModelsModal onClose={() => setShowMentalVault(false)} />
      )}

      {/* WALL STICKY NOTES & HIGHLIGHTER STUDIO MODAL */}
      {showStickyNotesModal && (
        <StickyNotesStudioModal
          onClose={() => setShowStickyNotesModal(false)}
          showToast={showToast}
        />
      )}

      {/* ADAPTIVE STUDY PROGRESS & TOPIC SHIFT MODAL */}
      <AdaptiveTopicModal
        isOpen={showAdaptiveTopicModal}
        onClose={() => setShowAdaptiveTopicModal(false)}
        dateStr={todayStr}
        currentTopic={todayTopic}
        showToast={showToast}
      />

      {/* BEDTIME WHOLE DAY SUMMARY & TOMORROW'S PLAN MODAL */}
      <BedtimeSummaryModal
        isOpen={showBedtimeSummary}
        onClose={() => setShowBedtimeSummary(false)}
        dateStr={todayStr}
        dayData={monthData[todayStr] || {}}
        allDays={monthData}
        showToast={showToast}
      />

      {/* 15-MINUTE EMERGENCY DAY RESCUE MODAL */}
      <EmergencyRescueModal
        isOpen={showRescueModal}
        onClose={() => setShowRescueModal(false)}
        onSaveRescueSession={handleSaveRescueSession}
        showToast={showToast}
      />

      {/* 60-SEC RAPID-FIRE SELF-TEST DRILL MODAL */}
      <RapidDrillModal
        isOpen={showRapidDrill}
        onClose={() => setShowRapidDrill(false)}
      />

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
