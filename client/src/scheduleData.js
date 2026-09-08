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

// ── 🌅 4:30 AM Morning Session Protocol & Cardio Routine ───────

export const MORNING_SESSION_PROTOCOL = [
  {
    id: "wake_hydrate",
    time: "4:30 AM – 4:45 AM",
    timeStart: "4:30 AM",
    timeEnd: "4:45 AM",
    durMins: 15,
    title: "Wake Up & Hydrate",
    activity: "Wash face, light mobility stretches.",
    drink: "1 glass of lukewarm water.",
    drinkDetails: "Lukewarm water restores cellular hydration after sleep, stimulates digestive peristalsis, and flushes metabolic waste without shocking the system.",
    emojis: "🌅 💧 🧼 🧘‍♂️",
    badge: "Awakening & Hydration",
    theme: "amber",
    key: "morningWake",
    trackable: true,
    actionSteps: [
      "Wake up immediately at 4:30 AM without hitting snooze.",
      "Wash face with cool water to signal wakefulness to ocular nerves.",
      "Perform 3 minutes of gentle mobility: neck circles, cat-cow, and calf stretches.",
      "Drink 1 full glass of lukewarm water slowly while sitting upright."
    ],
  },
  {
    id: "study_session_1",
    time: "4:45 AM – 6:30 AM",
    timeStart: "4:45 AM",
    timeEnd: "6:30 AM",
    durMins: 105,
    durLabel: "1 hr 45 mins",
    title: "Study Session 1: Peak Brain Focus Window",
    activity: "Your peak brain focus window. Uninterrupted deep study on toughest subjects.",
    drink: "Black Coffee at 4:45 AM, followed by gradual sips of water.",
    drinkDetails: "Caffeine blocks adenosine fatigue receptors, spiking dopamine and norepinephrine right as cortisol peaks. Keep water nearby for steady micro-hydration.",
    emojis: "🧠 ☕ 📚 ⚡",
    badge: "Peak Cognitive Window",
    theme: "indigo",
    key: "morningStudy1",
    trackable: true,
    actionSteps: [
      "Brew hot black coffee at 4:45 AM (zero sugar, zero dairy).",
      "Put phone in another room or on 'Do Not Disturb'.",
      "Tackle your most demanding concept: Striver DSA complex algorithms or Gov Exam Quantitative Aptitude.",
      "Work in deep flow for 105 uninterrupted minutes."
    ],
  },
  {
    id: "cardio_workout",
    time: "6:30 AM – 7:00 AM",
    timeStart: "6:30 AM",
    timeEnd: "7:00 AM",
    durMins: 30,
    durLabel: "30 mins",
    title: "Cardio & Core Workout: Belly & Chest Toning",
    activity: "Fast-paced movement to burn fat. High-Low Intensity Cardio Circuit.",
    drink: "No large drinks (small sips of water only if needed).",
    drinkDetails: "Avoid chugging water before cardio to prevent stomach cramping, reflux, or sluggishness. Only wet your mouth with small sips if thirsty.",
    emojis: "🏃‍♂️ 🔥 🥊 🥋 🧱",
    badge: "Fat-Burning & Toning",
    theme: "terra",
    key: "morningCardio",
    trackable: true,
    actionSteps: [
      "Put on proper training shoes and open a window for cool morning air.",
      "Execute the 30-minute High-Low Cardio Routine (Warm-up, Power Walking, Circuit, Plank Finisher, Cool Down).",
      "Focus on chest squeeze and belly contraction on every movement."
    ],
  },
  {
    id: "study_session_2",
    time: "7:00 AM – 7:40 AM",
    timeStart: "7:00 AM",
    timeEnd: "7:40 AM",
    durMins: 40,
    durLabel: "40 mins",
    title: "Study Session 2: Practice Problems & Review",
    activity: "Reviewing or solving practice problems. Post-workout neuroplasticity window.",
    drink: "Coconut water or electrolyte water to recover.",
    drinkDetails: "Restores essential potassium, sodium, and magnesium depleted during sweat. Hydrates brain cells for rapid mental calculation and error correction.",
    emojis: "📝 🥥 🎯 ⚡",
    badge: "Neuroplasticity Sprint",
    theme: "teal",
    key: "morningStudy2",
    trackable: true,
    actionSteps: [
      "Drink a chilled glass of fresh coconut water or electrolyte water.",
      "Capitalize on post-cardio BDNF (Brain-Derived Neurotrophic Factor).",
      "Review mistakes from Session 1, solve 10-15 rapid speed questions, or test flashcards.",
      "Anchor learned concepts while memory consolidation is accelerated."
    ],
  },
  {
    id: "bath_recovery",
    time: "7:40 AM onwards",
    timeStart: "7:40 AM",
    timeEnd: "8:00 AM",
    durMins: 20,
    title: "Bath / Shower & Recovery",
    activity: "Helps lower your core temperature and relax muscles.",
    drink: "Normal hydration.",
    drinkDetails: "Sip room-temperature water steadily. Promotes metabolic equilibrium and cellular nutrient transportation.",
    emojis: "🚿 🧊 👕 🧼",
    badge: "Temperature Reset & Grooming",
    theme: "mint",
    key: "morningBath",
    trackable: true,
    actionSteps: [
      "Take a refreshing warm shower to wash off sweat and soothe muscle fibers.",
      "Finish with 30-60 seconds of cold water to trigger norepinephrine and long-lasting alertness.",
      "Dress in clean, structured attire to prime professional discipline for the day."
    ],
  },
];

