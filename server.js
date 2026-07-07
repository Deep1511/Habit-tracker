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
});
const HabitDay = mongoose.model("HabitDay", HabitDaySchema);

const SettingsSchema = new mongoose.Schema({
  key: { type: String, default: "main" },
  birthdayDate: { type: String, required: true },
});
const Settings = mongoose.model("Settings", SettingsSchema);

// ── Settings Routes ──────────────────────────────────────────

// Get or create settings
app.get("/api/settings", async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: "main" });
    if (!settings) {
      // Default: Aug 11 of this year or next
      const now = new Date();
      let year = now.getFullYear();
      const bd = new Date(year, 7, 11); // month is 0-indexed, Aug=7
      if (bd < now) year++;
      settings = await Settings.create({ birthdayDate: `${year}-08-11` });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update settings
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

// Get habits for a month (YYYY-MM format)
app.get("/api/habits", async (req, res) => {
  try {
    const { month } = req.query;
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res
        .status(400)
        .json({ error: "Valid month param required (YYYY-MM)" });
    }
    const regex = new RegExp(`^${month}-`);
    const days = await HabitDay.find({ date: regex }).sort({ date: 1 });
    res.json(days);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single day
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

// Upsert single day
app.put("/api/habits/:date", async (req, res) => {
  try {
    const { habits, sleepHours, craftMinutes } = req.body;
    const day = await HabitDay.findOneAndUpdate(
      { date: req.params.date },
      {
        habits: habits || {},
        sleepHours: sleepHours ?? null,
        craftMinutes: craftMinutes ?? null,
      },
      { new: true, upsert: true },
    );
    res.json(day);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset all habit data
app.delete("/api/habits", async (req, res) => {
  try {
    await HabitDay.deleteMany({});
    res.json({ message: "All habit data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Stats Routes ─────────────────────────────────────────────

// Calculate streaks
app.get("/api/stats/streaks", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch last 400 days of data
    const past = new Date(today);
    past.setDate(past.getDate() - 400);
    const pastStr = past.toISOString().slice(0, 10);
    const todayStr = today.toISOString().slice(0, 10);

    const days = await HabitDay.find({
      date: { $lte: todayStr, $gte: pastStr },
    }).sort({ date: -1 });

    // Build a map for quick lookup
    const dayMap = {};
    days.forEach((d) => {
      dayMap[d.date] = d;
    });

    // Check if a date's habit is done
    const isDone = (dateStr, checkFn) => {
      const d = dayMap[dateStr];
      if (!d) return false;
      return checkFn(d.habits || {});
    };

    // Calculate streak going backwards from today
    const calcStreak = (checkFn) => {
      let streak = 0;
      for (let i = 0; i < 400; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const ds = d.toISOString().slice(0, 10);
        if (isDone(ds, checkFn)) streak++;
        else break;
      }
      return streak;
    };

    // Habit check functions
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
    for (const [key, fn] of Object.entries(checks)) {
      streaks[key] = calcStreak(fn);
    }

    res.json(streaks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Total craft minutes
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

// ── Error Handler ────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server error" });
});

// ── Start Server ─────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
