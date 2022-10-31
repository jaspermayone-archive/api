import express from "express";

import Joke from "../../models/Jokes.schema";

const router = express.Router();

/**
 * @openapi
 * /jokes:
 *    get:
 *      tags:
 *        - /
 *      summary: Fetch jokes
 *      responses:
 *        302:
 *          description: Found (Redirect to /random)
 *        401:
 *          description: Unauthorized (No token provided)
 */
router.get("/", (req, res) => {
  res.redirect("/jokes/random");
});

/**
 * @openapi
 * /jokes/random:
 *    get:
 *      tags:
 *        - /
 *      summary: Fetch a random joke
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            type: "object"
 *            properties:
 *              id:
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
