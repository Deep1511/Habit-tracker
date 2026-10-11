import { useState, useEffect } from "react";

export const WALL_STICKY_NOTES = [
  {
    id: "note_running",
    title: "05:30 AM RUNNING ANCHOR",
    category: "Morning Anchor",
    location: "Above Bed / Next to Morning Alarm",
    locationIcon: "fa-bed",
    color: "yellow",
    bgColor: "bg-amber-100/95",
    borderColor: "border-amber-300",
    pinColor: "text-rose-500",
    tilt: "-rotate-1",
    tagline: "Shoes on before the brain starts making excuses.",
    bulletPoints: [
      "05:30 AM – 06:30 AM Outside Run",
      "No negotiations with sleepiness",
      "Morning sweat = all-day dopamine!",
      "Hydrate: 500ml water + pinch of salt",
    ],
    quote: "Win the first 60 minutes, win the entire day.",
  },
  {
    id: "note_detox",
    title: "SCREEN DETOX GUARD (< 30M)",
    category: "Focus & Discipline",
    location: "Phone Charging Dock / Desk Corner",
    locationIcon: "fa-mobile-screen-button",
    color: "rose",
    bgColor: "bg-rose-100/95",
    borderColor: "border-rose-300",
    pinColor: "text-amber-500",
    tilt: "rotate-1",
    tagline: "If you don't control attention, algorithms control you.",
    bulletPoints: [
      "ZERO Instagram Reels / Doomscrolling",
      "Screen time strictly capped < 30 mins",
      "Phone locked in drawer during study",
      "09:30 PM Night Digital Lockout",
    ],
    quote: "Every reel watched is a future interview offer delayed.",
  },
  {
    id: "note_dsa",
    title: "THE 1-CORE PROBLEM RULE",
    category: "DSA & Problem Solving",
    location: "Center of Study Monitor / Desk Wall",
    locationIcon: "fa-code",
    color: "blue",
    bgColor: "bg-sky-100/95",
    borderColor: "border-sky-300",
    pinColor: "text-emerald-500",
    tilt: "-rotate-2",
    tagline: "Master 1 problem deeply rather than rushing 5.",
    bulletPoints: [
      "Target: Exactly 1 core problem per day",
      "Dry-run on paper FIRST, code SECOND",
      "Trace variables on notepad with sample array",
      "1 problem/day × 45 days = 45 core patterns",
    ],
    quote: "Real interviewers test dry-runs, not typing speed.",
  },
  {
    id: "note_office",
    title: "OFFICE SPRINT PROTOCOL",
    category: "Career Acceleration",
    location: "Office Laptop Edge / Work Desk",
    locationIcon: "fa-briefcase",
    color: "emerald",
    bgColor: "bg-emerald-100/95",
    borderColor: "border-emerald-300",
    pinColor: "text-indigo-500",
    tilt: "rotate-1",
    tagline: "Turn office free windows into your career booster.",
    bulletPoints: [
      "10:00 AM → Naukri Pro 2-min profile ping",
      "02:30 PM → 1 DSA Paper Dry-Run (45 mins)",
      "04:30 PM → LeetCode Code & Submit (30 mins)",
      "Evening Temple visit: Reset mental clarity",
    ],
    quote: "2 hours of daily office focus = 10 hours of extra leverage/week.",
  },
  {
    id: "note_identity",
    title: "ATOMIC IDENTITY STATEMENT",
    category: "Mindset & Identity",
    location: "Main Dressing Mirror / Bedroom Door",
    locationIcon: "fa-fire",
    color: "purple",
    bgColor: "bg-purple-100/95",
    borderColor: "border-purple-300",
    pinColor: "text-amber-500",
    tilt: "-rotate-1",
    tagline: "I am an Elite Full-Stack & GenAI Engineer.",
    bulletPoints: [
      "I run every morning with discipline",
      "I read hardcopy books every day",
      "I solve 1 DSA pattern and build MERN daily",
      "Discipline = Freedom and self-respect",
    ],
    quote: "Every action is a vote for the type of person you wish to become.",
  },
  {
    id: "note_sleep",
    title: "11:00 PM SLEEP ANCHOR",
    category: "Rest & Recovery",
    location: "Bedside Table / Night Lamp",
    locationIcon: "fa-moon",
    color: "amber",
    bgColor: "bg-amber-100/95",
    borderColor: "border-amber-300",
    pinColor: "text-rose-500",
    tilt: "rotate-2",
    tagline: "Tomorrow's victory starts tonight.",
    bulletPoints: [
      "11:00 PM Sharp: Lights out & eye mask",
      "6.0 Hours deep restorative sleep",
      "Room cool, pitch-dark, no screens",
      "Wake up 04:30 AM refreshed & unstoppable",
    ],
    quote: "Sleep is the ultimate cognitive superpower.",
  },
];

