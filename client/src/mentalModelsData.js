// ── Mental Models, Real-World Analogies & Anti-Boredom Hacks ──

export const MERN_ANALOGIES = [
  {
    id: "closure",
    category: "JavaScript",
    topic: "Closures & Lexical Scope",
    difficulty: "Core Interview",
    icon: "fa-bag-shopping",
    color: "indigo",
    textbookDef: "A closure is the combination of a function bundled together with references to its surrounding state (lexical environment).",
    analogy: "A Function Carrying a Backpack of Memories 🎒",
    explanation: "When a function is born inside another function, it packs a small backpack containing all the variables from its parent. Even if the parent function finishes and dies, the child function still walks around with that backpack forever.",
    codeSnippet: `function createCounter() {
  let count = 0; // Packed into backpack
  return () => ++count; // Child walks around with 'count'
}
const count = createCounter();
console.log(count()); // 1
console.log(count()); // 2`,
    takeaway: "In your notebook: Just draw a small person with a backpack holding variables.",
  },
  {
    id: "eventloop",
    category: "JavaScript",
    topic: "Event Loop, Microtasks & Macrotasks",
    difficulty: "Core Interview",
    icon: "fa-traffic-light",
    color: "amber",
    textbookDef: "The Event Loop continuously monitors the Call Stack and moves tasks from the Microtask Queue and Callback Queue when the stack is empty.",
    analogy: "A VIP Club Bouncer with a Fast-Track Queue 🚦",
    explanation: "The JavaScript Call Stack is the single bartender serving drinks. When asynchronous tasks finish, they wait outside: Promises (Microtasks) have a VIP pass and ALWAYS cut in front of normal guests (setTimeout / Macrotasks). The bouncer (Event Loop) only lets the next person in when the bartender is free.",
    codeSnippet: `console.log("1. Regular guest");
setTimeout(() => console.log("4. Normal queue (Macrotask)"), 0);
Promise.resolve().then(() => console.log("3. VIP queue (Microtask)"));
console.log("2. Regular guest");
// Output order: 1 -> 2 -> 3 -> 4`,
    takeaway: "In your notebook: Draw VIP line (Promises) cutting in front of Normal line (setTimeout).",
  },
  {
    id: "props_state",
    category: "React.js",
    topic: "Props vs State",
    difficulty: "Basics",
    icon: "fa-kitchen-set",
    color: "teal",
    textbookDef: "Props are immutable parameters passed down from parent components, whereas State is mutable local memory managed within a component.",
    analogy: "Mom's Ingredients (Props) vs Cooking in the Pot (State) 🍲",
    explanation: "Props are like the raw vegetables and spices your mom handed you—you cannot change where they came from or complain. State is the temperature and recipe you cook inside your own pot—you can turn the heat up or down anytime with useState().",
    codeSnippet: `function Kitchen({ spiceProps }) {
  // spiceProps is read-only (from mom)
  const [temperature, setTemperature] = useState(100); // My own pot
  return <button onClick={() => setTemperature(t => t + 10)}>Heat</button>;
}`,
    takeaway: "In your notebook: Props = Incoming parcel. State = What you do inside your room.",
  },
  {
    id: "virtual_dom",
    category: "React.js",
    topic: "Virtual DOM & Reconciliation",
    difficulty: "Core Interview",
    icon: "fa-blueprint",
    color: "cyan",
    textbookDef: "React creates a lightweight in-memory tree copy of the DOM, compares it with the previous snapshot using a diffing algorithm, and patches only the changed nodes.",
    analogy: "The Architect's Blueprint vs Expensive Bricklayers 🏗️",
    explanation: "Rebuilding a real brick wall (Real DOM) every time you change 1 lightbulb is super slow and expensive. Instead, React draws a cheap paper blueprint (Virtual DOM). When you make a change, it draws a 2nd blueprint, compares the two with a highlighter, and tells the real bricklayers: 'Hey, only replace that single brick at row 3!'.",
    codeSnippet: `// React diffs in memory (super fast):
<h1 className="red">Hello World</h1>
// Only updates the className attribute in the real browser!`,
    takeaway: "In your notebook: Blueprint comparison is 100x faster than tearing down real walls.",
  },
  {
    id: "jwt",
    category: "Node.js & Auth",
    topic: "JWT (JSON Web Token) Authentication",
    difficulty: "Backend Core",
    icon: "fa-ticket",
    color: "emerald",
    textbookDef: "A compact, URL-safe means of representing claims to be transferred between two parties, cryptographically signed with a secret or public/private key.",
    analogy: "The Stamped Waterpark Wristband 🎟️",
    explanation: "Instead of the security guard checking your government ID and searching a 10,000-person ledger every time you ride a waterslide, the entrance booth gives you a waterproof signed wristband (JWT). Any ride operator can look at the signature stamp and immediately know: 'Yes, this is valid, go right in!'.",
    codeSnippet: `// Header.Payload.Signature
// Server signs it once with JWT_SECRET:
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);`,
    takeaway: "In your notebook: Wristband = Server doesn't need to query database on every single API request.",
  },
  {
    id: "libuv",
    category: "Node.js & Express",
    topic: "Node.js Event Loop & Libuv Thread Pool",
    difficulty: "Advanced Core",
    icon: "fa-utensils",
    color: "purple",
    textbookDef: "Node.js runs single-threaded JavaScript execution on the main V8 thread but offloads heavy I/O and CPU operations to a C++ Libuv worker thread pool.",
    analogy: "The Master Chef with 4 Kitchen Helpers 👨‍🍳",
    explanation: "The master chef (Single-threaded JS) stands at the order counter greeting customers and taking orders instantly. When someone orders a dish that takes 30 minutes to bake (reading a big file / DB query), the chef hands the baking tray to one of 4 kitchen helpers (Libuv Thread Pool) and immediately greets the next customer. When the cake is baked, the helper rings a bell and the chef delivers it.",
    codeSnippet: `fs.readFile("huge-video.mp4", (err, data) => {
  // Handled by Libuv thread pool in the background!
});`,
    takeaway: "In your notebook: Chef never waits in front of the oven. Chef keeps taking orders.",
  },
  {
    id: "debounce_throttle",
    category: "JavaScript",
    topic: "Debounce vs Throttle",
    difficulty: "Machine Coding",
    icon: "fa-elevator",
    color: "orange",
    textbookDef: "Debouncing enforces that a function is called only after a specified time has elapsed since the last call. Throttling ensures a function is executed at most once in a specified interval.",
    analogy: "The Smart Elevator (Debounce) vs The Public Bus (Throttle) 🛗 🚌",
    explanation: "• Debounce (Elevator): The elevator doors wait 5 seconds. If a new person runs in, the 5-second timer restarts. It ONLY moves when people STOP entering (perfect for search autocomplete).\n• Throttle (Bus): The city bus departs every 15 minutes sharp, regardless of whether 1 person or 50 people are running behind it (perfect for window resize / scroll listeners).",
    codeSnippet: `// Debounce: Wait until user stops typing for 300ms
const handleSearch = debounce(fetchResults, 300);

// Throttle: Fire at most once every 200ms during fast scrolling
const handleScroll = throttle(updateScrollPosition, 200);`,
    takeaway: "In your notebook: Debounce = Wait for silence. Throttle = Regular heartbeat.",
  },
  {
    id: "redux",
    category: "React.js",
    topic: "Redux Toolkit Architecture",
    difficulty: "State Management",
    icon: "fa-building-columns",
    color: "indigo",
    textbookDef: "A predictable state container for JS apps based on unidirectional data flow with Actions, Reducers, and a centralized Store.",
    analogy: "The Bank Vault & Deposit Slip 🏦",
    explanation: "You (Component) cannot walk into the bank vault (Store) and grab money with your bare hands. You must fill out an official deposit slip stating what happened (Action: 'DEPOSIT $50'), hand it to the teller at the counter (Dispatch), who gives it to the verified accountant (Reducer) who updates the central ledger inside the vault.",
    codeSnippet: `// 1. Action: { type: 'cart/addItem', payload: item }
// 2. Dispatch: dispatch(addItem(item))
// 3. Reducer: (state, action) => { state.items.push(action.payload) }
// 4. Store: Single source of truth`,
    takeaway: "In your notebook: Component -> Dispatch -> Action Slip -> Reducer -> Store Vault.",
  },
  {
    id: "db_indexing",
    category: "MongoDB",
    topic: "Database Indexes (B-Trees & Compound Indexes)",
    difficulty: "Database Mastery",
    icon: "fa-book-bookmark",
    color: "emerald",
    textbookDef: "Special data structures that store a small portion of the collection's data set in an easy-to-traverse form (B-Trees) to avoid full collection scans.",
    analogy: "The Index Pages at the Back of a 1,000-Page Textbook 📖",
    explanation: "If you want to find every mention of 'Mahatma Gandhi' in a 1,000-page book without an index, you have to read all 1,000 pages line by line (Full Collection Scan / CollScan). With an alphabetical index at the back (Index Scan / IXScan), you flip directly to letter 'M', see 'pages 42, 189', and open them in 0.01 seconds.",
    codeSnippet: `// Without Index: Scans 1,000,000 documents (SLOW)
// With Index:
UserSchema.index({ email: 1 }); // Instant B-Tree lookup!`,
    takeaway: "In your notebook: Index = Alphabetical shortcut so the server doesn't read every document.",
  },
  {
    id: "promise_async",
    category: "JavaScript",
    topic: "Promises & Async/Await",
    difficulty: "Async JS",
    icon: "fa-bell-concierge",
    color: "teal",
    textbookDef: "A Promise is an object representing the eventual completion or failure of an asynchronous operation and its resulting value.",
    analogy: "The Restaurant Food Buzzer Token 📟",
    explanation: "When you order a burger at Shake Shack, the cashier doesn't freeze your entire day and make you stand motionless at the counter. They hand you a small black buzzer (Promise). You go sit down, chat with your friends, or scroll your phone. When the food is ready, the buzzer vibrates (Resolved / .then() / await) and you grab your tray.",
    codeSnippet: `// Ordering burger (Promise pending)
const getBurger = async () => {
  const burger = await fetchBurgerFromKitchen(); // Buzzer waits in background
  console.log("Nom nom nom!", burger);
};`,
    takeaway: "In your notebook: Promise = Buzzer token. Await = Sit at table until buzzer vibrates.",
  },
];

