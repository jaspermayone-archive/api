import express from "express";

import emailsRoute from "./scam/emails";
import linksRoute from "./scam/links";
import phoneNumbersRoute from "./scam/phoneNumbers";

const router = express.Router();

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