// ── 📅 The Complete 24-Hour Master Schedule (6 Hours Sleep) ────
// Designed with zero MERN topics (dedicated SSC CGL & General Prep)
export const COMPLETE_24H_MASTER_SCHEDULE = [
  // ── MORNING PHASE: Peak Logic & Cardio ──
  {
    id: "m24_wake_hydrate",
    phase: "morning",
    phaseTitle: "Morning Phase: Peak Logic & Cardio",
    time: "4:30 AM – 4:45 AM",
    timeStart: "4:30 AM",
    timeEnd: "4:45 AM",
    durMins: 15,
    durLabel: "15 mins",
    title: "Wake Up & Hydrate",
    activity: "Wake up + 1 glass lukewarm water + quick joint mobility stretches.",
    focus: "Cellular rehydration & awakening ocular/joint nervous system.",
    drink: "1 glass of lukewarm water.",
    drinkDetails: "Lukewarm water restores hydration, stimulates digestive peristalsis, and flushes metabolic waste.",
    emojis: "🌅 💧 🧼 🧘‍♂️",
    badge: "Awakening & Hydration",
    theme: "amber",
    cat: "routine",
    key: "morningWake",
    trackable: true,
    actionSteps: [
      "Wake up immediately at 4:30 AM without hitting snooze.",
      "Wash face with cool water to signal wakefulness to ocular nerves.",
      "Perform quick joint mobility stretches (neck circles, shoulders, ankles, spine).",
      "Drink 1 glass of lukewarm water sitting upright."
    ],
  },
  {
    id: "m24_study_session_1",
    phase: "morning",
    phaseTitle: "Morning Phase: Peak Logic & Cardio",
    time: "4:45 AM – 6:30 AM",
    timeStart: "4:45 AM",
    timeEnd: "6:30 AM",
    durMins: 105,
    durLabel: "1 hr 45 mins",
    title: "Study Session 1: SSC CGL (Peak Logic)",
    activity: "Uninterrupted deep focus on hardest logical topics: Quant / Reasoning.",
    focus: "Quant / Reasoning. Grab your Black Coffee at 4:45 AM to maximize your logical brain capacity.",
    drink: "Black Coffee at 4:45 AM, followed by steady water sips.",
    drinkDetails: "Black coffee (zero sugar/dairy) blocks adenosine receptors right at cortisol peak for elite computational reasoning.",
    emojis: "🧠 ☕ 📐 ⚡",
    badge: "SSC CGL Prime Window",
    theme: "indigo",
    cat: "gov",
    key: "morningStudy1",
    trackable: true,
    actionSteps: [
      "Brew hot black coffee at 4:45 AM.",
      "Zero phone / zero distractions.",
      "Tackle challenging SSC CGL Quantitative Aptitude & Reasoning questions.",
      "Deep continuous work for 105 minutes."
    ],
  },
  {
    id: "m24_cardio_workout",
    phase: "morning",
    phaseTitle: "Morning Phase: Peak Logic & Cardio",
    time: "6:30 AM – 7:00 AM",
    timeStart: "6:30 AM",
    timeEnd: "7:00 AM",
    durMins: 30,
    durLabel: "30 mins",
    title: "Cardio Workout: Fat Burn & Core Toning",
    activity: "Power walking, jumping jacks, shadow boxing, 2-minute plank, and 3 post-workout stretches.",
    focus: "Power walking, jumping jacks, shadow boxing, and your perfect-form 2-minute Plank (or split into sets). Finish with the 3 post-workout stretches (Standing Chest Opener, Sphinx, Cat-Cow).",
    drink: "Small sips of water only if thirsty (no large drinks before/during).",
    drinkDetails: "Prevent stomach cramping and reflux by avoiding chugging water. Small sips only.",
    emojis: "🏃‍♂️ 🔥 🥊 🧱",
    badge: "Fat Burn & Core Toning",
    theme: "terra",
    cat: "exercise",
    key: "morningCardio",
    trackable: true,
    actionSteps: [
      "5m Warm-up walk + 10m fast-paced power walk (chest squeeze on swing).",
      "10m High-Low circuit: Jumping Jacks, High Knees, Shadow Boxing, Standing Side Crunches.",
      "2-minute Plank Finisher (or 3x40s sets with tight core).",
      "Finish with 3 post-workout stretches: Standing Chest Opener, Sphinx, Cat-Cow."
    ],
  },
  {
    id: "m24_study_session_2",
    phase: "morning",
    phaseTitle: "Morning Phase: Peak Logic & Cardio",
    time: "7:00 AM – 7:40 AM",
    timeStart: "7:00 AM",
    timeEnd: "7:40 AM",
    durMins: 40,
    durLabel: "40 mins",
    title: "Study Session 2: Practice & Speed Drill",
    activity: "Practice questions & speed review utilizing the post-cardio BDNF neuroplasticity window.",
    focus: "Practice speed drills, formula consolidation, and error review from Session 1. Capitalize on post-cardio neuroplasticity.",
    drink: "Homemade Electrolyte Drink (Lemon + Pinch of Salt + Water).",
    drinkDetails: "Homemade electrolyte drink replenishes sodium and potassium lost in sweat and sharpens cellular brain conduction.",
    emojis: "📝 🍋 🧂 🎯",
    badge: "Neuroplasticity Sprint",
    theme: "teal",
    cat: "gov",
    key: "morningStudy2",
    trackable: true,
    actionSteps: [
      "Drink your freshly made Lemon + Pinch of Salt + Water electrolyte drink.",
      "Solve 10-15 rapid speed practice questions or review mistakes.",
      "Solidify memory while brain-derived neurotrophic factor is at peak."
    ],
  },
  {
    id: "m24_shower_ready",
    phase: "morning",
    phaseTitle: "Morning Phase: Peak Logic & Cardio",
    time: "7:40 AM – 8:15 AM",
    timeStart: "7:40 AM",
    timeEnd: "8:15 AM",
    durMins: 35,
    durLabel: "35 mins",
    title: "Shower & Get Dressed for Office",
    activity: "Take a cool/lukewarm shower and get dressed for the office.",
    focus: "Thermal reset, muscle recovery, professional grooming.",
    drink: "Normal steady room-temperature hydration.",
    drinkDetails: "Keep water balance steady after hot shower.",
    emojis: "🚿 🧼 👔 🪞",
    badge: "Grooming & Reset",
    theme: "mint",
    cat: "routine",
    key: "_bath",
    trackable: false,
    actionSteps: [
      "Take a cool/lukewarm shower to soothe muscles and cleanse sweat.",
      "Finish with a 30s cold water rinse for long-lasting alertness.",
      "Get fully dressed and organized for the workday."
    ],
  },
  {
    id: "m24_breakfast",
    phase: "morning",
    phaseTitle: "Morning Phase: Peak Logic & Cardio",
    time: "8:15 AM – 8:30 AM",
    timeStart: "8:15 AM",
    timeEnd: "8:30 AM",
    durMins: 15,
    durLabel: "15 mins",
    title: "High-Protein Vegetarian Breakfast",
    activity: "High-protein vegetarian option for steady energy without blood sugar crashes.",
    focus: "High-protein fuel: Thick curd + 1 Apple + handful of nuts, or 2 Besan Chillas.",
    dietAction: "Eat mindfully without phone screens to optimize nutrient absorption.",
    emojis: "🥣 🍎 🥜 🥞",
    badge: "Clean Nutrition",
    theme: "amber",
    cat: "routine",
    key: "_breakfast",
    trackable: false,
    actionSteps: [
      "Option A: Thick curd bowl + 1 sliced apple + handful of almonds/walnuts.",
      "Option B: 2 freshly prepared besan chillas with mint chutney.",
      "Chew slowly and avoid sugary juices or heavy carbs."
    ],
  },
  // ── AFTERNOON PHASE: Office & Professional Execution ──
  {
    id: "m24_commute_office",
    phase: "afternoon",
    phaseTitle: "Afternoon Phase: Office & Focused Execution",
    time: "8:30 AM – 9:30 AM",
    timeStart: "8:30 AM",
    timeEnd: "9:30 AM",
    durMins: 60,
    durLabel: "1 hour",
    title: "Commute to Office: Educational Audio",
    activity: "Commute transit with productive audio revision or educational podcasts.",
    focus: "Listen to educational/informative podcasts, audio GK revision, or mentally prepare priorities for the workday.",
    emojis: "🚌 🎧 📱 🏙️",
    badge: "Mindful Transit",
    theme: "bark",
    cat: "routine",
    key: "_commute",
    trackable: false,
    actionSteps: [
      "Put on earphones during travel.",
      "Listen to educational/GK audio lectures, current affairs summaries, or career podcasts.",
      "Arrive at office with clear mental clarity."
    ],
  },
  {
    id: "m24_office_block_1",
    phase: "afternoon",
    phaseTitle: "Afternoon Phase: Office & Focused Execution",
    time: "9:30 AM – 1:00 PM",
    timeStart: "9:30 AM",
    timeEnd: "1:00 PM",
    durMins: 210,
    durLabel: "3 hrs 30 mins",
    title: "Office Work Block 1: Deep Work",
    activity: "High-priority work deliverables, complex tasks, and core execution.",
    focus: "Tackle top 2 most impactful professional tasks during peak daylight alertness.",
    emojis: "💼 💻 🎯 📊",
    badge: "Office Core Sprint",
    theme: "bark",
    cat: "work",
    key: "_work1",
    trackable: false,
    actionSteps: [
      "Review sprint priorities and clear urgent communications.",
      "Protect deep uninterrupted execution blocks.",
      "Stay hydrated with water at your desk."
    ],
  },
  {
    id: "m24_lunch_break",
    phase: "afternoon",
    phaseTitle: "Afternoon Phase: Office & Focused Execution",
    time: "1:00 PM – 2:00 PM",
    timeStart: "1:00 PM",
    timeEnd: "2:00 PM",
    durMins: 60,
    durLabel: "1 hour",
    title: "Lunch & Mental Recharge Break",
    activity: "Wholesome lunch, stepping away from desk, light stroll & digestive reset.",
    focus: "Nutritious balanced vegetarian lunch. Screen-free recharge to prevent afternoon brain fatigue.",
    emojis: "🥗 🍲 🚶‍♂️ 🌿",
    badge: "Digestive Reset",
    theme: "mint",
    cat: "routine",
    key: "_lunch",
    trackable: false,
    actionSteps: [
      "Eat wholesome vegetarian lunch at moderate portion to prevent food coma.",
      "Take a 10-15 minute casual walking stroll in fresh air.",
      "Rest eyes from digital monitors."
    ],
  },
  {
    id: "m24_office_block_2",
    phase: "afternoon",
    phaseTitle: "Afternoon Phase: Office & Focused Execution",
    time: "2:00 PM – 6:30 PM",
    timeStart: "2:00 PM",
    timeEnd: "6:30 PM",
    durMins: 270,
    durLabel: "4 hrs 30 mins",
    title: "Office Work Block 2: Execution & Wrap-Up",
    activity: "Collaborative tasks, secondary tickets, reviews, and clean daily wrap-up.",
    focus: "Complete meetings, execute daily commitments, and close all pending office tasks cleanly.",
    emojis: "💼 📋 🤝 🚀",
    badge: "Office Execution & Wrap",
    theme: "bark",
    cat: "work",
    key: "_work2",
    trackable: false,
    actionSteps: [
      "Handle team syncs, code reviews, and secondary project tickets.",
      "Take short 2-minute posture stretches every 60 minutes.",
      "Close open tabs and write next-day work notes before 6:30 PM."
    ],
  },
  // ── EVENING PHASE: Study, Prep & Decompression ──
  {
    id: "m24_commute_home",
    phase: "evening",
    phaseTitle: "Evening & Night Phase: Decompression, Study & Recovery",
    time: "6:30 PM – 7:30 PM",
    timeStart: "6:30 PM",
    timeEnd: "7:30 PM",
    durMins: 60,
    durLabel: "1 hour",
    title: "Commute Home / Study Session 3",
    activity: "Commute transition back home paired with active recall flashcards.",
    focus: "General Awareness (GK) or English Vocabulary flashcards during commute.",
    emojis: "🚆 🃏 📖 🧠",
    badge: "GK / English Flashcards",
    theme: "indigo",
    cat: "gov",
    key: "govDrill",
    trackable: true,
    actionSteps: [
      "Review GK facts, historical milestones, or English vocab flashcards on mobile.",
      "Transform commute idle time into low-friction active recall.",
      "Decompress from office mindset and switch to evening preparation mode."
    ],
  },
  {
    id: "m24_dinner_family",
    phase: "evening",
    phaseTitle: "Evening & Night Phase: Decompression, Study & Recovery",
    time: "7:30 PM – 8:00 PM",
    timeStart: "7:30 PM",
    timeEnd: "8:00 PM",
    durMins: 30,
    durLabel: "30 mins",
    title: "Dinner & Family Time",
    activity: "Wholesome vegetarian dinner followed by warm milk and banana.",
    focus: "Eat your vegetarian dinner. End your dinner by consuming your banana and warm milk.",
    dietAction: "End dinner by consuming banana and warm milk. This ensures smooth digestion well before you lie down.",
    emojis: "🍽️ 🥛 🍌 👨‍👩‍👦",
    badge: "Nutrition & Digestion",
    theme: "amber",
    cat: "routine",
    key: "_dinner",
    trackable: false,
    actionSteps: [
      "Eat light, healthy vegetarian dinner with family.",
      "Consume 1 banana and a cup of warm milk right after dinner.",
      "Allows tryptophan/melatonin precursors to digest 2.5 hours before sleeping."
    ],
  },
  {
    id: "m24_study_session_4",
    phase: "evening",
    phaseTitle: "Evening & Night Phase: Decompression, Study & Recovery",
    time: "8:00 PM – 9:15 PM",
    timeStart: "8:00 PM",
    timeEnd: "9:15 PM",
    durMins: 75,
    durLabel: "1 hr 15 mins",
    title: "Study Session 4: SSC CGL Deep Dive",
    activity: "Dedicated deep-dive study block: Mock tests, problem sets, and sectional mastery.",
    focus: "Full sectional mock test or deep problem-solving in Quantitative Aptitude / Reasoning / General Studies.",
    emojis: "📚 ⏱️ 🎯 ✍️",
    badge: "SSC CGL Intensive Block",
    theme: "indigo",
    cat: "gov",
    key: "govNight",
    trackable: true,
    actionSteps: [
      "Clear desk and sit down right at 8:00 PM sharp.",
      "Solve a full timed sectional test or 30-40 targeted questions.",
      "Maintain high speed and exam-condition discipline."
    ],
  },
  {
    id: "m24_next_day_prep",
    phase: "evening",
    phaseTitle: "Evening & Night Phase: Decompression, Study & Recovery",
    time: "9:15 PM – 9:30 PM",
    timeStart: "9:15 PM",
    timeEnd: "9:30 PM",
    durMins: 15,
    durLabel: "15 mins",
    title: "Next-Day Preparation",
    activity: "Pack office bag, select clothes, and clean study desk so tomorrow morning is frictionless.",
    focus: "Zero-friction morning setup: Pack bag, iron/select clothes, tidy study desk.",
    emojis: "🎒 👔 🧹 ✨",
    badge: "Frictionless Setup",
    theme: "mint",
    cat: "routine",
    key: "_nextDayPrep",
    trackable: true,
    actionSteps: [
      "Pack your office bag with necessary laptop, documents, and chargers.",
      "Select and lay out tomorrow's office clothes and workout gear.",
      "Completely clean and wipe your study desk so it is ready for 4:30 AM."
    ],
  },
  {
    id: "m24_final_review",
    phase: "evening",
    phaseTitle: "Evening & Night Phase: Decompression, Study & Recovery",
    time: "9:30 PM – 10:30 PM",
    timeStart: "9:30 PM",
    timeEnd: "10:30 PM",
    durMins: 60,
    durLabel: "1 hour",
    title: "Final Study Review: Formulas & Error Log",
    activity: "Reviewing formulas and mistakes — strictly no new topics.",
    focus: "No new topics. Quickly revise your morning CGL formulas, mistake diary/error notebook, and today's takeaways.",
    emojis: "📓 🔍 💡 🌙",
    badge: "Formula & Error Consolidation",
    theme: "teal",
    cat: "gov",
    key: "govRevision",
    trackable: true,
    actionSteps: [
      "No new topics to avoid cognitive overload before sleep.",
      "Quickly revise formulas from morning Session 1.",
      "Review the error log of wrong questions solved during Session 4.",
      "Turn off screens by 10:20 PM to let eyes adjust."
    ],
  },
  // ── SLEEP PHASE: 6 Hours Deep Rest ──
  {
    id: "m24_sleep_recovery",
    phase: "sleep",
    phaseTitle: "Restoration Phase: 6 Hours Restorative Sleep",
    time: "10:30 PM – 4:30 AM",
    timeStart: "10:30 PM",
    timeEnd: "4:30 AM",
    durMins: 360,
    durLabel: "6 hours",
    title: "Bedtime & Deep Sleep (6 Hours Target)",
    activity: "Complete restorative circadian sleep. Pitch dark room, zero screens, waking at 4:30 AM.",
    focus: "6 Hours of uninterrupted, high-quality sleep for memory consolidation and physical recovery.",
    emojis: "😴 🛌 🌙 💤",
    badge: "6 Hours Restorative Sleep",
    theme: "purple",
    cat: "sleep",
    key: "sleepGoal",
    trackable: true,
    actionSteps: [
      "Be in bed with lights off at 10:30 PM sharp.",
      "Practice 4-7-8 breathing or body scan relaxation as you drift off.",
      "Keep bedroom cool and pitch black.",
      "Wake up fresh and energized at 4:30 AM."
    ],
  },
];

