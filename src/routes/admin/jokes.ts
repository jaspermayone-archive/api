import express from 'express';
const router = express.Router();
import {v4 as uuidv4} from 'uuid';

import Joke from '../../models/Jokes';

router.get('/:id', (req, res) => {
  Joke.findById(req.params.id, (err, joke) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(joke);
    }
  });
});

router.post('/add', async (req, res) => {
  const jokeExists = await Joke.findOne({joke: req.body.joke});
  if (jokeExists) return res.status(400).send('Joke already exists in system!');

  const joke = new Joke({
    _id: uuidv4(),
    joke: req.body.joke,
  });

  try {
    const newJoke = await joke.save();
    res.send({
      joke: newJoke.joke,
      _id: newJoke._id,
      dateUploaded: newJoke.dateUploaded,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put('/:id', (req, res) => {
  Joke.findByIdAndUpdate(req.params.id, req.body, (err, joke) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(joke);
    }
  });
});

router.delete('/:id', (req, res) => {
  Joke.findByIdAndDelete(req.params.id, (err, joke) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(joke);
    }
  });
});

export default router;
