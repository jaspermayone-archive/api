import express from "express";
import { v4 as uuidv4 } from "uuid";

import Quote from "../../models/Quotes";

const router = express.Router();

/**
 * @swagger
 * /v4/quotes:
 *    get:
 *      tags:
 *        - /v4
 *      summary: Fetch a quote
 *      responses:
 *        302:
 *          description: Found (Redirect to /random)
 *        401:
 *          description: Unauthorized (No token provided)
 */
router.get("/", (req, res) => {
  res.redirect("/v4/quotes/random");
});

/**
 * @swagger
 * /v4/quotes/random:
 *    get:
 *      tags:
 *        - /v4
 *      summary: Fetch a random quote
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            type: "object"
 *            properties:
 *              id:
 *                type: string
 *              quote:
 *                type: string
 *              author:
 *                type: string
 *              dateUploaded:
 *                type: string
 *                format: date
 *        401:
 *          description: Unauthorized (No token provided)
 */
router.get("/random", async (req, res) => {
  const targetRecord = await Quote.aggregate([{ $sample: { size: 1 } }]);
  res.send(targetRecord[0]);
});

export default router;
