import { useState, useEffect } from "react";
import {
  getTopicOverrides,
  saveTopicOverride,
  getCurriculumOffset,
  setCurriculumOffset,
} from "../scheduleData";

export default function AdaptiveTopicModal({
  isOpen,
  onClose,
  dateStr,
  currentTopic,
  showToast,
}) {
  const [actualDsa, setActualDsa] = useState("");
  const [actualNotes, setActualNotes] = useState("");
  const [pushToTomorrow, setPushToTomorrow] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const overrides = getTopicOverrides();
    const existing = overrides[dateStr];
    if (existing) {
      setActualDsa(existing.actualDsa || "");
      setActualNotes(existing.actualNotes || "");
      setPushToTomorrow(existing.pushedScheduledToTomorrow !== false);
    } else {
      setActualDsa("");
      setActualNotes("");
      setPushToTomorrow(true);
    }
  }, [isOpen, dateStr]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!actualDsa.trim() && !actualNotes.trim()) {
      if (showToast) showToast("Please write what video/topic you studied today.", "warn");
      return;
    }

    const currentOffset = getCurriculumOffset();
    const overrides = getTopicOverrides();
    const prevHadPushed = overrides[dateStr]?.pushedScheduledToTomorrow;

    // Save override for this date
    saveTopicOverride(dateStr, {
      actualDsa: actualDsa.trim(),
      actualNotes: actualNotes.trim(),
      pushedScheduledToTomorrow: pushToTomorrow,
      actualFolder: "My Custom Logged Progress",
    });

    // If user toggled pushToTomorrow and it wasn't pushed before, increment offset
    if (pushToTomorrow && !prevHadPushed) {
      setCurriculumOffset(currentOffset + 1);
    } else if (!pushToTomorrow && prevHadPushed) {
      setCurriculumOffset(Math.max(0, currentOffset - 1));
    }

    if (showToast) {
      showToast(
        pushToTomorrow
          ? "✓ Logged today's study & pushed scheduled topic to tomorrow! Roadmap shifted smoothly."
          : "✓ Logged today's actual study progress!",
        "success"
      );
    }
    onClose();
  };

  const handleResetToDefault = () => {
    const overrides = getTopicOverrides();
    const wasPushed = overrides[dateStr]?.pushedScheduledToTomorrow;
    const currentOffset = getCurriculumOffset();

    saveTopicOverride(dateStr, null);
    if (wasPushed) {
      setCurriculumOffset(Math.max(0, currentOffset - 1));
    }

    if (showToast) {
      showToast("Restored default curriculum schedule for today.", "info");
    }
    onClose();
  };

  const quickPills = [
    "Watched 2 Striver Pattern Videos & Syntax",
    "Watched Striver Video 4 & 5: Patterns 10-14",
    "Basic Maths: Count Digits & Reverse Number",
    "Dry-ran loop logic on iPad with sample array",
  ];

  const originalTargetName =
    currentTopic?.originalDsa || currentTopic?.dsa || "Scheduled DSA Topic";

  return (
    <div
      className="modal-overlay fixed inset-0 z-[110] bg-bark/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-cream-deep flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-indigo-900 via-stone-900 to-indigo-950 text-white flex items-start justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-lg text-amber-300">
              📝
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                Adaptive Study Engine
              </span>
              <h2 className="font-display font-black text-base sm:text-lg text-white">
                Log What You Watched &amp; Push Topic
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4.5 text-xs text-bark">
          {/* Current Scheduled Topic Card */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <i className="fa-solid fa-calendar-day text-amber-600"></i>
              <span>Originally Scheduled for {dateStr}:</span>
            </div>
            <div className="font-extrabold text-sm text-amber-950 leading-snug">
              {originalTargetName}
            </div>
            {currentTopic?.striverFolder && (
              <div className="text-[10px] text-amber-800">
                📁 <strong>Striver Sheet:</strong> {currentTopic.striverFolder}
              </div>
            )}
          </div>

          {/* Input: What did you actually watch / do? */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <i className="fa-solid fa-video text-indigo-600"></i>
              <span>What video(s) or topic did you actually study today?</span>
            </label>
            <input
              type="text"
              value={actualDsa}
              onChange={(e) => setActualDsa(e.target.value)}
              placeholder="e.g. Watched 2 Striver videos: Patterns 10-14 & Syntax"
              className="w-full px-3.5 py-2.5 rounded-xl border border-cream-deep focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs font-medium text-bark bg-white"
            />

            {/* Quick Pills */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-slate-400 font-bold">Quick fill:</span>
              {quickPills.map((pill, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActualDsa(pill)}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 hover:bg-indigo-50 hover:text-indigo-700 text-stone-700 border border-stone-200 transition-colors cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Input: Notes / iPad Tracing (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <i className="fa-solid fa-pen-to-square text-emerald-600"></i>
              <span>Key notes or iPad tracings (Optional):</span>
            </label>
            <textarea
              rows={2}
              value={actualNotes}
              onChange={(e) => setActualNotes(e.target.value)}
              placeholder="e.g. Traced outer loop row index on iPad, wrote 1 sample dry-run"
              className="w-full px-3.5 py-2 rounded-xl border border-cream-deep focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs font-medium text-bark bg-white resize-none"
            />
          </div>

          {/* The Push to Tomorrow Option (Feasible Schedule Shift) */}
          <div className="bg-gradient-to-br from-indigo-50/90 to-purple-50/70 border-2 border-indigo-200 rounded-2xl p-4 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={pushToTomorrow}
                onChange={(e) => setPushToTomorrow(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
              />
              <div>
                <span className="font-black text-xs text-indigo-950 flex items-center gap-1.5">
                  <span>⏩ Push scheduled topic to tomorrow (+1 Day Shift)</span>
                  <span className="px-1.5 py-0.2 rounded bg-indigo-600 text-white text-[9px] font-extrabold">
                    RECOMMENDED
                  </span>
                </span>
                <p className="text-[11px] text-indigo-900/80 mt-0.5 leading-relaxed">
                  <strong>Zero guilt!</strong> Tomorrow will automatically take today's scheduled topic (<em>{originalTargetName}</em>). The whole 45-day syllabus shifts forward smoothly so you never miss any concept!
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 bg-cream/40 border-t border-cream-deep flex items-center justify-between gap-2 flex-wrap">
          <div>
            {currentTopic?.isCustomLogged && (
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
              >
                Reset to Default
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-cream-deep text-xs font-bold text-bark hover:bg-cream transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <i className="fa-solid fa-check"></i>
              <span>Save Progress &amp; Adjust</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
