import { useState, useEffect, useRef } from "react";
import { playCompletionChime } from "../soundEngine";

const RESCUE_OPTIONS = [
  {
    id: "mern_pattern",
    track: "mern",
    subjectId: "sub_1",
    subjectName: "Step 1: Learn the Basics (JS & Core Striver)",
    topicName: "15-Min Striver DSA Logic & Pattern Breakdown",
    title: "💻 1 Striver DSA Pattern Breakdown",
    subtitle: "High-yield coding logic without fatigue",
    desc: "Pick 1 pattern (e.g. Two Pointers, Frequency Map, Sliding Window). Read the intuition, visualize the dry run, and memorize the time complexity.",
    icon: "fa-code",
    color: "from-indigo-600 to-purple-600",
    bgLight: "bg-indigo-50 border-indigo-200 text-indigo-900",
  },
  {
    id: "gov_formulas",
    track: "gov",
    subjectId: "sub_1",
    subjectName: "Quantitative Aptitude",
    topicName: "15-Min Speed Math & Formula Flash Recall",
    title: "🏛️ 10 Speed Math & GS Flash Formulas",
    subtitle: "Quick speed calculation drills",
    desc: "Practice 10 speed math calculation tricks (percentages, square roots, ratio multipliers) and recite 5 Indian Polity Articles.",
    icon: "fa-bolt",
    color: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50 border-amber-200 text-amber-900",
  },
  {
    id: "life_reset",
    track: "life",
    subjectId: "clean_room",
    subjectName: "🧹 Clean & Organize Bedroom",
    topicName: "Make Bed & Tidy Desk Workstation",
    title: "🧹 15-Min Room Tidy & Mental Reset",
    subtitle: "Clear physical clutter to clear mental fog",
    desc: "Clear your desk, organize notes, make your bed, and take 10 deep belly breaths. A clean room instantly lowers cortisol.",
    icon: "fa-broom",
    color: "from-teal-600 to-emerald-600",
    bgLight: "bg-teal-50 border-teal-200 text-teal-900",
  },
];

export default function EmergencyRescueModal({ isOpen, onClose, onSaveRescueSession, showToast }) {
  const [selectedOption, setSelectedOption] = useState(RESCUE_OPTIONS[0]);
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            playCompletionChime();
            handleCompleteRescue();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  if (!isOpen) return null;

  const handleCompleteRescue = async () => {
    try {
      await onSaveRescueSession({
        track: selectedOption.track,
        subjectId: selectedOption.subjectId,
        subjectName: selectedOption.subjectName,
        topicName: selectedOption.topicName,
        minutes: 15,
        notes: "⚡ 15-Minute Emergency Day-Rescue Sprint Completed!",
        confidence: "moderate",
      });
      showToast?.("🎉 15-Min Rescue Complete! Daily Streak Saved!", "success");
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div
      className="modal-overlay fixed inset-0 z-[110] bg-bark/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !timerRunning) onClose();
      }}
    >
      <div className="modal-panel bg-white w-full max-w-xl rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 border border-amber-300 relative overflow-hidden">
        {/* Glowing top strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600"></div>

        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-cream-deep pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center text-lg font-black shadow-md flex-shrink-0 animate-bounce">
              <i className="fa-solid fa-bolt-lightning"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-base sm:text-lg text-bark">
                  15-Minute Emergency Day Rescue
                </h2>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 uppercase">
                  Streak Saver
                </span>
              </div>
              <p className="text-xs text-bark-muted mt-0.5">
                Busy, tired, or low motivation? 15 minutes of low-friction focus rescues your momentum and proves 15m &gt; 0m.
              </p>
            </div>
          </div>

          {!timerRunning && (
            <button
              type="button"
              onClick={onClose}
              className="text-bark-light hover:text-bark text-xs font-black p-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* 3 Quick Rescue Presets */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-bark-muted">
            1. Select 1 Low-Friction Mission:
          </label>
          <div className="grid grid-cols-1 gap-2">
            {RESCUE_OPTIONS.map((opt) => {
              const isSelected = selectedOption.id === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    if (!timerRunning) setSelectedOption(opt);
                  }}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? `${opt.bgLight} border-amber-500 shadow-xs scale-[1.01]`
                      : "bg-white border-cream-deep hover:bg-cream/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${opt.color} text-white flex items-center justify-center text-xs flex-shrink-0 shadow-2xs`}
                    >
                      <i className={`fa-solid ${opt.icon}`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-bark flex items-center justify-between">
                        <span>{opt.title}</span>
                        {isSelected && (
                          <span className="text-[10px] font-black text-amber-700 uppercase">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-bark-muted leading-relaxed mt-1">
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timer Box */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
              <i className="fa-solid fa-hourglass-start"></i>
              <span>Anti-Laziness Micro Sprint</span>
            </div>
            <div className="font-mono font-black text-3xl text-white mt-0.5">
              {formatTimer(secondsLeft)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!timerRunning ? (
              <button
                type="button"
                onClick={() => setTimerRunning(true)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-play"></i>
                <span>Start 15m Sprint</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setTimerRunning(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                <i className="fa-solid fa-pause"></i>
                <span>Pause</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCompleteRescue}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              title="Already completed offline? Log directly"
            >
              1-Click Mark Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
