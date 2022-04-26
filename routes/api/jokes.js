import express from "express";
const router = express.Router();

import Joke from "../../models/Jokes.js";

router.get("/", (req, res) => {
  res.redirect("/api/v0/jokes/random");
});

router.get("/random", async (req, res) => {
  const targetRecord = await Joke.aggregate([{ $sample: { size: 1 } }]);
  res.send(targetRecord[0]);
});

export default router;
