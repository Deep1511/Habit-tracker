import { useState } from "react";
import { RECOMMENDED_BOOKS } from "../scheduleData";

export default function BookRecommendations({ onClose }) {
  const [filterCat, setFilterCat] = useState("all");
  const [search, setSearch] = useState("");

  const categories = [
    { id: "all", label: "All Books", icon: "fa-book" },
    { id: "Self-Discipline & Daily Mastery", label: "Discipline & Habits", icon: "fa-arrows-spin" },
    { id: "Unstoppable Motivation & Mental Toughness", label: "Motivation & Grit", icon: "fa-fire" },
    { id: "Peak Cognitive Performance", label: "Deep Focus", icon: "fa-brain" },
    { id: "Wealth, Ego & Life Decisions", label: "Wealth & Life", icon: "fa-coins" },
    { id: "Purpose, Perspective & Inner Strength", label: "Meaning & Purpose", icon: "fa-compass" },
    { id: "Stoicism & Emotional Mastery", label: "Stoic Wisdom", icon: "fa-shield-halved" },
  ];

  const filtered = RECOMMENDED_BOOKS.filter((b) => {
    const matchCat = filterCat === "all" || b.category === filterCat;
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.lifeLesson.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div
      className="modal-overlay fixed inset-0 z-[95] bg-bark/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel bg-white w-full max-w-4xl rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-cream-deep bg-gradient-to-r from-purple-50 via-white to-purple-50 flex items-start justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center text-lg shadow-sm">
              <i className="fa-solid fa-book-open"></i>
            </div>
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-bark">
                Life-Changing Books & Masterpieces
              </h2>
              <p className="text-xs text-bark-muted mt-0.5">
                Curated for unbreakable motivation, timeless life wisdom, and peak mental performance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-cream-dark flex items-center justify-center text-bark-muted transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-cream-deep bg-cream/40 flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-bark-light text-xs"></i>
            <input
              type="text"
              placeholder="Search books, authors, or life lessons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-cream-deep bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setFilterCat(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${filterCat === c.id ? "bg-purple-600 text-white shadow-xs" : "bg-white text-bark-muted hover:bg-cream-dark border border-cream-deep"}`}
              >
                <i className={`fa-solid ${c.icon} text-[10px]`}></i>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Book Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-cream-deep p-5 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top info */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {b.tag}
                    </span>
                    <span className="text-[10px] text-bark-light font-medium">
                      {b.pages} pages
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <i className="fa-solid fa-star text-[10px]"></i>
                    <span>{b.rating}</span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-base text-bark leading-tight">
                  {b.title}
                </h3>
                <p className="text-xs font-semibold text-purple-700 mb-2">
                  by {b.author}
                </p>

                <p className="text-xs text-bark-muted mb-3 leading-relaxed">
                  {b.summary}
                </p>

                {/* Life Lesson Box */}
                <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-3 mb-3">
                  <div className="text-[10px] font-bold text-purple-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <i className="fa-solid fa-lightbulb text-amber-500"></i> Core Life Lesson:
                  </div>
                  <p className="text-xs text-bark font-medium leading-snug">
                    {b.lifeLesson}
                  </p>
                </div>

                {/* Quote */}
                <div className="text-[11px] text-bark-muted italic border-l-2 border-purple-300 pl-2.5 mb-4">
                  "{b.quotes}"
                </div>
              </div>

              {/* Amazon Button */}
              <div className="pt-3 border-t border-cream-deep flex items-center justify-between">
                <span className="text-[11px] text-bark-light font-medium">
                  {b.category}
                </span>
                <a
                  href={b.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-all"
                >
                  <i className="fa-brands fa-amazon text-sm"></i>
                  <span>View on Amazon</span>
                </a>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-12 text-bark-muted">
              No books found matching your search.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-cream-deep bg-cream/30 flex items-center justify-between flex-shrink-0 text-xs text-bark-muted">
          <span>Read 30–45 mins daily during your scheduled evening Book Reading slot.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-bark text-cream rounded-xl font-semibold hover:bg-bark/90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
