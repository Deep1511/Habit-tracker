import {
  fmtDate,
  getSchedule,
  getHabitSummary,
  DAY_NAMES,
} from "../scheduleData";

export default function Calendar({
  months,
  activeMonth,
  onSwitchMonth,
  birthdayDate,
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
            const sched = getSchedule(ds, birthdayDate);
            const summary = getHabitSummary(ds, birthdayDate, monthData[ds]);
            const isTodayCell = ds === todayStr;
            const isBday = ds === birthdayDate;
            const isFutureDay = ds > todayStr;

            let cls = `cal-day rounded-xl p-1.5 sm:p-2 border ${sched.borderClass} ${sched.bgClass}`;
            if (isTodayCell) cls += " today";
            if (isBday) cls += " birthday";
            if (summary.allDone && !isFutureDay) cls += " all-done";
            if (isFutureDay) cls += " future";

            return (
              <div
                key={ds}
                className={`${cls} relative`}
                onClick={() => onOpenDay(ds)}
              >
                {isBday && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full flex items-center justify-center text-white text-[9px] z-10">
                    <i className="fa-solid fa-gift"></i>
                  </div>
                )}
                <div
                  className={`text-sm font-bold ${isTodayCell ? "text-terra" : ""}`}
                >
                  {date.getDate()}
                </div>

                {/* Habit dots */}
                {!isFutureDay && (
                  <div className="flex items-center justify-center gap-[3px] mt-1">
                    <span
                      className={`hdot ${summary.pooja ? "pooja-on" : "off"}`}
                    ></span>
                    <span
                      className={`hdot ${summary.gov ? "gov-on" : "off"}`}
                    ></span>
                    <span
                      className={`hdot ${summary.genai ? "genai-on" : "off"}`}
                    ></span>
                    <span
                      className={`hdot ${summary.craft ? "craft-on" : "off"}`}
                    ></span>
                    <span
                      className={`hdot ${summary.sleep ? "sleep-on" : "off"}`}
                    ></span>
                  </div>
                )}

                {summary.done > 0 && !isFutureDay && (
                  <div className="text-[9px] text-bark-light text-center mt-0.5">
                    {summary.done}/{summary.total}
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
          <span className="w-3 h-3 rounded bg-terra-pale border border-terra/30"></span>
          Mission Mode
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-teal-pale border border-teal/30"></span>
          Recovery
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-gold-pale border border-gold/30"></span>
          Weekend
        </span>
        <span className="ml-auto flex items-center gap-1.5 flex-wrap">
          <span className="hdot pooja-on"></span>
          <span className="hdot gov-on"></span>
          <span className="hdot genai-on"></span>
          <span className="hdot craft-on"></span>
          <span className="hdot sleep-on"></span>
          <span className="text-bark-light">
            Pooja / Gov / GenAI / Craft / Sleep
          </span>
        </span>
      </div>
    </section>
  );
}
