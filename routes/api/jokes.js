import express from "express";
import mongoose from "mongoose";

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
 *
 *        401:
 *          description: Unauthorized (No token provided)
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
 *              id:
 *                type: string
 *              joke:
 *                type: string
 *
 *        401:
 *          description: Unauthorized (No token provided)
 */
router.get("/", (req, res) => {
	res.redirect("/api/v0/jokes/random");
});

router.get("/random", async (req, res) => {
  const Connection = await mongoose.connection;

  Connection.collection('jokes').aggregate([
    { $sample: { size: 1 } }
  ]).toArray(function (err, result) {
    if (err) return res.status(500).send(err);
    res.json({
      id: result[0]._id,
      joke: result[0].joke,
    });
  })
});

export default router;
