import express from "express";

import emailsRoute from "./scam/emails";
import linksRoute from "./scam/links";
import phoneNumbersRoute from "./scam/phoneNumbers";

const router = express.Router();

router.use("/links", linksRoute);
router.use("/emails", emailsRoute);
router.use("/phoneNumbers", phoneNumbersRoute);

export default router;
