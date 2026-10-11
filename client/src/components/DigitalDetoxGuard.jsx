import { useState, useEffect, useRef } from "react";
import {
  playCompletionChime,
  playIntervalBeep,
  playBrownNoise,
  stopAmbientSound,
} from "../soundEngine";

export default function DigitalDetoxGuard({
  todayStr,
  dayData = {},
  onToggleHabit,
  showToast,
}) {
  const habits = dayData.habits || {};
  const isNoInstagramChecked = !!habits.noInstagram || !!habits.screenTimeDetox;

  // Stored screen time in local storage or dayData
  const [screenMinutes, setScreenMinutes] = useState(() => {
    const cached = localStorage.getItem(`screen_mins_${todayStr}`);
    return cached ? Number(cached) : 25;
  });

  const [isEditingScreenTime, setIsEditingScreenTime] = useState(false);
  const [screenTimeInput, setScreenTimeInput] = useState(screenMinutes);

  // Urge Surfing Modal / Banner State
  const [showUrgeModal, setShowUrgeModal] = useState(false);
  const [urgeTimer, setUrgeTimer] = useState(60);
  const [urgeActive, setUrgeActive] = useState(false);
  const urgeIntervalRef = useRef(null);

  // Phone in Drawer Focus Lock Timer
  const [isLockerRunning, setIsLockerRunning] = useState(false);
  const [lockerSecondsLeft, setLockerSecondsLeft] = useState(45 * 60); // 45 min default
  const [lockerDuration, setLockerDuration] = useState(45);
  const lockerIntervalRef = useRef(null);

  // Save screen time
  const handleSaveScreenTime = (mins) => {
    const num = Math.max(0, parseInt(mins) || 0);
    setScreenMinutes(num);
    localStorage.setItem(`screen_mins_${todayStr}`, String(num));
    setIsEditingScreenTime(false);
    showToast(`Updated today's mobile screen time to ${num} mins`, "info");

    // Auto-tick if under 30 mins
    if (num <= 30 && !isNoInstagramChecked && onToggleHabit) {
      onToggleHabit(todayStr, "screenTimeDetox");
      showToast("🏆 Screen time under 30m! Auto-checked Screen Detox habit.", "success");
    }
  };

  // Urge Surfing Countdown
  useEffect(() => {
    if (urgeActive && urgeTimer > 0) {
      urgeIntervalRef.current = setInterval(() => {
        setUrgeTimer((prev) => {
          if (prev <= 1) {
            clearInterval(urgeIntervalRef.current);
            setUrgeActive(false);
            playCompletionChime();
            showToast("🔥 Urge survived! Dopamine surge dissipated.", "success");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(urgeIntervalRef.current);
  }, [urgeActive, urgeTimer]);

  const startUrgeSurfing = () => {
    setUrgeTimer(60);
    setUrgeActive(true);
    setShowUrgeModal(true);
    playIntervalBeep();
  };

  // Phone in Drawer Timer
  useEffect(() => {
    if (isLockerRunning && lockerSecondsLeft > 0) {
      lockerIntervalRef.current = setInterval(() => {
        setLockerSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(lockerIntervalRef.current);
            setIsLockerRunning(false);
            stopAmbientSound();
            playCompletionChime();
            showToast("🎉 45-Min Phone Lockout Complete! Zero Distraction Victory.", "success");
            if (onToggleHabit) onToggleHabit(todayStr, "screenTimeDetox");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(lockerIntervalRef.current);
  }, [isLockerRunning, lockerSecondsLeft]);

  const toggleLockerTimer = () => {
    if (isLockerRunning) {
      setIsLockerRunning(false);
      stopAmbientSound();
    } else {
      setIsLockerRunning(true);
      playBrownNoise();
    }
  };

  const resetLockerTimer = (mins = 45) => {
    setIsLockerRunning(false);
    stopAmbientSound();
    setLockerDuration(mins);
    setLockerSecondsLeft(mins * 60);
  };

  const formatSecs = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  // Screen time rating
  const screenStatus =
    screenMinutes <= 30
      ? { label: "Elite Discipline", badge: "bg-emerald-100 text-emerald-900 border-emerald-300", color: "text-emerald-700", icon: "fa-shield-check" }
      : screenMinutes <= 60
      ? { label: "Moderate Usage", badge: "bg-amber-100 text-amber-900 border-amber-300", color: "text-amber-700", icon: "fa-triangle-exclamation" }
      : { label: "Screen Time Warning", badge: "bg-rose-100 text-rose-900 border-rose-300", color: "text-rose-700", icon: "fa-skull-crossbones" };

  // Calculate hours saved (assuming past average was 2.5h/day)
  const hoursSavedPerDay = Math.max(0, (150 - screenMinutes) / 60).toFixed(1);
  const hoursSavedPerWeek = (hoursSavedPerDay * 7).toFixed(1);

  return (
    <section className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-2xl border border-emerald-700/50 p-4 sm:p-6 shadow-md space-y-6">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-lg font-black shadow-sm">
              📵
            </span>
            <h2 className="font-display font-black text-lg sm:text-xl tracking-tight text-white">
              Digital Detox &amp; Instagram Screen Guard
            </h2>
            <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${screenStatus.badge}`}>
              {screenStatus.label}
            </span>
          </div>
          <p className="text-xs text-emerald-200/80 max-w-2xl leading-relaxed">
            Reduce Instagram dopamine spikes, reclaim 2.5+ hours daily for MERN &amp; GenAI mastery, and protect your 9:30 PM digital sunset.
          </p>
        </div>

        {/* Emergency Urge Surfing Button */}
        <button
          type="button"
          onClick={startUrgeSurfing}
          className="px-3.5 py-2 rounded-xl text-xs font-black bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-900/30 transition-all flex items-center gap-2 cursor-pointer animate-pulse"
          title="Click immediately when you have the urge to mindlessly open Instagram!"
        >
          <i className="fa-solid fa-fire-flame-curved"></i>
          <span>I'm Craving Instagram Right Now!</span>
        </button>
      </div>

      {/* ── QUICK METRICS & CHECKBOX ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Today Screen Time */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
              Today's Screen Time
            </span>
            <button
              type="button"
              onClick={() => {
                setScreenTimeInput(screenMinutes);
                setIsEditingScreenTime(!isEditingScreenTime);
              }}
              className="text-[11px] text-emerald-400 hover:text-emerald-200 cursor-pointer"
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
          </div>

          {!isEditingScreenTime ? (
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-2xl text-white">
                {screenMinutes}
              </span>
              <span className="text-xs text-emerald-300/80 font-bold">minutes</span>
              <span className="text-[10px] text-emerald-400 ml-auto font-medium">
                (Target &lt; 30m)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="number"
                min="0"
                max="600"
                value={screenTimeInput}
                onChange={(e) => setScreenTimeInput(e.target.value)}
                className="w-20 px-2 py-1 text-xs font-bold text-slate-950 bg-white rounded-lg outline-none"
              />
              <button
                type="button"
                onClick={() => handleSaveScreenTime(screenTimeInput)}
                className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-emerald-600"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* Metric 2: Instagram Checkbox Habit */}
        <div
          onClick={() => onToggleHabit && onToggleHabit(todayStr, "screenTimeDetox")}
          className={`border rounded-xl p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
            isNoInstagramChecked
              ? "bg-emerald-500/20 border-emerald-400/60"
              : "bg-white/5 border-white/10 hover:bg-white/10"
          }`}
        >
          <div className="flex-shrink-0">
            <input
              type="checkbox"
              className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              checked={isNoInstagramChecked}
              onChange={() => {}}
            />
          </div>
          <div>
            <div className="text-xs font-black text-white">
              {isNoInstagramChecked ? "Zero Mindless Instagram ✓" : "Lock Instagram Today"}
            </div>
            <div className="text-[10px] text-emerald-300/80">
              {isNoInstagramChecked ? "Dopamine streak protected!" : "Click to log zero reels"}
            </div>
          </div>
        </div>

        {/* Metric 3: Time Saved vs Past Habits */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-0.5">
          <div className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
            Reclaimed Time
          </div>
          <div className="font-display font-black text-2xl text-teal-300">
            +{hoursSavedPerDay}h <span className="text-xs font-normal text-white">today</span>
          </div>
          <div className="text-[10px] text-emerald-200/70">
            +{hoursSavedPerWeek}h/wk redirected to MERN &amp; GenAI
          </div>
        </div>

        {/* Metric 4: Digital Sunset Countdown */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-0.5">
          <div className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
            Digital Sunset Protocol
          </div>
          <div className="font-display font-black text-xl text-amber-300 flex items-center gap-1.5">
            <i className="fa-solid fa-moon text-sm"></i>
            <span>9:30 PM Lockout</span>
          </div>
          <div className="text-[10px] text-emerald-200/70">
            Phone parked in drawer away from bed
          </div>
        </div>
      </div>

      {/* ── FOCUS LOCKER / PHONE IN DRAWER TIMER ── */}
      <div className="bg-black/25 rounded-xl border border-white/10 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
              Phone-In-Drawer Deep Focus Locker
            </span>
          </div>
          <p className="text-xs text-white/80 max-w-md">
            Place your phone face-down inside your desk drawer. Turn on ambient brown noise to block auditory distractions.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <div className="font-mono font-black text-3xl tracking-wider text-emerald-300 bg-white/5 px-4 py-1.5 rounded-xl border border-white/10">
            {formatSecs(lockerSecondsLeft)}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleLockerTimer}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all ${
                isLockerRunning
                  ? "bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-md"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-md shadow-emerald-950/40"
              }`}
            >
              <i className={`fa-solid ${isLockerRunning ? "fa-pause" : "fa-play"}`}></i>
              <span>{isLockerRunning ? "Pause Locker" : "Start 45m Lock"}</span>
            </button>

            <button
              type="button"
              onClick={() => resetLockerTimer(45)}
              className="p-2 text-xs text-white/60 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
              title="Reset 45m"
            >
              <i className="fa-solid fa-rotate-left"></i>
            </button>
          </div>
        </div>
      </div>

      {/* ── THE 5 ANTI-INSTAGRAM NEUROSCIENCE PROTOCOLS ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
            <i className="fa-solid fa-shield-halved text-emerald-400"></i>
            The 5 Iron Rules for Zero Instagram Addiction
          </h3>
          <span className="text-[10px] text-white/60">Huberman &amp; Cal Newport Framework</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-1">
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
              <span>1. Friction</span>
            </div>
            <p className="text-[11px] text-white/80 leading-relaxed">
              Enable <strong>Grayscale Mode</strong> on phone display. Remove Instagram from Home Screen or log out after each session.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-1">
            <div className="text-xs font-bold text-teal-300 flex items-center gap-1">
              <span>2. Sacred Morning</span>
            </div>
            <p className="text-[11px] text-white/80 leading-relaxed">
              4:30 AM – 6:30 AM is <strong>100% sacred</strong>. No notifications, no news, no feeds before Striver DSA coding is completed.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-1">
            <div className="text-xs font-bold text-rose-300 flex items-center gap-1">
              <span>3. Dopamine Swap</span>
            </div>
            <p className="text-[11px] text-white/80 leading-relaxed">
              When hands unconsciously reach for Instagram, immediately do <strong>10 pushups</strong> or drink 1 glass of cold water.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-1">
            <div className="text-xs font-bold text-purple-300 flex items-center gap-1">
              <span>4. Digital Sunset</span>
            </div>
            <p className="text-[11px] text-white/80 leading-relaxed">
              At <strong>9:30 PM</strong>, charge phone in another room or across the room in a drawer. Read physical books in bed.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-1">
            <div className="text-xs font-bold text-emerald-300 flex items-center gap-1">
              <span>5. Browser Only</span>
            </div>
            <p className="text-[11px] text-white/80 leading-relaxed">
              Uninstall the mobile app. Check DMs only via laptop browser once a day for 10 minutes maximum.
            </p>
          </div>
        </div>
      </div>

      {/* ── URGE SURFING MODAL / OVERLAY ── */}
      {showUrgeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 border border-rose-500/50 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-rose-500/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center text-sm font-black">
                  🌊
                </span>
                <h3 className="font-display font-black text-lg text-rose-200">
                  60-Second Urge Surfing Protocol
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUrgeModal(false)}
                className="text-white/60 hover:text-white p-1 rounded-lg"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="text-center py-4 space-y-2">
              <div className="text-xs uppercase font-extrabold text-rose-300 tracking-wider">
                Breathe Slowly • The Dopamine Wave Peaks at 60 Seconds
              </div>
              <div className="font-mono font-black text-5xl text-rose-400">
                {urgeTimer}s
              </div>
              <p className="text-xs text-rose-200/80 max-w-sm mx-auto pt-1 leading-relaxed">
                Neuroscience proves an impulse craving is just a temporary neurochemical wave. If you observe it for 60 seconds without reacting, the urge completely collapses.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-3.5 border border-rose-500/30 space-y-2 text-xs">
              <div className="font-bold text-rose-300">⚡ Immediate Action Substitute:</div>
              <ul className="space-y-1.5 text-white/80 text-[11px]">
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-rose-400"></i>
                  <span>Take 3 deep belly breaths: inhale 4s, hold 4s, exhale 6s.</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-rose-400"></i>
                  <span>Drop and do 10 pushups right where you are standing.</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-rose-400"></i>
                  <span>Drink 1 large glass of cold water.</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowUrgeModal(false);
                  if (onToggleHabit) onToggleHabit(todayStr, "screenTimeDetox");
                  showToast("🏅 Survived the urge! Added to your detox streak.", "success");
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl text-xs cursor-pointer"
              >
                I Conquered the Craving! (Lock It)
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
