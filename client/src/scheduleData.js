// ── Category styles ──────────────────────────────────────────

export const CAT_STYLES = {
  exercise: {
    dot: "bg-terra-light",
    text: "text-terra-light",
    bg: "bg-terra-pale",
    border: "border-terra/20",
    icon: "fa-dumbbell",
  },
  pooja: {
    dot: "bg-amber-600",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "fa-om",
  },
  gov: {
    dot: "bg-terra-dark",
    text: "text-terra-dark",
    bg: "bg-terra-pale",
    border: "border-terra/20",
    icon: "fa-book-bookmark",
  },
  mern: {
    dot: "bg-indigo-600",
    text: "text-indigo-600",
    bg: "bg-indigo-50/80",
    border: "border-indigo-200",
    icon: "fa-code",
  },
  reading: {
    dot: "bg-purple-600",
    text: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    icon: "fa-book-open",
  },
  brain: {
    dot: "bg-cyan-600",
    text: "text-cyan-700",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    icon: "fa-brain",
  },
  routine: {
    dot: "bg-bark-light",
    text: "text-bark-muted",
    bg: "bg-cream",
    border: "border-cream-deep",
    icon: "fa-circle",
  },
  work: {
    dot: "bg-bark-light/50",
    text: "text-bark-light",
    bg: "bg-cream",
    border: "border-cream-deep",
    icon: "fa-briefcase",
  },
  break: {
    dot: "bg-mint-light",
    text: "text-mint",
    bg: "bg-mint-pale",
    border: "border-mint/20",
    icon: "fa-mug-hot",
  },
  sleep: {
    dot: "bg-mint",
    text: "text-mint",
    bg: "bg-mint-pale",
    border: "border-mint/20",
    icon: "fa-bed",
  },
  winddown: {
    dot: "bg-bark-light",
    text: "text-bark-muted",
    bg: "bg-cream",
    border: "border-cream-deep",
    icon: "fa-moon",
  },
};

// ── Daily 15-Minute Rotating Brain Fresh-Up & Neuro Activation ─

export const BRAIN_FRESHUP_TASKS = {
  0: {
    dayName: "Sunday",
    title: "Tactical Chess Puzzle & Strategic Foresight",
    category: "Strategic Cognition",
    icon: "fa-chess-knight",
    durMins: 15,
    tag: "Decision Trees & Spatial Logic",
    instruction: "Solve 3-5 chess tactical puzzles (Lichess/Chess.com) or a Rubik's cube / spatial brain teaser. Plan 3 moves ahead before touching a piece.",
    neuroBenefit: "Activates prefrontal cortex neural pathways responsible for forward scenario planning, edge-case evaluation, and mental stamina.",
    quickActionUrl: "https://lichess.org/training",
    quickActionLabel: "Open Chess Puzzles",
  },
  1: {
    dayName: "Monday",
    title: "Sunlight Walk + Box Breathing (4-4-4-4)",
    category: "Neurochemical Reset",
    icon: "fa-sun",
    durMins: 15,
    tag: "Adenosine Clear & Dopamine Prime",
    instruction: "Drink 500ml water with pinch of salt. Step outside into natural morning sunlight. Walk while practicing Box Breathing (Inhale 4s, Hold 4s, Exhale 4s, Hold 4s).",
    neuroBenefit: "Clears sleep inertia (adenosine), triggers morning cortisol pulse for high alertness, and stabilizes autonomic nervous system.",
    quickActionUrl: "https://www.youtube.com/watch?v=F28MGLlpP90",
    quickActionLabel: "Box Breathing Guide",
  },
  2: {
    dayName: "Tuesday",
    title: "Speed Sudoku / Logic Grid + Cold Splash",
    category: "Analytical Spark",
    icon: "fa-table-cells",
    durMins: 15,
    tag: "Left-Hemisphere Activation",
    instruction: "Splash cold water on your face. Complete 1 medium-level Sudoku or Kakuro grid under a 10-minute timer without making notes.",
    neuroBenefit: "Stimulates working memory buffers, strengthens numerical deductive reasoning, and boosts dopamine upon pattern completion.",
    quickActionUrl: "https://sudoku.com",
    quickActionLabel: "Play Daily Sudoku",
  },
  3: {
    dayName: "Wednesday",
    title: "Visual Memory & Dual N-Back Pattern Recall",
    category: "Working Memory Capacity",
    icon: "fa-eye",
    durMins: 15,
    tag: "Memory Expansion",
    instruction: "Play 10 rounds of visual pattern memory or Dual N-Back game (BrainHQ / Human Benchmark). Test how many sequential shapes/numbers you can recall.",
    neuroBenefit: "Directly improves fluid intelligence (Gf) and short-term memory capacity, crucial for complex recursion and state trees in MERN.",
    quickActionUrl: "https://humanbenchmark.com/tests/visual-memory",
    quickActionLabel: "Test Visual Memory",
  },
  4: {
    dayName: "Thursday",
    title: "Speed Mental Math & Vedic Arithmetic Sprint",
    category: "Computational Agility",
    icon: "fa-calculator",
    durMins: 15,
    tag: "Prefrontal Cortex Speed",
    instruction: "Solve 20 quick mental calculations: 2-digit multiplications, squares up to 30, percentage shortcuts, and fast addition.",
    neuroBenefit: "Builds high-frequency synaptic firing in the parietal-frontal network, sharpening aptitude problem solving speed.",
    quickActionUrl: "https://arithmetic.zetamac.com",
    quickActionLabel: "Start Speed Math",
  },
  5: {
    dayName: "Friday",
    title: "Feynman Concept Sprint & Speed Journaling",
    category: "Semantic Deepening",
    icon: "fa-pen-nib",
    durMins: 15,
    tag: "Conceptual Clarity",
    instruction: "Pick 1 complex concept (e.g. React Fiber, Database Sharding, or Monotonic Stack). Write an explanation on blank paper as if teaching a 10-year-old in under 150 words.",
    neuroBenefit: "Forces active retrieval and reveals illusion of explanatory depth, cementing core mental models for technical interviews.",
    quickActionUrl: null,
    quickActionLabel: "Use Paper / Notes",
  },
  6: {
    dayName: "Saturday",
    title: "40Hz Gamma Sound Therapy & Goal Visualization",
    category: "Neural Synchronization",
    icon: "fa-headphones",
    durMins: 15,
    tag: "Focus & Anti-Burnout",
    instruction: "Put on headphones and listen to 40Hz binaural beats / ambient focus sound. Close eyes for 5 mins visualizing your dream engineering offer & exam success, then stretch.",
    neuroBenefit: "40Hz gamma oscillations induce state of hyper-focus and synaptic plasticity while lowering stress hormone cortisol.",
    quickActionUrl: "https://www.youtube.com/results?search_query=40hz+binaural+beats+focus",
    quickActionLabel: "Play 40Hz Audio",
  },
};

// ── Top Curated Life-Changing Books & Amazon Links ────────────

