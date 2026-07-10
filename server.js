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
  craftMinutes: { type: Number, default: null },
  taskOrder: { type: [String], default: undefined },
  customTasks: { type: Object, default: undefined },
  pinnedTimes: { type: Object, default: undefined },
  lateEntries: { type: Object, default: undefined },
});
const HabitDay = mongoose.model("HabitDay", HabitDaySchema);

const SettingsSchema = new mongoose.Schema({
  key: { type: String, default: "main" },
  birthdayDate: { type: String, required: true },
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

const DEFAULT_SUBJECTS = [
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

// ── Settings Routes ──────────────────────────────────────────

app.get("/api/settings", async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: "main" });
    if (!settings) {
      const now = new Date();
      let year = now.getFullYear();
      const bd = new Date(year, 7, 11);
      if (bd < now) year++;
      settings = await Settings.create({ birthdayDate: `${year}-08-11` });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/settings", async (req, res) => {
  try {
    const { birthdayDate } = req.body;
    if (!birthdayDate)
      return res.status(400).json({ error: "birthdayDate required" });
    const settings = await Settings.findOneAndUpdate(
      { key: "main" },
      { birthdayDate },
      { new: true, upsert: true },
    );
    res.json(settings);
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
      craftMinutes,
      taskOrder,
      customTasks,
      pinnedTimes,
      lateEntries,
    } = req.body;
    const updateData = {
      habits: habits || {},
      sleepHours: sleepHours ?? null,
      craftMinutes: craftMinutes ?? null,
    };
    if (taskOrder !== undefined && taskOrder !== null)
      updateData.taskOrder = taskOrder;
    if (customTasks !== undefined && customTasks !== null)
      updateData.customTasks = customTasks;
    if (pinnedTimes !== undefined && pinnedTimes !== null)
      updateData.pinnedTimes = pinnedTimes;
    if (lateEntries !== undefined && lateEntries !== null)
      updateData.lateEntries = lateEntries;

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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const past = new Date(today);
    past.setDate(past.getDate() - 400);
    const pastStr = past.toISOString().slice(0, 10);
    const todayStr = today.toISOString().slice(0, 10);
    const days = await HabitDay.find({
      date: { $lte: todayStr, $gte: pastStr },
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
      gov: (h) => h.govMorning === true,
      genai: (h) =>
        h.genai === true || h.genaiClass === true || h.genaiOffice2 === true,
      craft: (h) => h.crafting === true,
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

app.get("/api/stats/craft-total", async (req, res) => {
  try {
    const result = await HabitDay.aggregate([
      { $match: { craftMinutes: { $ne: null, $gt: 0 } } },
      { $group: { _id: null, total: { $sum: "$craftMinutes" } } },
    ]);
    res.json({ totalMinutes: result.length > 0 ? result[0].total : 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Exam Tracker Routes ──────────────────────────────────────

app.get("/api/exam-tracker", async (req, res) => {
  try {
    let tracker = await ExamTracker.findOne({ key: "main" });
    if (!tracker) {
      tracker = await ExamTracker.create({
        key: "main",
        subjects: DEFAULT_SUBJECTS,
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
