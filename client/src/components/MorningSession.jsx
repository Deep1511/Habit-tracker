import { useState, useEffect, useRef } from "react";
import {
  MORNING_SESSION_PROTOCOL,
  CARDIO_ROUTINE_DATA,
} from "../scheduleData";
import {
  playIntervalBeep,
  playCompletionChime,
  playCountdownTick,
} from "../soundEngine";

export default function MorningSession({
  todayStr,
  dayData,
  onToggleHabit,
  showToast,
}) {
  const [activeTab, setActiveTab] = useState("timeline"); // 'timeline' | 'cardio' | 'timer' | 'drinks'
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState("cardio_circuit");
  const [activeCircuitIndex, setActiveCircuitIndex] = useState(0);

  // ── Guided Workout Timer State ──
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timerStepIndex, setTimerStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // starts with 5 min warm-up

  // Generate sequence of steps for the 30-min cardio routine
  const timerSteps = useRef([
    {
      name: "Warm-up Walk",
      emoji: "🚶‍♂️",
      type: "work",
      duration: 300, // 5 mins
      target: "Joints & Blood Flow",
      cue: "Walk at a comfortable, easy pace. Roll shoulders back gently.",
    },
    {
      name: "Power Walking",
      emoji: "🏃‍♂️💨",
      type: "work",
      duration: 600, // 10 mins
      target: "Chest & Shoulders",
      cue: "Pump arms vigorously at 90°! Squeeze chest on each swing.",
    },
    // Round 1
    {
      name: "Round 1: Jumping Jacks",
      emoji: "🤸‍♂️",
      type: "work",
      duration: 45,
      target: "Overall Body Fat & Chest Opening",
      cue: "Clap arms overhead with a chest squeeze. Soft knees landing.",
    },
    {
      name: "Rest / Recover",
      emoji: "💧",
      type: "rest",
      duration: 15,
      target: "Deep Nasal Breathing",
      cue: "Catch breath, shake legs, prepare for High Knees.",
    },
    {
      name: "Round 1: High Knees",
      emoji: "🦵⚡",
      type: "work",
      duration: 45,
      target: "Lower Belly Fat & Deep Core",
      cue: "Drive knees up to hip height! Stay light on your toes.",
    },
    {
      name: "Rest / Recover",
      emoji: "💧",
      type: "rest",
      duration: 15,
      target: "Deep Nasal Breathing",
      cue: "Breathe deep. Shadow boxing is next!",
    },
    {
      name: "Round 1: Shadow Boxing",
      emoji: "🥊🔥",
      type: "work",
      duration: 45,
      target: "Belly Fat Twists & Chest Toning",
      cue: "Throw snappy 1-2 punches. Twist hips aggressively to burn belly fat!",
    },
    {
      name: "Rest / Recover",
      emoji: "💧",
      type: "rest",
      duration: 15,
      target: "Deep Nasal Breathing",
      cue: "Catch breath. Standing Side Crunches next.",
    },
    {
      name: "Round 1: Standing Side Crunches",
      emoji: "🥋💥",
      type: "work",
      duration: 45,
      target: "Love Handles & Obliques",
      cue: "Bring elbow down to meet rising knee. Pinch the side oblique!",
    },
    {
      name: "Rest / Circuit Halfway",
      emoji: "💧",
      type: "rest",
      duration: 15,
      target: "Halfway Checkpoint",
      cue: "Great job! Round 2 starts now with Jumping Jacks.",
    },
    // Round 2
    {
      name: "Round 2: Jumping Jacks",
      emoji: "🤸‍♂️",
      type: "work",
      duration: 45,
      target: "Overall Fat Burn & Chest",
      cue: "Maintain rhythm! Wide overhead reach, soft toe bounce.",
    },
    {
      name: "Rest / Recover",
      emoji: "💧",
      type: "rest",
      duration: 15,
      target: "Deep Nasal Breathing",
      cue: "Breathe in 4s, out 4s. High Knees coming up!",
    },
    {
      name: "Round 2: High Knees",
      emoji: "🦵⚡",
      type: "work",
      duration: 45,
      target: "Lower Belly Fat Burn",
      cue: "Keep knees high! Push through the core burn!",
    },
    {
      name: "Rest / Recover",
      emoji: "💧",
      type: "rest",
      duration: 15,
      target: "Deep Nasal Breathing",
      cue: "Get into boxer stance. Fast punches next!",
    },
    {
      name: "Round 2: Shadow Boxing",
      emoji: "🥊🔥",
      type: "work",
      duration: 45,
      target: "Belly Twists & Chest Sculpt",
      cue: "Fast snappy punches! Rotate torso fully on every cross!",
    },
    {
      name: "Rest / Recover",
      emoji: "💧",
      type: "rest",
      duration: 15,
      target: "Deep Nasal Breathing",
      cue: "Final circuit drill: Standing Side Crunches!",
    },
    {
      name: "Round 2: Standing Side Crunches",
      emoji: "🥋💥",
      type: "work",
      duration: 45,
      target: "Love Handles & Waist Contour",
      cue: "Maximum squeeze on the oblique at the top of each rep!",
    },
    {
      name: "Rest / Transition to Floor",
      emoji: "🧱",
      type: "rest",
      duration: 15,
      target: "Floor Mat Transition",
      cue: "Drop to forearms on the floor for the Plank Finisher!",
    },
    // Plank Finisher (3 sets)
    {
      name: "The Plank Finisher (Set 1)",
      emoji: "🧘‍♂️🧱",
      type: "work",
      duration: 45,
      target: "Deep Core & Flat Belly",
      cue: "Straight line from crown to heels. Pull navel tight to spine!",
    },
    {
      name: "Plank Rest",
      emoji: "💧",
      type: "rest",
      duration: 15,
      target: "Spine Relaxation",
      cue: "Drop knees, relax lower back for 15s.",
    },
    {
      name: "The Plank Finisher (Set 2)",
      emoji: "🧘‍♂️🧱",
      type: "work",
      duration: 45,
      target: "Transversus Abdominis",
      cue: "Squeeze glutes hard! Zero sagging hips.",
    },
    {
      name: "Plank Rest",
      emoji: "💧",
      type: "rest",
      duration: 15,
      target: "Spine Relaxation",
      cue: "Drop knees, deep breath.",
    },
    {
      name: "The Plank Finisher (Final Burn)",
      emoji: "🧘‍♂️🧱",
      type: "work",
      duration: 45,
      target: "Core Lock & Tight Waist",
      cue: "Hold steady! Last 45 seconds of intense core tension!",
    },
    {
      name: "Rest / Stand Up",
      emoji: "🌬️",
      type: "rest",
      duration: 15,
      target: "Stand Up Slowly",
      cue: "Stand up slowly, shake out muscles for the cool down.",
    },
    // Cool Down
    {
      name: "Cool Down & Heart Rate Reset",
      emoji: "🌬️🧘",
      type: "work",
      duration: 120, // 2 mins
      target: "Parasympathetic Recovery",
      cue: "Slow stroll. Deep 4-7-8 breathing. Interlace hands behind back to stretch chest.",
    },
  ]).current;

  const currentStep = timerSteps[timerStepIndex] || timerSteps[0];

  // Timer Tick Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Interval completed
            const nextIdx = timerStepIndex + 1;
            if (nextIdx < timerSteps.length) {
              setTimerStepIndex(nextIdx);
              const nextStep = timerSteps[nextIdx];
              if (soundEnabled) {
                playIntervalBeep(nextStep.type === "rest");
              }
              if (showToast) {
                showToast(
                  `${nextStep.emoji} ${nextStep.name} (${nextStep.duration}s)`,
                  nextStep.type === "work" ? "success" : "info"
                );
              }
              return nextStep.duration;
            } else {
              // Entire routine finished!
              setIsTimerRunning(false);
              if (soundEnabled) playCompletionChime();
              if (showToast) {
                showToast(
                  "🏆 30-Minute Belly & Chest Cardio Routine COMPLETE! Outstanding work!",
                  "success"
                );
              }
              return 0;
            }
          }

          // Countdown sound on 3, 2, 1 seconds
          if (prev <= 4 && prev > 1 && soundEnabled) {
            playCountdownTick();
          }

          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerStepIndex, soundEnabled, timerSteps, showToast]);

  const toggleWorkoutTimer = () => {
    if (!isTimerRunning) {
      if (soundEnabled) playIntervalBeep(currentStep.type === "rest");
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const skipStep = (direction = 1) => {
    const nextIdx = Math.max(
      0,
      Math.min(timerSteps.length - 1, timerStepIndex + direction)
    );
    setTimerStepIndex(nextIdx);
    setTimeLeft(timerSteps[nextIdx].duration);
    if (soundEnabled) playIntervalBeep(timerSteps[nextIdx].type === "rest");
  };

  const resetWorkoutTimer = () => {
    setIsTimerRunning(false);
    setTimerStepIndex(0);
    setTimeLeft(timerSteps[0].duration);
  };

  // Format time MM:SS
  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Completion calculation for today's morning protocol
  const habits = dayData?.habits || {};
  const completedMorningCount = MORNING_SESSION_PROTOCOL.filter(
    (item) => habits[item.key]
  ).length;

  return (
    <section
      id="morning-session-section"
      className="bg-white rounded-2xl border border-cream-deep p-4 sm:p-5 shadow-sm transition-all"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cream-deep/70">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center text-white shadow-sm flex-shrink-0 text-lg">
            🌅
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-bold text-lg text-bark leading-tight">
                Morning Session & Cardio Routine
              </h2>
              <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                5:00 AM – 8:30 AM Protocol
              </span>
            </div>
            <p className="text-xs text-bark-muted mt-0.5">
              5:00 AM Awakening • 5:30 AM – 6:30 AM Outdoor Running Outside Home • Shower & Pooja • 70-min Striver DSA Prime Focus
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Progress pill */}
          <div className="flex items-center gap-1.5 bg-cream/70 border border-cream-deep px-2.5 py-1 rounded-lg text-xs font-bold text-bark">
            <i className="fa-solid fa-circle-check text-emerald-600"></i>
            <span>
              {completedMorningCount} / {MORNING_SESSION_PROTOCOL.length} Done
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveTab("timer");
              setIsExpanded(true);
            }}
            className="px-3 py-1.5 bg-gradient-to-r from-terra to-orange-600 hover:from-terra-dark hover:to-orange-700 text-white text-xs font-black rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <i className="fa-solid fa-stopwatch"></i>
            <span>Start Outdoor Run Timer</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg border border-cream-deep text-bark-muted hover:text-bark hover:bg-cream/60 transition-colors cursor-pointer"
            title={isExpanded ? "Collapse Section" : "Expand Section"}
          >
            <i
              className={`fa-solid ${
                isExpanded ? "fa-chevron-up" : "fa-chevron-down"
              } text-xs`}
            ></i>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-5">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-cream-deep/60">
            <button
              onClick={() => setActiveTab("timeline")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer flex-shrink-0 ${
                activeTab === "timeline"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-cream/60 text-bark-muted hover:text-bark hover:bg-cream"
              }`}
            >
              <span>🌅 Morning Timetable</span>
              <span className="text-[10px] opacity-80">5 Activities</span>
            </button>

            <button
              onClick={() => setActiveTab("cardio")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer flex-shrink-0 ${
                activeTab === "cardio"
                  ? "bg-terra text-white shadow-xs"
                  : "bg-cream/60 text-bark-muted hover:text-bark hover:bg-cream"
              }`}
            >
              <span>🏃‍♂️ Outdoor Running Cardio</span>
              <span className="text-[10px] opacity-80">5:30 AM Outside</span>
            </button>

            <button
              onClick={() => setActiveTab("timer")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer flex-shrink-0 ${
                activeTab === "timer"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-cream/60 text-bark-muted hover:text-bark hover:bg-cream"
              }`}
            >
              <i className="fa-solid fa-play text-[10px]"></i>
              <span>⏱️ Guided Workout Timer</span>
              {isTimerRunning && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("drinks")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer flex-shrink-0 ${
                activeTab === "drinks"
                  ? "bg-teal-700 text-white shadow-xs"
                  : "bg-cream/60 text-bark-muted hover:text-bark hover:bg-cream"
              }`}
            >
              <span>💧 Drink Blueprint</span>
              <span className="text-[10px] opacity-80">Hydration Rules</span>
            </button>
          </div>

          {/* ════════════════════════════════════════════════════════════
              TAB 1: MORNING TIMETABLE & HYDRATION TABLE
          ════════════════════════════════════════════════════════════ */}
          {activeTab === "timeline" && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">☀️</span>
                  <div>
                    <h4 className="text-xs font-black text-amber-950">
                      Early Morning High-Focus Architecture
                    </h4>
                    <p className="text-[11px] text-amber-800">
                      Designed to give you 145 minutes of elite deep study and a 30-min fat burn before the rest of the world wakes up.
                    </p>
                  </div>
                </div>
                <div className="text-xs font-black text-amber-900 bg-white/80 px-2.5 py-1 rounded-md border border-amber-200/80">
                  Wake Up: 4:30 AM ⏰
                </div>
              </div>

              {/* Table / Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {MORNING_SESSION_PROTOCOL.map((item) => {
                  const isDone = !!habits[item.key];
                  return (
                    <div
                      key={item.id}
                      className={`relative rounded-xl border p-3.5 transition-all flex flex-col justify-between ${
                        isDone
                          ? "bg-emerald-50/50 border-emerald-300/80 shadow-2xs"
                          : "bg-cream/30 border-cream-deep hover:border-indigo-200 hover:shadow-xs"
                      }`}
                    >
                      <div>
                        {/* Time & Badge */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-display font-black text-xs text-bark bg-white px-2 py-0.5 rounded-md border border-cream-deep shadow-2xs">
                            {item.time}
                          </span>
                          <span className="text-[10px] font-bold text-bark-muted bg-white/80 px-2 py-0.5 rounded-full border border-cream-deep/60">
                            {item.durMins} min
                          </span>
                        </div>

                        {/* Title & Emojis */}
                        <div className="flex items-start gap-2 mb-1.5">
                          <span className="text-lg flex-shrink-0 leading-tight">
                            {item.emojis.split(" ")[0]}
                          </span>
                          <h3
                            className={`font-bold text-xs leading-snug ${
                              isDone
                                ? "line-through text-bark-muted"
                                : "text-bark"
                            }`}
                          >
                            {item.title}
                          </h3>
                        </div>

                        {/* Activity description */}
                        <p className="text-[11px] text-bark-muted leading-relaxed mb-3">
                          {item.activity}
                        </p>

                        {/* What to Drink Box */}
                        <div className="bg-white rounded-lg p-2.5 border border-cream-deep/80 mb-3 space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-indigo-700">
                            <i className="fa-solid fa-mug-hot text-[9px]"></i>
                            <span>What to Drink:</span>
                          </div>
                          <div className="text-xs font-bold text-bark flex items-center gap-1.5">
                            <span className="text-sm">
                              {item.id === "study_session_1"
                                ? "☕"
                                : item.id === "cardio_workout"
                                ? "🚫"
                                : item.id === "study_session_2"
                                ? "🥥"
                                : "💧"}
                            </span>
                            <span>{item.drink}</span>
                          </div>
                          <p className="text-[10px] text-bark-muted/90 italic leading-snug">
                            {item.drinkDetails}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Checkbox & Action Button */}
                      <div className="pt-2 border-t border-cream-deep/60 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            if (onToggleHabit) onToggleHabit(todayStr, item.key);
                            if (showToast) {
                              showToast(
                                `${item.emojis.split(" ")[0]} ${item.title} ${
                                  !isDone ? "marked Done! 🎯" : "unchecked"
                                }`,
                                !isDone ? "success" : "info"
                              );
                            }
                          }}
                          className={`flex items-center gap-2 text-xs font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                            isDone
                              ? "bg-emerald-600 text-white"
                              : "bg-white text-bark hover:bg-cream border border-cream-deep"
                          }`}
                        >
                          <i
                            className={`fa-solid ${
                              isDone ? "fa-circle-check" : "fa-circle text-bark-light/40"
                            }`}
                          ></i>
                          <span>{isDone ? "Completed ✓" : "Mark Done"}</span>
                        </button>

                        {item.id === "cardio_workout" && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab("timer");
                            }}
                            className="text-[11px] font-extrabold text-terra hover:text-terra-dark flex items-center gap-1 cursor-pointer"
                          >
                            <span>Open Timer</span>
                            <i className="fa-solid fa-arrow-right text-[9px]"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              TAB 2: 30-MINUTE BELLY & CHEST CARDIO ACTION GUIDE
          ════════════════════════════════════════════════════════════ */}
          {activeTab === "cardio" && (
            <div className="space-y-4">
              {/* Routine Intro Banner */}
              <div className="bg-gradient-to-br from-terra-pale to-amber-50/80 border border-terra/20 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏃</span>
                      <h3 className="font-display font-black text-sm text-terra-dark">
                        {CARDIO_ROUTINE_DATA.title}
                      </h3>
                    </div>
                    <p className="text-xs text-bark/90 leading-relaxed font-medium">
                      {CARDIO_ROUTINE_DATA.overview}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-black px-2.5 py-1 bg-terra text-white rounded-lg shadow-2xs">
                      Time: {CARDIO_ROUTINE_DATA.time}
                    </span>
                    <span className="text-[10px] font-bold text-bark-muted">
                      Total: 30 Minutes
                    </span>
                  </div>
                </div>
              </div>

              {/* 5 Phase Breakdown Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {CARDIO_ROUTINE_DATA.phases.map((p) => {
                  const isSelected = selectedPhase === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPhase(p.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-terra text-white border-terra shadow-sm"
                          : "bg-white hover:bg-cream/60 border-cream-deep text-bark"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-base">{p.emoji}</span>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-cream-dark text-bark-muted"
                          }`}
                        >
                          {p.durMins}m
                        </span>
                      </div>
                      <div
                        className={`text-xs font-bold leading-tight truncate ${
                          isSelected ? "text-white" : "text-bark"
                        }`}
                      >
                        {p.name.split("(")[0]}
                      </div>
                      <div
                        className={`text-[10px] mt-0.5 truncate ${
                          isSelected ? "text-terra-pale" : "text-bark-muted"
                        }`}
                      >
                        {p.timeRange}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Phase Detail View */}
              {(() => {
                const phase = CARDIO_ROUTINE_DATA.phases.find(
                  (p) => p.id === selectedPhase
                );
                if (!phase) return null;

                return (
                  <div className="bg-white border border-cream-deep rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
                    {/* Phase Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cream-deep/70">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{phase.emoji}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-display font-black text-sm text-bark">
                              {phase.name}
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cream-dark text-bark">
                              {phase.timeRange} ({phase.durMins} mins)
                            </span>
                          </div>
                          <p className="text-xs text-bark-muted mt-0.5">
                            {phase.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-terra-pale text-terra-dark border border-terra/20">
                          🎯 {phase.target}
                        </span>
                      </div>
                    </div>

                    {/* Circuit Exercises or Standard Exercise Actions */}
                    {phase.id === "cardio_circuit" ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-extrabold text-bark">
                            ⚡ 4 Key Fat-Burning Exercises (45s Work / 15s Rest • 2 Rounds):
                          </p>
                          <span className="text-[10px] font-bold text-terra bg-terra-pale px-2 py-0.5 rounded">
                            Total 8 Intervals
                          </span>
                        </div>

                        {/* Exercise Selector Tabs */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {phase.exercises.map((ex, idx) => (
                            <button
                              key={ex.id}
                              onClick={() => setActiveCircuitIndex(idx)}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                activeCircuitIndex === idx
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                                  : "bg-cream/40 hover:bg-cream border-cream-deep text-bark"
                              }`}
                            >
                              <div className="text-xl mb-1">{ex.emoji}</div>
                              <div className="text-xs font-bold leading-tight">
                                {ex.name}
                              </div>
                              <div
                                className={`text-[10px] mt-0.5 ${
                                  activeCircuitIndex === idx
                                    ? "text-indigo-100"
                                    : "text-bark-muted"
                                }`}
                              >
                                {ex.workSecs}s on / {ex.restSecs}s off
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Active Exercise Detailed Form Card */}
                        {(() => {
                          const activeEx = phase.exercises[activeCircuitIndex];
                          return (
                            <div className="bg-cream/30 border border-cream-deep rounded-xl p-4 space-y-3">
                              <div className="flex items-start justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-2">
                                  <span className="text-3xl">{activeEx.emoji}</span>
                                  <div>
                                    <h5 className="font-display font-black text-sm text-bark">
                                      {activeEx.name}
                                    </h5>
                                    <span className="text-[11px] font-bold text-indigo-700">
                                      🎯 Target: {activeEx.targetZone}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded">
                                    🔥 45s Work
                                  </span>
                                  <span className="text-[10px] font-black bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded">
                                    💧 15s Rest
                                  </span>
                                </div>
                              </div>

                              <div className="bg-white p-3 rounded-lg border border-cream-deep/80">
                                <div className="text-xs font-extrabold text-bark mb-1">
                                  <i className="fa-solid fa-bullseye text-terra mr-1.5"></i>
                                  Why It Works & Benefit:
                                </div>
                                <p className="text-xs text-bark/90 leading-relaxed">
                                  {activeEx.benefit}
                                </p>
                              </div>

                              <div className="space-y-1.5">
                                <div className="text-xs font-black uppercase tracking-wider text-bark-muted flex items-center gap-1.5">
                                  <i className="fa-solid fa-person-running text-indigo-600"></i>
                                  <span>Exercise Form & Action Steps:</span>
                                </div>
                                <p className="text-xs font-bold text-indigo-950 bg-indigo-50/70 border border-indigo-100 p-2.5 rounded-lg leading-relaxed">
                                  👉 {activeEx.actionCue}
                                </p>
                                <ul className="space-y-1 mt-2">
                                  {activeEx.coachingPoints.map((pt, i) => (
                                    <li
                                      key={i}
                                      className="text-xs text-bark-muted flex items-center gap-2"
                                    >
                                      <i className="fa-solid fa-check text-emerald-600 text-[10px]"></i>
                                      <span>{pt}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      /* Standard Phase Actions (Warmup, Power Walk, Plank, Cooldown) */
                      <div className="space-y-3">
                        <div className="text-xs font-black uppercase tracking-wider text-bark-muted">
                          Step-by-Step Exercise Actions:
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {phase.exerciseActions?.map((act, i) => (
                            <div
                              key={i}
                              className="bg-cream/40 border border-cream-deep/80 rounded-xl p-3 space-y-1.5"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{act.emoji}</span>
                                <h5 className="font-bold text-xs text-bark">
                                  {act.title}
                                </h5>
                              </div>
                              <p className="text-[11px] text-bark-muted leading-relaxed">
                                {act.cue}
                              </p>
                            </div>
                          ))}
                        </div>

                        {phase.formChecklist && (
                          <div className="bg-white border border-cream-deep rounded-xl p-3">
                            <div className="text-xs font-extrabold text-bark mb-1.5 flex items-center gap-1.5">
                              <i className="fa-solid fa-clipboard-check text-emerald-600"></i>
                              <span>Key Form Checklist:</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {phase.formChecklist.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="text-[11px] font-semibold text-bark-muted bg-cream/50 px-2 py-1 rounded border border-cream-deep/50 flex items-center gap-1.5"
                                >
                                  <i className="fa-solid fa-check-double text-emerald-600 text-[9px]"></i>
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              TAB 3: INTERACTIVE GUIDED WORKOUT TIMER & AUDIO COACH
          ════════════════════════════════════════════════════════════ */}
          {activeTab === "timer" && (
            <div className="space-y-4">
              {/* Workout Dashboard */}
              <div className="bg-gradient-to-br from-bark via-slate-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
                {/* Background decorative circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                      Step {timerStepIndex + 1} of {timerSteps.length}
                    </span>
                    <span className="text-xs text-slate-300">
                      30-Minute Routine Player
                    </span>
                  </div>

                  {/* Sound Toggle */}
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="self-start sm:self-auto px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <i
                      className={`fa-solid ${
                        soundEnabled ? "fa-volume-high text-emerald-400" : "fa-volume-xmark text-slate-400"
                      }`}
                    ></i>
                    <span>Sound {soundEnabled ? "On" : "Off"}</span>
                  </button>
                </div>

                {/* Main Timer Display */}
                <div className="text-center py-4 sm:py-6 space-y-3">
                  <div className="inline-block p-4 rounded-full bg-white/5 border border-white/10 shadow-inner">
                    <span className="text-5xl sm:text-6xl animate-bounce leading-none">
                      {currentStep.emoji}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-black text-xl sm:text-2xl text-white">
                      {currentStep.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span
                        className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                          currentStep.type === "work"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                        }`}
                      >
                        {currentStep.type === "work" ? "🔥 Work Phase" : "💧 Rest / Recover"}
                      </span>
                      <span className="text-xs font-bold text-slate-300">
                        🎯 {currentStep.target}
                      </span>
                    </div>
                  </div>

                  {/* Big Digital Clock */}
                  <div className="font-display font-black text-6xl sm:text-7xl tracking-tight text-amber-300 py-1 drop-shadow-md">
                    {formatTimer(timeLeft)}
                  </div>

                  {/* Form Action Cue on Screen */}
                  <p className="text-xs sm:text-sm font-medium text-slate-200 max-w-md mx-auto italic px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    "{currentStep.cue}"
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/10 rounded-full h-2 mb-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((timerStepIndex + 1) / timerSteps.length) * 100}%`,
                    }}
                  ></div>
                </div>

                {/* Controls Bar */}
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => skipStep(-1)}
                    disabled={timerStepIndex === 0}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <i className="fa-solid fa-backward-step"></i>
                    <span>Previous</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleWorkoutTimer}
                    className={`px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all ${
                      isTimerRunning
                        ? "bg-amber-500 hover:bg-amber-600 text-bark"
                        : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                    }`}
                  >
                    <i
                      className={`fa-solid ${
                        isTimerRunning ? "fa-pause" : "fa-play"
                      }`}
                    ></i>
                    <span>{isTimerRunning ? "Pause Timer" : "Start Workout"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => skipStep(1)}
                    disabled={timerStepIndex >= timerSteps.length - 1}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <span>Next</span>
                    <i className="fa-solid fa-forward-step"></i>
                  </button>

                  <button
                    type="button"
                    onClick={resetWorkoutTimer}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                    title="Reset to 0:00"
                  >
                    <i className="fa-solid fa-rotate-left"></i>
                    <span>Reset</span>
                  </button>
                </div>

                {/* Next Up Preview */}
                {timerStepIndex + 1 < timerSteps.length && (
                  <div className="mt-4 pt-3 border-t border-white/10 text-center text-xs text-slate-300">
                    <span className="text-slate-400">Next Up: </span>
                    <span className="font-bold text-white">
                      {timerSteps[timerStepIndex + 1].emoji}{" "}
                      {timerSteps[timerStepIndex + 1].name} (
                      {timerSteps[timerStepIndex + 1].duration}s)
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              TAB 4: DRINK & HYDRATION BLUEPRINT
          ════════════════════════════════════════════════════════════ */}
          {activeTab === "drinks" && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-teal-900 font-display font-black text-sm">
                  <span className="text-xl">💧</span>
                  <span>Science-Backed Morning Hydration Protocol</span>
                </div>
                <p className="text-xs text-teal-800 leading-relaxed font-medium">
                  Proper fluid timing controls brain oxygenation, gastric comfort during cardio, and neuroplasticity retention during study.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* 1. Lukewarm Water */}
                <div className="bg-white border border-cream-deep rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">💧</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      4:30 AM
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-bark">
                    1 Glass Lukewarm Water
                  </h4>
                  <p className="text-[11px] text-bark-muted leading-relaxed">
                    Awakens the gastrointestinal tract, raises internal body temperature gently, and stimulates peristalsis without gastric shock.
                  </p>
                  <div className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
                    ✓ Tip: Drink while seated. Sips should be slow and measured.
                  </div>
                </div>

                {/* 2. Black Coffee */}
                <div className="bg-white border border-cream-deep rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">☕</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                      4:45 AM
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-bark">
                    Black Coffee + Water Sips
                  </h4>
                  <p className="text-[11px] text-bark-muted leading-relaxed">
                    Zero sugar, zero dairy. Blocks adenosine receptors while cortisol naturally surges, maximizing peak memory retention during Study Session 1.
                  </p>
                  <div className="text-[10px] font-semibold text-indigo-800 bg-indigo-50 p-2 rounded border border-indigo-200">
                    ✓ Tip: Keep a water bottle nearby; alternate coffee with gradual sips.
                  </div>
                </div>

                {/* 3. Pre-Cardio Restriction */}
                <div className="bg-white border border-cream-deep rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🚫💧</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                      6:30 AM
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-bark">
                    No Large Drinks During Workout
                  </h4>
                  <p className="text-[11px] text-bark-muted leading-relaxed">
                    Chugging water before high-intensity power walking and high knees induces severe stomach sloshing and cramps. Only wet your lips if needed.
                  </p>
                  <div className="text-[10px] font-semibold text-rose-800 bg-rose-50 p-2 rounded border border-rose-200">
                    ✓ Tip: Save major hydration for immediate post-cardio recovery!
                  </div>
                </div>

                {/* 4. Coconut Water / Electrolytes */}
                <div className="bg-white border border-cream-deep rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🥥</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                      7:00 AM
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-bark">
                    Coconut Water / Electrolytes
                  </h4>
                  <p className="text-[11px] text-bark-muted leading-relaxed">
                    Replenishes potassium, sodium, and magnesium lost in sweat. Powers neuroplasticity and brain glucose uptake for Study Session 2.
                  </p>
                  <div className="text-[10px] font-semibold text-teal-800 bg-teal-50 p-2 rounded border border-teal-200">
                    ✓ Tip: Natural tender coconut water or low-sugar electrolyte mix.
                  </div>
                </div>

                {/* 5. Normal Hydration */}
                <div className="bg-white border border-cream-deep rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🚿</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                      7:40 AM+
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-bark">
                    Normal Hydration & Bath
                  </h4>
                  <p className="text-[11px] text-bark-muted leading-relaxed">
                    Shower reduces core body temperature and promotes vasodilation. Follow with normal room-temperature hydration for stable daytime energy.
                  </p>
                  <div className="text-[10px] font-semibold text-blue-800 bg-blue-50 p-2 rounded border border-blue-200">
                    ✓ Tip: Finish shower with 30s cold water splash for a noradrenaline surge.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
