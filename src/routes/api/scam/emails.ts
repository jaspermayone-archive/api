import express from "express";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import { body, validationResult } from "express-validator";

import ScamEmail from "../../../models/scam/Email";
import { getUserInfo } from "../../../utils/getUserInfo";

const router = express.Router();

/**
 * @swagger
 * /api/v0/scam/emails/report:
 *   post:
 *     tags:
 *       - /api/v0
 *     summary: Report a email as scam
 *     produces: application/json
 *     parameters:
 *       - in: header
 *         name: email
 *         description: The email you want to report
 *         schema:
 *           type: string
 *           example: user@mail.example.com
 *         required: true
 *       - in: header
 *         name: reportedBy
 *         description: User that is reporting the email
 *         schema:
 *           type: string
 *           example: j-dogcoder
 *     responses:
 *       200:
 *         description: Successful Response
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Email reported!"
 *             email:
 *               type: string
 *             reportedBy:
 *               type: string
 *             reportedById:
 *               type: string
 *             dateReported:
 *               type: string
 *               format: date
 *       400:
 *         description: Bad Request (Some error occurred, or email was already reported)
 *         schema:
 *           type: string
 *           example: "Email already flagged!"
 *       401:
 *         description: Unauthorized (No token provided)
 */
router.post(
  "/report",

  body("email")
    .isEmail()
    .withMessage("Email must be a valid email")
    .normalizeEmail(),
  body("reportedBy").isString().withMessage("ReportedBy must be a string"),

  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const body = req.body;

    const query = { email: body.email };

    const emailExists = await ScamEmail.findOne(query);
    if (emailExists) {
      return res.status(400).send("Email already flagged!");
    }

    const user = await getUserInfo(req, res);

    const email = new ScamEmail({
      _id: uuidv4(),
      email: body.email,
      reportedBy: body.reportedBy,
      reportedByID: user.userId,
    });

    try {
      const newEmail = await email.save();
      res.send({
        message: "Email reported!",
        email: newEmail.email,
        reportedBy: newEmail.reportedBy,
        reportedByID: newEmail.reportedByID,
        dateReported: newEmail.dateCreated,
      });
    } catch (err) {
      res.status(400).send("An error has occured. Please contact a developer.");
    }
  }
);

/**
 * @swagger
 * /api/v0/scam/emails/check:
 *   post:
 *     tags:
 *       - /api/v0
 *     summary: check if email is flagged as scam
 *     produces: application/json
 *     parameters:
 *       - in: header
 *         name: email
 *         description: The email you want to check
 *         schema:
 *           type: string
 *           example: user@mail.example.com
 *         required: true
 *     responses:
 *       200:
 *         description: Successful Response
 *         schema:
 *           type: object
 *           properties:
 *             scamDetected:
 *               type: boolean
 *       401:
 *         description: Unauthorized (No token provided)
 */
router.get(
  "/check",

  body("email")
    .isEmail()
    .withMessage("Email must be a valid email")
    .normalizeEmail(),

  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const body = req.body;

    const query = { email: body.email };

    const email = body.email;
    if (!email) {
      return res.status(400).send("No email provided!");
    }

    const emailExists = await ScamEmail.findOne(query);

    if (emailExists) {
      res.send("Email is a scam!");
    } else {
      res.send(
        "Email is not registered in our scam database! If you believe this is a scam, please report it using the /report endpoint!"
      );
    }
  }
);

export default router;
