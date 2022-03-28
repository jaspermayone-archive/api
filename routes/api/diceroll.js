import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  const dice1Resault = Math.floor(Math.random() * 6) + 1;
  const dice2Resault = Math.floor(Math.random() * 6) + 1;

  res.status(200).send({
    "Dice 1": dice1Resault,
    "Dice 2": dice2Resault,
  });
});

export default router;
