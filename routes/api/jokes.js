import express from "express";

import jokes from "../../data/jokes.json" assert { type: "json" };
import getRandomItem from "../../utils/getRandomItem.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/api/v0/jokes/random");
});

router.get("/random", (req, res) => {
  const jokesArray = Object.values(jokes.jokes);
  const randomItem = getRandomItem(jokesArray);
  res.send(randomItem);
});

export default router;
