import healthCheck from "@nymdev/health-check";
import express from "express";
import { v4 as uuidv4 } from "uuid";

import errorLogger from "../logger";

import jokeRoutes from "./admin/jokes";
import qotdRoutes from "./admin/qotd";
import quoteRoutes from "./admin/quotes";
import restartRoute from "./admin/restart";
import userRoutes from "./admin/users";

const router = express.Router();

router.use(healthCheck({}));

router.use("/users", userRoutes);
router.use("/jokes", jokeRoutes);
router.use("/quotes", quoteRoutes);
router.use("/qotd", qotdRoutes);
router.use("/restart", restartRoute);

router.get("/error", (req, res) => {
  res.status(500).json({
    error: "Internal Server Error",
    id: uuidv4(),
    timestamp: new Date().toISOString()
  });
});

export default router;