export const RECOMMENDED_BOOKS = [
  {
    id: "book_1",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Discipline & Daily Mastery",
    rating: "4.9/5",
    pages: 320,
    icon: "fa-arrows-spin",
    tag: "Essential #1",
    amazonUrl: "https://www.amazon.in/dp/1847941834?tag=books-recom-21",
    summary: "You do not rise to the level of your goals. You fall to the level of your systems. Tiny 1% daily improvements compound into life-changing mastery.",
    lifeLesson: "Focus on identity-based habits ('I am a disciplined engineer and consistent learner') rather than outcome-only goals. Make good habits obvious, attractive, easy, and satisfying.",
    quotes: "Success is the product of daily habits—not once-in-a-lifetime transformations.",
  },
  {
    id: "book_2",
    title: "Can't Hurt Me: Master Your Mind and Defy the Odds",
    author: "David Goggins",
    category: "Unstoppable Motivation & Mental Toughness",
    rating: "4.9/5",
    pages: 364,
    icon: "fa-fire-flame-curved",
    tag: "Pure Drive",
    amazonUrl: "https://www.amazon.in/dp/1544512287?tag=books-recom-21",
    summary: "The incredible story of turning extreme adversity and failure into unbreakable mental toughness as a Navy SEAL and ultra-endurance athlete.",
    lifeLesson: "The 40% Rule: When your mind tells you that you are exhausted and done, you are really only at 40% of your true capacity. Build a callus on your mind through intentional discomfort.",
    quotes: "You are in danger of living a life so comfortable and soft that you will die without ever realizing your true potential.",
  },
  {
    id: "book_3",
    title: "Deep Work: Rules for Focused Success",
    author: "Cal Newport",
    category: "Peak Cognitive Performance",
    rating: "4.8/5",
    pages: 304,
    icon: "fa-brain",
    tag: "Engineers Must-Read",
    amazonUrl: "https://www.amazon.in/dp/0349411904?tag=books-recom-21",
    summary: "The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy.",
    lifeLesson: "High-Quality Work Produced = (Time Spent) x (Intensity of Focus). Eliminate shallow social media dopamine traps and embrace prolonged distraction-free coding blocks.",
    quotes: "If you don't produce, you won't thrive—no matter how skilled or talented you are.",
  },
  {
    id: "book_4",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Wealth, Ego & Life Decisions",
    rating: "4.8/5",
    pages: 256,
    icon: "fa-coins",
    tag: "Financial Wisdom",
    amazonUrl: "https://www.amazon.in/dp/9390166268?tag=books-recom-21",
    summary: "Doing well with money has a little to do with how smart you are and a lot to do with how you behave. Timeless lessons on wealth, greed, and happiness.",
    lifeLesson: "True wealth is the ability to wake up every morning and say: 'I can do whatever I want today.' Freedom and peace of mind exceed luxury and status displays.",
    quotes: "Spending money to show people how much money you have is the fastest way to have less money.",
  },
  {
    id: "book_5",
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    category: "Purpose, Perspective & Inner Strength",
    rating: "4.9/5",
    pages: 200,
    icon: "fa-compass",
    tag: "Timeless Classic",
    amazonUrl: "https://www.amazon.in/dp/1846041244?tag=books-recom-21",
    summary: "Psychiatrist Viktor Frankl's profound memoir of surviving concentration camps and discovering that man's deepest desire is the search for meaning.",
    lifeLesson: "Everything can be taken from a man but one thing: the last of human freedoms—to choose one's attitude in any given set of circumstances.",
    quotes: "He who has a why to live for can bear almost any how.",
  },
  {
    id: "book_6",
    title: "Meditations",
    author: "Marcus Aurelius (Gregory Hays Translation)",
    category: "Stoicism & Emotional Mastery",
    rating: "4.8/5",
    pages: 254,
    icon: "fa-shield-halved",
    tag: "Stoic Philosophy",
    amazonUrl: "https://www.amazon.in/dp/0140449337?tag=books-recom-21",
    summary: "The private journal of the Roman Emperor Marcus Aurelius. One of the greatest spiritual and ethical reflections on duty, resilience, and tranquility.",
    lifeLesson: "You have power over your mind—not outside events. Realize this, and you will find unstoppable strength. Accept what you cannot control and master what you can.",
    quotes: "The impediment to action advances action. What stands in the way becomes the way.",
  },
];

// ── Top Interviewer & Professor Day-of-Week Curriculum ────────

export const DAY_TOPICS = {
  0: {
    dayName: "Sunday",
    dsa: "Blind 75 / Top 150 Timed DSA Mock Test",
    dsaDesc: "2 Medium + 1 Hard problem under interview timer. Focus on time complexity and edge cases.",
    mern: "Machine Coding & Mock Interview Defense",
    mernDesc: "Build a live full-stack feature (e.g. Real-time chat / Kanban / Autocomplete) & practice STAR behavioral questions.",
    badge: "Mock Test & Machine Coding",
    interviewTips: [
      "Explain your thought process aloud before writing code.",
      "State Time O(N) and Space O(1) complexity explicitly.",
      "Defend your tech choices (e.g. why MongoDB over SQL for this use case).",
    ],
  },
  1: {
    dayName: "Monday",
    dsa: "Arrays, Two Pointers & Sliding Window",
    dsaDesc: "Kadane's Algorithm, 3Sum, Trapping Rainwater, Longest Subarray Sum, Minimum Window Substring.",
    mern: "JavaScript Engine: Event Loop, Closures & Polyfills",
    mernDesc: "Call Stack, Microtasks vs Macrotasks, Memory Leaks, 'this' keyword, bind/call/apply, and custom Promise polyfills.",
    badge: "JS Core Internals & Arrays",
    interviewTips: [
      "Promise.then callbacks queue in the Microtask queue; setTimeout queues in Macrotask.",
      "Closures retain references to outer scope variables — beware of memory leaks in event listeners.",
      "Arrow functions do not have their own 'this' — they inherit from lexical scope.",
    ],
  },
  2: {
    dayName: "Tuesday",
    dsa: "Strings, HashMaps & Frequency Counters",
    dsaDesc: "Group Anagrams, Longest Substring Without Repeating Characters, Subarray Sum Equals K, Valid Palindrome.",
    mern: "React Architecture: Virtual DOM, Fiber & Custom Hooks",
    mernDesc: "Diffing algorithm, React 18 Fiber reconciliation, state batching, custom hooks design patterns, and useEffect lifecycle.",
    badge: "React Core & HashMaps",
    interviewTips: [
      "React 18 batches all state updates automatically, even inside async fetch callbacks.",
      "Fiber allows pauseable and interruptible rendering to keep high-priority user interactions responsive.",
      "Custom hooks share stateful logic, never the state itself.",
    ],
  },
  3: {
    dayName: "Wednesday",
    dsa: "Linked Lists, Stacks & Queues",
    dsaDesc: "Fast & Slow Pointers, Cycle Detection, Reverse Linked List, Monotonic Stack, LRU Cache implementation.",
    mern: "React Performance & State: useMemo, useCallback & Redux/Zustand",
    mernDesc: "Preventing unnecessary re-renders, React.memo pitfalls, Redux Toolkit slices vs Zustand, SSR & code splitting.",
    badge: "React Performance & Stacks",
    interviewTips: [
      "useCallback caches function definitions; useMemo caches computed values. Use them when passing callbacks to memoized children.",
      "Context API triggers re-renders for all consuming components when any part of value changes; Zustand allows fine-grained selectors.",
      "LRU Cache combines a HashMap for O(1) lookups and a Doubly Linked List for O(1) removals.",
    ],
  },
  4: {
    dayName: "Thursday",
    dsa: "Binary Trees & BSTs",
    dsaDesc: "BFS Level Order, DFS (Inorder/Preorder/Postorder), Lowest Common Ancestor, Diameter, Validate BST, Path Sum.",
    mern: "Node.js & Express: Libuv, Event Loop & JWT Auth",
    mernDesc: "Node.js architecture, streams, buffers, pipeline handling, middleware chaining, JWT access/refresh token rotation, and rate limiting.",
    badge: "Node.js Backend & Trees",
    interviewTips: [
      "Node.js Event Loop has 6 phases: Timers, Pending Callbacks, Idle/Prepare, Poll, Check (setImmediate), and Close.",
      "Streams prevent high RAM consumption by processing data chunk by chunk (Readable, Writable, Transform).",
      "Store access tokens in memory / short-lived cookies, and refresh tokens in HttpOnly, SameSite=Strict cookies.",
    ],
  },
  5: {
    dayName: "Friday",
    dsa: "Recursion, Backtracking & Heaps",
    dsaDesc: "Subsets, Permutations, Combination Sum, Top K Frequent Elements, Median from Data Stream.",
    mern: "MongoDB Mastery: Indexing, Aggregations & Sharding",
    mernDesc: "Compound vs Single index, Aggregation pipelines ($match, $group, $lookup, $unwind), explain('executionStats'), and ACID transactions.",
    badge: "MongoDB & Backtracking",
    interviewTips: [
      "ESR rule for Compound Indexes: Equality first, Sort second, Range last.",
      "Avoid $unwind on very large arrays before $match — filter documents early in the aggregation pipeline.",
      "Heaps/Priority Queues give O(log K) insertion for tracking running top K elements.",
    ],
  },
  6: {
    dayName: "Saturday",
    dsa: "Dynamic Programming & Graph Algorithms",
    dsaDesc: "0/1 Knapsack, Coin Change, Longest Common Subsequence, BFS/DFS on Graphs, Topological Sort, Dijkstra's algorithm.",
    mern: "Full-Stack System Design & Scalability",
    mernDesc: "Load Balancers, Redis Caching (Cache-Aside), WebSockets vs SSE, Database Sharding/Replication, and Message Queues (RabbitMQ/Kafka).",
    badge: "System Design & DP",
    interviewTips: [
      "Identify overlapping subproblems and optimal substructure for Dynamic Programming.",
      "In System Design: Start with functional requirements, non-functional requirements (QPS, latency, availability), then High-Level Diagram.",
      "Use Redis for caching hot data and rate limiting (Token Bucket algorithm).",
    ],
  },
};

