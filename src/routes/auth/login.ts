import express from "express";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

const jwt = jsonwebtoken;
const bcrypt = bcryptjs;
const router = express.Router();

import { loginValidation } from '../../utils/validation';
import User from "../../models/User";



/**
 * @swagger
 * /auth/login:
 *    get:
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
router.get("/", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let query = { email: req.body.email };

  const user = await User.findOne(query);
  if (!user) return res.status(400).send("Can not find user");

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
      message: "Server error"
    });
  }
});

export default router;
