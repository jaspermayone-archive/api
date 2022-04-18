import express from "express";
import "dotenv/config";

import ScamEmail from "../../../models/scam/Email.js";
import { ScamEmailValidation } from "../../../utils/validation.js";

const router = express.Router();

router.post("/report", async (req, res) => {
  const { error } = ScamEmailValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExists = await ScamEmail.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already flagged!");

  if (error) return res.status(400).send(error.details[0].message);

  const email = new ScamEmail({
    email: req.body.email,
    reportedBy: req.body.reportedBy,
    reportedByID: req.header("auth-token"),
  });

  try {
    const newEmail = await email.save();
    res.send({
      message: "Email reported!",
      email: newEmail.email,
      reportedBy: newEmail.reportedBy,
      id: newEmail.id,
      dateReported: newEmail.dateCreated,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/check", async (req, res) => {

  const email = req.body.email;
  if (!email) return res.status(400).send("No email provided!");

  const emailExists = await ScamEmail.findOne({ email: req.body.email });

  if (emailExists) {
    res.send("Email is a scam!");
  } else {
    res.send(
      "Email is not registered in our scam database! If you believe this is a scam, please report it using the /report endpoint!"
    );
  }
});

router.get("/check:email", async (req, res) => {

  const email = req.params.email;
  if (!email) return res.status(400).send("No email provided!");

  const emailExists = await ScamEmail.findOne({ email: req.body.email });

  if (emailExists) {
    res.json({
      scamDetected: true,
    });
  } else {
    res.json({
      scamDetected: false,
    });
  }
});

export default router;
