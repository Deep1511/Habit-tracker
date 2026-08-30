const RENDER_API = "https://habit-tracker-n269.onrender.com/api";
const LOCAL_API = "/api";

// Use local proxy if on localhost, otherwise Render remote API
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const PRIMARY_API = isLocalhost ? LOCAL_API : RENDER_API;
const FALLBACK_API = isLocalhost ? RENDER_API : LOCAL_API;

// ── Local Storage Cache Helpers ──

export function getLocalCache(key, fallback = null) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(`ht_cache_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function setLocalCache(key, data) {
  if (typeof window === "undefined" || data === undefined) return;
  try {
    localStorage.setItem(`ht_cache_${key}`, JSON.stringify(data));
  } catch (e) {}
}

// ── Smart Request Helper with Auto-Fallback & Caching ──

async function request(endpoint, options = {}, cacheKey = null) {
  const isGet = !options.method || options.method === "GET";

  // Try primary API first with a reasonable timeout
  const makeFetch = async (baseUrl, timeoutMs = 8000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Server ${res.status}: ${text || res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  };

  try {
    const data = await makeFetch(PRIMARY_API, 6000);
    if (isGet && cacheKey) setLocalCache(cacheKey, data);
    return data;
  } catch (primaryErr) {
    // If primary failed (e.g. local server not running or render cold start), try fallback API
    try {
      const fallbackData = await makeFetch(FALLBACK_API, 15000);
      if (isGet && cacheKey) setLocalCache(cacheKey, fallbackData);
      return fallbackData;
    } catch (fallbackErr) {
      // If network completely failed but we have local cache for GET, return cache
      if (isGet && cacheKey) {
        const cached = getLocalCache(cacheKey);
        if (cached) {
          console.warn(`Using cached data for ${endpoint} due to network error`);
          return cached;
        }
      }
      throw primaryErr;
    }
  }
}

// ── Settings ─────────────────────────────────────────────────

export async function getSettings() {
  return request("/settings", {}, "settings");
}

export async function updateSettings(data) {
  setLocalCache("settings", data);
  return request("/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ── Habits ───────────────────────────────────────────────────

export async function getMonthHabits(monthStr) {
  return request(`/habits?month=${monthStr}`, {}, `habits_${monthStr}`);
}

export async function upsertDay(dateStr, data) {
  const monthKey = dateStr.slice(0, 7);
  const currentMonthCache = getLocalCache(`habits_${monthKey}`, []);
  const existingIdx = currentMonthCache.findIndex((x) => x.date === dateStr);
  const updatedMonth = [...currentMonthCache];
  if (existingIdx >= 0) {
    updatedMonth[existingIdx] = { ...data, date: dateStr };
  } else {
    updatedMonth.push({ ...data, date: dateStr });
  }
  setLocalCache(`habits_${monthKey}`, updatedMonth);

  return request(`/habits/${dateStr}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function resetAllHabits() {
  if (typeof window !== "undefined") {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("ht_cache_habits_"))
      .forEach((k) => localStorage.removeItem(k));
  }
  return request("/habits", { method: "DELETE" });
}

// ── Stats ────────────────────────────────────────────────────

export async function getStreaks() {
  return request("/stats/streaks", {}, "streaks");
}

export async function getMernTotal() {
  return request("/stats/mern-total", {}, "mern_total");
}

export async function getCraftTotal() {
  return request("/stats/craft-total", {}, "mern_total");
}

// ── Government Exam Tracker ──────────────────────────────────

export async function getExamTracker() {
  return request("/exam-tracker", {}, "exam_tracker");
}

export async function updateExamTracker(subjects) {
  setLocalCache("exam_tracker", { key: "main", subjects });
  return request("/exam-tracker", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subjects }),
  });
}

// ── MERN & DSA Interview Tracker ─────────────────────────────

export async function getMernTracker() {
  return request("/mern-tracker", {}, "mern_tracker");
}

export async function updateMernTracker(subjects) {
  setLocalCache("mern_tracker", { key: "main", subjects });
  return request("/mern-tracker", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subjects }),
  });
}
