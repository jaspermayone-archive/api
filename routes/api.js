import express from "express";

import qoutesRoutes from "./api/quotes.js";
import movieQuotesRoutes from "./api/moviequotes.js";
import encouragementRoutes from "./api/encouragement.js";
import jokesRoutes from "./api/jokes.js";
import coinflipRoutes from "./api/coinflip.js";
import dicerollRoutes from "./api/diceroll.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.response("Hello World");
});

router.use("/quotes", qoutesRoutes);
router.use("/moviequotes", movieQuotesRoutes);
router.use("/encouragement", encouragementRoutes);
router.use("/jokes", jokesRoutes);
router.use("/coinflip", coinflipRoutes);
router.use("/diceroll", dicerollRoutes);

export default router;
