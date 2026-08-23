import { useState, useEffect } from "react";
import { getMernTracker, updateMernTracker } from "../api";

const COLORS = [
  {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    check: "#4F46E5",
    light: "bg-indigo-100",
    badge: "bg-indigo-600 text-white",
  },
  {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    check: "#D97706",
    light: "bg-amber-100",
    badge: "bg-amber-600 text-white",
  },
  {
    bg: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-700",
    check: "#0F766E",
    light: "bg-teal-100",
    badge: "bg-teal-600 text-white",
  },
  {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    check: "#059669",
    light: "bg-emerald-100",
    badge: "bg-emerald-600 text-white",
  },
  {
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-700",
    check: "#0891B2",
    light: "bg-cyan-100",
    badge: "bg-cyan-600 text-white",
  },
  {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    check: "#7C3AED",
    light: "bg-purple-100",
    badge: "bg-purple-600 text-white",
  },
];

export default function MernTracker() {
  const [tracker, setTracker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState({});
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all' | 'dsa' | 'mern' | 'important'
  const [editingTopic, setEditingTopic] = useState(null);
  const [newTopicName, setNewTopicName] = useState("");
  const [addingToSub, setAddingToSub] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMernTracker();
      setTracker(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveSubjects = async (subs) => {
    try {
      const updated = await updateMernTracker(subs);
      setTracker(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const resetAllProgress = async () => {
    if (!tracker) return;
    const subs = tracker.subjects.map((s) => ({
      ...s,
      topics: s.topics.map((t) => ({
        ...t,
        covered: false,
        testDone: false,
      })),
    }));
    await saveSubjects(subs);
    setShowResetConfirm(false);
  };

  const toggleCovered = (subId, topicId) => {
    if (!tracker) return;
    const subs = tracker.subjects.map((s) => {
      if (s.id !== subId) return s;
      return {
        ...s,
        topics: s.topics.map((t) => {
          if (t.id !== topicId) return t;
          return { ...t, covered: !t.covered };
        }),
      };
    });
    saveSubjects(subs);
  };

  const toggleTest = (subId, topicId) => {
    if (!tracker) return;
    const subs = tracker.subjects.map((s) => {
      if (s.id !== subId) return s;
      return {
        ...s,
        topics: s.topics.map((t) => {
          if (t.id !== topicId) return t;
          return { ...t, testDone: !t.testDone };
        }),
      };
    });
    saveSubjects(subs);
  };

  const toggleImportant = (subId, topicId) => {
    if (!tracker) return;
    const subs = tracker.subjects.map((s) => {
      if (s.id !== subId) return s;
      return {
        ...s,
        topics: s.topics.map((t) => {
          if (t.id !== topicId) return t;
          return { ...t, important: !t.important };
        }),
      };
    });
    saveSubjects(subs);
  };

  const addTopic = (subId) => {
    if (!newTopicName.trim() || !tracker) return;
    const subs = tracker.subjects.map((s) => {
      if (s.id !== subId) return s;
      const nt = {
        id: `topic_${Date.now()}`,
        name: newTopicName.trim(),
        order: s.topics.length,
        covered: false,
        testDone: false,
        important: false,
      };
      return { ...s, topics: [...s.topics, nt] };
    });
    saveSubjects(subs);
    setNewTopicName("");
    setAddingToSub(null);
  };

  const deleteTopic = (subId, topicId) => {
    if (!tracker) return;
    const subs = tracker.subjects.map((s) => {
      if (s.id !== subId) return s;
      return { ...s, topics: s.topics.filter((t) => t.id !== topicId) };
    });
    saveSubjects(subs);
  };

  const saveTopicEdit = (subId, topicId, name) => {
    if (!tracker || !name.trim()) return;
    const subs = tracker.subjects.map((s) => {
      if (s.id !== subId) return s;
      return {
        ...s,
        topics: s.topics.map((t) => (t.id === topicId ? { ...t, name: name.trim() } : t)),
      };
    });
    saveSubjects(subs);
    setEditingTopic(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-cream-deep p-8 text-center text-bark-muted">
        <i className="fa-solid fa-spinner fa-spin text-xl text-indigo-600 mb-2"></i>
        <p className="text-xs">Loading curriculum...</p>
      </div>
    );
  }

  const subjects = tracker?.subjects || [];
  let totalTopics = 0;
  let coveredTopics = 0;
  let testedTopics = 0;

  subjects.forEach((s) => {
    s.topics.forEach((t) => {
      totalTopics++;
      if (t.covered) coveredTopics++;
      if (t.testDone) testedTopics++;
    });
  });

  const overallCoveredPct = totalTopics ? Math.round((coveredTopics / totalTopics) * 100) : 0;
  const overallTestedPct = totalTopics ? Math.round((testedTopics / totalTopics) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Fresh Restart Active Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-base shadow-xs flex-shrink-0">
            <i className="fa-solid fa-seedling"></i>
          </span>
          <div>
            <div className="text-xs sm:text-sm font-bold text-emerald-950 flex flex-wrap items-center gap-2">
              Fresh Prep Restart (August 24, 2026)
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                Day 1: JS Fundamentals & Striver Step 1
              </span>
            </div>
            <p className="text-xs text-emerald-800/80 leading-snug mt-0.5">
              Curriculum configured from complete basics: JS Variables, Data Types & Functions + Striver Logic Building, Patterns & Math.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-3.5 py-2 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-bold rounded-xl border border-red-200 transition-all flex items-center gap-1.5 shadow-2xs flex-shrink-0 cursor-pointer"
        >
          <i className="fa-solid fa-arrows-rotate text-[11px]"></i>
          Reset All Checkmarks (0%)
        </button>
      </div>

      {/* Header card with Striver DSA notice */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl border border-indigo-200/80 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                Full Roadmap
              </span>
              <h2 className="font-display font-bold text-base sm:text-lg text-bark">
                DSA (Striver A2Z) + Full-Stack MERN Mastery
              </h2>
            </div>
            <p className="text-xs text-bark-muted mt-1">
              Follow Striver's A2Z DSA curriculum step-by-step & master full-stack JavaScript from basics to architecture.
            </p>
          </div>

          {/* Striver Resource Link */}
          <a
            href="https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-all flex-shrink-0"
          >
            <i className="fa-brands fa-youtube text-sm"></i>
            <span>Striver A2Z DSA Sheet</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
          </a>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/80 border border-indigo-100 rounded-xl p-3">
            <div className="text-[10px] font-bold text-bark-muted uppercase tracking-wider">Total Syllabus</div>
            <div className="text-lg font-bold text-bark mt-0.5">{totalTopics} Topics</div>
          </div>
          <div className="bg-white/80 border border-indigo-100 rounded-xl p-3">
            <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Topics Covered</div>
            <div className="text-lg font-bold text-indigo-600 mt-0.5">
              {coveredTopics} <span className="text-xs font-medium text-bark-light">({overallCoveredPct}%)</span>
            </div>
          </div>
          <div className="bg-white/80 border border-indigo-100 rounded-xl p-3">
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Problems Tested</div>
            <div className="text-lg font-bold text-emerald-600 mt-0.5">
              {testedTopics} <span className="text-xs font-medium text-bark-light">({overallTestedPct}%)</span>
            </div>
          </div>
          <div className="bg-white/80 border border-indigo-100 rounded-xl p-3">
            <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Interview Core</div>
            <div className="text-lg font-bold text-amber-600 mt-0.5">
              {subjects.reduce((acc, s) => acc + s.topics.filter((t) => t.important).length, 0)} Starred
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[11px] font-bold text-bark mb-1">
            <span>Overall Preparation Progress</span>
            <span className="text-indigo-600">{overallCoveredPct}% Covered</span>
          </div>
          <div className="w-full h-2.5 bg-cream-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 via-teal-600 to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${overallCoveredPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-cream-deep">
        <div className="relative w-full sm:w-80">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-bark-light text-xs"></i>
          <input
            type="text"
            placeholder="Search topics (e.g. Sliding Window, Event Loop, Fiber)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-cream-deep bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${filterType === "all" ? "bg-indigo-600 text-white" : "bg-cream text-bark-muted hover:bg-cream-dark"}`}
          >
            All ({subjects.length})
          </button>
          <button
            onClick={() => setFilterType("dsa")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${filterType === "dsa" ? "bg-red-600 text-white" : "bg-cream text-bark-muted hover:bg-cream-dark"}`}
          >
            <i className="fa-brands fa-youtube text-[10px]"></i> Striver DSA
          </button>
          <button
            onClick={() => setFilterType("mern")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${filterType === "mern" ? "bg-indigo-600 text-white" : "bg-cream text-bark-muted hover:bg-cream-dark"}`}
          >
            MERN Stack
          </button>
          <button
            onClick={() => setFilterType("important")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${filterType === "important" ? "bg-amber-600 text-white" : "bg-cream text-bark-muted hover:bg-cream-dark"}`}
          >
            <i className="fa-solid fa-star text-[10px]"></i> Starred
          </button>
        </div>
      </div>

      {/* Subjects Accordion / Cards List */}
      <div className="space-y-4">
        {subjects
          .filter((sub) => {
            if (filterType === "dsa") return sub.resourceType === "striver";
            if (filterType === "mern") return sub.resourceType !== "striver";
            return true;
          })
          .map((sub, idx) => {
            const isDsa = sub.resourceType === "striver";
            const col = COLORS[idx % COLORS.length];
            const isColl = !!collapsed[sub.id];
            const subTopics = sub.topics.filter((t) => {
              if (filterType === "important" && !t.important) return false;
              if (search.trim()) {
                const q = search.toLowerCase();
                return t.name.toLowerCase().includes(q) || (t.level && t.level.toLowerCase().includes(q));
              }
              return true;
            });

            const coveredCount = sub.topics.filter((t) => t.covered).length;
            const testedCount = sub.topics.filter((t) => t.testDone).length;
            const pct = sub.topics.length ? Math.round((coveredCount / sub.topics.length) * 100) : 0;

            return (
              <div
                key={sub.id}
                className={`bg-white rounded-2xl border ${col.border} overflow-hidden shadow-sm transition-all`}
              >
                {/* Subject Header Bar */}
                <div
                  className={`p-4 ${col.bg} border-b ${col.border} flex items-center justify-between cursor-pointer select-none`}
                  onClick={() => setCollapsed({ ...collapsed, [sub.id]: !isColl })}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
                    <button
                      className={`w-7 h-7 rounded-lg ${col.light} ${col.text} flex items-center justify-center flex-shrink-0 text-xs`}
                    >
                      <i
                        className={`fa-solid fa-chevron-right transition-transform ${isColl ? "" : "rotate-90"}`}
                      ></i>
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold ${col.text}`}>
                          {sub.name}
                        </span>
                        {isDsa && (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-red-600 text-white flex items-center gap-1 shadow-2xs">
                            <i className="fa-brands fa-youtube"></i> Striver A2Z
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-bark-muted mt-0.5">
                        {coveredCount}/{sub.topics.length} Covered ({pct}%) · {testedCount} Tested
                      </div>
                    </div>
                  </div>

                  {/* Right Actions & Progress Bar */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-24 sm:w-32 hidden sm:block">
                      <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-cream-deep">
                        <div
                          className={`h-full ${col.badge.split(" ")[0]} rounded-full transition-all`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>

                    {isDsa && sub.resourceLink && (
                      <a
                        href={sub.resourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-[10px] font-bold rounded-lg flex items-center gap-1 transition-colors"
                        title="Open Striver Sheet"
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
                        <span className="hidden sm:inline">Sheet</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Topics Table / List */}
                {!isColl && (
                  <div className="p-3 sm:p-4 divide-y divide-cream-deep/60">
                    {subTopics.map((topic) => {
                      const isEdit = editingTopic === topic.id;

                      return (
                        <div
                          key={topic.id}
                          className={`py-2.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-cream/40 rounded-xl transition-colors ${topic.covered ? "opacity-95" : ""}`}
                        >
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            {/* Starred indicator */}
                            <button
                              onClick={() => toggleImportant(sub.id, topic.id)}
                              className={`mt-0.5 text-xs transition-colors ${topic.important ? "text-amber-500" : "text-cream-deep hover:text-amber-400"}`}
                              title={topic.important ? "Starred (Interview Core)" : "Star as Interview Core"}
                            >
                              <i className={`fa-${topic.important ? "solid" : "regular"} fa-star`}></i>
                            </button>

                            {/* Level Badge if present */}
                            {topic.level && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-cream-dark text-bark-muted flex-shrink-0">
                                {topic.level}
                              </span>
                            )}

                            {/* Topic Name */}
                            {isEdit ? (
                              <input
                                type="text"
                                defaultValue={topic.name}
                                onBlur={(e) => saveTopicEdit(sub.id, topic.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveTopicEdit(sub.id, topic.id, e.target.value);
                                  if (e.key === "Escape") setEditingTopic(null);
                                }}
                                autoFocus
                                className="text-xs px-2 py-0.5 border border-indigo-300 rounded bg-white w-full"
                              />
                            ) : (
                              <div className="flex-1 min-w-0">
                                <span
                                  className={`text-xs font-medium ${topic.covered ? "line-through text-bark-muted" : "text-bark"}`}
                                  onDoubleClick={() => setEditingTopic(topic.id)}
                                >
                                  {topic.name}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Action Badges: Striver Video + Covered + Tested */}
                          <div className="flex items-center gap-2 pl-6 sm:pl-0 flex-shrink-0">
                            {topic.striverUrl && (
                              <a
                                href={topic.striverUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 flex items-center gap-1 transition-colors"
                                title="Watch Striver Video / Problem Sheet"
                              >
                                <i className="fa-brands fa-youtube text-[11px]"></i>
                                <span>Striver Video</span>
                              </a>
                            )}

                            {/* Covered Toggle */}
                            <button
                              onClick={() => toggleCovered(sub.id, topic.id)}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${topic.covered ? "bg-indigo-600 text-white shadow-2xs" : "bg-cream text-bark-muted hover:bg-cream-dark border border-cream-deep"}`}
                            >
                              <i className={`fa-solid ${topic.covered ? "fa-check" : "fa-circle"}`}></i>
                              <span>{topic.covered ? "Covered" : "Learn"}</span>
                            </button>

                            {/* Tested Toggle */}
                            <button
                              onClick={() => toggleTest(sub.id, topic.id)}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${topic.testDone ? "bg-emerald-600 text-white shadow-2xs" : "bg-cream text-bark-muted hover:bg-cream-dark border border-cream-deep"}`}
                            >
                              <i className={`fa-solid ${topic.testDone ? "fa-vial-circle-check" : "fa-vial"}`}></i>
                              <span>{topic.testDone ? "Tested" : "Practice"}</span>
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => deleteTopic(sub.id, topic.id)}
                              className="text-[10px] text-cream-deep hover:text-red-500 p-1 transition-colors"
                              title="Delete topic"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {subTopics.length === 0 && (
                      <div className="text-center py-4 text-xs text-bark-muted">
                        No topics match the filter.
                      </div>
                    )}

                    {/* Add Topic Input */}
                    {addingToSub === sub.id ? (
                      <div className="pt-3 flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter new topic name..."
                          value={newTopicName}
                          onChange={(e) => setNewTopicName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") addTopic(sub.id);
                            if (e.key === "Escape") setAddingToSub(null);
                          }}
                          autoFocus
                          className="flex-1 text-xs px-3 py-1.5 border border-indigo-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <button
                          onClick={() => addTopic(sub.id)}
                          className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setAddingToSub(null)}
                          className="px-3 py-1.5 bg-cream text-bark-muted text-xs font-bold rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            setAddingToSub(sub.id);
                            setNewTopicName("");
                          }}
                          className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <i className="fa-solid fa-plus text-[10px]"></i> Add custom topic
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-bark/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-cream-deep space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <span className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-lg">
                <i className="fa-solid fa-arrows-rotate"></i>
              </span>
              <div>
                <h3 className="font-bold text-sm text-bark">Restart Fresh from Aug 24?</h3>
                <p className="text-[11px] text-bark-muted">Reset all topic checkmarks to 0%</p>
              </div>
            </div>
            <p className="text-xs text-bark-muted leading-relaxed">
              This will uncheck all <strong>Covered</strong> and <strong>Tested</strong> checkmarks across all subjects so you can start tracking with a completely clean slate starting tomorrow.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-bark-muted hover:bg-cream transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={resetAllProgress}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-check"></i>
                Yes, Reset to 0%
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