export const ANTI_LAZINESS_HACKS = [
  {
    id: "rule_15min",
    title: "The 15-Minute 'Low-Friction' Ignition Rule",
    icon: "fa-bolt",
    color: "indigo",
    subtitle: "How to beat the starting friction every single time",
    summary: "Laziness is 90% starting friction and 10% actual work. Tell your brain you will only study for 15 minutes. Once the ignition fires, momentum takes over.",
    steps: [
      "When feeling lazy, NEVER tell yourself: 'I have to study for 3 hours today.'",
      "Instead, tell your brain: 'I will only sit for 15 minutes on 1 small concept.'",
      "Start the built-in 15-minute timer in the Quick Study Logger.",
      "9 times out of 10, once you reach 15 minutes, you will naturally want to keep going!",
    ],
  },
  {
    id: "rule_notebook",
    title: "The 'Half-Page Analogy' Rule (Fix Note-Taking Burnout)",
    icon: "fa-book-open",
    color: "purple",
    subtitle: "Why you should never copy syntax into notebooks",
    summary: "Writing code syntax in a physical notebook is slow, tedious, and triggers subconscious avoidance. Programmers write code in IDEs, not paper.",
    steps: [
      "Never copy entire JavaScript functions or HTML tags by hand.",
      "Limit your notebook to maximum HALF a page per topic.",
      "Write only 3 things: (1) One-line real-world analogy, (2) One small arrow diagram, (3) 2 key interview bullet points.",
      "Put real code examples into VS Code comments or your GitHub repo.",
    ],
  },
  {
    id: "rule_dopamine",
    title: "Dopamine Stacking: Government Exam ➡️ MERN Sprint",
    icon: "fa-layer-group",
    color: "terra",
    subtitle: "Use your easy momentum to crush hard coding topics",
    summary: "Government lectures feel easier to complete (70-80%). Use that easy win to prime your dopamine before tackling technical coding.",
    steps: [
      "Start your morning with 30-45 minutes of a Government Exam lecture or GK quiz.",
      "Completing it gives your brain an immediate feeling of accomplishment (Dopamine hit).",
      "Do NOT leave your desk! Immediately switch the track dropdown to MERN Stack.",
      "Ride the existing work momentum to knock out 1 coding topic while your brain is already hot.",
    ],
  },
  {
    id: "rule_3min_proof",
    title: "The 3-Minute 'Code Proof' Hack",
    icon: "fa-terminal",
    color: "emerald",
    subtitle: "How to make abstract theory feel exciting",
    summary: "Reading theory is boring because it's abstract. Seeing code run in your browser console gives an instant spark of understanding.",
    steps: [
      "Whenever you read a definition (e.g., Array.reduce, Closures, Debounce), don't just stare at it.",
      "Press F12 in Google Chrome to open Developer Tools -> Console.",
      "Type 2 lines of code to test the concept and hit Enter.",
      "Seeing the output in real time triggers the 'Aha!' moment and kills boredom.",
    ],
  },
  {
    id: "rule_no_zero",
    title: "The 'No Zero Days' Golden Rule",
    icon: "fa-shield-halved",
    color: "amber",
    subtitle: "Consistency beats intensity every single time",
    summary: "15 minutes of 1 topic on a lazy day is 100x better than 0 minutes. Keeping the streak alive protects your self-identity.",
    steps: [
      "On your worst, laziest, most exhausted days, do NOT skip completely.",
      "Open the Habit Tracker, click 'Too Lazy? Pick 1 Micro-Topic for Me'.",
      "Read just 1 mental analogy or watch a 5-minute video, then log 15 minutes.",
      "Your streak stays unbroken, you feel proud, and you bounce back stronger tomorrow!",
    ],
  },
];

export const MOTIVATIONAL_SPARKS = [
  {
    quote: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
    context: "Don't wait for the perfect mood or energy level. Just open the logger, pick 1 topic, and do 15 minutes.",
    trackTip: "💻 MERN Tip: Code 1 small function in DevTools right now.",
  },
  {
    quote: "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.",
    author: "John C. Maxwell",
    context: "Even if you only complete 1 topic today, in 60 days that's 60 interview topics mastered!",
    trackTip: "🏛️ Govt Tip: Solve just 5 quantitative aptitude questions.",
  },
  {
    quote: "Action isn't just the effect of motivation; it is also the cause of it.",
    author: "Mark Manson",
    context: "Don't wait until you 'feel like studying'. Start for 3 minutes, and motivation will catch up with you.",
    trackTip: "🎒 Mental Model: A closure is just a function carrying a backpack of memories.",
  },
  {
    quote: "The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks.",
    author: "Mark Twain",
    context: "Don't look at the entire 100-topic syllabus. Look only at the next 15-minute micro-topic.",
    trackTip: "🚦 Mental Model: The Event Loop is just a VIP bouncer letting Promises cut the queue.",
  },
];
