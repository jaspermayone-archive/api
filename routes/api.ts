import express from "express";
const router = express.Router();

import qoutesRoutes from "./api/quotes";
import jokesRoutes from "./api/jokes";
import coinflipRoutes from "./api/coinflip";
import dicerollRoutes from "./api/diceroll";
import scamRoutes from "./api/scam";

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
router.use("/scam", scamRoutes);

export default router;
