import express from "express";
const router = express.Router();

/**
 * @swagger
 * /api/v0/coinflip:
 *    get:
 *      tags:
 *        - /api/v0
 *      summary: Flip a coin
 *      produces: plain/text
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            type: string
 *            example: "Heads"
 *
 *        401:
 *          description: Unauthorized (No token provided)
 *
 */

router.get("/", (req, res) => {
	function isEven(value) {
		if (value % 2 == 0) return true;
		else return false;
	}

	let resault;
	const rndInt = Math.floor(Math.random() * 1000) + 1;

	if (isEven(rndInt)) {
		resault = "Heads";
	}
	if (!isEven(rndInt)) {
		resault = "Tails";
	}

	res.send(resault);
});

export default router;
