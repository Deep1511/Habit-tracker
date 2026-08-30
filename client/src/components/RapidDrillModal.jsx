import { useState, useEffect } from "react";
import { playCompletionChime } from "../soundEngine";

const MERN_DRILLS = [
  {
    q: "What is the output order of: console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4);?",
    options: ["1, 4, 3, 2", "1, 2, 3, 4", "1, 4, 2, 3", "1, 3, 4, 2"],
    answer: 0,
    explanation: "Synchronous (1, 4) executes first ➔ Microtask Queue (Promise: 3) ➔ Macrotask Queue (setTimeout: 2).",
  },
  {
    q: "Why should you never mutate React state directly (e.g. state.push(x))?",
    options: [
      "It causes a syntax error in Babel",
      "React relies on Object.is reference equality to trigger re-renders",
      "Direct mutation deletes the virtual DOM",
      "It only affects class components",
    ],
    answer: 1,
    explanation: "React checks shallow reference equality (`prev !== next`). Mutating the same object pointer skips the re-render cycle.",
  },
  {
    q: "In Node.js, which thread pool handles crypto, zlib, and dns.lookup operations?",
    options: ["V8 Main Thread", "libuv Worker Pool (default 4 threads)", "OS Kernel Event Demuxer", "Cluster IPC Master"],
    answer: 1,
    explanation: "libuv provides a default 4-thread worker pool (`UV_THREADPOOL_SIZE`) to handle blocking operations asynchronously.",
  },
  {
    q: "What happens if 1 promise rejects in Promise.all([p1, p2, p3]) vs Promise.allSettled?",
    options: [
      "Promise.all immediately rejects; Promise.allSettled waits for all to settle",
      "Promise.all retries 3 times; Promise.allSettled ignores errors",
      "Both reject immediately",
      "Promise.all converts rejection to null",
    ],
    answer: 0,
    explanation: "Promise.all is 'fail-fast' on first rejection, whereas Promise.allSettled always returns an array of all outcomes.",
  },
  {
    q: "What is the time complexity of searching an element in an unindexed MongoDB collection of N documents vs B-Tree indexed?",
    options: ["O(1) vs O(N)", "O(N) (COLLSCAN) vs O(log N) (IXSCAN)", "O(log N) vs O(1)", "O(N^2) vs O(N)"],
    answer: 1,
    explanation: "Without an index, MongoDB scans every document (COLLSCAN, O(N)). A B-Tree index provides logarithmic lookup (IXSCAN, O(log N)).",
  },
];

const GOV_DRILLS = [
  {
    q: "What is the fast mental shortcut to compute 85²?",
    options: ["7225 (8 × 9 = 72, followed by 25)", "7025", "6825", "7425"],
    answer: 0,
    explanation: "For numbers ending in 5: Multiply the first digit by (digit + 1), then append 25. 8 × 9 = 72 ➔ 7225.",
  },
  {
    q: "What is the fraction equivalent of 37.5%?",
    options: ["3/8", "5/8", "3/7", "7/16"],
    answer: 0,
    explanation: "12.5% = 1/8 ➔ 37.5% = 3 × (1/8) = 3/8.",
  },
  {
    q: "Which Article of the Indian Constitution is known as the 'Heart and Soul' of the Constitution according to Dr. B.R. Ambedkar?",
    options: ["Article 21 (Right to Life)", "Article 32 (Right to Constitutional Remedies)", "Article 14 (Equality before Law)", "Article 19 (Freedom of Speech)"],
    answer: 1,
    explanation: "Article 32 empowers citizens to move the Supreme Court directly for the enforcement of Fundamental Rights via writs.",
  },
  {
    q: "If 12 men can complete a piece of work in 10 days, how many men are needed to complete it in 6 days?",
    options: ["18 men", "20 men", "24 men", "15 men"],
    answer: 1,
    explanation: "M1 × D1 = M2 × D2 ➔ 12 × 10 = M2 × 6 ➔ 120 / 6 = 20 men.",
  },
  {
    q: "Fundamental Duties (Article 51A) were added to the Indian Constitution by which Amendment Act?",
    options: ["42nd Amendment Act (1976)", "44th Amendment Act (1978)", "73rd Amendment Act (1992)", "86th Amendment Act (2002)"],
    answer: 0,
    explanation: "The 42nd Constitutional Amendment Act, 1976 added Part IV-A (Article 51A) based on the recommendations of the Swaran Singh Committee.",
  },
];

