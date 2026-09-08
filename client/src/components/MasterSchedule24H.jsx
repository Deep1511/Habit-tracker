import { useState, useEffect, useMemo } from "react";
import { COMPLETE_24H_MASTER_SCHEDULE, timeToMins, nowTimeStr } from "../scheduleData";

export default function MasterSchedule24H({
  todayStr,
  dayData,
  onToggleHabit,
  showToast,
  isActiveSchedule,
  onActivateSchedule,
}) {
  const [selectedPhase, setSelectedPhase] = useState("all"); // 'all' | 'morning' | 'afternoon' | 'evening' | 'sleep'
  const [expandedCards, setExpandedCards] = useState({});
  const [currentTimeMins, setCurrentTimeMins] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  // Update current time every 30 seconds for live active window highlighting
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTimeMins(now.getHours() * 60 + now.getMinutes());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Compute which block is currently active right now
  const currentActiveBlock = useMemo(() => {
    return COMPLETE_24H_MASTER_SCHEDULE.find((item) => {
      const start = timeToMins(item.timeStart);
      let end = timeToMins(item.timeEnd);
      // Handle overnight sleep window (10:30 PM to 4:30 AM)
      if (end < start) {
        return currentTimeMins >= start || currentTimeMins < end;
      }
      return currentTimeMins >= start && currentTimeMins < end;
    });
  }, [currentTimeMins]);

  // Compute progress percentage in current block
  const currentProgress = useMemo(() => {
    if (!currentActiveBlock) return 0;
    const start = timeToMins(currentActiveBlock.timeStart);
    let end = timeToMins(currentActiveBlock.timeEnd);
    let total = end - start;
    let elapsed = currentTimeMins - start;
    if (end < start) {
      total = 1440 - start + end;
      elapsed = currentTimeMins >= start ? currentTimeMins - start : 1440 - start + currentTimeMins;
    }
    if (total <= 0) return 100;
    const pct = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
    return pct;
  }, [currentActiveBlock, currentTimeMins]);

  // Filter items by phase tab
  const filteredBlocks = useMemo(() => {
    if (selectedPhase === "all") return COMPLETE_24H_MASTER_SCHEDULE;
    return COMPLETE_24H_MASTER_SCHEDULE.filter((b) => b.phase === selectedPhase);
  }, [selectedPhase]);

  // Toggle card expansion
  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const all = {};
    COMPLETE_24H_MASTER_SCHEDULE.forEach((b) => (all[b.id] = true));
    setExpandedCards(all);
  };

  const collapseAll = () => {
    setExpandedCards({});
  };

  const habits = dayData?.habits || {};

  // Color mappings
  const themeMap = {
    amber: {
      badge: "bg-amber-100 text-amber-800 border-amber-300",
      accent: "text-amber-700",
      border: "border-amber-200",
      bg: "bg-gradient-to-br from-amber-50/70 to-white",
      ring: "ring-amber-500",
      chip: "bg-amber-600 text-white",
    },
    indigo: {
      badge: "bg-indigo-100 text-indigo-800 border-indigo-300",
      accent: "text-indigo-700",
      border: "border-indigo-200",
      bg: "bg-gradient-to-br from-indigo-50/70 to-white",
      ring: "ring-indigo-500",
      chip: "bg-indigo-600 text-white",
    },
    terra: {
      badge: "bg-orange-100 text-orange-900 border-orange-300",
      accent: "text-orange-800",
      border: "border-orange-200",
      bg: "bg-gradient-to-br from-orange-50/70 to-white",
      ring: "ring-orange-500",
      chip: "bg-orange-600 text-white",
    },
    teal: {
      badge: "bg-teal-100 text-teal-800 border-teal-300",
      accent: "text-teal-700",
      border: "border-teal-200",
      bg: "bg-gradient-to-br from-teal-50/70 to-white",
      ring: "ring-teal-500",
      chip: "bg-teal-600 text-white",
    },
    mint: {
      badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
      accent: "text-emerald-700",
      border: "border-emerald-200",
      bg: "bg-gradient-to-br from-emerald-50/70 to-white",
      ring: "ring-emerald-500",
      chip: "bg-emerald-600 text-white",
    },
    bark: {
      badge: "bg-stone-100 text-stone-800 border-stone-300",
      accent: "text-stone-700",
      border: "border-stone-200",
      bg: "bg-gradient-to-br from-stone-50/70 to-white",
      ring: "ring-stone-500",
      chip: "bg-stone-700 text-white",
    },
    purple: {
      badge: "bg-purple-100 text-purple-800 border-purple-300",
      accent: "text-purple-700",
      border: "border-purple-200",
      bg: "bg-gradient-to-br from-purple-50/70 to-white",
      ring: "ring-purple-500",
      chip: "bg-purple-600 text-white",
    },
  };

  return (
    <section
      id="master-24h-schedule-section"
      className="bg-white rounded-2xl border border-cream-deep p-4 sm:p-6 shadow-sm space-y-6"
    >
      {/* ── HEADER & TITLE ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-cream-deep/80 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center text-base shadow-sm font-bold">
              📅
            </span>
            <h2 className="font-display font-black text-lg sm:text-xl text-bark tracking-tight">
              The Complete 24-Hour Master Schedule
            </h2>
            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
              6 Hours Sleep
            </span>
            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200">
              SSC CGL Prime Focus
            </span>
          </div>
          <p className="text-xs text-bark-muted max-w-2xl leading-relaxed">
            High-leverage circadian routine balancing 4.5 hrs of SSC CGL study, fat-burning cardio, 8 hrs of office execution, and exactly 6.0 hours of deep restorative sleep.
          </p>
        </div>

        {/* Action Buttons & Schedule Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {onActivateSchedule && (
            <button
              type="button"
              onClick={onActivateSchedule}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                isActiveSchedule
                  ? "bg-emerald-600 text-white shadow-emerald-200"
                  : "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200"
              }`}
              title="Toggle this schedule for the main dashboard timeline"
            >
              <i className={`fa-solid ${isActiveSchedule ? "fa-circle-check" : "fa-calendar-check"}`}></i>
              <span>{isActiveSchedule ? "Active Daily Timetable ✓" : "Set as Active Timetable"}</span>
            </button>
          )}

          <div className="flex items-center gap-1 border border-cream-deep rounded-xl p-1 bg-cream/40">
            <button
              type="button"
              onClick={expandAll}
              className="px-2 py-1 text-[11px] font-bold text-bark-muted hover:text-bark rounded-lg hover:bg-white transition-colors cursor-pointer"
              title="Expand all details"
            >
              Expand All
            </button>
            <span className="text-bark-muted/40 text-xs">|</span>
            <button
              type="button"
              onClick={collapseAll}
              className="px-2 py-1 text-[11px] font-bold text-bark-muted hover:text-bark rounded-lg hover:bg-white transition-colors cursor-pointer"
              title="Collapse all details"
            >
              Collapse
            </button>
          </div>
        </div>
      </div>

      {/* ── METRICS SUMMARY BAR ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <div className="bg-purple-50/80 border border-purple-200/80 rounded-xl p-3 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
            😴
          </span>
          <div>
            <div className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">Deep Sleep</div>
            <div className="text-sm font-black text-purple-950">6.0 Hours</div>
            <div className="text-[10px] text-purple-600">10:30 PM – 4:30 AM</div>
          </div>
        </div>

        <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-xl p-3 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
            📚
          </span>
          <div>
            <div className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider">SSC CGL Study</div>
            <div className="text-sm font-black text-indigo-950">4.5+ Hours</div>
            <div className="text-[10px] text-indigo-600">4 Study Blocks</div>
          </div>
        </div>

        <div className="bg-orange-50/80 border border-orange-200/80 rounded-xl p-3 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
            🏃‍♂️
          </span>
          <div>
            <div className="text-[10px] uppercase font-bold text-orange-800 tracking-wider">Cardio & Core</div>
            <div className="text-sm font-black text-orange-950">30 Mins</div>
            <div className="text-[10px] text-orange-700">6:30 – 7:00 AM</div>
          </div>
        </div>

        <div className="bg-stone-100/80 border border-stone-300/80 rounded-xl p-3 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-stone-700 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
            💼
          </span>
          <div>
            <div className="text-[10px] uppercase font-bold text-stone-700 tracking-wider">Office Work</div>
            <div className="text-sm font-black text-stone-900">8.0 Hours</div>
            <div className="text-[10px] text-stone-600">2 Focus Blocks</div>
          </div>
        </div>

        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-center gap-3 col-span-2 sm:col-span-1">
          <span className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
            🥛
          </span>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Target Diet</div>
            <div className="text-sm font-black text-amber-950">Electrolytes & High-Protein</div>
            <div className="text-[10px] text-amber-700">Banana + Milk PM</div>
          </div>
        </div>
      </div>

      {/* ── LIVE ACTIVE WINDOW TRACKER ── */}
      {currentActiveBlock && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-xl p-3.5 sm:p-4 shadow-sm border border-amber-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"></span>
            </span>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-100 flex items-center gap-2">
                <span>⚡ CURRENT ACTIVE WINDOW</span>
                <span className="bg-black/20 px-2 py-0.5 rounded-md text-[10px]">{currentActiveBlock.time}</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold flex items-center gap-2 text-white mt-0.5">
                <span>{currentActiveBlock.emojis?.split(" ")[0] || "🎯"}</span>
                <span>{currentActiveBlock.title}</span>
              </div>
              <div className="text-xs text-amber-100 mt-0.5 line-clamp-1">
                {currentActiveBlock.focus}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:flex-col sm:items-end w-full sm:w-auto flex-shrink-0">
            <div className="text-xs font-bold text-amber-100">
              {currentProgress}% Completed
            </div>
            <div className="w-full sm:w-32 bg-black/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${currentProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* ── PHASE NAVIGATION FILTER TABS ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 text-xs">
        {[
          { key: "all", label: "All 24 Hours", icon: "fa-clock", count: 16 },
          { key: "morning", label: "🌅 Morning Phase (4:30 – 8:30 AM)", icon: "fa-sun", count: 6 },
          { key: "afternoon", label: "💼 Afternoon Phase (8:30 AM – 6:30 PM)", icon: "fa-briefcase", count: 4 },
          { key: "evening", label: "🌙 Evening & Night (6:30 – 10:30 PM)", icon: "fa-moon", count: 5 },
          { key: "sleep", label: "😴 Deep Sleep (10:30 PM – 4:30 AM)", icon: "fa-bed", count: 1 },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setSelectedPhase(tab.key)}
            className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              selectedPhase === tab.key
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-cream/60 hover:bg-cream text-bark-muted hover:text-bark"
            }`}
          >
            <i className={`fa-solid ${tab.icon} text-[11px]`}></i>
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                selectedPhase === tab.key ? "bg-black/20 text-white" : "bg-black/5 text-bark-light"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── SCHEDULE BLOCK CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredBlocks.map((block) => {
          const isCurrent = currentActiveBlock?.id === block.id;
          const isDone = block.trackable && !!habits[block.key];
          const isExpanded = !!expandedCards[block.id];
          const theme = themeMap[block.theme] || themeMap.amber;

          return (
            <div
              key={block.id}
              className={`rounded-2xl border transition-all duration-200 p-4 relative ${
                theme.bg
              } ${theme.border} ${
                isCurrent
                  ? `ring-2 ${theme.ring} shadow-md`
                  : "hover:shadow-sm hover:border-amber-300"
              }`}
            >
              {/* Top Row: Time & Duration & Badge */}
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-bark tracking-tight flex items-center gap-1.5">
                    <span className="text-sm">{block.emojis?.split(" ")[0] || "⏱️"}</span>
                    <span>{block.time}</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/5 text-bark-muted">
                    {block.durLabel}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[9px] font-black tracking-wider uppercase flex items-center gap-1 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      Active Now
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border ${theme.badge}`}
                  >
                    {block.badge}
                  </span>
                </div>
              </div>

              {/* Title & Checkbox */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3
                  className={`font-display font-extrabold text-sm sm:text-base leading-snug ${
                    isDone ? "line-through opacity-60 text-bark" : "text-bark"
                  }`}
                >
                  {block.title}
                </h3>

                {block.trackable && (
                  <button
                    type="button"
                    onClick={() => {
                      onToggleHabit(todayStr, block.key);
                      const next = !habits[block.key];
                      if (next) {
                        showToast(`✓ Completed: ${block.title}`, "success");
                      }
                    }}
                    className={`flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                      isDone
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-2xs"
                        : "bg-white border-cream-deep hover:border-amber-400 text-transparent"
                    }`}
                    title={isDone ? "Mark Incomplete" : "Mark Complete"}
                  >
                    <i className="fa-solid fa-check text-xs"></i>
                  </button>
                )}
              </div>

              {/* Focus Activity Box */}
              <div className="bg-white/80 backdrop-blur-xs rounded-xl p-2.5 border border-cream-deep/60 text-xs text-bark space-y-1.5">
                <div className="font-semibold leading-relaxed">
                  <span className="font-extrabold text-bark-muted uppercase tracking-wider text-[10px] mr-1.5">
                    Focus:
                  </span>
                  {block.focus}
                </div>

                {/* Drink / Dietary Action Highlight */}
                {block.drink && (
                  <div className="flex items-start gap-1.5 pt-1 border-t border-cream-deep/40 text-[11px] text-amber-900 font-medium">
                    <span className="text-amber-600 font-extrabold flex-shrink-0">🥤 Drink:</span>
                    <span>{block.drink}</span>
                  </div>
                )}

                {block.dietAction && (
                  <div className="flex items-start gap-1.5 pt-1 border-t border-cream-deep/40 text-[11px] text-amber-900 font-medium">
                    <span className="text-amber-600 font-extrabold flex-shrink-0">🥗 Diet:</span>
                    <span>{block.dietAction}</span>
                  </div>
                )}
              </div>

              {/* Action Steps Toggle */}
              {block.actionSteps && block.actionSteps.length > 0 && (
                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={() => toggleExpand(block.id)}
                    className="text-[11px] font-bold text-bark-muted hover:text-amber-700 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <i
                      className={`fa-solid ${
                        isExpanded ? "fa-chevron-up" : "fa-chevron-down"
                      } text-[9px]`}
                    ></i>
                    <span>{isExpanded ? "Hide Action Protocol" : `View ${block.actionSteps.length} Action Steps`}</span>
                  </button>

                  {isExpanded && (
                    <ul className="mt-2 space-y-1.5 pl-3 border-l-2 border-amber-300/80 text-[11px] text-bark-muted">
                      {block.actionSteps.map((step, sIdx) => (
                        <li key={sIdx} className="leading-relaxed flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── BOTTOM DIET & HYDRATION GOLDEN RULES ── */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-amber-600 text-sm font-bold">⚡</span>
          <h4 className="font-display font-extrabold text-xs uppercase tracking-wider text-amber-900">
            24-Hour Circadian Hydration & Nutrition Blueprint
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/80 rounded-xl p-3 border border-amber-200/60">
            <div className="font-extrabold text-amber-900 mb-0.5">🌅 4:30 AM Awakening</div>
            <p className="text-bark-muted text-[11px] leading-relaxed">
              1 glass of lukewarm water sitting upright. Rehydrates system and promotes digestive motility.
            </p>
          </div>
          <div className="bg-white/80 rounded-xl p-3 border border-amber-200/60">
            <div className="font-extrabold text-amber-900 mb-0.5">☕ 4:45 AM Peak Logic</div>
            <p className="text-bark-muted text-[11px] leading-relaxed">
              Fresh hot black coffee (zero sugar/dairy). Blocks adenosine receptors during peak morning cortisol.
            </p>
          </div>
          <div className="bg-white/80 rounded-xl p-3 border border-amber-200/60">
            <div className="font-extrabold text-amber-900 mb-0.5">🍋 7:00 AM Post-Cardio</div>
            <p className="text-bark-muted text-[11px] leading-relaxed">
              Homemade Electrolyte Drink (lemon + pinch of salt + water). Replenishes sodium & potassium.
            </p>
          </div>
          <div className="bg-white/80 rounded-xl p-3 border border-amber-200/60">
            <div className="font-extrabold text-amber-900 mb-0.5">🥛 8:00 PM Night Digestion</div>
            <p className="text-bark-muted text-[11px] leading-relaxed">
              1 banana + warm milk right after dinner. Provides natural melatonin precursors 2.5h before sleep.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
