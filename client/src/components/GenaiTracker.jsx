import { useState, useEffect } from "react";
import { getGenaiTracker, updateGenaiTracker, getLocalCache } from "../api";

const GENAI_COLORS = [
  {
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    check: "#7C3AED",
    light: "bg-violet-100",
    badge: "bg-violet-600 text-white",
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
    bg: "bg-fuchsia-50",
    border: "border-fuchsia-200",
    text: "text-fuchsia-700",
    check: "#C026D3",
    light: "bg-fuchsia-100",
    badge: "bg-fuchsia-600 text-white",
  },
  {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    check: "#4F46E5",
    light: "bg-indigo-100",
    badge: "bg-indigo-600 text-white",
  },
  {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    check: "#059669",
    light: "bg-emerald-100",
    badge: "bg-emerald-600 text-white",
  },
];

export default function GenaiTracker({ refreshTrigger = 0, onTrackerChanged }) {
  const [tracker, setTracker] = useState(() => getLocalCache("genai_tracker", null));
  const [loading, setLoading] = useState(() => !getLocalCache("genai_tracker", null));
  const [collapsed, setCollapsed] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'pending' | 'completed' | 'important'
  const [editingTopic, setEditingTopic] = useState(null);
  const [newTopicName, setNewTopicName] = useState("");
  const [addingToSub, setAddingToSub] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const load = async () => {
    try {
      const data = await getGenaiTracker();
      if (data) setTracker(data);
    } catch (e) {
      console.warn("GenaiTracker background sync:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [refreshTrigger]);

  const saveSubjects = async (subs) => {
    try {
      const updated = await updateGenaiTracker(subs);
      setTracker(updated);
      onTrackerChanged?.();
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
      const newTopic = {
        id: `gen_custom_${Date.now()}`,
        name: newTopicName.trim(),
        order: s.topics.length,
        covered: false,
        testDone: false,
        important: false,
        level: "Hands-on",
      };
      return { ...s, topics: [...s.topics, newTopic] };
    });
    saveSubjects(subs);
    setNewTopicName("");
    setAddingToSub(null);
  };

  const deleteTopic = (subId, topicId) => {
    if (!tracker) return;
    const subs = tracker.subjects.map((s) => {
      if (s.id !== subId) return s;
      return {
        ...s,
        topics: s.topics.filter((t) => t.id !== topicId),
      };
    });
    saveSubjects(subs);
  };

  const toggleCollapse = (subId) => {
    setCollapsed((prev) => ({ ...prev, [subId]: !prev[subId] }));
  };

  // Stats calculation
  const stats = (() => {
    if (!tracker) return { total: 0, covered: 0, tested: 0, pctCovered: 0 };
    let total = 0,
      covered = 0,
      tested = 0;
    tracker.subjects.forEach((s) => {
      s.topics.forEach((t) => {
        total++;
        if (t.covered) covered++;
        if (t.testDone) tested++;
      });
    });
    const pctCovered = total > 0 ? Math.round((covered / total) * 100) : 0;
    return { total, covered, tested, pctCovered };
  })();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-cream-deep p-6 text-center text-bark-light">
        <i className="fa-solid fa-spinner fa-spin text-xl text-violet-600 mb-2"></i>
        <div className="text-xs font-semibold">Loading Generative AI Curriculum...</div>
      </div>
    );
  }

  const subjects = tracker?.subjects || [];

  return (
    <section className="bg-white rounded-2xl border border-cream-deep p-4 sm:p-6 shadow-sm space-y-5">
      {/* ── HEADER & STATS BAR ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cream-deep pb-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center text-sm font-black shadow-xs">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </span>
            <h2 className="font-display font-black text-lg text-bark">
              Generative AI &amp; Agentic AI Master Curriculum
            </h2>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-900 border border-violet-200">
              Prompting • RAG • Vector DBs • Agents
            </span>
          </div>
          <p className="text-xs text-bark-muted mt-1 leading-relaxed">
            High-yield roadmap from LLM foundations to production Full-Stack RAG &amp; Multi-Agent Systems.
          </p>
        </div>

        {/* Global Progress & Actions */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-extrabold text-bark">
              {stats.covered} / {stats.total}{" "}
              <span className="text-violet-600">({stats.pctCovered}%)</span>
            </div>
            <div className="text-[10px] text-bark-muted">
              {stats.tested} Built / Tested
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="p-2 text-bark-light hover:text-rose-600 rounded-lg hover:bg-cream-dark transition-colors cursor-pointer"
            title="Reset All GenAI Progress"
          >
            <i className="fa-solid fa-rotate-left text-xs"></i>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-cream rounded-full h-2 overflow-hidden border border-cream-deep">
        <div
          className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${stats.pctCovered}%` }}
        ></div>
      </div>

      {/* ── FILTERS & SEARCH BAR ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-xs text-bark-light"></i>
          <input
            type="text"
            placeholder="Search concepts (e.g. RAG, Embeddings, LangGraph, Tools)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-cream/40 border border-cream-deep rounded-xl text-bark focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Topics" },
            { id: "pending", label: "Pending" },
            { id: "completed", label: "Completed" },
            { id: "important", label: "★ Core / Starred" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg cursor-pointer whitespace-nowrap transition-all ${
                statusFilter === f.id
                  ? "bg-violet-600 text-white shadow-xs"
                  : "bg-cream/60 text-bark-muted hover:text-bark border border-cream-deep"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── SUBJECT MODULES ACCORDION ── */}
      <div className="space-y-4">
        {subjects.map((sub, sIdx) => {
          const col = GENAI_COLORS[sIdx % GENAI_COLORS.length];
          const subCovered = sub.topics.filter((t) => t.covered).length;
          const subTotal = sub.topics.length;
          const subPct = subTotal > 0 ? Math.round((subCovered / subTotal) * 100) : 0;
          const isCollapsed = !!collapsed[sub.id];

          // Filter topics within this subject
          const filteredTopics = sub.topics.filter((t) => {
            const matchesSearch =
              !search.trim() ||
              t.name.toLowerCase().includes(search.toLowerCase()) ||
              (t.level && t.level.toLowerCase().includes(search.toLowerCase()));

            if (!matchesSearch) return false;
            if (statusFilter === "pending") return !t.covered;
            if (statusFilter === "completed") return t.covered;
            if (statusFilter === "important") return t.important;
            return true;
          });

          if (search && filteredTopics.length === 0) return null;

          return (
            <div
              key={sub.id}
              className={`rounded-2xl border ${col.border} overflow-hidden shadow-2xs transition-all`}
            >
              {/* Module Header */}
              <div
                onClick={() => toggleCollapse(sub.id)}
                className={`p-3.5 sm:p-4 ${col.bg} flex items-center justify-between cursor-pointer select-none`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className={`w-6 h-6 rounded-lg ${col.light} ${col.text} flex items-center justify-center text-xs font-bold transition-transform ${
                      isCollapsed ? "-rotate-90" : ""
                    }`}
                  >
                    <i className="fa-solid fa-chevron-down"></i>
                  </button>
                  <div>
                    <h3 className={`font-display font-extrabold text-sm ${col.text}`}>
                      {sub.name}
                    </h3>
                    <div className="text-[11px] text-bark-muted mt-0.5">
                      {subCovered} of {subTotal} topics mastered ({subPct}%)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {sub.resourceLink && (
                    <a
                      href={sub.resourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11px] font-bold text-violet-700 hover:text-violet-900 bg-white/80 px-2.5 py-1 rounded-lg border border-violet-200 hidden sm:flex items-center gap-1 shadow-2xs"
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                      Docs
                    </a>
                  )}

                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                      subPct === 100
                        ? "bg-emerald-600 text-white"
                        : subPct > 0
                        ? col.badge
                        : "bg-bark-light/20 text-bark-muted"
                    }`}
                  >
                    {subPct === 100 ? "Mastered ✓" : `${subPct}%`}
                  </span>
                </div>
              </div>

              {/* Module Topics List */}
              {!isCollapsed && (
                <div className="p-3 sm:p-4 bg-white space-y-2 border-t border-cream-deep/60">
                  {filteredTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        topic.covered
                          ? "bg-cream/40 border-cream-deep opacity-85"
                          : "bg-white border-cream-deep hover:border-violet-300 hover:shadow-2xs"
                      }`}
                    >
                      {/* Checkbox & Name */}
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={topic.covered}
                          onChange={() => toggleCovered(sub.id, topic.id)}
                          className="w-4 h-4 accent-violet-600 rounded cursor-pointer flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div
                            className={`text-xs font-semibold leading-snug break-words ${
                              topic.covered ? "line-through text-bark-muted" : "text-bark"
                            }`}
                          >
                            {topic.name}
                          </div>
                          {topic.level && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-violet-50 text-violet-700 border border-violet-200 inline-block mt-0.5">
                              {topic.level}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Action Icons: Test Done, Star, Delete */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Built / Tested Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleTest(sub.id, topic.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                            topic.testDone
                              ? "bg-cyan-100 text-cyan-900 border border-cyan-300"
                              : "bg-cream text-bark-muted hover:bg-cream-dark border border-cream-deep"
                          }`}
                          title="Toggled when you have built a project or code demo using this concept"
                        >
                          <i className="fa-solid fa-code text-[9px]"></i>
                          <span>{topic.testDone ? "Built ✓" : "Build"}</span>
                        </button>

                        {/* Star Important */}
                        <button
                          type="button"
                          onClick={() => toggleImportant(sub.id, topic.id)}
                          className={`p-1 text-xs cursor-pointer transition-colors ${
                            topic.important
                              ? "text-amber-500"
                              : "text-bark-light hover:text-amber-400"
                          }`}
                          title="Star as Core Topic"
                        >
                          <i
                            className={
                              topic.important ? "fa-solid fa-star" : "fa-regular fa-star"
                            }
                          ></i>
                        </button>

                        {/* Delete Custom Topic */}
                        {topic.id.startsWith("gen_custom_") && (
                          <button
                            type="button"
                            onClick={() => deleteTopic(sub.id, topic.id)}
                            className="text-bark-light hover:text-rose-600 p-1 text-xs cursor-pointer"
                            title="Delete custom topic"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add Custom Topic Input */}
                  {addingToSub === sub.id ? (
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add custom GenAI topic / model..."
                        value={newTopicName}
                        onChange={(e) => setNewTopicName(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs bg-cream/40 border border-cream-deep rounded-xl text-bark focus:outline-none focus:border-violet-500"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => addTopic(sub.id)}
                        className="px-3 py-1.5 bg-violet-600 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-violet-700"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAddingToSub(null);
                          setNewTopicName("");
                        }}
                        className="px-2.5 py-1.5 text-xs font-bold text-bark-muted hover:text-bark rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAddingToSub(sub.id)}
                      className="text-[11px] font-bold text-violet-700 hover:text-violet-900 flex items-center gap-1.5 pt-1.5 cursor-pointer"
                    >
                      <i className="fa-solid fa-plus text-[10px]"></i>
                      <span>Add Topic to {sub.name.split(".")[1] || sub.name}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── RESET CONFIRMATION MODAL ── */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-bark shadow-xl space-y-4">
            <h3 className="font-display font-extrabold text-base text-bark flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation text-amber-500"></i>
              Reset GenAI Progress?
            </h3>
            <p className="text-xs text-bark-muted leading-relaxed">
              This will uncheck all covered topics and built projects in the Generative AI curriculum. Your custom topics will be retained.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 text-xs font-bold text-bark-muted hover:text-bark rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={resetAllProgress}
                className="px-3.5 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
