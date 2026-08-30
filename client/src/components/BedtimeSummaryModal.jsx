import { useState, useMemo } from "react";
import { fmtDate } from "../scheduleData";

export default function BedtimeSummaryModal({
  isOpen,
  onClose,
  dateStr = fmtDate(new Date()),
  dayData = {},
  allDays = {},
  showToast,
}) {
  const [tomorrowGoal, setTomorrowGoal] = useState(() => {
    return localStorage.getItem(`tomorrow_goal_${dateStr}`) || "";
  });
  const [isSavedGoal, setIsSavedGoal] = useState(false);

  // Today's logs
  const logs = useMemo(() => dayData?.studyLogs || [], [dayData]);

  // Calculations
  const stats = useMemo(() => {
    let govMins = 0;
    let mernMins = 0;
    let lifeMins = 0;

    logs.forEach((log) => {
      const m = Number(log.minutes) || 0;
      if (log.track === "mern") mernMins += m;
      else if (log.track === "gov") govMins += m;
      else if (log.track === "life") lifeMins += m;
      else {
        // heuristic fallback
        if (log.subjectName?.toLowerCase().includes("mern") || log.subjectName?.toLowerCase().includes("javascript")) {
          mernMins += m;
        } else {
          govMins += m;
        }
      }
    });

    // Also include habits that are ticked even if not in studyLogs
    const h = dayData?.habits || {};
    if (h.reading && !logs.some((l) => l.topicName?.toLowerCase().includes("reading") || l.subjectName?.toLowerCase().includes("reading"))) {
      lifeMins += 30;
    }
    if (h.exercise && !logs.some((l) => l.topicName?.toLowerCase().includes("exercise") || l.subjectName?.toLowerCase().includes("exercise"))) {
      lifeMins += 20;
    }
    if (h.pooja && !logs.some((l) => l.topicName?.toLowerCase().includes("pooja"))) {
      lifeMins += 15;
    }

    const totalMins = govMins + mernMins + lifeMins;
    const totalHrs = (totalMins / 60).toFixed(1);

    // Habits checked
    const checkedHabitsCount = Object.values(h).filter(Boolean).length;

    return {
      govMins,
      mernMins,
      lifeMins,
      totalMins,
      totalHrs,
      checkedHabitsCount,
      logsCount: logs.length,
    };
  }, [logs, dayData]);

  // AI Science-Backed Diagnostics & Actionable Tomorrow Suggestions
  const analysis = useMemo(() => {
    const wins = [];
    const improvements = [];
    const tomorrowsPlan = [];

    // Wins
    if (stats.govMins >= 60) {
      wins.push(`🏛️ Strong Government Exam execution (${stats.govMins} mins logged).`);
    }
    if (stats.mernMins >= 60) {
      wins.push(`💻 Solid MERN & DSA coding consistency (${stats.mernMins} mins logged).`);
    }
    if (stats.lifeMins >= 20) {
      wins.push(`✨ High-value personal productivity & self-care (${stats.lifeMins} mins of reading/cleaning/wellness).`);
    }
    if (stats.logsCount >= 2) {
      wins.push(`🎯 Great discipline logging ${stats.logsCount} separate focus sprints today.`);
    }
    if (wins.length === 0) {
      wins.push("🌱 You showed up today and kept your tracker active. Every step counts!");
    }

    // Diagnostics & Improvements
    if (stats.mernMins === 0 && stats.govMins > 0) {
      improvements.push("💻 MERN Stack Gap: You studied Govt Exam today but logged 0 minutes on MERN/DSA. Coding skills decay without daily touchpoints.");
      tomorrowsPlan.push("🚀 Tomorrow 9:30 AM: Start directly with 1 Striver DSA problem or 1 React Component before afternoon fatigue sets in.");
    } else if (stats.govMins === 0 && stats.mernMins > 0) {
      improvements.push("🏛️ Govt Exam Gap: You focused on code today but missed Govt Exam drills. Speed & calculation speed need daily practice.");
      tomorrowsPlan.push("🚀 Tomorrow 7:30 AM: Solve 20 speed math formulas or 1 Reasoning mock test first thing in the morning.");
    } else if (stats.govMins > 0 && stats.mernMins > 0) {
      improvements.push("⚖️ Balanced Dual-Track: You successfully balanced both Govt Exam and MERN tracks today!");
      tomorrowsPlan.push("🚀 Maintain the dual momentum: 7:30 AM Govt Mock + 9:30 AM MERN DSA sprint.");
    }

    if (stats.lifeMins === 0) {
      improvements.push("🧹 Mindset & Environment: Taking 15 mins to clean your room/washroom or read 10 book pages clears cognitive clutter.");
      tomorrowsPlan.push("📖 Add 20 mins of book reading or a quick room tidy-up before bed tomorrow.");
    }

    // Sleep advice
    tomorrowsPlan.push("🌙 Sleep & Memory Lock: Turn off phone/laptop screens by 12:00 AM. 5.5–6 hours of quality sleep consolidates today's memory into permanent storage.");

    return { wins, improvements, tomorrowsPlan };
  }, [stats]);

  if (!isOpen) return null;

  const handleSaveTomorrowGoal = (e) => {
    e.preventDefault();
    if (!tomorrowGoal.trim()) return;
    const goalText = tomorrowGoal.trim();
    localStorage.setItem(`tomorrow_goal_${dateStr}`, goalText);

    // Also calculate tomorrow's date string
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    const tomorrowStr = d.toISOString().slice(0, 10);
    localStorage.setItem(`today_mission_${tomorrowStr}`, goalText);
    localStorage.setItem(`today_mission_${dateStr}`, goalText);

    setIsSavedGoal(true);
    showToast?.("🎯 Tomorrow's Core Goal committed! Wake up ready to execute.", "success");
    setTimeout(() => setIsSavedGoal(false), 2000);
  };

  const handleCopySummary = () => {
    const text = `📊 DAILY PRODUCTIVITY SUMMARY (${dateStr})
━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ Total Productive Time: ${stats.totalHrs} hrs (${stats.totalMins} mins)
🏛️ Govt Exam Study: ${stats.govMins} mins
💻 MERN & DSA Prep: ${stats.mernMins} mins
✨ Life & Self-Care: ${stats.lifeMins} mins
🎯 Completed Sessions: ${stats.logsCount} logged

🌟 TODAY'S WINS:
${analysis.wins.map((w) => `• ${w}`).join("\n")}

🚀 TOMORROW'S FOCUS & IMPROVEMENT:
${analysis.tomorrowsPlan.map((p) => `• ${p}`).join("\n")}
${tomorrowGoal ? `\n🎯 #1 MISSION FOR TOMORROW:\n"${tomorrowGoal}"` : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━
Logged via Antigravity Daily Mastery System`;

    navigator.clipboard.writeText(text);
    showToast?.("📋 Full Day Summary copied to clipboard!", "success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-cream-deep w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* ── Modal Header ── */}
        <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-purple-950 text-white p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-indigo-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-bark flex items-center justify-center text-lg font-black shadow-md flex-shrink-0">
              <i className="fa-solid fa-moon"></i>
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-extrabold text-base sm:text-lg text-white">
                  Bedtime Review & Daily Performance Compass
                </h2>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {dateStr}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Reflect on today's wins, analyze cognitive balance, and lock in your priority improvements for tomorrow.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* ── Modal Body (Scrollable) ── */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-bark">
          {/* 1. Scorecard Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-3.5 rounded-xl border border-indigo-200/80 shadow-2xs">
              <div className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1">
                <i className="fa-solid fa-hourglass-half"></i> Total Output
              </div>
              <div className="font-display font-black text-xl sm:text-2xl text-indigo-950 mt-1">
                {stats.totalHrs} <span className="text-xs font-bold text-indigo-700">hrs</span>
              </div>
              <div className="text-[10px] text-indigo-600 mt-0.5 font-medium">
                {stats.totalMins} total mins
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-3.5 rounded-xl border border-amber-200/80 shadow-2xs">
              <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                <i className="fa-solid fa-landmark"></i> Govt Exam
              </div>
              <div className="font-display font-black text-xl sm:text-2xl text-amber-950 mt-1">
                {stats.govMins} <span className="text-xs font-bold text-amber-700">mins</span>
              </div>
              <div className="text-[10px] text-amber-700 mt-0.5 font-medium">
                {(stats.govMins / 60).toFixed(1)} hrs focused
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-3.5 rounded-xl border border-purple-200/80 shadow-2xs">
              <div className="text-[10px] font-bold text-purple-800 uppercase tracking-wider flex items-center gap-1">
                <i className="fa-solid fa-code"></i> MERN & DSA
              </div>
              <div className="font-display font-black text-xl sm:text-2xl text-purple-950 mt-1">
                {stats.mernMins} <span className="text-xs font-bold text-purple-700">mins</span>
              </div>
              <div className="text-[10px] text-purple-700 mt-0.5 font-medium">
                {(stats.mernMins / 60).toFixed(1)} hrs coding
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 p-3.5 rounded-xl border border-teal-200/80 shadow-2xs">
              <div className="text-[10px] font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1">
                <i className="fa-solid fa-spa"></i> Life & Wellness
              </div>
              <div className="font-display font-black text-xl sm:text-2xl text-teal-950 mt-1">
                {stats.lifeMins} <span className="text-xs font-bold text-teal-700">mins</span>
              </div>
              <div className="text-[10px] text-teal-700 mt-0.5 font-medium">
                Reading / Cleaning / Habits
              </div>
            </div>
          </div>

          {/* 2. Today's Completed Sessions Timeline */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-bark-muted flex items-center gap-1.5">
                <i className="fa-solid fa-circle-check text-emerald-600"></i>
                Today's Logged Sessions ({logs.length})
              </h3>
              <span className="text-[10px] font-bold text-bark-light">
                Auto-Ticked & Persisted
              </span>
            </div>

            {logs.length === 0 ? (
              <div className="bg-cream/40 rounded-xl p-4 text-center border border-dashed border-cream-deep text-xs text-bark-muted">
                No individual study logs recorded for today yet. Use the Quick Study Logger to track topics and habits!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto p-1">
                {logs.map((log, idx) => (
                  <div
                    key={log.id || idx}
                    className="bg-white rounded-xl p-3 border border-cream-deep shadow-2xs space-y-1 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          log.track === "mern"
                            ? "bg-indigo-100 text-indigo-800"
                            : log.track === "life"
                            ? "bg-teal-100 text-teal-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {log.track === "mern"
                          ? "MERN & DSA"
                          : log.track === "life"
                          ? "Life & Wellness"
                          : "Govt Exam"}
                      </span>
                      <span className="text-[10px] font-bold text-bark-light flex items-center gap-1">
                        <i className="fa-regular fa-clock"></i>
                        {log.timeStr || log.time || "Logged"} • {log.minutes}m
                      </span>
                    </div>
                    <div className="font-bold text-xs text-bark truncate">
                      {log.topicName || "Study Session"}
                    </div>
                    {log.notes && (
                      <p className="text-[10px] text-bark-muted italic truncate">
                        "{log.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. AI Performance Diagnostics: Wins & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Wins Card */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
              <h4 className="font-extrabold text-xs text-emerald-900 flex items-center gap-1.5">
                <i className="fa-solid fa-trophy text-emerald-600"></i>
                <span>Today's Proven Wins</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-950">
                {analysis.wins.map((win, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{win}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvement Opportunities */}
            <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 space-y-2">
              <h4 className="font-extrabold text-xs text-purple-950 flex items-center gap-1.5">
                <i className="fa-solid fa-compass text-purple-600"></i>
                <span>Science-Backed Next-Day Improvements</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-purple-900">
                {analysis.tomorrowsPlan.map((plan, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">👉</span>
                    <span>{plan}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Commit Tomorrow's #1 Mission */}
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-teal-50 border border-indigo-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
                <i className="fa-solid fa-crosshairs text-indigo-600"></i>
                <span>Commit Tomorrow's #1 Most Important Goal</span>
              </label>
              <span className="text-[10px] font-bold text-indigo-600">
                Prime your subconscious before sleep
              </span>
            </div>

            <form onSubmit={handleSaveTomorrowGoal} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. Master Binary Search (Striver Step 4) + Clean Bedroom + 50 Simplification Math..."
                value={tomorrowGoal}
                onChange={(e) => setTomorrowGoal(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-indigo-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-bark font-medium"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
              >
                <i className="fa-solid fa-lock"></i>
                <span>{isSavedGoal ? "Committed! ✅" : "Set Goal"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* ── Modal Footer ── */}
        <div className="bg-cream/60 border-t border-cream-deep p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 flex-shrink-0">
          <div className="text-[11px] text-bark-muted flex items-center gap-1.5">
            <i className="fa-solid fa-shield-halved text-teal-600"></i>
            <span>Sleep Goal: <strong>5:30–6:00 hrs</strong> for sharpest tomorrow memory retention.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopySummary}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white hover:bg-cream border border-cream-deep text-xs font-bold text-bark transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <i className="fa-solid fa-copy text-indigo-600"></i>
              <span>Copy Summary</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold transition-all shadow-xs cursor-pointer"
            >
              Good Night & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
