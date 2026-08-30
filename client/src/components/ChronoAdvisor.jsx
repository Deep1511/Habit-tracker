import { useState, useEffect, useMemo } from "react";

export const CHRONO_PHASES = [
  {
    id: "dawn",
    name: "Dawn Ignition",
    timeRange: "6:00 AM – 9:00 AM",
    startHour: 6,
    endHour: 9,
    energyLevel: "High Alertness & Fresh Working Memory",
    energyBadge: "bg-emerald-100 text-emerald-800 border-emerald-300",
    icon: "fa-sun",
    theme: "emerald",
    bestTrack: "gov", // 'gov' | 'mern' | 'both'
    trackTitle: "🏛️ Government Exam Mock Test & Aptitude Drills",
    secondaryTrackTitle: "💻 Or: Striver DSA 1-2 Logic Problems",
    durationMins: 45,
    neuroScience:
      "Cortisol peak + zero sleep debt. Your working memory buffers are completely clean, making it 2x easier to calculate numerical formulas and tackle full mock test drills before work.",
    recommendedActivity:
      "Solve 30-45 minutes of Quantitative Aptitude, Reasoning, or 1 fresh Striver DSA algorithm. Do NOT do passive reading.",
    whatToAvoid: "Social media, emails, and unstructured browsing.",
  },
  {
    id: "morning_peak",
    name: "Peak Executive Sprint",
    timeRange: "9:30 AM – 12:30 PM",
    startHour: 9.5,
    endHour: 12.5,
    energyLevel: "Peak Analytical & Logical Synthesis",
    energyBadge: "bg-indigo-100 text-indigo-800 border-indigo-300",
    icon: "fa-bolt-lightning",
    theme: "indigo",
    bestTrack: "mern",
    trackTitle: "💻 MERN Deep Architecture & Complex Code",
    secondaryTrackTitle: "🏛️ Or: High-Yield General Studies Deep Dive",
    durationMins: 60,
    neuroScience:
      "Prefrontal cortex neural firing is at its absolute daily peak. This is the golden window for abstract problem-solving, building complex React hooks, or writing backend Express/MongoDB schemas.",
    recommendedActivity:
      "Build a real React component, implement JWT/Middleware auth, or debug tough DSA logic in VS Code.",
    whatToAvoid: "Multitasking or checking notifications.",
  },
  {
    id: "midday_dip",
    name: "Mid-Day Post-Lunch Slump (2 PM Window)",
    timeRange: "1:00 PM – 3:30 PM",
    startHour: 13,
    endHour: 15.5,
    energyLevel: "Low Cognitive Stamina (Post-Prandial Dip)",
    energyBadge: "bg-amber-100 text-amber-800 border-amber-300",
    icon: "fa-mug-hot",
    theme: "amber",
    bestTrack: "gov",
    trackTitle: "🏛️ Government Exam: GK / Current Affairs / Polity Story Lecture",
    secondaryTrackTitle: "💡 Or: 30-Sec Analogies in Anti-Boredom Vault",
    durationMins: 25,
    neuroScience:
      "Circadian dip in body temperature + insulin digestion curve. Working memory is low. Attempting heavy coding or complex math here causes intense laziness and burnout! But story-based narrative (History, Polity, GK) requires 60% less brain strain and is effortless to absorb.",
    recommendedActivity:
      "Watch a 20-30 min video on Indian Polity / Current Affairs (70-80% easy completion) or review 3 real-world analogies in the Anti-Boredom Vault. Zero heavy coding!",
    whatToAvoid: "Complex algorithmic debugging or long textbook note-taking.",
  },
  {
    id: "afternoon_rebound",
    name: "Late Afternoon Rebound",
    timeRange: "4:00 PM – 6:30 PM",
    startHour: 16,
    endHour: 18.5,
    energyLevel: "Second Alertness Window & Motor Synthesis",
    energyBadge: "bg-cyan-100 text-cyan-800 border-cyan-300",
    icon: "fa-code",
    theme: "cyan",
    bestTrack: "mern",
    trackTitle: "💻 MERN UI & Feature Building / Quick Practice",
    secondaryTrackTitle: "🏛️ Or: 20-Question Speed Drill",
    durationMins: 45,
    neuroScience:
      "Body temperature and alertness rebound. Brain shifts into practical execution and visual synthesis. Great for coding tangible UI screens where you see immediate visual feedback.",
    recommendedActivity:
      "Build React UI components, style CSS/Tailwind, test API routes in Postman, or solve 15 speed aptitude questions.",
    whatToAvoid: "Heavy theoretical reading without writing code.",
  },
  {
    id: "evening_mastery",
    name: "Evening Mastery & Live Sprint",
    timeRange: "7:00 PM – 9:30 PM",
    startHour: 19,
    endHour: 21.5,
    energyLevel: "Interactive & Structured Focus",
    energyBadge: "bg-purple-100 text-purple-800 border-purple-300",
    icon: "fa-video",
    theme: "purple",
    bestTrack: "both",
    trackTitle: "💻 MERN Live Class / Machine Coding Round",
    secondaryTrackTitle: "🏛️ And: 30-Min Daily Current Affairs Revision",
    durationMins: 60,
    neuroScience:
      "High capacity for structured external inputs and interactive discussion (live lectures, peer mocks, or guided problem solving).",
    recommendedActivity:
      "Attend live tech class, do a machine coding drill, or review today's GK notes with high-intensity focus.",
    whatToAvoid: "Unstructured multitasking.",
  },
  {
    id: "night_consolidation",
    name: "Night Memory Consolidation",
    timeRange: "10:00 PM – 11:30 PM",
    startHour: 22,
    endHour: 24,
    energyLevel: "Wind-Down & Neuroplastic Memory Storage",
    energyBadge: "bg-indigo-100 text-indigo-950 border-indigo-300",
    icon: "fa-moon",
    theme: "indigo",
    bestTrack: "both",
    trackTitle: "📖 30-Min Book Reading (Mindset & Self-Discipline)",
    secondaryTrackTitle: "⚡ Plus: 5-Min Review of Today's Ticked Topics",
    durationMins: 30,
    neuroScience:
      "Melatonin onset. Your hippocampus prepares to consolidate today's learnings into long-term memory during sleep. Reading high-wisdom books primes a calm, focused mindset for tomorrow.",
    recommendedActivity:
      "Read 15-20 pages of a recommended book (Atomic Habits / Deep Work / Stoicism) and mentally review 2 concepts you ticked today.",
    whatToAvoid: "Blue-light screens, debugging code in bed, or stressful news.",
  },
];

