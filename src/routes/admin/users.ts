import { bcryptjs as bcrypt } from "bcryptjs";
import express from "express";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";

import User from "../../models/User";

const router = express.Router();

/**
 * @swagger
 * /admin/users/add:
 *    post:
 *      tags:
 *        - /admin
 *      summary: Add a user
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
 *              _id:
 *                type: string
 *              user:
 *                type: string
 *              dateUploaded:
 *                type: string
 *                format: date
 *        400:
 *          description: Bad Request
 *          schema:
 *            type: string
 *            example: "User already exists in system!"
 *        401:
 *          description: Unauthorized (No token provided)
 *        500:
 *          description: Internal Server Error
 */
router.post("/add", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const accountType = req.body.accountType;

  const query = { email: email };

  const emailExists = await User.findOne(query);
  if (emailExists) {
    return res.status(400).send("Email already exists in system!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    _id: uuidv4(),
    name: name,
    email: email,
    password: hashedPassword,
    accountType: accountType,
  });

  const newUser = await user.save();
  res.send({
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    password: newUser.password,
    dateCreated: newUser.dateCreated,
    accountType: newUser.accountType,
  });
});

export default router;
