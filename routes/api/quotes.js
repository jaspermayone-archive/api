import express from "express";
import mongoose from "mongoose";

const router = express.Router();

/**
 * @swagger
 * /api/v0/quotes:
 *    get:
 *      tags:
 *        - /api/v0
 *      summary: Fetch quotes
 *      responses:
 *        302:
 *          description: Found (Redirect to /random)
 *
 *        401:
 *          description: Unauthorized (No token provided)
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
 *              id:
 *                type: string
 *              quote:
 *                type: string
 *              author:
 *                type: string
 *
 *        401:
 *          description: Unauthorized (No token provided)
 */

router.get("/", (req, res) => {
	res.redirect("/api/v0/quotes/random");
});

router.get("/random", async (req, res) => {
	const Connection = mongoose.createConnection();
	await Connection.openUri(process.env.MONGODB_URI_REMOTE);

	Connection.collection("quotes")
		.aggregate([{ $sample: { size: 1 } }])
		.toArray(function (err, result) {
			if (err) throw err;
			res.json({
				id: result[0]._id,
				quote: result[0].quote,
				author: result[0].author,
			});
		});
});

export default router;
