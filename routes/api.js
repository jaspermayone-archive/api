import express from "express";

import qoutesRoutes from "./api/quotes.js";
import movieQuotesRoutes from "./api/moviequotes.js";
import jokesRoutes from "./api/jokes.js";
import coinflipRoutes from "./api/coinflip.js";
import dicerollRoutes from "./api/diceroll.js";


const router = express.Router();

router.get("/", (req, res) => {
  res.send(
    `<h1>Welcome to the API</h1>
    <p>You can find the API documentation <a href="/api/docs">here</a></p>`
  );
});

router.use("/quotes", qoutesRoutes);
router.use("/jokes", jokesRoutes);
router.use("/coinflip", coinflipRoutes);
router.use("/diceroll", dicerollRoutes);
router.use("/moviequotes", movieQuotesRoutes);

export default router;
