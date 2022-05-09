import express from "express";

import loginRoute from "./auth/login";
import registerRoute from "./auth/register";

const router = express.Router();

router.use("/login", loginRoute);
router.use("/register", registerRoute);

export default router;
