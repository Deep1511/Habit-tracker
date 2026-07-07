import {
  getSchedule,
  parseDate,
  isFuture,
  CAT_STYLES,
  daysUntilBirthday,
} from "../scheduleData";

export default function DayModal({
  dateStr,
  birthdayDate,
  dayData,
  onToggle,
  onUpdateField,
  onClose,
}) {
  const date = parseDate(dateStr);
  const sched = getSchedule(dateStr, birthdayDate);
  const future = isFuture(dateStr);
  const dateLabel = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const habits = dayData?.habits || {};
  const trackable = sched.blocks.filter((b) => b.key);
  const doneCount = trackable.filter((b) => habits[b.key]).length;

  return (
    <div
      className="modal-overlay fixed inset-0 z-[90] bg-bark/30 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-cream-deep flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display font-bold text-lg">{dateLabel}</h3>
              <span
                className={`${sched.badgeClass} text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mt-1.5`}
              >
                <i className={`fa-solid ${sched.icon}`}></i>
                {sched.label}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-cream-dark flex items-center justify-center text-bark-muted transition-colors"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 overflow-y-auto flex-1">
          {future && (
            <div className="text-center py-6 mb-4">
              <div className="w-14 h-14 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-3">
                <i className="fa-solid fa-clock text-bark-light text-xl"></i>
              </div>
              <p className="text-sm font-semibold text-bark-muted">
                This day hasn't come yet
              </p>
              <p className="text-xs text-bark-light mt-1">
                Here's your planned schedule:
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            {sched.blocks.map((b, i) => {
              const cs = CAT_STYLES[b.cat] || CAT_STYLES.routine;
              const checked = b.key ? !!habits[b.key] : null;
              const isHigh =
                b.cat === "gov" || b.cat === "craft" || b.cat === "pooja";

              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 ${cs.bg} ${cs.border} border rounded-xl px-3 py-2.5 ${isHigh ? "ring-1 ring-terra/8" : ""}`}
                >
                  {b.key ? (
                    <input
                      type="checkbox"
                      className="habit-cb"
                      checked={!!checked}
                      disabled={future}
                      onChange={() => onToggle(dateStr, b.key)}
                    />
                  ) : (
                    <div className="w-6"></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold ${cs.text} uppercase tracking-wider w-16 flex-shrink-0`}
                      >
                        {b.time}
                      </span>
                      <span
                        className={`text-xs font-medium ${b.key && checked ? "line-through opacity-50" : ""}`}
                      >
                        {b.label}
                      </span>
                    </div>
                  </div>
                  {b.dur && (
                    <span className="text-[10px] text-bark-light font-medium flex-shrink-0">
                      {b.dur}
                    </span>
                  )}
                  {b.cat === "pooja" && (
                    <i className="fa-solid fa-om text-terra-light/30 text-xs"></i>
                  )}
                  {b.cat === "gov" && (
                    <i className="fa-solid fa-book text-terra/30 text-xs"></i>
                  )}
                  {b.cat === "genai" && (
                    <i className="fa-solid fa-robot text-teal/30 text-xs"></i>
                  )}
                  {b.cat === "craft" && (
                    <i className="fa-solid fa-palette text-gold/30 text-xs"></i>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sleep & craft logging */}
          {!future && (
            <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-cream-deep">
              <div>
                <label className="text-[11px] font-bold text-bark-muted uppercase tracking-wider block mb-1.5">
                  <i className="fa-solid fa-bed text-mint mr-1"></i>Sleep Hours
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="12"
                    step="0.5"
                    value={dayData?.sleepHours ?? ""}
                    placeholder={sched.sleepTarget}
                    onChange={(e) =>
                      onUpdateField(
                        dateStr,
                        "sleepHours",
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    className="w-full border border-cream-deep rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-terra/20 focus:border-terra bg-white"
                  />
                  <span className="text-xs text-bark-light flex-shrink-0">
                    / {sched.sleepTarget}h
                  </span>
                </div>
                {dayData?.sleepHours &&
                  (() => {
                    const diff = Number(dayData.sleepHours) - sched.sleepTarget;
                    let msg = "",
                      cls = "";
                    if (diff >= 0) {
                      msg =
                        diff >= 0.5
                          ? `Exceeded by ${Math.abs(diff)}h`
                          : "Met goal";
                      cls = "text-mint";
                    } else if (diff >= -0.5) {
                      msg = `Slightly under (${diff}h)`;
                      cls = "text-gold-dark";
                    } else {
                      msg = `Under by ${Math.abs(diff)}h — recover tomorrow`;
                      cls = "text-terra";
                    }
                    return (
                      <div className={`mt-1.5 text-[11px] ${cls} font-medium`}>
                        <i className="fa-solid fa-circle-info mr-1"></i>
                        {msg}
                      </div>
                    );
                  })()}
              </div>
              <div>
                <label className="text-[11px] font-bold text-bark-muted uppercase tracking-wider block mb-1.5">
                  <i className="fa-solid fa-palette text-gold mr-1"></i>Craft
                  Minutes
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="600"
                    step="5"
                    value={dayData?.craftMinutes ?? ""}
                    placeholder={sched.craftMins}
                    onChange={(e) =>
                      onUpdateField(
                        dateStr,
                        "craftMinutes",
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    className="w-full border border-cream-deep rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-terra/20 focus:border-terra bg-white"
                  />
                  <span className="text-xs text-bark-light flex-shrink-0">
                    min
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-cream-deep flex-shrink-0">
          {!future ? (
            <div className="flex items-center justify-between">
              <div className="text-xs text-bark-muted">
                {doneCount}/{trackable.length} habits completed
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-bark text-cream text-xs font-bold rounded-xl hover:bg-bark/90 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="text-right">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-bark text-cream text-xs font-bold rounded-xl hover:bg-bark/90 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
