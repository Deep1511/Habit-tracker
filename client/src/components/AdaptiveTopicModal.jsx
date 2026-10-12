import { useState, useEffect } from "react";
import {
  CURRICULUM_45_DAYS,
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
  const [selectedDayNum, setSelectedDayNum] = useState(1);
  const [coreProblem, setCoreProblem] = useState("");
  const [actualDsa, setActualDsa] = useState("");
  const [actualNotes, setActualNotes] = useState("");
  const [pushToTomorrow, setPushToTomorrow] = useState(false);
  const [setAsGlobalDay, setSetAsGlobalDay] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const overrides = getTopicOverrides();
    const existing = overrides[dateStr];

    if (existing) {
      setCoreProblem(existing.coreProblem || existing.actualDsa || currentTopic?.coreProblem || "");
      setActualDsa(existing.actualDsa || currentTopic?.dsa || "");
      setActualNotes(existing.actualNotes || "");
      setPushToTomorrow(existing.pushedScheduledToTomorrow === true);
    } else {
      setCoreProblem(currentTopic?.coreProblem || "");
      setActualDsa(currentTopic?.originalDsa || currentTopic?.dsa || "");
      setActualNotes("");
      setPushToTomorrow(false);
    }

    // Detect which dayNum currentTopic matches
    if (currentTopic?.dayNum) {
      setSelectedDayNum(currentTopic.dayNum);
    } else {
      setSelectedDayNum(1);
    }
  }, [isOpen, dateStr, currentTopic]);

  if (!isOpen) return null;

  // Handle changing Striver Day from the dropdown
  const handleSelectDay = (dayNumStr) => {
    const day = parseInt(dayNumStr, 10);
    setSelectedDayNum(day);
    const dayData = CURRICULUM_45_DAYS[day];
    if (dayData) {
      setCoreProblem(dayData.coreProblem || dayData.dsaProblems?.[0] || "");
      setActualDsa(dayData.dsa || "");
      setSetAsGlobalDay(true);
    }
  };

  const handleSave = () => {
    if (!coreProblem.trim() && !actualDsa.trim()) {
      if (showToast) showToast("Please enter a Core Problem or DSA topic.", "warn");
      return;
    }

    const currentOffset = getCurriculumOffset();
    const overrides = getTopicOverrides();
    const prevHadPushed = overrides[dateStr]?.pushedScheduledToTomorrow;

    // 1. If user checked "Set as Current Striver Day", calibrate the global curriculum offset
    if (setAsGlobalDay) {
      // Calculate diffDays between dateStr and startDate (2026-10-12)
      try {
        const curParts = dateStr.split("-").map(Number);
        const curDate = new Date(curParts[0], curParts[1] - 1, curParts[2]);
        const stDate = new Date(2026, 9, 12);
        const diffDays = Math.floor((curDate - stDate) / (1000 * 60 * 60 * 24));
        // We want (diffDays + 1 - newOffset) = selectedDayNum
        // => newOffset = (diffDays + 1) - selectedDayNum
        const targetOffset = diffDays + 1 - selectedDayNum;
        setCurriculumOffset(targetOffset);
      } catch (e) {
        console.error(e);
      }
    } else if (pushToTomorrow && !prevHadPushed) {
      setCurriculumOffset(currentOffset + 1);
    } else if (!pushToTomorrow && prevHadPushed) {
      setCurriculumOffset(Math.max(0, currentOffset - 1));
    }

    // 2. Save custom override for this specific date
    saveTopicOverride(dateStr, {
      coreProblem: coreProblem.trim(),
      actualDsa: actualDsa.trim() || coreProblem.trim(),
      actualNotes: actualNotes.trim(),
      pushedScheduledToTomorrow: pushToTomorrow,
      actualFolder: CURRICULUM_45_DAYS[selectedDayNum]?.striverFolder || "Custom DSA Topic",
    });

    if (showToast) {
      showToast(
        setAsGlobalDay
          ? `✓ Updated to Striver Day ${selectedDayNum}: "${coreProblem}"!`
          : "✓ Updated DSA topic & core problem successfully!",
        "success"
      );
    }
    onClose();
  };

  const handleResetToDefault = () => {
    saveTopicOverride(dateStr, null);
    setCurriculumOffset(0);

    if (showToast) {
      showToast("Reset roadmap to Striver Day 1 defaults.", "info");
    }
    onClose();
  };

  return (
    <div
      className="modal-overlay fixed inset-0 z-[110] bg-bark/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-cream-deep flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-indigo-900 via-stone-900 to-indigo-950 text-white flex items-start justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-lg text-amber-300">
              ✏️
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                DSA Topic &amp; Problem Editor
              </span>
              <h2 className="font-display font-black text-base sm:text-lg text-white">
                Edit Today's Scheduled Problem ({dateStr})
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
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-bark">
          {/* 1. Quick Striver Day Selector Dropdown */}
          <div className="bg-gradient-to-br from-indigo-50/90 to-purple-50/60 border border-indigo-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                <i className="fa-solid fa-graduation-cap text-indigo-600"></i>
                <span>Jump to Striver Chapter / Day:</span>
              </label>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                Current: Day {selectedDayNum}
              </span>
            </div>

            <select
              value={selectedDayNum}
              onChange={(e) => handleSelectDay(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white font-bold text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 cursor-pointer"
            >
              {Object.keys(CURRICULUM_45_DAYS).map((dNum) => {
                const item = CURRICULUM_45_DAYS[dNum];
                return (
                  <option key={dNum} value={dNum}>
                    Day {dNum}: {item.striverFolder || item.badge} – {item.coreProblem}
                  </option>
                );
              })}
            </select>

            <label className="flex items-center gap-2 pt-1 text-[11px] font-bold text-indigo-900 cursor-pointer">
              <input
                type="checkbox"
                checked={setAsGlobalDay}
                onChange={(e) => setSetAsGlobalDay(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Set this day as my current active starting point for the whole roadmap</span>
            </label>
          </div>

          {/* 2. Editable Core Problem Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-star text-amber-500"></i>
                <span>⭐ Core Problem to Solve Today (Edit directly):</span>
              </span>
              <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                Just 1 Problem
              </span>
            </label>
            <input
              type="text"
              value={coreProblem}
              onChange={(e) => setCoreProblem(e.target.value)}
              placeholder="e.g. Pattern 7 & 8: Star Pyramid & Inverted Pyramid"
              className="w-full px-3.5 py-2.5 rounded-xl border border-cream-deep focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs font-bold text-slate-900 bg-white shadow-2xs"
            />
          </div>

          {/* 3. Editable Topic Title / Striver Module */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <i className="fa-solid fa-code text-indigo-600"></i>
              <span>DSA Module / Topic Title:</span>
            </label>
            <input
              type="text"
              value={actualDsa}
              onChange={(e) => setActualDsa(e.target.value)}
              placeholder="e.g. Step 1.1–1.2: Logic Building, Star/Number Patterns"
              className="w-full px-3.5 py-2.5 rounded-xl border border-cream-deep focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs font-medium text-bark bg-white"
            />
          </div>

          {/* 4. Notes or Videos Watched (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <i className="fa-solid fa-pen-to-square text-emerald-600"></i>
              <span>Study Notes / Video Link / iPad Tracing (Optional):</span>
            </label>
            <textarea
              rows={2}
              value={actualNotes}
              onChange={(e) => setActualNotes(e.target.value)}
              placeholder="e.g. Watched Striver Video 4 & 5, dry-ran loop index on iPad"
              className="w-full px-3.5 py-2 rounded-xl border border-cream-deep focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs font-medium text-bark bg-white resize-none"
            />
          </div>

          {/* 5. Push Option (If didn't finish today) */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={pushToTomorrow}
                onChange={(e) => setPushToTomorrow(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
              />
              <div>
                <span className="font-extrabold text-xs text-stone-900">
                  ⏩ Push unfinished scheduled topic to tomorrow (+1 Day Shift)
                </span>
                <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                  Check this if you studied different videos today and want tomorrow to pick up today's scheduled topic.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 bg-cream/40 border-t border-cream-deep flex items-center justify-between gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
            title="Reset to Day 1 default Striver roadmap"
          >
            Reset to Day 1
          </button>

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
              <span>Save &amp; Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
