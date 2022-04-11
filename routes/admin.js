import express from "express";
import healthCheck from '@nymdev/health-check'

const router = express.Router();

import userRoutes from './admin/users.js';

router.use(healthCheck({}));

router.use("/users", userRoutes);

export default router;
