import express from "express";
import { v4 as uuidv4 } from "uuid";

import Qotd from "../../models/Qotd";

const router = express.Router();

/**
 * @swagger
 * /v4/qotd:
 *    get:
 *      tags:
 *        - /v4
 *      summary: gets a question of the day
 *      responses:
 *        302:
 *          description: Found (Redirect to /random)
 *        401:
 *          description: Unauthorized (No token provided)
 */
router.get("/", (req, res) => {
  res.redirect("/v4/qotd/random");
});

/**
 * @swagger
 * /v4/qotd/random:
 *    get:
 *      tags:
 *        - /v4
 *      summary: Fetch a random question of the day
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            type: "object"
 *            properties:
 *              id:
 *                type: string
 *              qo:
 *                type: string
 *              uniqueID:
 *                type: string
 *                format: date
 *        401:
 *          description: Unauthorized (No token provided)
 */
router.get("/random", async (req, res) => {
  const targetRecord = await Qotd.aggregate([{ $sample: { size: 1 } }]);
  res.send(targetRecord[0]);
});

export default router;
