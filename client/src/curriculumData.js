// ════════════════════════════════════════════════════════════════
// MASTER ZERO-TO-ADVANCE CURRICULUM (45-DAY SPRINT)
// Complete Step-by-Step Roadmap: DSA (Striver A2Z) & MERN Full-Stack
// GOLDEN RULE: Solve JUST 1 CORE PROBLEM per day! (Quality > Speed)
// GenAI Mode: Video Learning (Watch videos at own pace, zero syllabus stress)
// ════════════════════════════════════════════════════════════════

export const CURRICULUM_45_DAYS = {
  1: {
    dayNum: 1,
    dayName: "Day 1 (Monday)",
    badge: "JS Fundamentals & DSA Step 1 Basics",
    dsa: "Step 1.1–1.2: Logic Building, Star/Number Patterns & Big-O Notation",
    dsaDesc: "Pyramid, Diamond & Inverted Patterns. Introduction to Time & Space Complexity Big-O analysis (O(1), O(N), O(log N)).",
    dsaLevel: "Step 1: Zero Basics",
    coreProblem: "Pattern 7 & 8: Star Pyramid & Inverted Pyramid (Loops & Spacing)",
    optionalProblem: "Pattern 10: Half Diamond Pattern",
    dsaProblems: ["Pattern 7 & 8: Star Pyramid & Inverted Pyramid", "Pattern 10: Half Diamond Pattern"],
    mern: "JS Fundamentals: Variables, Data Types & Memory Allocation",
    mernDesc: "var vs let vs const, Primitive types vs Reference types in Call Stack & Memory Heap, Type Coercion (== vs ===), Truthy/Falsy.",
    mernLevel: "Phase 1: JS Core",
    interviewTips: [
      "Explain the exact difference between == (loose equality with type coercion) and === (strict equality with type check).",
      "Primitive values live directly in the stack; reference objects live in the heap with pointer references in the stack.",
      "Always state Big-O time and space complexity before writing any code."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  2: {
    dayNum: 2,
    dayName: "Day 2 (Tuesday)",
    badge: "Basic Math & JS Functions",
    dsa: "Step 1.3: Basic Math Algorithms for DSA Coding",
    dsaDesc: "Count Digits, Reverse a Number, Palindrome Check, GCD/HCF (Euclidean Algorithm in O(log(min(a,b)))), Armstrong Numbers, Check Prime in O(sqrt(N)).",
    dsaLevel: "Step 1: Math Logic",
    coreProblem: "Reverse a Number (Handle 32-bit Integer Overflow)",
    optionalProblem: "GCD / HCF using Euclidean Algorithm (gcd(a, b) = gcd(b, a % b))",
    dsaProblems: ["Reverse a Number (32-bit overflow check)", "GCD via Euclidean Algorithm"],
    mern: "JS Functions: Arrow vs Regular, Scope & Pure Functions",
    mernDesc: "Function Declarations vs Expressions, Arrow Functions (lexical this, no arguments object), First-Class Citizens, Pure functions & Side-effects.",
    mernLevel: "Phase 1: JS Core",
    interviewTips: [
      "Arrow functions cannot be used as constructors (throw TypeError if used with 'new') and do not bind their own 'this'.",
      "Euclidean GCD algorithm: gcd(a, b) = gcd(b, a % b) runs in logarithmic time O(log(min(a, b))).",
      "Reverse Number: check for 32-bit integer overflow [-2^31, 2^31 - 1] before multiplying by 10."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  3: {
    dayNum: 3,
    dayName: "Day 3 (Wednesday)",
    badge: "Recursion Basics & Array Methods",
    dsa: "Step 1.4: Basic Recursion & Frequency Hashing",
    dsaDesc: "Recursion mechanics: Base cases, Call stack trace, Print 1 to N, Factorial, Reverse an Array using Two Pointers recursion, Check Palindrome String, Frequency Hash Map.",
    dsaLevel: "Step 1: Recursion & Hash",
    coreProblem: "Reverse an Array using In-Place Two Pointers (Left & Right Pointers)",
    optionalProblem: "Check if a String is a Palindrome (Recursive)",
    dsaProblems: ["Reverse an Array (In-Place Two Pointers)", "Palindrome String Check (Recursive)"],
    mern: "Arrays & Objects: Modern ES6+ Methods & Immutability",
    mernDesc: "map, filter, reduce, slice, splice, find, flat, Object destructuring, Rest/Spread operators (...), Shallow Copy vs Deep Copy (structuredClone).",
    mernLevel: "Phase 1: JS Core",
    interviewTips: [
      "Array.reduce is an aggregator: accumulator and currentValue can transform arrays into objects, count occurrences, or flatten nested arrays.",
      "Base case is non-negotiable in recursion to prevent 'Maximum call stack size exceeded' RangeError.",
      "structuredClone() handles circular references and nested objects, whereas JSON.parse(JSON.stringify()) drops functions and undefined."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  4: {
    dayNum: 4,
    dayName: "Day 4 (Thursday)",
    badge: "Sorting Algorithms & JS Execution Context",
    dsa: "Step 2: Sorting Techniques (Comparison & Divide-and-Conquer)",
    dsaDesc: "Selection Sort (Find minimum in unsorted array), Bubble Sort (Adjacent swaps), Insertion Sort (Insert in sorted partition), Merge Sort (Divide & Conquer, O(N log N)), Quick Sort (Pivot partitioning).",
    dsaLevel: "Step 2: Sorting Mastery",
    coreProblem: "Merge Sort (Divide & Conquer with merge() helper in O(N log N))",
    optionalProblem: "Selection Sort (Find minimum and swap to front)",
    dsaProblems: ["Merge Sort (Divide & Conquer O(N log N))", "Selection Sort (Find minimum and swap)"],
    mern: "JS Engine Internals: Execution Context & Hoisting",
    mernDesc: "Global Execution Context (GEC), Memory Creation Phase (allocation) vs Code Execution Phase, Call Stack, var undefined vs let/const Temporal Dead Zone (TDZ).",
    mernLevel: "Phase 1: JS Internals",
    interviewTips: [
      "Merge Sort is stable with guaranteed O(N log N) time and O(N) auxiliary space; Quick Sort is in-place O(1) auxiliary space but O(N^2) worst case.",
      "Hoisting: Variables declared with let and const are hoisted but remain uninitialized in the Temporal Dead Zone (TDZ) until their declaration line is executed.",
      "Function declarations are hoisted with their complete definition; function expressions are hoisted as undefined."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  5: {
    dayNum: 5,
    dayName: "Day 5 (Friday)",
    badge: "Arrays Easy & Closures Mastery",
    dsa: "Step 3.1: Arrays (Easy Level Patterns)",
    dsaDesc: "Largest Element in Array, Second Largest Element without sorting (single pass O(N)), Check if Array is Sorted and Rotated, Remove Duplicates from Sorted Array (Two Pointers in-place).",
    dsaLevel: "Step 3: Arrays Easy",
    coreProblem: "Second Largest Element in Array without Sorting (Single Pass O(N))",
    optionalProblem: "Remove Duplicates from Sorted Array (In-Place Two Pointers)",
    dsaProblems: ["Second Largest Element in Array (Single Pass O(N))", "Remove Duplicates from Sorted Array (Two Pointers)"],
    mern: "Scope Chain & Closures: Encapsulation & Currying",
    mernDesc: "Lexical Scope, Scope Chain resolution, Closures (inner function accessing outer scope after outer function returns), Data privacy, Function Currying, Memoization.",
    mernLevel: "Phase 1: JS Internals",
    interviewTips: [
      "A closure is created every time a function is created, retaining references to its outer lexical environment.",
      "Remove Duplicates in-place: slow pointer tracks unique elements, fast pointer explores. Runs in O(N) time and O(1) space.",
      "Array Left Rotate by K: reverse(0, k-1), reverse(k, n-1), reverse(0, n-1). Elegant O(N) time and O(1) space."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  6: {
    dayNum: 6,
    dayName: "Day 6 (Saturday)",
    badge: "Arrays Easy Continued & Prototypes",
    dsa: "Step 3.1: Arrays (Linear Search, Union & Missing Number)",
    dsaDesc: "Linear Search, Move Zeroes to End (Two Pointers), Union of Two Sorted Arrays, Intersection of Two Sorted Arrays, Find Missing Number (XOR / Sum formula), Max Consecutive Ones.",
    dsaLevel: "Step 3: Arrays Easy",
    coreProblem: "Move Zeroes to End of Array (In-Place Two Pointers)",
    optionalProblem: "Find Missing Number in Array (XOR Approach in O(N) time and O(1) space)",
    dsaProblems: ["Move Zeroes to End (Two Pointers)", "Find Missing Number (XOR Approach)"],
    mern: "Prototypes & Prototypal Inheritance",
    mernDesc: "Prototypal Inheritance, Prototype Chain, 'prototype' on constructor functions vs '__proto__' on object instances, Object.create, ES6 Classes under the hood.",
    mernLevel: "Phase 1: JS Internals",
    interviewTips: [
      "Find Missing Number: XOR of all array numbers with 1 to N gives the missing number in O(N) time and O(1) space without integer overflow risk.",
      "Every JavaScript object has a private link (__proto__) to another object called its prototype, terminating at null.",
      "ES6 class syntax is syntactic sugar over prototypes and constructor functions."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  7: {
    dayNum: 7,
    dayName: "Day 7 (Sunday)",
    badge: "Arrays Medium & 'this' Binding",
    dsa: "Step 3.2: Arrays (Medium: Two Sum & Dutch National Flag)",
    dsaDesc: "Two Sum Problem (Hash Map O(N) vs Two Pointers O(N log N)), Sort an Array of 0s, 1s, and 2s (Dutch National Flag Algorithm with 3 pointers: low, mid, high).",
    dsaLevel: "Step 3: Arrays Medium",
    coreProblem: "Two Sum Problem (Hash Map Lookup in O(N) Time)",
    optionalProblem: "Sort Array of 0s, 1s, and 2s (Dutch National Flag Algorithm)",
    dsaProblems: ["Two Sum Problem (Hash Map O(N))", "Sort 0s 1s 2s (Dutch National Flag)"],
    mern: "The 'this' Keyword Binding & Arrow Functions",
    mernDesc: "Implicit Binding (object.method()), Explicit Binding (call, apply, bind), Default Binding (window/undefined in strict mode), 'new' Binding, Lexical this in Arrow functions.",
    mernLevel: "Phase 1: JS Internals",
    interviewTips: [
      "Dutch National Flag: maintains 4 partitions: [0..low-1] are 0s, [low..mid-1] are 1s, [mid..high] are unknown, [high+1..n-1] are 2s.",
      "call(thisArg, arg1, arg2) invokes immediately with comma arguments; apply(thisArg, [args]) invokes with array; bind(thisArg) returns a new function.",
      "Two Sum: Hash Map stores value -> index to find target - current in O(1) time."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  8: {
    dayNum: 8,
    dayName: "Day 8 (Monday)",
    badge: "Kadane's Algorithm & Asynchronous JS",
    dsa: "Step 3.2: Arrays (Kadane's Algorithm & Moore's Voting)",
    dsaDesc: "Kadane's Algorithm for Maximum Subarray Sum (O(N) time, O(1) space), Print the Subarray with Maximum Sum, Majority Element (>N/2) using Moore's Voting Algorithm.",
    dsaLevel: "Step 3: Arrays Medium",
    coreProblem: "Maximum Subarray Sum (Kadane's Algorithm in O(N) time and O(1) space)",
    optionalProblem: "Majority Element (>N/2 using Moore's Voting Algorithm)",
    dsaProblems: ["Maximum Subarray Sum (Kadane's Algorithm)", "Majority Element (>N/2, Moore's Voting)"],
    mern: "Asynchronous JavaScript: Callbacks, Promises & async/await",
    mernDesc: "Synchronous vs Asynchronous execution, Callback Hell & Inversion of Control, Promise Lifecycle (Pending, Fulfilled, Rejected), Chaining, async/await with robust try/catch.",
    mernLevel: "Phase 1: Async JS",
    interviewTips: [
      "Kadane's Algorithm: Maintain running sum. If sum < 0, reset sum to 0. Update max_sum at each step.",
      "Moore's Voting Algorithm: Count cancels out different elements. If a majority element exists (>N/2), it will remain as candidate.",
      "Promises solve Inversion of Control by returning a trusted object that guarantees exactly-one settlement (resolve or reject)."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  9: {
    dayNum: 9,
    dayName: "Day 9 (Tuesday)",
    badge: "Stock Buy/Sell & Event Loop Internals",
    dsa: "Step 3.2: Arrays (Stocks & Next Permutation)",
    dsaDesc: "Best Time to Buy and Sell Stock I (Track minimum so far), Rearrange Array Elements by Sign (Equal positive & negative), Next Permutation (Find break-point, swap with next greater, reverse suffix).",
    dsaLevel: "Step 3: Arrays Medium",
    coreProblem: "Best Time to Buy and Sell Stock I (Single Pass Track Min Price)",
    optionalProblem: "Next Permutation (Find Breakpoint & Reverse Suffix)",
    dsaProblems: ["Best Time to Buy and Sell Stock I", "Next Permutation (Striver Core Pattern)"],
    mern: "Event Loop Architecture: Microtasks vs Macrotasks",
    mernDesc: "Call Stack, Web APIs, Microtask Queue (Promises, queueMicrotask, MutationObserver) vs Macrotask / Callback Queue (setTimeout, setInterval, I/O), Event Loop tick sequence.",
    mernLevel: "Phase 1: JS Internals",
    interviewTips: [
      "Next Permutation: 1. Find largest index i where a[i] < a[i+1]. 2. Find largest index j > i where a[j] > a[i]. 3. Swap a[i] and a[j]. 4. Reverse subarray from i+1 to end.",
      "Microtasks take strict priority: all microtasks in the queue MUST be completely drained before the Event Loop executes even one macrotask.",
      "Stock Buy/Sell: Keep track of minPrice and calculate potential profit at each step in single pass O(N) time and O(1) space."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  10: {
    dayNum: 10,
    dayName: "Day 10 (Wednesday)",
    badge: "Arrays Hard (3Sum) & Custom Polyfills",
    dsa: "Step 3.3: Arrays (Hard: Pascal's Triangle & 3Sum)",
    dsaDesc: "Pascal's Triangle (Generate row / entire triangle), Majority Element (>N/3 using Extended Moore's Voting), 3Sum Problem (Sort + Fixed element + Two Pointers, avoiding duplicate triplets).",
    dsaLevel: "Step 3: Arrays Hard",
    coreProblem: "3Sum Problem (Sort + Fixed Element + Two Pointers without Duplicates)",
    optionalProblem: "Pascal's Triangle (Generate entire triangle)",
    dsaProblems: ["3Sum Problem (O(N^2) Two Pointers)", "Pascal's Triangle Generation"],
    mern: "Custom Polyfills: Writing Native JS Functions from Scratch",
    mernDesc: "Writing polyfills for Array.prototype.map, filter, reduce, Function.prototype.bind, and Promise.all / Promise.allSettled.",
    mernLevel: "Phase 1: Polyfills",
    interviewTips: [
      "3Sum: Sort array first. Loop index i from 0 to n-3. If i > 0 and nums[i] == nums[i-1], continue. Use two pointers left = i+1, right = n-1. Skip duplicates when moving pointers.",
      "Promise.all rejects immediately on the first rejection; Promise.allSettled waits for all promises to settle regardless of rejections.",
      "Custom polyfills require extending Array.prototype and handling this context with proper null/undefined safety."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  11: {
    dayNum: 11,
    dayName: "Day 11 (Thursday)",
    badge: "Arrays Hard (4Sum & XOR) & Debounce / Throttle",
    dsa: "Step 3.3: Arrays (Hard: 4Sum & Longest Consecutive)",
    dsaDesc: "4Sum Problem (Fix two elements + Two Pointers), Longest Consecutive Sequence (HashSet approach in O(N) time), Subarray with Given XOR K (Prefix XOR with Hash Map).",
    dsaLevel: "Step 3: Arrays Hard",
    coreProblem: "Longest Consecutive Sequence (HashSet Approach in O(N) Time)",
    optionalProblem: "4Sum Problem (Extend 3Sum with 2 Fixed Elements)",
    dsaProblems: ["Longest Consecutive Sequence (HashSet O(N))", "4Sum Problem (Two Pointers)"],
    mern: "Performance Utilities: Debounce, Throttle & DOM Events",
    mernDesc: "Debounce implementation (delays execution until silence), Throttle implementation (enforces rate limit), Event Bubbling, Event Capturing, Event Delegation.",
    mernLevel: "Phase 1: Web APIs",
    interviewTips: [
      "Longest Consecutive Sequence: Put all numbers in a HashSet. Only start counting if num - 1 is NOT in set (identifies sequence start). Runs in O(N) time.",
      "Debouncing is ideal for search bar auto-complete; Throttling is ideal for window scroll or resize listeners.",
      "Event Delegation attaches a single event listener to a parent container, using e.target to identify clicked children for optimal memory performance."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  12: {
    dayNum: 12,
    dayName: "Day 12 (Friday)",
    badge: "Merge Intervals & React 19 Virtual DOM",
    dsa: "Step 3.3: Arrays (Hard: Merge Intervals & Missing/Repeating)",
    dsaDesc: "Merge Overlapping Intervals (Sort by start time), Merge Two Sorted Arrays Without Extra Space (Gap method / Insertion), Find Missing and Repeating Number (Math / XOR approach).",
    dsaLevel: "Step 3: Arrays Hard",
    coreProblem: "Merge Overlapping Intervals (Sort by Start Time & Extend End)",
    optionalProblem: "Find Missing and Repeating Number in Array",
    dsaProblems: ["Merge Overlapping Intervals", "Find Missing and Repeating Number"],
    mern: "React Fundamentals: JSX, Virtual DOM & Component Model",
    mernDesc: "JSX compilation to React.createElement, Virtual DOM diffing algorithm, React 18/19 Fiber architecture, Key reconciliation in lists, Component composition.",
    mernLevel: "Phase 2: React Core",
    interviewTips: [
      "Merge Intervals: Sort intervals by start time. Iterate and compare current start with last merged end. If overlapping, update end = max(end, current.end).",
      "Why keys matter in React: Keys give elements stable identities during reconciliation. Using array index as key breaks state when items are reordered or deleted.",
      "Virtual DOM is a lightweight JavaScript object representation of the real DOM kept in memory and synced with real DOM via ReactDOM."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  13: {
    dayNum: 13,
    dayName: "Day 13 (Saturday)",
    badge: "Binary Search 1D & Core React Hooks",
    dsa: "Step 4.1: Binary Search on 1D Arrays (Foundations)",
    dsaDesc: "Binary Search algorithm (Iterative & Recursive), Lower Bound (First index >= X), Upper Bound (First index > X), Search Insert Position, Floor and Ceil in Sorted Array.",
    dsaLevel: "Step 4: Binary Search",
    coreProblem: "Binary Search & Implement Lower Bound (First index >= X)",
    optionalProblem: "Search Insert Position",
    dsaProblems: ["Binary Search & Lower Bound (O(log N))", "Search Insert Position"],
    mern: "Core React Hooks: useState & useEffect Deep Dive",
    mernDesc: "useState mechanics (State batching, functional updates prev => prev + 1), useEffect lifecycle, dependency array rules, cleanup functions, preventing infinite loops.",
    mernLevel: "Phase 2: React Hooks",
    interviewTips: [
      "Binary Search condition: always calculate mid as low + (high - low) / 2 to avoid integer overflow.",
      "React 18 automatic batching bundles multiple state updates inside promises, setTimeout, and native event handlers into a single re-render.",
      "useEffect cleanup function runs before the component unmounts and before the effect re-runs with new dependencies."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  14: {
    dayNum: 14,
    dayName: "Day 14 (Sunday)",
    badge: "Binary Search Rotated & React Forms",
    dsa: "Step 4.1: Binary Search in Rotated Sorted Arrays",
    dsaDesc: "First and Last Occurrence of Element, Count Occurrences, Search in Rotated Sorted Array I (Unique elements), Search in Rotated Sorted Array II (With duplicates: shrink pointers), Find Minimum in Rotated Sorted Array.",
    dsaLevel: "Step 4: Binary Search",
    coreProblem: "Search in Rotated Sorted Array I (Identify which half is sorted)",
    optionalProblem: "First and Last Occurrence of Element X",
    dsaProblems: ["Search in Rotated Sorted Array I", "First and Last Occurrence of X"],
    mern: "React Forms & Persistent State with useRef",
    mernDesc: "Controlled vs Uncontrolled Components, useRef for direct DOM manipulation and mutable instance values that do not trigger re-render, Custom form validation patterns.",
    mernLevel: "Phase 2: React Core",
    interviewTips: [
      "Search in Rotated Array: Identify which half is sorted (left: nums[low] <= nums[mid], or right). If target lies in sorted range, eliminate other half.",
      "useRef returns a mutable object { current: initialValue } whose reference persists across re-renders without causing a re-render when mutated.",
      "Controlled components store form state in React; Uncontrolled components rely on the DOM itself using refs."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  15: {
    dayNum: 15,
    dayName: "Day 15 (Monday)",
    badge: "BS on Answers & React Performance (Memo)",
    dsa: "Step 4.2: Binary Search on Answers (Search Space Monotonicity)",
    dsaDesc: "Finding Square Root using Binary Search, Nth Root of Integer, Koko Eating Bananas (Minimum eating speed within time limit H), Minimum Days to Make M Bouquets.",
    dsaLevel: "Step 4: BS Answers",
    coreProblem: "Koko Eating Bananas (Binary Search on Monotonic Eating Speed)",
    optionalProblem: "Square Root of an Integer using Binary Search",
    dsaProblems: ["Koko Eating Bananas (Striver Classic)", "Square Root using Binary Search"],
    mern: "React Performance: React.memo, useMemo & useCallback",
    mernDesc: "Referential equality in JavaScript, React.memo (skips component re-renders if props unchanged), useMemo (caches computed values), useCallback (caches function references).",
    mernLevel: "Phase 2: Performance",
    interviewTips: [
      "BS on Answers applies when problem asks for Min of Max or Max of Min, and feasibility check function isMonotonic(mid) runs in O(N).",
      "useCallback(fn, deps) is syntactic sugar for useMemo(() => fn, deps). Only useful when passing callbacks to memoized children.",
      "Koko Bananas: search space is low = 1 to high = max(piles). Helper canEatAll(speed) computes total hours in O(N)."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  16: {
    dayNum: 16,
    dayName: "Day 16 (Tuesday)",
    badge: "Hard Binary Search & Advanced React 18/19",
    dsa: "Step 4.2: Binary Search on Answers (Hard / Top Interview)",
    dsaDesc: "Book Allocation Problem (Allocate minimum pages), Aggressive Cows (Maximum minimum distance between cows), Painter's Partition Problem, Split Array Largest Sum.",
    dsaLevel: "Step 4: BS Hard",
    coreProblem: "Aggressive Cows (Maximum Minimum Distance between Cows)",
    optionalProblem: "Book Allocation Problem (Allocate Minimum Pages)",
    dsaProblems: ["Aggressive Cows (Classic Striver Pattern)", "Book Allocation Problem"],
    mern: "React 18 & 19 Concurrent Features: Transitions & Suspense",
    mernDesc: "Concurrent React rendering, useTransition (marks non-urgent UI updates as interruptible), useDeferredValue (defers re-evaluating values), Suspense, Error Boundaries.",
    mernLevel: "Phase 2: React 18/19",
    interviewTips: [
      "Aggressive Cows: search space is distance between 1 and max(stalls) - min(stalls). Can we place C cows with at least mid distance?",
      "useTransition keeps the interface responsive during heavy computations by yielding to high-priority events (typing, clicking).",
      "Book Allocation: search space is low = max(arr), high = sum(arr). If student count > M, increase page limit."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  17: {
    dayNum: 17,
    dayName: "Day 17 (Wednesday)",
    badge: "Strings Easy/Med & Context API Architecture",
    dsa: "Step 5.1–5.2: Strings (Easy to Medium Algorithms)",
    dsaDesc: "Remove Outermost Parentheses, Reverse Words in a String, Largest Odd Number in String, Longest Common Prefix, Isomorphic Strings, Valid Anagram.",
    dsaLevel: "Step 5: Strings",
    coreProblem: "Valid Anagram (Character Frequency Array in O(N) Time)",
    optionalProblem: "Reverse Words in a String",
    dsaProblems: ["Valid Anagram (Frequency Array)", "Reverse Words in a String"],
    mern: "State Management: Context API & useReducer",
    mernDesc: "Solving Prop Drilling, createContext, useContext, useReducer for complex multi-action state machines, Combining Context with useReducer for clean state stores.",
    mernLevel: "Phase 2: State",
    interviewTips: [
      "Valid Anagram: Count character frequencies in an array of size 26. Increment for string 1, decrement for string 2 in single pass.",
      "Context API triggers re-renders on all consuming components when value changes. Split contexts (e.g. StateContext vs DispatchContext) to prevent unnecessary renders.",
      "Reverse Words in a String: Trim leading/trailing spaces, split by multiple spaces regex /\\s+/, reverse and join with single space."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  18: {
    dayNum: 18,
    dayName: "Day 18 (Thursday)",
    badge: "Strings Medium/Hard & Redux Toolkit (RTK)",
    dsa: "Step 5.2: Strings (Medium: Palindromes & Substrings)",
    dsaDesc: "Sort Characters By Frequency, Maximum Nesting Depth of Parentheses, Roman to Integer, Integer to Roman, String to Integer (atoi with clamp), Longest Palindromic Substring.",
    dsaLevel: "Step 5: Strings Medium",
    coreProblem: "Longest Palindromic Substring (Expand Around Center in O(N^2))",
    optionalProblem: "Roman to Integer Conversion",
    dsaProblems: ["Longest Palindromic Substring (Expand Around Center)", "Roman to Integer Conversion"],
    mern: "Redux Toolkit (RTK): Modern Global State Management",
    mernDesc: "Why RTK replaces legacy Redux, configureStore, createSlice, Reducers and Action creators, useSelector, useDispatch, Immer library behind the scenes.",
    mernLevel: "Phase 2: Redux Toolkit",
    interviewTips: [
      "Longest Palindromic Substring: Expand around center for all 2N-1 centers (odd length center at i, even length center between i and i+1) in O(N^2) time.",
      "Redux Toolkit uses Immer under the hood, allowing developers to write 'mutating' code (state.count++) which is safely converted into immutable copies.",
      "atoi: Handle leading whitespace, optional +/- sign, clamp value between -2^31 and 2^31 - 1."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  19: {
    dayNum: 19,
    dayName: "Day 19 (Friday)",
    badge: "Singly Linked Lists & Async RTK Query",
    dsa: "Step 6.1–6.2: Singly Linked List (Foundations & Operations)",
    dsaDesc: "Linked List Node structure, Traversal, Length of LL, Search an Element, Insertion (at Head, Tail, Kth position), Deletion (Head, Tail, Kth position, by value).",
    dsaLevel: "Step 6: Linked Lists",
    coreProblem: "Insert & Delete Node in Singly Linked List (Handle Head & Tail)",
    optionalProblem: "Array to Linked List Conversion & Traversal",
    dsaProblems: ["Insert & Delete Node in Linked List", "Convert Array to Linked List"],
    mern: "Async State in Redux: createAsyncThunk & RTK Query",
    mernDesc: "Handling asynchronous API requests in Redux with createAsyncThunk (pending, fulfilled, rejected action states), RTK Query basics (auto-caching, polling, invalidation tags).",
    mernLevel: "Phase 2: Redux Toolkit",
    interviewTips: [
      "Linked List advantages over Arrays: Dynamic sizing, O(1) insertions/deletions at head. Disadvantage: No random access O(N) search and pointer memory overhead.",
      "createAsyncThunk generates three Redux action types automatically: pending, fulfilled, and rejected.",
      "Always handle edge cases when deleting nodes: head deletion, tail deletion, single-node list, and target node not found."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  20: {
    dayNum: 20,
    dayName: "Day 20 (Saturday)",
    badge: "LL Reversal & React Router v6 Architecture",
    dsa: "Step 6.3: Linked Lists (Reversal & Middle Node)",
    dsaDesc: "Reverse a Singly Linked List (Iterative with 3 pointers: prev, curr, next & Recursive), Middle of the Linked List (Floyd's Tortoise and Hare algorithm: slow moves 1, fast moves 2).",
    dsaLevel: "Step 6: LL Medium",
    coreProblem: "Reverse a Linked List (Iterative with 3 Pointers: prev, curr, next)",
    optionalProblem: "Middle of the Linked List (Floyd's Tortoise & Hare)",
    dsaProblems: ["Reverse a Linked List (Iterative 3-Pointers)", "Middle of Linked List (Tortoise & Hare)"],
    mern: "Client-Side Routing: React Router v6 Deep Dive",
    mernDesc: "BrowserRouter, Routes, Route, Outlet for Nested Layouts, Dynamic route parameters (useParams), Query parameters (useSearchParams), Protected Routes with Navigate.",
    mernLevel: "Phase 2: React Router",
    interviewTips: [
      "Floyd's Tortoise and Hare: When fast pointer reaches null or fast.next is null, slow pointer is guaranteed to be at the exact middle of the list in single pass.",
      "Iterative LL reversal: prev = null, curr = head. While curr: next = curr.next, curr.next = prev, prev = curr, curr = next. Return prev.",
      "Protected routes verify authentication token in memory/cookies before rendering children via Outlet; otherwise redirect with Navigate to /login."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  21: {
    dayNum: 21,
    dayName: "Day 21 (Sunday)",
    badge: "LL Cycle Detection & Custom Hooks Architecture",
    dsa: "Step 6.3: Linked Lists (Cycle Detection & Starting Node)",
    dsaDesc: "Detect a Loop in Linked List (Floyd's Cycle Finding), Find the Starting Node of the Loop in LL (Reset slow to head), Length of Loop in Linked List.",
    dsaLevel: "Step 6: LL Cycles",
    coreProblem: "Detect Loop & Find Starting Node of Loop in Linked List",
    optionalProblem: "Find Length of Loop in Linked List",
    dsaProblems: ["Detect Loop & Find Starting Point in LL", "Length of Loop in Linked List"],
    mern: "Production Custom Hooks Architecture",
    mernDesc: "Extracting reusable UI logic into custom hooks: useFetch (with AbortController for cancelation), useLocalStorage, useDebounce, useMediaQuery.",
    mernLevel: "Phase 2: Custom Hooks",
    interviewTips: [
      "Starting node of loop: If slow and fast meet, reset slow to head while keeping fast at meeting point. Advance both by 1 step. They will collide at the exact loop start.",
      "AbortController in custom hooks aborts in-flight fetch requests when a component unmounts or query parameters change, preventing memory leaks.",
      "Custom hooks must follow React Hook naming conventions (start with 'use') to let linting enforce Rules of Hooks."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  22: {
    dayNum: 22,
    dayName: "Day 22 (Monday)",
    badge: "Linked Lists Hard & Node.js Architecture",
    dsa: "Step 6.4–6.5: Linked Lists (Hard Level Interview Patterns)",
    dsaDesc: "Check if LL is Palindrome (Find middle, reverse 2nd half, compare), Delete Nth Node from End (Two Pointers offset by N), Add Two Numbers represented as LLs, Reverse Nodes in K-Group.",
    dsaLevel: "Step 6: LL Hard",
    coreProblem: "Remove Nth Node from End of Linked List (Two Pointers Offset by N)",
    optionalProblem: "Check if Linked List is Palindrome (Reverse 2nd Half in O(1) Space)",
    dsaProblems: ["Remove Nth Node from End of List", "Palindrome Linked List (O(1) Space)"],
    mern: "Node.js Architecture: V8, Libuv & Thread Pool",
    mernDesc: "How Node.js executes JavaScript, V8 Engine, Libuv event loop architecture, Single thread vs 4 background Worker Threads (Thread Pool for crypto, fs, zlib), CommonJS vs ES Modules.",
    mernLevel: "Phase 3: Node.js Core",
    interviewTips: [
      "Remove Nth from End: Move fast pointer N steps ahead. Then move slow and fast together until fast reaches end. slow.next is the node to delete.",
      "Is Node.js truly single-threaded? The JavaScript execution call stack is single-threaded, but Libuv delegates blocking I/O, DNS lookup, and cryptographic hashing to background thread pool.",
      "Palindrome LL: Reverse second half in-place to achieve O(N) time and O(1) auxiliary space without using an array."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  23: {
    dayNum: 23,
    dayName: "Day 23 (Tuesday)",
    badge: "Recursion & Backtracking + Node.js Streams",
    dsa: "Step 7: Recursion & Backtracking (Subsets & Combinations)",
    dsaDesc: "Subsets I & II (Power Set using Pick / Non-Pick recursion and avoiding duplicates), Combination Sum I (Infinite supply of candidate), Combination Sum II (Unique candidates).",
    dsaLevel: "Step 7: Backtracking",
    coreProblem: "Generate All Subsets / Power Set (Pick / Non-Pick Recursion)",
    optionalProblem: "Combination Sum I (Target Sum with Candidates)",
    dsaProblems: ["Generate All Subsets (Power Set)", "Combination Sum I"],
    mern: "Node.js Streams, Buffers & EventEmitter",
    mernDesc: "Memory-efficient data processing: Readable Streams, Writable Streams, Transform Streams, pipe(), Buffers for binary data, EventEmitter publisher-subscriber pattern.",
    mernLevel: "Phase 3: Node.js Core",
    interviewTips: [
      "Subsets pick/non-pick: At each index, recurse by including current element, backtrack, then recurse by skipping current element. Time complexity O(2^N).",
      "Streams prevent out-of-memory errors by processing massive gigabyte files chunk-by-chunk in small buffer chunks rather than reading entire file into RAM.",
      "Combination Sum II: Sort array first. In loop, if i > index && arr[i] == arr[i-1], skip iteration to avoid duplicate combinations."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  24: {
    dayNum: 24,
    dayName: "Day 24 (Wednesday)",
    badge: "Backtracking Hard & Express.js Architecture",
    dsa: "Step 7: Advanced Backtracking (Permutations & N-Queens)",
    dsaDesc: "Generate Permutations of Array/String (In-place swap backtracking), N-Queens Problem (Place N non-attacking queens on NxN chessboard using row/col/diagonal hashing), Word Search.",
    dsaLevel: "Step 7: Backtracking Hard",
    coreProblem: "Print all Permutations of Array (In-Place Swap Backtracking)",
    optionalProblem: "Word Search on 2D Board (DFS Backtracking)",
    dsaProblems: ["Print all Permutations of Array", "Word Search on 2D Board"],
    mern: "Express.js Fundamentals & Modular Routing",
    mernDesc: "Express Application lifecycle, Request (req.body, req.params, req.query, req.headers), Response methods (json, send, status), express.Router modular architecture.",
    mernLevel: "Phase 3: Express.js",
    interviewTips: [
      "N-Queens optimal check: Use 3 hash arrays (leftRow, lowerDiagonal[row + col], upperDiagonal[n - 1 + col - row]) to check queen safety in O(1) instead of O(N) scanning.",
      "Express is essentially a routing and middleware web framework that has minimal functionality of its own: an Express app is a series of middleware function calls.",
      "Permutations: swap(nums[i], nums[idx]), recurse(idx + 1), swap(nums[i], nums[idx]) achieves O(N! * N) time with zero extra hash table memory."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  25: {
    dayNum: 25,
    dayName: "Day 25 (Thursday)",
    badge: "Stacks & Queues Basics + Express Middleware",
    dsa: "Step 9.1: Stacks & Queues (Foundations & Min Stack)",
    dsaDesc: "Stack & Queue implementation using Arrays & Linked Lists, Valid Parentheses (Matching brackets using Stack), Implement Queue using Stacks, Implement Min Stack with O(1) time and space.",
    dsaLevel: "Step 9: Stacks & Queues",
    coreProblem: "Valid Parentheses (Matching Brackets with Stack)",
    optionalProblem: "Min Stack (O(1) getMin in Time and Auxiliary Space)",
    dsaProblems: ["Valid Parentheses (Stack Matching)", "Min Stack (O(1) getMin)"],
    mern: "Express Middleware & Global Error Handling",
    mernDesc: "Application-level, Router-level, Built-in (express.json), Third-party (cors, helmet, morgan), and Centralized Global Error Handling Middleware (err, req, res, next).",
    mernLevel: "Phase 3: Express.js",
    interviewTips: [
      "Min Stack O(1) space: When pushing val < min, push encoded value (2*val - min) and update min = val. When popping val < min, retrieve old min as 2*min - val.",
      "Express Error Handling: An error-handling middleware MUST accept exactly 4 arguments: (err, req, res, next). If next(err) is called anywhere, Express bypasses all regular middlewares to this handler.",
      "Valid Parentheses: Push opening brackets to stack. For closing brackets, check if stack is empty or top doesn't match; otherwise pop."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  26: {
    dayNum: 26,
    dayName: "Day 26 (Friday)",
    badge: "Monotonic Stack & RESTful API Conventions",
    dsa: "Step 9.2: Monotonic Stack (Next Greater Element & Trapping Water)",
    dsaDesc: "Next Greater Element I (Monotonic Decreasing Stack), Next Greater Element II (Circular array using 2N-1 loop), Next Smaller Element, Trapping Rain Water (Two Pointers vs Stack approach).",
    dsaLevel: "Step 9: Monotonic Stack",
    coreProblem: "Next Greater Element I (Monotonic Decreasing Stack in O(N))",
    optionalProblem: "Trapping Rain Water (Two Pointers O(N) Time and O(1) Space)",
    dsaProblems: ["Next Greater Element I (Monotonic Stack)", "Trapping Rain Water (Two Pointers)"],
    mern: "RESTful API Architecture & Status Code Conventions",
    mernDesc: "REST constraints (Stateless, Client-Server, Cacheable), HTTP Verbs (GET, POST, PUT, PATCH, DELETE), Status codes (200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 500 Internal).",
    mernLevel: "Phase 3: REST APIs",
    interviewTips: [
      "Monotonic Stack maintains strictly increasing or decreasing elements. Traverses right-to-left, popping elements smaller than current, yielding O(N) linear time for Next Greater Element.",
      "PUT replaces an entire resource; PATCH updates partial fields of a resource.",
      "Trapping Rain Water: Two pointers l = 0, r = n-1. Track leftMax and rightMax. Water trapped at each bar is determined by min(leftMax, rightMax) - height."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  27: {
    dayNum: 27,
    dayName: "Day 27 (Saturday)",
    badge: "Monotonic Stack Hard & Request Validation (Zod)",
    dsa: "Step 9.3: Monotonic Stack (Histograms & Maximal Rectangle)",
    dsaDesc: "Largest Rectangle in Histogram (Find Previous Smaller & Next Smaller Elements in O(N)), Maximal Rectangle in Binary Matrix, Asteroid Collision, Sum of Subarray Minimums.",
    dsaLevel: "Step 9: Stack Hard",
    coreProblem: "Largest Rectangle in Histogram (Monotonic Stack in Single Pass O(N))",
    optionalProblem: "Asteroid Collision (Stack Simulation)",
    dsaProblems: ["Largest Rectangle in Histogram (O(N) Stack)", "Asteroid Collision"],
    mern: "API Input Validation & Sanitization with Zod",
    mernDesc: "Why client-side validation is insufficient, Schema validation with Zod in Express middlewares, Type-safe request payloads, Sanitizing inputs against NoSQL Injection & XSS attacks.",
    mernLevel: "Phase 3: Validation",
    interviewTips: [
      "Largest Rectangle in Histogram: For each bar, area = height * (next_smaller_idx - prev_smaller_idx - 1). Single-pass monotonic stack computes this in O(N) time.",
      "Never trust client data: Always validate and sanitize request bodies on the server using strict schemas (Zod/Joi) before touching the database.",
      "Maximal Rectangle converts each row of 2D matrix into a running histogram and calls Largest Rectangle in Histogram row-by-row."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  28: {
    dayNum: 28,
    dayName: "Day 28 (Sunday)",
    badge: "Sliding Window Basics & MongoDB Foundations",
    dsa: "Step 10: Sliding Window & Two Pointers (Foundations)",
    dsaDesc: "Sliding Window pattern: Constant Window vs Variable Window. Longest Substring Without Repeating Characters (Hash Map + Left pointer), Max Consecutive Ones III (At most K zeroes flipped), Fruit Into Baskets.",
    dsaLevel: "Step 10: Sliding Window",
    coreProblem: "Longest Substring Without Repeating Characters (Sliding Window & Hash Map)",
    optionalProblem: "Max Consecutive Ones III (At most K zeroes flipped)",
    dsaProblems: ["Longest Substring Without Repeating Characters", "Max Consecutive Ones III"],
    mern: "MongoDB Foundations & Mongoose ODM",
    mernDesc: "Document database architecture (BSON vs JSON), Collections vs Tables, Connecting Node.js to MongoDB with Mongoose, Defining Schemas with SchemaTypes and strict validations.",
    mernLevel: "Phase 4: MongoDB",
    interviewTips: [
      "Sliding Window dynamically expands right pointer and contracts left pointer when condition is violated, converting O(N^2) brute force into O(N) linear time.",
      "MongoDB is a NoSQL document database: dynamic schemas allow flexible nested structures, high horizontal scalability via sharding, and fast reads without complex joins.",
      "Longest Substring without repeating: Map stores char -> last seen index. When duplicate found, left = max(left, map[char] + 1)."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  29: {
    dayNum: 29,
    dayName: "Day 29 (Monday)",
    badge: "Sliding Window Hard & Mongoose CRUD Queries",
    dsa: "Step 10: Sliding Window (Hard Level Patterns)",
    dsaDesc: "Longest Repeating Character Replacement (Max frequency in window), Binary Subarrays with Given Sum (Prefix sum / Sliding window trick: atMost(K) - atMost(K-1)), Minimum Window Substring.",
    dsaLevel: "Step 10: Window Hard",
    coreProblem: "Minimum Window Substring (Sliding Window Frequency Map)",
    optionalProblem: "Longest Repeating Character Replacement",
    dsaProblems: ["Minimum Window Substring", "Longest Repeating Character Replacement"],
    mern: "Mongoose CRUD, Pagination & Sorting Architecture",
    mernDesc: "CRUD queries (find, findOne, findByIdAndUpdate, deleteOne), Query projection, Sorting, Implementing cursor-based & offset-based pagination (skip & limit) in API endpoints.",
    mernLevel: "Phase 4: MongoDB",
    interviewTips: [
      "Minimum Window Substring: Map stores target character frequencies. Expand right until window contains all required chars; contract left to minimize window while preserving validity.",
      "Offset pagination (skip and limit) becomes slow on large collections (O(N) scan). Keyset/Cursor pagination using _id > last_id is O(1) indexed lookup.",
      "atMost(k) - atMost(k - 1) is an elite sliding window trick to solve problems asking for exact count equal to K."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  30: {
    dayNum: 30,
    dayName: "Day 30 (Tuesday)",
    badge: "Heaps & Priority Queues + Schema Relationships",
    dsa: "Step 11: Heaps / Priority Queues (Foundations & Kth Elements)",
    dsaDesc: "Min Heap and Max Heap binary tree representation, Heapify algorithm (O(N)), Kth Largest Element in an Array (Min Heap of size K), Sort a K-Sorted Array, Task Scheduler.",
    dsaLevel: "Step 11: Heaps",
    coreProblem: "Kth Largest Element in an Array (Min Heap of Size K in O(N log K))",
    optionalProblem: "Sort a Nearly Sorted / K-Sorted Array using Min Heap",
    dsaProblems: ["Kth Largest Element in an Array", "Sort K-Sorted Array"],
    mern: "MongoDB Schema Relationships: Embedding vs Referencing",
    mernDesc: "Data Modeling: Embedding (1-to-few, fast read performance) vs Referencing (1-to-many / many-to-many, normalized data), Mongoose populate() and ObjectId references.",
    mernLevel: "Phase 4: MongoDB",
    interviewTips: [
      "Kth Largest Element: Use a Min Heap of size K. For each element, push to heap. If heap size > K, pop minimum. Top of heap is Kth largest in O(N log K) time.",
      "When to Embed vs Reference in MongoDB: Embed if data is bounded and frequently queried together (e.g. shipping address in user). Reference if data grows unbounded (e.g. order history, comments).",
      "Building a heap from array takes O(N) time with bottom-up heapify, NOT O(N log N)."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  31: {
    dayNum: 31,
    dayName: "Day 31 (Wednesday)",
    badge: "Heaps Hard & Mongoose Virtuals / Hooks",
    dsa: "Step 11: Heaps (Hard: Median of Stream & Merge K Lists)",
    dsaDesc: "Merge K Sorted Lists (Min Heap containing head nodes of all K lists), Find Median from Data Stream (Two Heaps pattern: Max Heap for smaller half, Min Heap for larger half).",
    dsaLevel: "Step 11: Heaps Hard",
    coreProblem: "Find Median from Data Stream (Two Heaps: Min & Max Heap)",
    optionalProblem: "Merge K Sorted Lists (Min Heap of Size K)",
    dsaProblems: ["Find Median from Data Stream (Two Heaps)", "Merge K Sorted Lists"],
    mern: "Mongoose Advanced: Virtuals, Custom Methods & Pre/Post Hooks",
    mernDesc: "Schema Virtuals (computed properties not stored in DB), Custom Schema methods and Statics, Pre/Post Middleware hooks (pre('save') for auto-hashing passwords, pre('remove') for cascading).",
    mernLevel: "Phase 4: MongoDB",
    interviewTips: [
      "Find Median from Stream: Maintain maxHeap for left half and minHeap for right half. Sizes differ by at most 1. If sizes equal, median is average of tops; else top of larger heap in O(1).",
      "Mongoose pre('save') middleware hooks are ideal for hashing passwords before saving to MongoDB, keeping controller code clean and decoupled.",
      "Merge K Sorted Lists: Min Heap of size K stores the heads. Extract min, add to merged list, and push next node of extracted list in O(N log K) time."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  32: {
    dayNum: 32,
    dayName: "Day 32 (Thursday)",
    badge: "Binary Trees Basics & MongoDB Indexing",
    dsa: "Step 13.1: Binary Trees (Traversals: Recursive & Iterative)",
    dsaDesc: "Binary Tree node representations, Preorder, Inorder, and Postorder Traversals (Both Recursive and Iterative using Stacks), Level Order Traversal (BFS using Queue).",
    dsaLevel: "Step 13: Binary Trees",
    coreProblem: "Inorder Traversal & Level Order Traversal (BFS using Queue)",
    optionalProblem: "Preorder & Postorder Traversals",
    dsaProblems: ["Inorder Traversal & Level Order BFS", "Preorder Traversal (Iterative)"],
    mern: "MongoDB Indexing Architecture & Query Performance",
    mernDesc: "Why unindexed queries cause full collection COLLSCAN, Single Field Indexes, Compound Indexes (Equality, Sort, Range - ESR rule), Unique Indexes, TTL Indexes, Analyzing queries with explain('executionStats').",
    mernLevel: "Phase 4: Performance",
    interviewTips: [
      "Inorder traversal of a Binary Search Tree (BST) always produces values in strictly sorted ascending order.",
      "ESR Rule for MongoDB compound indexes: Equality fields first, followed by Sort fields, followed by Range filter fields for optimal index usage.",
      "Level Order Traversal uses a Queue: push root, while queue is not empty, pop current, record value, and push left and right children."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  33: {
    dayNum: 33,
    dayName: "Day 33 (Friday)",
    badge: "Binary Trees Properties & Aggregation Pipeline",
    dsa: "Step 13.2: Binary Trees (Height, Diameter & Balanced)",
    dsaDesc: "Maximum Depth / Height of Binary Tree, Check if Binary Tree is Height-Balanced (O(N) bottom-up check), Diameter of Binary Tree (Longest path between any two nodes), Maximum Path Sum.",
    dsaLevel: "Step 13: Tree Properties",
    coreProblem: "Maximum Depth / Height & Diameter of Binary Tree (Bottom-Up O(N))",
    optionalProblem: "Check if Binary Tree is Height-Balanced",
    dsaProblems: ["Height & Diameter of Binary Tree", "Balanced Binary Tree Check"],
    mern: "MongoDB Aggregation Pipeline: Foundations",
    mernDesc: "Aggregation Pipeline architecture: $match (filtering documents early), $project (reshaping fields), $group (accumulators: $sum, $avg, $min, $max, $push), $sort, $limit.",
    mernLevel: "Phase 4: Aggregations",
    interviewTips: [
      "Diameter of Binary Tree: Maximum value of (left_height + right_height) across all nodes. Compute bottom-up during height calculation to avoid O(N^2) time.",
      "$match should always be placed as early as possible in the aggregation pipeline to filter documents using indexes and reduce RAM usage.",
      "Balanced Binary Tree check: return -1 immediately if left or right subtree is unbalanced or abs(left - right) > 1, running in single O(N) pass."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  34: {
    dayNum: 34,
    dayName: "Day 34 (Saturday)",
    badge: "Binary Trees Views & Advanced Aggregations ($lookup)",
    dsa: "Step 13.2: Binary Trees (Views & Boundary Traversals)",
    dsaDesc: "Boundary Traversal of Binary Tree (Anti-clockwise: Left boundary, Leaf nodes, Right boundary), Zig-Zag / Spiral Level Order Traversal, Top View of Binary Tree, Bottom View of Binary Tree (Vertical line hashing).",
    dsaLevel: "Step 13: Tree Views",
    coreProblem: "Top View of Binary Tree (Vertical Line Coordinates & BFS)",
    optionalProblem: "Zig-Zag Spiral Level Order Traversal",
    dsaProblems: ["Top View of Binary Tree (BFS Coordinate Map)", "Zig-Zag Spiral Traversal"],
    mern: "Advanced Aggregation: $lookup, $unwind & $facet",
    mernDesc: "Joining collections with $lookup (foreignField, localField, as), Flattening arrays with $unwind, Multi-faceted pipelines with $facet (e.g. returning paginated results and total count in single query).",
    mernLevel: "Phase 4: Aggregations",
    interviewTips: [
      "Top View of Binary Tree: Map horizontal distance (root = 0, left = -1, right = +1) using Level Order Traversal (BFS). Keep only the FIRST node seen at each horizontal distance.",
      "$lookup performs an inner/left-outer join in MongoDB. For high performance, ensure the foreignField in the joined collection has an index.",
      "Bottom View: Overwrite the horizontal distance map with every node seen in level order; the last node recorded is the bottom view."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  35: {
    dayNum: 35,
    dayName: "Day 35 (Sunday)",
    badge: "Binary Trees Hard (LCA) & Password Security (Bcrypt)",
    dsa: "Step 13.3: Binary Trees (LCA, Children Sum & Burn Tree)",
    dsaDesc: "Lowest Common Ancestor (LCA) in Binary Tree, Check for Children Sum Property, Nodes at Distance K in Binary Tree (Graph representation with parent pointers), Minimum Time to Burn Binary Tree.",
    dsaLevel: "Step 13: Tree Hard",
    coreProblem: "Lowest Common Ancestor (LCA) in Binary Tree",
    optionalProblem: "All Nodes Distance K in Binary Tree",
    dsaProblems: ["Lowest Common Ancestor (LCA)", "Nodes at Distance K"],
    mern: "Authentication Foundations: Password Hashing with Bcrypt",
    mernDesc: "Why plaintext passwords in DB are illegal/unsafe, Cryptographic salting and hashing with bcryptjs (Salt rounds, Work factor, Slow hashing to prevent brute force & rainbow tables).",
    mernLevel: "Phase 5: Auth & Security",
    interviewTips: [
      "LCA in Binary Tree: If root matches p or q, return root. Recurse left and right. If both return non-null, root is LCA. If one returns non-null, pass it up.",
      "Salt vs Pepper: Salt is a random string generated per user stored with the hash in the DB; Pepper is a global secret key stored outside the DB in environment variables.",
      "Bcrypt work factor (cost): Exponentially increases computational time (2^cost iterations) to make GPU/ASIC brute-force attacks infeasible."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  36: {
    dayNum: 36,
    dayName: "Day 36 (Monday)",
    badge: "Binary Search Trees (BST) & JWT Architecture",
    dsa: "Step 14: Binary Search Trees (Foundations & Validations)",
    dsaDesc: "Binary Search Tree properties (left < root < right), Search in BST (O(H) logarithmic), Insert a Node in BST, Delete a Node in BST, Validate BST (Pass min and max allowable range), Kth Smallest/Largest in BST.",
    dsaLevel: "Step 14: BST",
    coreProblem: "Validate Binary Search Tree (Passing Min & Max Allowable Bounds)",
    optionalProblem: "Search & Insert Node in Binary Search Tree",
    dsaProblems: ["Validate Binary Search Tree", "Search & Insert in BST"],
    mern: "JWT (JSON Web Token) Architecture: Access & Refresh Tokens",
    mernDesc: "JWT Structure: Header.Payload.Signature, Signing tokens with HMAC SHA256, Access Token (15-min short lived) vs Refresh Token (7-day long lived), Storing refresh tokens in httpOnly secure cookies.",
    mernLevel: "Phase 5: Auth & Security",
    interviewTips: [
      "Validate BST trap: Checking if left < root and right > root is NOT enough! Must validate that all nodes in left subtree are < root and all nodes in right subtree are > root using (minVal, maxVal) bounds.",
      "Never store sensitive authentication JWTs in localStorage (vulnerable to XSS attacks). Store refresh tokens in httpOnly, Secure, SameSite=Strict cookies.",
      "Kth smallest in BST: Inorder traversal visits nodes in ascending sorted order. Stop traversal when count reaches K."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  37: {
    dayNum: 37,
    dayName: "Day 37 (Tuesday)",
    badge: "BST Advanced & Role-Based Access Control (RBAC)",
    dsa: "Step 14: BST Advanced (LCA, Successor & Construction)",
    dsaDesc: "Lowest Common Ancestor in BST (Use BST property to branch without searching whole tree), Construct BST from Preorder Traversal, Inorder Successor/Predecessor in BST, Two Sum IV in BST.",
    dsaLevel: "Step 14: BST Advanced",
    coreProblem: "Lowest Common Ancestor (LCA) in BST (O(H) using BST Split Property)",
    optionalProblem: "Inorder Successor in BST",
    dsaProblems: ["LCA in Binary Search Tree", "Inorder Successor in BST"],
    mern: "Authorization & Role-Based Access Control (RBAC)",
    mernDesc: "Building protect auth middleware (Verifying Bearer token), restrictTo('admin', 'moderator') authorization middleware, Managing user roles and permissions in Mongoose models.",
    mernLevel: "Phase 5: Auth & Security",
    interviewTips: [
      "LCA in BST: If both p and q are smaller than root, LCA is in left subtree. If both are larger, LCA is in right subtree. First split point is the LCA.",
      "Authentication validates who you are (Identity); Authorization validates what you are allowed to do (Permissions/Roles).",
      "Inorder Successor in BST: If node has right subtree, successor is minimum in right subtree; otherwise, successor is lowest ancestor whose left subtree contains node."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  38: {
    dayNum: 38,
    dayName: "Day 38 (Wednesday)",
    badge: "Graphs BFS/DFS & Backend Security Hardening",
    dsa: "Step 15.1–15.2: Graphs (Representations & Traversals)",
    dsaDesc: "Graph representations: Adjacency Matrix vs Adjacency List (Vector of lists), Breadth First Search (BFS using Queue and Visited array), Depth First Search (DFS using Recursion), Number of Provinces / Connected Components.",
    dsaLevel: "Step 15: Graphs",
    coreProblem: "Breadth First Search (BFS) & Depth First Search (DFS) on Adjacency List",
    optionalProblem: "Number of Provinces (Connected Components in Graph)",
    dsaProblems: ["BFS & DFS on Adjacency List", "Number of Provinces"],
    mern: "Backend Security Hardening: OWASP Top 10 Protections",
    mernDesc: "Protecting Express APIs against OWASP vulnerabilities: Helmet (secure HTTP headers), CORS origin whitelisting, express-rate-limit (DDoS/Brute force defense), express-mongo-sanitize (NoSQL Injection).",
    mernLevel: "Phase 5: Security",
    interviewTips: [
      "BFS visits level-by-level using a Queue; DFS explores as deep as possible along each branch before backtracking using a Call Stack/Recursion.",
      "Adjacency List uses O(V + E) space, compared to Adjacency Matrix which uses O(V^2) space, making Adjacency List optimal for sparse real-world graphs.",
      "Rate limiting prevents brute force dictionary attacks on login routes by tracking client IP requests in a fixed time window."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  39: {
    dayNum: 39,
    dayName: "Day 39 (Thursday)",
    badge: "Graph Cycle Detection & File Uploads (Multer/S3)",
    dsa: "Step 15.2: Graph Cycle Detection (Directed & Undirected)",
    dsaDesc: "Detect Cycle in Undirected Graph (BFS with {node, parent} queue & DFS), Detect Cycle in Directed Graph (DFS with pathVisited array / recursion stack tracking), Number of Islands (2D Grid BFS/DFS).",
    dsaLevel: "Step 15: Graph Cycles",
    coreProblem: "Number of Islands in 2D Binary Grid (Connected Component BFS/DFS)",
    optionalProblem: "Detect Cycle in an Undirected Graph (BFS with Parent Tracking)",
    dsaProblems: ["Number of Islands in 2D Grid", "Detect Cycle in Undirected Graph"],
    mern: "File Upload Pipelines: Multer & Cloudinary / AWS S3",
    mernDesc: "Handling multipart/form-data with Multer middleware, MemoryStorage vs DiskStorage, Validating file types and file sizes, Uploading images to Cloudinary / AWS S3 and saving secure URLs to MongoDB.",
    mernLevel: "Phase 6: Production",
    interviewTips: [
      "Detect cycle in Directed Graph: An undirected cycle check fails! A directed graph has a cycle only if a node is visited that is ALREADY on the current recursion path (pathVisited[node] is true).",
      "Rotting Oranges is a classic Multi-source BFS: initialize queue with all rotten oranges at time 0. Process level by level to find minimum minutes.",
      "Never store uploaded binary images directly inside MongoDB documents (BSON 16MB document limit and sluggish memory). Store in S3 bucket and save URL in DB."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  40: {
    dayNum: 40,
    dayName: "Day 40 (Friday)",
    badge: "Topological Sort & In-Memory Caching (Redis)",
    dsa: "Step 15.3: Topological Sorting & DAGs (Kahn's Algorithm)",
    dsaDesc: "Topological Sort in Directed Acyclic Graph (DAG) using DFS, Kahn's Algorithm (BFS using in-degree array), Course Schedule I & II (Cycle detection in DAG via Topological Sort).",
    dsaLevel: "Step 15: Topo Sort",
    coreProblem: "Topological Sort using Kahn's Algorithm (BFS with In-Degree Array)",
    optionalProblem: "Course Schedule I (Detect Cycle in DAG via Prerequisites)",
    dsaProblems: ["Kahn's Algorithm (BFS Topo Sort)", "Course Schedule I"],
    mern: "High-Performance Caching with Redis",
    mernDesc: "In-memory caching with Redis, Connecting Node.js to Redis server, Cache-Aside pattern (Check cache $\\rightarrow$ if miss, query DB $\\rightarrow$ write to cache with TTL expiration), Cache invalidation on updates.",
    mernLevel: "Phase 6: Redis Cache",
    interviewTips: [
      "Topological Sorting is a linear ordering of vertices such that for every directed edge u -> v, vertex u comes before v. Only exists for Directed Acyclic Graphs (DAG).",
      "Kahn's Algorithm: Compute in-degree for all nodes. Push all in-degree 0 nodes to queue. Pop node, add to topo sort, reduce in-degree of neighbors. If in-degree becomes 0, push to queue.",
      "Cache-Aside pattern drastically lowers DB query latency from 80ms to 2ms for read-heavy routes (e.g. product catalogs, user profiles)."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  41: {
    dayNum: 41,
    dayName: "Day 41 (Saturday)",
    badge: "Shortest Path (Dijkstra) & Real-Time WebSockets",
    dsa: "Step 15.4: Shortest Path Algorithms (Dijkstra's Algorithm)",
    dsaDesc: "Shortest Path in Undirected Graph with Unit Weights (BFS), Shortest Path in DAG (Topological Sort + Relaxation), Dijkstra's Algorithm (Priority Queue / Min Heap for non-negative weighted graphs in O(E log V)).",
    dsaLevel: "Step 15: Dijkstra",
    coreProblem: "Dijkstra's Algorithm using Min Heap Priority Queue (O(E log V))",
    optionalProblem: "Shortest Path in Undirected Graph with Unit Weights (BFS)",
    dsaProblems: ["Dijkstra's Algorithm (Priority Queue)", "Shortest Path in Undirected Graph (BFS)"],
    mern: "Real-Time WebSockets with Socket.io & Express",
    mernDesc: "HTTP Polling vs Server-Sent Events (SSE) vs Full-Duplex WebSockets, Integrating Socket.io with Express HTTP server, Rooms, Namespaces, Broadcasting events, Building real-time chat/notification features.",
    mernLevel: "Phase 6: WebSockets",
    interviewTips: [
      "Dijkstra's Algorithm uses a Priority Queue (Min Heap) storing {dist, node}. Relaxes edge if dist[u] + weight < dist[v]. Does NOT work with negative weight edges (leads to infinite cycles).",
      "WebSockets maintain a persistent, bidirectional, full-duplex TCP connection established via an HTTP Upgrade handshake header.",
      "Shortest path in DAG runs in O(V + E) time using Topological Sort, which is faster than Dijkstra's O(E log V)."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  42: {
    dayNum: 42,
    dayName: "Day 42 (Sunday)",
    badge: "Dynamic Programming Foundations & Next.js SSR",
    dsa: "Step 16.1–16.2: Dynamic Programming (Foundations & 1D DP)",
    dsaDesc: "Introduction to Dynamic Programming: Overlapping Subproblems & Optimal Substructure, Top-Down (Memoization) vs Bottom-Up (Tabulation), Climbing Stairs, Frog Jump with K steps, House Robber I & II (Circular houses).",
    dsaLevel: "Step 16: DP 1D",
    coreProblem: "House Robber I (Non-Adjacent Maximum Sum DP: Memoization & Tabulation)",
    optionalProblem: "Climbing Stairs (Fibonacci DP)",
    dsaProblems: ["House Robber I (1D DP)", "Climbing Stairs (Fibonacci DP)"],
    mern: "Next.js & Full-Stack React Architecture",
    mernDesc: "Client-Side Rendering (CSR) vs Server-Side Rendering (SSR) vs Static Site Generation (SSG), Next.js App Router, React Server Components (RSC) vs Client Components ('use client'), Server Actions.",
    mernLevel: "Phase 6: Next.js",
    interviewTips: [
      "When to use DP: 1. Count total number of ways. 2. Find minimum or maximum value under constraints. 3. Problem exhibits overlapping subproblems and optimal substructure.",
      "House Robber II: Since houses are arranged in a circle, house 1 and house N are neighbors. Run House Robber I twice: once excluding house 1, and once excluding house N. Return max.",
      "Server Components in Next.js execute only on the server, resulting in 0 KB JavaScript bundle sent to the client and direct backend database access."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  43: {
    dayNum: 43,
    dayName: "Day 43 (Monday)",
    badge: "Grid DP, 0/1 Knapsack & Docker Architecture",
    dsa: "Step 16.3–16.4: DP on Grids & Subsequences (Knapsack)",
    dsaDesc: "Grid DP: Unique Paths (Grid combinatorics / DP), Minimum Path Sum in Grid, Subset Sum Equal to Target, Partition Equal Subset Sum, 0/1 Knapsack Problem, Coin Change (Minimum coins).",
    dsaLevel: "Step 16: DP Knapsack",
    coreProblem: "0/1 Knapsack Problem (Subsequence Pick / Non-Pick with Capacity)",
    optionalProblem: "Coin Change (Minimum Coins to Make Target Amount)",
    dsaProblems: ["0/1 Knapsack Problem", "Coin Change (Minimum Coins)"],
    mern: "Docker Containerization & CI/CD Pipelines",
    mernDesc: "Containerization concepts (Images vs Containers), Writing production multi-stage Dockerfiles for React & Node.js, docker-compose for spinning up Express + MongoDB + Redis locally, GitHub Actions CI workflow.",
    mernLevel: "Phase 6: DevOps",
    interviewTips: [
      "0/1 Knapsack: dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w - wt[i]]). Space can be optimized to 1D array by traversing capacity w backwards from W down to wt[i].",
      "Multi-stage Docker builds compile frontend/backend code in a builder image and copy only the production bundle into a lightweight Alpine image, keeping image sizes small (<100MB).",
      "Coin Change: If amount == 0 return 0. dp[i] = min(dp[i], 1 + dp[i - coin]) for all coins."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  44: {
    dayNum: 44,
    dayName: "Day 44 (Tuesday)",
    badge: "DP on Strings/Stocks & System Design (MERN)",
    dsa: "Step 16.5–16.7: DP on Strings & Stock Trading",
    dsaDesc: "Longest Common Subsequence (LCS: Striver Classic), Longest Palindromic Subsequence, Edit Distance (Insert, Delete, Replace in O(M*N)), Best Time to Buy and Sell Stock III & IV (At most K transactions).",
    dsaLevel: "Step 16: DP Strings",
    coreProblem: "Longest Common Subsequence - LCS (2D Matrix Subproblems in O(M*N))",
    optionalProblem: "Edit Distance (Levenshtein Distance)",
    dsaProblems: ["Longest Common Subsequence (LCS)", "Edit Distance"],
    mern: "System Design for Senior MERN Developers",
    mernDesc: "High-Level Architecture: Designing a Scalable URL Shortener (TinyURL) or E-Commerce Flash Sale System, Load Balancing, Horizontal Scaling, Database Sharding, Read Replicas, CAP Theorem, CDN caching.",
    mernLevel: "Phase 7: System Design",
    interviewTips: [
      "Longest Common Subsequence: If s1[i] == s2[j], 1 + LCS(i-1, j-1); else max(LCS(i-1, j), LCS(i, j-1)). Space optimizes to 2 rows.",
      "CAP Theorem: In a distributed system, you can only guarantee two out of Consistency, Availability, and Partition Tolerance. In real-world networks with partitions (P), you choose CP or AP.",
      "Edit Distance: If characters match, dp[i-1][j-1]; else 1 + min(Insert: dp[i][j-1], Delete: dp[i-1][j], Replace: dp[i-1][j-1])."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  },
  45: {
    dayNum: 45,
    dayName: "Day 45 (Wednesday)",
    badge: "Comprehensive Interview Mock & Capstone Defense",
    dsa: "Comprehensive DSA Mock Interview: Top 5 LeetCode Patterns",
    dsaDesc: "Simulated 45-min technical coding round: Two Pointers, Monotonic Stack, Binary Search on Answers, Tree LCA, and 1D/Knapsack DP. Explaining Big-O Time & Space complexity aloud.",
    dsaLevel: "Step 16: Interview Ready",
    coreProblem: "Two Sum & Kadane's Algorithm (Rapid Mock Interview Simulation)",
    optionalProblem: "Koko Bananas or Book Allocation (Binary Search Defense)",
    dsaProblems: ["Two Sum & Kadane's Rapid Mock", "Binary Search Defense"],
    mern: "Senior Full-Stack MERN Architecture & STAR Defense",
    mernDesc: "Full-Stack Project Architecture Review, Defending technical decisions (Why Mongo over SQL, Why Redis, JWT security, State management), Live coding an end-to-end authenticated CRUD API.",
    mernLevel: "Phase 7: Senior Defense",
    interviewTips: [
      "Use the STAR method (Situation, Task, Action, Result) for behavioral questions: quantify results (e.g. 'reduced latency by 45%', 'handled 5,000 req/sec').",
      "During coding interviews: Clarify requirements -> Discuss brute force + complexity -> Optimize approach -> Write clean modular code -> Dry-run test cases -> State Time/Space complexity.",
      "Confidence, communication, and clear reasoning under pressure are what get you the senior software engineer offer."
    ],
    genaiNote: "📹 Video Learning Slot: Watch GenAI / tech architectural video at your own pace."
  }
};
