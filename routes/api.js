import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" assert { type: "json" };

import qoutesRoutes from "./api/quotes.js";
import movieQuotesRoutes from "./api/moviequotes.js";
import encouragementRoutes from "./api/encouragement.js";
import jokesRoutes from "./api/jokes.js";
import coinflipRoutes from "./api/coinflip.js";
import dicerollRoutes from "./api/diceroll.js";

const router = express.Router();

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.use("/quotes", qoutesRoutes);
router.use("/moviequotes", movieQuotesRoutes);
router.use("/encouragement", encouragementRoutes);
router.use("/jokes", jokesRoutes);
router.use("/coinflip", coinflipRoutes);
router.use("/diceroll", dicerollRoutes);

export default router;
