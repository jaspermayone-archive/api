import express from "express";

import quotes from "../../data/quotes.json" assert { type: "json" };
import getRandomItem from "../../utils/getRandomItem.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/api/v0/quotes/random");
});

router.get("/random", (req, res) => {
  const quotesArray = Object.values(quotes.quotes);
  const randomItem = getRandomItem(quotesArray);
  res.json({
    id: randomItem.id,
    quote: randomItem.quote,
    author: randomItem.author
  });
});

export default router;
