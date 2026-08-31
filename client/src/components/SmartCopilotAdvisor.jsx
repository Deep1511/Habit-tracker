import { useState, useEffect, useMemo, useRef } from "react";
import {
  playGamma40Hz,
  playBrownNoise,
  playRainAmbience,
  stopAmbientSound,
  playCompletionChime,
} from "../soundEngine";
import { getCurrentChronoPhase } from "./ChronoAdvisor";

export const QUICK_PROMPTS = [
  {
    id: "nap_90m",
    label: "🌙 Sleep 90 mins & post-nap plan",
    query: "I want to sleep for 90 minutes right now, after that what do I need to do?",
  },
  {
    id: "nap_1hr",
    label: "💤 Want to sleep for 1 hour",
    query: "I want to sleep for 1 hour right now, how should I manage my day and schedule?",
  },
  {
    id: "time_30m",
    label: "⚡ Only 30m free right now",
    query: "I only have 30 minutes free right now, what is the highest-yield thing to study?",
  },
  {
    id: "brain_fog",
    label: "🧠 Brain is fried / Mentally exhausted",
    query: "My brain is completely exhausted from coding/work, should I force study or switch tasks?",
  },
  {
    id: "missed_morning",
    label: "⏰ Missed morning session",
    query: "I missed my morning study slot today, how do I recover my schedule and keep my streak alive?",
  },
  {
    id: "track_balance",
    label: "⚖️ MERN vs Govt track balance",
    query: "Am I balancing MERN DSA and Govt Exam prep properly today? What should I prioritize right now?",
  },
  {
    id: "too_lazy",
    label: "🎲 Too lazy to start (2-min kickstart)",
    query: "I am feeling extremely lazy and unmotivated to study right now, give me a quick kickstart.",
  },
  {
    id: "late_night",
    label: "🌙 Late night: Study more or sleep?",
    query: "It is getting late at night, should I push through and study more or go to sleep?",
  },
  {
    id: "post_lunch",
    label: "🥪 Just ate lunch (2 PM slump)",
    query: "I just finished lunch and feeling sleepy, what should I study without feeling lazy?",
  },
];

// ── Helper: Parse Requested Duration from Query ──
function extractDurationMins(text, defaultMins = 25) {
  const str = (text || "").toLowerCase();

  if (
    str.includes("90 min") ||
    str.includes("90min") ||
    str.includes("90 m") ||
    str.includes("1.5 hour") ||
    str.includes("1.5 hr") ||
    str.includes("1 and a half hour") ||
    str.includes("one and a half hour")
  ) {
    return 90;
  }
  if (
    str.includes("60 min") ||
    str.includes("60min") ||
    str.includes("1 hour") ||
    str.includes("1 hr") ||
    str.includes("one hour") ||
    str.includes("an hour")
  ) {
    return 60;
  }
  if (str.includes("45 min") || str.includes("45min") || str.includes("45 m")) {
    return 45;
  }
  if (
    str.includes("30 min") ||
    str.includes("30min") ||
    str.includes("30 m") ||
    str.includes("half an hour") ||
    str.includes("half hour")
  ) {
    return 30;
  }
  if (
    str.includes("20 min") ||
    str.includes("25 min") ||
    str.includes("20min") ||
    str.includes("25min") ||
    str.includes("power nap")
  ) {
    return 25;
  }
  if (
    str.includes("2 hour") ||
    str.includes("2 hr") ||
    str.includes("2hr") ||
    str.includes("120 min") ||
    str.includes("two hour")
  ) {
    return 120;
  }

  const match = str.match(/(\d+)\s*(?:min|mins|minute|minutes|m\b)/i);
  if (match && match[1]) {
    const parsed = parseInt(match[1], 10);
    if (parsed > 0 && parsed <= 360) return parsed;
  }

  const hourMatch = str.match(/(\d+)\s*(?:hour|hours|hr|hrs|h\b)/i);
  if (hourMatch && hourMatch[1]) {
    const parsed = parseInt(hourMatch[1], 10) * 60;
    if (parsed > 0 && parsed <= 360) return parsed;
  }

  return defaultMins;
}

// ── Helper: Format Time of Day ──
function getTimeOfDayName(hour) {
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 21) return "Evening";
  return "Night";
}

