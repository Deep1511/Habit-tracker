import { useState, useEffect } from "react";
import { getExamTracker, updateExamTracker } from "../api";

const COLORS = [
  {
    bg: "bg-terra-pale",
    border: "border-terra/20",
    text: "text-terra",
    check: "#C2410C",
    light: "bg-terra/10",
  },
  {
    bg: "bg-teal-pale",
    border: "border-teal/20",
    text: "text-teal",
    check: "#0F766E",
    light: "bg-teal/10",
  },
  {
    bg: "bg-gold-pale",
    border: "border-gold/20",
    text: "text-gold-dark",
    check: "#D97706",
    light: "bg-gold/10",
  },
  {
    bg: "bg-mint-pale",
    border: "border-mint/20",
    text: "text-mint",
    check: "#15803D",
    light: "bg-mint/10",
  },
  {
    bg: "bg-cream",
    border: "border-cream-deep",
    text: "text-bark",
    check: "#2C1810",
    light: "bg-cream-dark",
  },
  {
    bg: "bg-terra-pale",
    border: "border-terra/15",
    text: "text-terra-dark",
    check: "#7C2D12",
    light: "bg-terra/5",
  },
  {
    bg: "bg-teal-pale",
    border: "border-teal/15",
    text: "text-teal",
    check: "#0F766E",
    light: "bg-teal/5",
  },
  {
    bg: "bg-gold-pale",
    border: "border-gold/15",
    text: "text-gold",
    check: "#D97706",
    light: "bg-gold/5",
  },
  {
    bg: "bg-mint-pale",
    border: "border-mint/15",
    text: "text-mint-dark",
    check: "#15803D",
    light: "bg-mint/5",
  },
];

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

function getStatus(topic) {
  const { covered, testDone, important } = topic;
  if (covered && testDone)
    return {
      label: "Complete",
      cls: "bg-mint-pale text-mint",
      icon: "fa-circle-check",
    };
  if (covered && !testDone)
    return important
      ? {
          label: "Important — Test pending",
          cls: "bg-gold-pale text-gold-dark",
          icon: "fa-star",
        }
      : {
          label: "Test pending",
          cls: "bg-cream-dark text-bark-muted",
          icon: "fa-clock",
        };
  if (!covered && important)
    return {
      label: "Not covered — Important",
      cls: "bg-terra-pale text-terra",
      icon: "fa-exclamation-circle",
    };
  return {
    label: "Pending",
    cls: "bg-cream-dark text-bark-light",
    icon: "fa-circle",
  };
}

