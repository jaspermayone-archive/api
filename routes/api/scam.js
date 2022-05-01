import express from "express";
const router = express.Router();

import linksRoute from "./scam/links.js";
import emailsRoute from "./scam/emails.js";
import phoneNumbersRoute from "./scam/phoneNumbers.js";

router.get("/", (req, res) => {
  res.send(
    `<h1>Welcome to the API</h1>
        <p>You can find the API documentation <a href="/api/docs">here</a></p>`
  );
});

router.use("/links", linksRoute);
router.use("/emails", emailsRoute);
router.use("/phoneNumbers", phoneNumbersRoute);

export default router;
