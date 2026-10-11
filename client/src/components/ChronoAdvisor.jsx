import { useState, useEffect, useMemo } from "react";

export const CHRONO_PHASES = [
  {
    id: "dawn",
    name: "Dawn Ignition",
    timeRange: "4:30 AM – 8:30 AM",
    startHour: 4.5,
    endHour: 8.5,
    energyLevel: "High Alertness & Fresh Working Memory",
    energyBadge: "bg-emerald-100 text-emerald-800 border-emerald-300",
    icon: "fa-sun",
    theme: "emerald",
    bestTrack: "mern", // 'mern' | 'genai' | 'both'
    trackTitle: "💻 Striver DSA Algorithm Mastery & MERN Architecture",
    secondaryTrackTitle: "🏃 Plus: 30-Min Cardio & Hydration (6:30 AM)",
    durationMins: 60,
    neuroScience:
      "Cortisol peak + zero sleep debt. Your working memory buffers are completely clean, making it 2x easier to solve Blind 75 / Striver DSA patterns and architect full-stack components before work.",
    recommendedActivity:
      "Solve 1-2 Striver A2Z DSA problems (4:45 AM), do 30m cardio/run (6:30 AM), then build MERN architecture (7:00 AM). Do NOT touch social media.",
    whatToAvoid: "Opening Instagram, checking phone notifications, or breaking early morning focus.",
  },
  {
    id: "morning_peak",
    name: "Peak Executive Sprint",
    timeRange: "8:30 AM – 1:00 PM",
    startHour: 8.5,
    endHour: 13,
    energyLevel: "Peak Analytical & Logical Synthesis",
    energyBadge: "bg-indigo-100 text-indigo-800 border-indigo-300",
    icon: "fa-bolt-lightning",
    theme: "indigo",
    bestTrack: "mern",
    trackTitle: "💼 Office Deep Work & Professional Output",
    secondaryTrackTitle: "📵 Screen Guard: Phone inside bag/drawer (< 30m total)",
    durationMins: 60,
    neuroScience:
      "Prefrontal cortex neural firing is at its absolute daily peak. Maintain professional focus, write clean logic, and keep your phone locked away to protect dopamine receptors.",
    recommendedActivity:
      "Office deep work, code execution, or listening to technical audio lectures during transit.",
    whatToAvoid: "Instagram scrolling, casual office distractions, or checking phone.",
  },
  {
    id: "midday_dip",
    name: "Mid-Day Post-Lunch Slump (2 PM Window)",
    timeRange: "1:00 PM – 4:00 PM",
    startHour: 13,
    endHour: 16,
    energyLevel: "Low Cognitive Stamina (Post-Prandial Dip)",
    energyBadge: "bg-amber-100 text-amber-800 border-amber-300",
    icon: "fa-mug-hot",
    theme: "amber",
    bestTrack: "genai",
    trackTitle: "🤖 GenAI Conceptual Architecture & Visual Flows",
    secondaryTrackTitle: "💡 Or: 30-Sec Analogies in Anti-Boredom Vault",
    durationMins: 25,
    neuroScience:
      "Circadian dip in body temperature + insulin digestion curve. Working memory is low. Attempting heavy coding here causes friction. But conceptual GenAI architecture diagrams, prompt evaluation, and real-world analogies are effortless to absorb.",
    recommendedActivity:
      "Review GenAI Agent workflows, inspect vector DB embeddings, or read 3 analogies in the Anti-Boredom Vault. Zero heavy debugging!",
    whatToAvoid: "Mindless Instagram scrolling or opening reels out of afternoon boredom.",
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
    trackTitle: "💻 MERN Production Features & Code Execution",
    secondaryTrackTitle: "🤖 Or: AI Agent Tool Calling Integration",
    durationMins: 45,
    neuroScience:
      "Body temperature and alertness rebound. Brain shifts into practical execution and visual synthesis. Great for building tangible UI screens or wiring API endpoints.",
    recommendedActivity:
      "Build React UI components, style layouts, test API routes in Postman, or write agent tool definitions.",
    whatToAvoid: "Heavy theoretical reading without writing code.",
  },
  {
    id: "evening_mastery",
    name: "Evening Mastery & GenAI Deep Block",
    timeRange: "7:00 PM – 9:30 PM",
    startHour: 19,
    endHour: 21.5,
    energyLevel: "High-Focus Technical Innovation",
    energyBadge: "bg-purple-100 text-purple-800 border-purple-300",
    icon: "fa-brain",
    theme: "purple",
    bestTrack: "genai",
    trackTitle: "🤖 Generative AI, RAG Pipelines & AI Agents",
    secondaryTrackTitle: "🚶 Following 6:30 PM Walk & Healthy Dinner",
    durationMins: 60,
    neuroScience:
      "High capacity for building next-generation AI architectures: LLM orchestration, LangChain/CrewAI agentic loops, vector retrieval, and prompt engineering.",
    recommendedActivity:
      "Implement autonomous agent loops (ReAct pattern), integrate Pinecone/Chroma vector DBs, or benchmark prompt outputs (8:00 PM – 9:30 PM).",
    whatToAvoid: "Checking social media or letting mobile screen time creep past 30 mins.",
  },
  {
    id: "night_consolidation",
    name: "Night Digital Sunset & Memory Storage",
    timeRange: "9:30 PM – 10:30 PM",
    startHour: 21.5,
    endHour: 24,
    energyLevel: "Wind-Down & Neuroplastic Memory Storage",
    energyBadge: "bg-indigo-100 text-indigo-950 border-indigo-300",
    icon: "fa-moon",
    theme: "indigo",
    bestTrack: "both",
    trackTitle: "📵 Digital Sunset (Phone Locked Away) & 📖 Book Reading",
    secondaryTrackTitle: "😴 Lights Out by 10:30 PM for 6.0h Restorative Sleep",
    durationMins: 30,
    neuroScience:
      "Melatonin onset. Your hippocampus transfers today's MERN code and GenAI architecture into neocortex long-term memory during deep sleep. Zero blue light protects sleep spindle density.",
    recommendedActivity:
      "Lock phone inside drawer (9:30 PM), read 15-20 pages of book (Atomic Habits / Deep Work), and sleep by 10:30 PM to wake refreshed at 4:30 AM.",
    whatToAvoid: "Blue-light screens, phone scrolling in bed, or studying past 10:30 PM.",
  },
];

