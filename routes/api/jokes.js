import express from "express";

import jokes from "../../data/jokes.json" assert { type: "json" };
import getRandomItem from "../../functions/getRandomItem.js";

const router = express.Router();

router.get("/", (req, res) => {
  res
    .status(418)
    .send(
      "Please use /api/jokes/random for a random joke or /api/jokes/all for all jokes"
    );
});

router.get("/all", (req, res) => {
  res.status(200).send(jokes);
});

router.get("/random", (req, res) => {
  const jokesArray = Object.values(jokes.jokes);
  const randomItem = getRandomItem(jokesArray);
  res.status(200).send(randomItem);
});

export default router;
