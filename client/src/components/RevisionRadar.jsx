import { useMemo, useState } from "react";
import { fmtDate } from "../scheduleData";

export default function RevisionRadar({ allDays = {}, onSelectTopicForReview }) {
  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'tough' | 'mern' | 'gov'
  const [completedRecalls, setCompletedRecalls] = useState({});

  const recallQueue = useMemo(() => {
    const today = new Date();
    const queue = [];

    // Scan last 14 days
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const ds = fmtDate(d);
      const dayData = allDays[ds];
      if (!dayData || !dayData.studyLogs) continue;

      dayData.studyLogs.forEach((log) => {
        const isTough = log.confidence === "tough";
        const is3DaysAgo = i === 3;
        const is7DaysAgo = i === 7;

        // Candidate if marked tough OR falls exactly on 3-day / 7-day memory consolidation window
        if (isTough || is3DaysAgo || is7DaysAgo) {
          queue.push({
            ...log,
            daysAgo: i,
            dateStr: ds,
            isTough,
            isScheduledSpaced: is3DaysAgo || is7DaysAgo,
            uniqueKey: `${ds}_${log.id || log.topicName}`,
          });
        }
      });
    }

    return queue;
  }, [allDays]);

  const filteredQueue = useMemo(() => {
    return recallQueue.filter((item) => {
      if (completedRecalls[item.uniqueKey]) return false;
      if (activeFilter === "tough") return item.isTough;
      if (activeFilter === "mern") return item.track === "mern";
      if (activeFilter === "gov") return item.track === "gov";
      return true;
    });
  }, [recallQueue, activeFilter, completedRecalls]);

  const markRecallComplete = (key) => {
    setCompletedRecalls((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <div className="bg-gradient-to-br from-white via-amber-50/20 to-purple-50/20 rounded-2xl border border-amber-200/80 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cream-deep pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center text-sm shadow-xs font-black">
            <i className="fa-solid fa-radar"></i>
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-extrabold text-sm sm:text-base text-bark">
                Spaced Repetition &amp; Weakness Recall Radar
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                {filteredQueue.length} Due for Recall
              </span>
            </div>
            <p className="text-xs text-bark-muted mt-0.5">
              Science of Active Recall: Re-testing concepts 3 and 7 days after first study converts short-term memory into permanent mastery.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "all"
                ? "bg-amber-600 text-white shadow-2xs"
                : "bg-white text-bark-muted hover:bg-cream border border-cream-deep"
            }`}
          >
            All Due ({recallQueue.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("tough")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "tough"
                ? "bg-red-600 text-white shadow-2xs"
                : "bg-white text-red-700 hover:bg-red-50 border border-red-200"
            }`}
          >
            🔴 Tough Only
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("mern")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "mern"
                ? "bg-indigo-600 text-white shadow-2xs"
                : "bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200"
            }`}
          >
            💻 MERN
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("gov")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "gov"
                ? "bg-terra-dark text-white shadow-2xs"
                : "bg-white text-terra-dark hover:bg-terra-pale border border-terra/20"
            }`}
          >
            🏛️ Govt Exam
          </button>
        </div>
      </div>

      {/* Recall Cards List */}
      {filteredQueue.length === 0 ? (
        <div className="bg-white/80 rounded-xl p-5 text-center border border-dashed border-cream-deep space-y-1">
          <i className="fa-solid fa-circle-check text-emerald-500 text-xl block mb-1"></i>
          <div className="text-xs font-extrabold text-bark">
            All Weak Spots &amp; Spaced Recalls are 100% Cleared!
          </div>
          <p className="text-[11px] text-bark-muted">
            Whenever you mark a session as <strong>🔴 Tough</strong> in the study logger, it will automatically reappear here after 3 days for a quick 5-minute revision.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredQueue.map((item) => {
            const isMern = item.track === "mern";
            return (
              <div
                key={item.uniqueKey}
                className={`bg-white rounded-xl border p-3.5 shadow-2xs flex flex-col justify-between transition-all ${
                  item.isTough
                    ? "border-red-200 hover:border-red-400"
                    : isMern
                    ? "border-indigo-200 hover:border-indigo-400"
                    : "border-terra/20 hover:border-terra/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        item.isTough
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : isMern
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-terra-pale text-terra-dark border border-terra/20"
                      }`}
                    >
                      {item.isTough ? "🔴 Needs Review" : isMern ? "💻 MERN & DSA" : "🏛️ Govt Exam"}
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {item.daysAgo} day{item.daysAgo > 1 ? "s" : ""} ago
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-bark leading-snug">
                    {item.topicName}
                  </h4>
                  {item.subjectName && (
                    <div className="text-[10px] text-bark-light font-medium mt-0.5">
                      {item.subjectName}
                    </div>
                  )}

                  {item.notes && (
                    <div className="text-[10px] text-bark-muted bg-cream/50 p-2 rounded-lg mt-2 italic leading-relaxed">
                      "{item.notes}"
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-cream-deep/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTopicForReview?.(item);
                      markRecallComplete(item.uniqueKey);
                    }}
                    className="flex-1 py-1.5 px-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-[11px] rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <i className="fa-solid fa-bolt text-[9px]"></i>
                    <span>Log 5-Min Flash Recall</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => markRecallComplete(item.uniqueKey)}
                    className="p-1.5 text-bark-light hover:text-emerald-700 text-xs rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                    title="Mark Mastered & Dismiss"
                  >
                    <i className="fa-solid fa-check"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
