import express from "express";
const router = express.Router();

import Quote from "../../models/Quotes.js";

router.get("/:id", (req, res) => {
  Quote.findById(req.params.id, (err, quote) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(quote);
    }
  });
});

router.post("/add", async (req, res) => {
  const quoteExists = await Quote.findOne({ quote: req.body.quote });
  if (quoteExists)
    return res.status(400).send("Quote already exists in system!");

  const quote = new Quote({
    quote: req.body.quote,
  });

  try {
    const newQuote = await quote.save();
    res.send({
      quote: newQuote.quote,
      _id: newQuote._id,
      dateUploaded: newQuote.dateUploaded,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", (req, res) => {
  Quote.findByIdAndUpdate(req.params.id, req.body, (err, quote) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(quote);
    }
  });
});

router.delete("/:id", (req, res) => {
  Quote.findByIdAndDelete(req.params.id, (err, quote) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(quote);
    }
  });
});

export default router;
