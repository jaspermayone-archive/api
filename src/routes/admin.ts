import express from "express";
import healthCheck from "@nymdev/health-check";

const router = express.Router();

import userRoutes from './admin/users';
import jokeRoutes from './admin/jokes';
import quoteRoutes from './admin/quotes';
import restartRoute from './admin/restart';

router.use(healthCheck({}));

router.use("/users", userRoutes);
router.use("/jokes", jokeRoutes);
router.use("/quotes", quoteRoutes);
router.use("/restart", restartRoute);


export default router;
