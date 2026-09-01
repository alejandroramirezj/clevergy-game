let memLB = [];

// Load local fallback
export function loadLocalLB() {
  try {
    return JSON.parse(localStorage.getItem("retreatLB") || "[]");
  } catch (e) {
    return memLB;
  }
}

export function saveLocalLB(entry) {
  try {
    const list = loadLocalLB();
    list.push(entry);
    list.sort((a, b) => b.score - a.score);
    const trimmed = list.slice(0, 50);
    localStorage.setItem("retreatLB", JSON.stringify(trimmed));
    memLB = trimmed;
    return trimmed;
  } catch (e) {
    return memLB;
  }
}

// Fetch global leaderboard from Cloudflare D1
export async function fetchGlobalLeaderboard() {
  try {
    const res = await fetch("/api/leaderboard", { cache: "no-cache" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const json = await res.json();
    if (json && json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (err) {
    console.warn("Could not fetch remote leaderboard, using local fallback:", err);
  }
  return loadLocalLB();
}

// Submit score to Cloudflare D1
export async function submitScore(entry) {
  saveLocalLB(entry); // always save locally as well
  try {
    const res = await fetch("/api/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const json = await res.json();
    return json;
  } catch (err) {
    console.warn("Could not submit score to Cloudflare D1:", err);
    return { success: false, offline: true };
  }
}
