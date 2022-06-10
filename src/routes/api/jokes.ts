import express from "express";
import { v4 as uuidv4 } from "uuid";

import Joke from "../../models/Jokes";

const router = express.Router();

/**
 * @swagger
 * /v4/jokes:
 *    get:
 *      tags:
 *        - /v4
 *      summary: Fetch jokes
 *      responses:
 *        302:
 *          description: Found (Redirect to /random)
 *        401:
 *          description: Unauthorized (No token provided)
 */
router.get("/", (req, res) => {
  res.redirect("/v4/jokes/random");
});

/**
 * @swagger
 * /v4/jokes/random:
 *    get:
 *      tags:
 *        - /v4
 *      summary: Fetch a random joke
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
 *        401:
 *          description: Unauthorized (No token provided)
 */
router.get("/random", async (req, res) => {
  const targetRecord = await Joke.aggregate([{ $sample: { size: 1 } }]);
  res.send(targetRecord[0]);
});

export default router;
