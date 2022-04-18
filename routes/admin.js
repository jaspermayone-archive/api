import express from "express";
import healthCheck from '@nymdev/health-check'

const router = express.Router();

import userRoutes from './admin/users.js';
import jokeRoutes from './admin/jokes.js';
import quoteRoutes from './admin/quotes.js';

router.use(healthCheck({}));

router.use("/users", userRoutes);
router.use("/jokes", jokeRoutes);
router.use("/quotes", quoteRoutes);

export default router;
