import express from "express";
const router = express.Router();
import { auth as verify } from "../utils/verifytoken.js";

import qoutesRoutes from "./api/quotes.js";
import jokesRoutes from "./api/jokes.js";
import coinflipRoutes from "./api/coinflip.js";
import dicerollRoutes from "./api/diceroll.js";


router.get("/", (req, res) => {
  res.send(
    `<h1>Welcome to the API</h1>
    <p>You can find the API documentation <a href="/api/docs">here</a></p>`
  );
});

router.use("/quotes", verify, qoutesRoutes);
router.use("/jokes", verify, jokesRoutes);
router.use("/coinflip", verify, coinflipRoutes);
router.use("/diceroll", verify, dicerollRoutes);

export default router;
