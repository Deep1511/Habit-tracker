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

function isBeforeBirthday(dateStr, birthdayDate) {
  return dateStr < birthdayDate;
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
    label: "Gov Exam — New Topic",
    cat: "gov",
    key: "govMorning",
    durMins: 60,
    trackable: true,
  },
  {
    time: "7:30 AM",
    label: "Pooja",
    cat: "pooja",
    key: "pooja",
    durMins: 15,
    trackable: true,
  },
  {
    time: "7:45 AM",
    label: "Breakfast / Snacks",
    cat: "routine",
    key: "_snacks",
    durMins: 30,
  },
  {
    time: "8:15 AM",
    label: "Leave Home",
    cat: "routine",
    key: "_leave",
    durMins: 15,
  },
  {
    time: "8:30 AM",
    label: "Commute to Office",
    cat: "routine",
    key: "_commute",
    durMins: 60,
  },
  {
    time: "9:30 AM",
    label: "Settle In",
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
    label: "Pooja",
    cat: "pooja",
    key: "pooja",
    durMins: 15,
    trackable: true,
  },
  {
    time: "6:45 AM",
    label: "Breakfast",
    cat: "routine",
    key: "_snacks",
    durMins: 30,
  },
  {
    time: "7:15 AM",
    label: "Gov Exam — Deep Study + Practice Test",
    cat: "gov",
    key: "govMorning",
    durMins: 120,
    trackable: true,
  },
  {
    time: "9:15 AM",
    label: "Break — Tea",
    cat: "break",
    key: "_tea",
    durMins: 15,
  },
];

// ── All 6 schedule variants ─────────────────────────────────

const S = {};

S.preClass = {
  label: "Mission Mode — Class Night",
  icon: "fa-video",
  color: "terra",
  bgClass: "bg-terra-pale",
  borderClass: "border-terra/20",
  badgeClass: "bg-terra text-white",
  sleepTarget: 6,
  craftMins: 40,
  blocks: [
    ...MW,
    {
      time: "10:00 AM",
      label: "GenAI — Review / Reading",
      cat: "genai",
      key: "genai",
      durMins: 75,
      trackable: true,
    },
    {
      time: "11:15 AM",
      label: "Work Tasks",
      cat: "work",
      key: "_work1",
      durMins: 165,
    },
    {
      time: "2:00 PM",
      label: "Gov Exam — Practice Questions",
      cat: "gov",
      key: "govSecond",
      durMins: 75,
      trackable: true,
    },
    {
      time: "3:15 PM",
      label: "Work Tasks",
      cat: "work",
      key: "_work2",
      durMins: 165,
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
      label: "Dinner + Unwind",
      cat: "routine",
      key: "_dinner",
      durMins: 45,
    },
    {
      time: "8:15 PM",
      label: "Crafting — Birthday Gift",
      cat: "craft",
      key: "crafting",
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
      label: "GenAI Live Class",
      cat: "genai",
      key: "genaiClass",
      durMins: 150,
      trackable: true,
    },
    {
      time: "11:30 PM",
      label:
        "Wind Down — Phone/laptop/TV off. Light reading, deep breathing, dim lights",
      cat: "winddown",
      key: "_winddown",
      durMins: 30,
    },
    {
      time: "12:00 AM",
      label: "Bedtime (~6 hrs)",
      cat: "sleep",
      key: "sleepGoal",
      durMins: 0,
      trackable: true,
    },
  ],
};

S.preNormal = {
  label: "Mission Mode — Normal Night",
  icon: "fa-bolt",
  color: "terra",
  bgClass: "bg-terra-pale",
  borderClass: "border-terra/20",
  badgeClass: "bg-terra text-white",
  sleepTarget: 6,
  craftMins: 120,
  blocks: [
    ...MW,
    {
      time: "10:00 AM",
      label: "GenAI — Theory / Lessons",
      cat: "genai",
      key: "genai",
      durMins: 75,
      trackable: true,
    },
    {
      time: "11:15 AM",
      label: "Work Tasks",
      cat: "work",
      key: "_work1",
      durMins: 165,
    },
    {
      time: "2:00 PM",
      label: "GenAI — Hands-on Practice",
      cat: "genai",
      key: "genaiOffice2",
      durMins: 75,
      trackable: true,
    },
    {
      time: "3:15 PM",
      label: "Work Tasks",
      cat: "work",
      key: "_work2",
      durMins: 165,
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
      label: "Dinner + Unwind",
      cat: "routine",
      key: "_dinner",
      durMins: 45,
    },
    {
      time: "8:15 PM",
      label: "Crafting — Main Block",
      cat: "craft",
      key: "crafting",
      durMins: 75,
      trackable: true,
    },
    {
      time: "9:30 PM",
      label: "Gov Exam — Revision",
      cat: "gov",
      key: "govSecond",
      durMins: 45,
      trackable: true,
    },
    {
      time: "10:15 PM",
      label: "Crafting — Extra Block",
      cat: "craft",
      key: "craftExtra",
      durMins: 45,
      trackable: true,
    },
    {
      time: "11:00 PM",
      label:
        "Wind Down — Phone/laptop/TV off. Light reading, deep breathing, dim lights",
      cat: "winddown",
      key: "_winddown",
      durMins: 60,
    },
    {
      time: "12:00 AM",
      label: "Bedtime (~6 hrs)",
      cat: "sleep",
      key: "sleepGoal",
      durMins: 0,
      trackable: true,
    },
  ],
};

