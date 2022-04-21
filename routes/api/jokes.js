import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/api/v0/jokes/random");
});

router.get("/random", async (req, res) => {

  const Connection = await mongoose.connection;

  Connection.collection('jokes').aggregate([
    { $sample: { size: 1 } }
  ]).toArray(function (err, result) {
    if (err) return res.status(500).send(err);
    res.json({
      id: result[0]._id,
      joke: result[0].joke,
    });
  })
});

export default router;
