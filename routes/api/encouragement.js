import express from "express";

import quotes from "../../data/encouragement.json" assert { type: "json" };
import getRandomItem from "../../functions/getRandomItem.js";

const router = express.Router();

router.get("/", (req, res) => {
  res
    .status(418)
    .send(
      "Please use /api/encouragement/random for a random quote or /api/quotes/all for all quotes"
    );
});

router.get("/all", (req, res) => {
  res.status(200).send(quotes);
});

router.get("/random", (req, res) => {
  const quotesArray = Object.values(quotes);
  const randomItem = getRandomItem(quotesArray);
  res.status(200).send(randomItem);
});

export default router;
