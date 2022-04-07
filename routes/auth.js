import express from "express";
import { v4 as uuidv4 } from "uuid";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import 'dotenv/config';

import User from "../models/User.js";
import { registerValidation, loginValidation } from "../utils/validation.js";
import { auth as verify } from "../utils/verifytoken.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already exists!");

  const passwordSalt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(req.body.password, passwordSalt);

  const user = new User({
    id: uuidv4(),
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const newUser = await user.save();
    res.send({
      name: newUser.name,
      email: newUser.email,
      id: newUser.id,
      dateCreated: newUser.dateCreated,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
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

  const token = await jsonwebtoken.sign({ id: user.id }, process.env.JWT_SECRET);
   return res.header("auth-token", token).send(token);
});

export default router;
