import express from "express";
import bcryptjs from "bcryptjs";
const bcrypt = bcryptjs;
import "dotenv/config";

import User from "../../models/User.js";
import { registerValidation } from "../../utils/validation.js";

const router = express.Router();

router.get("/:id", (req, res) => {

  User.findById(req.params.id, (err, user) => {
      if (err) {
          res.status(500).send(err);
      } else {
          res.json(user);
      }
  });
});

router.post("/add", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(401).send(error.details[0].message);

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(400).send("Email already exists in system!");

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

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
      _id: newUser._id,
      dateCreated: newUser.dateCreated,
      accountType: newUser.accountType,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(user);
    }
  });
});

router.delete("/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(user);
    }
  });
});


export default router;
