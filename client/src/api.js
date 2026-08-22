// const API = "/api";
const API = "https://habit-tracker-n269.onrender.com/api";

// ── Request helper ──

async function request(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Server ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

// ── Settings ─────────────────────────────────────────────────

export async function getSettings() {
  return request(`${API}/settings`);
}

export async function updateSettings(data) {
  return request(`${API}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ── Habits ───────────────────────────────────────────────────

export async function getMonthHabits(monthStr) {
  return request(`${API}/habits?month=${monthStr}`);
}

export async function upsertDay(dateStr, data) {
  return request(`${API}/habits/${dateStr}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function resetAllHabits() {
  return request(`${API}/habits`, { method: "DELETE" });
}

// ── Stats ────────────────────────────────────────────────────

export async function getStreaks() {
  return request(`${API}/stats/streaks`);
}

export async function getMernTotal() {
  return request(`${API}/stats/mern-total`);
}

export async function getCraftTotal() {
  return request(`${API}/stats/craft-total`);
}

// ── Government Exam Tracker ──────────────────────────────────

export async function getExamTracker() {
  return request(`${API}/exam-tracker`);
}

export async function updateExamTracker(subjects) {
  return request(`${API}/exam-tracker`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subjects }),
  });
}

// ── MERN & DSA Interview Tracker ─────────────────────────────

export async function getMernTracker() {
  return request(`${API}/mern-tracker`);
}

export async function updateMernTracker(subjects) {
  return request(`${API}/mern-tracker`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subjects }),
  });
}
