import express from "express";

import Joke from "../../models/Jokes";

const router = express.Router();

/**
 * @swagger
 * /api/v0/jokes:
 *    get:
 *      tags:
 *        - /api/v0
 *      summary: Fetch jokes
 *      responses:
 *        302:
 *          description: Found (Redirect to /random)
 *        401:
 *          description: Unauthorized (No token provided)
 */
router.get("/", (req, res) => {
  res.redirect("/api/v0/jokes/random");
});

/**
 * @swagger
 * /api/v0/jokes/random:
 *    get:
 *      tags:
 *        - /api/v0
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
