import {
  fmtDate,
  getSchedule,
  getHabitSummary,
  DAY_NAMES,
  START_DATE,
} from "../scheduleData";

export default function Calendar({
  months,
  activeMonth,
  onSwitchMonth,
  startDate = START_DATE,
  targetDate,
  monthData,
  onOpenDay,
}) {
  const m = months[activeMonth];
  const todayStr = fmtDate(new Date());

  // Build grid
  const firstDay = new Date(m.year, m.month, 1).getDay();
  const daysInMonth = new Date(m.year, m.month + 1, 0).getDate();
  const grid = [];
  for (let i = 0; i < firstDay; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++)
    grid.push(new Date(m.year, m.month, d));

  return (
    <section className="lg:col-span-2 bg-white rounded-2xl border border-cream-deep shadow-sm overflow-hidden">
      {/* Month tabs */}
      <div className="flex border-b border-cream-deep px-4 pt-4 gap-2 overflow-x-auto">
        {months.map((mo, i) => (
          <button
            key={i}
            className={`month-tab px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap ${i === activeMonth ? "active" : "text-bark-muted hover:bg-cream-dark"}`}
            onClick={() => onSwitchMonth(i)}
          >
            {mo.label}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-5">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_NAMES.map((d) => (
            <div
              key={d}
              className="text-center text-[11px] font-bold text-bark-light uppercase tracking-wider py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-1">
          {grid.map((date, idx) => {
            if (!date)
              return <div key={`e${idx}`} className="min-h-[72px]"></div>;

            const ds = fmtDate(date);
            const isBeforeStartDay = ds < startDate;
            const isStartDay = ds === startDate;
            const sched = getSchedule(ds, targetDate);
            const summary = getHabitSummary(ds, targetDate, monthData[ds], startDate);
            const isTodayCell = ds === todayStr;
            const isTargetDay = ds === targetDate;
            const isFutureDay = ds > todayStr;

            let cls = `cal-day rounded-xl p-1.5 sm:p-2 border ${sched.borderClass} ${sched.bgClass}`;
            if (isTodayCell) cls += " today";
            if (isStartDay) cls += " ring-2 ring-emerald-500/80";
            if (isTargetDay) cls += " target-day";
            if (summary.allDone && !isFutureDay && !isBeforeStartDay) cls += " all-done";
            if (isFutureDay && !isBeforeStartDay) cls += " future";
            if (isBeforeStartDay) cls += " opacity-30 bg-cream-dark/30 grayscale";

            return (
              <div
                key={ds}
                className={`${cls} relative`}
                onClick={() => {
                  if (!isBeforeStartDay) onOpenDay(ds);
                }}
              >
                {isStartDay && (
                  <div className="absolute -top-1.5 -left-1 px-1.5 py-0.5 bg-emerald-600 rounded-full flex items-center justify-center text-white text-[8px] font-bold z-10 shadow-xs" title="Sprint Start Date (24 Aug)">
                    <i className="fa-solid fa-play mr-0.5"></i> Launch
                  </div>
                )}

                {isTargetDay && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[9px] z-10 shadow-xs" title="Target Interview Sprint Date">
                    <i className="fa-solid fa-flag-checkered"></i>
                  </div>
                )}

                <div
                  className={`text-sm font-bold ${isTodayCell ? "text-indigo-600" : isStartDay ? "text-emerald-700 font-extrabold" : ""}`}
                >
                  {date.getDate()}
                </div>

                {/* Habit dots */}
                {!isFutureDay && !isBeforeStartDay && (
                  <div className="flex items-center justify-center gap-[3px] mt-1">
                    <span
                      className={`hdot ${summary.pooja ? "pooja-on" : "off"}`}
                      title="Pooja"
                    ></span>
                    <span
                      className={`hdot ${summary.gov ? "gov-on" : "off"}`}
                      title="Gov Exam"
                    ></span>
                    <span
                      className={`hdot ${summary.mern ? "mern-on" : "off"}`}
                      title="MERN Interview Prep"
                    ></span>
                    <span
                      className={`hdot ${summary.reading ? "reading-on" : "off"}`}
                      title="Book Reading"
                    ></span>
                    <span
                      className={`hdot ${summary.sleep ? "sleep-on" : "off"}`}
                      title="Sleep Goal"
                    ></span>
                  </div>
                )}

                {summary.done > 0 && !isFutureDay && !isBeforeStartDay && (
                  <div className="text-[9px] text-bark-light text-center mt-0.5 font-medium">
                    {summary.done}/{summary.total}
                  </div>
                )}

                {isBeforeStartDay && (
                  <div className="text-[8px] text-bark-light text-center mt-1">
                    Pre-start
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 pb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-bark-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-500"></span>
          Launch: Aug 24
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-terra-pale border border-terra/30"></span>
          Sprint Mode
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-teal-pale border border-teal/30"></span>
          Mastery Mode
        </span>
        <span className="ml-auto flex items-center gap-1.5 flex-wrap">
          <span className="hdot pooja-on"></span>
          <span className="hdot gov-on"></span>
          <span className="hdot mern-on"></span>
          <span className="hdot reading-on"></span>
          <span className="hdot sleep-on"></span>
          <span className="text-bark-light font-medium">
            Pooja / Gov / MERN / Reading / Sleep
          </span>
        </span>
      </div>
    </section>
  );
}
