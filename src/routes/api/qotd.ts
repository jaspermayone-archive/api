import express from "express";
import { v4 as uuidv4 } from "uuid";

import Qotd from "../../models/Qotd";

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/api/v0/qotd/random");
});

router.get("/random", async (req, res) => {
  const targetRecord = await Qotd.aggregate([{ $sample: { size: 1 } }]);
  res.send(targetRecord[0]);
});

export default router;
