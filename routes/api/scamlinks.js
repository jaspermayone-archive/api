import express from "express";
import "dotenv/config";

import ScamLink from "../../models/ScamLink.js";
import { ScamLinkValidation } from "../../utils/validation.js";

const router = express.Router();

router.post("/report", async (req, res) => {
  const { error } = ScamLinkValidation(req.body);

  const linkExists = await ScamLink.findOne({ link: req.body.link });
  if (linkExists) return res.status(400).send("Link already flagged!");

  if (error) return res.status(400).send(error.details[0].message);

  const link = new ScamLink({
    link: req.body.link,
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
 // const link = req.query.link;

const linkExists = await ScamLink.findOne({ link: req.body.link });

  if (linkExists) {
    res.send("Link is a scam!");
  } else {
    res.send(
      "Link is not registered in our scam database! If you believe this is a scam, please report it using the /report endpoint!"
    );
  }
});

export default router;
