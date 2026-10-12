import { useState, useEffect, useMemo } from "react";
import {
  COMPLETE_24H_MASTER_SCHEDULE,
  timeToMins,
  nowTimeStr,
  fmtDate,
} from "../scheduleData";
import { playCompletionChime } from "../soundEngine";

export default function TodayLiveHUD({
  todayStr,
  dayData,
  onToggleHabit,
  showToast,
  onOpenTaskDetail,
  onOpenDetox,
  isTomorrow = true,
  displayDateStr,
  onSwitchDate,
  onResetAllToZero,
  onOpenNaukri,
  todayTopic,
  onOpenStickyNotes,
  onOpenAdaptiveTopic,
}) {
  const [liveDate, setLiveDate] = useState(() => new Date());
  const [filterPhase, setFilterPhase] = useState("all"); // 'all' | 'morning' | 'afternoon' | 'evening' | 'sleep'
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedSpotlightIndex, setSelectedSpotlightIndex] = useState(null);

  // Update clock every second for live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentTimeMins = liveDate.getHours() * 60 + liveDate.getMinutes();
  const currentSecs = liveDate.getSeconds();

  // Time remaining until tomorrow 5:00 AM kickoff
  const { hoursUntilLaunch, minsUntilLaunch, secsUntilLaunch } = useMemo(() => {
    const launchDate = new Date();
    if (liveDate.getHours() >= 5) {
      launchDate.setDate(launchDate.getDate() + 1);
    }
    launchDate.setHours(5, 0, 0, 0);
    const diffMs = Math.max(0, launchDate.getTime() - liveDate.getTime());
    const totalSecs = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return {
      hoursUntilLaunch: String(hours).padStart(2, "0"),
      minsUntilLaunch: String(mins).padStart(2, "0"),
      secsUntilLaunch: String(secs).padStart(2, "0"),
    };
  }, [liveDate]);

  // Find currently active block
  const autoActiveIndex = useMemo(() => {
    if (isTomorrow) return 0; // Default to 5:00 AM Wakeup / 5:30 AM Outdoor Running when preparing for tomorrow
    return COMPLETE_24H_MASTER_SCHEDULE.findIndex((item) => {
      const start = timeToMins(item.timeStart);
      let end = timeToMins(item.timeEnd);
      if (end < start) {
        return currentTimeMins >= start || currentTimeMins < end;
      }
      return currentTimeMins >= start && currentTimeMins < end;
    });
  }, [currentTimeMins, isTomorrow]);

  const activeBlockIndex =
    selectedSpotlightIndex !== null ? selectedSpotlightIndex : (autoActiveIndex >= 0 ? autoActiveIndex : 0);

  const activeBlock = COMPLETE_24H_MASTER_SCHEDULE[activeBlockIndex] || COMPLETE_24H_MASTER_SCHEDULE[0];

  const upNextBlock =
    activeBlockIndex < COMPLETE_24H_MASTER_SCHEDULE.length - 1
      ? COMPLETE_24H_MASTER_SCHEDULE[activeBlockIndex + 1]
      : COMPLETE_24H_MASTER_SCHEDULE[0];

  // Time remaining in current block
  const { minsRemaining, progressPct } = useMemo(() => {
    if (isTomorrow && selectedSpotlightIndex === null) {
      return { minsRemaining: activeBlock.durMins, progressPct: 0 };
    }
    if (!activeBlock) return { minsRemaining: 0, progressPct: 0 };
    const start = timeToMins(activeBlock.timeStart);
    let end = timeToMins(activeBlock.timeEnd);
    let total = end - start;
    let elapsed = currentTimeMins - start;

    if (end < start) {
      total = 1440 - start + end;
      elapsed = currentTimeMins >= start ? currentTimeMins - start : 1440 - start + currentTimeMins;
    }

    if (total <= 0) return { minsRemaining: 0, progressPct: 100 };
    const remaining = Math.max(0, total - elapsed);
    const pct = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
    return { minsRemaining: remaining, progressPct: pct };
  }, [activeBlock, currentTimeMins, isTomorrow, selectedSpotlightIndex]);

  const habits = dayData?.habits || {};
  const isCurrentBlockDone = activeBlock?.key ? !!habits[activeBlock.key] : false;

  // Filter schedule rows
  const displayedSchedule = useMemo(() => {
    if (filterPhase === "all") return COMPLETE_24H_MASTER_SCHEDULE;
    return COMPLETE_24H_MASTER_SCHEDULE.filter((b) => b.phase === filterPhase);
  }, [filterPhase]);

  // Handle task complete toggle
  const handleToggleTask = (key, title) => {
    if (!key) return;
    onToggleHabit(todayStr, key);
    if (!habits[key]) {
      playCompletionChime();
      if (showToast) showToast(`✅ Completed: ${title}!`, "success");
    }
  };

  // Location badge helper
  const getLocationInfo = (item) => {
    if (item.id === "m24_outdoor_running" || item.key === "morningCardio") {
      return {
        label: "🌳 Outside Home (Running Route)",
        badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        icon: "fa-person-running",
      };
    }
    if (item.phase === "afternoon" || item.cat === "work") {
      return {
        label: "🏢 Office Workplace",
        badgeClass: "bg-stone-500/20 text-stone-300 border-stone-500/40",
        icon: "fa-building",
      };
    }
    if (item.cat === "mern" || item.cat === "genai") {
      return {
        label: "💻 Study Desk (Laptop / VS Code)",
        badgeClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
        icon: "fa-laptop-code",
      };
    }
    if (item.cat === "sleep" || item.key === "sleepGoal") {
      return {
        label: "🛏️ Bedroom (Pitch Dark • Zero Screens)",
        badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/40",
        icon: "fa-bed",
      };
    }
    return {
      label: "🏠 Home Environment",
      badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      icon: "fa-house",
    };
  };

  const activeLocation = getLocationInfo(activeBlock);

  // Time formatted string: HH:MM:SS AM/PM
  const timeFormatted = liveDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const tomorrowDateObj = new Date();
  tomorrowDateObj.setDate(tomorrowDateObj.getDate() + 1);
  const displayFormattedDate = isTomorrow
    ? `Tomorrow: ${tomorrowDateObj.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })} (Day 1 Fresh Start)`
    : liveDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  return (
    <div className="space-y-6">
      {/* ════════════════════════════════════════════════════════════════
          1. HERO COMMAND CENTER: WHAT TO DO RIGHT NOW (LIVE HUD)
      ════════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 p-5 sm:p-7 shadow-2xl">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-5">
          {/* Top Bar: Live Clock & Live Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
                  {isTomorrow ? "🚀 DAY 1 SPRINT LAUNCH • STARTING TOMORROW" : "LIVE NOW • HAPPENING RIGHT AT THIS MOMENT"}
                </span>
                <div className="text-xs font-semibold text-slate-300">
                  {displayFormattedDate}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isTomorrow ? (
                <div className="px-3 py-1 rounded-xl bg-emerald-950/70 border border-emerald-500/40 font-mono text-xs sm:text-sm font-black tracking-wider text-emerald-300 shadow-inner flex items-center gap-2">
                  <i className="fa-solid fa-hourglass-start text-xs text-emerald-400 animate-spin"></i>
                  <span>Kickoff: {hoursUntilLaunch}h {minsUntilLaunch}m {secsUntilLaunch}s</span>
                </div>
              ) : (
                <div className="px-3 py-1 rounded-xl bg-black/40 border border-white/10 font-mono text-sm sm:text-base font-black tracking-wider text-amber-300 shadow-inner flex items-center gap-2">
                  <i className="fa-regular fa-clock text-xs text-amber-400"></i>
                  <span>{timeFormatted}</span>
                </div>
              )}
              <div className="text-xs font-bold px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 text-indigo-200">
                {activeBlock.time}
              </div>
            </div>
          </div>

          {/* Core Spotlight: Active Task Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-8 space-y-3">
              {/* Location & Theme Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border flex items-center gap-1.5 ${activeLocation.badgeClass}`}
                >
                  <i className={`fa-solid ${activeLocation.icon} text-[10px]`}></i>
                  <span>{activeLocation.label}</span>
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeBlock.badge}
                </span>
                {isCurrentBlockDone && (
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-emerald-500 text-white shadow-xs flex items-center gap-1">
                    <i className="fa-solid fa-check"></i>
                    <span>TICKED COMPLETED</span>
                  </span>
                )}
                {isTomorrow && (
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-emerald-500/30 text-emerald-200 border border-emerald-500/40">
                    Day 1 Morning Kickoff
                  </span>
                )}
              </div>

              {/* Big Task Title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
                {activeBlock.title}
              </h1>

              {/* Activity description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                {activeBlock.activity}
              </p>

              {/* Action Steps quick guidance */}
              {activeBlock.actionSteps && activeBlock.actionSteps.length > 0 && (
                <div className="bg-black/30 border border-white/10 rounded-2xl p-3 sm:p-4 space-y-2">
                  <div className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <i className="fa-solid fa-list-check"></i>
                    <span>{isTomorrow ? "Tomorrow Morning Protocol:" : "Execute Right Now:"}</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-200">
                    {activeBlock.actionSteps.slice(0, 3).map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">›</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Card: Countdown, Progress & Quick Action */}
            <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-inner">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400">
                    {isTomorrow ? "Launch Countdown (Tomorrow 5:00 AM)" : "Time Left in Block"}
                  </span>
                  <span className="font-mono text-amber-300 font-black text-sm">
                    {isTomorrow
                      ? `${hoursUntilLaunch}h ${minsUntilLaunch}m ${secsUntilLaunch}s`
                      : `${minsRemaining} mins remaining`}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-indigo-500 rounded-full transition-all duration-1000"
                    style={{ width: isTomorrow ? "100%" : `${progressPct}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                  <span>{isTomorrow ? "Wake: 05:00 AM" : `Start: ${activeBlock.timeStart}`}</span>
                  <span>{isTomorrow ? "Fresh Start From Zero" : `${progressPct}% elapsed`}</span>
                  <span>{isTomorrow ? "Run: 05:30 AM Outside" : `End: ${activeBlock.timeEnd}`}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {activeBlock.trackable && (
                  <button
                    type="button"
                    onClick={() => handleToggleTask(activeBlock.key, activeBlock.title)}
                    className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                      isCurrentBlockDone
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white"
                    }`}
                  >
                    <i
                      className={`fa-solid ${
                        isCurrentBlockDone ? "fa-circle-check" : "fa-square-check"
                      } text-base`}
                    ></i>
                    <span>
                      {isCurrentBlockDone
                        ? "Completed ✓ (Click to Undo)"
                        : isTomorrow
                        ? "Mark Done for Tomorrow"
                        : "Mark Done for Today"}
                    </span>
                  </button>
                )}

                {/* Up Next Card Preview */}
                <div className="bg-black/30 border border-white/10 rounded-xl p-3 text-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <i className="fa-solid fa-forward text-indigo-400"></i>
                    <span>Up Next at {upNextBlock.timeStart}:</span>
                  </div>
                  <div className="font-bold text-white truncate">
                    {upNextBlock.title}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {upNextBlock.time} • {upNextBlock.durLabel || `${upNextBlock.durMins} mins`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          FRESH START ZERO BANNER & DAY SWITCHER
      ════════════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-3.5 sm:p-4 border border-indigo-500/30 flex items-center justify-between gap-3 flex-wrap shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black border border-emerald-500/30 flex-shrink-0">
            <i className="fa-solid fa-seedling"></i>
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black flex items-center gap-2 flex-wrap">
              <span>Day 1 Fresh Start: Everything Starting from Zero</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Start: 2026-10-12
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Habits, book reading, MERN & GenAI roadmaps clean at 0. Outdoor running starts at 5:30 AM outside home.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenNaukri && (
            <button
              type="button"
              onClick={onOpenNaukri}
              className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Open Naukri Pro Recruiter Engine & 10 AM Timing Protocol"
            >
              <i className="fa-solid fa-crown text-amber-400 text-[10px]"></i>
              <span>Naukri 10 AM Protocol</span>
            </button>
          )}

          {onSwitchDate && (
            <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => onSwitchDate(true)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  isTomorrow ? "bg-emerald-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
                }`}
              >
                🚀 Tomorrow (Day 1)
              </button>
              <button
                type="button"
                onClick={() => onSwitchDate(false)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  !isTomorrow ? "bg-indigo-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
                }`}
              >
                Today
              </button>
            </div>
          )}

          {onResetAllToZero && (
            <button
              type="button"
              onClick={onResetAllToZero}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Ensure all habits, books, and tracks are reset to zero"
            >
              <i className="fa-solid fa-rotate-left text-[10px]"></i>
              <span>Reset to Zero</span>
            </button>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          2. DAILY VITALS & KEY HABIT STRIP (7 PILLARS STARTING AT ZERO)
      ════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Morning Run */}
        <div
          onClick={() => handleToggleTask("morningCardio", "5:30 AM Outdoor Running")}
          className={`p-3 rounded-2xl border transition-all cursor-pointer select-none ${
            habits.morningCardio
              ? "bg-emerald-50 border-emerald-300 text-emerald-950"
              : "bg-white border-cream-deep hover:border-emerald-300 text-bark"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-lg">🏃‍♂️</span>
            <i
              className={`fa-solid ${
                habits.morningCardio
                  ? "fa-circle-check text-emerald-600"
                  : "fa-circle text-stone-300"
              }`}
            ></i>
          </div>
          <div className="text-xs font-black truncate">Outdoor Run</div>
          <div className="text-[10px] text-bark-muted">5:30 – 6:30 AM (60m)</div>
        </div>

        {/* Striver DSA */}
        <div
          onClick={() => handleToggleTask("morningStudy1", "Striver DSA Logic")}
          className={`p-3 rounded-2xl border transition-all cursor-pointer select-none ${
            habits.morningStudy1 || habits.mernMorning
              ? "bg-indigo-50 border-indigo-300 text-indigo-950"
              : "bg-white border-cream-deep hover:border-indigo-300 text-bark"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-lg">🧠</span>
            <i
              className={`fa-solid ${
                habits.morningStudy1 || habits.mernMorning
                  ? "fa-circle-check text-indigo-600"
                  : "fa-circle text-stone-300"
              }`}
            ></i>
          </div>
          <div className="text-xs font-black truncate">Striver DSA</div>
          <div className="text-[10px] text-bark-muted">7:15 – 8:00 AM (45m)</div>
        </div>

        {/* MERN Stack */}
        <div
          onClick={() => handleToggleTask("mernEvening", "MERN Full-Stack Coding")}
          className={`p-3 rounded-2xl border transition-all cursor-pointer select-none ${
            habits.mernEvening || habits.mern
              ? "bg-indigo-50 border-indigo-300 text-indigo-950"
              : "bg-white border-cream-deep hover:border-indigo-300 text-bark"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-lg">⚛️</span>
            <i
              className={`fa-solid ${
                habits.mernEvening || habits.mern
                  ? "fa-circle-check text-indigo-600"
                  : "fa-circle text-stone-300"
              }`}
            ></i>
          </div>
          <div className="text-xs font-black truncate">MERN Stack</div>
          <div className="text-[10px] text-bark-muted">8:00 – 9:15 PM (75m)</div>
        </div>

        {/* GenAI Agents */}
        <div
          onClick={() => handleToggleTask("genaiSession", "GenAI & AI Agents")}
          className={`p-3 rounded-2xl border transition-all cursor-pointer select-none ${
            habits.genaiSession || habits.genai
              ? "bg-purple-50 border-purple-300 text-purple-950"
              : "bg-white border-cream-deep hover:border-purple-300 text-bark"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-lg">💻</span>
            <i
              className={`fa-solid ${
                habits.genaiSession || habits.genai
                  ? "fa-circle-check text-purple-600"
                  : "fa-circle text-stone-300"
              }`}
            ></i>
          </div>
          <div className="text-xs font-black truncate">MERN & Video</div>
          <div className="text-[10px] text-bark-muted">9:15 – 10:15 PM (60m)</div>
        </div>

        {/* Book Reading */}
        <div
          onClick={() => handleToggleTask("reading", "Book Reading (15-20 pages)")}
          className={`p-3 rounded-2xl border transition-all cursor-pointer select-none ${
            habits.reading || habits.bookReading
              ? "bg-purple-50 border-purple-300 text-purple-950"
              : "bg-white border-cream-deep hover:border-purple-300 text-bark"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-lg">📖</span>
            <i
              className={`fa-solid ${
                habits.reading || habits.bookReading
                  ? "fa-circle-check text-purple-600"
                  : "fa-circle text-stone-300"
              }`}
            ></i>
          </div>
          <div className="text-xs font-black truncate">Book Reading</div>
          <div className="text-[10px] text-bark-muted">10:15 PM (15-20p)</div>
        </div>

        {/* Screen Detox */}
        <div
          onClick={() => handleToggleTask("screenTimeDetox", "Digital Sunset (< 30m)")}
          className={`p-3 rounded-2xl border transition-all cursor-pointer select-none ${
            habits.screenTimeDetox
              ? "bg-emerald-50 border-emerald-300 text-emerald-950"
              : "bg-white border-cream-deep hover:border-emerald-300 text-bark"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-lg">📵</span>
            <i
              className={`fa-solid ${
                habits.screenTimeDetox
                  ? "fa-circle-check text-emerald-600"
                  : "fa-circle text-stone-300"
              }`}
            ></i>
          </div>
          <div className="text-xs font-black truncate">Screen &lt; 30m</div>
          <div className="text-[10px] text-bark-muted">Phone in Drawer</div>
        </div>

        {/* 6.0h Sleep */}
        <div
          onClick={() => handleToggleTask("sleepGoal", "6.0h Sleep Target")}
          className={`p-3 rounded-2xl border transition-all cursor-pointer select-none ${
            habits.sleepGoal
              ? "bg-purple-50 border-purple-300 text-purple-950"
              : "bg-white border-cream-deep hover:border-purple-300 text-bark"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-lg">🛏️</span>
            <i
              className={`fa-solid ${
                habits.sleepGoal
                  ? "fa-circle-check text-purple-600"
                  : "fa-circle text-stone-300"
              }`}
            ></i>
          </div>
          <div className="text-xs font-black truncate">6.0h Sleep</div>
          <div className="text-[10px] text-bark-muted">11:00 PM – 5:00 AM</div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          2.5 TODAY'S SCHEDULED MASTER CURRICULUM (ZERO TO ADVANCE: DSA & MERN)
      ════════════════════════════════════════════════════════════════ */}
      {todayTopic && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-indigo-500/30 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-amber-300 flex items-center justify-center text-sm font-black">
                🎯
              </span>
              <div>
                <div className="text-xs sm:text-sm font-black flex items-center gap-2">
                  <span>Today's Zero-to-Advance Topics: {todayTopic.dayName || `Day ${todayTopic.dayNum}`}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {todayTopic.badge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Direct roadmap targets for today's morning, office, and evening study sessions.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-amber-300 font-mono">
                Sprint Day #{todayTopic.dayNum || 1}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* DSA TOPIC BOX */}
            <div className="bg-black/30 border border-indigo-500/30 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                  <span className="text-[11px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                    <i className="fa-solid fa-brain text-amber-400"></i>
                    <span>DSA Focus (7:15 AM & 2:30 PM Office)</span>
                  </span>
                  {todayTopic.striverFolder ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      📁 Striver: {todayTopic.striverFolder}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                      {todayTopic.dsaLevel || "Step by Step"}
                    </span>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  {todayTopic.dsa}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {todayTopic.dsaDesc}
                </p>
              </div>

              {/* 1 CORE PROBLEM TARGET (Zero Pressure Rule) */}
              <div className="pt-2.5 border-t border-white/10 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-black border border-amber-500/40 text-[10px]">
                    ⭐ MUST SOLVE (Just 1 Problem):
                  </span>
                  <span className="text-white font-bold">
                    {todayTopic.coreProblem || (todayTopic.dsaProblems && todayTopic.dsaProblems[0])}
                  </span>
                </div>

                {todayTopic.optionalProblem && (
                  <div className="flex items-center gap-1.5 text-slate-300 text-[10px]">
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 font-semibold">
                      💡 Optional Stretch:
                    </span>
                    <span className="text-slate-300">{todayTopic.optionalProblem}</span>
                  </div>
                )}

                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1.5 pt-0.5">
                  <i className="fa-solid fa-circle-check text-[10px] text-emerald-400"></i>
                  <span>Rule: Dry-run just this 1 problem on paper = 100% daily success!</span>
                </div>

                {todayTopic.isCustomLogged && (
                  <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-[10px] space-y-1">
                    <div className="font-extrabold text-emerald-300 flex items-center gap-1.5">
                      <i className="fa-solid fa-circle-check text-emerald-400"></i>
                      <span>Custom Progress Logged for Today</span>
                    </div>
                    {todayTopic.pushedScheduledToTomorrow && (
                      <div className="text-amber-300 font-bold">
                        ⏩ Scheduled topic shifted to tomorrow (+1 Day active)
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
                  {onOpenAdaptiveTopic && (
                    <button
                      type="button"
                      onClick={onOpenAdaptiveTopic}
                      className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      title="Log what you actually watched today or push topic to tomorrow"
                    >
                      <i className="fa-solid fa-pen-to-square text-amber-300"></i>
                      <span>{todayTopic.isCustomLogged ? "Edit Today's Study Log" : "📝 Log What I Watched / Push Topic (+1 Day)"}</span>
                    </button>
                  )}

                  {onOpenStickyNotes && (
                    <button
                      type="button"
                      onClick={onOpenStickyNotes}
                      className="text-[10px] font-bold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                      title="View Wall Sticky Notes & Highlighters Guide"
                    >
                      <span>📌 Wall Sticky Notes</span>
                      <i className="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* MERN TOPIC BOX */}
            <div className="bg-black/30 border border-teal-500/30 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                    <i className="fa-solid fa-code text-teal-400"></i>
                    <span>MERN Focus (8:00 PM & 9:15 PM)</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-200 border border-teal-400/30">
                    {todayTopic.mernLevel || "Zero to Advance"}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  {todayTopic.mern}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {todayTopic.mernDesc}
                </p>
              </div>

              {todayTopic.interviewTips && todayTopic.interviewTips.length > 0 && (
                <div className="pt-2 border-t border-white/10 text-[11px]">
                  <span className="text-emerald-400 font-bold">Interview Defense: </span>
                  <span className="text-slate-200">{todayTopic.interviewTips[0]}</span>
                </div>
              )}
            </div>
          </div>

          {/* GenAI Video Note */}
          <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs text-purple-200">
            <i className="fa-solid fa-video text-amber-400 text-xs flex-shrink-0"></i>
            <span>
              <strong>GenAI Mode:</strong> {todayTopic.genaiNote || "Video learning slot active — watch tech/AI architectural videos without syllabus or test pressure."}
            </span>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          3. COMPLETE 24-HOUR INTERACTIVE VISUAL SCHEDULE (CENTRAL TIMELINE)
      ════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-cream-deep p-4 sm:p-6 shadow-sm space-y-5">
        {/* Header & Phase Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-deep pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                📅
              </span>
              <h2 className="font-display font-black text-base sm:text-lg text-bark">
                Your Complete Day Schedule (24-Hour Master Routine)
              </h2>
            </div>
            <p className="text-xs text-bark-muted mt-0.5">
              Starts with <strong>5:30 AM – 6:30 AM Outdoor Running Outside Home</strong>, followed by 70m Striver DSA, Office, MERN & GenAI.
            </p>
          </div>

          {/* Phase Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setFilterPhase("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterPhase === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-cream/60 text-bark-muted hover:text-bark hover:bg-cream"
              }`}
            >
              All 24 Hours
            </button>
            <button
              type="button"
              onClick={() => setFilterPhase("morning")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterPhase === "morning"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-cream/60 text-bark-muted hover:text-bark hover:bg-cream"
              }`}
            >
              🌅 Morning (Running & DSA)
            </button>
            <button
              type="button"
              onClick={() => setFilterPhase("afternoon")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterPhase === "afternoon"
                  ? "bg-stone-700 text-white shadow-xs"
                  : "bg-cream/60 text-bark-muted hover:text-bark hover:bg-cream"
              }`}
            >
              💼 Office Work
            </button>
            <button
              type="button"
              onClick={() => setFilterPhase("evening")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterPhase === "evening"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-cream/60 text-bark-muted hover:text-bark hover:bg-cream"
              }`}
            >
              🌙 Evening (MERN & GenAI)
            </button>
            <button
              type="button"
              onClick={() => setFilterPhase("sleep")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterPhase === "sleep"
                  ? "bg-purple-700 text-white shadow-xs"
                  : "bg-cream/60 text-bark-muted hover:text-bark hover:bg-cream"
              }`}
            >
              🛏️ Sleep (6.0h)
            </button>
          </div>
        </div>

        {/* Chronological List of Cards */}
        <div className="space-y-3">
          {displayedSchedule.map((item, index) => {
            const isLive = activeBlock?.id === item.id;
            const isDone = item.key ? !!habits[item.key] : false;
            const isExpanded = expandedRow === item.id;
            const loc = getLocationInfo(item);

            // Determine item color theme
            const isRunning = item.id === "m24_outdoor_running" || item.key === "morningCardio";
            const isTech = item.cat === "mern" || item.cat === "genai";
            const isDetox = item.cat === "detox" || item.key === "screenTimeDetox";

            return (
              <div
                key={item.id || index}
                className={`rounded-2xl border transition-all duration-300 ${
                  isLive
                    ? "bg-indigo-950/5 border-indigo-600 ring-2 ring-indigo-500/50 shadow-md"
                    : isDone
                    ? "bg-emerald-50/40 border-emerald-200"
                    : isRunning
                    ? "bg-emerald-50/20 border-emerald-300/60"
                    : "bg-white border-cream-deep hover:border-slate-300"
                }`}
              >
                <div className="p-3.5 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Time pill + Details */}
                  <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                    {/* Time Pill */}
                    <div className="flex flex-col items-center justify-center min-w-[90px] sm:min-w-[105px] p-2 rounded-xl bg-slate-900 text-white font-mono shadow-xs flex-shrink-0">
                      <span className="text-xs font-black tracking-wide">
                        {item.timeStart}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        to {item.timeEnd}
                      </span>
                      <span className="text-[9px] font-bold text-amber-300 mt-0.5">
                        {item.durLabel || `${item.durMins}m`}
                      </span>
                    </div>

                    {/* Task Title & Badges */}
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Live Now Tag */}
                        {isLive && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500 text-white animate-pulse shadow-xs flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                            ACTIVE RIGHT NOW
                          </span>
                        )}

                        {/* Location Tag */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                            isRunning
                              ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          <i className={`fa-solid ${loc.icon} text-[9px]`}></i>
                          <span>{loc.label}</span>
                        </span>

                        {/* Category badge */}
                        <span className="text-[10px] font-bold text-bark-muted px-2 py-0.5 rounded-md bg-cream/60 border border-cream-deep">
                          {item.badge}
                        </span>
                      </div>

                      <div className="font-display font-black text-sm sm:text-base text-bark flex items-center gap-1.5">
                        <span>{item.title}</span>
                      </div>

                      <p className="text-xs text-bark-muted line-clamp-1 sm:line-clamp-2">
                        {item.activity}
                      </p>

                      {/* Dynamic Topic Badges if Study Block */}
                      {todayTopic && (item.id === "m24_study_session_1_dsa" || item.key === "morningStudy1") && (
                        <div className="mt-2 p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs">
                          <div className="font-bold text-indigo-950 flex items-center gap-1.5 flex-wrap">
                            <span className="text-amber-600 font-black">🎯 Scheduled DSA:</span>
                            <span>{todayTopic.dsa}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-200/80 text-indigo-800 font-bold">{todayTopic.dsaLevel || "Step by Step"}</span>
                          </div>
                          <div className="text-[11px] text-indigo-900 mt-1 flex items-center gap-1.5 flex-wrap">
                            <span className="font-black text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded text-[10px] border border-amber-200">
                              ⭐ Core Problem (Just 1):
                            </span>
                            <span className="font-bold text-slate-800">
                              {todayTopic.coreProblem || (todayTopic.dsaProblems && todayTopic.dsaProblems[0])}
                            </span>
                            {todayTopic.optionalProblem && (
                              <span className="text-slate-500 text-[10px]">
                                (Optional: {todayTopic.optionalProblem})
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                            ✓ Dry-run on notepad in 45m window — no need to rush multiple problems!
                          </div>
                        </div>
                      )}

                      {todayTopic && item.id === "m24_office_block_2" && (
                        <div className="mt-2 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs">
                          <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                            <span className="text-emerald-700 font-black">🧠 Office Free Windows:</span>
                            <span>2:30 PM DSA Dry-Run + 4:30 PM MERN Architecture</span>
                          </div>
                          <div className="text-[11px] text-emerald-800 mt-1">
                            Dry-run today's pattern: <em>{todayTopic.dsa}</em> on physical notepad.
                          </div>
                        </div>
                      )}

                      {todayTopic && (item.id === "m24_study_session_2_mern" || item.key === "mernEvening") && (
                        <div className="mt-2 p-2.5 rounded-xl bg-teal-50/80 border border-teal-200 text-xs">
                          <div className="font-bold text-teal-950 flex items-center gap-1.5 flex-wrap">
                            <span className="text-teal-700 font-black">🎯 Scheduled MERN:</span>
                            <span>{todayTopic.mern}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-200/80 text-teal-800 font-bold">{todayTopic.mernLevel || "MERN"}</span>
                          </div>
                          <div className="text-[11px] text-teal-800 mt-1">
                            {todayTopic.mernDesc}
                          </div>
                        </div>
                      )}

                      {todayTopic && (item.id === "m24_study_session_3_genai" || item.key === "genaiSession") && (
                        <div className="mt-2 p-2.5 rounded-xl bg-purple-50/80 border border-purple-200 text-xs">
                          <div className="font-bold text-purple-950 flex items-center gap-1.5 flex-wrap">
                            <span className="text-purple-700 font-black">💻 MERN Build & Video Mode:</span>
                            <span>Hands-on Code + GenAI Video Watching</span>
                          </div>
                          <div className="text-[11px] text-purple-800 mt-1">
                            📹 Zero testing stress: Build {todayTopic.mern} endpoints + relax with GenAI/Tech videos.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Completion Checkbox & Expand Button */}
                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                    {item.trackable && (
                      <button
                        type="button"
                        onClick={() => handleToggleTask(item.key, item.title)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                          isDone
                            ? "bg-emerald-600 text-white"
                            : "bg-white border border-cream-deep hover:bg-emerald-50 hover:border-emerald-300 text-bark-muted"
                        }`}
                        title="Click to mark completed for today"
                      >
                        <i
                          className={`fa-solid ${
                            isDone ? "fa-circle-check" : "fa-square"
                          } text-sm`}
                        ></i>
                        <span className="hidden sm:inline">
                          {isDone ? "Completed" : "Mark Done"}
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setExpandedRow(isExpanded ? null : item.id)}
                      className="p-2 rounded-xl border border-cream-deep hover:bg-cream/60 text-bark-muted hover:text-bark transition-colors cursor-pointer text-xs"
                      title={isExpanded ? "Collapse instructions" : "View steps & nutrition tips"}
                    >
                      <i
                        className={`fa-solid ${
                          isExpanded ? "fa-chevron-up" : "fa-chevron-down"
                        }`}
                      ></i>
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="border-t border-cream-deep p-4 bg-cream/20 space-y-3 text-xs animate-fadeIn">
                    {item.focus && (
                      <div className="flex items-start gap-2 text-bark">
                        <i className="fa-solid fa-bullseye text-indigo-600 mt-0.5"></i>
                        <div>
                          <strong>Key Focus:</strong> {item.focus}
                        </div>
                      </div>
                    )}

                    {item.drink && (
                      <div className="flex items-start gap-2 text-bark">
                        <i className="fa-solid fa-glass-water text-teal-600 mt-0.5"></i>
                        <div>
                          <strong>Hydration / Nutrition:</strong> {item.drink}
                          {item.drinkDetails && (
                            <span className="block text-[11px] text-bark-muted mt-0.5">
                              {item.drinkDetails}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {item.actionSteps && item.actionSteps.length > 0 && (
                      <div className="bg-white p-3 rounded-xl border border-cream-deep space-y-1.5">
                        <div className="font-bold text-bark flex items-center gap-1.5">
                          <i className="fa-solid fa-list-check text-emerald-600"></i>
                          <span>Actionable Execution Steps:</span>
                        </div>
                        <ul className="space-y-1 pl-4 list-disc text-bark-muted text-[11px]">
                          {item.actionSteps.map((step, sIdx) => (
                            <li key={sIdx}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