export default function ExamTracker() {
  const [subjects, setSubjects] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [addingSubject, setAddingSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [addingTopic, setAddingTopic] = useState(null);
  const [newTopicName, setNewTopicName] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getExamTracker();
      const migrated = (data.subjects || DEFAULT_SUBJECTS).map((sub) => ({
        ...sub,
        topics: sub.topics.map((t) => ({
          ...t,
          covered: t.covered ?? false,
          testDone: t.testDone ?? false,
          important: t.important ?? false,
        })),
      }));
      setSubjects(migrated);
    } catch (e) {
      console.error("ExamTracker load error:", e);
      setSubjects(DEFAULT_SUBJECTS);
    }
    setLoading(false);
  };

  const save = async (newSubjects) => {
    setSubjects(newSubjects);
    try {
      const result = await updateExamTracker(newSubjects);
      console.log(
        "ExamTracker saved:",
        result.subjects.reduce((a, s) => a + s.topics.length, 0),
        "topics",
      );
    } catch (e) {
      console.error("ExamTracker save error:", e);
    }
  };

  const toggleField = (subIdx, topIdx, field) => {
    const s = subjects.map((sub, si) => {
      if (si !== subIdx) return sub;
      return {
        ...sub,
        topics: sub.topics.map((t, ti) =>
          ti === topIdx ? { ...t, [field]: !t[field] } : t,
        ),
      };
    });
    save(s);
  };

  const addSubject = () => {
    if (!newSubjectName.trim()) return;
    save([
      ...subjects,
      {
        id: `sub_${Date.now()}`,
        name: newSubjectName.trim(),
        order: subjects.length,
        topics: [],
      },
    ]);
    setNewSubjectName("");
    setAddingSubject(false);
  };

  const deleteSubject = (subIdx) => {
    save(
      subjects
        .filter((_, i) => i !== subIdx)
        .map((sub, i) => ({ ...sub, order: i })),
    );
    if (expanded === subIdx) setExpanded(null);
    else if (expanded !== null && expanded > subIdx) setExpanded(expanded - 1);
    setConfirmDelete(null);
  };

  const addTopic = (subIdx) => {
    if (!newTopicName.trim()) return;
    const s = subjects.map((sub, si) => {
      if (si !== subIdx) return sub;
      return {
        ...sub,
        topics: [
          ...sub.topics,
          {
            id: `top_${Date.now()}`,
            name: newTopicName.trim(),
            covered: false,
            testDone: false,
            important: false,
            order: sub.topics.length,
          },
        ],
      };
    });
    save(s);
    setNewTopicName("");
    setAddingTopic(null);
  };

  const deleteTopic = (subIdx, topIdx) => {
    save(
      subjects.map((sub, si) =>
        si !== subIdx
          ? sub
          : {
              ...sub,
              topics: sub.topics
                .filter((_, ti) => ti !== topIdx)
                .map((t, ti) => ({ ...t, order: ti })),
            },
      ),
    );
  };

  const moveSubject = (idx, dir) => {
    const nIdx = idx + dir;
    if (nIdx < 0 || nIdx >= subjects.length) return;
    const s = [...subjects];
    [s[idx], s[nIdx]] = [s[nIdx], s[idx]];
    save(s.map((sub, i) => ({ ...sub, order: i })));
  };

  const moveTopic = (subIdx, topIdx, dir) => {
    const sub = subjects[subIdx];
    const nIdx = topIdx + dir;
    if (nIdx < 0 || nIdx >= sub.topics.length) return;
    save(
      subjects.map((su, si) =>
        si !== subIdx
          ? su
          : {
              ...su,
              topics: (() => {
                const t = [...su.topics];
                [t[topIdx], t[nIdx]] = [t[nIdx], t[topIdx]];
                return t.map((tp, i) => ({ ...tp, order: i }));
              })(),
            },
      ),
    );
  };

  if (loading) return null;

  const totalTopics = subjects.reduce((a, s) => a + s.topics.length, 0);
  const coveredTopics = subjects.reduce(
    (a, s) => a + s.topics.filter((t) => t.covered).length,
    0,
  );
  const importantTopics = subjects.reduce(
    (a, s) => a + s.topics.filter((t) => t.important).length,
    0,
  );
  const fullyDone = subjects.reduce(
    (a, s) => a + s.topics.filter((t) => t.covered && t.testDone).length,
    0,
  );
  const pct = totalTopics > 0 ? Math.round((fullyDone / totalTopics) * 100) : 0;

  // Colored checkbox component — no <style> tags
  const ColorCB = ({ checked, color, label, onChange, title }) => (
    <label className="flex items-center gap-1 cursor-pointer" title={title}>
      <span style={{ "--cb-color": color }}>
        <input
          type="checkbox"
          checked={!!checked}
          onChange={onChange}
          className="habit-cb"
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "5px",
            borderWidth: "2px",
            flexShrink: 0,
          }}
        />
      </span>
      <span
        className={`text-[9px] font-semibold ${checked ? "text-bark" : "text-bark-light"} hidden sm:inline`}
      >
        {label}
      </span>
    </label>
  );

  return (
    <section className="bg-white rounded-2xl border border-cream-deep p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display font-bold text-base flex items-center gap-2">
            <i className="fa-solid fa-graduation-cap text-terra text-sm"></i>
            Gov Exam — Subject &amp; Topic Tracker
          </h2>
          <p className="text-xs text-bark-muted mt-0.5">
            {subjects.length} subjects · {totalTopics} topics
          </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex gap-2 flex-wrap justify-end">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-mint-pale text-mint">
              <i className="fa-solid fa-check-double mr-0.5"></i>
              {fullyDone} done
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cream-dark text-bark-muted">
              <i className="fa-solid fa-eye mr-0.5"></i>
              {coveredTopics} covered
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gold-pale text-gold-dark">
              <i className="fa-solid fa-star mr-0.5"></i>
              {importantTopics} imp
            </span>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-terra leading-none">
              {pct}
              <span className="text-xs text-bark-light">%</span>
            </div>
            <div className="w-16 h-1.5 bg-cream-dark rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-terra to-terra-light rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-[10px] text-bark-muted">
        <span className="flex items-center gap-1.5">
          <span
            className="w-4 h-4 rounded border-2 border-cream-deep flex items-center justify-center"
            style={{ background: "#C2410C" }}
          >
            <i className="fa-solid fa-check text-white text-[7px]"></i>
          </span>
          Covered
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="w-4 h-4 rounded border-2 border-cream-deep flex items-center justify-center"
            style={{ background: "#0F766E" }}
          >
            <i className="fa-solid fa-check text-white text-[7px]"></i>
          </span>
          Test Done
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="w-4 h-4 rounded border-2 border-cream-deep flex items-center justify-center"
            style={{ background: "#D97706" }}
          >
            <i className="fa-solid fa-star text-white text-[7px]"></i>
          </span>
          Important
        </span>
      </div>

      <div className="space-y-2">
        {subjects.map((sub, si) => {
          const color = COLORS[si % COLORS.length];
          const done = sub.topics.filter((t) => t.covered && t.testDone).length;
          const covered = sub.topics.filter((t) => t.covered).length;
          const important = sub.topics.filter((t) => t.important).length;
          const total = sub.topics.length;
          const isExp = expanded === si;
          const subPct = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <div
              key={sub.id}
              className={`border ${color.border} rounded-xl overflow-hidden transition-all ${isExp ? "shadow-sm" : ""}`}
            >
              <div
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${color.bg} hover:opacity-90`}
                onClick={() => setExpanded(isExp ? null : si)}
              >
                <div
                  className="w-9 h-9 rounded-lg text-white flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm"
                  style={{ background: color.check }}
                >
                  {sub.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-bold ${color.text} leading-tight`}
                  >
                    {sub.name}
                  </div>
                  <div className="text-[10px] text-bark-muted mt-0.5 flex items-center gap-2 flex-wrap">
                    {total > 0 && (
                      <span>
                        {total} topic{total !== 1 ? "s" : ""}
                      </span>
                    )}
                    {total > 0 && (
                      <span
                        className={
                          covered === total ? "text-mint font-semibold" : ""
                        }
                      >
                        {covered} covered
                      </span>
                    )}
                    {total > 0 && (
                      <span
                        className={
                          done === total ? "text-mint font-semibold" : ""
                        }
                      >
                        {done} tested
                      </span>
                    )}
                    {important > 0 && (
                      <span className="text-gold-dark font-semibold">
                        <i className="fa-solid fa-star text-[8px] mr-0.5"></i>
                        {important}
                      </span>
                    )}
                  </div>
                </div>
                {total > 0 && (
                  <div className="hidden sm:block w-16 h-1.5 bg-cream-dark rounded-full overflow-hidden flex-shrink-0">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${subPct}%`, background: color.check }}
                    ></div>
                  </div>
                )}
                <i
                  className={`fa-solid fa-chevron-down text-bark-light text-[10px] transition-transform duration-200 flex-shrink-0 ${isExp ? "rotate-180" : ""}`}
                ></i>
              </div>

              {isExp && (
                <div className="border-t border-cream-deep/40 bg-white/60 px-4 py-3">
                  {total === 0 && addingTopic !== si && (
                    <p className="text-xs text-bark-light text-center py-4 italic">
                      No topics yet — add your first topic below
                    </p>
                  )}

                  <div className="space-y-0.5">
                    {sub.topics.map((topic, ti) => {
                      const status = getStatus(topic);
                      return (
                        <div
                          key={topic.id}
                          className={`py-2.5 px-3 rounded-lg transition-colors group ${topic.important && !topic.covered ? "bg-terra-pale/30 border border-terra/10" : "hover:bg-cream/70"}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="flex flex-col gap-0 flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveTopic(si, ti, -1);
                                }}
                                disabled={ti === 0}
                                className="w-4 h-3 flex items-center justify-center text-bark-light hover:text-bark disabled:opacity-15 disabled:cursor-not-allowed text-[7px]"
                              >
                                <i className="fa-solid fa-caret-up"></i>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveTopic(si, ti, 1);
                                }}
                                disabled={ti === sub.topics.length - 1}
                                className="w-4 h-3 flex items-center justify-center text-bark-light hover:text-bark disabled:opacity-15 disabled:cursor-not-allowed text-[7px]"
                              >
                                <i className="fa-solid fa-caret-down"></i>
                              </button>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <ColorCB
                                checked={topic.covered}
                                color="#C2410C"
                                label="Cov"
                                onChange={() => toggleField(si, ti, "covered")}
                                title="Covered (studied this topic)"
                              />
                              <ColorCB
                                checked={topic.testDone}
                                color="#0F766E"
                                label="Test"
                                onChange={() => toggleField(si, ti, "testDone")}
                                title="Test completed"
                              />
                              <ColorCB
                                checked={topic.important}
                                color="#D97706"
                                label="Imp"
                                onChange={() =>
                                  toggleField(si, ti, "important")
                                }
                                title="Mark as important"
                              />
                            </div>

                            <span
                              className={`text-xs font-medium flex-1 ${topic.covered && topic.testDone ? "line-through opacity-40" : topic.covered ? "opacity-70" : ""}`}
                            >
                              {topic.name}
                            </span>

                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap ${status.cls}`}
                            >
                              <i
                                className={`fa-solid ${status.icon} mr-0.5 text-[8px]`}
                              ></i>
                              {status.label}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTopic(si, ti);
                              }}
                              className="w-5 h-5 flex items-center justify-center rounded text-[9px] text-transparent group-hover:text-bark-light/50 hover:!text-red-500 transition-all flex-shrink-0"
                              title="Delete topic"
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {addingTopic === si ? (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-cream-deep/30">
                      <input
                        type="text"
                        value={newTopicName}
                        onChange={(e) => setNewTopicName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") addTopic(si);
                          if (e.key === "Escape") {
                            setAddingTopic(null);
                            setNewTopicName("");
                          }
                        }}
                        placeholder="Topic / chapter name..."
                        autoFocus
                        className="flex-1 text-xs border border-cream-deep rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-terra/20 font-medium"
                      />
                      <button
                        onClick={() => addTopic(si)}
                        disabled={!newTopicName.trim()}
                        className="px-3 text-[11px] font-bold py-2 rounded-lg bg-terra text-white hover:bg-terra-dark disabled:opacity-40 transition-colors flex-shrink-0"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setAddingTopic(null);
                          setNewTopicName("");
                        }}
                        className="px-3 text-[11px] font-bold py-2 rounded-lg border border-cream-deep text-bark-muted hover:bg-cream transition-colors flex-shrink-0"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAddingTopic(si);
                        setNewTopicName("");
                      }}
                      className="mt-2 text-[11px] text-bark-light hover:text-terra font-semibold flex items-center gap-1.5 transition-colors py-1"
                    >
                      <i className="fa-solid fa-plus text-[8px]"></i> Add topic
                    </button>
                  )}

                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-cream-deep/30">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSubject(si, -1);
                      }}
                      disabled={si === 0}
                      className="text-[10px] text-bark-light hover:text-bark disabled:opacity-15 transition-colors font-medium"
                    >
                      <i className="fa-solid fa-arrow-up mr-0.5"></i>Up
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSubject(si, 1);
                      }}
                      disabled={si === subjects.length - 1}
                      className="text-[10px] text-bark-light hover:text-bark disabled:opacity-15 transition-colors font-medium"
                    >
                      <i className="fa-solid fa-arrow-down mr-0.5"></i>Down
                    </button>
                    <div className="flex-1"></div>
                    {confirmDelete === si ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-red-500 font-semibold">
                          Delete subject?
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSubject(si);
                          }}
                          className="text-[10px] font-bold text-white bg-red-500 hover:bg-red-600 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete(null);
                          }}
                          className="text-[10px] font-bold text-bark-muted border border-cream-deep px-2.5 py-1 rounded-lg hover:bg-cream transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDelete(si);
                        }}
                        className="text-[10px] text-bark-light/40 hover:text-red-500 font-semibold transition-colors"
                      >
                        <i className="fa-solid fa-trash mr-0.5"></i>Delete
                        subject
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {addingSubject ? (
        <div className="mt-3 border-2 border-dashed border-terra/30 rounded-xl p-4 space-y-2 bg-terra-pale/30">
          <div className="text-[10px] font-bold text-terra uppercase tracking-wider">
            <i className="fa-solid fa-plus mr-1"></i>New Subject
          </div>
          <input
            type="text"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addSubject();
              if (e.key === "Escape") {
                setAddingSubject(false);
                setNewSubjectName("");
              }
            }}
            placeholder="e.g. Mathematics, Reasoning..."
            autoFocus
            className="w-full text-sm border border-cream-deep rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-terra/20 font-medium"
          />
          <div className="flex gap-2">
            <button
              onClick={addSubject}
              disabled={!newSubjectName.trim()}
              className="flex-1 text-xs font-bold py-2.5 rounded-lg bg-terra text-white hover:bg-terra-dark disabled:opacity-40 transition-colors"
            >
              Add Subject
            </button>
            <button
              onClick={() => {
                setAddingSubject(false);
                setNewSubjectName("");
              }}
              className="px-4 text-xs font-bold py-2.5 rounded-lg border border-cream-deep text-bark-muted hover:bg-cream transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setAddingSubject(true);
            setNewSubjectName("");
          }}
          className="mt-3 w-full py-3 border-2 border-dashed border-cream-deep rounded-xl text-xs font-semibold text-bark-light hover:text-terra hover:border-terra/30 transition-colors flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-plus"></i> Add New Subject
        </button>
      )}
    </section>
  );
}
