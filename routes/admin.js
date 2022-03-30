import express from "express";
import apicache from "../index.js";

const router = express.Router();

router.get("/cache/performance", (req, res) => {
  res.json(apicache.getPerformance());
});

router.get("/cache/index", (req, res) => {
  res.json(apicache.getIndex());
});

router.get("/cache/clear/:target?", (req, res) => {
  res.json(apicache.clear(req.params.target));
});

export default router;
