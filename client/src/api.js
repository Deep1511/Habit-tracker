// const API = "/api";
const API = "https://habit-tracker-n269.onrender.com/api";

// ── Settings ─────────────────────────────────────────────────

export async function getSettings() {
  const res = await fetch(`${API}/settings`);
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

export async function updateSettings(data) {
  const res = await fetch(`${API}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update settings");
  return res.json();
}

// ── Habits ───────────────────────────────────────────────────

export async function getMonthHabits(monthStr) {
  const res = await fetch(`${API}/habits?month=${monthStr}`);
  if (!res.ok) throw new Error("Failed to fetch habits");
  return res.json();
}

export async function upsertDay(dateStr, data) {
  const res = await fetch(`${API}/habits/${dateStr}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save day");
  return res.json();
}

export async function resetAllHabits() {
  const res = await fetch(`${API}/habits`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to reset");
  return res.json();
}

// ── Stats ────────────────────────────────────────────────────

export async function getStreaks() {
  const res = await fetch(`${API}/stats/streaks`);
  if (!res.ok) throw new Error("Failed to fetch streaks");
  return res.json();
}

export async function getCraftTotal() {
  const res = await fetch(`${API}/stats/craft-total`);
  if (!res.ok) throw new Error("Failed to fetch craft total");
  return res.json();
}
