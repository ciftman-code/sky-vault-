let cache = { at: 0, products: null, updatedAt: 0 };

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=30");
  if (cache.products && Date.now() - cache.at < 30000) {
    return res.status(200).json({
      products: cache.products,
      updatedAt: cache.updatedAt || cache.at,
      cached: true,
      source: "Hypixel Public API"
    });
  }

  const key = process.env.HYPIXEL_API_KEY;
  const headers = { Accept: "application/json" };
  if (key) headers["API-Key"] = key;

  try {
    const upstream = await fetch("https://api.hypixel.net/v2/skyblock/bazaar", {
      headers,
      signal: AbortSignal.timeout(10000)
    });
    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok || data.success === false || !data.products || typeof data.products !== "object") {
      return res.status(502).json({
        error: "Hypixel Bazaar data is temporarily unavailable.",
        configured: Boolean(key)
      });
    }

    cache = { at: Date.now(), products: data.products, updatedAt: data.lastUpdated || Date.now() };
    return res.status(200).json({
      products: cache.products,
      updatedAt: cache.updatedAt,
      cached: false,
      source: "Hypixel Public API"
    });
  } catch {
    return res.status(502).json({
      error: "Could not connect to Hypixel Bazaar right now.",
      configured: Boolean(key)
    });
  }
}
