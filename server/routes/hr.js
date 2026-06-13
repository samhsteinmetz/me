import { Router } from "express";
import {
  fetchRestingHeartRate,
  mockRestingHeartRate,
  hasFitbit,
} from "../lib/fitbit.js";

const router = Router();

router.get("/", async (req, res) => {
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 90);

  if (process.env.MOCK_DATA === "true" || !hasFitbit()) {
    res.set("X-Data-Source", "mock");
    return res.json({ source: "mock", series: mockRestingHeartRate(days) });
  }

  try {
    const series = await fetchRestingHeartRate(days);
    res.set("X-Data-Source", "fitbit");
    res.json({ source: "fitbit", series });
  } catch (err) {
    console.error("[/api/hr] live fetch failed, falling back to mock:", err.message);
    res.set("X-Data-Source", "mock-fallback");
    res.json({ source: "mock-fallback", series: mockRestingHeartRate(days) });
  }
});

export default router;
