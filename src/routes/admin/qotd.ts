import express from "express";
const router = express.Router();
import { v4 as uuidv4 } from "uuid";

import Qotd from "../../models/Qotd";


router.get("/:id", (req, res) => {

    Qotd.findById(req.params.id, (err, joke) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(joke);
        }
    });
});

router.post("/add", async (req, res) => {

    const jokeExists = await Qotd.findOne({ joke: req.body.joke });
    if (jokeExists) return res.status(400).send("Qotd already exists in system!");


    const joke = new Qotd({
        _id: uuidv4(),
        joke: req.body.joke,
    });

    try {
        const newQotd = await joke.save();
        res.send({
            joke: newQotd.joke,
            _id: newQotd._id,
            dateUploaded: newQotd.dateUploaded,
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put("/:id", (req, res) => {
    Qotd.findByIdAndUpdate(req.params.id, req.body, (err, joke) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(joke);
        }
    });
});

router.delete("/:id", (req, res) => {
    Qotd.findByIdAndDelete(req.params.id, (err, joke) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(joke);
        }
    });
});

export default router;