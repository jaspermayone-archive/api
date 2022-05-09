import bcryptjs from "bcryptjs";
import express from "express";
import jsonwebtoken from "jsonwebtoken";

import User from "../../models/User";
import { loginValidation } from "../../utils/validation";

const jwt = jsonwebtoken;
const bcrypt = bcryptjs;
const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *    post:
 *      tags:
 *        - /auth
 *      summary: Get JWT token for user
 *      parameters:
 *        - in: header
 *          name: user
 *          description: User to add
 *          required: true
 *          schema:
 *            $ref: '#/definitions/User'
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            type: "object"
 *            properties:
 *             token:
 *               type: string
 *        400:
 *          description: Bad Request
 *          schema:
 *            type: string
 *            example: "Can not find user!"
 *        500:
 *          description: Internal Server Error
 */
router.post("/", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const query = { email: req.body.email };

  const user = await User.findOne(query);
  if (!user) {
    return res.status(400).send("Can not find user");
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = await jwt.sign(
        { userId: user._id, accountType: user.accountType },
        process.env.ACCESS_TOKEN_SECRET
      );

      res.json({
        accessToken: accessToken,
      });
    } else {
      res.send("Not allowed");
    }
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Server error",
    });
  }
});

export default router;
