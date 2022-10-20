import express from "express";

import changelog from "./api/changelog";
import coinflipRoutes from "./api/coinflip";
import dicerollRoutes from "./api/diceroll";
import jokesRoutes from "./api/jokes";
import qotdRoutes from "./api/qotd";
import qoutesRoutes from "./api/quotes";
import randomnumberRoutes from "./api/randomnumber";
import scamRoutes from "./api/scam";

const router = express.Router();

router.use("/quotes", qoutesRoutes);
router.use("/jokes", jokesRoutes);
router.use("/coinflip", coinflipRoutes);
router.use("/diceroll", dicerollRoutes);
router.use("/randomnumber", randomnumberRoutes);
router.use("/qotd", qotdRoutes);
router.use("/scam", scamRoutes);
router.use("/changelog", changelog);

export default router;