// ── Helper: Calculate Wake-up and Future Time Strings ──
function calculateFutureTime(startMs, addMinutes) {
  const future = new Date(startMs + addMinutes * 60000);
  return future.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function SmartCopilotAdvisor({
  monthData = {},
  todayStr = "",
  todaySched = {},
  todayTopic = {},
  daysLeft = 0,
  onSelectTrack,
  onOpenDrill,
  onOpenVault,
  onOpenRescue,
  onShiftSchedule,
  showToast,
}) {
  const [queryInput, setQueryInput] = useState("");
  const [activeAdvice, setActiveAdvice] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("copilot_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(false);

  // In-Card Timer State
  const [timerDurationMins, setTimerDurationMins] = useState(25);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSound, setTimerSound] = useState("rain"); // 'rain' | 'brown' | 'gamma' | 'off'
  const timerRef = useRef(null);

  // Live Clock
  const [liveClock, setLiveClock] = useState("");
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setLiveClock(
        d.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 20000);
    return () => clearInterval(interval);
  }, []);

  const livePhase = useMemo(() => getCurrentChronoPhase(), [liveClock]);

  // Today's stats
  const todayEntry = monthData[todayStr] || {};
  const mernMinsLogged = todayEntry.mernMinutes || 0;

  // ── Intelligent Decision & Suggestion Engine ────────────────────────
  const generateDecision = (rawQuery) => {
    const q = (rawQuery || "").toLowerCase();
    const now = new Date();
    const nowMs = now.getTime();
    const currentHour = now.getHours() + now.getMinutes() / 60;
    const timeOfDay = getTimeOfDayName(currentHour);
    const isLateNight = currentHour >= 22.5 || currentHour < 5;
    const isMidday = currentHour >= 13 && currentHour < 16;

    // 1. SLEEP & NAP REQUESTS
    if (
      q.includes("sleep") ||
      q.includes("nap") ||
      q.includes("rest for") ||
      q.includes("sleepy") ||
      q.includes("lie down") ||
      q.includes("take a rest") ||
      q.includes("after that what")
    ) {
      const requestedMins = extractDurationMins(q, 60);
      const wakeTimeStr = calculateFutureTime(nowMs, requestedMins);

      // ── 1A. 90-MINUTE FULL ULTRADIAN REM SLEEP CYCLE ──
      if (requestedMins === 90 || (requestedMins >= 80 && requestedMins <= 105)) {
        const step2EndStr = calculateFutureTime(nowMs, 90 + 45);

        // Bedtime calculation (Target 12:30 AM)
        const bedtimeHour = 24.5;
        const wakeHour = currentHour + 1.5;
        const minsLeftToBedtime = Math.max(0, Math.round((bedtimeHour - wakeHour) * 60));
        const hoursLeftStr =
          minsLeftToBedtime >= 60
            ? `${Math.floor(minsLeftToBedtime / 60)}h ${minsLeftToBedtime % 60}m`
            : `${minsLeftToBedtime} mins`;

        return {
          query: rawQuery,
          category: "sleep_90m",
          badge: "🌙 Full 90-Min REM Sleep Cycle (Ultradian Rhythm)",
          badgeColor: "bg-indigo-400/20 text-indigo-300 border-indigo-400/40",
          verdict: `90-Min Sleep Verdict: Golden Ultradian Cycle! Wake up naturally at ${wakeTimeStr} with zero grogginess, then execute your night sprint.`,
          why: `It is currently ${liveClock} (${timeOfDay}). 90 minutes is the scientifically optimal duration for a full sleep cycle. Your brain will pass through Light Sleep (Stages 1 & 2) ➔ Deep Slow-Wave Sleep (Stage 3) ➔ REM Sleep (Stage 4). Because you wake up as the REM cycle completes at ${wakeTimeStr}, you bypass the heavy sleep inertia that happens with 60-min naps. You will have ~${hoursLeftStr} of clear-headed focus time before your 12:30 AM bedtime target!`,
          actionPlan: [
            `⏱️ Step 1 (${liveClock} – ${wakeTimeStr}): Sleep for 90 minutes. Set the 90m timer below with soothing Rain / Brown Noise audio. Sleep in complete darkness.`,
            `💧 Step 2 (${wakeTimeStr} – ${step2EndStr}): Upon waking at ${wakeTimeStr}: Drink 200ml cold water + 2m stretch to flush adenosine. Then do a 45-min sprint (Striver DSA logic or Govt Current Affairs).`,
            `📖 Step 3 (${step2EndStr} – 12:30 AM): Read 20-30 mins of your book (*Atomic Habits / Deep Work*) & complete Bedtime Review. Note: Since you already banked 1.5h of deep sleep tonight, your night recovery is ahead of schedule!`,
          ],
          actions: [
            {
              label: `⏱️ Start 90m Sleep Timer (Wakes at ${wakeTimeStr})`,
              type: "start_timer",
              mins: 90,
              sound: "rain",
            },
            {
              label: `🔄 Shift Timetable to ${wakeTimeStr} (+90m)`,
              type: "shift_schedule",
              mins: 90,
            },
            {
              label: `💻 Open MERN DSA for ${wakeTimeStr}`,
              type: "select_track",
              track: "mern",
            },
            {
              label: "🏛️ Open Govt Exam Tracker",
              type: "select_track",
              track: "gov",
            },
          ],
        };
      }

      // ── 1B. 60-MINUTE (1-HOUR) SLEEP WARNING & PROTOCOL ──
      if (requestedMins === 60 || (requestedMins >= 50 && requestedMins <= 75)) {
        const wakeTime25Str = calculateFutureTime(nowMs, 25);
        const wakeTime90Str = calculateFutureTime(nowMs, 90);

        return {
          query: rawQuery,
          category: "sleep_60m",
          badge: "⚠️ 60-Min Sleep Caution (Stage 3 Slow-Wave Trap)",
          badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/40",
          verdict: `60-Min Sleep Decision: Waking up at ${wakeTimeStr} lands in Deep Slow-Wave Sleep. We recommend either 25m Power Nap or 90m Full Cycle.`,
          why: `It is currently ${liveClock} (${timeOfDay}). At exactly 60 minutes, your brain is in the deepest slow-wave delta state. An alarm at ${wakeTimeStr} abruptly cuts delta waves, causing 20-30 minutes of heavy brain fog ('Sleep Inertia'). For peak alertness: a 25-min Power Nap (wakes at ${wakeTime25Str}) or a 90-min Full REM Cycle (wakes at ${wakeTime90Str}) is neurologically superior.`,
          actionPlan: [
            `Option A (Recommended 25m): Set a 25-Min Power Nap Timer (wakes at ${wakeTime25Str}) for an immediate working memory boost with zero grogginess.`,
            `Option B (Recommended 90m): Extend to 90 mins (wakes at ${wakeTime90Str}) to complete a full REM cycle and memory consolidation.`,
            `Option C (If keeping 60m): If you must sleep 60m, set the 60m timer and wash your face with cold water immediately at ${wakeTimeStr} to break sleep inertia.`,
          ],
          actions: [
            {
              label: `⏱️ Start 25m Power Nap (Wakes at ${wakeTime25Str})`,
              type: "start_timer",
              mins: 25,
              sound: "rain",
            },
            {
              label: `⏱️ Start 90m Full Cycle (Wakes at ${wakeTime90Str})`,
              type: "start_timer",
              mins: 90,
              sound: "rain",
            },
            {
              label: `⏱️ Proceed with 60m Timer`,
              type: "start_timer",
              mins: 60,
              sound: "rain",
            },
            {
              label: `🔄 Shift Timetable (+60m)`,
              type: "shift_schedule",
              mins: 60,
            },
          ],
        };
      }

      // ── 1C. 20-25 MINUTE POWER NAP ──
      if (requestedMins <= 35) {
        return {
          query: rawQuery,
          category: "sleep_25m",
          badge: "⚡ 25-Min NASA Power Nap Protocol",
          badgeColor: "bg-emerald-400/20 text-emerald-300 border-emerald-400/40",
          verdict: `Power Nap Decision: Wake up at ${wakeTimeStr} with maximum working memory restoration and zero sleep inertia.`,
          why: `At ${liveClock} (${timeOfDay}), a 25-minute power nap cleans out accumulated brain adenosine without entering Stage 3 slow-wave sleep. You will wake up at ${wakeTimeStr} with high Beta/Gamma alertness, ready for high-focus coding or exam drills.`,
          actionPlan: [
            `⏱️ Step 1 (${liveClock} – ${wakeTimeStr}): Start the 25-minute nap timer with gentle Rain audio.`,
            `💧 Step 2 (${wakeTimeStr}): Stand up immediately upon timer chime, drink a glass of water, and jump straight into study.`,
            `💻 Step 3: Complete a 45-minute deep focus MERN or Govt sprint.`,
          ],
          actions: [
            {
              label: `⏱️ Start 25m Power Nap Timer`,
              type: "start_timer",
              mins: 25,
              sound: "rain",
            },
            {
              label: `🔄 Shift Timetable (+25m)`,
              type: "shift_schedule",
              mins: 25,
            },
            {
              label: "💻 Switch to MERN DSA",
              type: "select_track",
              track: "mern",
            },
          ],
        };
      }

      // ── 1D. EXTENDED SLEEP (2+ HOURS) ──
      return {
        query: rawQuery,
        category: "sleep_long",
        badge: "🛏️ Extended Sleep & Schedule Re-alignment",
        badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/40",
        verdict: `Extended Sleep (${requestedMins} Mins): Wake up at ${wakeTimeStr}. We will shift your remaining daily targets.`,
        why: `Sleeping for ${requestedMins} minutes will bring you to ${wakeTimeStr} (${timeOfDay}). We will adjust your evening schedule so you keep your daily streak alive.`,
        actionPlan: [
          `⏱️ Step 1: Rest until ${wakeTimeStr}.`,
          `💧 Step 2: Upon waking at ${wakeTimeStr}, execute a 30-min high-priority core mission sprint.`,
          `🔄 Step 3: Shift timetable by +${requestedMins} mins.`,
        ],
        actions: [
          {
            label: `⏱️ Start ${requestedMins}m Timer (Wakes at ${wakeTimeStr})`,
            type: "start_timer",
            mins: requestedMins,
            sound: "rain",
          },
          {
            label: `🔄 Shift Timetable (+${requestedMins}m)`,
            type: "shift_schedule",
            mins: requestedMins,
          },
        ],
      };
    }

    // 2. TIME-CRUNCH / 30-MINUTES / 15-MINUTES FREE
    if (
      q.includes("30 min") ||
      q.includes("30m") ||
      q.includes("15 min") ||
      q.includes("15m") ||
      q.includes("45 min") ||
      q.includes("short time") ||
      q.includes("little time") ||
      q.includes("before leaving") ||
      q.includes("before work") ||
      q.includes("quick")
    ) {
      const crunchMins = extractDurationMins(q, 30);
      const endMinsStr = calculateFutureTime(nowMs, crunchMins);

      return {
        query: rawQuery,
        category: "time_crunch",
        badge: "⚡ High-Yield Micro-Sprint Protocol",
        badgeColor: "bg-teal-400/20 text-teal-300 border-teal-400/40",
        verdict: `High-Yield Action (${crunchMins} Mins Window): Do NOT start heavy architecture. Execute a ${crunchMins}-Min Rapid-Fire Drill or 1 DSA Logic Problem.`,
        why: `At ${liveClock} (${timeOfDay}), starting a complex multi-hour coding task in a ${crunchMins}-min window creates cognitive context-switching penalties. Instead, a targeted sprint until ${endMinsStr} gives an instant dopamine win and strengthens active recall without leaving unfinished threads.`,
        actionPlan: [
          `🥊 Step 1: Launch the 60-Second Rapid-Fire Drill to test MERN concepts or Govt Quant shortcuts.`,
          `💻 Step 2: Or pick exactly 1 DSA problem from Striver Step 1/3 and write just the brute-force & optimal logic before ${endMinsStr}.`,
          `✅ Step 3: Click 'Log 15m Sprint' to automatically mark topic progress and preserve your streak.`,
        ],
        actions: [
          {
            label: "🥊 Launch 60s Rapid Drill",
            type: "open_drill",
          },
          {
            label: `⏱️ Start ${crunchMins}m Sprint Timer`,
            type: "start_timer",
            mins: crunchMins,
            sound: "gamma",
          },
          {
            label: "⚡ Emergency 15m Rescue",
            type: "open_rescue",
          },
          {
            label: "🏛️ Jump to Govt Speed Math",
            type: "select_track",
            track: "gov",
          },
        ],
      };
    }

    // 3. BRAIN FRIED / MENTALLY EXHAUSTED / BURNOUT
    if (
      q.includes("fried") ||
      q.includes("exhausted") ||
      q.includes("tired") ||
      q.includes("headache") ||
      q.includes("drain") ||
      q.includes("burnout") ||
      q.includes("overwhelmed")
    ) {
      return {
        query: rawQuery,
        category: "fatigue",
        badge: "🧠 Cognitive Load Rebalancing",
        badgeColor: "bg-rose-400/20 text-rose-300 border-rose-400/40",
        verdict:
          "Cognitive Pivot: Cease Heavy Algorithmic Debugging. Switch to Narrative Story Learning (Polity/GK) or Anti-Boredom Vault.",
        why: `It is ${liveClock} (${timeOfDay}). Heavy coding & abstract math consume prefrontal glucose rapidly. When working memory buffers overflow, forcing more code leads to frustration and self-doubt. Switching to narrative learning (Indian History, Polity, or visual mental models) uses visual-auditory temporal pathways, requiring 60% less mental strain while keeping study progress moving.`,
        actionPlan: [
          "💡 Step 1: Open the Anti-Boredom Vault to review 3 memorable real-world mental models (e.g. Event Loop = Restaurant Kitchen).",
          "🏛️ Step 2: Watch a 20-min story-based Indian Polity or Current Affairs lecture with zero note-taking pressure.",
          "☕ Step 3: Take a 10-min tea/walk break with 40Hz brown noise to reset neural firing.",
        ],
        actions: [
          {
            label: "💡 Open Anti-Boredom Vault",
            type: "open_vault",
          },
          {
            label: "🏛️ Switch to Govt / Polity Story",
            type: "select_track",
            track: "gov",
          },
          {
            label: "⏱️ Start 15m Reset Timer",
            type: "start_timer",
            mins: 15,
            sound: "brown",
          },
        ],
      };
    }

    // 4. MISSED MORNING SESSION / FELL BEHIND
    if (
      q.includes("missed") ||
      q.includes("late") ||
      q.includes("woke up late") ||
      q.includes("behind") ||
      q.includes("skipped") ||
      q.includes("recover") ||
      q.includes("fix day")
    ) {
      return {
        query: rawQuery,
        category: "schedule_recovery",
        badge: "⚡ Emergency Schedule Compression",
        badgeColor: "bg-indigo-400/20 text-indigo-300 border-indigo-400/40",
        verdict:
          "Recovery Strategy: Do not cram 6 missed hours into the night. Execute 1 Anchor MERN Sprint + 1 Govt Mock Sprint.",
        why: "Trying to make up for missed morning hours by studying until 3:00 AM destroys tomorrow's circadian cortisol rhythm and creates a multi-day burnout spiral. Instead, execute the '2-Anchor Rule': complete your #1 high-yield DSA topic + 1 Govt mock, and protect your 12:30 AM bedtime.",
        actionPlan: [
          "🎯 Step 1: Define today's single most critical topic in the 'Today's #1 Mission' banner.",
          "⏱️ Step 2: Complete a 45-minute focused MERN deep work session right now.",
          "🔄 Step 3: Shift remaining timetable slots smoothly and log a 15-min Day Rescue sprint to lock in your daily streak.",
        ],
        actions: [
          {
            label: "⚡ Launch 15m Day Rescue",
            type: "open_rescue",
          },
          {
            label: "🔄 Shift Timetable (+1 Hour)",
            type: "shift_schedule",
            mins: 60,
          },
          {
            label: "💻 Jump to MERN DSA Roadmap",
            type: "select_track",
            track: "mern",
          },
        ],
      };
    }

    // 5. MERN VS GOVT TRACK BALANCE
    if (
      q.includes("balance") ||
      q.includes("which track") ||
      q.includes("what to study") ||
      q.includes("prioritize") ||
      q.includes("mern or gov") ||
      q.includes("split") ||
      q.includes("priority")
    ) {
      const shouldDoMern = mernMinsLogged < 60;
      return {
        query: rawQuery,
        category: "track_balance",
        badge: "⚖️ Dual-Track Equilibrium Engine",
        badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/40",
        verdict: shouldDoMern
          ? `Track Priority: Focus on MERN & DSA (Logged: ${mernMinsLogged}m today, Target: 120m+)`
          : `Track Priority: Shift focus to Govt Exam & Current Affairs (MERN already has ${mernMinsLogged}m logged!)`,
        why: shouldDoMern
          ? `Your MERN & Striver DSA track is currently behind today's target (${mernMinsLogged} mins logged). MERN algorithmic muscle memory requires daily code writing to build neural fluency for technical interviews.`
          : `You have made great progress on MERN (${mernMinsLogged} mins logged). Balancing both tracks requires dedicating the next window to Quantitative Aptitude, Reasoning, or GS Revision to maintain dual competitiveness.`,
        actionPlan: [
          shouldDoMern
            ? "💻 Step 1: Open MERN Tracker and solve 1 pending problem from Striver A2Z DSA."
            : "🏛️ Step 1: Open Govt Exam Tracker and solve 25 Aptitude questions or 1 mock section.",
          "⏱️ Step 2: Run a 45-minute deep focus session with 40Hz Gamma soundscape.",
          "✅ Step 3: Auto-tick the topic in the tracker to update your momentum score.",
        ],
        actions: [
          {
            label: shouldDoMern ? "💻 Go to MERN Roadmap" : "🏛️ Go to Govt Tracker",
            type: "select_track",
            track: shouldDoMern ? "mern" : "gov",
          },
          {
            label: "⏱️ Start 45m Focus Timer",
            type: "start_timer",
            mins: 45,
            sound: "gamma",
          },
          {
            label: "🥊 Test Instincts (60s Drill)",
            type: "open_drill",
          },
        ],
      };
    }

    // 6. LAZY / UNMOTIVATED / KICKSTART
    if (
      q.includes("lazy") ||
      q.includes("unmotivated") ||
      q.includes("procrastinat") ||
      q.includes("start") ||
      q.includes("kickstart") ||
      q.includes("bored")
    ) {
      return {
        query: rawQuery,
        category: "motivation",
        badge: "⚡ 2-Minute Dopamine Micro-Win",
        badgeColor: "bg-emerald-400/20 text-emerald-300 border-emerald-400/40",
        verdict:
          "Anti-Procrastination Hack: Apply the 2-Minute Rule (Lower the Activation Energy Barrier)",
        why: "Procrastination is an emotional defense mechanism against perceived friction, not a lack of willpower. By telling your brain 'I will only read 5 lines of code or solve 3 reasoning questions for 2 minutes', the amygdala threat response turns off. Once started, 85% of people naturally continue into full flow.",
        actionPlan: [
          "🥊 Step 1: Launch the 60-Second Rapid Drill — zero setup required, just instant fast-twitch intuition.",
          "⚡ Step 2: Open Day-Rescue and complete a painless 15-minute micro-sprint.",
          "🎯 Step 3: Check off today's #1 Mission to trigger an immediate dopamine victory loop.",
        ],
        actions: [
          {
            label: "🥊 Launch 60s Rapid Drill",
            type: "open_drill",
          },
          {
            label: "⚡ 15-Minute Emergency Rescue",
            type: "open_rescue",
          },
          {
            label: "💡 Open Anti-Boredom Vault",
            type: "open_vault",
          },
        ],
      };
    }

    // 7. LATE NIGHT / SLEEP VS STUDY
    if (
      q.includes("late night") ||
      q.includes("sleep or study") ||
      q.includes("stay up") ||
      q.includes("all night") ||
      q.includes("night") ||
      isLateNight
    ) {
      return {
        query: rawQuery,
        category: "late_night",
        badge: "🌙 Circadian Memory Consolidation",
        badgeColor: "bg-indigo-400/20 text-indigo-300 border-indigo-400/40",
        verdict:
          "Sleep Verdict: Stop Screen-Based Coding. Read 15 mins of a book & protect your 12:30 AM sleep target.",
        why: "Studying code past 11:30 PM with blue-light exposure delays melatonin release by 90 minutes and cuts REM sleep. REM sleep is when your brain transfers today's DSA algorithms and Govt formulas from short-term hippocampus into long-term neocortex memory. Sacrificing sleep destroys tomorrow's retention by up to 40%.",
        actionPlan: [
          "📖 Step 1: Open the Bedtime Review to log today's total output and commit tomorrow's #1 target.",
          "📚 Step 2: Read 15-20 pages of a wisdom book (Atomic Habits / Deep Work).",
          "🛏️ Step 3: Complete wind-down and be in bed by 12:30 AM for your 5.5-hour sleep target.",
        ],
        actions: [
          {
            label: "📖 Open Bedtime Review & Summary",
            type: "open_bedtime",
          },
          {
            label: "📚 Open Recommended Book List",
            type: "open_books",
          },
          {
            label: "⏱️ Start 15m Wind-Down Timer",
            type: "start_timer",
            mins: 15,
            sound: "rain",
          },
        ],
      };
    }

    // 8. POST-LUNCH / MIDDAY DIP
    if (q.includes("lunch") || q.includes("slump") || isMidday) {
      return {
        query: rawQuery,
        category: "midday_dip",
        badge: "🥪 Circadian Post-Prandial Strategy",
        badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/40",
        verdict:
          "Midday Strategy: Switch to Government Exam Story Lectures (Polity/GK). Avoid Heavy MERN Debugging!",
        why: "After lunch, digestion causes a natural circadian dip in core body temperature and working memory. Heavy coding feels exhausting right now. But narrative-based subjects like Indian History, Polity, and Current Affairs require minimal mental strain and are 2x easier to absorb during this window.",
        actionPlan: [
          "🏛️ Step 1: Watch a 25-minute Indian Polity or Current Affairs lecture video.",
          "💡 Step 2: Explore 2 analogies in the Anti-Boredom Vault.",
          "💻 Step 3: Save MERN architecture and complex coding for the 4:00 PM Afternoon Rebound.",
        ],
        actions: [
          {
            label: "🏛️ Switch to Govt Exam Track",
            type: "select_track",
            track: "gov",
          },
          {
            label: "⏱️ Start 25m Story Video Timer",
            type: "start_timer",
            mins: 25,
            sound: "off",
          },
          {
            label: "💡 Open Anti-Boredom Vault",
            type: "open_vault",
          },
        ],
      };
    }

    // 9. DEFAULT / GENERAL ADVICE
    return {
      query: rawQuery,
      category: "general",
      badge: `🎯 Real-Time Circadian Recommendation (${livePhase.name})`,
      badgeColor: "bg-teal-400/20 text-teal-300 border-teal-400/40",
      verdict: `Optimal Action Right Now: ${livePhase.trackTitle}`,
      why: `At ${liveClock} (${livePhase.name}), your circadian neurochemistry is tuned for: ${livePhase.neuroScience}`,
      actionPlan: [
        `🎯 Step 1: ${livePhase.recommendedActivity}`,
        `⚡ Step 2: Avoid ${livePhase.whatToAvoid.toLowerCase()}`,
        `⏱️ Step 3: Log a ${livePhase.durationMins}-minute session to maintain daily velocity.`,
      ],
      actions: [
        {
          label: `💻 Switch to ${livePhase.bestTrack === "gov" ? "Govt Exam" : "MERN Track"}`,
          type: "select_track",
          track: livePhase.bestTrack === "gov" ? "gov" : "mern",
        },
        {
          label: `⏱️ Start ${livePhase.durationMins}m Focus Timer`,
          type: "start_timer",
          mins: livePhase.durationMins,
          sound: "gamma",
        },
        {
          label: "🥊 60s Rapid Drill",
          type: "open_drill",
        },
      ],
    };
  };

  const handleAsk = (queryText) => {
    const textToAnalyze = (queryText || queryInput).trim();
    if (!textToAnalyze) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const decision = generateDecision(textToAnalyze);
      setActiveAdvice(decision);
      setIsAnalyzing(false);

      // Save in history
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.query !== textToAnalyze);
        const updated = [decision, ...filtered].slice(0, 8);
        try {
          localStorage.setItem("copilot_history", JSON.stringify(updated));
        } catch (e) {
          console.debug("Failed to cache history:", e);
        }
        return updated;
      });

      showToast?.("🤖 Smart Copilot analyzed your request!", "info");
    }, 350);
  };

  // ── Timer Logic ───────────────────────────────────────────────────
  const startTimer = (mins, sound = "rain") => {
    stopTimer();
    setTimerDurationMins(mins);
    setTimerSecondsLeft(mins * 60);
    setIsTimerRunning(true);
    setTimerSound(sound);

    if (sound === "gamma") playGamma40Hz(0.12);
    else if (sound === "brown") playBrownNoise(0.15);
    else if (sound === "rain") playRainAmbience(0.15);
    else stopAmbientSound();

    showToast?.(`⏱️ Started ${mins}-minute countdown with ${sound} audio!`, "success");
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
    stopAmbientSound();
  };

  const resumeTimer = () => {
    setIsTimerRunning(true);
    if (timerSound === "gamma") playGamma40Hz(0.12);
    else if (timerSound === "brown") playBrownNoise(0.15);
    else if (timerSound === "rain") playRainAmbience(0.15);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsLeft(null);
    stopAmbientSound();
  };

  useEffect(() => {
    if (isTimerRunning && timerSecondsLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTimerRunning && timerSecondsLeft === 0) {
      stopTimer();
      playCompletionChime();
      showToast?.("🔔 Time is up! Outstanding execution!", "success");
    }
    return () => clearTimeout(timerRef.current);
  }, [isTimerRunning, timerSecondsLeft, showToast]);

  // Handle action click
  const executeAction = (action) => {
    if (action.type === "start_timer") {
      startTimer(action.mins, action.sound || "rain");
      const el = document.getElementById("copilot-timer-card");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (action.type === "shift_schedule") {
      onShiftSchedule?.(action.mins || 60);
    } else if (action.type === "select_track") {
      onSelectTrack?.(action.track);
    } else if (action.type === "open_drill") {
      onOpenDrill?.();
    } else if (action.type === "open_vault") {
      onOpenVault?.();
    } else if (action.type === "open_rescue") {
      onOpenRescue?.();
    } else if (action.type === "open_bedtime") {
      const btn = document.getElementById("header-bedtime-btn");
      if (btn) btn.click();
    } else if (action.type === "open_books") {
      const btn = document.getElementById("header-books-btn");
      if (btn) btn.click();
    }
  };

  const formatTimerTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-xl border border-indigo-500/30 space-y-5 relative overflow-hidden">
      {/* Background glow highlights */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-bark flex items-center justify-center text-lg font-black shadow-md flex-shrink-0">
            <i className="fa-solid fa-robot animate-pulse"></i>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-black text-base sm:text-lg text-white tracking-wide flex items-center gap-2">
                <span>AI Daily Copilot & Smart Decision Hub</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                  Adaptive Engine
                </span>
              </h2>
            </div>
            <p className="text-xs text-indigo-200/90 mt-0.5">
              Ask any situation (e.g. <em>"want to sleep for 1 hour"</em>, <em>"only 30m free"</em>, <em>"brain is fried"</em>) for real-time neuroscience advice & 1-click schedule adaptation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-white/10 text-teal-300 border border-teal-400/30 flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            {liveClock} • {livePhase.name}
          </span>
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 text-xs font-bold transition-all border border-white/10 cursor-pointer flex items-center gap-1"
              title="View recent queries"
            >
              <i className="fa-solid fa-clock-rotate-left text-[11px]"></i>
              <span className="hidden sm:inline">Recent</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Search / Question Bar ── */}
      <div className="space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex items-center gap-2 bg-black/40 border border-indigo-400/40 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-amber-400/70 transition-all shadow-inner"
        >
          <div className="pl-2.5 text-indigo-400">
            <i className="fa-solid fa-wand-magic-sparkles text-sm text-amber-300"></i>
          </div>
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Type your state or question: e.g. 'I want to sleep for 1 hour right now', 'Feeling unmotivated', '30m free'..."
            className="flex-1 bg-transparent text-white placeholder-indigo-300/60 text-xs sm:text-sm font-semibold focus:outline-none px-2 py-1.5"
          />
          {queryInput && (
            <button
              type="button"
              onClick={() => setQueryInput("")}
              className="text-white/60 hover:text-white text-xs px-2 cursor-pointer"
              title="Clear input"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
          <button
            type="submit"
            disabled={isAnalyzing || !queryInput.trim()}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm rounded-lg transition-all shadow-md flex items-center gap-1.5 cursor-pointer flex-shrink-0"
          >
            {isAnalyzing ? (
              <>
                <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-bolt-lightning text-xs"></i>
                <span>Get Advice</span>
              </>
            )}
          </button>
        </form>

        {/* ── Quick-Prompt Chips ── */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-indigo-300/80">
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-fire text-amber-400"></i> Quick Daily Dilemmas:
            </span>
            <span className="text-[10px] text-indigo-300/60 hidden sm:inline">Click any chip for instant recommendation</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            {QUICK_PROMPTS.map((qp) => (
              <button
                key={qp.id}
                type="button"
                onClick={() => {
                  setQueryInput(qp.query);
                  handleAsk(qp.query);
                }}
                className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-indigo-400/50 text-indigo-100 hover:text-white transition-all cursor-pointer shadow-xs"
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── History Dropdown ── */}
      {showHistory && history.length > 0 && (
        <div className="bg-black/30 border border-white/10 rounded-xl p-3 text-xs space-y-2 animate-fadeIn">
          <div className="font-bold text-indigo-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-clock-rotate-left text-amber-300"></i> Recent Copilot Queries:
            </span>
            <button
              onClick={() => {
                setHistory([]);
                localStorage.removeItem("copilot_history");
              }}
              className="text-[10px] text-rose-300 hover:underline cursor-pointer"
            >
              Clear History
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {history.map((h, i) => (
              <div
                key={i}
                onClick={() => {
                  setActiveAdvice(h);
                  setShowHistory(false);
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all truncate"
              >
                <div className="font-bold text-amber-200 text-[11px] truncate">"{h.query}"</div>
                <div className="text-[10px] text-indigo-300/80 truncate mt-0.5">{h.verdict}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Active Advice Card ── */}
      {activeAdvice && (
        <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-black/60 border border-indigo-400/40 rounded-xl p-4 sm:p-5 space-y-4 shadow-lg animate-fadeIn">
          {/* Top Verdict Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${activeAdvice.badgeColor}`}>
                  {activeAdvice.badge}
                </span>
                <span className="text-[11px] font-bold text-indigo-300">
                  Question: "{activeAdvice.query}"
                </span>
              </div>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-amber-300 leading-snug">
                {activeAdvice.verdict}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveAdvice(null)}
              className="self-end sm:self-auto text-white/50 hover:text-white text-xs cursor-pointer p-1"
              title="Close advice"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* 🔬 Why this is best */}
          <div className="bg-black/30 border border-white/10 rounded-xl p-3.5 space-y-1.5">
            <div className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
              <i className="fa-solid fa-brain"></i>
              <span>Why This is Science-Backed & Optimal Right Now:</span>
            </div>
            <p className="text-xs text-indigo-100/90 leading-relaxed">
              {activeAdvice.why}
            </p>
          </div>

          {/* 📋 Step-by-Step Action Plan */}
          <div className="space-y-2">
            <div className="text-xs font-extrabold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
              <i className="fa-solid fa-list-check"></i>
              <span>Immediate Action Plan:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {activeAdvice.actionPlan.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-indigo-100/90 leading-snug flex flex-col justify-between"
                >
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ⚡ 1-Click Interactive Actions */}
          {activeAdvice.actions?.length > 0 && (
            <div className="pt-2 border-t border-white/10">
              <div className="text-[11px] font-bold text-indigo-300/90 mb-2 flex items-center gap-1.5">
                <i className="fa-solid fa-bolt text-amber-400"></i>
                <span>1-Click Immediate Actions:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {activeAdvice.actions.map((act, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => executeAction(act)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-400/50 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>{act.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Built-In Nap / Sprint Live Timer Card ── */}
      <div
        id="copilot-timer-card"
        className="bg-black/30 border border-indigo-500/20 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-400/20 text-teal-300 flex items-center justify-center text-xs font-bold">
              <i className="fa-solid fa-stopwatch"></i>
            </span>
            <h4 className="font-display font-bold text-sm text-white">
              Integrated Nap & Focus Timer
            </h4>
            {isTimerRunning && (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 animate-pulse">
                Running
              </span>
            )}
          </div>
          <p className="text-xs text-indigo-200/80">
            Set a gentle nap or focus sprint timer with pure Web Audio background soundscapes & wake-up chime.
          </p>
        </div>

        {/* Timer Display & Controls */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Digits Display */}
          <div className="bg-slate-950 border border-indigo-400/40 rounded-xl px-4 py-2 text-center min-w-[110px] shadow-inner">
            <div className="font-mono font-black text-xl sm:text-2xl text-amber-300 tracking-wider">
              {timerSecondsLeft !== null
                ? formatTimerTime(timerSecondsLeft)
                : `${String(timerDurationMins).padStart(2, "0")}:00`}
            </div>
            <div className="text-[9px] uppercase tracking-widest text-indigo-300/70 font-bold">
              {isTimerRunning ? "Remaining" : "Preset"}
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5">
            {[
              { m: 15, l: "15m Sprint" },
              { m: 25, l: "25m Nap/Focus" },
              { m: 60, l: "60m Rest" },
              { m: 90, l: "90m Deep" },
            ].map((p) => (
              <button
                key={p.m}
                type="button"
                onClick={() => startTimer(p.m, timerSound)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                  timerDurationMins === p.m && !isTimerRunning
                    ? "bg-amber-400 text-slate-950 border-amber-300"
                    : "bg-white/5 hover:bg-white/15 border-white/10 text-indigo-200 hover:text-white"
                }`}
              >
                {p.l}
              </button>
            ))}
          </div>

          {/* Sound Selector & Timer Buttons */}
          <div className="flex items-center gap-1.5">
            {isTimerRunning ? (
              <>
                <button
                  type="button"
                  onClick={pauseTimer}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1"
                >
                  <i className="fa-solid fa-pause"></i> Pause
                </button>
                <button
                  type="button"
                  onClick={stopTimer}
                  className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-rose-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  title="Reset Timer"
                >
                  <i className="fa-solid fa-rotate-left"></i>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (timerSecondsLeft !== null && timerSecondsLeft > 0) {
                    resumeTimer();
                  } else {
                    startTimer(timerDurationMins, timerSound);
                  }
                }}
                className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-lg text-xs font-black transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <i className="fa-solid fa-play text-[10px]"></i> Start
              </button>
            )}

            {/* Ambient Soundscape selector */}
            <select
              value={timerSound}
              onChange={(e) => {
                const val = e.target.value;
                setTimerSound(val);
                if (isTimerRunning) {
                  if (val === "gamma") playGamma40Hz(0.12);
                  else if (val === "brown") playBrownNoise(0.15);
                  else if (val === "rain") playRainAmbience(0.15);
                  else stopAmbientSound();
                }
              }}
              className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-indigo-200 font-bold focus:outline-none cursor-pointer"
              title="Ambient soundscape while timer runs"
            >
              <option value="rain">🌧️ Rain</option>
              <option value="brown">🟫 Brown Noise</option>
              <option value="gamma">🧠 40Hz Gamma</option>
              <option value="off">🔇 Audio Off</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
