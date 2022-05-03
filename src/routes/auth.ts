import express from "express";
import app from "../app";
const router = express.Router();

import loginRoute from "./auth/login";
import registerRoute from "./auth/register";

router.use("/login", loginRoute);
router.use("/register", registerRoute);

export default router;
