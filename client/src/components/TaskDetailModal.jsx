import {
  CAT_STYLES,
  getTopicForDay,
  getBrainFreshupForDay,
  fmtDate,
  RECOMMENDED_BOOKS,
} from "../scheduleData";

export default function TaskDetailModal({ task, dateStr, onClose, onToggle, isDone }) {
  if (!task) return null;

  const catStyle = CAT_STYLES[task.cat] || CAT_STYLES.routine;
  const todayStr = fmtDate(new Date());
  const effectiveDate = dateStr || todayStr;
  const dayTopic = getTopicForDay(effectiveDate);
  const brainTopic = getBrainFreshupForDay(effectiveDate);

  // Category types
  const isMernTask = task.cat === "mern";
  const isGovTask = task.cat === "gov";
  const isBrainTask = task.key === "brainFreshup" || task.cat === "brain";
  const isReadingTask = task.key === "reading" || task.cat === "reading";
  const isSleepTask = task.key === "sleepGoal" || task.cat === "sleep";

  // Pick a featured book for reading tasks
  const featuredBook = RECOMMENDED_BOOKS[0]; // Atomic Habits / Top pick

  return (
    <div
      className="modal-overlay fixed inset-0 z-[100] bg-bark/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel bg-white w-full max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-cream-deep">
        {/* Header with Category styling */}
        <div className={`px-6 py-4 sm:py-5 border-b ${catStyle.border} ${catStyle.bg} flex items-start justify-between flex-shrink-0`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl ${catStyle.dot} text-white flex items-center justify-center text-lg shadow-sm`}>
              <i className={`fa-solid ${catStyle.icon}`}></i>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${catStyle.bg} ${catStyle.text} border ${catStyle.border}`}>
                  {task.cat}
                </span>
                <span className="text-xs text-bark font-bold flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md border border-cream-deep">
                  <i className="fa-solid fa-clock text-[10px] text-bark-light"></i>
                  {task.time} {task.durMins > 0 ? `· ${task.durMins} min` : ""}
                </span>
              </div>
              <h2 className="font-display font-bold text-base sm:text-lg text-bark leading-tight mt-1">
                {task.label}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-black/5 flex items-center justify-center text-bark-muted transition-colors flex-shrink-0"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-bark">
          {/* Main Description */}
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-bark-muted mb-1.5 flex items-center gap-1.5">
              <i className="fa-solid fa-circle-info text-indigo-500"></i> What To Do
            </h4>
            <p className="text-xs leading-relaxed text-bark bg-cream/40 p-3.5 rounded-xl border border-cream-deep font-medium">
              {task.desc || "Execute this scheduled milestone with high discipline and attention to detail."}
            </p>
          </div>

          {/* 🔴 DYNAMIC MERN & DSA TOPIC BREAKDOWN (HIGH-READABILITY CARDS) */}
          {isMernTask && dayTopic && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                  <i className="fa-solid fa-graduation-cap text-indigo-600"></i> Today's Syllabus Topics ({dayTopic.dayName})
                </h4>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {dayTopic.badge}
                </span>
              </div>

              {/* 1. Striver DSA Card */}
              <div className="bg-gradient-to-br from-red-50/80 via-white to-red-50/40 border border-red-200 rounded-xl p-3.5 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-800 flex items-center gap-1.5">
                    <i className="fa-solid fa-code text-red-600"></i> 1. DSA Topic (Striver A2Z)
                  </span>
                  <a
                    href="https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-red-600 hover:bg-red-700 text-white flex items-center gap-1 shadow-2xs transition-colors"
                  >
                    <i className="fa-brands fa-youtube"></i> Striver Sheet
                    <i className="fa-solid fa-arrow-up-right-from-square text-[7px]"></i>
                  </a>
                </div>
                <div className="text-xs font-bold text-bark">
                  {dayTopic.dsa}
                </div>
                <div className="text-[11px] text-bark-muted leading-relaxed bg-white/80 p-2 rounded-lg border border-red-100">
                  <strong>Key Practice Patterns:</strong> {dayTopic.dsaDesc}
                </div>
              </div>

              {/* 2. MERN & JS Core Card */}
              <div className="bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/40 border border-indigo-200 rounded-xl p-3.5 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
                    <i className="fa-solid fa-laptop-code text-indigo-600"></i> 2. MERN & JavaScript Focus
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                    Find on YouTube
                  </span>
                </div>
                <div className="text-xs font-bold text-bark">
                  {dayTopic.mern}
                </div>
                <div className="text-[11px] text-bark-muted leading-relaxed bg-white/80 p-2 rounded-lg border border-indigo-100">
                  <strong>Concepts to Master:</strong> {dayTopic.mernDesc}
                </div>
              </div>

              {/* 3. Professor's Interview Tip */}
              {dayTopic.interviewTips && dayTopic.interviewTips.length > 0 && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 space-y-1">
                  <div className="text-[10px] font-bold text-amber-900 uppercase flex items-center gap-1.5">
                    <i className="fa-solid fa-lightbulb text-amber-500"></i> Top Interviewer Secret:
                  </div>
                  <p className="text-[11px] text-bark italic leading-snug">
                    "{dayTopic.interviewTips[0]}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 🧠 DYNAMIC BRAIN FRESH-UP CARD */}
          {isBrainTask && brainTopic && (
            <div className="bg-gradient-to-br from-cyan-50/90 via-white to-cyan-50/40 border border-cyan-200 rounded-xl p-4 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-800 flex items-center gap-1.5">
                  <i className="fa-solid fa-brain text-cyan-600"></i> Today's 15-Min Neuro Drill ({brainTopic.dayName})
                </span>
                <span className="text-[10px] font-bold text-cyan-700 bg-cyan-100 px-2.5 py-0.5 rounded-full border border-cyan-200">
                  {brainTopic.category}
                </span>
              </div>
              <div className="text-xs font-bold text-bark">
                {brainTopic.title}
              </div>
              <div className="text-[11px] text-bark bg-white/80 p-2.5 rounded-lg border border-cyan-100 leading-relaxed">
                <strong>Step-by-Step Drill:</strong> {brainTopic.instruction}
              </div>
              <div className="text-[10px] text-cyan-900 bg-cyan-100/60 p-2 rounded-lg leading-tight">
                <strong>⚡ Neuro Benefit:</strong> {brainTopic.neuroBenefit}
              </div>
              {brainTopic.quickActionUrl && (
                <div className="pt-1">
                  <a
                    href={brainTopic.quickActionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                  >
                    <i className="fa-solid fa-play text-[10px]"></i>
                    <span>{brainTopic.quickActionLabel}</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* 🏛️ DYNAMIC GOVT EXAM CARD */}
          {isGovTask && (
            <div className="bg-gradient-to-br from-terra-pale via-white to-terra-pale/40 border border-terra/30 rounded-xl p-4 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-terra-dark flex items-center gap-1.5">
                  <i className="fa-solid fa-book-bookmark text-terra"></i> Govt Exam Study Focus
                </span>
                <span className="text-[10px] font-bold text-terra-dark bg-terra-pale px-2 py-0.5 rounded-full border border-terra/20">
                  High-Scoring Section
                </span>
              </div>
              <p className="text-[11px] text-bark leading-relaxed">
                Focus on high-weightage topics: Quantitative Aptitude (Percentages, Ratio, Speed Math), Reasoning patterns, Polity Articles, and Modern Indian History.
              </p>
              <div className="bg-white/80 p-2 rounded-lg border border-terra/20 text-[10px] text-bark-muted">
                💡 <strong>Exam Pro-Tip:</strong> Solve 15 timed questions under countdown pressure and immediately record wrong attempts in your Error Notebook.
              </div>
            </div>
          )}

          {/* 📖 DYNAMIC BOOK READING CARD */}
          {isReadingTask && featuredBook && (
            <div className="bg-gradient-to-br from-purple-50/90 via-white to-purple-50/40 border border-purple-200 rounded-xl p-4 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                  <i className="fa-solid fa-book-open text-purple-600"></i> Featured Book Recommendation
                </span>
                <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                  <i className="fa-solid fa-star text-[9px]"></i> {featuredBook.rating}
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-bark">{featuredBook.title}</div>
                <div className="text-[10px] font-semibold text-purple-700">by {featuredBook.author}</div>
              </div>
              <div className="text-[11px] text-bark bg-white/80 p-2.5 rounded-lg border border-purple-100 leading-relaxed">
                <strong>Core Life Lesson:</strong> {featuredBook.lifeLesson}
              </div>
              <div className="pt-1">
                <a
                  href={featuredBook.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-xs"
                >
                  <i className="fa-brands fa-amazon"></i>
                  <span>View on Amazon</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
                </a>
              </div>
            </div>
          )}

          {/* 🌙 DYNAMIC SLEEP GOAL CARD */}
          {isSleepTask && (
            <div className="bg-gradient-to-br from-mint-pale via-white to-mint-pale/40 border border-mint/30 rounded-xl p-4 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-mint flex items-center gap-1.5">
                  <i className="fa-solid fa-bed"></i> 5.5 Hours Sleep Protocol
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                  Target: 12:30 AM Bedtime
                </span>
              </div>
              <p className="text-[11px] text-bark leading-relaxed">
                Asleep by 12:30 AM to hit your 5.5-hour sleep target and wake up naturally sharp at 6:00 AM. Complete darkness and cool room temperature maximize deep REM memory consolidation.
              </p>
            </div>
          )}

          {/* Key Pro-Tips & Strategy */}
          {task.tips && task.tips.length > 0 && (
            <div>
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-bark-muted mb-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-list-check text-emerald-600"></i> Execution Strategy & Checklist
              </h4>
              <ul className="space-y-1.5 bg-cream/40 border border-cream-deep p-3 rounded-xl">
                {task.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[11px] text-bark leading-snug">
                    <i className="fa-solid fa-check text-emerald-600 text-[10px] mt-0.5 flex-shrink-0"></i>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Expected Outcome */}
          {task.outcome && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-0.5 flex items-center gap-1.5">
                <i className="fa-solid fa-trophy text-emerald-600"></i> Daily Milestone Result:
              </div>
              <p className="text-[11px] text-bark font-medium leading-snug">
                {task.outcome}
              </p>
            </div>
          )}
        </div>

        {/* Footer with Track button */}
        <div className="px-5 py-3.5 border-t border-cream-deep bg-cream/30 flex items-center justify-between flex-shrink-0">
          <div className="text-[11px] text-bark-light">
            {task.trackable ? (
              <span className={isDone ? "text-emerald-700 font-bold" : "text-bark-muted"}>
                <i className={`fa-solid ${isDone ? "fa-circle-check" : "fa-circle-dot"} mr-1`}></i>
                {isDone ? "Marked as Done" : "Trackable Daily Habit"}
              </span>
            ) : (
              <span>Routine Schedule Milestone</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {task.trackable && onToggle && (
              <button
                onClick={() => {
                  onToggle(task.key);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${isDone ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"}`}
              >
                <i className={`fa-solid ${isDone ? "fa-check" : "fa-plus"}`}></i>
                <span>{isDone ? "Completed" : "Mark Done"}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-bark text-cream rounded-xl text-xs font-semibold hover:bg-bark/90"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