export default function RapidDrillModal({ isOpen, onClose }) {
  const [track, setTrack] = useState("mern"); // 'mern' | 'gov'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);

  const questions = track === "mern" ? MERN_DRILLS : GOV_DRILLS;
  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (!isOpen) return;
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
    setTimerSeconds(60);
  }, [isOpen, track]);

  useEffect(() => {
    if (!isOpen || quizFinished) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setQuizFinished(true);
          playCompletionChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, quizFinished]);

  if (!isOpen) return null;

  const handleSelectOption = (idx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (idx === currentQ.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
      playCompletionChime();
    }
  };

  return (
    <div
      className="modal-overlay fixed inset-0 z-[110] bg-bark/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel bg-white w-full max-w-xl rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 border border-indigo-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cream-deep pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-teal-600 text-white flex items-center justify-center text-sm shadow-xs font-black">
              <i className="fa-solid fa-gamepad"></i>
            </span>
            <div>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-bark">
                60-Sec Rapid-Fire Drill Simulator
              </h3>
              <p className="text-[11px] text-bark-muted">
                Active recall challenge to test core interview &amp; exam instincts under 60 seconds.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="font-mono font-black text-sm bg-slate-900 text-teal-300 px-2.5 py-1 rounded-lg">
              ⏱️ {timerSeconds}s
            </div>
            <button
              onClick={onClose}
              className="text-bark-light hover:text-bark text-xs font-black p-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Track Switcher */}
        {!quizFinished && (
          <div className="flex items-center gap-2 bg-cream p-1 rounded-xl border border-cream-deep">
            <button
              type="button"
              onClick={() => setTrack("mern")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                track === "mern"
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "text-bark-muted hover:text-bark"
              }`}
            >
              💻 MERN &amp; DSA Drills
            </button>
            <button
              type="button"
              onClick={() => setTrack("gov")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                track === "gov"
                  ? "bg-terra-dark text-white shadow-2xs"
                  : "text-bark-muted hover:text-bark"
              }`}
            >
              🏛️ Govt Speed Math &amp; GS
            </button>
          </div>
        )}

        {/* Quiz Body */}
        {!quizFinished ? (
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-bark-light">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>Score: {score}/{questions.length}</span>
            </div>

            <div className="text-sm font-bold text-bark leading-snug bg-cream/40 p-3 rounded-xl border border-cream-deep">
              {currentQ.q}
            </div>

            <div className="space-y-2">
              {currentQ.options.map((opt, idx) => {
                const isPicked = selectedAnswer === idx;
                const isCorrect = idx === currentQ.answer;
                let btnCls = "bg-white border-cream-deep hover:bg-cream/40 text-bark";

                if (selectedAnswer !== null) {
                  if (isCorrect) {
                    btnCls = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs";
                  } else if (isPicked) {
                    btnCls = "bg-red-50 border-red-500 text-red-900 font-bold shadow-xs";
                  } else {
                    btnCls = "bg-white/50 border-cream-deep text-bark-muted opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-start gap-2.5 cursor-pointer ${btnCls}`}
                  >
                    <span className="w-5 h-5 rounded-md bg-black/5 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-snug">{opt}</span>
                    {selectedAnswer !== null && isCorrect && (
                      <i className="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
                    )}
                    {selectedAnswer !== null && isPicked && !isCorrect && (
                      <i className="fa-solid fa-circle-xmark text-red-500 text-sm"></i>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {selectedAnswer !== null && (
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3 text-[11px] text-indigo-950 space-y-1 animate-fadeIn">
                <div className="font-extrabold flex items-center gap-1.5">
                  <i className="fa-solid fa-lightbulb text-amber-500"></i>
                  <span>Intuition &amp; Key Takeaway:</span>
                </div>
                <p className="leading-relaxed">{currentQ.explanation}</p>
                <button
                  type="button"
                  onClick={handleNext}
                  className="mt-2 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>{currentIndex + 1 < questions.length ? "Next Question" : "Complete Drill"}</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Finished Screen */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto shadow-md animate-bounce">
              <i className="fa-solid fa-trophy"></i>
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-bark">
                Drill Completed!
              </h3>
              <div className="text-sm font-bold text-emerald-700 mt-1">
                You scored {score} out of {questions.length} ({Math.round((score / questions.length) * 100)}%)
              </div>
              <p className="text-xs text-bark-muted mt-1 max-w-sm mx-auto">
                Rapid micro-testing sharpens your reaction time for technical interview rounds and competitive exam timing.
              </p>
            </div>

            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentIndex(0);
                  setSelectedAnswer(null);
                  setScore(0);
                  setQuizFinished(false);
                  setTimerSeconds(60);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <i className="fa-solid fa-rotate"></i>
                <span>Try Again</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-cream text-bark font-bold text-xs rounded-xl border border-cream-deep hover:bg-cream-dark transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
