export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({
    ok: true,
    service: "Skyblock Hub API",
    hypixelConfigured: Boolean(process.env.HYPIXEL_API_KEY)
  });
}
