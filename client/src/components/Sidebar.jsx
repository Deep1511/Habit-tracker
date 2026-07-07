import {
  getSchedule,
  getHabitSummary,
  fmtDate,
  daysUntilBirthday,
  CRAFT_PHASES,
} from "../scheduleData";

export default function Sidebar({
  birthdayDate,
  craftTotal,
  streaks,
  monthData,
  onReset,
}) {
  const daysLeft = daysUntilBirthday(birthdayDate);
  const totalHrs = (craftTotal / 60).toFixed(1);
  const targetHrs = 32;
  const pct = Math.min(100, (craftTotal / (targetHrs * 60)) * 100);
  const currentPhaseIdx =
    daysLeft > 21
      ? 0
      : daysLeft > 14
        ? 1
        : daysLeft > 7
          ? 2
          : daysLeft >= 0
            ? 3
            : 4;

  // This week stats
  const today = new Date();
  const dayOfWeek = today.getDay();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOfWeek);
  const ws = { gov: 0, genai: 0, craft: 0, sleep: 0, total: 0 };
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const ds = fmtDate(d);
    if (ds > fmtDate(today)) continue;
    const s = getHabitSummary(ds, birthdayDate, monthData[ds]);
    if (s.gov) ws.gov++;
    if (s.genai) ws.genai++;
    if (s.craft) ws.craft++;
    if (s.sleep) ws.sleep++;
    ws.total++;
  }

  const streakData = [
    {
      label: "All Habits",
      streak: streaks.all || 0,
      color: "terra",
      icon: "fa-fire",
    },
    {
      label: "Exercise",
      streak: streaks.exercise || 0,
      color: "terra",
      icon: "fa-dumbbell",
    },
    {
      label: "Pooja",
      streak: streaks.pooja || 0,
      color: "terra",
      icon: "fa-om",
    },
    {
      label: "Gov Exam",
      streak: streaks.gov || 0,
      color: "terra",
      icon: "fa-book",
    },
    {
      label: "GenAI",
      streak: streaks.genai || 0,
      color: "teal",
      icon: "fa-robot",
    },
    {
      label: "Crafting",
      streak: streaks.craft || 0,
      color: "gold",
      icon: "fa-palette",
    },
    {
      label: "Sleep Goal",
      streak: streaks.sleep || 0,
      color: "mint",
      icon: "fa-bed",
    },
  ];

  const colorMap = {
    terra: "text-terra",
    teal: "text-teal",
    gold: "text-gold",
    mint: "text-mint",
  };
  const bgMap = {
    terra: "bg-terra-pale",
    teal: "bg-teal-pale",
    gold: "bg-gold-pale",
    mint: "bg-mint-pale",
  };
  const barMap = {
    terra: "bg-terra",
    teal: "bg-teal",
    gold: "bg-gold",
    mint: "bg-mint",
  };

  const weekBars = [
    { label: "Gov Exam", count: ws.gov, color: "terra" },
    { label: "GenAI", count: ws.genai, color: "teal" },
    { label: "Crafting", count: ws.craft, color: "gold" },
    { label: "Sleep Goal", count: ws.sleep, color: "mint" },
  ];

  return (
    <aside className="space-y-5">
      {/* Craft Progress */}
      <div className="bg-white rounded-2xl border border-cream-deep p-5 shadow-sm">
        <h3 className="font-display font-bold text-sm mb-1">
          Craft Gift Progress
        </h3>
        <p className="text-[11px] text-bark-muted mb-4">
          Target: {targetHrs} hrs total across 4 weeks
        </p>
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-bold text-bark">{totalHrs} hrs logged</span>
            <span className="text-bark-muted">{Math.round(pct)}%</span>
          </div>
          <div className="w-full h-3 bg-cream-dark rounded-full overflow-hidden">
            <div
              className="phase-bar bg-gradient-to-r from-gold-dark to-gold-light"
              style={{ width: `${pct}%` }}
            ></div>
          </div>
        </div>
        <div className="space-y-2.5">
          {CRAFT_PHASES.map((p, i) => {
            const isComplete = craftTotal / 60 >= p.targetHrs;
            const isActive = i === currentPhaseIdx;
            const phasePct = Math.min(
              100,
              Math.max(
                0,
                ((craftTotal / 60 -
                  (i > 0 ? CRAFT_PHASES[i - 1].targetHrs : 0)) /
                  (p.targetHrs - (i > 0 ? CRAFT_PHASES[i - 1].targetHrs : 0))) *
                  100,
              ),
            );
            return (
              <div
                key={i}
                className={`flex items-start gap-3 ${isActive ? "opacity-100" : "opacity-60"}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg ${isComplete ? "bg-mint text-white" : isActive ? "bg-gold text-white" : "bg-cream-dark text-bark-light"} flex items-center justify-center flex-shrink-0 text-xs`}
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
                        className="h-full bg-gold rounded-full transition-all"
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
          <i className="fa-solid fa-circle-info mr-1"></i>Log craft minutes in
          each day's detail view
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
                  className={`w-7 h-7 rounded-lg ${bgMap[s.color]} flex items-center justify-center`}
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
