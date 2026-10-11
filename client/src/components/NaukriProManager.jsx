import { useState, useEffect, useMemo } from "react";

export default function NaukriProManager({ showToast }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Date key for local storage persistence
  const todayDateStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }, []);

  // Checklist state stored in localStorage
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(`naukri_checklist_${todayDateStr}`);
      return saved
        ? JSON.parse(saved)
        : {
            freshnessUpdate: false,
            applyFreshJobs: false,
            reversePitchHR: false,
            verifySkillsNotice: false,
            officeStudySprint: false,
          };
    } catch {
      return {
        freshnessUpdate: false,
        applyFreshJobs: false,
        reversePitchHR: false,
        verifySkillsNotice: false,
        officeStudySprint: false,
      };
    }
  });

  // Daily Metrics Counters
  const [metrics, setMetrics] = useState(() => {
    try {
      const saved = localStorage.getItem(`naukri_metrics_${todayDateStr}`);
      return saved
        ? JSON.parse(saved)
        : {
            jobsApplied: 0,
            profileViews: 0,
            recruiterCalls: 0,
            studyMins: 0,
          };
    } catch {
      return {
        jobsApplied: 0,
        profileViews: 0,
        recruiterCalls: 0,
        studyMins: 0,
      };
    }
  });

  // Active Sub-tab in Manager
  const [activeTab, setActiveTab] = useState("protocol"); // 'protocol' | 'assets' | 'schedule' | 'resdex_hacks'

  // Update clock every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Save checklist changes
  const toggleChecklistItem = (key) => {
    setChecklist((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem(`naukri_checklist_${todayDateStr}`, JSON.stringify(updated));
      return updated;
    });
    if (!checklist[key] && showToast) {
      showToast("🎯 Step checked off for today!", "success");
    }
  };

  // Update metrics
  const updateMetric = (key, delta) => {
    setMetrics((prev) => {
      const updated = { ...prev, [key]: Math.max(0, (prev[key] || 0) + delta) };
      localStorage.setItem(`naukri_metrics_${todayDateStr}`, JSON.stringify(updated));
      return updated;
    });
  };

  // Copy helper
  const handleCopy = (text, key, label) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    if (showToast) showToast(`📋 Copied ${label} to clipboard!`, "success");
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Calculate current golden window status
  const currentWindowStatus = useMemo(() => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMins = hours * 60 + minutes;

    // Morning Window: 09:45 AM (585) to 10:30 AM (630)
    if (totalMins >= 585 && totalMins <= 630) {
      return {
        type: "active-morning",
        title: "🔥 MORNING PEAK WINDOW IS ACTIVE NOW (09:45 AM – 10:30 AM)",
        desc: "Talent acquisition teams and HRs are currently running Resdex searches. Update your profile right now to appear on Page 1!",
        badge: "100% Recruiter Activity",
        theme: "emerald",
      };
    }

    // Afternoon Window: 02:30 PM (870) to 03:15 PM (915)
    if (totalMins >= 870 && totalMins <= 915) {
      return {
        type: "active-afternoon",
        title: "⚡ AFTERNOON 2ND WAVE ACTIVE (02:30 PM – 03:15 PM)",
        desc: "Recruiters are sourcing for tomorrow's interview drive and shortlisting candidates. Apply to fresh jobs posted today!",
        badge: "High Recruiter Activity",
        theme: "indigo",
      };
    }

    // Upcoming morning
    if (totalMins < 585) {
      const diff = 585 - totalMins;
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return {
        type: "upcoming",
        title: `⏳ Next Golden Window: Today at 09:45 AM (in ${h > 0 ? `${h}h ` : ""}${m}m)`,
        desc: "Get ready to trigger your profile timestamp freshness and apply to newly posted MERN/GenAI roles.",
        badge: "Pre-Sourcing Window",
        theme: "amber",
      };
    }

    // Between morning and afternoon
    if (totalMins > 630 && totalMins < 870) {
      const diff = 870 - totalMins;
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return {
        type: "upcoming",
        title: `⏳ Next Afternoon Wave: 02:30 PM (in ${h > 0 ? `${h}h ` : ""}${m}m)`,
        desc: "Use current quiet hours for office tickets or dry-running Striver DSA problems on your notepad.",
        badge: "Focus Block",
        theme: "slate",
      };
    }

    // Post afternoon
    return {
      type: "closed",
      title: "🌙 Recruiter Sourcing Closed for Today",
      desc: "Do NOT update profile late at night (it gets pushed down by morning). Tomorrow's prime window unlocks at 09:45 AM.",
      badge: "Sourcing Closed",
      theme: "slate",
    };
  }, [currentTime]);

  // Copyable texts
  const ASSETS = {
    headline:
      "MERN Stack Developer | React.js, Node.js, Express.js, MongoDB, TypeScript | Next.js, Redux Toolkit, REST APIs, GenAI & LangChain | Serving Notice / 15–30 Days Negotiable",
    summary: `• Full-Stack MERN Developer specializing in building high-performance, scalable web applications using React.js, Node.js, Express, and MongoDB.
• Built and deployed production-grade applications with REST APIs, JWT authentication, and scalable state management via Redux Toolkit.
• Experience integrating Generative AI workflows & LLM APIs (OpenAI, LangChain, Vector Databases) into full-stack web applications.
• Strong foundation in Data Structures & Algorithms (DSA), clean architectural patterns, and Git version control.
• Notice Period: 15–30 Days (Immediate joiner / negotiable).`,
    keywords:
      "React.js, ReactJS, Node.js, NodeJS, Express.js, MongoDB, TypeScript, JavaScript, Redux Toolkit, Next.js, RESTful APIs, MERN Stack, Microservices, GraphQL, Tailwind CSS, Docker, Git, GitHub, Postman, AWS, Generative AI, LLM Integration, LangChain, Vector DB, Prompt Engineering, Data Structures, Algorithms, Unit Testing, Jest, JWT",
    inmailScript: `Hi [Recruiter Name],

I noticed your team is actively sourcing for Full Stack / MERN Developers at [Company Name].

I specialize in building scalable web architectures using React.js, Node.js, Express, and GenAI workflows. I am actively interviewing and have a short notice period (15–30 days / negotiable).

Here is my portfolio & resume. Would love to connect and explore how I can add immediate value to your engineering team!

Best regards,
[Your Name]`,
  };

  const checklistTotal = Object.keys(checklist).length;
  const checklistDone = Object.values(checklist).filter(Boolean).length;
  const checklistPct = Math.round((checklistDone / checklistTotal) * 100);

  return (
    <div className="space-y-6">
      {/* ════════════════════════════════════════════════════════════════
          EXECUTIVE HERO HEADER
      ════════════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-indigo-500/30 shadow-xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                <i className="fa-solid fa-crown text-amber-900"></i>
                <span>Naukri Pro Recruiter Engine</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                Resdex Algorithm Optimized
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                2h Office Window Weaponizer
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white tracking-tight">
              Recruiter Influx & Naukri Pro Command Center
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Recruiters do not browse profiles—they search via <strong>Naukri Resdex</strong> using strict filters.
              By triggering your daily timestamp freshness at <strong>09:45 AM</strong> and maintaining an ATS-ranked
              headline, your profile jumps straight to <strong>Page 1</strong>.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 min-w-[240px]">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Today's Protocol Progress</span>
              <span className="text-emerald-400 font-black">{checklistPct}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${checklistPct}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
              <span>{checklistDone} of {checklistTotal} tasks done</span>
              <span>Goal: 10 calls/month</span>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          LIVE RECRUITER SOURCING RADAR (TIMING BANNER)
      ════════════════════════════════════════════════════════════════ */}
      <div
        className={`rounded-2xl p-5 border transition-all ${
          currentWindowStatus.theme === "emerald"
            ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-100 shadow-lg shadow-emerald-950/20"
            : currentWindowStatus.theme === "indigo"
            ? "bg-indigo-950/40 border-indigo-500/50 text-indigo-100 shadow-lg shadow-indigo-950/20"
            : currentWindowStatus.theme === "amber"
            ? "bg-amber-950/30 border-amber-500/40 text-amber-100"
            : "bg-slate-900 border-slate-700 text-slate-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                {currentWindowStatus.badge}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              {currentWindowStatus.title}
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {currentWindowStatus.desc}
            </p>
          </div>

          <a
            href="https://www.naukri.com/mnjuser/profile"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all whitespace-nowrap cursor-pointer flex-shrink-0"
          >
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
            <span>Open Naukri Profile</span>
          </a>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          TAB NAVIGATION FOR NAUKRI PRO HUB
      ════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-cream-deep p-2 flex items-center gap-2 overflow-x-auto shadow-sm">
        <button
          onClick={() => setActiveTab("protocol")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "protocol"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
              : "text-bark-muted hover:text-bark hover:bg-cream/60"
          }`}
        >
          <i className="fa-solid fa-list-check text-amber-300"></i>
          <span>1. Daily Action Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab("assets")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "assets"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
              : "text-bark-muted hover:text-bark hover:bg-cream/60"
          }`}
        >
          <i className="fa-solid fa-copy text-indigo-300"></i>
          <span>2. One-Click Copy Assets (Headline & Skills)</span>
        </button>

        <button
          onClick={() => setActiveTab("schedule")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "schedule"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
              : "text-bark-muted hover:text-bark hover:bg-cream/60"
          }`}
        >
          <i className="fa-solid fa-business-time text-emerald-400"></i>
          <span>3. 2-Hour Office Power Blueprint</span>
        </button>

        <button
          onClick={() => setActiveTab("resdex_hacks")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "resdex_hacks"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
              : "text-bark-muted hover:text-bark hover:bg-cream/60"
          }`}
        >
          <i className="fa-solid fa-brain text-purple-400"></i>
          <span>4. Resdex Algorithm Hacks & Rules</span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          TAB 1: DAILY ACTION CHECKLIST & COUNTERS
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === "protocol" && (
        <div className="space-y-6">
          {/* Counters Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Jobs Applied */}
            <div className="bg-white rounded-2xl border border-cream-deep p-4 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold text-bark-muted">
                <span>Jobs Applied Today</span>
                <i className="fa-solid fa-paper-plane text-indigo-500"></i>
              </div>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  {metrics.jobsApplied}
                </span>
                <span className="text-xs text-slate-400 font-bold">/ 10 target</span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-cream-deep">
                <button
                  type="button"
                  onClick={() => updateMetric("jobsApplied", -1)}
                  className="w-7 h-7 rounded-lg bg-cream-dark hover:bg-cream-deep text-bark font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => updateMetric("jobsApplied", 1)}
                  className="flex-1 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <i className="fa-solid fa-plus text-[10px]"></i>
                  <span>Log Applied</span>
                </button>
              </div>
            </div>

            {/* Profile Views */}
            <div className="bg-white rounded-2xl border border-cream-deep p-4 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold text-bark-muted">
                <span>Recruiter Views Today</span>
                <i className="fa-solid fa-eye text-emerald-500"></i>
              </div>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  {metrics.profileViews}
                </span>
                <span className="text-xs text-slate-400 font-bold">views</span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-cream-deep">
                <button
                  type="button"
                  onClick={() => updateMetric("profileViews", -1)}
                  className="w-7 h-7 rounded-lg bg-cream-dark hover:bg-cream-deep text-bark font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => updateMetric("profileViews", 1)}
                  className="flex-1 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <i className="fa-solid fa-plus text-[10px]"></i>
                  <span>Log View</span>
                </button>
              </div>
            </div>

            {/* Recruiter Calls / InMails */}
            <div className="bg-white rounded-2xl border border-cream-deep p-4 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold text-bark-muted">
                <span>Recruiter InMails / Calls</span>
                <i className="fa-solid fa-phone-volume text-amber-500"></i>
              </div>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  {metrics.recruiterCalls}
                </span>
                <span className="text-xs text-amber-600 font-bold">leads</span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-cream-deep">
                <button
                  type="button"
                  onClick={() => updateMetric("recruiterCalls", -1)}
                  className="w-7 h-7 rounded-lg bg-cream-dark hover:bg-cream-deep text-bark font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => updateMetric("recruiterCalls", 1)}
                  className="flex-1 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <i className="fa-solid fa-plus text-[10px]"></i>
                  <span>Log Call</span>
                </button>
              </div>
            </div>

            {/* Office Study Minutes */}
            <div className="bg-white rounded-2xl border border-cream-deep p-4 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold text-bark-muted">
                <span>Office Study Minutes</span>
                <i className="fa-solid fa-brain text-purple-500"></i>
              </div>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  {metrics.studyMins}m
                </span>
                <span className="text-xs text-slate-400 font-bold">/ 120m</span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-cream-deep">
                <button
                  type="button"
                  onClick={() => updateMetric("studyMins", -15)}
                  className="w-7 h-7 rounded-lg bg-cream-dark hover:bg-cream-deep text-bark font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => updateMetric("studyMins", 30)}
                  className="flex-1 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <i className="fa-solid fa-plus text-[10px]"></i>
                  <span>+30 Mins</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5-Step Action Checklist */}
          <div className="bg-white rounded-3xl border border-cream-deep p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-cream-deep pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-circle-check text-emerald-500"></i>
                  <span>Naukri Pro Daily Protocol Checklist (Run Mon–Fri)</span>
                </h2>
                <p className="text-xs text-bark-muted mt-0.5">
                  Execute these 5 steps every single weekday during your 2 free hours at office.
                </p>
              </div>
              <div className="text-xs font-mono font-bold text-slate-500">
                {todayDateStr}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {/* STEP 1 */}
              <div
                onClick={() => toggleChecklistItem("freshnessUpdate")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-4 ${
                  checklist.freshnessUpdate
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                    : "bg-cream/30 border-cream-deep hover:border-indigo-300 text-slate-800"
                }`}
              >
                <div className="pt-0.5">
                  <i
                    className={`fa-solid text-xl ${
                      checklist.freshnessUpdate
                        ? "fa-circle-check text-emerald-600"
                        : "fa-circle text-stone-300"
                    }`}
                  ></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      Step 1 • 09:45 AM – 10:30 AM
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      Trigger Resdex Timestamp Freshness (Page 1 Rank)
                    </span>
                  </div>
                  <p className="text-xs text-bark-muted mt-1 leading-relaxed">
                    Log in to Naukri. Click "Edit" on your Resume Headline (or re-upload your resume PDF) and click Save.
                    This updates your "Profile Modified" timestamp to the current minute, ensuring your profile appears on Page 1 when recruiters run morning searches.
                  </p>
                </div>
              </div>

              {/* STEP 2 */}
              <div
                onClick={() => toggleChecklistItem("applyFreshJobs")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-4 ${
                  checklist.applyFreshJobs
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                    : "bg-cream/30 border-cream-deep hover:border-indigo-300 text-slate-800"
                }`}
              >
                <div className="pt-0.5">
                  <i
                    className={`fa-solid text-xl ${
                      checklist.applyFreshJobs
                        ? "fa-circle-check text-emerald-600"
                        : "fa-circle text-stone-300"
                    }`}
                  ></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      Step 2 • 10:00 AM – 10:20 AM
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      Apply to 5–10 Fresh Jobs Posted in the Last 24 Hours
                    </span>
                  </div>
                  <p className="text-xs text-bark-muted mt-1 leading-relaxed">
                    Search <code>MERN Developer</code> / <code>React Developer</code> $\rightarrow$ Filter by <strong>"Freshness: Last 1 Day"</strong>.
                    Recruiter statistics show that <strong>80% of downloaded resumes are among the first 25 applicants</strong>. Never waste time applying to 30-day-old job postings.
                  </p>
                </div>
              </div>

              {/* STEP 3 */}
              <div
                onClick={() => toggleChecklistItem("reversePitchHR")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-4 ${
                  checklist.reversePitchHR
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                    : "bg-cream/30 border-cream-deep hover:border-indigo-300 text-slate-800"
                }`}
              >
                <div className="pt-0.5">
                  <i
                    className={`fa-solid text-xl ${
                      checklist.reversePitchHR
                        ? "fa-circle-check text-emerald-600"
                        : "fa-circle text-stone-300"
                    }`}
                  ></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                      Step 3 • 10:20 AM – 10:30 AM
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      Review "Recruiter Actions" & Reverse-Pitch on LinkedIn
                    </span>
                  </div>
                  <p className="text-xs text-bark-muted mt-1 leading-relaxed">
                    Check your Naukri Pro "Recruiter Actions" tab to see which companies viewed your CV. Immediately copy the recruiter/company name, find them on LinkedIn, and send the personalized connection pitch message (from Tab 2).
                  </p>
                </div>
              </div>

              {/* STEP 4 */}
              <div
                onClick={() => toggleChecklistItem("verifySkillsNotice")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-4 ${
                  checklist.verifySkillsNotice
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                    : "bg-cream/30 border-cream-deep hover:border-indigo-300 text-slate-800"
                }`}
              >
                <div className="pt-0.5">
                  <i
                    className={`fa-solid text-xl ${
                      checklist.verifySkillsNotice
                        ? "fa-circle-check text-emerald-600"
                        : "fa-circle text-stone-300"
                    }`}
                  ></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      Step 4 • Profile Audit
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      Lock in Notice Period $\le$ 30 Days & Fill All 30 Key Skills
                    </span>
                  </div>
                  <p className="text-xs text-bark-muted mt-1 leading-relaxed">
                    Ensure your notice period is marked as <strong>"15–30 Days"</strong> or <strong>"Currently Serving Notice"</strong>. If your profile shows 60 or 90 days, 85% of recruiters filter you out before opening your profile.
                  </p>
                </div>
              </div>

              {/* STEP 5 */}
              <div
                onClick={() => toggleChecklistItem("officeStudySprint")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-4 ${
                  checklist.officeStudySprint
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                    : "bg-cream/30 border-cream-deep hover:border-indigo-300 text-slate-800"
                }`}
              >
                <div className="pt-0.5">
                  <i
                    className={`fa-solid text-xl ${
                      checklist.officeStudySprint
                        ? "fa-circle-check text-emerald-600"
                        : "fa-circle text-stone-300"
                    }`}
                  ></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      Step 5 • 02:30 PM & 04:30 PM
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      Execute 2 x 50-Min Office Study Sprints (DSA + MERN/GenAI Docs)
                    </span>
                  </div>
                  <p className="text-xs text-bark-muted mt-1 leading-relaxed">
                    Take advantage of your remaining free time at work: dry-run 1–2 Striver DSA problems on notepad (2:30 PM) and read React 19 / LangChain documentation (4:30 PM). This saves your energy for evening hands-on coding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          TAB 2: ONE-CLICK COPY ASSETS
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === "assets" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ASSET 1: RESUME HEADLINE */}
          <div className="bg-white rounded-3xl border border-cream-deep p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                  Resdex Field #1 • Highest Search Weight
                </span>
                <span className="text-xs font-bold text-bark-muted">
                  {ASSETS.headline.length} / 250 characters
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900">
                Optimized Resume Headline
              </h3>
              <p className="text-xs text-bark-muted mt-0.5">
                This appears immediately beneath your name in recruiter search listings.
              </p>
              <div className="mt-3 p-3.5 bg-slate-900 text-emerald-300 rounded-xl font-mono text-xs leading-relaxed border border-slate-800">
                {ASSETS.headline}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(ASSETS.headline, "headline", "Resume Headline")}
              className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                copiedKey === "headline"
                  ? "bg-emerald-600 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              <i
                className={`fa-solid ${
                  copiedKey === "headline" ? "fa-circle-check" : "fa-copy"
                }`}
              ></i>
              <span>{copiedKey === "headline" ? "Copied Headline!" : "Copy Resume Headline"}</span>
            </button>
          </div>

          {/* ASSET 2: 30 CRITICAL KEY SKILLS */}
          <div className="bg-white rounded-3xl border border-cream-deep p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                  Resdex Field #2 • Exact Keyword Matches
                </span>
                <span className="text-xs font-bold text-bark-muted">
                  30 High-Ranking Terms
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900">
                30 High-Yield Key Skills
              </h3>
              <p className="text-xs text-bark-muted mt-0.5">
                Paste all 30 skills into your Naukri Key Skills box to match Boolean searches.
              </p>
              <div className="mt-3 p-3.5 bg-slate-900 text-indigo-300 rounded-xl font-mono text-xs leading-relaxed max-h-36 overflow-y-auto border border-slate-800">
                {ASSETS.keywords}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(ASSETS.keywords, "keywords", "30 Key Skills")}
              className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                copiedKey === "keywords"
                  ? "bg-emerald-600 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              <i
                className={`fa-solid ${
                  copiedKey === "keywords" ? "fa-circle-check" : "fa-copy"
                }`}
              ></i>
              <span>{copiedKey === "keywords" ? "Copied 30 Skills!" : "Copy 30 Key Skills"}</span>
            </button>
          </div>

          {/* ASSET 3: PROFILE SUMMARY */}
          <div className="bg-white rounded-3xl border border-cream-deep p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                  ATS Profile Summary
                </span>
                <span className="text-xs font-bold text-bark-muted">
                  5 Clean Bullets
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900">
                Bulleted Profile Summary
              </h3>
              <p className="text-xs text-bark-muted mt-0.5">
                Displays in the candidate preview card. Focuses on tech stack and notice period.
              </p>
              <div className="mt-3 p-3.5 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs leading-relaxed max-h-40 overflow-y-auto border border-slate-800 whitespace-pre-line">
                {ASSETS.summary}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(ASSETS.summary, "summary", "Profile Summary")}
              className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                copiedKey === "summary"
                  ? "bg-emerald-600 text-white"
                  : "bg-teal-700 hover:bg-teal-800 text-white"
              }`}
            >
              <i
                className={`fa-solid ${
                  copiedKey === "summary" ? "fa-circle-check" : "fa-copy"
                }`}
              ></i>
              <span>{copiedKey === "summary" ? "Copied Summary!" : "Copy Profile Summary"}</span>
            </button>
          </div>

          {/* ASSET 4: RECRUITER INMAIL / LINKEDIN DM SCRIPT */}
          <div className="bg-white rounded-3xl border border-cream-deep p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  Reverse-Pitch DM
                </span>
                <span className="text-xs font-bold text-amber-800">
                  High Reply Rate
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900">
                Direct Recruiter InMail & LinkedIn DM
              </h3>
              <p className="text-xs text-bark-muted mt-0.5">
                Send to HRs who view your profile or post hiring updates.
              </p>
              <div className="mt-3 p-3.5 bg-slate-900 text-amber-200 rounded-xl font-mono text-xs leading-relaxed max-h-40 overflow-y-auto border border-slate-800 whitespace-pre-line">
                {ASSETS.inmailScript}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(ASSETS.inmailScript, "inmail", "DM Script")}
              className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                copiedKey === "inmail"
                  ? "bg-emerald-600 text-white"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
              }`}
            >
              <i
                className={`fa-solid ${
                  copiedKey === "inmail" ? "fa-circle-check" : "fa-copy"
                }`}
              ></i>
              <span>{copiedKey === "inmail" ? "Copied DM Script!" : "Copy DM Script"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          TAB 3: 2-HOUR OFFICE POWER BLUEPRINT
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === "schedule" && (
        <div className="bg-white rounded-3xl border border-cream-deep p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-cream-deep pb-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-business-time text-emerald-600"></i>
              <span>How to Weaponize Your 2 Free Hours at Office (09:15 AM – 06:00 PM)</span>
            </h2>
            <p className="text-xs text-bark-muted mt-1 leading-relaxed max-w-3xl">
              Since you have 2 minimum free hours during your workday, shifting your job application pipeline and 
              study preparation into office quiet blocks keeps your evening at home relaxed and focused on high-energy coding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* SPRINT 1 */}
            <div className="bg-indigo-50/60 rounded-2xl p-5 border border-indigo-200 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-black text-indigo-700 mb-2">
                  <span>OFFICE BLOCK 1</span>
                  <span>20 Mins</span>
                </div>
                <div className="text-base font-black text-slate-900">
                  10:00 AM – 10:20 AM
                </div>
                <div className="text-xs font-bold text-indigo-950 mt-1">
                  🚀 Naukri Sourcing & Fast Applications
                </div>
                <ul className="mt-3 space-y-2 text-xs text-slate-700 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>Re-save profile to hit <strong>Page 1 timestamp</strong>.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>Apply to <strong>5–10 fresh jobs</strong> posted in the last 24h.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>Send 2 quick connection requests to hiring HRs.</span>
                  </li>
                </ul>
              </div>
              <div className="pt-2 border-t border-indigo-200 text-[11px] font-bold text-indigo-800">
                Outcome: Instant application views before competition.
              </div>
            </div>

            {/* SPRINT 2 */}
            <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-black text-emerald-700 mb-2">
                  <span>OFFICE BLOCK 2</span>
                  <span>50 Mins</span>
                </div>
                <div className="text-base font-black text-slate-900">
                  02:30 PM – 03:20 PM
                </div>
                <div className="text-xs font-bold text-emerald-950 mt-1">
                  🧠 Striver DSA Dry-Run on Notepad
                </div>
                <ul className="mt-3 space-y-2 text-xs text-slate-700 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>Open Striver A2Z sheet or LeetCode in browser.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>Solve 1–2 standard problems (Two Pointers, Hashing, Trees).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>Dry-run pointers and test cases on physical notepad.</span>
                  </li>
                </ul>
              </div>
              <div className="pt-2 border-t border-emerald-200 text-[11px] font-bold text-emerald-800">
                Outcome: Daily algorithmic problem cleared before reaching home.
              </div>
            </div>

            {/* SPRINT 3 */}
            <div className="bg-purple-50/60 rounded-2xl p-5 border border-purple-200 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-black text-purple-700 mb-2">
                  <span>OFFICE BLOCK 3</span>
                  <span>50 Mins</span>
                </div>
                <div className="text-base font-black text-slate-900">
                  04:30 PM – 05:20 PM
                </div>
                <div className="text-xs font-bold text-purple-950 mt-1">
                  💻 MERN & GenAI Architecture & Docs
                </div>
                <ul className="mt-3 space-y-2 text-xs text-slate-700 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Read React 19 hooks, Next.js App Router, or LangChain docs.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Design DB schemas and API endpoint contracts for evening code.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Pack bag by 05:55 PM $\rightarrow$ Depart at 06:00 PM sharp.</span>
                  </li>
                </ul>
              </div>
              <div className="pt-2 border-t border-purple-200 text-[11px] font-bold text-purple-800">
                Outcome: Evening coding is 100% execution, zero confusion.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          TAB 4: RESDEX ALGORITHM HACKS & GOLDEN RULES
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === "resdex_hacks" && (
        <div className="bg-white rounded-3xl border border-cream-deep p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-cream-deep pb-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-brain text-purple-600"></i>
              <span>The Science of Naukri Resdex (Why Candidates Fail vs Win)</span>
            </h2>
            <p className="text-xs text-bark-muted mt-1 leading-relaxed">
              Resdex is a database search engine. Treat your profile like an SEO page:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DO's */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
              <div className="text-sm font-black text-emerald-900 flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-600"></i>
                <span>WHAT TO ALWAYS DO (Recruiter Boosters):</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-800">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Update at 09:45 AM:</strong> Recruiter queries peak between 10:00 AM and 11:30 AM. Fresh profiles get first-page rank.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Set Notice Period $\le$ 30 Days:</strong> 85% of corporate recruiters filter out 60-90 day notices immediately.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Use Synonym Pairs:</strong> Include both <code>React.js</code> AND <code>ReactJS</code>, <code>Node.js</code> AND <code>NodeJS</code>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Apply to &lt;24h Jobs:</strong> Applying to fresh postings yields a 5x higher CV download rate.</span>
                </li>
              </ul>
            </div>

            {/* DON'TS */}
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-3">
              <div className="text-sm font-black text-rose-900 flex items-center gap-2">
                <i className="fa-solid fa-circle-xmark text-rose-600"></i>
                <span>WHAT TO NEVER DO (Algorithm Traps):</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-800">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span><strong>Never update late at night or on weekends:</strong> By Monday morning, thousands of candidate updates will bury you on Page 8.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span><strong>Never write soft skills in Key Skills:</strong> Words like "Punctual", "Hardworking", "Leader" waste key search slots.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span><strong>Avoid Canva multi-column graphical resumes:</strong> Resdex ATS parser struggles to read multi-column layouts, corrupting your indexed data.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span><strong>Don't ignore the "Who Viewed You" tab:</strong> Those recruiters are warm leads; messaging them directly converts to interview calls.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
