import express from "express";
import { v4 as uuidv4 } from "uuid";
import bcryptjs from "bcryptjs";
import "dotenv/config";

import User from "../../models/User.js";
import { registerValidation, loginValidation } from "../../utils/validation.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const passcode = req.headers.passcode;
  const { error } = registerValidation(req.body);

  if (!passcode)
    return res.status(400).send("Passcode is required for this command");
  if (passcode != process.env.REGISTER_PAS)
    return res.status(400).send("Invalid passcode");

  if (error) return res.status(401).send(error.details[0].message);

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already exists!");

  const passwordSalt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(req.body.password, passwordSalt);

  const user = new User({
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

router.delete("/", async (req, res) => {
  const passcode = req.headers.passcode;

  if (!passcode)
    return res.status(400).send("Passcode is required for this command");
  if (passcode != process.env.REGISTER_PAS)
    return res.status(400).send("Passcode is incorrect");

  const emailExists = await User.findOne({ email: req.body.email });
  if (!emailExists) return res.status(400).send("Email doesn't exist!");

  const user = await User.findOneAndDelete({ email: req.body.email });

  try {
    const deledUser = await user.delete();
    res.json({
      name: deledUser.name,
      email: deledUser.email,
      id: deledUser.id,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.patch("/", async (req, res) => {
  const passcode = req.headers.passcode;

  if (!passcode)
    return res.status(400).send("Passcode is required for this command");
  if (passcode != process.env.REGISTER_PAS)
    return res.status(400).send("Passcode is incorrect");

  // find user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User doesn't exist!");

  // update user
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
});

export default router;
