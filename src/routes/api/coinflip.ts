import express from "express";
import { v4 as uuidv4 } from "uuid";
import errorLogger from "../../logger";

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
 */

router.get("/", (req, res) => {
  function isEven(value) {
    if (value % 2 === 0) {
      return true;
    } else {
      return false;
    }
  }

  try {
    const rndInt = Math.floor(Math.random() * 1000) + 1;

    if (isEven(rndInt)) {
      const resault = "Heads";
      res.send(resault);
    }
    if (!isEven(rndInt)) {
      const resault = "Tails";
      res.send(resault);
    }
  } catch (error) {
    const errorID = uuidv4();
    errorLogger(error, errorID);
    res.status(500).send({ error: `${error}`, errorID: `${errorID}` });
  }
});

export default router;
