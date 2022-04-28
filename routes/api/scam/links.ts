import express from "express";
import "dotenv/config";
import jsonwebtoken from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const jwt = jsonwebtoken;

import ScamLink from "../../../models/scam/Link";

const router = express.Router();

router.post("/report", async (req, res) => {

  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send("No authorization header!");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).send("No token provided!");
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const linkExists = await ScamLink.findOne({ link: req.body.link });
  if (linkExists) return res.status(400).send("Link already flagged!");


  const link = new ScamLink({
    _id: uuidv4(),
    link: req.body.link,
    type: req.body.type,
    reportedBy: req.body.reportedBy,
    reportedByID: decodedToken.userId,
  });

  try {
    const newLink = await link.save();
    res.send({
      message: "Link reported!",
      link: newLink.link,
      type: newLink.type,
      reportedBy: newLink.reportedBy,
      reportedByID: newLink.reportedByID,
      dateReported: newLink.dateCreated,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/check", async (req, res) => {

  const url = req.query.url;
  const link = req.body.link;

  if (!url) {

    if (!link) return res.status(400).send("No link provided!");

    const linkExists = await ScamLink.findOne({ link: req.body.link });

    if (linkExists) {
      res.json({
        scamDetected: true,
      });
    } else {
      res.json({
        scamDetected: false,
      });
    }
  }
  if (url) {

    const linkExists = await ScamLink.findOne({ link: url });

    if (linkExists) {
      res.json({
        scamDetected: true,
      });
    } else {
      res.json({
        scamDetected: false,
      });
    }
  }
});

export default router;