export const HIGHLIGHTER_GUIDE = {
  brands: [
    {
      name: "Faber-Castell Textliner 38 / 1546 Pastel",
      badge: "Best Budget & Easy to Buy",
      desc: "Water-based pastel ink that doesn't bleed through standard paperback or book pages. Soft on the eyes.",
      rating: "⭐⭐⭐⭐⭐",
      availability: "Amazon / Local Stationery / Blinkit",
    },
    {
      name: "Stabilo Boss Original Pastel",
      badge: "World's Classic Standard",
      desc: "Chunky ergonomic grip, anti-dry-out technology (can stay open 4 hours), very subtle pastel tones.",
      rating: "⭐⭐⭐⭐⭐",
      availability: "Amazon / Premium Stationery",
    },
    {
      name: "Zebra Mildliner (Double-Ended)",
      badge: "Elite Choice for Serious Readers",
      desc: "Has both chisel tip and fine bullet tip. Translucent mild ink engineered specifically not to bleed through thin paper.",
      rating: "⭐⭐⭐⭐⭐",
      availability: "Amazon / Import Stationery",
    },
  ],
  colors: [
    {
      colorName: "Soft Pastel Yellow / Sand",
      bgStyle: "bg-amber-200 border-amber-300 text-amber-950",
      rule: "Core Concepts & Golden Laws",
      limit: "Max 1 to 2 lines per page",
      example: '"You do not rise to the level of your goals. You fall to the level of your systems."',
    },
    {
      colorName: "Soft Pastel Mint / Green",
      bgStyle: "bg-emerald-200 border-emerald-300 text-emerald-950",
      rule: "Actionable Habits & Frameworks",
      limit: "Things you will implement tomorrow",
      example: '"After I pour my morning water, I will write today\'s DSA problem on paper."',
    },
    {
      colorName: "Soft Pastel Peach / Coral",
      bgStyle: "bg-orange-200 border-orange-300 text-orange-950",
      rule: "Eye-Opening Truths & Warnings",
      limit: "Mental traps or false beliefs",
      example: '"Motion is not action. Spending hours planning is not the same as executing."',
    },
  ],
};

