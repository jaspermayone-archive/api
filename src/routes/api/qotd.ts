import express from "express";
import { v4 as uuidv4 } from "uuid";

import errorLogger from "../../logger";
import Qotd from "../../models/Qotd";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    res.redirect("/api/v0/qotd/random");
  } catch (error) {
    const errorID = uuidv4();
    errorLogger(error, errorID);
    res.status(500).send({ error: `${error}`, errorID: `${errorID}` });
  }
});

router.get("/random", async (req, res) => {
  try {
    const targetRecord = await Qotd.aggregate([{ $sample: { size: 1 } }]);
    res.send(targetRecord[0]);
  } catch (error) {
    const errorID = uuidv4();
    errorLogger(error, errorID);
    res.status(500).send({ error: `${error}`, errorID: `${errorID}` });
  }
});

export default router;
