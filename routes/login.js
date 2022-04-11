import express from "express";
import jsonwebtoken from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import bcryptjs from "bcryptjs";
import "dotenv/config";

import { registerValidation, loginValidation } from '../utils/validation.js';
import User from '../models/User.js';

const router = express.Router();


router.post("/", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User not found!");

  const validPassword = await bcryptjs.compare(
    req.body.password,
    user.password
  );
  if (!validPassword)
    return res.status(400).send("Invalid credentials provided!");

  const token = await jsonwebtoken.sign(
    { id: user.id },
    process.env.JWT_SECRET
  );
  return res.header("auth-token", token).send(token);
});

export default router;