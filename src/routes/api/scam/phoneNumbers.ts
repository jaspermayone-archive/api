import express from "express";
import "dotenv/config";
import { body, validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";

import ScamPhoneNumber from "../../../models/scam/PhoneNumber";
import { getUserInfo } from "../../../utils/getUserInfo";

const router = express.Router();

/**
 * @swagger
 * /api/v0/scam/phoneNumbers/report:
 *   post:
 *     tags:
 *       - /api/v0
 *     summary: Report a phoneNumber as scam
 *     produces: application/json
 *     parameters:
 *       - in: header
 *         name: phoneNumber
 *         description: The phoneNumber you want to report
 *         schema:
 *           type: string
 *           example: +18143511283
 *         required: true
 *       - in: header
 *         name: reportedBy
 *         description: User that is reporting the phoneNumber
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
 *               example: "Phone Number reported!"
 *             phoneNumber:
 *               type: string
 *             reportedBy:
 *               type: string
 *             reportedById:
 *               type: string
 *             dateReported:
 *               type: string
 *               format: date
 *       400:
 *         description: Bad Request (Some error occurred, or phoneNumber was already reported)
 *         schema:
 *           type: string
 *           example: Phone Number already flagged!
 *       401:
 *         description: Unauthorized (No token provided)
 */
router.post(
  "/report",

  body("phoneNumber")
    .isLength({ min: 1 })
    .withMessage("Phone number is required"),

  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const body = req.body;

    const query = { phoneNumber: body.phoneNumber };

    const phoneNumberExists = await ScamPhoneNumber.findOne(query);
    if (phoneNumberExists) {
      return res.status(400).send("Phone Number already flagged!");
    }

    const user = await getUserInfo(req, res);

    const phoneNumber = new ScamPhoneNumber({
      _id: uuidv4(),
      phoneNumber: body.phoneNumber,
      reportedBy: body.reportedBy,
      reportedByID: user.userId,
    });

    try {
      const newPhoneNumber = await phoneNumber.save();
      res.send({
        message: "Phone Number reported!",
        phoneNumber: newPhoneNumber.phoneNumber,
        reportedBy: newPhoneNumber.reportedBy,
        reportedByID: newPhoneNumber.reportedByID,
        dateReported: newPhoneNumber.dateCreated,
      });
    } catch (err) {
      res.status(400).send("An error has occured. Please contact a developer.");
    }
  }
);

/**
 * @swagger
 * /api/v0/scam/phoneNumbers/check:
 *   get:
 *     tags:
 *       - /api/v0
 *     summary: Check a phoneNumber for scam
 *     produces: application/json
 *     parameters:
 *       - in: header
 *         name: phoneNumber
 *         description: The phoneNumber you want to check
 *         type: string
 *     responses:
 *       200:
 *         description: Successful Response
 *         schema:
 *           type: string
 *       400:
 *         description: Bad Request
 *         schema:
 *           type: string
 *           example: "No Phone Number Provided!"
 *       401:
 *        description: Unauthorized (No token provided)
 */
router.get(
  "/check",

  body("phoneNumber").isString(),

  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const body = req.body;

    const phoneNumber = body.phoneNumber;

    const query = { phoneNumber: phoneNumber };

    if (!phoneNumber) {
      return res.status(400).send("No Phone Number provided!");
    }

    const phoneNumberExists = await ScamPhoneNumber.findOne(query);

    if (phoneNumberExists) {
      res.send("PhoneNumber is a scam!");
    } else {
      res.send(
        "PhoneNumber is not registered in our scam database! If you believe this is a scam, please report it using the /report endpoint!"
      );
    }
  }
);

export default router;
