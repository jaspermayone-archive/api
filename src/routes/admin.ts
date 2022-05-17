import express from "express";

import jokeRoutes from "./admin/jokes";
import qotdRoutes from "./admin/qotd";
import quoteRoutes from "./admin/quotes";
import restartRoute from "./admin/restart";
import userRoutes from "./admin/users";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/jokes", jokeRoutes);
router.use("/quotes", quoteRoutes);
router.use("/qotd", qotdRoutes);
router.use("/restart", restartRoute);

router.get("/error", (req, res) => {
  throw new Error("Test error from admin route");
});

export default router;
