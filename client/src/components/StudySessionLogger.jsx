import { useState, useEffect, useMemo, useRef } from "react";
import {
  getMernTracker,
  updateMernTracker,
  getExamTracker,
  updateExamTracker,
  getLocalCache,
} from "../api";
import { fmtDate, nowTimeStr } from "../scheduleData";
import {
  playGamma40Hz,
  playBrownNoise,
  playRainAmbience,
  stopAmbientSound,
  playCompletionChime,
} from "../soundEngine";

const DURATION_PRESETS = [
  { label: "15 min (Micro / Anti-Lazy)", value: 15, icon: "fa-bolt", desc: "Low friction start" },
  { label: "25 min (Pomodoro)", value: 25, icon: "fa-stopwatch", desc: "Classic focus" },
  { label: "45 min (Standard)", value: 45, icon: "fa-bullseye", desc: "Solid progress" },
  { label: "60 min (Deep Work)", value: 60, icon: "fa-fire", desc: "Deep concept dive" },
  { label: "90 min (Mastery)", value: 90, icon: "fa-rocket", desc: "Intense mock/coding" },
];

export const LIFE_WELLNESS_CATEGORIES = [
  {
    id: "clean_room",
    name: "🧹 Clean & Organize Bedroom",
    habitKey: "roomClean",
    icon: "fa-broom",
    topics: [
      { id: "cr_1", name: "Make Bed & Tidy Desk Workstation" },
      { id: "cr_2", name: "Room Vacuum / Sweep & Dusting" },
      { id: "cr_3", name: "Wardrobe & Laundry Fold / Organize" },
      { id: "cr_4", name: "Declutter Bookshelf & Cable Management" },
    ],
  },
  {
    id: "clean_washroom",
    name: "🧼 Clean & Sanitize Washroom",
    habitKey: "washroomClean",
    icon: "fa-soap",
    topics: [
      { id: "cw_1", name: "Scrub Sink, Countertop & Mirror" },
      { id: "cw_2", name: "Washroom Floor Scrub & Disinfect" },
      { id: "cw_3", name: "Complete Washroom Deep Clean & Fresh Towels" },
    ],
  },
  {
    id: "book_reading",
    name: "📖 Book Reading & Mindset",
    habitKey: "reading",
    icon: "fa-book-open-reader",
    topics: [
      { id: "br_1", name: "Atomic Habits (James Clear)" },
      { id: "br_2", name: "Deep Work: Rules for Focused Success (Cal Newport)" },
      { id: "br_3", name: "Can't Hurt Me (David Goggins)" },
      { id: "br_4", name: "The Psychology of Money (Morgan Housel)" },
      { id: "br_5", name: "Meditations (Marcus Aurelius - Stoic Wisdom)" },
      { id: "br_6", name: "Man's Search for Meaning (Viktor Frankl)" },
      { id: "br_7", name: "Personal Book Reading & Reflection" },
    ],
  },
  {
    id: "podcasts",
    name: "🎙️ Educational / Tech / Mindset Podcast",
    habitKey: "podcast",
    icon: "fa-podcast",
    topics: [
      { id: "pod_1", name: "Tech Architecture & Web Engineering Podcast" },
      { id: "pod_2", name: "Indian Polity & Current Affairs Audio Lecture" },
      { id: "pod_3", name: "Huberman Lab / Neuroscience & Peak Focus" },
      { id: "pod_4", name: "Startups, Business & Economic Analysis" },
    ],
  },
  {
    id: "fitness_routine",
    name: "🏃 Fitness, Push-ups & Fresh Air Walk",
    habitKey: "exercise",
    icon: "fa-person-running",
    topics: [
      { id: "fit_1", name: "Morning Push-ups & Calisthenics Routine" },
      { id: "fit_2", name: "Evening Fresh Air Walk (Sunlight & Decompression)" },
      { id: "fit_3", name: "Full Body Mobility & Posture Stretching" },
    ],
  },
  {
    id: "pooja_meditation",
    name: "🧘 Pooja, Meditation & Mindfulness",
    habitKey: "pooja",
    icon: "fa-hands-praying",
    topics: [
      { id: "pm_1", name: "Morning Pooja & Sacred Chanting" },
      { id: "pm_2", name: "10-Min Box Breathing & Mind Stillness Meditation" },
      { id: "pm_3", name: "15-Min Brain Fresh-Up & Neuro Game" },
    ],
  },
];

