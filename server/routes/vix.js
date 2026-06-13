import { Router } from "express";
import { fetchVixSeries, mockVixSeries, hasVix } from "../lib/vix.js";

const router = Router();

router.get("/", async (req, res) => {
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 90);

  if (process.env.MOCK_DATA === "true" || !hasVix()) {
    res.set("X-Data-Source", "mock");
    return res.json({ source: "mock", series: mockVixSeries(days) });
  }

  try {
    const series = await fetchVixSeries(days);
    res.set("X-Data-Source", "rapidapi");
    res.json({ source: "rapidapi", series });
  } catch (err) {
    console.error("[/api/vix] live fetch failed, falling back to mock:", err.message);
    res.set("X-Data-Source", "mock-fallback");
    res.json({ source: "mock-fallback", series: mockVixSeries(days) });
  }
});

export default router;
