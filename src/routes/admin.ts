import healthCheck from "@nymdev/health-check";
import express from "express";

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

export default router;
