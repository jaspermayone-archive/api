import express from "express";
import "dotenv/config";

import ScamPhoneNumber from "../../../models/scam/PhoneNumber.js";
import { ScamPhoneNumberValidation } from "../../../utils/validation.js";

const router = express.Router();

router.post("/report", async (req, res) => {
  const { error } = ScamPhoneNumberValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const phoneNumberExists = await ScamPhoneNumber.findOne({ phoneNumber: req.body.phoneNumber });
  if (phoneNumberExists) return res.status(400).send("Phone Number already flagged!");

  if (error) return res.status(400).send(error.details[0].message);

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const phoneNumber = new ScamPhoneNumber({
    phoneNumber: req.body.phoneNumber,
    reportedBy: req.body.reportedBy,
    reportedByID: decodedToken.userId,
  });

  try {
    const newPhoneNumber = await phoneNumber.save();
    res.send({
      message: "Phone Number reported!",
      phoneNumber: newPhoneNumber.phoneNumber,
      reportedBy: newPhoneNumber.reportedBy,
      reportedByID: newLink.reportedByID,
      dateReported: newPhoneNumber.dateCreated,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/check", async (req, res) => {

  const phoneNumber = req.body.phoneNumber;
  if (!phoneNumber) return res.status(400).send("No Phone Number provided!");

  const phoneNumberExists = await ScamPhoneNumber.findOne({ phoneNumber: req.body.phoneNumber });

  if (phoneNumberExists) {
    res.send("PhoneNumber is a scam!");
  } else {
    res.send(
      "PhoneNumber is not registered in our scam database! If you believe this is a scam, please report it using the /report endpoint!"
    );
  }
});

router.get("/check:phoneNumber", async (req, res) => {

  const phoneNumber = req.params.phoneNumber;
  if (!phoneNumber) return res.status(400).send("No Phone Number provided!");

  const phoneNumberExists = await ScamPhoneNumber.findOne({ phoneNumber: req.body.phoneNumber });

  if (phoneNumberExists) {
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