// ── Time Math Utilities ──────────────────────────────────────

export function timeToMins(timeStr) {
  const p = timeStr.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!p) return 0;
  let h = parseInt(p[1]),
    m = parseInt(p[2]),
    ap = p[3].toUpperCase();
  if (ap === "AM" && h === 12) h = 0;
  else if (ap === "PM" && h !== 12) h += 12;
  return h * 60 + m;
}

export function minsToTime(mins) {
  mins = ((mins % 1440) + 1440) % 1440;
  const h24 = Math.floor(mins / 60),
    m = mins % 60;
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h24 < 12 ? "AM" : "PM"}`;
}

export function recalculateTimes(taskOrder, durMap, pinnedTimes) {
  const times = {};
  let currentMins = 0;
  let started = false;
  for (const key of taskOrder) {
    if (pinnedTimes[key] !== undefined) {
      times[key] = pinnedTimes[key];
      currentMins = timeToMins(pinnedTimes[key]);
      started = true;
    } else if (started) {
      times[key] = minsToTime(currentMins);
    }
    currentMins += durMap[key] || 0;
  }
  return times;
}

export function nowTimeStr() {
  const n = new Date();
  let h = n.getHours(),
    m = n.getMinutes();
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

// ── Day type helper ──────────────────────────────────────────

export function getDayType(date) {
  const d = date.getDay();
  if (d === 0 || d === 6) return "weekend";
  if (d === 1 || d === 3) return "class";
  return "normal";
}

function isBeforeTarget(dateStr, targetDate) {
  return !targetDate || dateStr <= targetDate;
}

export function getTopicForDay(dateStr) {
  const d = parseDate(dateStr);
  const dayOfWeek = d.getDay();
  return DAY_TOPICS[dayOfWeek] || DAY_TOPICS[1];
}

export function getBrainFreshupForDay(dateStr) {
  const d = parseDate(dateStr);
  const dayOfWeek = d.getDay();
  return BRAIN_FRESHUP_TASKS[dayOfWeek] || BRAIN_FRESHUP_TASKS[1];
}

// ── Morning blocks (shared) ─────────────────────────────────

const MW = [
  {
    time: "6:00 AM",
    label: "Wake Up",
    cat: "routine",
    key: "_wake",
    durMins: 0,
  },
  {
    time: "6:00 AM",
    label: "Freshen Up + Push Ups + Exercise",
    cat: "exercise",
    key: "exercise",
    durMins: 15,
    trackable: true,
  },
  {
    time: "6:15 AM",
    label: "Bath + Get Ready",
    cat: "routine",
    key: "_bath",
    durMins: 15,
  },
  {
    time: "6:30 AM",
    label: "15-Min Brain Fresh-Up & Neuro Activation",
    cat: "brain",
    key: "brainFreshup",
    durMins: 15,
    trackable: true,
  },
  {
    time: "6:45 AM",
    label: "Gov Exam — Core Concept / New Topic",
    cat: "gov",
    key: "govMorning",
    durMins: 60,
    trackable: true,
  },
  {
    time: "7:45 AM",
    label: "Pooja & Morning Meditation",
    cat: "pooja",
    key: "pooja",
    durMins: 15,
    trackable: true,
  },
  {
    time: "8:00 AM",
    label: "Breakfast & Nutrition",
    cat: "routine",
    key: "_snacks",
    durMins: 30,
  },
  {
    time: "8:30 AM",
    label: "Commute to Office (Tech Audio / Revision)",
    cat: "routine",
    key: "_commute",
    durMins: 60,
  },
  {
    time: "9:30 AM",
    label: "Settle In & Daily Plan",
    cat: "routine",
    key: "_settle",
    durMins: 30,
  },
];

const ME = [
  {
    time: "6:00 AM",
    label: "Wake Up",
    cat: "routine",
    key: "_wake",
    durMins: 0,
  },
  {
    time: "6:00 AM",
    label: "Freshen Up + Push Ups + Exercise",
    cat: "exercise",
    key: "exercise",
    durMins: 15,
    trackable: true,
  },
  {
    time: "6:15 AM",
    label: "Bath + Get Ready",
    cat: "routine",
    key: "_bath",
    durMins: 15,
  },
  {
    time: "6:30 AM",
    label: "15-Min Brain Fresh-Up & Neuro Activation",
    cat: "brain",
    key: "brainFreshup",
    durMins: 15,
    trackable: true,
  },
  {
    time: "6:45 AM",
    label: "Pooja & Meditation",
    cat: "pooja",
    key: "pooja",
    durMins: 15,
    trackable: true,
  },
  {
    time: "7:00 AM",
    label: "Healthy Breakfast",
    cat: "routine",
    key: "_snacks",
    durMins: 30,
  },
  {
    time: "7:30 AM",
    label: "Gov Exam — Deep Mock Test & Analysis",
    cat: "gov",
    key: "govMorning",
    durMins: 105,
    trackable: true,
  },
  {
    time: "9:15 AM",
    label: "Break — Tea / Refresh",
    cat: "break",
    key: "_tea",
    durMins: 15,
  },
];

// ── All 6 schedule variants ─────────────────────────────────

const S = {};

// SPRINT MODE: Class Night (Mon / Wed) — 70% Govt Exam Priority
S.preClass = {
  label: "Sprint Mode — Class Night (70% Govt Exam Priority)",
  icon: "fa-video",
  color: "terra",
  bgClass: "bg-terra-pale",
  borderClass: "border-terra/20",
  badgeClass: "bg-terra text-white",
  sleepTarget: 5.5,
  mernMins: 225,
  blocks: [
    ...MW,
    {
      time: "10:00 AM",
      label: "MERN & DSA Quick Sprint — Striver 1-2 Problems / JS Core",
      cat: "mern",
      key: "mernMorning",
      durMins: 75,
      trackable: true,
    },
    {
      time: "11:15 AM",
      label: "Work Tasks — Office Focus",
      cat: "work",
      key: "_work1",
      durMins: 165,
    },
    {
      time: "2:00 PM",
      label: "Gov Exam — Practice Questions & Test Drill",
      cat: "gov",
      key: "govSecond",
      durMins: 75,
      trackable: true,
    },
    {
      time: "3:15 PM",
      label: "Work Tasks — Office Focus",
      cat: "work",
      key: "_work2",
      durMins: 165,
    },
    {
      time: "6:00 PM",
      label: "Commute Home (Govt Audio / PYQs)",
      cat: "routine",
      key: "_commuteHome",
      durMins: 90,
    },
    {
      time: "7:30 PM",
      label: "Dinner + Relax",
      cat: "routine",
      key: "_dinner",
      durMins: 45,
    },
    {
      time: "8:15 PM",
      label: "Gov Exam Prime Block — Speed Test & Mock Drill",
      cat: "gov",
      key: "govNight",
      durMins: 45,
      trackable: true,
    },
    {
      time: "9:00 PM",
      label: "MERN Live Class / Mock Interview Session",
      cat: "mern",
      key: "mernClass",
      durMins: 150,
      trackable: true,
    },
    {
      time: "11:30 PM",
      label: "Gov Exam Deep Revision — Formulas & Daily Current Affairs",
      cat: "gov",
      key: "govRevision",
      durMins: 30,
      trackable: true,
    },
    {
      time: "12:00 AM",
      label: "Wind Down — Screen off, dim lights, calm mind",
      cat: "winddown",
      key: "_winddown",
      durMins: 30,
    },
    {
      time: "12:30 AM",
      label: "Bedtime Goal (5:30 hrs sleep)",
      cat: "sleep",
      key: "sleepGoal",
      durMins: 0,
      trackable: true,
    },
  ],
};

// SPRINT MODE: Normal Night (Tue / Thu / Fri) — 70% Govt Exam / 30% MERN & DSA
S.preNormal = {
  label: "Sprint Mode — 70% Govt Exam / 30% MERN Night",
  icon: "fa-bolt",
  color: "terra",
  bgClass: "bg-terra-pale",
  borderClass: "border-terra/20",
  badgeClass: "bg-terra text-white",
  sleepTarget: 5.5,
  mernMins: 120,
  blocks: [
    ...MW,
    {
      time: "10:00 AM",
      label: "MERN & DSA Quick Sprint — Striver 1-2 Problems / JS Core",
      cat: "mern",
      key: "mernMorning",
      durMins: 75,
      trackable: true,
    },
    {
      time: "11:15 AM",
      label: "Work Tasks — Office Focus",
      cat: "work",
      key: "_work1",
      durMins: 165,
    },
    {
      time: "2:00 PM",
      label: "Gov Exam Daytime Drill — General Studies & Reasoning",
      cat: "gov",
      key: "govSecond",
      durMins: 75,
      trackable: true,
    },
    {
      time: "3:15 PM",
      label: "Work Tasks — Office Focus",
      cat: "work",
      key: "_work2",
      durMins: 165,
    },
    {
      time: "6:00 PM",
      label: "Commute Home (Govt GK / Audio Revision)",
      cat: "routine",
      key: "_commuteHome",
      durMins: 90,
    },
    {
      time: "7:30 PM",
      label: "Dinner + Relax",
      cat: "routine",
      key: "_dinner",
      durMins: 45,
    },
    {
      time: "8:15 PM",
      label: "Gov Exam Prime Block — Full Mock Test & Sectional Analysis",
      cat: "gov",
      key: "govNight",
      durMins: 90,
      trackable: true,
    },
    {
      time: "9:45 PM",
      label: "Gov Exam Deep Revision — Polity, History, Economy & Current Affairs",
      cat: "gov",
      key: "govRevision",
      durMins: 60,
      trackable: true,
    },
    {
      time: "10:45 PM",
      label: "MERN & Striver DSA — 1 Pattern Code Review / Node-React Concept",
      cat: "mern",
      key: "mernNight",
      durMins: 45,
      trackable: true,
    },
    {
      time: "11:30 PM",
      label: "Book Reading — Motivation, Life Lessons & Philosophy",
      cat: "reading",
      key: "reading",
      durMins: 30,
      trackable: true,
    },
    {
      time: "12:00 AM",
      label: "Wind Down — Screen off, dim lights, relax",
      cat: "winddown",
      key: "_winddown",
      durMins: 30,
    },
    {
      time: "12:30 AM",
      label: "Bedtime Goal (5:30 hrs sleep)",
      cat: "sleep",
      key: "sleepGoal",
      durMins: 0,
      trackable: true,
    },
  ],
};

// SPRINT MODE: Weekend (Sat / Sun) — 70% Govt Exam / 30% MERN
S.preWeekend = {
  label: "Sprint Mode — 70% Govt Exam Weekend Intensive",
  icon: "fa-fire",
  color: "terra",
  bgClass: "bg-terra-pale",
  borderClass: "border-terra/20",
  badgeClass: "bg-terra text-white",
  sleepTarget: 5.5,
  mernMins: 150,
  blocks: [
    ...ME,
    {
      time: "9:30 AM",
      label: "MERN Prep — Striver DSA Problem Solving (Blind 75 / Top 150)",
      cat: "mern",
      key: "mernDsa",
      durMins: 90,
      trackable: true,
    },
    {
      time: "11:00 AM",
      label: "Gov Exam Subject Sprint — Polity, History & General Studies",
      cat: "gov",
      key: "govSecond",
      durMins: 150,
      trackable: true,
    },
    {
      time: "1:30 PM",
      label: "Lunch, Rest, Errands & Recharge",
      cat: "routine",
      key: "_free",
      durMins: 180,
    },
    {
      time: "4:30 PM",
      label: "Gov Exam Sectional Drill — Quantitative Aptitude & Reasoning",
      cat: "gov",
      key: "govNight",
      durMins: 120,
      trackable: true,
    },
    {
      time: "6:30 PM",
      label: "Evening Walk & Refreshment",
      cat: "break",
      key: "_walk",
      durMins: 60,
    },
    {
      time: "7:30 PM",
      label: "Dinner & Family Time",
      cat: "routine",
      key: "_dinner",
      durMins: 60,
    },
    {
      time: "8:30 PM",
      label: "Gov Exam Final Analysis & Daily Current Affairs",
      cat: "gov",
      key: "govRevision",
      durMins: 90,
      trackable: true,
    },
    {
      time: "10:00 PM",
      label: "MERN Prep — Full-Stack Project Building & Architecture",
      cat: "mern",
      key: "mernProject",
      durMins: 60,
      trackable: true,
    },
    {
      time: "11:00 PM",
      label: "Book Reading — Deep Life Lessons, Stoicism & Knowledge",
      cat: "reading",
      key: "reading",
      durMins: 60,
      trackable: true,
    },
    {
      time: "12:00 AM",
      label: "Wind Down — Screen off, relaxation",
      cat: "winddown",
      key: "_winddown",
      durMins: 30,
    },
    {
      time: "12:30 AM",
      label: "Bedtime Goal (5:30 hrs sleep)",
      cat: "sleep",
      key: "sleepGoal",
      durMins: 0,
      trackable: true,
    },
  ],
};

// RECOVERY / MAINTENANCE MODE: Class Night
S.postClass = {
  label: "Mastery Mode — Class Night",
  icon: "fa-video",
  color: "teal",
  bgClass: "bg-teal-pale",
  borderClass: "border-teal/20",
  badgeClass: "bg-teal text-white",
  sleepTarget: 5.5,
  mernMins: 220,
  blocks: [
    ...MW,
    {
      time: "10:00 AM",
      label: "MERN Prep — Core Review",
      cat: "mern",
      key: "mernMorning",
      durMins: 60,
      trackable: true,
    },
    {
      time: "11:00 AM",
      label: "Work Tasks",
      cat: "work",
      key: "_work1",
      durMins: 180,
    },
    {
      time: "2:00 PM",
      label: "Gov Exam — Practice Questions",
      cat: "gov",
      key: "govSecond",
      durMins: 60,
      trackable: true,
    },
    {
      time: "3:00 PM",
      label: "Work Tasks",
      cat: "work",
      key: "_work2",
      durMins: 180,
    },
    {
      time: "6:00 PM",
      label: "Commute Home",
      cat: "routine",
      key: "_commuteHome",
      durMins: 90,
    },
    {
      time: "7:30 PM",
      label: "Dinner + Relax",
      cat: "routine",
      key: "_dinner",
      durMins: 45,
    },
    {
      time: "8:15 PM",
      label: "MERN Prep — Quick Coding Sprint",
      cat: "mern",
      key: "mernBackend",
      durMins: 40,
      trackable: true,
    },
    {
      time: "8:55 PM",
      label: "Transition to Class",
      cat: "routine",
      key: "_transition",
      durMins: 5,
    },
    {
      time: "9:00 PM",
      label: "MERN Live Session",
      cat: "mern",
      key: "mernClass",
      durMins: 120,
      trackable: true,
    },
    {
      time: "11:00 PM",
      label: "Book Reading — Motivation & Mindset",
      cat: "reading",
      key: "reading",
      durMins: 45,
      trackable: true,
    },
    {
      time: "11:45 PM",
      label: "Wind Down",
      cat: "winddown",
      key: "_winddown",
      durMins: 45,
    },
    {
      time: "12:30 AM",
      label: "Bedtime Goal (5:30 hrs sleep)",
      cat: "sleep",
      key: "sleepGoal",
      durMins: 0,
      trackable: true,
    },
  ],
};

// RECOVERY / MAINTENANCE MODE: Normal Night
S.postNormal = {
  label: "Mastery Mode — Normal Night",
  icon: "fa-moon",
  color: "teal",
  bgClass: "bg-teal-pale",
  borderClass: "border-teal/20",
  badgeClass: "bg-teal text-white",
  sleepTarget: 5.5,
  mernMins: 180,
  blocks: [
    ...MW,
    {
      time: "10:00 AM",
      label: "MERN Prep — JS / React Concepts",
      cat: "mern",
      key: "mernMorning",
      durMins: 60,
      trackable: true,
    },
    {
      time: "11:00 AM",
      label: "Work Tasks",
      cat: "work",
      key: "_work1",
      durMins: 180,
    },
    {
      time: "2:00 PM",
      label: "MERN Prep — DSA Coding Practice",
      cat: "mern",
      key: "mernDsa",
      durMins: 60,
      trackable: true,
    },
    {
      time: "3:00 PM",
      label: "Work Tasks",
      cat: "work",
      key: "_work2",
      durMins: 180,
    },
    {
      time: "6:00 PM",
      label: "Commute Home",
      cat: "routine",
      key: "_commuteHome",
      durMins: 90,
    },
    {
      time: "7:30 PM",
      label: "Dinner + Relax",
      cat: "routine",
      key: "_dinner",
      durMins: 45,
    },
    {
      time: "8:15 PM",
      label: "Gov Exam — Revision",
      cat: "gov",
      key: "govSecond",
      durMins: 45,
      trackable: true,
    },
    {
      time: "9:00 PM",
      label: "MERN Prep — Full-Stack Project / Architecture",
      cat: "mern",
      key: "mernBackend",
      durMins: 60,
      trackable: true,
    },
    {
      time: "10:00 PM",
      label: "Book Reading — Life Wisdom & Focus",
      cat: "reading",
      key: "reading",
      durMins: 60,
      trackable: true,
    },
    {
      time: "11:00 PM",
      label: "Wind Down & Relaxation",
      cat: "winddown",
      key: "_winddown",
      durMins: 90,
    },
    {
      time: "12:30 AM",
      label: "Bedtime Goal (5:30 hrs sleep)",
      cat: "sleep",
      key: "sleepGoal",
      durMins: 0,
      trackable: true,
    },
  ],
};

// RECOVERY / MAINTENANCE MODE: Weekend
S.postWeekend = {
  label: "Mastery Mode — Weekend",
  icon: "fa-sun",
  color: "gold",
  bgClass: "bg-gold-pale",
  borderClass: "border-gold/20",
  badgeClass: "bg-gold text-white",
  sleepTarget: 5.5,
  mernMins: 240,
  blocks: [
    ...ME,
    {
      time: "9:30 AM",
      label: "MERN Prep — Project & DSA Drill",
      cat: "mern",
      key: "mernDsa",
      durMins: 90,
      trackable: true,
    },
    {
      time: "11:00 AM",
      label: "MERN Prep — Full-Stack Project",
      cat: "mern",
      key: "mernProject",
      durMins: 120,
      trackable: true,
    },
    {
      time: "1:00 PM",
      label: "Free Time / Rest / Errands",
      cat: "routine",
      key: "_free",
      durMins: 360,
    },
    {
      time: "7:00 PM",
      label: "Gov Exam — Weekly Review",
      cat: "gov",
      key: "govSecond",
      durMins: 60,
      trackable: true,
    },
    {
      time: "8:00 PM",
      label: "Dinner & Family Time",
      cat: "routine",
      key: "_dinner",
      durMins: 60,
    },
    {
      time: "9:00 PM",
      label: "Book Reading — Deep Study & Reading",
      cat: "reading",
      key: "reading",
      durMins: 90,
      trackable: true,
    },
    {
      time: "10:30 PM",
      label: "Wind Down",
      cat: "winddown",
      key: "_winddown",
      durMins: 120,
    },
    {
      time: "12:30 AM",
      label: "Bedtime Goal (5:30 hrs sleep)",
      cat: "sleep",
      key: "sleepGoal",
      durMins: 0,
      trackable: true,
    },
  ],
};

// ── Main schedule lookup ────────────────────────────────────

export function getSchedule(dateStr, targetDate) {
  const d = parseDate(dateStr),
    dt = getDayType(d),
    pre = isBeforeTarget(dateStr, targetDate);
  if (pre) {
    if (dt === "class") return S.preClass;
    if (dt === "weekend") return S.preWeekend;
    return S.preNormal;
  } else {
    if (dt === "class") return S.postClass;
    if (dt === "weekend") return S.postWeekend;
    return S.postNormal;
  }
}

// ── Comprehensive Task Knowledge Guides & Actionable Descriptions ─

export const TASK_GUIDES = {
  _wake: {
    title: "Wake Up & Hydrate",
    desc: "Rise immediately at 6:00 AM without hitting snooze. Drink 500ml of water with a pinch of salt to kickstart hydration and re-activate metabolic pathways.",
    tips: [
      "Avoid checking phone or social media during the first 15 minutes.",
      "Stand up immediately to break sleep inertia and signal wakefulness to your brain."
    ],
    outcome: "Immediate physical alertness and zero morning procrastination.",
    checklist: ["No snooze button", "500ml water consumed", "Bed made"],
  },
  exercise: {
    title: "Freshen Up + Push Ups + Exercise",
    desc: "Quick physical activation: 3 sets of pushups, bodyweight squats, and core stretching. Elevates heart rate, delivers oxygenated blood to the brain, and signals muscles that the day has begun.",
    tips: [
      "Keep intensity moderate (RPE 6-7) to energize without inducing physical fatigue.",
      "Pair with deep nasal breathing to optimize oxygen delivery."
    ],
    outcome: "Elevated endorphins, higher core temperature, and enhanced physical readiness.",
    checklist: ["3 sets pushups / bodyweight drills", "Spine & hamstring stretch", "Nasal breathing"],
  },
  _bath: {
    title: "Bath & Grooming",
    desc: "Refreshing shower and clean dressing. Grooming well primes your psychology for high discipline and professional confidence throughout the day.",
    tips: [
      "End the shower with 30 seconds of cold water for a noradrenaline dopamine boost.",
      "Wear clean, structured clothes to create mental clarity."
    ],
    outcome: "Clean physiological refresh and disciplined professional mindset.",
    checklist: ["Shower complete", "Groomed & ready"],
  },
  brainFreshup: {
    title: "15-Min Brain Fresh-Up (Neuro Activation)",
    desc: "Day-specific high-leverage cognitive and neurochemical drill (Sunlight & Box Breathing, Speed Sudoku, Visual Memory, Vedic Math, Feynman Sprint, 40Hz Sound, or Chess Tactics).",
    tips: [
      "Engage with 100% active focus—do not treat this as passive leisure.",
      "Follow today's specific drill instructions in the sidebar widget."
    ],
    outcome: "Clears adenosine sleep fog and switches brain waves into high-speed Beta/Gamma focus.",
    checklist: ["Completed today's 15-min drill", "Brain fully alert for study"],
  },
  govMorning: {
    title: "Gov Exam — Deep Study Block / Mock Test",
    desc: "High-focus deep study session dedicated to Government Exam syllabus: Quantitative Aptitude, Logical Reasoning, Polity, History, Economy, or full-length timed mock tests with strict time limits.",
    tips: [
      "Maintain a dedicated 'Error Log Notebook' to write down every missed question and concept gap.",
      "Practice solving without pen/paper shortcuts where applicable to build speed."
    ],
    outcome: "Mastery of 1 core concept or 1 completed mock test with detailed error analysis.",
    checklist: ["Timed practice under exam pressure", "Mistakes analyzed & logged"],
  },
  pooja: {
    title: "Pooja & Morning Meditation",
    desc: "Sacred morning prayers, gratitude offering, and silent breath awareness. Calms the nervous system, dissolves stress/anxiety, and grounds your subconscious mind in faith and determination.",
    tips: [
      "Express genuine gratitude for health, intellect, and daily opportunities.",
      "Sit in stillness for 3-5 minutes observing natural breath flow."
    ],
    outcome: "Inner tranquility, emotional resilience, and clear moral focus.",
    checklist: ["Pooja prayers offered", "3-5 min silent meditation", "Gratitude declared"],
  },
  _snacks: {
    title: "Healthy Breakfast & Nutrition",
    desc: "Balanced nutrition fueling sustained cognitive endurance without blood sugar spikes. Prioritize proteins (eggs, sprouts, paneer), healthy fats (nuts, seeds), and complex carbs (oats, whole grains).",
    tips: [
      "Avoid high-sugar cereals or refined bakery items that cause 10 AM energy crashes.",
      "Eat mindfully without scrolling social media."
    ],
    outcome: "Sustained physical energy and stable blood glucose for office and study.",
    checklist: ["Protein-rich meal", "Proper hydration"],
  },
  _leave: {
    title: "Leave Home for Office",
    desc: "Organized departure on schedule. Ensures a calm, unhurried commute with zero traffic anxiety or rushing.",
    tips: [
      "Double-check essentials: Laptop, charger, water bottle, ID card.",
      "Step out with a calm, focused mindset."
    ],
    outcome: "Punctual, stress-free departure.",
    checklist: ["Work bag packed", "Departed on schedule"],
  },
  _commute: {
    title: "Commute to Office (Tech Audio / Revision)",
    desc: "Transform travel time into passive learning. Listen to engineering architecture podcasts, system design audio breakdowns, or review flashcards.",
    tips: [
      "Listen to tech architecture podcasts (e.g. Software Engineering Radio, Syntax).",
      "Mentally visualize DSA problem-solving templates."
    ],
    outcome: "60 minutes of passive knowledge compounding.",
    checklist: ["Tech audio / revision on commute"],
  },
  _settle: {
    title: "Settle In & Daily Plan",
    desc: "Arrive at office, clear workspace, review Jira sprint board, prioritize top 3 deliverables for the day, and sync with team.",
    tips: [
      "Identify the 1 'Must-Win' engineering task before checking emails.",
      "Keep workspace clean and distraction-free."
    ],
    outcome: "Crystal clear daily work roadmap and organized desk.",
    checklist: ["Top 3 priorities listed", "Desk organized"],
  },
  mernMorning: {
    title: "MERN Prep — JavaScript & React Core Internals",
    desc: "Deep theoretical & output-based interview questions: Event Loop phases, Promises vs Microtasks, Closures, Polyfills, Virtual DOM diffing, Fiber reconciliation, and React 18 Concurrent features.",
    tips: [
      "Practice explaining output questions out loud: State the Call Stack and Microtask queue order.",
      "Write custom polyfills from scratch on a blank editor."
    ],
    outcome: "Unshakeable mastery of JS & React core internals expected in Senior/SDE interviews.",
    checklist: ["Output questions analyzed", "Internals & custom hooks understood"],
  },
  _work1: {
    title: "Work Tasks — Office Focus Sprint 1",
    desc: "Primary professional engineering block. High-intensity focus on production code, architecture implementations, API endpoints, bug fixes, and sprint deliverables.",
    tips: [
      "Group meetings together and protect uninterrupted 90-minute coding blocks.",
      "Write clean, well-tested, self-documenting code."
    ],
    outcome: "Major progress on primary sprint tickets.",
    checklist: ["Sprint tasks pushed", "Code reviews completed"],
  },
  govSecond: {
    title: "Gov Exam — Practice Questions & Test Drill",
    desc: "Targeted problem-solving session: Previous Year Questions (PYQs), formula drills, fast calculation tricks, and topic-wise sectional tests under timer.",
    tips: [
      "Focus strictly on high-weightage topics (Arithmetic, Reasoning patterns, Constitutional Articles).",
      "Time every set of 15 questions with a countdown timer."
    ],
    outcome: "Sharpened accuracy and speed under test constraints.",
    checklist: ["PYQ drills completed", "Accuracy calculated"],
  },
  _work2: {
    title: "Work Tasks — Office Focus Sprint 2",
    desc: "Second professional engineering sprint: Pull Request reviews, system integration tests, stakeholder sync, and wrapping up daily commits.",
    tips: [
      "Clean up Git branches and document any pending blockers before end of day.",
      "Leave a clear 'next step' note for tomorrow morning."
    ],
    outcome: "Completion of daily work responsibilities and clean Git commits.",
    checklist: ["PRs reviewed", "Blockers resolved", "Day wrapped up"],
  },
  _commuteHome: {
    title: "Commute Home",
    desc: "Commute transition back home. Relaxing audio, decompression, or formula audio revision.",
    tips: [
      "Use this transition to disconnect from work stress and shift focus to evening interview preparation."
    ],
    outcome: "Smooth mental transition from office work to evening mastery.",
    checklist: ["Safe commute home", "Work mindset closed"],
  },
  _dinner: {
    title: "Dinner + Relax",
    desc: "Nutritious dinner with family. Keep meal light and easy to digest to avoid late-night sluggishness during study.",
    tips: [
      "Eat without screens or phones at the dining table.",
      "Hydrate well with warm water."
    ],
    outcome: "Physical nourishment and quality family time.",
    checklist: ["Healthy dinner", "Screen-free meal"],
  },
  mernBackend: {
    title: "MERN Prep — Node.js, Express & MongoDB Architecture",
    desc: "Server-side systems mastery: Node.js V8 & Libuv event loop, Streams & Buffers, JWT access/refresh token rotation, MongoDB aggregation pipelines ($match, $lookup, $unwind), indexing strategies (ESR rule), and ACID transactions.",
    tips: [
      "Explain the exact flow of an Express middleware error handler and JWT refresh rotation.",
      "Understand how compound indexes work using B-Tree and explain('executionStats')."
    ],
    outcome: "Deep backend architecture readiness for system design and API interview rounds.",
    checklist: ["Backend concepts coded", "Database query optimization practiced"],
  },
  mernDsa: {
    title: "MERN Prep — DSA Deep Problem Solving",
    desc: "Rigorous coding on Blind 75 / Top 150 LeetCode patterns (Arrays, Two Pointers, Sliding Window, Trees, Heaps, Dynamic Programming, Graphs).",
    tips: [
      "State Time Complexity O(N) and Space Complexity O(1) before coding.",
      "Always write clean variable names and test edge cases (empty array, negative numbers, single element)."
    ],
    outcome: "2–3 DSA medium/hard problems solved and committed to personal Git repository.",
    checklist: ["DSA problems solved", "Time/Space complexity verified", "Edge cases tested"],
  },
  govNight: {
    title: "Gov Exam Prime Block — Full Mock Test & Sectional Analysis",
    desc: "Your primary high-focus evening block for Govt Exam: Solve full timed sectional mock tests (Quantitative Aptitude, Reasoning, English, General Studies), analyze every negative mark, and log errors.",
    tips: [
      "Simulate exact exam timer pressure (no pauses, no phone).",
      "Spend at least 30 minutes analyzing wrong questions and unanswered questions in your Error Notebook."
    ],
    outcome: "Full mock test completed with detailed score, accuracy rate & error breakdown.",
    checklist: ["Mock test solved under timer", "Negative marks analyzed", "Error notebook updated"],
  },
  govRevision: {
    title: "Gov Exam Deep Revision — Polity, History, Economy & Current Affairs",
    desc: "Active recall and memorization: Review Constitutional Articles & Amendments, Modern Indian History timelines, Economic schemes, and Daily Current Affairs notes.",
    tips: [
      "Use active recall / flashcards instead of passive reading.",
      "Review mistakes from earlier today's test."
    ],
    outcome: "Complete retention of today's General Studies and Current Affairs targets.",
    checklist: ["Polity/History notes revised", "Daily Current Affairs digested"],
  },
  mernNight: {
    title: "MERN & Striver DSA — 1 Pattern Code Review / Tech Concept",
    desc: "Concise 45-minute tech sprint (30% balance): Solve 1 Striver DSA problem or deep-dive into 1 JavaScript/React/Node interview concept (e.g. Polyfills, Event Loop, JWT, Middleware).",
    tips: [
      "Focus on code understanding and edge cases rather than rushing multiple questions.",
      "Keep this focused and finish on time to transition into book reading."
    ],
    outcome: "1 core DSA pattern or MERN architectural concept mastered.",
    checklist: ["1 problem/concept coded", "Time & Space complexity analyzed"],
  },
  _transition: {
    title: "Transition to Live Class",
    desc: "Quick 5-minute setup: Log into video platform, open VS Code, set up scratch notes, and eliminate all background noise.",
    tips: ["Have notebook and pen ready for live interview takeaways."],
    outcome: "Zero lag transition into the live class.",
    checklist: ["Class link opened", "Notes ready"],
  },
  mernClass: {
    title: "MERN Live Class / Mock Interview Session",
    desc: "High-intensity live class, peer mock interviews, live machine coding, and deep instructor feedback.",
    tips: [
      "Participate actively and volunteer for live mock questions.",
      "Note down every feedback point given by interviewers."
    ],
    outcome: "Real-time interview simulation and live critique.",
    checklist: ["Live session attended", "Critique points noted"],
  },
  mernMock: {
    title: "MERN Prep — System Design & Mock Interview Questions",
    desc: "High-level & Low-level system design: Scalability (Horizontal vs Vertical), Redis cache-aside, WebSockets, Message Queues (RabbitMQ/Kafka), DB Sharding, and STAR behavioral answers.",
    tips: [
      "Structure answers: Requirements -> Scale -> Data Model -> High Level Architecture -> Deep Dive.",
      "Prepare STAR answers for conflict, leadership, and technical failure stories."
    ],
    outcome: "End-to-end system design architecture diagram completed.",
    checklist: ["System design diagrammed", "Tradeoffs defended", "Behavioral story practiced"],
  },
  mernProject: {
    title: "MERN Prep — Full-Stack Project Building",
    desc: "Hands-on project development: Real-time collaborative features, microservice architecture, custom auth, caching layers, and production deployment.",
    tips: [
      "Treat your side project like production: Clean folder structure, ESLint, error handling, Docker.",
      "Write a clear README documenting architecture decisions."
    ],
    outcome: "Measurable feature built and pushed to GitHub.",
    checklist: ["Feature coded", "Commit pushed to GitHub"],
  },
  _walk: {
    title: "Evening Walk & Refreshment",
    desc: "Gentle 60-minute walk in fresh air to clear mental fatigue, stretch joints, and promote cardiovascular circulation.",
    tips: ["Keep pace relaxed and take deep belly breaths."],
    outcome: "Physical recovery and mental decompression.",
    checklist: ["Walk completed", "Refreshed"],
  },
  _tea: {
    title: "Break — Tea / Refreshment",
    desc: "15-minute quick tea break to rest eyes from digital screens and recharge.",
    tips: ["Look at distant objects to relax ciliary eye muscles."],
    outcome: "Quick restorative break.",
    checklist: ["Eyes rested", "Hydrated"],
  },
  _free: {
    title: "Free Time / Rest / Errands",
    desc: "Unstructured personal time: family bonding, resting, personal errands, or hobbies.",
    tips: ["Use this time to truly unwind and recharge cognitive battery."],
    outcome: "Recharged energy for the week ahead.",
    checklist: ["Rest achieved"],
  },
  reading: {
    title: "Book Reading — Motivation, Life Lessons & Mindset",
    desc: "Dedicated reading of curated life-changing books (*Atomic Habits, Can't Hurt Me, Deep Work, Psychology of Money, Meditations*) to build character, resilience, and wisdom.",
    tips: [
      "Read with a pen/highlighter and write down 1 actionable life lesson in your journal.",
      "Reflect on how this applies to your daily discipline and career growth."
    ],
    outcome: "15–30 pages read and 1 core life lesson integrated into daily behavior.",
    checklist: ["Pages read", "Key takeaway journaled"],
  },
  _winddown: {
    title: "Wind Down & Sleep Preparation",
    desc: "Crucial transition into sleep: Screen off, dim ambient lighting, zero blue light, light mobility stretching, and calm breathing to trigger melatonin release.",
    tips: [
      "Put smartphone in another room or on airplane mode.",
      "Lower room temperature and ensure complete darkness."
    ],
    outcome: "Calm parasympathetic nervous system state ready for deep sleep.",
    checklist: ["Screens powered off", "Room dimmed", "Phone placed away"],
  },
  sleepGoal: {
    title: "Bedtime Goal (5:30 hrs sleep target)",
    desc: "Asleep by 12:30 AM to get 5.5 hours of high-quality, undisturbed sleep and wake up energized at 6:00 AM.",
    tips: [
      "Keep bedroom pitch black and cool (18-20°C).",
      "Focus on slow, rhythmic nasal breathing as you drift to sleep."
    ],
    outcome: "Deep REM & slow-wave sleep for memory consolidation and cellular repair.",
    checklist: ["In bed by 12:30 AM", "5.5h sleep goal achieved"],
  },
};

// ── Build the full task list for a day ──────────────────────

export function getDayTasks(dateStr, targetDate, dayData) {
  const sched = getSchedule(dateStr, targetDate);
  const taskOrder = dayData?.taskOrder || sched.blocks.map((b) => b.key);
  const customTasks = dayData?.customTasks || {};
  const pinnedTimes = dayData?.pinnedTimes || {};

  // Build duration map
  const durMap = {};
  sched.blocks.forEach((b) => {
    durMap[b.key] = b.durMins;
  });
  Object.entries(customTasks).forEach(([k, v]) => {
    durMap[k] = v.durMins;
  });

  // Auto-pin first task if nothing pinned
  const ep = { ...pinnedTimes };
  if (Object.keys(ep).length === 0 && taskOrder.length > 0) {
    const firstDefault = sched.blocks.find((b) => b.key === taskOrder[0]);
    if (firstDefault) ep[taskOrder[0]] = firstDefault.time;
  }

  const times = recalculateTimes(taskOrder, durMap, ep);

  return taskOrder.map((key) => {
    const def = sched.blocks.find((b) => b.key === key);
    const cus = customTasks[key];
    const guide = TASK_GUIDES[key] || {
      title: cus?.label || def?.label || key,
      desc: cus?.desc || def?.desc || "Execute this scheduled milestone with high discipline and attention to detail.",
      tips: ["Maintain focus on quality and deliberate practice.", "Track your completion upon finishing."],
      outcome: "Consistent daily execution of your interview & exam roadmap.",
      checklist: ["Task completed as scheduled"],
    };

    return {
      key,
      label: cus?.label || def?.label || guide.title || key,
      cat: cus?.cat || def?.cat || "routine",
      durMins: durMap[key] || 0,
      time: times[key] || def?.time || "",
      pinned: !!ep[key],
      trackable: def?.trackable || false,
      isCustom: !!cus,
      defaultTime: def?.time || "",
      desc: guide.desc,
      tips: guide.tips,
      outcome: guide.outcome,
      checklist: guide.checklist,
    };
  });
}

// ── Date utilities ───────────────────────────────────────────

export function fmtDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function parseDate(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
export function isToday(dateStr) {
  return dateStr === fmtDate(new Date());
}
export function isFuture(dateStr) {
  return dateStr > fmtDate(new Date());
}

export function getThreeMonths() {
  const n = new Date(),
    ms = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date(n.getFullYear(), n.getMonth() + i, 1);
    ms.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    });
  }
  return ms;
}

export function getMonthGrid(year, month) {
  const f = new Date(year, month, 1).getDay(),
    dim = new Date(year, month + 1, 0).getDate(),
    g = [];
  for (let i = 0; i < f; i++) g.push(null);
  for (let d = 1; d <= dim; d++) g.push(new Date(year, month, d));
  return g;
}

export function daysUntilTarget(td) {
  if (!td) return 0;
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  const target = parseDate(td);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - t) / 864e5);
}

// Backward compatibility alias
export const daysUntilBirthday = daysUntilTarget;

export const START_DATE = "2026-08-24";

export function isBeforeStart(dateStr, startDate = START_DATE) {
  return dateStr < startDate;
}

// ── Habit summary for calendar dots ─────────────────────────

export function getHabitSummary(dateStr, targetDate, dayData, startDate = START_DATE) {
  if (isBeforeStart(dateStr, startDate)) {
    return {
      pooja: false,
      gov: false,
      mern: false,
      reading: false,
      brain: false,
      sleep: false,
      exercise: false,
      total: 0,
      done: 0,
      allDone: false,
    };
  }

  const h = dayData?.habits || {};
  const tasks = getDayTasks(dateStr, targetDate, dayData);
  const trackable = tasks.filter((t) => t.trackable);
  return {
    pooja: !!h.pooja,
    gov: !!h.govMorning || !!h.govSecond || !!h.govNight || !!h.govRevision,
    mern:
      !!h.mern ||
      !!h.mernMorning ||
      !!h.mernDsa ||
      !!h.mernBackend ||
      !!h.mernNight ||
      !!h.mernProject ||
      !!h.mernClass ||
      !!h.mernMock ||
      !!h.genai ||
      !!h.genaiClass ||
      !!h.genaiOffice2 ||
      !!h.crafting,
    reading: !!h.reading || !!h.bookReading,
    brain: !!h.brainFreshup || !!h.brain,
    sleep: !!h.sleepGoal,
    exercise: !!h.exercise,
    total: trackable.length,
    done: trackable.filter((t) => h[t.key]).length,
    allDone: trackable.length > 0 && trackable.every((t) => h[t.key]),
  };
}

// ── MERN Interview Prep Roadmap Phases ───────────────────────

export const MERN_PHASES = [
  {
    name: "Phase 1: JS Core & DSA Essentials",
    desc: "Event Loop, Closures, Polyfills, Arrays & Strings",
    targetHrs: 25,
    icon: "fa-code",
  },
  {
    name: "Phase 2: React & Frontend Architecture",
    desc: "Virtual DOM, Fiber, Custom Hooks, Redux/Zustand, Profiling",
    targetHrs: 50,
    icon: "fa-cubes",
  },
  {
    name: "Phase 3: Node.js, Express & MongoDB Scale",
    desc: "Streams, Libuv, JWT Auth, Aggregation Pipelines & Indexing",
    targetHrs: 75,
    icon: "fa-server",
  },
  {
    name: "Phase 4: System Design & Mock Interviews",
    desc: "Redis Caching, WebSockets, Live Coding & Timed Mock Interviews",
    targetHrs: 100,
    icon: "fa-trophy",
  },
];

// Backward compatibility alias
export const CRAFT_PHASES = MERN_PHASES;

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
