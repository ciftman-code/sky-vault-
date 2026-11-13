let cache = { at: 0, items: null };

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=86400, stale-if-error=604800");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (cache.items && Date.now() - cache.at < 1800000) {
    return res.status(200).json({
      items: cache.items,
      count: cache.items.length,
      cached: true,
      stale: false,
      source: "Hypixel Public API"
    });
  }

  try {
    const upstream = await fetch("https://api.hypixel.net/v2/resources/skyblock/items", {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(12000)
    });
    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok || data.success === false || !Array.isArray(data.items)) {
      throw new Error("Hypixel item resource response was invalid.");
    }

    cache = { at: Date.now(), items: data.items };
    return res.status(200).json({
      items: cache.items,
      count: cache.items.length,
      cached: false,
      stale: false,
      source: "Hypixel Public API"
    });
  } catch {
    if (cache.items) {
      return res.status(200).json({
        items: cache.items,
        count: cache.items.length,
        cached: true,
        stale: true,
        source: "Cached Hypixel Public API data",
        warning: "Live refresh is temporarily unavailable."
      });
    }

    return res.status(502).json({
      error: "Hypixel item resources are temporarily unavailable. Please retry shortly.",
      source: "Hypixel Public API"
    });
  }
}