export function getCurrentChronoPhase() {
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;

  if (currentHour >= 4.5 && currentHour < 8.5) return CHRONO_PHASES[0]; // Dawn
  if (currentHour >= 8.5 && currentHour < 13) return CHRONO_PHASES[1]; // Morning Peak
  if (currentHour >= 13 && currentHour < 16) return CHRONO_PHASES[2]; // Midday Dip (2 PM)
  if (currentHour >= 16 && currentHour < 19) return CHRONO_PHASES[3]; // Afternoon Rebound
  if (currentHour >= 19 && currentHour < 21.5) return CHRONO_PHASES[4]; // Evening Mastery
  return CHRONO_PHASES[5]; // Night Consolidation (9:30 PM - 4:30 AM)
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
          <span>{showScienceDetails ? "Hide Why This Works" : "Why Midday Fits GenAI Concepts?"}</span>
        </button>
      </div>

      {/* ── Collapsible Scientific Breakdown (Explains why midday fits GenAI vs MERN) ── */}
      {showScienceDetails && (
        <div className="bg-white/10 border border-white/15 rounded-xl p-4 text-xs text-indigo-100 space-y-2.5 animate-fadeIn">
          <div className="font-bold text-white flex items-center gap-2 text-xs sm:text-sm">
            <i className="fa-solid fa-brain text-amber-300"></i>
            <span>The Science of Daily Brain Energy: Why MERN vs GenAI Timing Matters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="bg-black/20 p-3 rounded-lg border border-white/10 space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1">
                <i className="fa-solid fa-sun"></i> 🥪 The 1:00 PM – 3:30 PM (Mid-Day) Rule:
              </div>
              <p className="leading-relaxed text-indigo-100/90 text-[11px]">
                After lunch, your body enters a natural <strong>post-prandial temperature dip</strong>. Working memory drops. If you try to write raw complex MERN code or debug errors, your brain gets overwhelmed and gives you the <em>"lazy/quit"</em> signal.
                <br />
                <strong>The Solution:</strong> Switch to <strong>Generative AI architecture breakdowns, Prompt Engineering & Agent design videos</strong>! High-level conceptual diagrams require 60% less working memory than intense syntax debugging, allowing you to absorb state-of-the-art AI systems effortlessly.
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