export default function StickyNotesStudioModal({ onClose, showToast }) {
  const [activeTab, setActiveTab] = useState("stickies"); // 'stickies' | 'highlighters' | 'notebooks'
  const [stuckStatus, setStuckStatus] = useState(() => {
    try {
      const saved = localStorage.getItem("wall_sticky_notes_status");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("wall_sticky_notes_status", JSON.stringify(stuckStatus));
    } catch (e) {
      console.error(e);
    }
  }, [stuckStatus]);

  const toggleStuck = (id) => {
    setStuckStatus((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id] && showToast) {
        showToast("📌 Marked as Stuck on Your Wall! Keep up the momentum!", "success");
      }
      return next;
    });
  };

  const copyNoteText = (note) => {
    const text = `📌 ${note.title}\n📍 Place: ${note.location}\n\n"${note.tagline}"\n\nKey Rules:\n${note.bulletPoints.map((b) => `• ${b}`).join("\n")}\n\nQuote: "${note.quote}"`;
    navigator.clipboard?.writeText(text);
    setCopiedId(note.id);
    if (showToast) {
      showToast(`Copied "${note.title}" to clipboard! Ready to write on paper.`, "info");
    }
    setTimeout(() => setCopiedId(null), 2200);
  };

  const totalStuck = Object.values(stuckStatus).filter(Boolean).length;

  return (
    <div
      className="modal-overlay fixed inset-0 z-[100] bg-bark/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel bg-[#fdfbf7] w-full max-w-5xl rounded-3xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-cream-deep">
        {/* ── HEADER ── */}
        <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-cream-deep bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-xl text-amber-300 shadow-sm">
              📌
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Study &amp; Environment Kit
                </span>
                <span className="text-[10px] font-bold text-stone-300 flex items-center gap-1">
                  <i className="fa-solid fa-thumbtack text-amber-400 text-[9px]"></i>
                  {totalStuck} of 6 Stuck on Real Wall
                </span>
              </div>
              <h2 className="font-display font-black text-lg sm:text-xl text-white tracking-tight mt-0.5">
                Wall Sticky Notes &amp; Highlighter Blueprint
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-white/10 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* ── NAVIGATION TABS ── */}
        <div className="px-5 sm:px-7 py-2.5 bg-stone-100 border-b border-cream-deep flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("stickies")}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "stickies"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-bark-muted hover:text-bark hover:bg-white/60"
            }`}
          >
            <i className="fa-solid fa-note-sticky text-amber-200"></i>
            <span>6 Real Wall Sticky Notes</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 text-white">
              {totalStuck}/6 Stuck
            </span>
          </button>

          <button
            onClick={() => setActiveTab("highlighters")}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "highlighters"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-bark-muted hover:text-bark hover:bg-white/60"
            }`}
          >
            <i className="fa-solid fa-highlighter text-amber-200"></i>
            <span>Highlighter Blueprint &amp; 3 Colors</span>
          </button>

          <button
            onClick={() => setActiveTab("notebooks")}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "notebooks"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-bark-muted hover:text-bark hover:bg-white/60"
            }`}
          >
            <i className="fa-solid fa-book-bookmark text-amber-200"></i>
            <span>Book &amp; DSA Notebook Method</span>
          </button>
        </div>

        {/* ── MODAL BODY ── */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* ══════════════════════════════════════════════════════════════
              TAB 1: 6 REAL WALL STICKY NOTES
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === "stickies" && (
            <div className="space-y-6">
              {/* Guidance Banner */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">📌</span>
                  <div>
                    <h3 className="font-display font-extrabold text-sm text-amber-950">
                      Physical Environment Design (From Atomic Habits)
                    </h3>
                    <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
                      "Make the cues obvious." Write these 6 notes on actual 3×3 sticky notes with a dark pen and place them in the exact spots listed below. Check off each box once it's stuck on your wall!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-3 py-1.5 rounded-xl border border-amber-300">
                    {totalStuck === 6 ? "🎉 All 6 Notes on Wall!" : `${6 - totalStuck} left to write`}
                  </span>
                </div>
              </div>

              {/* Sticky Notes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {WALL_STICKY_NOTES.map((note) => {
                  const isStuck = !!stuckStatus[note.id];
                  const isCopied = copiedId === note.id;

                  return (
                    <div
                      key={note.id}
                      className={`relative rounded-2xl p-5 border shadow-md transition-all duration-300 flex flex-col justify-between group ${
                        note.bgColor
                      } ${note.borderColor} ${note.tilt} hover:rotate-0 hover:shadow-xl hover:scale-[1.02]`}
                    >
                      {/* Realistic Push-Pin / Tape Graphic */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white/90 border border-stone-300 shadow-md flex items-center justify-center text-xs">
                        <i className={`fa-solid fa-thumbtack ${note.pinColor}`}></i>
                      </div>

                      {/* Header & Location */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2 pt-1">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/10 text-stone-800">
                            {note.category}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyNoteText(note)}
                            className="text-[11px] font-bold text-stone-700 hover:text-stone-900 px-2 py-0.5 rounded bg-white/70 hover:bg-white border border-black/10 flex items-center gap-1 cursor-pointer transition-colors"
                            title="Copy text for writing"
                          >
                            <i className={`fa-solid ${isCopied ? "fa-check text-emerald-600" : "fa-copy"}`}></i>
                            <span>{isCopied ? "Copied!" : "Copy"}</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-800 mb-2 bg-white/60 px-2.5 py-1 rounded-lg border border-black/5">
                          <i className={`fa-solid ${note.locationIcon} text-amber-700 text-xs`}></i>
                          <span className="truncate">📍 {note.location}</span>
                        </div>

                        <h4 className="font-display font-black text-sm text-stone-900 leading-snug">
                          {note.title}
                        </h4>

                        <p className="text-xs italic text-stone-700 mt-1 mb-3 font-medium">
                          "{note.tagline}"
                        </p>

                        {/* Bullet Points */}
                        <ul className="space-y-1.5 text-xs text-stone-800 mb-4">
                          {note.bulletPoints.map((pt, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 leading-snug">
                              <span className="text-stone-500 font-bold">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Footer & Stuck Checkbox */}
                      <div className="pt-3 border-t border-black/10 flex items-center justify-between gap-2">
                        <span className="text-[10px] italic text-stone-600 line-clamp-1">
                          "{note.quote}"
                        </span>

                        <label className="flex items-center gap-1.5 text-xs font-black cursor-pointer bg-white/80 hover:bg-white px-2.5 py-1 rounded-xl border border-black/10 transition-colors flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={isStuck}
                            onChange={() => toggleStuck(note.id)}
                            className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500"
                          />
                          <span className={isStuck ? "text-emerald-800" : "text-stone-700"}>
                            {isStuck ? "Stuck ✓" : "Stick on Wall"}
                          </span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 2: HIGHLIGHTER BLUEPRINT & COLOR CODING
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === "highlighters" && (
            <div className="space-y-6">
              {/* Core Philosophy */}
              <div className="bg-stone-900 text-white rounded-2xl p-5 border border-stone-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🖍️</span>
                  <h3 className="font-display font-black text-base text-amber-400">
                    The Anti-Bleed Pastel Highlighting Rule
                  </h3>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed max-w-3xl">
                  <strong>Never use cheap fluorescent neon yellow/pink markers on paperbacks!</strong> Neon inks are too wet, soak through standard 70gsm book paper, and create visual clutter that strains your brain. Use soft <em>Pastel Water-Based Chisel Markers</em> and limit yourself strictly to <strong>maximum 1 to 2 lines per page</strong>.
                </p>
              </div>

              {/* Recommended Brands */}
              <div>
                <h4 className="font-display font-black text-sm uppercase tracking-wider text-bark mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-award text-amber-500"></i>
                  Top 3 Recommended Highlighters (Zero Bleed-Through)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {HIGHLIGHTER_GUIDE.brands.map((b, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-cream-deep p-4 space-y-2.5 shadow-2xs hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                          {b.badge}
                        </span>
                        <span className="text-xs">{b.rating}</span>
                      </div>
                      <h5 className="font-bold text-sm text-bark">{b.name}</h5>
                      <p className="text-xs text-bark-muted leading-relaxed">{b.desc}</p>
                      <div className="pt-2 border-t border-cream-deep text-[11px] text-bark-muted flex items-center gap-1">
                        <i className="fa-solid fa-cart-shopping text-stone-400 text-[10px]"></i>
                        <span>{b.availability}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3-Color Coding System */}
              <div>
                <h4 className="font-display font-black text-sm uppercase tracking-wider text-bark mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-palette text-indigo-500"></i>
                  The 3-Color Highlighting System (Your Reading Compass)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {HIGHLIGHTER_GUIDE.colors.map((c, idx) => (
                    <div
                      key={idx}
                      className={`rounded-2xl p-4 border space-y-2.5 shadow-2xs ${c.bgStyle}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider">
                          {c.colorName}
                        </span>
                        <span className="text-[10px] font-bold bg-white/70 px-2 py-0.5 rounded">
                          {c.limit}
                        </span>
                      </div>
                      <h5 className="font-extrabold text-sm leading-tight">{c.rule}</h5>
                      <div className="bg-white/80 p-3 rounded-xl border border-black/5 text-xs italic leading-relaxed">
                        {c.example}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 3: NOTE-TAKING NOTEBOOKS & METHODS
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === "notebooks" && (
            <div className="space-y-6">
              {/* Part 1: Book Note-taking */}
              <div className="bg-white rounded-2xl border border-cream-deep p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                    📖
                  </span>
                  <div>
                    <h3 className="font-display font-black text-sm sm:text-base text-bark">
                      Method 1: The "Back-Cover Index" (For Hardcopy Books)
                    </h3>
                    <p className="text-xs text-bark-muted">
                      Never copy sentences into a separate diary. Turn the book into your personal reference guide.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2">
                    <h4 className="font-extrabold text-stone-900 flex items-center gap-1.5">
                      <i className="fa-solid fa-pen text-amber-600"></i>
                      What to Write on the Back Inside Cover:
                    </h4>
                    <p className="text-stone-700 leading-relaxed">
                      Every time you encounter a game-changing chapter, open the blank inside page of the book's back cover and write <strong>Page # + 1-line summary</strong>:
                    </p>
                    <div className="bg-white p-3 rounded-lg border border-stone-200 font-mono text-[11px] text-stone-800 space-y-1">
                      <div>p. 27 → 1% Daily Compound Effect</div>
                      <div>p. 42 → Habit Stacking Formula: After [X], I do [Y]</div>
                      <div>p. 89 → Make it Obvious: Redesign your physical room</div>
                      <div>p. 132 → 2-Minute Rule for starting hard tasks</div>
                    </div>
                  </div>

                  <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200 space-y-2">
                    <h4 className="font-extrabold text-amber-950 flex items-center gap-1.5">
                      <i className="fa-solid fa-pencil text-amber-600"></i>
                      Margin Penciling Rule:
                    </h4>
                    <p className="text-amber-900 leading-relaxed">
                      Keep a 0.5mm mechanical pencil. In the outer margin of the page, write only <strong>1 to 3 words</strong> summarizing the paragraph:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-amber-900">
                      <li><code>[Identity Shift]</code> next to paragraph about belief</li>
                      <li><code>[Environment Cue]</code> next to phone distraction warning</li>
                      <li><code>[Friction Rule]</code> next to removing junk food or apps</li>
                    </ul>
                    <p className="text-[11px] font-semibold text-emerald-800 mt-2">
                      ✓ In 6 months, you can revise an entire 300-page book in under 5 minutes!
                    </p>
                  </div>
                </div>
              </div>

              {/* Part 2: DSA Dry-Run Notebook */}
              <div className="bg-white rounded-2xl border border-cream-deep p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                    💻
                  </span>
                  <div>
                    <h3 className="font-display font-black text-sm sm:text-base text-bark">
                      Method 2: The Physical Spiral "DSA Dry-Run &amp; Intuition Vault"
                    </h3>
                    <p className="text-xs text-bark-muted">
                      Your single notebook for technical interviews. Never write 50 lines of syntax. Write logic &amp; tracing only!
                    </p>
                  </div>
                </div>

                {/* Notebook Page Mockup */}
                <div className="bg-gradient-to-br from-indigo-50/60 to-white rounded-2xl border-2 border-dashed border-indigo-200 p-5 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-indigo-200 pb-2">
                    <span className="font-bold text-indigo-900">TITLE: Day 3 – Reverse Array (Two Pointers)</span>
                    <span className="text-[11px] text-stone-500">DATE: 2026-10-14</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-amber-800 font-bold uppercase text-[10px]">1. Intuition (Plain Words):</span>
                    <p className="text-stone-800 bg-white p-2.5 rounded-lg border border-indigo-100 font-sans">
                      "Left starts at 0, Right starts at end. Swap values at left &amp; right, then increment left and decrement right until pointers cross."
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-indigo-800 font-bold uppercase text-[10px]">2. Dry-Run Tracing Table:</span>
                    <div className="bg-white p-2.5 rounded-lg border border-indigo-100 space-y-1 text-[11px] text-stone-800">
                      <div>Input: <code>arr = [1, 2, 4, 7, 5]</code></div>
                      <div>Step 1: left=0 (1), right=4 (5) → SWAP → <code>[5, 2, 4, 7, 1]</code> (left++, right--)</div>
                      <div>Step 2: left=1 (2), right=3 (7) → SWAP → <code>[5, 7, 4, 2, 1]</code> (left++, right--)</div>
                      <div>Step 3: left=2, right=2 → Stop (left == right) ✓ Output: <code>[5, 7, 4, 2, 1]</code></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-indigo-200 pt-2 text-[11px]">
                    <span className="text-emerald-700 font-bold">COMPLEXITY: Time = O(N) | Space = O(1) in-place</span>
                    <span className="text-rose-700 font-bold">❌ NEVER WRITE BOILERPLATE SYNTAX ON PAPER!</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div className="px-5 sm:px-7 py-3.5 border-t border-cream-deep bg-cream/40 flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="text-bark-muted font-medium">
            💡 Tip: Put Note 1 &amp; Note 6 beside your bed tonight before sleeping!
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold cursor-pointer transition-colors shadow-xs"
          >
            Done &amp; Close Studio
          </button>
        </div>
      </div>
    </div>
  );
}