export const CARDIO_ROUTINE_DATA = {
  title: "Your 30-Minute Belly & Chest Toning Cardio Routine",
  overview:
    "Since you love walking and normal cardio, we will use a High-Low Intensity Structure. This keeps your heart rate in the fat-burning zone without exhausting you.",
  time: "6:30 AM – 7:00 AM",
  totalMins: 30,
  phases: [
    {
      id: "warmup_walk",
      name: "Warm-up Walk",
      timeRange: "0:00 – 0:05",
      durMins: 5,
      durSecs: 300,
      emoji: "🚶‍♂️",
      icon: "fa-person-walking",
      badge: "Low Intensity • Joint Prep",
      intensity: "Low (RPE 3-4)",
      target: "Joints, Knees, Ankles, Blood Flow",
      description: "Walk at a normal, comfortable pace to get blood flowing to your joints.",
      exerciseActions: [
        {
          title: "Comfortable Pace",
          cue: "Walk at a steady, easy pace. Let your breathing remain completely relaxed and natural.",
          emoji: "🚶‍♂️",
        },
        {
          title: "Shoulder & Upper Back Roll",
          cue: "Roll your shoulders back in wide circles 10 times to release chest stiffness.",
          emoji: "🔄",
        },
        {
          title: "Gentle Joint Mobilization",
          cue: "Loosen your wrists, roll your ankles, and let blood flow down to your calves.",
          emoji: "🦶",
        },
      ],
      formChecklist: [
        "Normal comfortable walking cadence",
        "Deep nasal breathing to saturate bloodstream with oxygen",
        "Shoulders relaxed away from ears",
      ],
    },
    {
      id: "power_walking",
      name: "Power Walking (Chest & Shoulder Pump)",
      timeRange: "0:05 – 0:15",
      durMins: 10,
      durSecs: 600,
      emoji: "🏃‍♂️💨",
      icon: "fa-person-walking-arrow-right",
      badge: "Aerobic Fat Burn • Chest Activation",
      intensity: "Moderate-High (RPE 6-7)",
      target: "Chest (Pectorals), Anterior Shoulders, Upper Back & Core",
      description:
        "Walk as fast as you can. Pump your arms vigorously forward and backward—this actively engages your chest and shoulder muscles.",
      exerciseActions: [
        {
          title: "Branded 90° Arm Drive",
          cue: "Lock elbows strictly at 90 degrees. Pump your hands from hip pocket up to chest level with power.",
          emoji: "💪",
        },
        {
          title: "Chest Squeeze on Swing",
          cue: "Actively contract your pectoral muscles as your arm drives forward across your mid-chest.",
          emoji: "🫁",
        },
        {
          title: "Fast-Paced Foot Cadence",
          cue: "Short, quick strides landing on the balls of your feet. Walk as fast as possible without jogging.",
          emoji: "⚡",
        },
      ],
      formChecklist: [
        "Elbows bent at 90° and driving forcefully",
        "Torso upright with chest lifted high",
        "Glutes and lower belly gently tucked in",
      ],
    },
    {
      id: "cardio_circuit",
      name: "Fat-Burning Cardio Circuit (2 Rounds)",
      timeRange: "0:15 – 0:25",
      durMins: 10,
      durSecs: 600,
      emoji: "🔥🥊",
      icon: "fa-fire",
      badge: "High-Low Intervals • Belly & Chest Sculpting",
      intensity: "High Intensity (45s Work / 15s Rest)",
      target: "Lower Belly Fat, Obliques, Chest & Full Body Fat Burn",
      description:
        "Do each movement for 45 seconds, then rest for 15 seconds. Repeat the circuit twice (2 full rounds = 8 intervals).",
      circuitStructure: "4 Exercises × 45s Work / 15s Rest × 2 Rounds",
      exercises: [
        {
          id: "jumping_jacks",
          name: "Jumping Jacks",
          emoji: "🤸‍♂️",
          workSecs: 45,
          restSecs: 15,
          targetZone: "Overall Body Fat & Chest Expansion",
          benefit: "Excellent for burning overall body fat and opening up the chest.",
          actionCue:
            "Jump feet wide while clapping arms overhead with a deliberate chest expansion. Land softly on balls of feet.",
          coachingPoints: [
            "Land with soft, unlocked knees to protect joints.",
            "Open your arms wide like a flying bird to dynamically stretch pectorals.",
            "Keep core engaged so your lower back does not arch.",
          ],
        },
        {
          id: "high_knees",
          name: "High Knees",
          emoji: "🦵⚡",
          workSecs: 45,
          restSecs: 15,
          targetZone: "Lower Belly Fat & Deep Core",
          benefit: "Targets lower belly fat by forcing your core to stabilize on every single stride.",
          actionCue:
            "Drive your knees up towards hip height, alternating rapidly. Pump your arms in opposition.",
          coachingPoints: [
            "Brace your abdominal wall as if bracing for a sneeze.",
            "Do not lean backwards—keep your torso slightly forward.",
            "Stay light on the balls of your feet like a boxer.",
          ],
        },
        {
          id: "shadow_boxing",
          name: "Shadow Boxing",
          emoji: "🥊🔥",
          workSecs: 45,
          restSecs: 15,
          targetZone: "Belly Fat Twists & Chest Toning",
          benefit: "Throw fast punches into the air. Twisting your torso burns belly fat, while punching tones the chest.",
          actionCue:
            "Athletic stance. Throw fast 1-2 straight punches (Jab + Cross). Twist your hips and torso aggressively on every punch.",
          coachingPoints: [
            "Full torso rotation—the power and belly burn come from the hip twist!",
            "Snap punches back quickly to chin level to maintain chest tension.",
            "Breathe out sharply with each punch ('tss!') for deep core engagement.",
          ],
        },
        {
          id: "standing_side_crunches",
          name: "Standing Side Crunches",
          emoji: "🥋💥",
          workSecs: 45,
          restSecs: 15,
          targetZone: "Side Abdominals & Love Handles",
          benefit: "Bring your elbow down to meet your rising knee to target your side abdominal muscles (love handles).",
          actionCue:
            "Fingertips behind head, elbows wide. Bring your elbow down sideways to meet your rising knee, crunching the oblique.",
          coachingPoints: [
            "Drive knee out to the side, NOT straight forward.",
            "Squeeze and hold for 0.5s at the peak contraction.",
            "Alternate sides or switch at 22 seconds for maximum oblique burn.",
          ],
        },
      ],
    },
    {
      id: "plank_finisher",
      name: "The Plank Finisher",
      timeRange: "0:25 – 0:28",
      durMins: 3,
      durSecs: 180,
      emoji: "🧘‍♂️🧱",
      icon: "fa-shield-halved",
      badge: "Isometric Core Tension",
      intensity: "High Core Hold (45s Hold / 15s Rest × 3)",
      target: "Transversus Abdominis, Deep Belly Flattening & Core Stability",
      description: "Move to the floor for your core work. Locks in rock-solid abdominal tension.",
      exerciseActions: [
        {
          title: "Forearm Plank Stance",
          cue: "Place forearms parallel on the floor, elbows stacked directly under your shoulders.",
          emoji: "🧱",
        },
        {
          title: "Glute & Core Vacuum",
          cue: "Squeeze glutes tightly and pull your belly button towards your spine to create a rigid plank.",
          emoji: "🛡️",
        },
        {
          title: "Neutral Spine Alignment",
          cue: "Look at the floor 6 inches ahead of your hands. Do NOT let your hips sag or hike up high.",
          emoji: "📐",
        },
      ],
      formChecklist: [
        "Straight line from crown of head to heels",
        "Glutes clamped tight to protect lower back",
        "Steady nasal breathing without holding breath",
      ],
    },
    {
      id: "cooldown",
      name: "Cool Down & Heart Rate Reset",
      timeRange: "0:28 – 0:30",
      durMins: 2,
      durSecs: 120,
      emoji: "🌬️🧘",
      icon: "fa-wind",
      badge: "Parasympathetic Recovery",
      intensity: "Very Low (RPE 1-2)",
      target: "Heart Rate Reduction, Autonomic Calm, Chest Opener",
      description: "Slow walking and deep breathing to bring your heart rate down before studying.",
      exerciseActions: [
        {
          title: "Casual Slow Stroll",
          cue: "Walk very slowly around the room, shaking out your hands, arms, and calves.",
          emoji: "🚶",
        },
        {
          title: "Box & 4-7-8 Breathing",
          cue: "Inhale 4s through nose, hold 2s, exhale slowly 6s through lips. Drops heart rate fast.",
          emoji: "🌬️",
        },
        {
          title: "Chest Opener Stretch",
          cue: "Clasp hands behind your lower back, gently squeeze shoulder blades and lift hands to stretch chest.",
          emoji: "🧘",
        },
      ],
      formChecklist: [
        "Heart rate returning towards resting baseline",
        "Chest muscles elongated and relaxed",
        "Calm, grounded mental state ready for Study Session 2",
      ],
    },
  ],
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

// ── Top Interviewer & Professor Day-of-Week Curriculum (Fresh Restart from Aug 24) ──

export const DAY_TOPICS = {
  0: {
    dayName: "Sunday",
    dsa: "Weekly Timed DSA Practice & Interview Coding Drill",
    dsaDesc: "2 Medium + 1 Hard problem under 45-min timer covering the week's topics (Math, Patterns, Arrays, Strings, Sorting). Focus on Time O(N) & Space complexity.",
    mern: "Weekly Code Review, Mini-Project Build & STAR Defense",
    mernDesc: "Build an interactive JS/React feature, write clean modular ES6+ code, and practice defending architecture & behavioral questions using the STAR technique.",
    badge: "Weekly Timed Sprint & Project Build",
    interviewTips: [
      "Always clarify assumptions and edge cases (empty input, single element, negative numbers) before writing code.",
      "Explain your thought process aloud and write modular, self-documenting code.",
      "State Time Complexity Big-O and Auxiliary Space complexity explicitly before submitting.",
    ],
  },
  1: {
    dayName: "Monday",
    dsa: "Striver Step 1: Logic Building, Patterns & Basic Math",
    dsaDesc: "Language basics, Star & Number Pattern Printing (Pyramids, Diamonds), Basic Math: Count Digits, Reverse Number, Palindrome, GCD/HCF, Armstrong Numbers, Prime Check, and Big-O Time & Space Complexity analysis.",
    mern: "JS Fundamentals: Variables, Data Types & Control Flow",
    mernDesc: "var vs let vs const, Primitive types vs Reference types, Type Coercion (== vs ===), Truthy/Falsy, Loops (for, while, for..of), Conditionals, and Function declarations vs Arrow functions.",
    badge: "JS Basics & DSA Step 1 (Patterns & Math)",
    interviewTips: [
      "Explain the exact difference between == (loose equality with type coercion) and === (strict equality with type check).",
      "Always state Time Complexity Big-O (e.g. O(log10 N) for digit extraction) and Space Complexity before coding.",
      "Arrow functions do not have their own 'this' or 'arguments' — they inherit lexically.",
    ],
  },
  2: {
    dayName: "Tuesday",
    dsa: "Striver Step 1 & 2: Basic Recursion, Hashing & Sorting Techniques",
    dsaDesc: "Recursion fundamentals (Print 1 to N, Factorial, Reverse Array, Palindrome String), Frequency Array & Hashing, Selection Sort, Bubble Sort, Insertion Sort, Merge Sort, and Quick Sort.",
    mern: "Arrays, Objects & Functional Methods",
    mernDesc: "Array manipulation methods (map, filter, reduce, slice, splice, find, some, every), Object Destructuring, Spread / Rest operators (...), Shallow Copy vs Deep Copy (structuredClone).",
    badge: "JS Core & Sorting / Recursion",
    interviewTips: [
      "Merge Sort is O(N log N) time and O(N) space; Quick Sort is O(N log N) average and in-place O(1) auxiliary stack space.",
      "Array.reduce is a powerful aggregator that can implement map, filter, and group-by logic from scratch.",
      "Always check base cases in recursion to prevent Maximum Call Stack Size Exceeded errors.",
    ],
  },
  3: {
    dayName: "Wednesday",
    dsa: "Striver Step 3: Arrays & Two Pointers (Easy to Medium)",
    dsaDesc: "Largest & Second Largest Element, Remove Duplicates from Sorted Array, Left Rotate Array by K places, Linear Search, Union of Arrays, Two Sum, Sort 0s 1s 2s (Dutch National Flag), Kadane's Algorithm (Max Subarray Sum), Majority Element (>N/2).",
    mern: "JS Engine Internals: Execution Context, Hoisting & Closures",
    mernDesc: "Global Execution Context, Memory Creation Phase vs Code Execution Phase, Call Stack, Hoisting differences (var undefined vs let/const Temporal Dead Zone), Lexical Scope, Scope Chain, and Closures (encapsulation & currying).",
    badge: "JS Engine & Arrays Mastery",
    interviewTips: [
      "Closures retain references to their outer lexical environment even after the outer function has executed.",
      "Dutch National Flag algorithm sorts an array of 0s, 1s, 2s in single pass O(N) time and O(1) space with low/mid/high pointers.",
      "Kadane's Algorithm keeps a running maximum subarray sum, resetting the sum to 0 whenever it drops below zero.",
    ],
  },
  4: {
    dayName: "Thursday",
    dsa: "Striver Step 3 & 4: Array Hard & Binary Search Mastery",
    dsaDesc: "3Sum, 4Sum, Longest Consecutive Sequence, Subarray with given XOR, Merge Overlapping Intervals, Binary Search on 1D Arrays (Lower/Upper Bound), and Search Space Answers (Book Allocation, Aggressive Cows, Rotated Sorted Array).",
    mern: "Prototypes, 'this' Binding & Custom Polyfills",
    mernDesc: "Prototypal Inheritance, 'prototype' vs '__proto__', ES6 Classes, 'this' Binding (Implicit, Explicit: call, apply, bind), and writing Custom Polyfills (Array.map, filter, reduce, Function.bind, Promise.all).",
    badge: "Prototypes & Binary Search",
    interviewTips: [
      "Explicit 'this' binding: call/apply invoke the function immediately (apply takes an array of arguments), while bind returns a new function.",
      "Binary search on answers applies when the search space is monotonic: canWePlace(mid) checks feasibility in O(N).",
      "Custom polyfills require understanding Array.prototype and checking for null/undefined this context.",
    ],
  },
  5: {
    dayName: "Friday",
    dsa: "Striver Step 5 & 6: Strings & Linked Lists",
    dsaDesc: "Valid Anagram, Longest Common Prefix, Isomorphic Strings, Singly & Doubly Linked List, Reverse a Linked List, Middle of Linked List, Detect & Find Starting Node of Loop (Floyd's Tortoise and Hare), Delete Nth Node from End, Palindrome Linked List.",
    mern: "Asynchronous JavaScript: Event Loop & Promises",
    mernDesc: "Synchronous vs Asynchronous execution, Callbacks & Callback Hell, Promises lifecycle (Pending, Fulfilled, Rejected), async/await error handling, Event Loop (Call Stack, Microtask Queue / Promises vs Macrotask Queue / setTimeout, setInterval), Debounce & Throttle.",
    badge: "Async JS & Linked Lists",
    interviewTips: [
      "Microtasks (Promise.then callbacks, queueMicrotask) take strict priority over Macrotasks (setTimeout, setInterval, I/O) in every event loop tick.",
      "Floyd's Cycle Detection uses slow (1 step) and fast (2 steps) pointers; when they meet, reset slow to head to find the loop start.",
      "Debouncing delays function execution until after N ms of inactivity, while Throttling enforces a maximum of 1 execution per N ms window.",
    ],
  },
  6: {
    dayName: "Saturday",
    dsa: "Striver Step 9 & 10: Stacks, Queues & Sliding Window",
    dsaDesc: "Valid Parentheses, Implement Min Stack, Next Greater Element (Monotonic Stack), Largest Rectangle in Histogram, Sliding Window & Two Pointers (Max Consecutive Ones III, Longest Substring Without Repeating Characters, Fruit into Baskets).",
    mern: "DOM Architecture, Events & Modern React Essentials",
    mernDesc: "DOM Manipulation, Event Bubbling & Capturing, Event Delegation, Virtual DOM, React Component Lifecycle, useState, useEffect (dependencies & cleanup), Building interactive responsive components.",
    badge: "DOM/React & Stacks/Sliding Window",
    interviewTips: [
      "Event Delegation attaches a single event listener to a common parent, utilizing event bubbling for optimal memory performance.",
      "Monotonic Stacks maintain elements in strictly increasing or decreasing order, solving Next Greater Element in O(N) linear time.",
      "Sliding Window dynamically adjusts left and right pointers to track running frequency/sum in O(N) rather than O(N^2) brute force.",
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
    label: "Wake Up & Hydrate",
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
    label: "Pooja & Morning Meditation",
    cat: "pooja",
    key: "pooja",
    durMins: 15,
    trackable: true,
  },
  {
    time: "7:00 AM",
    label: "Healthy Breakfast & Nutrition",
    cat: "routine",
    key: "_snacks",
    durMins: 20,
  },
  {
    time: "7:20 AM",
    label: "Gov Exam Prime Block — Deep Mock Test & Aptitude Drills",
    cat: "gov",
    key: "govMorning",
    durMins: 55,
    trackable: true,
  },
  {
    time: "8:15 AM",
    label: "Morning Travel / Commute (Audio Revision / Relax)",
    cat: "routine",
    key: "_commute",
    durMins: 75,
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

// ── All 6 schedule variants + 24H Master Schedule ───────────

const S = {};

// 24-HOUR MASTER SCHEDULE (6 Hours Sleep • SSC CGL Focus — Zero MERN)
S.master24h = {
  label: "24-Hour Master Schedule (6h Sleep • SSC CGL Focus)",
  icon: "fa-clock",
  color: "amber",
  bgClass: "bg-amber-50",
  borderClass: "border-amber-200",
  badgeClass: "bg-amber-600 text-white",
  sleepTarget: 6.0,
  mernMins: 0,
  govMins: 280,
  blocks: [
    {
      time: "4:30 AM",
      label: "Wake Up & Hydrate",
      cat: "routine",
      key: "morningWake",
      durMins: 15,
      trackable: true,
    },
    {
      time: "4:45 AM",
      label: "Study Session 1: SSC CGL (Quant / Reasoning)",
      cat: "gov",
      key: "morningStudy1",
      durMins: 105,
      trackable: true,
    },
    {
      time: "6:30 AM",
      label: "Cardio & Core Workout (Belly & Chest Toning)",
      cat: "exercise",
      key: "morningCardio",
      durMins: 30,
      trackable: true,
    },
    {
      time: "7:00 AM",
      label: "Study Session 2: Practice Problems & Speed Review",
      cat: "gov",
      key: "morningStudy2",
      durMins: 40,
      trackable: true,
    },
    {
      time: "7:40 AM",
      label: "Shower & Get Dressed for Office",
      cat: "routine",
      key: "_bath",
      durMins: 35,
    },
    {
      time: "8:15 AM",
      label: "High-Protein Vegetarian Breakfast",
      cat: "routine",
      key: "_breakfast",
      durMins: 15,
    },
    {
      time: "8:30 AM",
      label: "Commute to Office (Educational Podcasts / Audio)",
      cat: "routine",
      key: "_commute",
      durMins: 60,
    },
    {
      time: "9:30 AM",
      label: "Office Work Block 1 (Deep Work)",
      cat: "work",
      key: "_work1",
      durMins: 210,
    },
    {
      time: "1:00 PM",
      label: "Lunch & Mental Recharge Break",
      cat: "routine",
      key: "_lunch",
      durMins: 60,
    },
    {
      time: "2:00 PM",
      label: "Office Work Block 2 (Execution & Wrap-Up)",
      cat: "work",
      key: "_work2",
      durMins: 270,
    },
    {
      time: "6:30 PM",
      label: "Commute Home / Study Session 3 (GK & Vocab Flashcards)",
      cat: "gov",
      key: "govDrill",
      durMins: 60,
      trackable: true,
    },
    {
      time: "7:30 PM",
      label: "Dinner & Family Time (Warm Milk + Banana)",
      cat: "routine",
      key: "_dinner",
      durMins: 30,
    },
    {
      time: "8:00 PM",
      label: "Study Session 4: SSC CGL Sectional Mock & Practice",
      cat: "gov",
      key: "govNight",
      durMins: 75,
      trackable: true,
    },
    {
      time: "9:15 PM",
      label: "Next-Day Preparation (Bag, Clothes, Desk)",
      cat: "routine",
      key: "_nextDayPrep",
      durMins: 15,
      trackable: true,
    },
    {
      time: "9:30 PM",
      label: "Final Study Review: Formulas & Error Log",
      cat: "gov",
      key: "govRevision",
      durMins: 60,
      trackable: true,
    },
    {
      time: "10:30 PM",
      label: "Bedtime Goal (6.0 hrs sleep)",
      cat: "sleep",
      key: "sleepGoal",
      durMins: 360,
      trackable: true,
    },
  ],
};

// SPRINT MODE: Class Night (Mon / Wed) — High Intensity Dual Prep (Govt + MERN)
S.preClass = {
  label: "Sprint Mode — Dual Prep (Govt + MERN Class Night)",
  icon: "fa-video",
  color: "terra",
  bgClass: "bg-terra-pale",
  borderClass: "border-terra/20",
  badgeClass: "bg-terra text-white",
  sleepTarget: 5.5,
  mernMins: 345,
  blocks: [
    ...MW,
    {
      time: "9:30 AM",
      label: "MERN & Striver DSA Deep Sprint — Core Algorithms & Logic Coding",
      cat: "mern",
      key: "mernMorning",
      durMins: 120,
      trackable: true,
    },
    {
      time: "11:30 AM",
      label: "Parallel Company Tasks & Flexible Admin Slot",
      cat: "work",
      key: "_work1",
      durMins: 60,
    },
    {
      time: "12:30 PM",
      label: "MERN Prep — Frontend/Backend Code Building & Architecture",
      cat: "mern",
      key: "mernBackend",
      durMins: 60,
      trackable: true,
    },
    {
      time: "1:30 PM",
      label: "Lunch & Rest Break",
      cat: "routine",
      key: "_lunch",
      durMins: 45,
    },
    {
      time: "2:15 PM",
      label: "Gov Exam Mid-Day Sprint — General Studies, Polity & History Story Lectures",
      cat: "gov",
      key: "govSecond",
      durMins: 75,
      trackable: true,
    },
    {
      time: "3:30 PM",
      label: "Tea & Brain Reset",
      cat: "break",
      key: "_tea2",
      durMins: 15,
    },
    {
      time: "3:45 PM",
      label: "Gov Exam Sectional Practice — Quantitative Aptitude & Verbal Reasoning",
      cat: "gov",
      key: "govDrill",
      durMins: 60,
      trackable: true,
    },
    {
      time: "4:45 PM",
      label: "MERN Practice — Class Pre-Read & Code Sandbox",
      cat: "mern",
      key: "mernProject",
      durMins: 75,
      trackable: true,
    },
    {
      time: "6:00 PM",
      label: "Evening Travel / Commute Home (Audio Podcasts / Decompression)",
      cat: "routine",
      key: "_commuteHome",
      durMins: 60,
    },
    {
      time: "7:00 PM",
      label: "Flexible Parallel Work Sync & Daily Wrap-Up",
      cat: "work",
      key: "_work2",
      durMins: 30,
    },
    {
      time: "7:30 PM",
      label: "Dinner & Family Time",
      cat: "routine",
      key: "_dinner",
      durMins: 45,
    },
    {
      time: "8:15 PM",
      label: "Gov Exam Speed Mock & Question Drill",
      cat: "gov",
      key: "govNight",
      durMins: 40,
      trackable: true,
    },
    {
      time: "8:55 PM",
      label: "Transition to Live Class",
      cat: "routine",
      key: "_transition",
      durMins: 5,
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
      label: "Gov Exam & Tech Day Revision — Daily Current Affairs & Formulas",
      cat: "gov",
      key: "govRevision",
      durMins: 30,
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

// SPRINT MODE: Normal Night (Tue / Thu / Fri) — High Intensity Dual Prep
S.preNormal = {
  label: "Sprint Mode — High Intensity Dual Prep (Govt + MERN)",
  icon: "fa-bolt",
  color: "terra",
  bgClass: "bg-terra-pale",
  borderClass: "border-terra/20",
  badgeClass: "bg-terra text-white",
  sleepTarget: 5.5,
  mernMins: 315,
  blocks: [
    ...MW,
    {
      time: "9:30 AM",
      label: "MERN & Striver DSA Deep Sprint — Core Algorithms & Logic Coding",
      cat: "mern",
      key: "mernMorning",
      durMins: 120,
      trackable: true,
    },
    {
      time: "11:30 AM",
      label: "Parallel Company Tasks & Flexible Admin Slot",
      cat: "work",
      key: "_work1",
      durMins: 60,
    },
    {
      time: "12:30 PM",
      label: "MERN Architecture — React Hooks, Node.js & Full-Stack System",
      cat: "mern",
      key: "mernBackend",
      durMins: 60,
      trackable: true,
    },
    {
      time: "1:30 PM",
      label: "Lunch & Rest Break",
      cat: "routine",
      key: "_lunch",
      durMins: 45,
    },
    {
      time: "2:15 PM",
      label: "Gov Exam Mid-Day Sprint — General Studies, Polity & History Story Lectures",
      cat: "gov",
      key: "govSecond",
      durMins: 75,
      trackable: true,
    },
    {
      time: "3:30 PM",
      label: "Tea & Brain Reset / Quick Analogy Review",
      cat: "break",
      key: "_tea2",
      durMins: 15,
    },
    {
      time: "3:45 PM",
      label: "Gov Exam Sectional Practice — Quantitative Aptitude & Verbal Reasoning",
      cat: "gov",
      key: "govDrill",
      durMins: 60,
      trackable: true,
    },
    {
      time: "4:45 PM",
      label: "MERN Machine Coding & Full-Stack Feature Building",
      cat: "mern",
      key: "mernProject",
      durMins: 75,
      trackable: true,
    },
    {
      time: "6:00 PM",
      label: "Evening Travel / Commute Home (Audio Podcasts / Decompression)",
      cat: "routine",
      key: "_commuteHome",
      durMins: 60,
    },
    {
      time: "7:00 PM",
      label: "Flexible Parallel Work Sync & Daily Wrap-Up",
      cat: "work",
      key: "_work2",
      durMins: 30,
    },
    {
      time: "7:30 PM",
      label: "Dinner & Family Time",
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
      label: "MERN & Striver DSA — 1 Pattern Code Review / Tech Defense",
      cat: "mern",
      key: "mernNight",
      durMins: 60,
      trackable: true,
    },
    {
      time: "10:45 PM",
      label: "Gov Exam Deep Revision — Formulas & Daily Current Affairs",
      cat: "gov",
      key: "govRevision",
      durMins: 45,
      trackable: true,
    },
    {
      time: "11:30 PM",
      label: "Book Reading — Life Wisdom, Discipline & Philosophy",
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

export function getSchedule(dateStr, targetDate, forceMode = null) {
  if (forceMode && S[forceMode]) return S[forceMode];
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
    title: "MERN & DSA Daily Focus — JS Fundamentals / Striver DSA",
    desc: "Targeted daily tech sprint: Follow the day's curriculum (Day 1: JS Fundamentals & Striver Step 1 Logic/Patterns/Math -> Day 2: JS Core Methods & Sorting/Recursion -> Day 3: Execution Context/Closures & Arrays Easy/Medium -> Day 4: Prototypes & Binary Search -> Day 5: Async JS & Strings/LL -> Day 6: DOM/React & Stacks).",
    tips: [
      "Explain output and logic out loud before typing code.",
      "Always verify Big-O Time Complexity and Space Complexity on every algorithm problem.",
      "Write clean code and test edge cases (empty arrays, boundary limits, negative numbers)."
    ],
    outcome: "Deep mastery of the day's targeted JavaScript and DSA topics.",
    checklist: ["Concepts understood & coded", "Time & Space complexity verified"],
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
  _lunch: {
    title: "Lunch & Rest Break",
    desc: "Wholesome, balanced midday meal and digestion pause. Keep portions moderate to avoid heavy post-prandial sluggishness.",
    tips: [
      "Step away from the desk to let your eyes and brain rest.",
      "Stay well hydrated."
    ],
    outcome: "Physical nourishment and mental reboot for afternoon sprints.",
    checklist: ["Balanced meal", "Screen-free rest"],
  },
  _tea2: {
    title: "Tea & Brain Reset",
    desc: "Short 15-minute afternoon reset. Enjoy a hot cup of green tea or masala chai, stretch your legs, and glance at 1-2 analogies in the Anti-Boredom Vault.",
    tips: [
      "Do light shoulder and neck stretches.",
      "Avoid heavy snacks that cause insulin drowsiness."
    ],
    outcome: "Refreshed alertness for the late afternoon session.",
    checklist: ["Tea consumed", "Stretching done"],
  },
  govDrill: {
    title: "Gov Exam Sectional Practice — Quantitative Aptitude & Reasoning",
    desc: "High-intensity speed and accuracy drill: Timed 20-30 question sets in Arithmetic, Algebra, Syllogisms, Puzzles, or Data Interpretation.",
    tips: [
      "Use shortcut calculation tricks (Vedic math, ratio approximations).",
      "Skip questions taking more than 60 seconds on the first pass."
    ],
    outcome: "High speed, mental math sharpening, and improved sectional accuracy.",
    checklist: ["Sectional drill solved", "Accuracy > 85%", "Formulas verified"],
  },
  _work2: {
    title: "Flexible Work Sync & Daily Wrap-Up",
    desc: "Light parallel work wrap-up: Check communications, wrap up daily commitments, and organize pending tasks.",
    tips: [
      "Keep this focused and time-boxed to 30 minutes so it doesn't spill into evening study."
    ],
    outcome: "Clean work wrap-up and zero lingering office anxiety.",
    checklist: ["Comms cleared", "Work done for the day"],
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
  morningWake: {
    title: "Wake Up & Hydrate (4:30 AM)",
    desc: "Rise immediately at 4:30 AM. Wash face, perform light mobility stretches, and drink 1 glass of lukewarm water to rehydrate cells.",
    tips: [
      "Drink water sitting down, not standing, to assist digestive flow.",
      "Gentle neck, spine, and calf stretches to wake up nervous system."
    ],
    outcome: "Immediate physical alertness and digestive activation without shock.",
    checklist: ["Out of bed at 4:30 AM", "Face washed", "1 glass lukewarm water"],
  },
  morningStudy1: {
    title: "Study Session 1: Peak Brain Focus (4:45 AM – 6:30 AM)",
    desc: "1 hr 45 mins uninterrupted prime cognitive window. Clean prefrontal cortex, zero notifications, black coffee at 4:45 AM.",
    tips: [
      "Dedicate this block to your hardest topic (DSA hard patterns or complex Gov Exam reasoning/quant).",
      "Black coffee right at 4:45 AM, followed by gradual water sips."
    ],
    outcome: "Deep mastery of 1 difficult topic during peak neurochemical alertness.",
    checklist: ["Black coffee consumed", "105 mins deep focus", "No phone distractions"],
  },
  morningCardio: {
    title: "Cardio & Core Workout: 30-Min High-Low Routine (6:30 AM)",
    desc: "Fast-paced fat burn: 5m Warm-up Walk, 10m Power Walk, 10m Cardio Circuit (Jumping Jacks, High Knees, Shadow Boxing, Side Crunches), 3m Plank Finisher, 2m Cool Down.",
    tips: [
      "No large drinks right before cardio—small sips of water only.",
      "Vigorous 90-degree arm pump during power walk to tone chest and shoulders.",
      "Torso rotation in shadow boxing and high knees to blast belly fat."
    ],
    outcome: "Elevated calorie burn, sculpted chest & obliques, and endorphin surge.",
    checklist: ["5m Warm-up Walk", "10m Power Walk", "10m Cardio Circuit (2 rounds)", "3m Plank Finisher", "2m Cool Down"],
  },
  morningStudy2: {
    title: "Study Session 2: Practice Problems & Review (7:00 AM – 7:40 AM)",
    desc: "40-minute post-cardio neuroplasticity sprint. Coconut water or electrolyte water to rehydrate brain and muscles.",
    tips: [
      "Sip chilled coconut water or electrolytes to replenish sodium and potassium.",
      "Solve rapid practice problems, review error logs from Session 1, or active recall cards."
    ],
    outcome: "Reinforced conceptual retention during the post-exercise BDNF neuroplasticity window.",
    checklist: ["Coconut / electrolyte water", "Practice problems solved", "Mistakes reviewed"],
  },
  morningBath: {
    title: "Bath / Shower & Recovery (7:40 AM onwards)",
    desc: "Soothing bath/shower to lower core body temperature, relax muscles, wash off sweat, and groom for daily success.",
    tips: [
      "End shower with 30-60s cool splash to lock in dopamine and alertness.",
      "Normal room-temperature hydration."
    ],
    outcome: "Lowered core body temp, clean muscle relaxation, and disciplined grooming.",
    checklist: ["Shower complete", "Cold splash finish", "Groomed & ready"],
  },
  _breakfast: {
    title: "High-Protein Vegetarian Breakfast (8:15 AM – 8:30 AM)",
    desc: "Wholesome morning nutrition: Thick curd + 1 Apple + handful of nuts, or 2 freshly cooked Besan Chillas with mint chutney. Zero sugar spikes.",
    tips: [
      "Eat without screens to ensure conscious digestion.",
      "Stay away from sugary syrups or ultra-processed cereals."
    ],
    outcome: "Sustained physical and mental energy for the morning office block.",
    checklist: ["High protein breakfast", "No sugar spike"],
  },
  _nextDayPrep: {
    title: "Next-Day Preparation (9:15 PM – 9:30 PM)",
    desc: "15-minute evening ritual to guarantee zero friction tomorrow: Pack your office bag (laptop, notebook, charger), select and lay out your clothes, and tidy your study desk clean for 4:30 AM.",
    tips: [
      "Keep tomorrow's notebook and pen placed ready on the clean desk.",
      "Check your clothes and shoes so you don't waste mental energy in the morning."
    ],
    outcome: "Clean workspace and effortless 4:30 AM wake-up routine.",
    checklist: ["Office bag packed", "Clothes selected", "Desk cleaned"],
  },
};

// ── Build the full task list for a day ──────────────────────

export function getDayTasks(dateStr, targetDate, dayData, forceMode = null) {
  const sched = getSchedule(dateStr, targetDate, forceMode);
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
    gov:
      !!h.gov ||
      !!h.govMorning ||
      !!h.govSecond ||
      !!h.govDrill ||
      !!h.govNight ||
      !!h.govRevision,
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
    exercise: !!h.exercise || !!h.morningCardio,
    total: trackable.length,
    done: trackable.filter((t) => h[t.key]).length,
    allDone: trackable.length > 0 && trackable.every((t) => h[t.key]),
  };
}

// ── MERN Interview Prep Roadmap Phases ───────────────────────

export const MERN_PHASES = [
  {
    name: "Phase 1: JS Fundamentals & DSA Step 1-3 Basics",
    desc: "JS Basics, Arrays, Objects, Striver Patterns, Math, Sorting & Easy-Medium Arrays",
    targetHrs: 25,
    icon: "fa-code",
  },
  {
    name: "Phase 2: JS Engine Internals, Polyfills & DSA Step 4-9",
    desc: "Execution Context, Closures, Polyfills, Async JS, Binary Search, Strings & Linked Lists",
    targetHrs: 50,
    icon: "fa-cubes",
  },
  {
    name: "Phase 3: React Architecture, Node.js & DSA Step 10-13",
    desc: "Virtual DOM, Fiber, Custom Hooks, Node.js Libuv, Express, Stacks, Queues, Sliding Window & Trees",
    targetHrs: 75,
    icon: "fa-server",
  },
  {
    name: "Phase 4: MongoDB Scale, System Design & DSA Step 15-16",
    desc: "MongoDB Aggregations, Redis Caching, WebSockets, Graphs, DP & Live Mock Interview Defense",
    targetHrs: 100,
    icon: "fa-trophy",
  },
];

// Backward compatibility alias
export const CRAFT_PHASES = MERN_PHASES;

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