export default function StudySessionLogger({
  dateStr = fmtDate(new Date()),
  dayData = {},
  onSaveDay,
  onTrackersUpdated,
  showToast,
  refreshTrigger = 0,
  onOpenVault,
  onOpenBedtimeSummary,
}) {
  // ── Track: 'mern' | 'gov' | 'life' ──
  const [track, setTrack] = useState("mern"); // 'mern' | 'gov' | 'life'
  const [mernTracker, setMernTracker] = useState(() =>
    getLocalCache("mern_tracker", null)
  );
  const [examTracker, setExamTracker] = useState(() =>
    getLocalCache("exam_tracker", null)
  );
  const [loadingTrackers, setLoadingTrackers] = useState(
    () => !getLocalCache("mern_tracker", null) && !getLocalCache("exam_tracker", null)
  );

  // ── Selection State ──
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [customTopicName, setCustomTopicName] = useState("");
  const [topicSearch, setTopicSearch] = useState("");
  const [durationMins, setDurationMins] = useState(30);
  const [notes, setNotes] = useState("");
  const [confidenceRating, setConfidenceRating] = useState("moderate"); // 'tough' | 'moderate' | 'mastered'
  const [autoTickCovered, setAutoTickCovered] = useState(true);
  const [autoTickTest, setAutoTickTest] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Focus Timer & Ambient Soundscape ──
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState("stopwatch"); // 'stopwatch' | 'countdown'
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [countdownInitial, setCountdownInitial] = useState(15 * 60);
  const [showTimer, setShowTimer] = useState(false);
  const [ambientSound, setAmbientSound] = useState("off"); // 'off' | 'gamma_40hz' | 'brown_noise' | 'rain'
  const timerRef = useRef(null);

  // ── UI States ──
  const [showPlaybook, setShowPlaybook] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [postLogAdvice, setPostLogAdvice] = useState(null);
  const [sessionTimeMode, setSessionTimeMode] = useState("now"); // 'now' | 'custom'
  const [customSessionTime, setCustomSessionTime] = useState("");

  const TIME_PRESETS = [
    "7:30 AM",
    "9:30 AM",
    "11:30 AM",
    "12:30 PM",
    "2:15 PM",
    "3:45 PM",
    "4:45 PM",
    "8:15 PM",
    "9:45 PM",
  ];

  // ── Helper to calculate post-session advice (Always evaluates against current real-time clock & day of week) ──
  const getPostSessionAdvice = (lastLog) => {
    const d = new Date();
    const dayOfWeek = d.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const h = d.getHours() + d.getMinutes() / 60;
    const currentClock = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const isPastSession =
      lastLog?.time &&
      !lastLog.time.toLowerCase().includes(currentClock.split(":")[0]);

    if (isWeekend) {
      // ══════════════════════════════════════════════════════════════
      // WEEKEND SCHEDULE (Saturday & Sunday - Holiday / No Commute!)
      // ══════════════════════════════════════════════════════════════
      if (h >= 6 && h < 9.5) {
        return {
          isPastSession,
          currentClock,
          isWeekend: true,
          breakMins: 10,
          breakTitle: `🌅 Weekend Morning Flow (${currentClock})`,
          breakDesc: "Great weekend morning start! Stretch, hydrate, and prepare for Striver DSA at 9:30 AM.",
          nextTrack: "mern",
          nextTitle: "💻 MERN Prep — Striver DSA Problem Solving (9:30 AM – 11:00 AM)",
          nextDetail: "Solve Blind 75 / Top 150 DSA problems with high focus on time complexity.",
          altTrack: "gov",
          altTitle: "🏛️ Gov Exam Subject Sprint",
        };
      } else if (h >= 9.5 && h < 13.5) {
        return {
          isPastSession,
          currentClock,
          isWeekend: true,
          breakMins: 10,
          breakTitle: `☀️ Weekend Midday Sprint (${currentClock})`,
          breakDesc: "Keep your weekend momentum going before lunch and afternoon rest.",
          nextTrack: lastLog?.track === "mern" ? "gov" : "mern",
          nextTitle: "🏛️ Gov Exam Subject Sprint — Polity, History & GS (11:00 AM – 1:30 PM)",
          nextDetail: "Deep dive into GS and Polity story concepts before lunch at 1:30 PM.",
          altTrack: "mern",
          altTitle: "💻 MERN Striver DSA",
        };
      } else if (h >= 13.5 && h < 16.5) {
        return {
          isPastSession,
          currentClock,
          isWeekend: true,
          breakMins: 15,
          breakTitle: `☕ Weekend Afternoon Recharge (${currentClock})`,
          breakDesc: "Take a restful break, relax, and recharge your mind for evening sectional drills.",
          nextTrack: "gov",
          nextTitle: "🏛️ Gov Exam Sectional Drill — Quantitative Aptitude & Reasoning (4:30 PM – 6:30 PM)",
          nextDetail: "Solve 40-50 practice questions across speed math, arithmetic, and puzzles.",
          altTrack: "mern",
          altTitle: "💻 MERN Machine Coding",
        };
      } else if (h >= 16.5 && h < 18.5) {
        // 4:30 PM - 6:30 PM (e.g. 5:45 PM like right now on Sunday!)
        return {
          isPastSession,
          currentClock,
          isWeekend: true,
          breakMins: 10,
          breakTitle: `☕ Weekend Focus Flow (${currentClock})`,
          breakDesc: "It's the weekend (no office commute!). Continue your focused study until your 6:30 PM evening walk.",
          nextTrack: "gov",
          nextTitle: "🏛️ Gov Exam Sectional Practice (4:30 PM – 6:30 PM) ➡️ 🚶 Evening Walk (6:30 PM) ➡️ 🍲 Dinner (7:30 PM)",
          nextDetail: "Wrap up your math/reasoning drill, enjoy fresh air at 6:30 PM, then dinner at 7:30 PM and Gov Final Analysis at 8:30 PM!",
          altTrack: "mern",
          altTitle: "💻 MERN Full-Stack Sandbox",
        };
      } else if (h >= 18.5 && h < 20) {
        // 6:30 PM - 8:00 PM
        return {
          isPastSession,
          currentClock,
          isWeekend: true,
          breakMins: 15,
          breakTitle: `🚶 Weekend Evening Walk & Family Time (${currentClock})`,
          breakDesc: "No commute today! Enjoy a refreshing evening walk, relax with family, and have a good dinner.",
          nextTrack: "routine",
          nextTitle: "🍲 Dinner & Family Time (7:30 PM) ➡️ 🏛️ Gov Final Analysis (8:30 PM)",
          nextDetail: "Nutritious meal and mental reset before your 8:30 PM mock test analysis.",
          altTrack: "gov",
          altTitle: "🏛️ Gov Final Analysis (8:30 PM)",
        };
      } else {
        // 8:00 PM to Midnight
        return {
          isPastSession,
          currentClock,
          isWeekend: true,
          breakMins: 10,
          breakTitle: `🌙 Weekend Night Mastery (${currentClock})`,
          breakDesc: "Evening sprint before book reading and restful sleep.",
          nextTrack: lastLog?.track === "gov" ? "mern" : "gov",
          nextTitle: "🏛️ Gov Final Analysis (8:30 PM – 10:00 PM) ➡️ 💻 MERN Project Build (10:00 PM)",
          nextDetail: "Review your mock errors, then build your MERN project before 11:00 PM book reading.",
          altTrack: "reading",
          altTitle: "📖 Book Reading (11:00 PM)",
        };
      }
    }

    // ══════════════════════════════════════════════════════════════
    // WEEKDAY SCHEDULE (Monday - Friday with Commute Windows)
    // ══════════════════════════════════════════════════════════════
    if (h >= 6 && h < 8.25) {
      return {
        isPastSession,
        currentClock,
        breakMins: 10,
        breakTitle: "Quick 10-Min Hydration & Stretch",
        breakDesc: "Great morning start! Grab water, stretch, and get ready for your morning commute (8:15 AM).",
        nextTrack: "routine",
        nextTitle: "🚌 Morning Travel / Commute (8:15 AM – 9:30 AM)",
        nextDetail: "Listen to Daily Current Affairs podcast or audio tech lectures during transit.",
        altTrack: "gov",
        altTitle: "Review 5 Quick Math Formulas",
      };
    } else if (h >= 8.25 && h < 9.5) {
      return {
        isPastSession,
        currentClock,
        breakMins: 5,
        breakTitle: "Commute Transition",
        breakDesc: "You are in your morning travel window. Settle in and prepare for 9:30 AM deep coding.",
        nextTrack: "mern",
        nextTitle: "💻 MERN & Striver DSA Deep Sprint (9:30 AM – 11:30 AM)",
        nextDetail: "Your prefrontal cortex is at peak firing. Tackle 1-2 Striver DSA algorithms or JavaScript internals.",
        altTrack: "mern",
        altTitle: "React Architecture Sprint",
      };
    } else if (h >= 9.5 && h < 13.5) {
      return {
        isPastSession,
        currentClock,
        breakMins: 10,
        breakTitle: "10-Min Eye & Brain Pause",
        breakDesc: "Stand up, rest your eyes, drink water, and let your brain reset before your next block.",
        nextTrack: lastLog?.track === "mern" ? "gov" : "mern",
        nextTitle: lastLog?.track === "mern" ? "💻 MERN Full-Stack / 💼 Light Work" : "💻 MERN & DSA Coding Sprint",
        nextDetail: "Continue your focused sprint before lunch at 1:30 PM.",
        altTrack: "work",
        altTitle: "Flexible Company Tasks (11:30 AM – 12:30 PM)",
      };
    } else if (h >= 13.5 && h < 16) {
      // 1:30 PM - 4:00 PM (e.g. at 3:15 - 3:30 PM)
      return {
        isPastSession,
        currentClock,
        breakMins: 15,
        breakTitle: "☕ 15-Min Tea & Brain Reset (Until 3:45 PM)",
        breakDesc: "Awesome job on completing your afternoon session! Step away from the screen, stretch, and enjoy a warm cup of tea.",
        nextTrack: "gov",
        nextTitle: "🏛️ Govt Exam Sectional Practice: Quantitative Aptitude & Reasoning Drills (3:45 PM – 4:45 PM)",
        nextDetail: "Practice 20-30 timed speed calculation and puzzle questions while your afternoon alertness rebounds.",
        altTrack: "mern",
        altTitle: "💻 MERN Machine Coding & Full-Stack Sandbox (4:45 PM – 6:00 PM)",
      };
    } else if (h >= 16 && h < 18) {
      // 4:00 PM - 6:00 PM (e.g. 5:39 PM on Weekday)
      return {
        isPastSession,
        currentClock,
        breakMins: 10,
        breakTitle: `⏰ Pre-Travel Focus (Current Time: ${currentClock})`,
        breakDesc:
          "You are nearing the 6:00 PM Evening Commute window. Wrap up open code tabs, read 1 quick analogy in the Vault, or prep for transit.",
        nextTrack: "mern",
        nextTitle: "🚌 Evening Commute Home (6:00 PM – 7:00 PM) ➡️ 🍲 Dinner (7:30 PM) ➡️ 🏛️ Prime Mock Test (8:15 PM)",
        nextDetail:
          "Use 6:00 PM travel for audio podcasts & decompression, then get ready for your 8:15 PM Full Mock Test!",
        altTrack: "gov",
        altTitle: "🏛️ Prep for 8:15 PM Full Mock Test",
      };
    } else if (h >= 18 && h < 19) {
      // 6:00 PM - 7:00 PM
      return {
        isPastSession,
        currentClock,
        breakMins: 15,
        breakTitle: "🚌 Evening Commute Home (6:00 PM – 7:00 PM)",
        breakDesc: "Decompress from the day. Enjoy relaxing music or tech podcasts on your way home.",
        nextTrack: "routine",
        nextTitle: "🍲 Dinner & Family Time (7:30 PM – 8:15 PM)",
        nextDetail: "Nutritious meal to fuel your evening prime mock test at 8:15 PM.",
        altTrack: "gov",
        altTitle: "🏛️ Prep for 8:15 PM Full Mock Test",
      };
    } else {
      // Night (7:00 PM to midnight)
      return {
        isPastSession,
        currentClock,
        breakMins: 10,
        breakTitle: `🌙 Evening Focus (Current Time: ${currentClock})`,
        breakDesc: "Hydrate and stretch before your prime evening sprint.",
        nextTrack: lastLog?.track === "gov" ? "mern" : "gov",
        nextTitle:
          lastLog?.track === "gov"
            ? "💻 MERN 1-Pattern Tech Review / Live Class"
            : "🏛️ Govt Full Mock Test & Sectional Analysis (8:15 PM)",
        nextDetail:
          "Deep focused practice before night revision (10:45 PM) and book reading (11:30 PM).",
        altTrack: "reading",
        altTitle: "📖 Book Reading (11:30 PM)",
      };
    }
  };

  // ── Load Tracker Data ──
  const loadTrackers = async () => {
    try {
      const [mernData, examData] = await Promise.all([
        getMernTracker().catch(() => null),
        getExamTracker().catch(() => null),
      ]);
      if (mernData) setMernTracker(mernData);
      if (examData) setExamTracker(examData);
    } catch (e) {
      console.warn("StudySessionLogger sync info:", e);
    } finally {
      setLoadingTrackers(false);
    }
  };

  useEffect(() => {
    loadTrackers();
  }, [refreshTrigger]);

  // ── Get Active Subjects ──
  const activeSubjects = useMemo(() => {
    if (track === "mern") {
      return mernTracker?.subjects || [];
    } else if (track === "gov") {
      return examTracker?.subjects || [];
    } else {
      return LIFE_WELLNESS_CATEGORIES;
    }
  }, [track, mernTracker, examTracker]);

  // Set default subject if none selected or track switched
  useEffect(() => {
    if (activeSubjects.length > 0) {
      if (!selectedSubjectId || !activeSubjects.some((s) => s.id === selectedSubjectId)) {
        setSelectedSubjectId(activeSubjects[0].id);
        setSelectedTopicId("");
      }
    } else {
      setSelectedSubjectId("");
      setSelectedTopicId("");
    }
  }, [track, activeSubjects, selectedSubjectId]);

  // ── Get Topics for Selected Subject ──
  const currentSubject = useMemo(() => {
    return activeSubjects.find((s) => s.id === selectedSubjectId) || null;
  }, [activeSubjects, selectedSubjectId]);

  const currentTopics = useMemo(() => {
    return currentSubject?.topics || [];
  }, [currentSubject]);

  // ── All Topics in Selected Track (for global quick search) ──
  const allTrackTopics = useMemo(() => {
    const list = [];
    activeSubjects.forEach((sub) => {
      (sub.topics || []).forEach((t) => {
        list.push({
          ...t,
          subjectId: sub.id,
          subjectName: sub.name,
        });
      });
    });
    return list;
  }, [activeSubjects]);

  const filteredSearchTopics = useMemo(() => {
    if (!topicSearch.trim()) return [];
    const q = topicSearch.toLowerCase();
    return allTrackTopics.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.subjectName.toLowerCase().includes(q) ||
        (t.level && t.level.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [allTrackTopics, topicSearch]);

  // ── Today's Study Logs ──
  const todayLogs = useMemo(() => {
    return dayData?.studyLogs || [];
  }, [dayData]);

  const todayTotalMins = useMemo(() => {
    return todayLogs.reduce((acc, l) => acc + (Number(l.minutes) || 0), 0);
  }, [todayLogs]);

  const todayMernMins = useMemo(() => {
    return todayLogs
      .filter((l) => l.track === "mern")
      .reduce((acc, l) => acc + (Number(l.minutes) || 0), 0);
  }, [todayLogs]);

  const todayGovMins = useMemo(() => {
    return todayLogs
      .filter((l) => l.track === "gov")
      .reduce((acc, l) => acc + (Number(l.minutes) || 0), 0);
  }, [todayLogs]);

  const todayLifeMins = useMemo(() => {
    return todayLogs
      .filter((l) => l.track === "life")
      .reduce((acc, l) => acc + (Number(l.minutes) || 0), 0);
  }, [todayLogs]);

  // ── Focus Timer Effects ──
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (timerMode === "countdown") {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              setTimerRunning(false);
              playCompletionChime();
              showToast?.("⏰ 15-Minute Micro Focus Session Complete! Great work!", "success");
              setDurationMins(15);
              return 0;
            }
            return prev - 1;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timerMode, showToast]);

  const startStopwatch = () => {
    setTimerMode("stopwatch");
    setTimerSeconds(0);
    setTimerRunning(true);
    setShowTimer(true);
  };

  const start15mCountdown = () => {
    setTimerMode("countdown");
    setCountdownInitial(15 * 60);
    setTimerSeconds(15 * 60);
    setTimerRunning(true);
    setShowTimer(true);
    showToast?.("🚀 15-Minute Anti-Laziness Sprint Started! Just focus for 15 mins.", "info");
  };

  const applyTimerToDuration = () => {
    let mins = 0;
    if (timerMode === "stopwatch") {
      mins = Math.max(1, Math.round(timerSeconds / 60));
    } else {
      const elapsed = countdownInitial - timerSeconds;
      mins = Math.max(1, Math.round(elapsed / 60));
    }
    setDurationMins(mins);
    setTimerRunning(false);
    showToast?.(`Applied ${mins} mins from timer to session`, "info");
  };

  const formatTimerDisplay = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // ── "Pick 1 Micro-Topic for Me" (Anti-Decision Fatigue) ──
  const pickRandomPendingTopic = () => {
    const pending = allTrackTopics.filter((t) => !t.covered);
    if (pending.length === 0) {
      showToast?.("🎉 All topics in this track are already marked covered! Awesome!", "success");
      return;
    }
    // Prioritize important/starred topics first
    const importantPending = pending.filter((t) => t.important);
    const pool = importantPending.length > 0 ? importantPending : pending;
    const randomTopic = pool[Math.floor(Math.random() * pool.length)];

    setSelectedSubjectId(randomTopic.subjectId);
    setSelectedTopicId(randomTopic.id);
    setDurationMins(15);
    setTopicSearch("");
    showToast?.(
      `🎲 Suggested Micro-Topic: "${randomTopic.name}". Let's do 15 mins!`,
      "info"
    );
  };

  // ── Handle Session Logging & Auto-Tick ──
  const handleLogSession = async (e) => {
    if (e) e.preventDefault();
    if (!durationMins || durationMins <= 0) {
      showToast?.("Please enter a valid study duration in minutes", "warn");
      return;
    }

    let finalTopicName = "";
    let finalTopicId = selectedTopicId;
    let finalSubjectId = selectedSubjectId;
    let finalSubjectName = currentSubject?.name || "";

    if (selectedTopicId) {
      const matched = currentTopics.find((t) => t.id === selectedTopicId);
      finalTopicName = matched ? matched.name : "";
    } else if (customTopicName.trim()) {
      finalTopicName = customTopicName.trim();
    } else {
      showToast?.("Please select a topic/activity or enter a custom name", "warn");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Auto-Tick in Master Syllabus (MERN or Govt Exam)
      if (autoTickCovered && finalTopicId) {
        if (track === "mern" && mernTracker) {
          const updatedSubs = mernTracker.subjects.map((sub) => {
            if (sub.id !== finalSubjectId) return sub;
            return {
              ...sub,
              topics: sub.topics.map((t) => {
                if (t.id !== finalTopicId) return t;
                return {
                  ...t,
                  covered: true,
                  testDone: autoTickTest ? true : t.testDone,
                };
              }),
            };
          });
          const res = await updateMernTracker(updatedSubs);
          setMernTracker(res);
          onTrackersUpdated?.("mern", res);
        } else if (track === "gov" && examTracker) {
          const updatedSubs = examTracker.subjects.map((sub) => {
            if (sub.id !== finalSubjectId) return sub;
            return {
              ...sub,
              topics: sub.topics.map((t) => {
                if (t.id !== finalTopicId) return t;
                return {
                  ...t,
                  covered: true,
                  testDone: autoTickTest ? true : t.testDone,
                };
              }),
            };
          });
          const res = await updateExamTracker(updatedSubs);
          setExamTracker(res);
          onTrackersUpdated?.("gov", res);
        }
      }

      const recordedTime =
        sessionTimeMode === "custom" && customSessionTime.trim()
          ? customSessionTime.trim()
          : nowTimeStr();

      // 2. Build Study Log Entry
      const newLogEntry = {
        id: `log_${Date.now()}`,
        track,
        subjectId: finalSubjectId,
        subjectName: finalSubjectName,
        topicId: finalTopicId || null,
        topicName: finalTopicName,
        minutes: Number(durationMins),
        notes: notes.trim(),
        confidence: confidenceRating, // 'tough' | 'moderate' | 'mastered'
        autoTicked: autoTickCovered && !!finalTopicId,
        testDone: autoTickTest,
        timestamp: new Date().toISOString(),
        timeStr: recordedTime,
        time: recordedTime,
      };

      // 3. Update Day Habits & Study Minutes
      const currentHabits = dayData?.habits || {};
      const updatedHabits = { ...currentHabits };

      // Auto-tick relevant habit key for today
      if (track === "mern") {
        updatedHabits.mern = true;
        updatedHabits.mernMorning = true;
      } else if (track === "gov") {
        updatedHabits.gov = true;
        updatedHabits.govMorning = true;
      } else if (track === "life") {
        if (finalSubjectId === "book_reading" || finalTopicName.toLowerCase().includes("reading") || finalTopicName.toLowerCase().includes("book")) {
          updatedHabits.reading = true;
        }
        if (finalSubjectId === "fitness_routine" || finalTopicName.toLowerCase().includes("exercise") || finalTopicName.toLowerCase().includes("push") || finalTopicName.toLowerCase().includes("walk")) {
          updatedHabits.exercise = true;
        }
        if (finalSubjectId === "pooja_meditation" || finalTopicName.toLowerCase().includes("pooja") || finalTopicName.toLowerCase().includes("meditation")) {
          updatedHabits.pooja = true;
        }
        if (finalSubjectId === "clean_room" || finalTopicName.toLowerCase().includes("room") || finalTopicName.toLowerCase().includes("bed")) {
          updatedHabits.roomClean = true;
        }
        if (finalSubjectId === "clean_washroom" || finalTopicName.toLowerCase().includes("washroom")) {
          updatedHabits.washroomClean = true;
        }
        if (finalSubjectId === "podcasts" || finalTopicName.toLowerCase().includes("podcast")) {
          updatedHabits.podcast = true;
        }
      }

      const updatedLogs = [newLogEntry, ...(dayData?.studyLogs || [])];
      const prevMernMinutes = dayData?.mernMinutes || 0;
      const updatedMernMinutes =
        track === "mern"
          ? prevMernMinutes + Number(durationMins)
          : prevMernMinutes;

      const payload = {
        habits: updatedHabits,
        mernMinutes: updatedMernMinutes,
        craftMinutes: updatedMernMinutes,
        studyLogs: updatedLogs,
        sleepHours: dayData?.sleepHours ?? null,
        lateEntries: dayData?.lateEntries ?? {},
        taskOrder: dayData?.taskOrder ?? null,
        customTasks: dayData?.customTasks ?? null,
        pinnedTimes: dayData?.pinnedTimes ?? null,
      };

      await onSaveDay(dateStr, payload);

      const advice = getPostSessionAdvice(newLogEntry);
      setPostLogAdvice({
        session: newLogEntry,
        advice,
      });

      showToast?.(
        `🎯 Logged ${durationMins}m on "${finalTopicName}"! Activity tracked ✅`,
        "success"
      );

      // Reset fields
      setNotes("");
      setCustomTopicName("");
      setTopicSearch("");
      if (timerRunning) setTimerRunning(false);
      setShowTimer(false);
    } catch (e) {
      console.error("Failed to log study session:", e);
      showToast?.("Failed to save study session. Please try again.", "warn");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Delete a Log Entry ──
  const handleDeleteLog = async (logId) => {
    const targetLog = todayLogs.find((l) => l.id === logId);
    if (!targetLog) return;

    const updatedLogs = todayLogs.filter((l) => l.id !== logId);
    const prevMernMinutes = dayData?.mernMinutes || 0;
    const updatedMernMinutes =
      targetLog.track === "mern"
        ? Math.max(0, prevMernMinutes - Number(targetLog.minutes))
        : prevMernMinutes;

    const payload = {
      ...dayData,
      studyLogs: updatedLogs,
      mernMinutes: updatedMernMinutes,
      craftMinutes: updatedMernMinutes,
    };

    await onSaveDay(dateStr, payload);
    showToast?.(`Removed session for "${targetLog.topicName}"`, "info");
  };

  return (
    <section id="study-session-logger-section" className="bg-gradient-to-br from-white via-indigo-50/20 to-teal-50/20 rounded-2xl border border-indigo-200/80 p-4 sm:p-6 shadow-sm space-y-5">
      {/* ── Top Bar: Title & Quick Stats ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-cream-deep pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-teal-600 text-white flex items-center justify-center text-sm shadow-xs">
              <i className="fa-solid fa-bolt-lightning"></i>
            </span>
            <h2 className="font-display font-extrabold text-base sm:text-lg text-bark">
              Quick Study Logger & Auto-Tick Engine
            </h2>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Anti-Laziness Mode
            </span>
          </div>
          <p className="text-xs text-bark-muted mt-1">
            Log time & topics flexibly whenever you study — automatically ticks syllabus topics, tracks hours, and keeps streaks alive.
          </p>
        </div>

        {/* Action Badges & Stats */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white px-3 py-1.5 rounded-xl border border-cream-deep shadow-2xs text-right">
            <div className="text-[10px] font-bold text-bark-muted uppercase">Today's Study</div>
            <div className="text-xs font-black text-indigo-700">
              {todayTotalMins} mins{" "}
              <span className="text-[10px] font-semibold text-bark-light">
                ({(todayTotalMins / 60).toFixed(1)} hrs)
              </span>
            </div>
          </div>

          {todayLogs.length > 0 && !postLogAdvice && (
            <button
              type="button"
              onClick={() => {
                const latest = todayLogs[0];
                const adv = getPostSessionAdvice(latest);
                setPostLogAdvice({ session: latest, advice: adv });
              }}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="See what to do next based on your current real time"
            >
              <i className="fa-solid fa-circle-check text-emerald-600"></i>
              <span>What's Next Advice</span>
            </button>
          )}

          {onOpenBedtimeSummary && (
            <button
              type="button"
              onClick={onOpenBedtimeSummary}
              className="px-3 py-2 bg-gradient-to-r from-indigo-950 to-purple-950 hover:from-indigo-900 hover:to-purple-900 text-white border border-indigo-800 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Bedtime Whole Day Summary & Tomorrow's Improvement Compass"
            >
              <i className="fa-solid fa-moon text-amber-400"></i>
              <span>Bedtime Summary</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenVault}
            className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Bored or Lazy? Read 30-Sec MERN Analogies & Psychology Tricks"
          >
            <i className="fa-solid fa-lightbulb text-amber-600"></i>
            <span>Bored? Read Analogies</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPlaybook(!showPlaybook)}
            className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Read Anti-Laziness & Consistency Rules"
          >
            <i className="fa-solid fa-brain text-purple-600"></i>
            <span>{showPlaybook ? "Hide Guide" : "Anti-Laziness Guide"}</span>
          </button>
        </div>
      </div>

      {/* ── Collapsible Anti-Laziness Playbook ── */}
      {showPlaybook && (
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-teal-50 border border-purple-200/80 rounded-2xl p-4 sm:p-5 text-xs text-bark space-y-3">
          <div className="flex items-center justify-between font-bold text-purple-950 text-sm">
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-lightbulb text-amber-500"></i>
              Why Fixed Timetables Fail & How This Logger Fixes Procrastination
            </span>
            <button
              type="button"
              onClick={() => setShowPlaybook(false)}
              className="text-bark-light hover:text-bark text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="bg-white/80 rounded-xl p-3 border border-purple-100 shadow-2xs">
              <div className="font-bold text-indigo-700 flex items-center gap-1.5 mb-1">
                <i className="fa-solid fa-hourglass-start"></i> 1. The 15-Minute Rule
              </div>
              <p className="text-bark-muted leading-relaxed">
                When you feel lazy, never commit to "3 hours of study". Commit to only <strong>15 minutes</strong> on 1 micro-topic. 80% of laziness is starting friction—once momentum begins, you naturally keep going.
              </p>
            </div>
            <div className="bg-white/80 rounded-xl p-3 border border-purple-100 shadow-2xs">
              <div className="font-bold text-terra-dark flex items-center gap-1.5 mb-1">
                <i className="fa-solid fa-arrows-split-up-and-left"></i> 2. Energy-Based Switching
              </div>
              <p className="text-bark-muted leading-relaxed">
                High mental energy? Do <strong>MERN / Striver DSA coding</strong>. Tired or low motivation? Switch the track dropdown to <strong>Govt Exam GK, English, or Aptitude quizzes</strong>. No guilt!
              </p>
            </div>
            <div className="bg-white/80 rounded-xl p-3 border border-purple-100 shadow-2xs">
              <div className="font-bold text-emerald-700 flex items-center gap-1.5 mb-1">
                <i className="fa-solid fa-check-double"></i> 3. Dopamine from Auto-Tick
              </div>
              <p className="text-bark-muted leading-relaxed">
                Every logged session auto-ticks your master syllabus checklist and records daily streak minutes. Progress is permanent and visible immediately.
              </p>
            </div>
          </div>

          <div className="bg-white/90 rounded-xl p-3 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
            <div className="text-xs font-bold text-amber-950 flex items-center gap-2">
              <i className="fa-solid fa-bolt-lightning text-amber-500"></i>
              <span>Need instant inspiration? Read 10+ Real-World MERN Analogies (Backpack Closures, VIP Event Loop, etc.)</span>
            </div>
            <button
              type="button"
              onClick={onOpenVault}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs rounded-lg shadow-xs hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
            >
              <i className="fa-solid fa-book-open-reader"></i>
              <span>Open Mental Vault</span>
            </button>
          </div>
        </div>
      )}

      {/* ── SMART POST-SESSION ADVISOR BANNER ── */}
      {postLogAdvice && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border-2 border-emerald-300/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 animate-fadeIn relative">
          <button
            type="button"
            onClick={() => setPostLogAdvice(null)}
            className="absolute top-3 right-3 text-bark-light hover:text-bark text-xs font-black w-6 h-6 rounded-full bg-white/80 border border-cream-deep flex items-center justify-center cursor-pointer"
            title="Dismiss Advice"
          >
            ✕
          </button>

          <div className="flex items-center gap-2 flex-wrap pr-6">
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1.5 shadow-2xs">
              <i className="fa-solid fa-circle-check"></i>
              {postLogAdvice.advice.isPastSession ? "Past Session Logged!" : "Session Complete!"}
            </span>
            <span className="text-xs font-bold text-emerald-950">
              Completed: <strong>"{postLogAdvice.session.topicName}"</strong> ({postLogAdvice.session.minutes} mins{postLogAdvice.session.timeStr || postLogAdvice.session.time ? ` at ${postLogAdvice.session.timeStr || postLogAdvice.session.time}` : ""})
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 ml-auto flex items-center gap-1">
              <i className="fa-regular fa-clock"></i>
              <span>Real-Time: <strong>{postLogAdvice.advice.currentClock}</strong></span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* Step 1: Brain Rest Recommendation */}
            <div className="bg-white/95 p-3.5 rounded-xl border border-emerald-200 shadow-2xs space-y-1.5">
              <div className="font-extrabold text-xs text-amber-800 flex items-center gap-1.5">
                <i className="fa-solid fa-mug-hot text-amber-600"></i>
                <span>Step 1: {postLogAdvice.advice.breakTitle}</span>
              </div>
              <p className="text-[11px] text-bark-muted leading-relaxed">
                {postLogAdvice.advice.breakDesc}
              </p>
              <button
                type="button"
                onClick={() => {
                  setTimerMode("countdown");
                  setCountdownInitial(postLogAdvice.advice.breakMins * 60);
                  setTimerSeconds(postLogAdvice.advice.breakMins * 60);
                  setTimerRunning(true);
                  setShowTimer(true);
                  showToast?.(`☕ ${postLogAdvice.advice.breakMins}-Minute Timer started! Relax and prepare.`, "info");
                }}
                className="mt-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <i className="fa-solid fa-stopwatch text-amber-600"></i>
                <span>Start {postLogAdvice.advice.breakMins}-Min Timer</span>
              </button>
            </div>

            {/* Step 2: Next Recommended Study Window */}
            <div className="bg-white/95 p-3.5 rounded-xl border border-indigo-200 shadow-2xs space-y-1.5">
              <div className="font-extrabold text-xs text-indigo-900 flex items-center gap-1.5">
                <i className="fa-solid fa-compass text-indigo-600"></i>
                <span>Step 2: Recommended Real-Time Focus</span>
              </div>
              <div className="text-[11px] font-bold text-bark">
                {postLogAdvice.advice.nextTitle}
              </div>
              <p className="text-[11px] text-bark-muted leading-relaxed">
                {postLogAdvice.advice.nextDetail}
              </p>
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setTrack("gov");
                    setDurationMins(60);
                    setSelectedTopicId("");
                    setCustomTopicName("");
                    showToast?.("Set track to Government Exam! Pick your next drill topic.", "info");
                  }}
                  className="px-2.5 py-1 bg-terra-pale hover:bg-terra/10 text-terra border border-terra/30 font-bold text-[10px] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <i className="fa-solid fa-landmark"></i>
                  <span>Prep Next Gov Topic</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTrack("mern");
                    setDurationMins(60);
                    setSelectedTopicId("");
                    setCustomTopicName("");
                    showToast?.("Switched track to MERN Stack & DSA!", "info");
                  }}
                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-[10px] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <i className="fa-solid fa-code"></i>
                  <span>Switch to MERN / DSA</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenVault}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[10px] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <i className="fa-solid fa-lightbulb text-amber-500"></i>
                  <span>30-Sec Analogies</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Logger Form ── */}
      <form onSubmit={handleLogSession} className="space-y-4">
        {/* Row 1: Track Selector & "Pick 1 Micro-Topic" Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Track Switcher (Pill Toggle) */}
          <div className="flex items-center gap-1.5 bg-cream p-1 rounded-xl border border-cream-deep flex-wrap">
            <button
              type="button"
              onClick={() => {
                setTrack("mern");
                setSelectedTopicId("");
                setTopicSearch("");
              }}
              className={`px-3 py-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                track === "mern"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-bark-muted hover:text-bark hover:bg-white/60"
              }`}
            >
              <i className="fa-solid fa-code"></i>
              MERN & DSA Track
            </button>
            <button
              type="button"
              onClick={() => {
                setTrack("gov");
                setSelectedTopicId("");
                setTopicSearch("");
              }}
              className={`px-3 py-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                track === "gov"
                  ? "bg-terra-dark text-white shadow-xs"
                  : "text-bark-muted hover:text-bark hover:bg-white/60"
              }`}
            >
              <i className="fa-solid fa-landmark"></i>
              Government Exam Track
            </button>
            <button
              type="button"
              onClick={() => {
                setTrack("life");
                setSelectedTopicId("");
                setTopicSearch("");
              }}
              className={`px-3 py-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                track === "life"
                  ? "bg-teal-700 text-white shadow-xs"
                  : "text-bark-muted hover:text-bark hover:bg-white/60"
              }`}
            >
              <i className="fa-solid fa-spa"></i>
              Life, Cleaning & Self-Care
            </button>
          </div>

          {/* Micro-Topic Relief Button */}
          <button
            type="button"
            onClick={pickRandomPendingTopic}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            title="Automatically pick an unfinished topic to beat decision fatigue"
          >
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            <span>Too Lazy? Pick 1 Micro-Topic for Me</span>
          </button>
        </div>

        {/* Row 2: Subject & Topic Pickers + Global Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-4 rounded-xl border border-cream-deep shadow-2xs">
          {/* Subject Dropdown */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-[11px] font-bold text-bark uppercase tracking-wider flex items-center justify-between">
              <span>1. Select Subject</span>
              <span className="text-[10px] text-bark-light font-medium lowercase">
                {activeSubjects.length} subjects
              </span>
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                setSelectedTopicId("");
              }}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-cream-deep bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-bark cursor-pointer"
            >
              {activeSubjects.map((sub) => {
                const total = sub.topics?.length || 0;
                const done = sub.topics?.filter((t) => t.covered)?.length || 0;
                return (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({done}/{total} done)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Topic Dropdown / Smart Picker */}
          <div className="md:col-span-8 space-y-1 relative">
            <label className="text-[11px] font-bold text-bark uppercase tracking-wider flex items-center justify-between">
              <span>2. Select Syllabus Topic</span>
              <span className="text-[10px] text-bark-light font-medium">
                {currentTopics.length} topics in this subject
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              {/* Dropdown list of topics in current subject */}
              <div className="sm:col-span-8">
                <select
                  value={selectedTopicId}
                  onChange={(e) => {
                    setSelectedTopicId(e.target.value);
                    if (e.target.value) setCustomTopicName("");
                  }}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-cream-deep bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-bark cursor-pointer"
                >
                  <option value="">-- Choose a topic to auto-tick --</option>
                  {currentTopics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.covered ? "✅ " : "⏳ "}
                      {t.important ? "⭐ " : ""}
                      {t.name} {t.level ? `(${t.level})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Search trigger / Custom text */}
              <div className="sm:col-span-4 relative">
                <input
                  type="text"
                  placeholder="Or search all topics..."
                  value={topicSearch}
                  onFocus={() => setShowSearchDropdown(true)}
                  onChange={(e) => {
                    setTopicSearch(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-cream-deep bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />

                {/* Auto-suggest dropdown */}
                {showSearchDropdown && filteredSearchTopics.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border border-indigo-200 shadow-xl z-50 max-h-56 overflow-y-auto p-1.5 space-y-1">
                    <div className="text-[10px] font-bold text-bark-light px-2 py-1 uppercase">
                      Matching Syllabus Topics
                    </div>
                    {filteredSearchTopics.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedSubjectId(item.subjectId);
                          setSelectedTopicId(item.id);
                          setTopicSearch("");
                          setShowSearchDropdown(false);
                          showToast?.(`Selected: ${item.name}`, "info");
                        }}
                        className="p-2 rounded-lg hover:bg-indigo-50 cursor-pointer text-xs flex items-center justify-between gap-2 border border-transparent hover:border-indigo-100"
                      >
                        <div className="truncate">
                          <div className="font-semibold text-bark truncate">
                            {item.covered ? "✅ " : "⏳ "}
                            {item.name}
                          </div>
                          <div className="text-[10px] text-bark-light">{item.subjectName}</div>
                        </div>
                        {item.important && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold flex-shrink-0">
                            ⭐ Core
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Custom topic fallback */}
            {!selectedTopicId && (
              <div className="mt-1">
                <input
                  type="text"
                  placeholder="Or enter custom topic / drill (e.g. 50 Quantitative Aptitude Mock Questions, Express Middleware review)..."
                  value={customTopicName}
                  onChange={(e) => setCustomTopicName(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-dashed border-cream-deep bg-cream/30 text-bark focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Session Time & Duration + Built-in Timer */}
        <div className="bg-white p-4 rounded-xl border border-cream-deep shadow-2xs space-y-3.5">
          {/* Top sub-row: Time of Study Selection */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cream-deep pb-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <label className="text-[11px] font-bold text-bark uppercase tracking-wider flex items-center gap-1.5">
                <i className="fa-regular fa-clock text-indigo-600"></i>
                <span>When Did You Study?</span>
              </label>
              <div className="flex items-center gap-1 bg-cream p-0.5 rounded-lg border border-cream-deep">
                <button
                  type="button"
                  onClick={() => {
                    setSessionTimeMode("now");
                    setCustomSessionTime("");
                  }}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    sessionTimeMode === "now"
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "text-bark-muted hover:text-bark"
                  }`}
                >
                  ⚡ Just Now (Live)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSessionTimeMode("custom");
                    if (!customSessionTime) setCustomSessionTime("11:30 AM");
                  }}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    sessionTimeMode === "custom"
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "text-bark-muted hover:text-bark"
                  }`}
                >
                  🕒 Earlier Today (Past Time)
                </button>
              </div>
            </div>

            {/* Custom Past Time Input & Quick Chips */}
            {sessionTimeMode === "custom" && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-bark-muted">Time:</span>
                <input
                  type="text"
                  placeholder="e.g. 11:30 AM"
                  value={customSessionTime}
                  onChange={(e) => setCustomSessionTime(e.target.value)}
                  className="w-24 text-xs font-bold text-center px-2 py-1 rounded-lg border border-indigo-300 bg-indigo-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-indigo-900"
                />
                <div className="flex items-center gap-1 flex-wrap">
                  {TIME_PRESETS.slice(0, 6).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setCustomSessionTime(t)}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold border cursor-pointer ${
                        customSessionTime === t
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                          : "bg-cream text-bark-muted hover:bg-cream-dark border-cream-deep"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-[11px] font-bold text-bark uppercase tracking-wider flex items-center gap-2">
              <span>3. Duration Spent</span>
              <span className="text-[10px] font-normal text-bark-light lowercase">
                (select preset or enter minutes)
              </span>
            </label>

            {/* Timer & Focus Sound Toggle Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={start15mCountdown}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <i className="fa-solid fa-hourglass-start text-amber-600"></i>
                15m Sprint Timer
              </button>
              <button
                type="button"
                onClick={startStopwatch}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <i className="fa-solid fa-stopwatch text-indigo-600"></i>
                Live Stopwatch
              </button>

              {/* Ambient Soundscape Controller */}
              <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-cream-deep">
                <span className="text-[9px] font-extrabold text-bark-muted uppercase">
                  🎧 Focus Audio:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (ambientSound === "gamma_40hz") {
                      stopAmbientSound();
                      setAmbientSound("off");
                    } else {
                      playGamma40Hz();
                      setAmbientSound("gamma_40hz");
                      showToast?.("🧠 40Hz Gamma Focus Audio Active", "info");
                    }
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    ambientSound === "gamma_40hz"
                      ? "bg-purple-600 text-white animate-pulse"
                      : "text-bark-muted hover:text-purple-700"
                  }`}
                  title="40Hz Gamma Binaural Beats (Peak Memory & DSA Focus)"
                >
                  40Hz
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (ambientSound === "brown_noise") {
                      stopAmbientSound();
                      setAmbientSound("off");
                    } else {
                      playBrownNoise();
                      setAmbientSound("brown_noise");
                      showToast?.("🌧️ Deep Brown Noise Active", "info");
                    }
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    ambientSound === "brown_noise"
                      ? "bg-amber-700 text-white animate-pulse"
                      : "text-bark-muted hover:text-amber-800"
                  }`}
                  title="Deep Brown Noise (Background Masking)"
                >
                  Brown
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (ambientSound === "rain") {
                      stopAmbientSound();
                      setAmbientSound("off");
                    } else {
                      playRainAmbience();
                      setAmbientSound("rain");
                      showToast?.("☕ Gentle Rain Audio Active", "info");
                    }
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    ambientSound === "rain"
                      ? "bg-teal-700 text-white animate-pulse"
                      : "text-bark-muted hover:text-teal-800"
                  }`}
                  title="Gentle Rain Soundscape"
                >
                  Rain
                </button>
                {ambientSound !== "off" && (
                  <button
                    type="button"
                    onClick={() => {
                      stopAmbientSound();
                      setAmbientSound("off");
                    }}
                    className="text-red-500 hover:text-red-700 text-[10px] ml-0.5 cursor-pointer"
                    title="Stop Audio"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Live Timer Banner (if active) */}
          {showTimer && (
            <div className="bg-gradient-to-r from-indigo-900 to-teal-900 text-white rounded-xl p-3 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-mono font-bold text-base text-teal-300">
                  <i className={`fa-solid ${timerRunning ? "fa-circle-play" : "fa-circle-pause"}`}></i>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
                    {timerMode === "countdown" ? "15-Minute Focus Sprint" : "Live Study Stopwatch"}
                  </div>
                  <div className="font-mono font-extrabold text-xl text-white">
                    {formatTimerDisplay(timerSeconds)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  {timerRunning ? "Pause" : "Resume"}
                </button>
                <button
                  type="button"
                  onClick={applyTimerToDuration}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                >
                  Apply to Log
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTimerRunning(false);
                    setShowTimer(false);
                  }}
                  className="text-white/60 hover:text-white text-xs p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Duration Chips & Input */}
          <div className="flex flex-wrap items-center gap-2">
            {DURATION_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setDurationMins(preset.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  durationMins === preset.value
                    ? "bg-indigo-600 text-white shadow-xs scale-[1.02]"
                    : "bg-cream text-bark-muted hover:bg-cream-dark border border-cream-deep"
                }`}
              >
                <i className={`fa-solid ${preset.icon} text-[10px]`}></i>
                <span>{preset.label}</span>
              </button>
            ))}

            {/* Custom Minutes Input */}
            <div className="flex items-center gap-1.5 ml-auto">
              <input
                type="number"
                min="1"
                max="600"
                value={durationMins}
                onChange={(e) => setDurationMins(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-20 text-xs font-bold text-center px-2 py-1.5 rounded-xl border border-cream-deep bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <span className="text-xs font-bold text-bark-muted">mins</span>
            </div>
          </div>
        </div>

        {/* Row 4: Auto-Tick Options & Optional Notes */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-bark">
              <input
                type="checkbox"
                checked={autoTickCovered}
                onChange={(e) => setAutoTickCovered(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-400 cursor-pointer accent-indigo-600"
              />
              <span>Auto-Tick Topic in Master Roadmap (✅)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-bark">
              <input
                type="checkbox"
                checked={autoTickTest}
                onChange={(e) => setAutoTickTest(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-400 cursor-pointer accent-emerald-600"
              />
              <span>Mark Test / Drill Done (🧪)</span>
            </label>
          </div>

          <div className="md:col-span-6">
            <input
              type="text"
              placeholder="Session notes / takeaways (e.g. Completed Striver 3Sum/4Sum, memorized Art 21)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-cream-deep bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* Row 4.5: Spaced Repetition & Confidence Rating */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/80 p-3 rounded-xl border border-cream-deep">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-bark uppercase tracking-wider">
              🧠 Retention & Recall Difficulty:
            </span>
            <span className="text-[10px] text-bark-light">
              (Auto-schedules 5-min Spaced Recall)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setConfidenceRating("tough")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                confidenceRating === "tough"
                  ? "bg-red-600 text-white shadow-2xs scale-[1.02]"
                  : "bg-cream text-red-700 border border-red-200 hover:bg-red-50"
              }`}
            >
              <span>🔴 Tough (Review in 3d)</span>
            </button>
            <button
              type="button"
              onClick={() => setConfidenceRating("moderate")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                confidenceRating === "moderate"
                  ? "bg-amber-600 text-white shadow-2xs scale-[1.02]"
                  : "bg-cream text-amber-700 border border-amber-200 hover:bg-amber-50"
              }`}
            >
              <span>🟡 Moderate</span>
            </button>
            <button
              type="button"
              onClick={() => setConfidenceRating("mastered")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                confidenceRating === "mastered"
                  ? "bg-emerald-600 text-white shadow-2xs scale-[1.02]"
                  : "bg-cream text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
              }`}
            >
              <span>🟢 Mastered</span>
            </button>
          </div>
        </div>

        {/* Row 5: Big Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 via-teal-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white font-display font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Saving & Auto-Ticking Syllabus...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-circle-check text-base"></i>
                <span>Log {durationMins} Mins & Auto-Tick Topic Progress</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* ── Today's Study Activity Feed ── */}
      <div className="pt-2 border-t border-cream-deep">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-bark uppercase tracking-wider">
              Today's Completed Study Sessions
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {todayLogs.length} sessions logged
            </span>
          </div>

          {todayLogs.length > 0 && (
            <div className="text-xs font-bold text-bark-muted flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="text-indigo-700 font-extrabold">
                MERN: {todayMernMins}m
              </span>
              <span>•</span>
              <span className="text-terra-dark font-extrabold">
                Govt: {todayGovMins}m
              </span>
              <span>•</span>
              <span className="text-teal-700 font-extrabold">
                Life: {todayLifeMins}m
              </span>
            </div>
          )}
        </div>

        {todayLogs.length === 0 ? (
          <div className="bg-white/60 rounded-xl p-4 text-center border border-dashed border-cream-deep text-bark-muted text-xs">
            <i className="fa-solid fa-seedling text-emerald-500 text-lg mb-1 block"></i>
            <span>No activity sessions logged today yet. Click <strong>"Too Lazy? Pick 1 Micro-Topic"</strong> to do a quick 15-minute sprint and get started!</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {todayLogs.map((log) => {
              const isMern = log.track === "mern";
              const isLife = log.track === "life";
              return (
                <div
                  key={log.id}
                  className={`p-3 rounded-xl border flex flex-col justify-between transition-all bg-white ${
                    isMern
                      ? "border-indigo-200/80 hover:border-indigo-400"
                      : isLife
                      ? "border-teal-200/80 hover:border-teal-400"
                      : "border-terra/20 hover:border-terra/40"
                  } shadow-2xs`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            isMern
                              ? "bg-indigo-100 text-indigo-800"
                              : isLife
                              ? "bg-teal-100 text-teal-800 border border-teal-200"
                              : "bg-terra-pale text-terra-dark border border-terra/20"
                          }`}
                        >
                          {isMern ? "MERN & DSA" : isLife ? "Life & Wellness" : "Govt Exam"}
                        </span>
                        {log.confidence === "tough" && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                            🔴 Tough / Recall
                          </span>
                        )}
                        {log.confidence === "mastered" && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-200">
                            🟢 Mastered
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-bark-muted flex items-center gap-1">
                        <i className="fa-regular fa-clock text-[9px]"></i>
                        {log.minutes} mins • {log.timeStr || log.time}
                      </span>
                    </div>

                    <div className="font-bold text-xs text-bark leading-snug">
                      {log.topicName}
                    </div>

                    {log.subjectName && (
                      <div className="text-[10px] text-bark-light font-medium mt-0.5">
                        {log.subjectName}
                      </div>
                    )}

                    {log.notes && (
                      <div className="text-[10px] text-bark-muted bg-cream/50 p-1.5 rounded-lg mt-1.5 leading-snug italic">
                        "{log.notes}"
                      </div>
                    )}
                  </div>

                  <div className="mt-2 pt-2 border-t border-cream-deep/60 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      {log.autoTicked && (
                        <span className="flex items-center gap-1">
                          <i className="fa-solid fa-circle-check text-[10px]"></i>
                          Auto-Ticked
                        </span>
                      )}
                      {log.testDone && (
                        <span className="text-teal-700 font-bold">
                          • Test Done
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteLog(log.id)}
                      className="text-red-400 hover:text-red-600 font-semibold p-0.5 transition-colors cursor-pointer"
                      title="Undo / Delete this log entry"
                    >
                      <i className="fa-solid fa-trash-can text-[10px]"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
