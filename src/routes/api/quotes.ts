import express from "express";

import Quote from "../../models/Quote.schema";

const router = express.Router();

/**
 * @openapi
 * /quotes:
 *    get:
 *      tags:
 *        - /
 *      summary: Fetch a quote
 *      responses:
 *        302:
 *          description: Found (Redirect to /random)
 */
router.get("/", (req, res) => {
  res.redirect("/quotes/random");
});

/**
 * @openapi
 * /quotes/random:
 *    get:
 *      tags:
 *        - /
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
 */
router.get("/random", async (req, res) => {
  const targetRecord = await Quote.aggregate([{ $sample: { size: 1 } }]);
  res.send(targetRecord[0]);
});

export default router;
