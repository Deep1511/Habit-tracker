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
    dot: "bg-terra",
    text: "text-terra",
    bg: "bg-terra-pale",
    border: "border-terra/20",
    icon: "fa-om",
  },
  gov: {
    dot: "bg-terra-dark",
    text: "text-terra-dark",
    bg: "bg-terra-pale",
    border: "border-terra/20",
    icon: "fa-book",
  },
  genai: {
    dot: "bg-teal",
    text: "text-teal",
    bg: "bg-teal-pale",
    border: "border-teal/20",
    icon: "fa-robot",
  },
  craft: {
    dot: "bg-gold",
    text: "text-gold-dark",
    bg: "bg-gold-pale",
    border: "border-gold/20",
    icon: "fa-palette",
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

// ── Helper: get day type ─────────────────────────────────────

export function getDayType(date) {
  const d = date.getDay();
  if (d === 0 || d === 6) return "weekend";
  if (d === 1 || d === 3) return "class";
  return "normal";
}

function isBeforeBirthday(dateStr, birthdayDate) {
  return dateStr < birthdayDate;
}

// ── Shared morning blocks ────────────────────────────────────
// Wake → Exercise → Bath → Study → Pooja → Snacks → Leave

const MORNING_WEEKDAY = [
  { time: "6:00 AM", label: "Wake Up", cat: "routine" },
  {
    time: "6:00 AM",
    label: "Freshen Up + Push Ups + Exercise",
    cat: "exercise",
    key: "exercise",
    dur: "15 min",
  },
  { time: "6:15 AM", label: "Bath + Get Ready", cat: "routine", dur: "15 min" },
  {
    time: "6:30 AM",
    label: "Gov Exam — New Topic (fresh brain)",
    cat: "gov",
    key: "govMorning",
    dur: "60 min",
  },
  {
    time: "7:30 AM",
    label: "Pooja (before snacks)",
    cat: "pooja",
    key: "pooja",
    dur: "15 min",
  },
  {
    time: "7:45 AM",
    label: "Breakfast / Snacks",
    cat: "routine",
    dur: "30 min",
  },
  { time: "8:15 AM", label: "Leave Home", cat: "routine" },
  {
    time: "8:30 AM",
    label: "Commute to Office",
    cat: "routine",
    dur: "60 min",
  },
  { time: "9:30 AM", label: "Settle In", cat: "routine", dur: "30 min" },
];

const MORNING_WEEKEND = [
  { time: "6:00 AM", label: "Wake Up", cat: "routine" },
  {
    time: "6:00 AM",
    label: "Freshen Up + Push Ups + Exercise",
    cat: "exercise",
    key: "exercise",
    dur: "15 min",
  },
  { time: "6:15 AM", label: "Bath + Get Ready", cat: "routine", dur: "15 min" },
  {
    time: "6:30 AM",
    label: "Pooja (before snacks)",
    cat: "pooja",
    key: "pooja",
    dur: "15 min",
  },
  { time: "6:45 AM", label: "Breakfast", cat: "routine", dur: "30 min" },
  {
    time: "7:15 AM",
    label: "Gov Exam — Deep Study + Practice Test",
    cat: "gov",
    key: "govMorning",
    dur: "2 hrs",
  },
  { time: "9:15 AM", label: "Break — Tea", cat: "break", dur: "15 min" },
];

// Wind-down block description (same for all, just different times)
const WIND_DOWN = (time) => [
  {
    time,
    label:
      "Wind Down — Phone/laptop/TV off. Light reading, deep breathing, dim lights",
    cat: "winddown",
  },
];

// ── All 6 schedule variants ─────────────────────────────────

// PRE-BIRTHDAY: Class Night (Mon/Wed) — 6hr sleep
const preClass = {
  label: "Mission Mode — Class Night",
  icon: "fa-video",
  color: "terra",
  bgClass: "bg-terra-pale",
  borderClass: "border-terra/20",
  badgeClass: "bg-terra text-white",
  sleepTarget: 6,
  craftMins: 40,
  blocks: [
    ...MORNING_WEEKDAY,
    {
      time: "10:00 AM",
      label: "GenAI — Review / Reading",
      cat: "genai",
      key: "genai",
      dur: "75 min",
    },
    { time: "11:15 AM", label: "Work Tasks", cat: "work" },
    {
      time: "2:00 PM",
      label: "Gov Exam — Practice Questions",
      cat: "gov",
      key: "govSecond",
      dur: "75 min",
    },
    { time: "3:15 PM", label: "Work Tasks", cat: "work" },
    { time: "6:00 PM", label: "Commute Home", cat: "routine", dur: "90 min" },
    {
      time: "7:30 PM",
      label: "Dinner + Unwind",
      cat: "routine",
      dur: "45 min",
    },
    {
      time: "8:15 PM",
      label: "Crafting — Birthday Gift",
      cat: "craft",
      key: "crafting",
      dur: "40 min",
    },
    {
      time: "8:55 PM",
      label: "Transition to Class",
      cat: "routine",
      dur: "5 min",
    },
    {
      time: "9:00 PM",
      label: "GenAI Live Class",
      cat: "genai",
      key: "genaiClass",
      dur: "2.5 hrs",
    },
    ...WIND_DOWN("11:30 PM"),
    {
      time: "12:00 AM",
      label: "Bedtime (~6 hrs)",
      cat: "sleep",
      key: "sleepGoal",
    },
  ],
};

// PRE-BIRTHDAY: Normal Night (Tue/Thu/Fri) — 6hr sleep, max craft
const preNormal = {
  label: "Mission Mode — Normal Night",
  icon: "fa-bolt",
  color: "terra",
  bgClass: "bg-terra-pale",
  borderClass: "border-terra/20",
  badgeClass: "bg-terra text-white",
  sleepTarget: 6,
  craftMins: 120,
  blocks: [
    ...MORNING_WEEKDAY,
    {
      time: "10:00 AM",
      label: "GenAI — Theory / Lessons",
      cat: "genai",
      key: "genai",
      dur: "75 min",
    },
    { time: "11:15 AM", label: "Work Tasks", cat: "work" },
    {
      time: "2:00 PM",
      label: "GenAI — Hands-on Practice",
      cat: "genai",
      key: "genaiOffice2",
      dur: "75 min",
    },
    { time: "3:15 PM", label: "Work Tasks", cat: "work" },
    { time: "6:00 PM", label: "Commute Home", cat: "routine", dur: "90 min" },
    {
      time: "7:30 PM",
      label: "Dinner + Unwind",
      cat: "routine",
      dur: "45 min",
    },
    {
      time: "8:15 PM",
      label: "Crafting — Main Block",
      cat: "craft",
      key: "crafting",
      dur: "75 min",
    },
    {
      time: "9:30 PM",
      label: "Gov Exam — Revision",
      cat: "gov",
      key: "govSecond",
      dur: "45 min",
    },
    {
      time: "10:15 PM",
      label: "Crafting — Extra Block",
      cat: "craft",
      key: "craftExtra",
      dur: "45 min",
    },
    ...WIND_DOWN("11:00 PM"),
    {
      time: "12:00 AM",
      label: "Bedtime (~6 hrs)",
      cat: "sleep",
      key: "sleepGoal",
    },
  ],
};

// PRE-BIRTHDAY: Weekend — 6hr sleep, big craft blocks
const preWeekend = {
  label: "Mission Mode — Weekend",
  icon: "fa-fire",
  color: "terra",
  bgClass: "bg-terra-pale",
  borderClass: "border-terra/20",
  badgeClass: "bg-terra text-white",
  sleepTarget: 6,
  craftMins: 240,
  blocks: [
    ...MORNING_WEEKEND,
    {
      time: "9:30 AM",
      label: "GenAI — Project Work",
      cat: "genai",
      key: "genai",
      dur: "60 min",
    },
    {
      time: "10:30 AM",
      label: "Crafting — Main Build Block",
      cat: "craft",
      key: "crafting",
      dur: "2.5 hrs",
    },
    { time: "1:00 PM", label: "Free Time / Rest / Errands", cat: "routine" },
    {
      time: "8:00 PM",
      label: "Crafting — Extra Block",
      cat: "craft",
      key: "craftExtra",
      dur: "1.5 hrs",
    },
    ...WIND_DOWN("9:30 PM"),
    {
      time: "12:00 AM",
      label: "Bedtime (~6 hrs)",
      cat: "sleep",
      key: "sleepGoal",
    },
  ],
};

// POST-BIRTHDAY: Class Night (Mon/Wed) — 6hr sleep (unavoidable)
const postClass = {
  label: "Recovery Mode — Class Night",
  icon: "fa-video",
  color: "teal",
  bgClass: "bg-teal-pale",
  borderClass: "border-teal/20",
  badgeClass: "bg-teal text-white",
  sleepTarget: 6,
  craftMins: 40,
  blocks: [
    ...MORNING_WEEKDAY,
    {
      time: "10:00 AM",
      label: "GenAI — Review / Reading",
      cat: "genai",
      key: "genai",
      dur: "75 min",
    },
    { time: "11:15 AM", label: "Work Tasks", cat: "work" },
    {
      time: "2:00 PM",
      label: "Gov Exam — Practice Questions",
      cat: "gov",
      key: "govSecond",
      dur: "75 min",
    },
    { time: "3:15 PM", label: "Work Tasks", cat: "work" },
    { time: "6:00 PM", label: "Commute Home", cat: "routine", dur: "90 min" },
    {
      time: "7:30 PM",
      label: "Dinner + Unwind",
      cat: "routine",
      dur: "45 min",
    },
    {
      time: "8:15 PM",
      label: "Crafting — Birthday Gift",
      cat: "craft",
      key: "crafting",
      dur: "40 min",
    },
    {
      time: "8:55 PM",
      label: "Transition to Class",
      cat: "routine",
      dur: "5 min",
    },
    {
      time: "9:00 PM",
      label: "GenAI Live Class",
      cat: "genai",
      key: "genaiClass",
      dur: "2.5 hrs",
    },
    ...WIND_DOWN("11:30 PM"),
    {
      time: "11:45 PM",
      label: "Bedtime (~6 hrs — class night)",
      cat: "sleep",
      key: "sleepGoal",
    },
  ],
};

// POST-BIRTHDAY: Normal Night (Tue/Thu/Fri) — 7.5hr sleep, normal craft
const postNormal = {
  label: "Recovery Mode — Normal Night",
  icon: "fa-moon",
  color: "teal",
  bgClass: "bg-teal-pale",
  borderClass: "border-teal/20",
  badgeClass: "bg-teal text-white",
  sleepTarget: 7.5,
  craftMins: 45,
  blocks: [
    ...MORNING_WEEKDAY,
    {
      time: "10:00 AM",
      label: "GenAI — Theory / Lessons",
      cat: "genai",
      key: "genai",
      dur: "75 min",
    },
    { time: "11:15 AM", label: "Work Tasks", cat: "work" },
    {
      time: "2:00 PM",
      label: "GenAI — Hands-on Practice",
      cat: "genai",
      key: "genaiOffice2",
      dur: "75 min",
    },
    { time: "3:15 PM", label: "Work Tasks", cat: "work" },
    { time: "6:00 PM", label: "Commute Home", cat: "routine", dur: "90 min" },
    {
      time: "7:30 PM",
      label: "Dinner + Unwind",
      cat: "routine",
      dur: "45 min",
    },
    {
      time: "8:15 PM",
      label: "Short Break — Walk / Relax",
      cat: "break",
      dur: "15 min",
    },
    {
      time: "8:30 PM",
      label: "Gov Exam — Revision",
      cat: "gov",
      key: "govSecond",
      dur: "45 min",
    },
    { time: "9:15 PM", label: "Short Break", cat: "break", dur: "5 min" },
    {
      time: "9:30 PM",
      label: "Crafting — Birthday Gift",
      cat: "craft",
      key: "crafting",
      dur: "45 min",
    },
    ...WIND_DOWN("10:15 PM"),
    {
      time: "10:30 PM",
      label: "Bedtime (~7.5 hrs)",
      cat: "sleep",
      key: "sleepGoal",
    },
  ],
};

// POST-BIRTHDAY: Weekend — 8hr sleep
const postWeekend = {
  label: "Recovery Mode — Weekend",
  icon: "fa-sun",
  color: "gold",
  bgClass: "bg-gold-pale",
  borderClass: "border-gold/20",
  badgeClass: "bg-gold text-white",
  sleepTarget: 8,
  craftMins: 150,
  blocks: [
    ...MORNING_WEEKEND,
    {
      time: "9:30 AM",
      label: "GenAI — Project Work",
      cat: "genai",
      key: "genai",
      dur: "60 min",
    },
    {
      time: "10:30 AM",
      label: "Crafting — Main Build Block",
      cat: "craft",
      key: "crafting",
      dur: "2.5 hrs",
    },
    { time: "1:00 PM", label: "Free Time / Rest / Errands", cat: "routine" },
    {
      time: "8:30 PM",
      label: "Optional: Extra Craft Session",
      cat: "craft",
      key: "craftExtra",
      dur: "0–1 hr",
    },
    ...WIND_DOWN("10:00 PM"),
    {
      time: "10:30 PM",
      label: "Bedtime (~8 hrs)",
      cat: "sleep",
      key: "sleepGoal",
    },
  ],
};

const S = {
  preClass,
  preNormal,
  preWeekend,
  postClass,
  postNormal,
  postWeekend,
};

// ── Main lookup ──────────────────────────────────────────────

export function getSchedule(dateStr, birthdayDate) {
  const date = parseDate(dateStr);
  const dt = getDayType(date);
  const pre = isBeforeBirthday(dateStr, birthdayDate);

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

// ── Date utilities ───────────────────────────────────────────

export function fmtDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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
  const now = new Date();
  const months = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    });
  }
  return months;
}

