import express from "express";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const HYPIXEL_API_KEY = process.env.HYPIXEL_API_KEY;

app.use(express.static("public"));
app.use("/api/", rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: true, legacyHeaders: false }));

const cache = new Map();
const CACHE_MS = 60_000;

async function getJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.cause || data.error || `Upstream request failed (${response.status})`;
    throw new Error(message);
  }
  return data;
}

app.get("/api/skyblock/profile", async (req, res) => {
  try {
    if (!HYPIXEL_API_KEY) return res.status(503).json({ error: "Server is not configured with a Hypixel API key yet." });
    const username = String(req.query.username || "").trim();
    if (!/^[A-Za-z0-9_]{3,16}$/.test(username)) return res.status(400).json({ error: "Enter a valid Minecraft Java username." });

    const cacheKey = username.toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.at < CACHE_MS) return res.json(cached.data);

    // Resolve username to UUID using Mojang's public profile lookup.
    const mojang = await getJson(`https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`);
    if (!mojang.id) return res.status(404).json({ error: "Minecraft player not found." });
    const uuid = mojang.id;

    // Hypixel API key stays on the server and is never sent to the browser.
    const profilesData = await getJson(`https://api.hypixel.net/v2/skyblock/profiles?uuid=${encodeURIComponent(uuid)}`, {
      headers: { "API-Key": HYPIXEL_API_KEY }
    });
    if (!profilesData.success || !Array.isArray(profilesData.profiles) || profilesData.profiles.length === 0) {
      return res.status(404).json({ error: "No SkyBlock profiles were returned. The player may not have a profile or their API settings may limit access." });
    }

    const profile = profilesData.profiles.find(p => p.selected) || profilesData.profiles[0];
    const member = profile.members?.[uuid] || {};
    const result = {
      username: mojang.name || username,
      uuid,
      profileName: profile.cute_name || "SkyBlock",
      profileId: profile.profile_id,
      gameMode: profile.game_mode || "normal",
      profile,
      member
    };
    cache.set(cacheKey, { at: Date.now(), data: result });
    res.json(result);
  } catch (error) {
    const msg = String(error.message || "Unknown error");
    const status = /429|rate/i.test(msg) ? 429 : 502;
    res.status(status).json({ error: status === 429 ? "Hypixel API rate limit reached. Wait a little and try again." : msg });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true, service: "Skyblock Hub API" }));
app.listen(PORT, () => console.log(`Skyblock Hub running on http://localhost:${PORT}`));