S.preWeekend = {
  label: "Mission Mode — Weekend",
  icon: "fa-fire",
  color: "terra",
  bgClass: "bg-terra-pale",
  borderClass: "border-terra/20",
  badgeClass: "bg-terra text-white",
  sleepTarget: 6,
  craftMins: 240,
  blocks: [
    ...ME,
    {
      time: "9:30 AM",
      label: "GenAI — Project Work",
      cat: "genai",
      key: "genai",
      durMins: 60,
      trackable: true,
    },
    {
      time: "10:30 AM",
      label: "Crafting — Main Build Block",
      cat: "craft",
      key: "crafting",
      durMins: 150,
      trackable: true,
    },
    {
      time: "1:00 PM",
      label: "Free Time / Rest / Errands",
      cat: "routine",
      key: "_free",
      durMins: 420,
    },
    {
      time: "8:00 PM",
      label: "Crafting — Extra Block",
      cat: "craft",
      key: "craftExtra",
      durMins: 90,
      trackable: true,
    },
    {
      time: "9:30 PM",
      label:
        "Wind Down — Phone/laptop/TV off. Light reading, deep breathing, dim lights",
      cat: "winddown",
      key: "_winddown",
      durMins: 150,
    },
    {
      time: "12:00 AM",
      label: "Bedtime (~6 hrs)",
      cat: "sleep",
      key: "sleepGoal",
      durMins: 0,
      trackable: true,
    },
  ],
};

S.postClass = {
  label: "Recovery — Class Night",
  icon: "fa-video",
  color: "teal",
  bgClass: "bg-teal-pale",
  borderClass: "border-teal/20",
  badgeClass: "bg-teal text-white",
  sleepTarget: 6,
  craftMins: 40,
  blocks: [
    ...MW,
    {
      time: "10:00 AM",
      label: "GenAI — Review / Reading",
      cat: "genai",
      key: "genai",
      durMins: 75,
      trackable: true,
    },
    {
      time: "11:15 AM",
      label: "Work Tasks",
      cat: "work",
      key: "_work1",
      durMins: 165,
    },
    {
      time: "2:00 PM",
      label: "Gov Exam — Practice Questions",
      cat: "gov",
      key: "govSecond",
      durMins: 75,
      trackable: true,
    },
    {
      time: "3:15 PM",
      label: "Work Tasks",
      cat: "work",
      key: "_work2",
      durMins: 165,
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
      label: "Dinner + Unwind",
      cat: "routine",
      key: "_dinner",
      durMins: 45,
    },
    {
      time: "8:15 PM",
      label: "Crafting — Birthday Gift",
      cat: "craft",
      key: "crafting",
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
      label: "GenAI Live Class",
      cat: "genai",
      key: "genaiClass",
      durMins: 150,
      trackable: true,
    },
    {
      time: "11:30 PM",
      label:
        "Wind Down — Phone/laptop/TV off. Light reading, deep breathing, dim lights",
      cat: "winddown",
      key: "_winddown",
      durMins: 15,
    },
    {
      time: "11:45 PM",
      label: "Bedtime (~6 hrs — class night)",
      cat: "sleep",
      key: "sleepGoal",
      durMins: 0,
      trackable: true,
    },
  ],
};

