require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ── Mongoose Models ──────────────────────────────────────────

const HabitDaySchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  habits: { type: Object, default: {} },
  sleepHours: { type: Number, default: null },
  mernMinutes: { type: Number, default: null },
  craftMinutes: { type: Number, default: null }, // backward compatibility
  taskOrder: { type: [String], default: undefined },
  customTasks: { type: Object, default: undefined },
  pinnedTimes: { type: Object, default: undefined },
  lateEntries: { type: Object, default: undefined },
  studyLogs: { type: Array, default: [] },
});
const HabitDay = mongoose.model("HabitDay", HabitDaySchema);

const SettingsSchema = new mongoose.Schema({
  key: { type: String, default: "main" },
  startDate: { type: String, default: "2026-08-24" },
  targetDate: { type: String, default: "2026-11-24" },
  birthdayDate: { type: String, default: "2026-11-24" }, // backward compatibility
});
const Settings = mongoose.model("Settings", SettingsSchema);

const ExamTrackerSchema = new mongoose.Schema({
  key: { type: String, default: "main" },
  subjects: [
    {
      id: String,
      name: String,
      order: Number,
      topics: [
        {
          id: String,
          name: String,
          order: Number,
          covered: { type: Boolean, default: false },
          testDone: { type: Boolean, default: false },
          important: { type: Boolean, default: false },
        },
      ],
    },
  ],
});
const ExamTracker = mongoose.model("ExamTracker", ExamTrackerSchema);

const MernTrackerSchema = new mongoose.Schema({
  key: { type: String, default: "main" },
  subjects: [
    {
      id: String,
      name: String,
      order: Number,
      resourceType: { type: String, default: "general" },
      resourceLink: { type: String, default: "" },
      topics: [
        {
          id: String,
          name: String,
          order: Number,
          covered: { type: Boolean, default: false },
          testDone: { type: Boolean, default: false },
          important: { type: Boolean, default: false },
          striverUrl: { type: String, default: "" },
          level: { type: String, default: "" },
        },
      ],
    },
  ],
});
const MernTracker = mongoose.model("MernTracker", MernTrackerSchema);

const DEFAULT_GOV_SUBJECTS = [
  { id: "sub_1", name: "Quantitative Aptitude", order: 0, topics: [] },
  { id: "sub_2", name: "Verbal Reasoning", order: 1, topics: [] },
  { id: "sub_3", name: "Polity", order: 2, topics: [] },
  { id: "sub_4", name: "Economy", order: 3, topics: [] },
  { id: "sub_5", name: "English", order: 4, topics: [] },
  { id: "sub_6", name: "General Science", order: 5, topics: [] },
  { id: "sub_7", name: "Geography", order: 6, topics: [] },
  { id: "sub_8", name: "History", order: 7, topics: [] },
  { id: "sub_9", name: "Current Affairs", order: 8, topics: [] },
];

