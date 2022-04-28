import express from "express";
const router = express.Router();

import Quote from "../../models/Quotes";

router.get("/", (req, res) => {
  res.redirect("/api/v0/quotes/random");
});

router.get("/random", async (req, res) => {
  const targetRecord = await Quote.aggregate([{ $sample: { size: 1 } }]);
  res.send(targetRecord[0]);
});


export default router;