let cache = { at: 0, items: null };

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  if (cache.items && Date.now() - cache.at < 3600000) {
    return res.status(200).json({ items: cache.items, cached: true });
  }
  try {
    const upstream = await fetch("https://api.hypixel.net/v2/resources/skyblock/items");
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok || !Array.isArray(data.items)) {
      return res.status(502).json({ error: "Hypixel item resources are temporarily unavailable." });
    }
    cache = { at: Date.now(), items: data.items };
    return res.status(200).json({ items: data.items, cached: false });
  } catch {
    return res.status(502).json({ error: "Could not connect to Hypixel item resources." });
  }
}
