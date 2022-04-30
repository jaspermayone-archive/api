import express from "express";
import bcryptjs from "bcryptjs";
import jsonwebtoken from 'jsonwebtoken';

const jwt = jsonwebtoken;
const bcrypt = bcryptjs

const router = express.Router();

import { loginValidation } from '../utils/validation';
import User from "../models/User";

router.post("/", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Can not find user");

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = await jwt.sign({ userId: user._id, accountType: user.accountType }, process.env.ACCESS_TOKEN_SECRET);

      res.json({
        accessToken: accessToken,
      });
    } else {
      res.send("Not allowed");
    }
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Server error"
    });
  }
});

export default router;