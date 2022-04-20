import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/api/v0/jokes/random");
});

router.get("/random", async (req, res) => {
  const Connection = mongoose.createConnection()
  await Connection.openUri(process.env.MONGODB_URI_REMOTE)

  Connection.collection('jokes').aggregate([
    { $sample: { size: 1 } }
  ]).toArray(function (err, result) {
    if (err) throw err;
    res.json({
      id: result[0]._id,
      joke: result[0].joke,
    });
  })
});

export default router;
