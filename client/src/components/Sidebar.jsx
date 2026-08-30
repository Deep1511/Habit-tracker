import { useState } from "react";
import {
  getHabitSummary,
  fmtDate,
  daysUntilTarget,
  getTopicForDay,
  getBrainFreshupForDay,
  MERN_PHASES,
} from "../scheduleData";

export default function Sidebar({
  startDate = "2026-08-24",
  targetDate,
  mernTotal = 0,
  streaks = {},
  monthData = {},
  onOpenBooks,
  onReset,
}) {
  const [showNeuroInfo, setShowNeuroInfo] = useState(false);
  const daysLeft = daysUntilTarget(targetDate);
  const totalHrs = (mernTotal / 60).toFixed(1);
  const targetHrs = 100;
  const pct = Math.min(100, (mernTotal / (targetHrs * 60)) * 100);

  const currentPhaseIdx =
    mernTotal / 60 < 25
      ? 0
      : mernTotal / 60 < 50
        ? 1
        : mernTotal / 60 < 75
          ? 2
          : 3;

  // This week stats (only counting from launch date)
  const today = new Date();
  const dayOfWeek = today.getDay();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOfWeek);
  const ws = { gov: 0, mern: 0, exercise: 0, pooja: 0, reading: 0, sleep: 0, total: 0 };
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const ds = fmtDate(d);
    if (ds < startDate) continue;
    if (ds > fmtDate(today)) continue;
    const s = getHabitSummary(ds, targetDate, monthData[ds], startDate);
    if (s.gov) ws.gov++;
    if (s.mern) ws.mern++;
    if (s.exercise) ws.exercise++;
    if (s.pooja) ws.pooja++;
    if (s.reading) ws.reading++;
    if (s.sleep) ws.sleep++;
    ws.total++;
  }

  // 7-Day Performance & Balance Data
  const last7DaysData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = fmtDate(d);
    const dayObj = monthData[ds] || {};
    const logs = dayObj.studyLogs || [];

    let mernM = logs.filter((l) => l.track === "mern").reduce((acc, l) => acc + (Number(l.minutes) || 0), 0);
    let govM = logs.filter((l) => l.track === "gov").reduce((acc, l) => acc + (Number(l.minutes) || 0), 0);
    let lifeM = logs.filter((l) => l.track === "life").reduce((acc, l) => acc + (Number(l.minutes) || 0), 0);

    if (mernM === 0 && dayObj.mernMinutes) {
      mernM = dayObj.mernMinutes;
    }

    const totalM = mernM + govM + lifeM;
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "narrow" });
    const isToday = i === 0;

    last7DaysData.push({
      dateStr: ds,
      dayLabel,
      mernM,
      govM,
      lifeM,
      totalM,
      totalHrs: (totalM / 60).toFixed(1),
      isToday,
    });
  }

  const maxDailyMins = Math.max(120, ...last7DaysData.map((d) => d.totalM));

  const consistencyDays = last7DaysData.filter((d) => d.totalM > 0).length;
  const mernWeekMins = last7DaysData.reduce((acc, d) => acc + d.mernM, 0);
  const govWeekMins = last7DaysData.reduce((acc, d) => acc + d.govM, 0);
  const lifeWeekMins = last7DaysData.reduce((acc, d) => acc + d.lifeM, 0);
  const totalWeekMins = mernWeekMins + govWeekMins + lifeWeekMins;

  const consistencyScore = Math.min(100, Math.round((consistencyDays / 7) * 100));
  const ratio =
    mernWeekMins > 0 && govWeekMins > 0
      ? Math.min(mernWeekMins, govWeekMins) / Math.max(mernWeekMins, govWeekMins)
      : 0.3;
  const balanceScore = totalWeekMins > 0 ? Math.round(50 + ratio * 50) : 0;
  const momentumScore = Math.min(
    100,
    Math.round(consistencyScore * 0.6 + balanceScore * 0.4)
  );

  let coachingTip = "⚡ Solid balance! Aim for 120+ mins daily to keep momentum in the 90s.";
  if (totalWeekMins === 0) {
    coachingTip = "🌱 Start with a 15-Min Rescue Sprint today to ignite your weekly momentum engine.";
  } else if (mernWeekMins === 0 && govWeekMins > 0) {
    coachingTip = "⚠️ MERN Gap: Add 60 mins tomorrow 9:30 AM on Striver DSA to maintain technical sharpness.";
  } else if (govWeekMins === 0 && mernWeekMins > 0) {
    coachingTip = "⚠️ Govt Gap: Add 45 mins speed-math & reasoning tomorrow morning to keep exam speed high.";
  } else if (momentumScore >= 85) {
    coachingTip = "🔥 Elite Momentum: Dual-track velocity is dialed in. Keep executing morning Striver + Govt mock.";
  }

  const todayStr = fmtDate(today);
  const todayTopic = getTopicForDay(todayStr);
  const todayBrain = getBrainFreshupForDay(todayStr);

  const streakData = [
    {
      label: "All Habits Done",
      streak: streaks.all || 0,
      color: "terra",
      icon: "fa-fire",
    },
    {
      label: "MERN Interview Prep",
      streak: streaks.mern || 0,
      color: "indigo",
      icon: "fa-laptop-code",
    },
    {
      label: "Gov Exam Study",
      streak: streaks.gov || 0,
      color: "terra",
      icon: "fa-book-bookmark",
    },
    {
      label: "Book Reading",
      streak: streaks.reading || 0,
      color: "purple",
      icon: "fa-book-open",
    },
    {
      label: "Morning Exercise",
      streak: streaks.exercise || 0,
      color: "orange",
      icon: "fa-dumbbell",
    },
    {
      label: "Pooja & Mindfulness",
      streak: streaks.pooja || 0,
      color: "amber",
      icon: "fa-om",
    },
    {
      label: "Sleep Goal (5.5h)",
      streak: streaks.sleep || 0,
      color: "mint",
      icon: "fa-bed",
    },
  ];

  const colorMap = {
    terra: "text-terra",
    indigo: "text-indigo-600",
    purple: "text-purple-700",
    teal: "text-teal",
    gold: "text-gold",
    amber: "text-amber-600",
    orange: "text-orange-600",
    mint: "text-mint",
  };
  const bgMap = {
    terra: "bg-terra-pale",
    indigo: "bg-indigo-50",
    purple: "bg-purple-50",
    teal: "bg-teal-pale",
    gold: "bg-gold-pale",
    amber: "bg-amber-50",
    orange: "bg-orange-50",
    mint: "bg-mint-pale",
  };
  const barMap = {
    terra: "bg-terra",
    indigo: "bg-indigo-600",
    purple: "bg-purple-600",
    teal: "bg-teal",
    amber: "bg-amber-600",
    mint: "bg-mint",
  };

  const weekBars = [
    { label: "MERN Interview Prep", count: ws.mern, color: "indigo" },
    { label: "Gov Exam Study", count: ws.gov, color: "terra" },
    { label: "Book Reading", count: ws.reading, color: "purple" },
    { label: "Pooja & Exercise", count: Math.max(ws.pooja, ws.exercise), color: "amber" },
    { label: "Sleep Target (5.5h)", count: ws.sleep, color: "mint" },
  ];

  return (
    <aside className="space-y-5">
      {/* Weekly Momentum & AI Coaching Score */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white rounded-2xl p-4 sm:p-5 shadow-md border border-indigo-800/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black shadow-xs">
              <i className="fa-solid fa-gauge-high"></i>
            </span>
            <div>
              <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-teal-300">
                Weekly Momentum Score
              </h3>
              <div className="text-[10px] text-indigo-200">
                Consistency + Dual-Track Balance
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="font-display font-black text-2xl text-amber-300">
              {momentumScore}
            </span>
            <span className="text-xs text-indigo-300 font-bold">/100</span>
          </div>
        </div>

        {/* Momentum Progress Bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-teal-400 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${momentumScore}%` }}
          ></div>
        </div>

        {/* AI Coaching Tip */}
        <div className="bg-white/10 p-2.5 rounded-xl border border-white/15 text-[11px] leading-relaxed text-indigo-100 flex items-start gap-2">
          <i className="fa-solid fa-lightbulb text-amber-400 text-xs mt-0.5 flex-shrink-0"></i>
          <span>{coachingTip}</span>
        </div>
      </div>

      {/* Today's Topic Card */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-indigo-50/40 rounded-2xl border border-indigo-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-full">
            <i className="fa-solid fa-compass mr-1"></i> Today's Focus ({todayTopic.dayName})
          </span>
          <span className="text-[10px] font-bold text-bark-muted">
            {todayTopic.badge}
          </span>
        </div>

        <div className="space-y-2 mt-3">
          <div className="bg-white/80 border border-indigo-100 rounded-xl p-2.5">
            <div className="text-[10px] font-bold text-indigo-700 uppercase flex items-center gap-1.5">
              <i className="fa-solid fa-code text-indigo-600"></i> DSA Target
            </div>
            <div className="text-xs font-bold text-bark mt-0.5">
              {todayTopic.dsa}
            </div>
            <div className="text-[10px] text-bark-muted mt-0.5 leading-tight">
              {todayTopic.dsaDesc}
            </div>
          </div>

          <div className="bg-white/80 border border-teal-100 rounded-xl p-2.5">
            <div className="text-[10px] font-bold text-teal-700 uppercase flex items-center gap-1.5">
              <i className="fa-solid fa-server text-teal-600"></i> MERN Target
            </div>
            <div className="text-xs font-bold text-bark mt-0.5">
              {todayTopic.mern}
            </div>
            <div className="text-[10px] text-bark-muted mt-0.5 leading-tight">
              {todayTopic.mernDesc}
            </div>
          </div>
        </div>

        {todayTopic.interviewTips && todayTopic.interviewTips.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-indigo-100/60">
            <div className="text-[10px] font-bold text-indigo-900 mb-1 flex items-center gap-1">
              <i className="fa-solid fa-lightbulb text-amber-500"></i> Professor's Interview Tip:
            </div>
            <p className="text-[10px] text-bark-muted italic leading-snug">
              "{todayTopic.interviewTips[0]}"
            </p>
          </div>
        )}
      </div>

      {/* Today's 15-Min Brain Fresh-Up Card */}
      <div className="bg-gradient-to-br from-cyan-50 via-white to-cyan-50/40 rounded-2xl border border-cyan-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-800 bg-cyan-100/90 px-2.5 py-0.5 rounded-full">
            <i className="fa-solid fa-brain mr-1"></i> 15-Min Brain Wake-Up
          </span>
          <button
            onClick={() => setShowNeuroInfo(!showNeuroInfo)}
            className="text-[10px] font-bold text-cyan-700 hover:text-cyan-900 flex items-center gap-1 transition-colors"
            title="What is Neuro Activation?"
          >
            <i className="fa-solid fa-circle-question"></i>
            <span>{showNeuroInfo ? "Hide Info" : "What is this?"}</span>
          </button>
        </div>

        {/* Collapsible Neuro Activation Explanation */}
        {showNeuroInfo && (
          <div className="bg-white/90 border border-cyan-200 rounded-xl p-3 mb-3 text-bark text-[11px] leading-relaxed shadow-xs space-y-1.5 animate-fadeIn">
            <div className="font-bold text-cyan-900 flex items-center gap-1 text-xs">
              <i className="fa-solid fa-bolt-lightning text-cyan-600"></i> What is Neuro Activation?
            </div>
            <p className="text-bark-muted">
              <strong>Neuro Activation</strong> is the scientific practice of intentionally stimulating dormant neural pathways, increasing cerebral blood flow, and clearing morning sleep fog (<em>adenosine</em>) through 15-minute high-leverage cognitive and physical drills.
            </p>
            <div className="grid grid-cols-1 gap-1 text-[10px] text-bark bg-cyan-50/50 p-2 rounded-lg">
              <div>⚡ <strong>Adenosine Flush:</strong> Morning light & breathwork eliminate morning drowsiness.</div>
              <div>🧠 <strong>Hemispheric Priming:</strong> Logic & memory drills fire left/right brain communication.</div>
              <div>🎯 <strong>High-Performance State:</strong> Prepares the prefrontal cortex for complex DSA algorithms and exam problem solving.</div>
            </div>
          </div>
        )}

        <h4 className="font-bold text-xs text-bark mt-2 flex items-center gap-1.5">
          <i className={`fa-solid ${todayBrain.icon} text-cyan-600`}></i>
          {todayBrain.title}
        </h4>

        <p className="text-[11px] text-bark-muted mt-1 leading-relaxed">
          {todayBrain.instruction}
        </p>

        <div className="bg-cyan-50/70 border border-cyan-100 rounded-xl p-2.5 mt-2.5">
          <div className="text-[9px] font-bold text-cyan-900 uppercase">
            <i className="fa-solid fa-microchip text-cyan-600 mr-1"></i> Neuro Benefit:
          </div>
          <p className="text-[10px] text-bark-muted leading-tight mt-0.5">
            {todayBrain.neuroBenefit}
          </p>
        </div>

        {todayBrain.quickActionUrl && (
          <div className="mt-3">
            <a
              href={todayBrain.quickActionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-1.5 px-3 bg-cyan-600 hover:bg-cyan-700 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
              {todayBrain.quickActionLabel}
            </a>
          </div>
        )}
      </div>

      {/* Book Recommendations Launcher */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 text-white shadow-sm flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold flex items-center gap-1.5">
            <i className="fa-solid fa-book-open"></i> Need Book Ideas?
          </div>
          <div className="text-[10px] text-purple-100 mt-0.5">
            Atomic Habits, Deep Work, Stoicism & Amazon links
          </div>
        </div>
        <button
          onClick={onOpenBooks}
          className="px-3 py-2 bg-white text-purple-700 hover:bg-purple-50 text-xs font-bold rounded-xl flex-shrink-0 transition-colors shadow-xs"
        >
          View Books
        </button>
      </div>

      {/* MERN Prep Progress */}
      <div className="bg-white rounded-2xl border border-cream-deep p-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display font-bold text-sm">
            MERN Interview Mastery
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            Sprint Target: 100h
          </span>
        </div>
        <p className="text-[11px] text-bark-muted mb-4">
          Full-Stack & DSA preparation roadmap
        </p>

        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-bold text-bark">{totalHrs} hrs logged</span>
            <span className="text-indigo-600 font-bold">{Math.round(pct)}%</span>
          </div>
          <div className="w-full h-3 bg-cream-dark rounded-full overflow-hidden">
            <div
              className="phase-bar bg-gradient-to-r from-indigo-600 via-teal-600 to-emerald-600"
              style={{ width: `${pct}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-2.5">
          {MERN_PHASES.map((p, i) => {
            const isComplete = mernTotal / 60 >= p.targetHrs;
            const isActive = i === currentPhaseIdx;
            const prevTarget = i > 0 ? MERN_PHASES[i - 1].targetHrs : 0;
            const phasePct = Math.min(
              100,
              Math.max(
                0,
                ((mernTotal / 60 - prevTarget) / (p.targetHrs - prevTarget)) * 100,
              ),
            );
            return (
              <div
                key={i}
                className={`flex items-start gap-3 ${isActive ? "opacity-100" : "opacity-60"}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg ${isComplete ? "bg-emerald-600 text-white" : isActive ? "bg-indigo-600 text-white" : "bg-cream-dark text-bark-light"} flex items-center justify-center flex-shrink-0 text-xs shadow-sm`}
                >
                  <i
                    className={`fa-solid ${isComplete ? "fa-check" : p.icon}`}
                  ></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">{p.name}</span>
                  </div>
                  <div className="text-[10px] text-bark-muted">{p.desc}</div>
                  {isActive && (
                    <div className="w-full h-1.5 bg-cream-dark rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all"
                        style={{ width: `${Math.min(100, phasePct)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-cream-deep text-[11px] text-bark-muted">
          <i className="fa-solid fa-circle-info mr-1"></i>Log study & coding minutes in each day's detail modal
        </div>
      </div>

      {/* Streaks */}
      <div className="bg-white rounded-2xl border border-cream-deep p-5 shadow-sm">
        <h3 className="font-display font-bold text-sm mb-3">Streaks</h3>
        <div className="space-y-2.5">
          {streakData.map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg ${bgMap[s.color]} flex items-center justify-center shadow-xs`}
                >
                  <i
                    className={`fa-solid ${s.icon} text-xs ${colorMap[s.color]}`}
                  ></i>
                </div>
                <span className="text-xs font-medium">{s.label}</span>
              </div>
              <div className="flex items-center gap-1">
                {s.streak > 0 && (
                  <span className="flame text-gold text-sm">
                    {s.streak >= 7 ? "🔥" : "·"}
                  </span>
                )}
                <span
                  className={`text-sm font-bold ${s.streak > 0 ? colorMap[s.color] : "text-bark-light"}`}
                >
                  {s.streak}
                </span>
                <span className="text-[10px] text-bark-light">days</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* This Week */}
      <div className="bg-white rounded-2xl border border-cream-deep p-5 shadow-sm">
        <h3 className="font-display font-bold text-sm mb-1">This Week</h3>
        <p className="text-[11px] text-bark-muted mb-3">
          {ws.total} days tracked so far
        </p>
        <div className="space-y-3">
          {weekBars.map((b, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium">{b.label}</span>
                <span className="text-bark-muted">
                  {b.count}/{ws.total}
                </span>
              </div>
              <div className="w-full h-2 bg-cream-dark rounded-full overflow-hidden">
                <div
                  className={`${barMap[b.color]} h-full rounded-full transition-all duration-500`}
                  style={{
                    width: `${ws.total ? Math.round((b.count / ws.total) * 100) : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Performance & Track Balance Chart */}
      <div className="bg-white rounded-2xl border border-cream-deep p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-sm text-bark flex items-center gap-1.5">
              <i className="fa-solid fa-chart-simple text-indigo-600"></i>
              <span>7-Day Output & Balance</span>
            </h3>
            <p className="text-[10px] text-bark-muted mt-0.5">
              Govt vs MERN vs Life & Wellness output
            </p>
          </div>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            Past 7 Days
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2.5 text-[10px] font-bold text-bark-muted flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-terra"></span> Govt Exam
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600"></span> MERN / DSA
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-teal-600"></span> Life & Care
          </span>
        </div>

        {/* Stacked Bars */}
        <div className="flex items-end justify-between gap-1.5 pt-3 h-32 border-b border-cream-deep pb-1">
          {last7DaysData.map((d, idx) => {
            const govPct = Math.min(100, (d.govM / maxDailyMins) * 100);
            const mernPct = Math.min(100, (d.mernM / maxDailyMins) * 100);
            const lifePct = Math.min(100, (d.lifeM / maxDailyMins) * 100);

            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="text-[9px] font-bold text-bark-muted opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap">
                  {d.totalM > 0 ? `${d.totalM}m` : "0m"}
                </div>
                <div className="w-full max-w-[24px] bg-cream-dark/60 rounded-t-md overflow-hidden flex flex-col-reverse justify-start h-20 transition-all group-hover:scale-105">
                  <div style={{ height: `${govPct}%` }} className="bg-terra w-full" title={`Govt: ${d.govM}m`}></div>
                  <div style={{ height: `${mernPct}%` }} className="bg-indigo-600 w-full" title={`MERN: ${d.mernM}m`}></div>
                  <div style={{ height: `${lifePct}%` }} className="bg-teal-600 w-full" title={`Life: ${d.lifeM}m`}></div>
                </div>
                <span className={`text-[10px] font-bold mt-1.5 ${d.isToday ? "text-indigo-700 font-black" : "text-bark-muted"}`}>
                  {d.dayLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 text-xs font-semibold py-2.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 transition-colors"
        >
          <i className="fa-solid fa-rotate-left mr-1"></i> Reset All Data
        </button>
      </div>
    </aside>
  );
}
