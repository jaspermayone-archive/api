import express from "express";
import { v4 as uuidv4 } from "uuid";

import Qotd from "../../models/Qotd";

const router = express.Router();

router.get("/:id", (req, res) => {
  Qotd.findById(req.params.id, (error, qotd) => {
    res.json(qotd);
  });
});

router.post("/add", async (req, res) => {
  const qotdExists = await Qotd.findOne({ qotd: req.body.qotd });
  if (qotdExists) {
    return res.status(400).send("Qotd already exists in system!");
  }

  const uniqueIDexists = await Qotd.findOne({ uniqueID: req.body.uniqueID });
  if (uniqueIDexists) {
    return res.status(400).send("UniqueID already exists in system!");
  }

  const qotd = new Qotd({
    _id: uuidv4(),
    qotd: req.body.qotd,
    uniqueID: req.body.uniqueID,
  });

  const newQotd = await qotd.save();
  res.send({
    qotd: newQotd.qotd,
    _id: newQotd._id,
    uniqueID: newQotd.uniqueID,
    dateUploaded: newQotd.dateUploaded,
  });
});

router.put("/:id", (req, res) => {
  Qotd.findByIdAndUpdate(req.params.id, req.body, (error, qotd) => {
    res.json(qotd);
  });
});

router.delete("/:id", (req, res) => {
  Qotd.findByIdAndDelete(req.params.id, (error, qotd) => {
    res.json(qotd);
  });
});

export default router;
