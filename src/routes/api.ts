import express from "express";

import coinflipRoutes from "./api/coinflip";
import dicerollRoutes from "./api/diceroll";
import jokesRoutes from "./api/jokes";
import qotdRoutes from "./api/qotd";
import qoutesRoutes from "./api/quotes";
import scamRoutes from "./api/scam";
import metricsRoutes from "./api/metrics";

const router = express.Router();

router.use("/quotes", qoutesRoutes);
router.use("/jokes", jokesRoutes);
router.use("/coinflip", coinflipRoutes);
router.use("/diceroll", dicerollRoutes);
router.use("/qotd", qotdRoutes);
router.use("/scam", scamRoutes);
router.use("/metrics", metricsRoutes);

export default router;
