import express from "express";
import { v4 as uuidv4 } from "uuid";
import errorLogger from "../../logger";

const router = express.Router();

/**
 * @swagger
 * /api/v0/diceroll:
 *    get:
 *      tags:
 *        - /api/v0
 *      summary: Roll a dice
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            type: "object"
 *            properties:
 *              "Dice 1":
 *                type: integer
 *                minimum: 1
 *                maximum: 6
 *              "Dice 2":
 *                type: integer
 *                minimum: 1
 *                maximum: 6
 *        401:
 *          description: Unauthorized (No token provided)
 */

router.get("/", (req, res) => {
  try {
    const dice1Resault = Math.floor(Math.random() * 6) + 1;
    const dice2Resault = Math.floor(Math.random() * 6) + 1;

    res.send({
      "Dice 1": dice1Resault,
      "Dice 2": dice2Resault,
    });
  } catch (error) {
    const errorID = uuidv4();
    errorLogger(error, errorID);
    res.status(500).send({ error: `${error}`, errorID: `${errorID}` });
  }
});

export default router;
