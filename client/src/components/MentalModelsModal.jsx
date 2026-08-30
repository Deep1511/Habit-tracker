import { useState } from "react";
import {
  MERN_ANALOGIES,
  ANTI_LAZINESS_HACKS,
  MOTIVATIONAL_SPARKS,
} from "../mentalModelsData";

export default function MentalModelsModal({ onClose, onStartTopic }) {
  const [activeTab, setActiveTab] = useState("analogies"); // 'analogies' | 'hacks' | 'spark'
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);
  const [randomSparkIdx, setRandomSparkIdx] = useState(0);
  const [copiedId, setCopiedId] = useState(null);

  const categories = [
    { id: "all", label: "All Concepts", icon: "fa-cubes" },
    { id: "JavaScript", label: "JavaScript", icon: "fa-brands fa-js" },
    { id: "React.js", label: "React.js", icon: "fa-brands fa-react" },
    { id: "Node.js & Express", label: "Node.js & Backend", icon: "fa-brands fa-node-js" },
    { id: "Node.js & Auth", label: "Auth & JWT", icon: "fa-shield-halved" },
    { id: "MongoDB", label: "MongoDB", icon: "fa-database" },
  ];

  const filteredAnalogies = MERN_ANALOGIES.filter((item) => {
    const matchCat = categoryFilter === "all" || item.category === categoryFilter;
    const matchSearch =
      item.topic.toLowerCase().includes(search.toLowerCase()) ||
      item.analogy.toLowerCase().includes(search.toLowerCase()) ||
      item.explanation.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const rollRandomSpark = () => {
    const nextIdx = (randomSparkIdx + 1) % MOTIVATIONAL_SPARKS.length;
    setRandomSparkIdx(nextIdx);
  };

  const copyCode = (id, code) => {
    navigator.clipboard?.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      className="modal-overlay fixed inset-0 z-[95] bg-bark/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel bg-white w-full max-w-4xl rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-indigo-100">
        {/* ── Top Header ── */}
        <div className="px-5 py-4 border-b border-cream-deep bg-gradient-to-r from-indigo-900 via-indigo-800 to-teal-900 text-white flex items-start justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-lg text-amber-300 shadow-xs">
              <i className="fa-solid fa-lightbulb"></i>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-extrabold text-base sm:text-lg text-white">
                  Coder's Mental Models & Anti-Boredom Vault
                </h2>
                <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-bark">
                  Boredom Buster ⚡
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Simple real-world analogies, fast notebook rules, and psychology hacks to conquer laziness.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        {/* ── Navigation Tabs ── */}
        <div className="px-5 py-2.5 border-b border-cream-deep bg-cream/40 flex items-center justify-between gap-2 flex-shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("analogies")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "analogies"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-bark-muted hover:bg-cream-dark border border-cream-deep"
              }`}
            >
              <i className="fa-solid fa-brain"></i>
              <span>30-Sec MERN Analogies ({MERN_ANALOGIES.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("hacks")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "hacks"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-white text-bark-muted hover:bg-cream-dark border border-cream-deep"
              }`}
            >
              <i className="fa-solid fa-bolt"></i>
              <span>Anti-Laziness Emergency Kit ({ANTI_LAZINESS_HACKS.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("spark")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "spark"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-white text-bark-muted hover:bg-cream-dark border border-cream-deep"
              }`}
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              <span>Instant Spark & Quotes</span>
            </button>
          </div>
        </div>

        {/* ── Content Body ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* TAB 1: MERN ANALOGIES */}
          {activeTab === "analogies" && (
            <div className="space-y-4">
              {/* Category Pills & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-3 rounded-xl border border-cream-deep">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCategoryFilter(c.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                        categoryFilter === c.id
                          ? "bg-indigo-600 text-white"
                          : "bg-cream text-bark-muted hover:bg-cream-dark"
                      }`}
                    >
                      <i className={c.icon}></i>
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-60">
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-bark-light text-xs"></i>
                  <input
                    type="text"
                    placeholder="Search analogies (e.g. Closure, Event Loop)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-cream-deep bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              {/* Grid of Analogy Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredAnalogies.map((item) => {
                  const isExpanded = expandedCard === item.id;
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-cream-deep p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                    >
                      <div>
                        {/* Header Tag */}
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {item.category} • {item.difficulty}
                          </span>
                          <span className="w-7 h-7 rounded-lg bg-indigo-100/60 text-indigo-700 flex items-center justify-center text-xs">
                            <i className={`fa-solid ${item.icon}`}></i>
                          </span>
                        </div>

                        {/* Concept Name */}
                        <h3 className="font-display font-extrabold text-sm text-bark">
                          {item.topic}
                        </h3>

                        {/* Real-World Analogy Banner */}
                        <div className="mt-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl p-2.5">
                          <div className="text-[11px] font-extrabold text-amber-950 flex items-center gap-1.5">
                            <span>{item.analogy}</span>
                          </div>
                          <p className="text-xs text-amber-900/90 leading-relaxed mt-1">
                            {item.explanation}
                          </p>
                        </div>

                        {/* Textbook definition crossed out vs Fast takeaway */}
                        <div className="mt-2.5 space-y-1.5 text-[11px]">
                          <div className="text-bark-light line-through italic text-[10px] truncate">
                            ❌ College definition: {item.textbookDef}
                          </div>
                          <div className="bg-emerald-50 border border-emerald-200/80 rounded-lg p-2 text-emerald-950 font-bold text-[11px] flex items-start gap-1.5">
                            <i className="fa-solid fa-pen-fancy text-emerald-600 mt-0.5"></i>
                            <span>Notebook 30s Rule: {item.takeaway}</span>
                          </div>
                        </div>
                      </div>

                      {/* Expandable Code Example */}
                      <div className="pt-2 border-t border-cream-deep">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => setExpandedCard(isExpanded ? null : item.id)}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                          >
                            <i className={`fa-solid ${isExpanded ? "fa-chevron-up" : "fa-chevron-down"} text-[10px]`}></i>
                            <span>{isExpanded ? "Hide Code Proof" : "Show 3-Line Code Proof"}</span>
                          </button>

                          {isExpanded && (
                            <button
                              onClick={() => copyCode(item.id, item.codeSnippet)}
                              className="text-[10px] font-bold text-bark-muted hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                            >
                              <i className={`fa-solid ${copiedId === item.id ? "fa-check text-emerald-600" : "fa-copy"}`}></i>
                              <span>{copiedId === item.id ? "Copied!" : "Copy Snippet"}</span>
                            </button>
                          )}
                        </div>

                        {isExpanded && (
                          <pre className="mt-2 p-3 bg-bark text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-bark/40">
                            <code>{item.codeSnippet}</code>
                          </pre>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: ANTI-LAZINESS HACKS */}
          {activeTab === "hacks" && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-teal-50 border border-purple-200/80 rounded-2xl p-4 text-xs text-bark">
                <div className="font-extrabold text-purple-950 text-sm mb-1 flex items-center gap-2">
                  <i className="fa-solid fa-shield-heart text-purple-600"></i>
                  The Science of Beating Procrastination in Dual Prep
                </div>
                <p className="text-bark-muted leading-relaxed">
                  Laziness is rarely about lack of willpower—it is caused by <strong>high friction</strong>, <strong>abstract theory burnout</strong>, and <strong>decision fatigue</strong>. Follow these 5 battlefield-tested rules:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ANTI_LAZINESS_HACKS.map((hack, idx) => (
                  <div
                    key={hack.id}
                    className="bg-white rounded-2xl border border-cream-deep p-4 shadow-2xs space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black">
                          #{idx + 1}
                        </span>
                        <h3 className="font-display font-extrabold text-sm text-bark">
                          {hack.title}
                        </h3>
                      </div>
                      <p className="text-[11px] font-bold text-purple-700 mb-2">
                        {hack.subtitle}
                      </p>
                      <p className="text-xs text-bark-muted bg-cream/50 p-2.5 rounded-xl border border-cream-deep mb-3 leading-relaxed">
                        {hack.summary}
                      </p>

                      <div className="space-y-1.5">
                        <div className="text-[10px] font-extrabold text-bark uppercase tracking-wider">
                          Action Checklist:
                        </div>
                        {hack.steps.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="text-xs text-bark flex items-start gap-2 leading-snug"
                          >
                            <i className="fa-solid fa-circle-check text-emerald-600 text-[11px] mt-0.5 flex-shrink-0"></i>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INSTANT MOTIVATION SPARK & QUOTES */}
          {activeTab === "spark" && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-bark text-white rounded-2xl p-6 shadow-md text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 mx-auto flex items-center justify-center text-xl text-amber-300">
                  <i className="fa-solid fa-quote-left"></i>
                </div>

                <div className="max-w-xl mx-auto space-y-2">
                  <p className="font-display font-bold text-base sm:text-lg leading-relaxed italic text-cream">
                    "{MOTIVATIONAL_SPARKS[randomSparkIdx].quote}"
                  </p>
                  <p className="text-xs text-amber-300 font-extrabold">
                    — {MOTIVATIONAL_SPARKS[randomSparkIdx].author}
                  </p>
                </div>

                <div className="bg-white/10 border border-white/10 rounded-xl p-3 max-w-lg mx-auto text-xs text-indigo-100 text-left space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <i className="fa-solid fa-compass text-amber-400"></i> How to apply this right now:
                  </div>
                  <p className="leading-relaxed">
                    {MOTIVATIONAL_SPARKS[randomSparkIdx].context}
                  </p>
                  <div className="mt-2 pt-2 border-t border-white/10 text-emerald-300 font-bold text-[11px]">
                    {MOTIVATIONAL_SPARKS[randomSparkIdx].trackTip}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={rollRandomSpark}
                    className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-bark font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-dice"></i>
                    <span>Roll for Another Spark</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Close & Start Study Session
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Bottom Bar ── */}
        <div className="px-5 py-3 border-t border-cream-deep bg-cream/40 flex items-center justify-between text-xs text-bark-muted flex-shrink-0">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-heart-pulse text-red-500"></i>
            <span className="font-semibold">Keep momentum alive: 15 minutes is infinitely better than 0.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-bark text-cream hover:bg-bark-light font-bold rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
