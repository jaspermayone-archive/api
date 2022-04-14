import express from "express";
import "dotenv/config";

import ScamLink from "../../models/ScamLink.js";
import { ScamLinkValidation } from "../../utils/validation.js";

const router = express.Router();

router.post("/report", async (req, res) => {
  const { error } = ScamLinkValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const rawlink = req.body.link;
  const linky = rawlink.replace(/^https?:\/\//i, "");
  const linky2 = linky.split(".").slice(-2).join(".");
  const linky3 = linky2.split("/")[0];

  const linkExists = await ScamLink.findOne({ link: linky3 });
  if (linkExists) return res.status(400).send("Link already flagged!");

  if (error) return res.status(400).send(error.details[0].message);

  const link = new ScamLink({
    link: linky3,
    reportedBy: req.body.reportedBy,
    reportedByID: req.header("auth-token"),
  });

  try {
    const newLink = await link.save();
    res.send({
      message: "Link reported!",
      link: newLink.link,
      reportedBy: newLink.reportedBy,
      id: newLink.id,
      dateReported: newLink.dateCreated,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/check", async (req, res) => {

  const rawlink = req.body.link;
  const linky = rawlink.replace(/^https?:\/\//i, "");
  const linky2 = linky.split(".").slice(-2).join(".");
  const linky3 = linky2.split("/")[0];

  const linkExists = await ScamLink.findOne({ link: linky3 });

  if (linkExists) {
    res.send("Link is a scam!");
  } else {
    res.send(
      "Link is not registered in our scam database! If you believe this is a scam, please report it using the /report endpoint!"
    );
  }
});

export default router;