export function getCurrentChronoPhase() {
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;

  if (currentHour >= 6 && currentHour < 9.5) return CHRONO_PHASES[0]; // Dawn
  if (currentHour >= 9.5 && currentHour < 13) return CHRONO_PHASES[1]; // Morning Peak
  if (currentHour >= 13 && currentHour < 16) return CHRONO_PHASES[2]; // Midday Dip (2 PM)
  if (currentHour >= 16 && currentHour < 19) return CHRONO_PHASES[3]; // Afternoon Rebound
  if (currentHour >= 19 && currentHour < 22) return CHRONO_PHASES[4]; // Evening Mastery
  return CHRONO_PHASES[5]; // Night Consolidation (10 PM - 6 AM)
}

export default function ChronoAdvisor({ onSelectTrack, onOpenVault, onOpenBedtimeSummary }) {
  const [currentTimeStr, setCurrentTimeStr] = useState("");
  const [selectedPhaseId, setSelectedPhaseId] = useState(null);
  const [showScienceDetails, setShowScienceDetails] = useState(false);

  // Update clock every minute
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTimeStr(
        d.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  const livePhase = useMemo(() => getCurrentChronoPhase(), [currentTimeStr]);
  const activePhase = useMemo(() => {
    if (!selectedPhaseId) return livePhase;
    return (
      CHRONO_PHASES.find((p) => p.id === selectedPhaseId) || livePhase
    );
  }, [selectedPhaseId, livePhase]);

  const isLive = !selectedPhaseId || selectedPhaseId === livePhase.id;

  const scrollToLogger = (trackType) => {
    onSelectTrack?.(trackType);
    const el = document.getElementById("study-session-logger-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-900 text-white rounded-2xl p-4 sm:p-5 shadow-md border border-indigo-700/50 space-y-4">
      {/* ── Top Bar: Live Clock & Title ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-amber-400 text-bark flex items-center justify-center text-sm font-black shadow-xs flex-shrink-0">
            <i className="fa-solid fa-clock"></i>
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-extrabold text-sm sm:text-base text-white">
                Real-Time Brain Advisor: What Should I Study Right Now?
              </h2>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
                {currentTimeStr || "Live Time"}
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-0.5">
              Backed by Circadian Chronobiology: Matches your subjects to your brain's natural energy curves so you never feel lazy or burned out.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowScienceDetails(!showScienceDetails)}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-100 text-xs font-bold transition-all flex items-center gap-1.5 border border-white/10 cursor-pointer"
        >
          <i className="fa-solid fa-circle-question text-amber-300 text-[11px]"></i>
          <span>{showScienceDetails ? "Hide Why This Works" : "Why 2 PM is Easy for Govt?"}</span>
        </button>
      </div>

      {/* ── Collapsible Scientific Breakdown (Explains why 2PM is easy for Govt vs MERN) ── */}
      {showScienceDetails && (
        <div className="bg-white/10 border border-white/15 rounded-xl p-4 text-xs text-indigo-100 space-y-2.5 animate-fadeIn">
          <div className="font-bold text-white flex items-center gap-2 text-xs sm:text-sm">
            <i className="fa-solid fa-brain text-amber-300"></i>
            <span>The Science of Daily Brain Energy: Why MERN vs Govt Timing Matters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="bg-black/20 p-3 rounded-lg border border-white/10 space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1">
                <i className="fa-solid fa-sun"></i> 🥪 The 1:00 PM – 3:30 PM (Mid-Day) Rule:
              </div>
              <p className="leading-relaxed text-indigo-100/90 text-[11px]">
                After lunch, your body enters a natural <strong>post-prandial temperature dip</strong>. Working memory drops. If you try to write complex MERN code or debug errors, your brain gets overwhelmed and gives you the <em>"lazy/quit"</em> signal.
                <br />
                <strong>The Solution:</strong> Switch to <strong>Government Exam videos (GK, History, Polity, English)</strong>! Story-driven narratives require 60% less mental energy, so you effortlessly finish 70-80% of the lecture without feeling lazy.
              </p>
            </div>

            <div className="bg-black/20 p-3 rounded-lg border border-white/10 space-y-1">
              <div className="font-bold text-teal-300 flex items-center gap-1">
                <i className="fa-solid fa-bolt"></i> ⚡ The 9:30 AM & 4:30 PM (Peak Alertness) Windows:
              </div>
              <p className="leading-relaxed text-indigo-100/90 text-[11px]">
                Your prefrontal cortex operates at maximum logical synthesis in the <strong>late morning (9:30 AM - 12:30 PM)</strong> and <strong>late afternoon (4:00 PM - 6:30 PM)</strong>.
                <br />
                <strong>The Solution:</strong> This is when you should open VS Code and write <strong>MERN Stack components, Striver DSA algorithms, and API endpoints</strong>!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Time Slot Strip (Clickable Daily Schedule Phases) ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {CHRONO_PHASES.map((phase) => {
          const isPhaseLive = phase.id === livePhase.id;
          const isSelected = phase.id === activePhase.id;
          return (
            <button
              key={phase.id}
              type="button"
              onClick={() => setSelectedPhaseId(phase.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                isSelected
                  ? "bg-white text-bark shadow-md border-white scale-[1.02]"
                  : "bg-white/10 hover:bg-white/20 text-indigo-100 border-white/10"
              }`}
            >
              <i className={`fa-solid ${phase.icon} ${isSelected ? "text-indigo-600" : "text-amber-300"}`}></i>
              <div className="text-left">
                <div className="leading-tight flex items-center gap-1">
                  <span>{phase.name}</span>
                  {isPhaseLive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" title="Current Time Window"></span>
                  )}
                </div>
                <div className={`text-[10px] ${isSelected ? "text-bark-muted" : "text-indigo-300"}`}>
                  {phase.timeRange}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Active Recommendation Card (Highlight of Current or Selected Time) ── */}
      <div className="bg-white/95 text-bark rounded-xl p-4 sm:p-5 shadow-lg border border-white space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cream-deep pb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              {isLive ? "🎯 Right Now Recommendation" : `⏳ Preview for ${activePhase.timeRange}`}
            </span>
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${activePhase.energyBadge}`}>
              {activePhase.energyLevel}
            </span>
          </div>

          <div className="text-xs font-bold text-bark-muted flex items-center gap-1.5">
            <i className="fa-regular fa-hourglass-half text-indigo-600"></i>
            <span>Recommended Session: <strong>{activePhase.durationMins} mins</strong></span>
          </div>
        </div>

        {/* Primary Subject Suggestion */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8 space-y-1.5">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-bark-light">
              Easiest & Most Productive Subject for This Window:
            </div>
            <div className="text-sm sm:text-base font-extrabold text-bark flex items-center gap-2">
              <span>{activePhase.trackTitle}</span>
            </div>
            <div className="text-xs text-bark-muted font-medium">
              {activePhase.secondaryTrackTitle}
            </div>
            <p className="text-xs text-bark-muted bg-cream/60 p-2.5 rounded-xl border border-cream-deep leading-relaxed mt-2">
              💡 <strong>Why right now:</strong> {activePhase.neuroScience}
            </p>
          </div>

          {/* Quick Action Trigger Buttons */}
          <div className="md:col-span-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => scrollToLogger(activePhase.bestTrack === "both" ? "mern" : activePhase.bestTrack)}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-bolt"></i>
              <span>Start {activePhase.durationMins}m Session in Logger</span>
            </button>

            {activePhase.id === "midday_dip" && (
              <button
                type="button"
                onClick={onOpenVault}
                className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-lightbulb text-amber-600"></i>
                <span>Read 30-Sec MERN Analogies (Low Brain Strain)</span>
              </button>
            )}

            {activePhase.id === "night_consolidation" && onOpenBedtimeSummary && (
              <button
                type="button"
                onClick={onOpenBedtimeSummary}
                className="w-full py-2 px-3 bg-gradient-to-r from-indigo-900 to-purple-900 hover:from-indigo-950 hover:to-purple-950 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-moon text-amber-300"></i>
                <span>Open Whole Day Bedtime Review</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Checklist & What to avoid */}
        <div className="pt-2 border-t border-cream-deep flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
          <div className="text-bark flex items-center gap-1.5">
            <i className="fa-solid fa-circle-check text-emerald-600"></i>
            <span><strong>Suggested Action:</strong> {activePhase.recommendedActivity}</span>
          </div>
          <div className="text-red-700 font-semibold flex items-center gap-1">
            <i className="fa-solid fa-ban text-red-500"></i>
            <span>Avoid: {activePhase.whatToAvoid}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
