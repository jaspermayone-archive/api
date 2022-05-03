import express from 'express';
const router = express.Router();
import {v4 as uuidv4} from 'uuid';

import Joke from '../../models/Jokes';
/**
 * @swagger
 * /admin/jokes/{id}:
 *    get:
 *      tags:
 *        - /admin
 *      summary: Fetch a joke by id
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Numeric ID of the joke to fetch
 *          schema:
 *            type: integer
 *            required: true
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            $ref: "#/definitions/Joke"
 *        401:
 *          description: Unauthorized (No token provided)
 *        500:
 *          description: Internal Server Error
 */
router.get('/:id', (req, res) => {
  Joke.findById(req.params.id, (err, joke) => {
    if (err) {
      res.status(500).send("Had an error: " + err + ".");
    } else {
      res.json(joke);
    }
  });
});

/**
 * @swagger
 * /admin/jokes/{id}:
 *    put:
 *      tags:
 *        - /admin
 *      summary: Find a joke by id and update it
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Numeric ID of the joke to find and update
 *          schema:
 *            type: integer
 *            required: true
 *        - in: header
 *          name: joke
 *          schema:
 *            type: string
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            $ref: "#/definitions/Joke"
 *        401:
 *          description: Unauthorized (No token provided)
 *        500:
 *          description: Internal Server Error
 */
router.put('/:id', (req, res) => {
  Joke.findByIdAndUpdate(req.params.id, req.body, (err, joke) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(joke);
    }
  });
});

/**
 * @swagger
 * /admin/jokes/{id}:
 *    delete:
 *      tags:
 *        - /admin
 *      summary: Find a joke by id and delete it
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Numeric ID of the joke to find and delete
 *          schema:
 *            type: integer
 *            required: true
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            $ref: '#/definitions/Joke'
 *        401:
 *          description: Unauthorized (No token provided)
 *        500:
 *          description: Internal Server Error
 */
router.delete('/:id', (req, res) => {
  Joke.findByIdAndDelete(req.params.id, (err, joke) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(joke);
    }
  });
});

/**
 * @swagger
 * /admin/jokes/add:
 *    post:
 *      tags:
 *        - /admin
 *      summary: Add a joke
 *      parameters:
 *        - in: header
 *          name: joke
 *          description: Joke to add
 *          required: true
 *          schema:
 *            $ref: '#/definitions/Joke'
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            type: "object"
 *            properties:
 *              _id:
 *                type: string
 *              joke:
 *                type: string
 *              dateUploaded:
 *                type: string
 *                format: date
 *        400:
 *          description: Bad Request
 *          schema:
 *            type: string
 *            example: "Joke already exists in system!"
 *        401:
 *          description: Unauthorized (No token provided)
 *        500:
 *          description: Internal Server Error
 */
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

export default router;
