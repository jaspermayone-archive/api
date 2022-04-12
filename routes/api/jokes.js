import express from "express";

import jokes from "../../data/jokes.json" assert { type: "json" };
import getRandomItem from "../../utils/getRandomItem.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send(
    "Please use /api/jokes/random for a random joke or /api/jokes/all for all jokes"
  );
});

router.get("/all", (req, res) => {
  res.send(jokes);
});

router.get("/random", (req, res) => {
  const jokesArray = Object.values(jokes.jokes);
  const randomItem = getRandomItem(jokesArray);
  res.send(randomItem);
});

// TODO: add endpoint needs to be locked to admins only
router.post("/add", async (req, res) => {
});

export default router;
