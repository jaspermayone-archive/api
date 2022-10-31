import express from "express";

const router = express.Router();

/**
 * @openapi
 * /coinflip:
 *    get:
 *      tags:
 *        - /
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
 */

router.get("/", (req, res) => {
  function isEven(value) {
    if (value % 2 === 0) {
      return true;
    } else {
      return false;
    }
  }

  const rndInt = Math.floor(Math.random() * 1000) + 1;

  if (isEven(rndInt)) {
    const resault = "Heads";
    res.send(resault);
  }
  if (!isEven(rndInt)) {
    const resault = "Tails";
    res.send(resault);
  }
});

export default router;