S.postNormal = {
  label: "Recovery — Normal Night",
  icon: "fa-moon",
  color: "teal",
  bgClass: "bg-teal-pale",
  borderClass: "border-teal/20",
  badgeClass: "bg-teal text-white",
  sleepTarget: 7.5,
  craftMins: 45,
  blocks: [
    ...MW,
    {
      time: "10:00 AM",
      label: "GenAI — Theory / Lessons",
      cat: "genai",
      key: "genai",
      durMins: 75,
      trackable: true,
    },
    {
      time: "11:15 AM",
      label: "Work Tasks",
      cat: "work",
      key: "_work1",
      durMins: 165,
    },
    {
      time: "2:00 PM",
      label: "GenAI — Hands-on Practice",
      cat: "genai",
      key: "genaiOffice2",
      durMins: 75,
      trackable: true,
    },
    {
      time: "3:15 PM",
      label: "Work Tasks",
      cat: "work",
      key: "_work2",
      durMins: 165,
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
      label: "Dinner + Unwind",
      cat: "routine",
      key: "_dinner",
      durMins: 45,
    },
    {
      time: "8:15 PM",
      label: "Short Break — Walk / Relax",
      cat: "break",
      key: "_walk",
      durMins: 15,
    },
    {
      time: "8:30 PM",
      label: "Gov Exam — Revision",
      cat: "gov",
      key: "govSecond",
      durMins: 45,
      trackable: true,
    },
    {
      time: "9:15 PM",
      label: "Short Break",
      cat: "break",
      key: "_break2",
      durMins: 15,
    },
    {
      time: "9:30 PM",
      label: "Crafting — Birthday Gift",
      cat: "craft",
      key: "crafting",
      durMins: 45,
      trackable: true,
    },
    {
      time: "10:15 PM",
      label:
        "Wind Down — Phone/laptop/TV off. Light reading, deep breathing, dim lights",
      cat: "winddown",
      key: "_winddown",
      durMins: 15,
    },
    {
      time: "10:30 PM",
      label: "Bedtime (~7.5 hrs)",
      cat: "sleep",
      key: "sleepGoal",
      durMins: 0,
      trackable: true,
    },
  ],
};

S.postWeekend = {
  label: "Recovery — Weekend",
  icon: "fa-sun",
  color: "gold",
  bgClass: "bg-gold-pale",
  borderClass: "border-gold/20",
  badgeClass: "bg-gold text-white",
  sleepTarget: 8,
  craftMins: 150,
  blocks: [
    ...ME,
    {
      time: "9:30 AM",
      label: "GenAI — Project Work",
      cat: "genai",
      key: "genai",
      durMins: 60,
      trackable: true,
    },
    {
      time: "10:30 AM",
      label: "Crafting — Main Build Block",
      cat: "craft",
      key: "crafting",
      durMins: 150,
      trackable: true,
    },
    {
      time: "1:00 PM",
      label: "Free Time / Rest / Errands",
      cat: "routine",
      key: "_free",
      durMins: 450,
    },
    {
      time: "8:30 PM",
      label: "Optional: Extra Craft Session",
      cat: "craft",
      key: "craftExtra",
      durMins: 90,
      trackable: true,
    },
    {
      time: "10:00 PM",
      label:
        "Wind Down — Phone/laptop/TV off. Light reading, deep breathing, dim lights",
      cat: "winddown",
      key: "_winddown",
      durMins: 30,
    },
    {
      time: "10:30 PM",
      label: "Bedtime (~8 hrs)",
      cat: "sleep",
      key: "sleepGoal",
      durMins: 0,
      trackable: true,
    },
  ],
};

// ── Main schedule lookup ────────────────────────────────────

export function getSchedule(dateStr, birthdayDate) {
  const d = parseDate(dateStr),
    dt = getDayType(d),
    pre = isBeforeBirthday(dateStr, birthdayDate);
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

// ── Build the full task list for a day ──────────────────────
// Handles: custom tasks, reordering, pinned times, auto-recalculation

export function getDayTasks(dateStr, birthdayDate, dayData) {
  const sched = getSchedule(dateStr, birthdayDate);
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
    return {
      key,
      label: cus?.label || def?.label || key,
      cat: cus?.cat || def?.cat || "routine",
      durMins: durMap[key] || 0,
      time: times[key] || def?.time || "",
      pinned: !!ep[key],
      trackable: def?.trackable || false,
      isCustom: !!cus,
      defaultTime: def?.time || "",
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

export function daysUntilBirthday(bd) {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  const b = parseDate(bd);
  b.setHours(0, 0, 0, 0);
  return Math.ceil((b - t) / 864e5);
}

// ── Habit summary for calendar dots ─────────────────────────

export function getHabitSummary(dateStr, birthdayDate, dayData) {
  const h = dayData?.habits || {};
  const tasks = getDayTasks(dateStr, birthdayDate, dayData);
  const trackable = tasks.filter((t) => t.trackable);
  return {
    pooja: !!h.pooja,
    gov: !!h.govMorning,
    genai: !!h.genai || !!h.genaiClass || !!h.genaiOffice2,
    craft: !!h.crafting,
    sleep: !!h.sleepGoal,
    total: trackable.length,
    done: trackable.filter((t) => h[t.key]).length,
    allDone: trackable.length > 0 && trackable.every((t) => h[t.key]),
  };
}

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