const DEFAULT_MERN_SUBJECTS = [
  {
    id: "mern_dsa",
    name: "Data Structures & Algorithms (Striver A2Z DSA)",
    order: 0,
    resourceType: "striver",
    resourceLink: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/",
    topics: [
      { id: "dsa_1", name: "Step 1: Basics, Patterns, Basic Math, Recursion & Hashing", order: 0, covered: false, testDone: false, important: true, striverUrl: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", level: "Step 1: Basics" },
      { id: "dsa_2", name: "Step 2: Sorting Techniques (Selection, Bubble, Insertion, Merge, Quick Sort)", order: 1, covered: false, testDone: false, important: true, striverUrl: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", level: "Step 2: Sorting" },
      { id: "dsa_3", name: "Step 3: Arrays (Easy, Medium: Kadane/2Sum/Next Permutation, Hard: 3Sum/4Sum/Pascal)", order: 2, covered: false, testDone: false, important: true, striverUrl: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", level: "Step 3: Arrays" },
      { id: "dsa_4", name: "Step 4: Binary Search (1D Arrays, Search Space Answers, 2D Matrix)", order: 3, covered: false, testDone: false, important: true, striverUrl: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", level: "Step 4: Binary Search" },
      { id: "dsa_5", name: "Step 5: Strings (Palindrome, Anagrams, Isomorphic, Longest Common Prefix)", order: 4, covered: false, testDone: false, important: false, striverUrl: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", level: "Step 5: Strings" },
      { id: "dsa_6", name: "Step 6: Linked Lists (Singly LL, Doubly LL, Reversal, Detect Cycle, LRU Cache)", order: 5, covered: false, testDone: false, important: true, striverUrl: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", level: "Step 6: LinkedList" },
      { id: "dsa_7", name: "Step 7: Recursion & Backtracking (Subsets, Combinations, N-Queens, Sudoku)", order: 6, covered: false, testDone: false, important: true, striverUrl: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", level: "Step 7: Recursion" },
      { id: "dsa_8", name: "Step 9: Stacks & Queues (Valid Parentheses, Next Greater Element, Monotonic Stack)", order: 7, covered: false, testDone: false, important: true, striverUrl: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", level: "Step 9: Stacks" },
      { id: "dsa_9", name: "Step 10: Sliding Window & Two Pointers (Max Consecutive Ones, Longest Substring)", order: 8, covered: false, testDone: false, important: true, striverUrl: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", level: "Step 10: Sliding Window" },
      { id: "dsa_10", name: "Step 11: Heaps / Priority Queues (Kth Largest, Median from Data Stream)", order: 9, covered: false, testDone: false, important: true, striverUrl: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", level: "Step 11: Heaps" },
      { id: "dsa_11", name: "Step 13: Binary Trees & BSTs (Traversals, BFS, DFS, LCA, Diameter, Validate BST)", order: 10, covered: false, testDone: false, important: true, striverUrl: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", level: "Step 13: Trees" },
      { id: "dsa_12", name: "Step 15: Graphs (BFS/DFS, Topological Sort, Shortest Path: Dijkstra, Bellman-Ford, MST)", order: 11, covered: false, testDone: false, important: true, striverUrl: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", level: "Step 15: Graphs" },
      { id: "dsa_13", name: "Step 16: Dynamic Programming (1D DP, Grid DP, 0/1 Knapsack, LCS, Stock DP)", order: 12, covered: false, testDone: false, important: true, striverUrl: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", level: "Step 16: DP" },
    ],
  },
  {
    id: "mern_js",
    name: "JavaScript (Basics to Advanced & Engine Internals)",
    order: 1,
    resourceType: "general",
    resourceLink: "",
    topics: [
      { id: "js_1", name: "JS Basics: Variables (let/const/var), Data Types, Type Coercion & Operators", order: 0, covered: false, testDone: false, important: false, level: "Basics" },
      { id: "js_2", name: "Loops, Conditionals, Functions (Arrow vs Regular) & First-Class Functions", order: 1, covered: false, testDone: false, important: false, level: "Basics" },
      { id: "js_3", name: "Arrays & Deep Methods (map, filter, reduce, slice, splice, find, flat)", order: 2, covered: false, testDone: false, important: true, level: "Core" },
      { id: "js_4", name: "Objects, Object Methods, Destructuring, Spread / Rest Operators", order: 3, covered: false, testDone: false, important: true, level: "Core" },
      { id: "js_5", name: "Execution Context, Call Stack, Memory Creation Phase & Hoisting", order: 4, covered: false, testDone: false, important: true, level: "Internals" },
      { id: "js_6", name: "Scope, Scope Chain, Lexical Environment & Closures", order: 5, covered: false, testDone: false, important: true, level: "Internals" },
      { id: "js_7", name: "Prototypes, Prototypal Inheritance, '__proto__' vs 'prototype' & ES6 Classes", order: 6, covered: false, testDone: false, important: true, level: "Internals" },
      { id: "js_8", name: "'this' Keyword Binding (Implicit, Explicit: call, apply, bind & Lexical Arrow)", order: 7, covered: false, testDone: false, important: true, level: "Internals" },
      { id: "js_9", name: "Asynchronous JS: Callbacks, Callback Hell, Promises & async/await", order: 8, covered: false, testDone: false, important: true, level: "Async" },
      { id: "js_10", name: "Event Loop: Call Stack, Microtask Queue (Promises) vs Macrotask Queue (setTimeout)", order: 9, covered: false, testDone: false, important: true, level: "Internals" },
      { id: "js_11", name: "Custom Polyfills: Array.map, filter, reduce, Function.prototype.bind, Promise.all", order: 10, covered: false, testDone: false, important: true, level: "Interview" },
      { id: "js_12", name: "Debounce, Throttle, Deep Clone (structuredClone vs JSON vs recursive)", order: 11, covered: false, testDone: false, important: true, level: "Interview" },
      { id: "js_13", name: "DOM Manipulation, Event Bubbling, Capturing & Event Delegation", order: 12, covered: false, testDone: false, important: false, level: "Web APIs" },
    ],
  },
  {
    id: "mern_react",
    name: "React.js (Basics to Frontend Architecture)",
    order: 2,
    resourceType: "general",
    resourceLink: "",
    topics: [
      { id: "react_1", name: "React Basics: JSX, Functional Components, Props vs State", order: 0, covered: false, testDone: false, important: false, level: "Basics" },
      { id: "react_2", name: "Core Hooks: useState, useEffect (dependencies & cleanups), useRef, useId", order: 1, covered: false, testDone: false, important: true, level: "Hooks" },
      { id: "react_3", name: "Forms: Controlled vs Uncontrolled Components & Custom Form Validation", order: 2, covered: false, testDone: false, important: false, level: "Forms" },
      { id: "react_4", name: "Virtual DOM, Diffing Algorithm, Key reconciliation & React 18 Fiber", order: 3, covered: false, testDone: false, important: true, level: "Internals" },
      { id: "react_5", name: "State Batching, Concurrent Mode (useTransition, useDeferredValue)", order: 4, covered: false, testDone: false, important: false, level: "React 18" },
      { id: "react_6", name: "Performance: useMemo, useCallback, React.memo pitfalls & Virtualized Lists", order: 5, covered: false, testDone: false, important: true, level: "Performance" },
      { id: "react_7", name: "Custom Hooks Architecture (useFetch, useDebounce, useLocalStorage)", order: 6, covered: false, testDone: false, important: true, level: "Patterns" },
      { id: "react_8", name: "State Management: Context API vs Zustand vs Redux Toolkit (Slices & Thunks)", order: 7, covered: false, testDone: false, important: true, level: "State" },
      { id: "react_9", name: "Code Splitting (React.lazy, Suspense), Error Boundaries & Web Vitals (LCP/CLS)", order: 8, covered: false, testDone: false, important: true, level: "Production" },
    ],
  },
  {
    id: "mern_node",
    name: "Node.js & Express.js (Backend Systems)",
    order: 3,
    resourceType: "general",
    resourceLink: "",
    topics: [
      { id: "node_1", name: "Node.js Architecture: V8, Libuv Thread Pool & Event Loop 6 Phases", order: 0, covered: false, testDone: false, important: true, level: "Internals" },
      { id: "node_2", name: "Core Modules: 'fs' (file system), 'path', 'events' (EventEmitter), 'http'", order: 1, covered: false, testDone: false, important: false, level: "Core" },
      { id: "node_3", name: "Streams & Buffers: Readable, Writable, Transform Streams & High-Throughput I/O", order: 2, covered: false, testDone: false, important: true, level: "Scale" },
      { id: "node_4", name: "Express.js Basics: Routing, Request/Response Lifecycle & URL Params", order: 3, covered: false, testDone: false, important: false, level: "Express" },
      { id: "node_5", name: "Middleware Chain Architecture & Central Global Error Handling", order: 4, covered: false, testDone: false, important: true, level: "Express" },
      { id: "node_6", name: "REST API Design Standards, HTTP Status Codes & Input Validation with Zod", order: 5, covered: false, testDone: false, important: true, level: "REST" },
      { id: "node_7", name: "Authentication: JWT Access & Refresh Token Rotation, bcrypt Password Hashing", order: 6, covered: false, testDone: false, important: true, level: "Auth" },
      { id: "node_8", name: "Security & Hardening: HttpOnly Cookies, CORS, Rate Limiting, Helmet & RBAC", order: 7, covered: false, testDone: false, important: true, level: "Security" },
    ],
  },
  {
    id: "mern_mongo",
    name: "MongoDB & Database Mastery",
    order: 4,
    resourceType: "general",
    resourceLink: "",
    topics: [
      { id: "db_1", name: "NoSQL Fundamentals: Documents, Collections, BSON vs Relational DBs", order: 0, covered: false, testDone: false, important: false, level: "Basics" },
      { id: "db_2", name: "CRUD Operations, Query & Projection Operators ($in, $gt, $elemMatch)", order: 1, covered: false, testDone: false, important: false, level: "CRUD" },
      { id: "db_3", name: "Mongoose ODM: Schemas, Models, Types, Validations, Pre/Post Hooks & Virtuals", order: 2, covered: false, testDone: false, important: true, level: "Mongoose" },
      { id: "db_4", name: "Data Modeling: Embedded Subdocuments vs Referenced Relations (1:1, 1:N, N:M)", order: 3, covered: false, testDone: false, important: true, level: "Modeling" },
      { id: "db_5", name: "Indexing Strategies: Single, Compound Indexes, ESR Rule, TTL & explain('executionStats')", order: 4, covered: false, testDone: false, important: true, level: "Performance" },
      { id: "db_6", name: "Aggregation Framework: $match, $group, $lookup, $unwind, $project, $facet, $sort", order: 5, covered: false, testDone: false, important: true, level: "Aggregation" },
      { id: "db_7", name: "ACID Multi-Document Transactions in MongoDB & Replication/Sharding Architecture", order: 6, covered: false, testDone: false, important: true, level: "Advanced" },
    ],
  },
  {
    id: "mern_system",
    name: "Full-Stack System Design & Machine Coding",
    order: 5,
    resourceType: "general",
    resourceLink: "",
    topics: [
      { id: "sys_1", name: "Frontend-Backend Integration: Axios Interceptors, Token Refresh, Error Contracts", order: 0, covered: false, testDone: false, important: true, level: "Integration" },
      { id: "sys_2", name: "Real-Time Communication: WebSockets (Socket.io) vs Server-Sent Events (SSE) vs Polling", order: 1, covered: false, testDone: false, important: true, level: "Real-Time" },
      { id: "sys_3", name: "Caching Architecture: Redis Cache-Aside Pattern, TTL & Invalidation Strategies", order: 2, covered: false, testDone: false, important: true, level: "Caching" },
      { id: "sys_4", name: "Machine Coding: Autocomplete / Search with Debounce & Cache (Live Coding Round)", order: 3, covered: false, testDone: false, important: true, level: "Machine Coding" },
      { id: "sys_5", name: "Machine Coding: Virtualized Infinite Scroll & Kanban Board Component", order: 4, covered: false, testDone: false, important: true, level: "Machine Coding" },
      { id: "sys_6", name: "System Design: Load Balancers, Horizontal vs Vertical Scaling, DB Sharding & CDNs", order: 5, covered: false, testDone: false, important: true, level: "System Design" },
      { id: "sys_7", name: "Full-Stack Production Project Architecture Defense & STAR Interview Preparation", order: 6, covered: false, testDone: false, important: true, level: "Interview" },
    ],
  },
];

// ── Settings Routes ──────────────────────────────────────────

app.get("/api/settings", async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: "main" });
    if (!settings) {
      settings = await Settings.create({
        key: "main",
        startDate: "2026-08-24",
        targetDate: "2026-11-24",
        birthdayDate: "2026-11-24",
      });
    }
    const startDate = settings.startDate || "2026-08-24";
    const targetDate = settings.targetDate || settings.birthdayDate || "2026-11-24";
    res.json({
      key: settings.key,
      startDate,
      targetDate,
      birthdayDate: targetDate,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/settings", async (req, res) => {
  try {
    const startDate = req.body.startDate || "2026-08-24";
    const targetDate = req.body.targetDate || req.body.birthdayDate || "2026-11-24";
    const settings = await Settings.findOneAndUpdate(
      { key: "main" },
      { startDate, targetDate, birthdayDate: targetDate },
      { new: true, upsert: true },
    );
    res.json({
      key: settings.key,
      startDate: settings.startDate,
      targetDate: settings.targetDate,
      birthdayDate: settings.targetDate,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Habits Routes ────────────────────────────────────────────

app.get("/api/habits", async (req, res) => {
  try {
    const { month } = req.query;
    if (!month || !/^\d{4}-\d{2}$/.test(month))
      return res
        .status(400)
        .json({ error: "Valid month param required (YYYY-MM)" });
    const regex = new RegExp(`^${month}-`);
    const days = await HabitDay.find({ date: regex }).sort({ date: 1 });
    res.json(days);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/habits/:date", async (req, res) => {
  try {
    const day = await HabitDay.findOne({ date: req.params.date });
    res.json(
      day || {
        date: req.params.date,
        habits: {},
        sleepHours: null,
        mernMinutes: null,
        craftMinutes: null,
      },
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/habits/:date", async (req, res) => {
  try {
    const {
      habits,
      sleepHours,
      mernMinutes,
      craftMinutes,
      taskOrder,
      customTasks,
      pinnedTimes,
      lateEntries,
      studyLogs,
    } = req.body;
    const finalMinutes = mernMinutes ?? craftMinutes ?? null;
    const updateData = {
      habits: habits || {},
      sleepHours: sleepHours ?? null,
      mernMinutes: finalMinutes,
      craftMinutes: finalMinutes,
    };
    if (taskOrder !== undefined && taskOrder !== null)
      updateData.taskOrder = taskOrder;
    if (customTasks !== undefined && customTasks !== null)
      updateData.customTasks = customTasks;
    if (pinnedTimes !== undefined && pinnedTimes !== null)
      updateData.pinnedTimes = pinnedTimes;
    if (lateEntries !== undefined && lateEntries !== null)
      updateData.lateEntries = lateEntries;
    if (studyLogs !== undefined && studyLogs !== null)
      updateData.studyLogs = studyLogs;

    const day = await HabitDay.findOneAndUpdate(
      { date: req.params.date },
      updateData,
      { new: true, upsert: true },
    );
    res.json(day);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/habits", async (req, res) => {
  try {
    await HabitDay.deleteMany({});
    res.json({ message: "All habit data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Stats Routes ─────────────────────────────────────────────

app.get("/api/stats/streaks", async (req, res) => {
  try {
    const settings = await Settings.findOne({ key: "main" });
    const startDate = settings?.startDate || "2026-08-24";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const past = new Date(today);
    past.setDate(past.getDate() - 400);
    const pastStr = past.toISOString().slice(0, 10);
    const todayStr = today.toISOString().slice(0, 10);
    const days = await HabitDay.find({
      date: { $lte: todayStr, $gte: startDate },
    }).sort({ date: -1 });
    const dayMap = {};
    days.forEach((d) => {
      dayMap[d.date] = d;
    });

    const calcStreak = (checkFn) => {
      let streak = 0;
      for (let i = 0; i < 400; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const ds = d.toISOString().slice(0, 10);
        if (ds < startDate) break; // Don't count before launch date
        const data = dayMap[ds];
        if (data && checkFn(data.habits || {})) streak++;
        else break;
      }
      return streak;
    };

    const checks = {
      all: (h) => {
        const k = Object.keys(h);
        return k.length > 0 && k.every((x) => h[x] === true);
      },
      exercise: (h) => h.exercise === true,
      pooja: (h) => h.pooja === true,
      gov: (h) =>
        h.govMorning === true ||
        h.govSecond === true ||
        h.govDrill === true ||
        h.govNight === true ||
        h.govRevision === true,
      mern: (h) =>
        h.mern === true ||
        h.mernMorning === true ||
        h.mernDsa === true ||
        h.mernBackend === true ||
        h.mernNight === true ||
        h.mernProject === true ||
        h.mernClass === true ||
        h.mernMock === true ||
        h.genai === true ||
        h.crafting === true,
      reading: (h) => h.reading === true || h.bookReading === true,
      sleep: (h) => h.sleepGoal === true,
    };

    const streaks = {};
    for (const [key, fn] of Object.entries(checks))
      streaks[key] = calcStreak(fn);
    res.json(streaks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const getMernMinutesAggregation = async (req, res) => {
  try {
    const settings = await Settings.findOne({ key: "main" });
    const startDate = settings?.startDate || "2026-08-24";
    const result = await HabitDay.aggregate([
      { $match: { date: { $gte: startDate } } },
      {
        $project: {
          minutes: { $ifNull: ["$mernMinutes", "$craftMinutes"] },
        },
      },
      { $match: { minutes: { $ne: null, $gt: 0 } } },
      { $group: { _id: null, total: { $sum: "$minutes" } } },
    ]);
    res.json({ totalMinutes: result.length > 0 ? result[0].total : 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

app.get("/api/stats/mern-total", getMernMinutesAggregation);
app.get("/api/stats/craft-total", getMernMinutesAggregation);

// ── Exam Tracker Routes (Government Exams) ────────────────────

app.get("/api/exam-tracker", async (req, res) => {
  try {
    let tracker = await ExamTracker.findOne({ key: "main" });
    if (!tracker) {
      tracker = await ExamTracker.create({
        key: "main",
        subjects: DEFAULT_GOV_SUBJECTS,
      });
    }
    res.json(tracker);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/exam-tracker", async (req, res) => {
  try {
    const { subjects } = req.body;
    const tracker = await ExamTracker.findOneAndUpdate(
      { key: "main" },
      { subjects: subjects || [] },
      { new: true, upsert: true },
    );
    res.json(tracker);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/exam-tracker", async (req, res) => {
  try {
    await ExamTracker.deleteMany({});
    res.json({ message: "Exam tracker reset" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── MERN & DSA Curriculum Tracker Routes ──────────────────────

app.get("/api/mern-tracker", async (req, res) => {
  try {
    let tracker = await MernTracker.findOne({ key: "main" });
    if (!tracker) {
      tracker = await MernTracker.create({
        key: "main",
        subjects: DEFAULT_MERN_SUBJECTS,
      });
    }
    res.json(tracker);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/mern-tracker", async (req, res) => {
  try {
    const { subjects } = req.body;
    const tracker = await MernTracker.findOneAndUpdate(
      { key: "main" },
      { subjects: subjects || [] },
      { new: true, upsert: true },
    );
    res.json(tracker);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/mern-tracker", async (req, res) => {
  try {
    await MernTracker.deleteMany({});
    res.json({ message: "MERN tracker reset" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Error Handler ────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.message);
  res.status(500).json({ error: err.message });
});

// ── Start Server ─────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("\n  ERROR: MONGO_URI not set in .env file\n");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    console.log(`🚀 Server running on port ${PORT}\n`);
    app.listen(PORT);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