export function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid = [];
  for (let i = 0; i < firstDay; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(new Date(year, month, d));
  return grid;
}

export function daysUntilBirthday(birthdayDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bd = parseDate(birthdayDate);
  bd.setHours(0, 0, 0, 0);
  return Math.ceil((bd - today) / (1000 * 60 * 60 * 24));
}

// ── Habit summary ────────────────────────────────────────────

export function getHabitSummary(dateStr, birthdayDate, dayData) {
  const h = dayData?.habits || {};
  const sched = getSchedule(dateStr, birthdayDate);
  const trackable = sched.blocks.filter((b) => b.key);

  return {
    exercise: !!h.exercise,
    pooja: !!h.pooja,
    gov: !!h.govMorning,
    genai: !!h.genai || !!h.genaiClass || !!h.genaiOffice2,
    craft: !!h.crafting,
    sleep: !!h.sleepGoal,
    total: trackable.length,
    done: trackable.filter((b) => h[b.key]).length,
    allDone: trackable.length > 0 && trackable.every((b) => h[b.key]),
  };
}

// ── Craft phases ─────────────────────────────────────────────

export const CRAFT_PHASES = [
  {
    name: "Planning & Materials",
    desc: "Sketch, gather supplies, start prep",
    targetHrs: 8,
    icon: "fa-compass-drafting",
  },
  {
    name: "Core Build",
    desc: "Assemble main pieces",
    targetHrs: 16,
    icon: "fa-hammer",
  },
  {
    name: "Detailing",
    desc: "Colors, personalization, refine",
    targetHrs: 24,
    icon: "fa-paintbrush",
  },
  {
    name: "Finishing & Buffer",
    desc: "Final touches, packaging",
    targetHrs: 32,
    icon: "fa-gift",
  },
];

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
