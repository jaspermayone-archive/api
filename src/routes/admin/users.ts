import express from "express";
import bcryptjs from "bcryptjs";
const bcrypt = bcryptjs;
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";

import User from "../../models/User";
import { registerValidation } from "../../utils/validation";

const router = express.Router();

/**
 * @swagger
 * /admin/users/{id}:
 *    get:
 *      tags:
 *        - /admin
 *      summary: Fetch a user by id
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Numeric ID of the user to fetch
 *          schema:
 *            type: integer
 *            required: true
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            $ref: '#/definitions/Joke'
 *        401:
 *          description: Unauthorized (No token provided)
 *        500:
 *          description: Internal Server Error
 */
router.get("/:id", (req, res) => {
  const id = req.params.id;
  User.findById(id, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(user);
    }
  });
});

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
  const { error } = registerValidation(req.body);
  if (error) return res.status(401).send(error.details[0].message);

  const email = req.body.email;
  const password = req.body.password;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const accountType = req.body.accountType;

  const emailExists = await User.findOne({ email: email });
  if (emailExists)
    return res.status(400).send("Email already exists in system!");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    _id: uuidv4(),
    first_name: first_name,
    last_name: last_name,
    email: email,
    password: hashedPassword,
    accountType: accountType,
  });

  try {
    const newUser = await user.save();
    res.send({
      _id: newUser._id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      password: newUser.password,
      dateCreated: newUser.dateCreated,
      accountType: newUser.accountType,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * @swagger
 * /admin/users/{id}:
 *    put:
 *      tags:
 *        - /admin
 *      summary: Find a user by id and update it
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Numeric ID of the user to find and update
 *          schema:
 *            type: integer
 *            required: true
 *        - in: header
 *          name: user
 *          schema:
 *            type: string
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            $ref: "#/definitions/User"
 *        401:
 *          description: Unauthorized (No token provided)
 *        500:
 *          description: Internal Server Error
 */
router.put("/:id", (req, res) => {
  const id = req.params.id;
  User.findByIdAndUpdate(id, req.body, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(user);
    }
  });
});

/**
 * @swagger
 * /admin/users/{id}:
 *    delete:
 *      tags:
 *        - /admin
 *      summary: Find a user by id and delete it
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Numeric ID of the user to find and delete
 *          schema:
 *            type: integer
 *            required: true
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            $ref: '#/definitions/User'
 *        401:
 *          description: Unauthorized (No token provided)
 *        500:
 *          description: Internal Server Error
 */
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  User.findByIdAndDelete(id, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(user);
    }
  });
});

export default router;
