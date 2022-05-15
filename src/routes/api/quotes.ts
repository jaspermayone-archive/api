import express from "express";
import { v4 as uuidv4 } from "uuid";

import errorLogger from "../../logger";
import Quote from "../../models/Quotes";

const router = express.Router();

/**
 * @swagger
 * /api/v0/quotes:
 *    get:
 *      tags:
 *        - /api/v0
 *      summary: Fetch a quote
 *      responses:
 *        302:
 *          description: Found (Redirect to /random)
 *        401:
 *          description: Unauthorized (No token provided)
 */
router.get("/", (req, res) => {
  try {
    res.redirect("/api/v0/quotes/random");
  } catch (error) {
    const errorID = uuidv4();
    errorLogger(error, errorID);
    res.status(500).send({ error: `${error}`, errorID: `${errorID}` });
  }
});

/**
 * @swagger
 * /api/v0/quotes/random:
 *    get:
 *      tags:
 *        - /api/v0
 *      summary: Fetch a random quote
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            type: "object"
 *            properties:
 *              _id:
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
  try {
    const targetRecord = await Quote.aggregate([{ $sample: { size: 1 } }]);
    res.send(targetRecord[0]);
  } catch (error) {
    const errorID = uuidv4();
    errorLogger(error, errorID);
    res.status(500).send({ error: `${error}`, errorID: `${errorID}` });
  }
});

export default router;
