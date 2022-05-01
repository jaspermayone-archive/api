import express from 'express';
import 'dotenv/config';
import {v4 as uuidv4} from 'uuid';
import jsonwebtoken from 'jsonwebtoken';

const jwt = jsonwebtoken;

import ScamEmail from '../../../models/scam/Email';
import {getUserInfo} from '../../../utils/getUserInfo';

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
router.post('/report', async (req, res) => {
  const emailExists = await ScamEmail.findOne({email: req.body.email});
  if (emailExists) return res.status(400).send('Email already flagged!');

  const user = await getUserInfo(req, res);

  const email = new ScamEmail({
    _id: uuidv4(),
    email: req.body.email,
    reportedBy: req.body.reportedBy,
    reportedByID: user.userId,
  });

  try {
    const newEmail = await email.save();
    res.send({
      message: 'Email reported!',
      email: newEmail.email,
      reportedBy: newEmail.reportedBy,
      reportedByID: newEmail.reportedByID,
      dateReported: newEmail.dateCreated,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/check', async (req, res) => {
  const email = req.body.email;
  if (!email) return res.status(400).send('No email provided!');

  const emailExists = await ScamEmail.findOne({email: req.body.email});

  if (emailExists) {
    res.send('Email is a scam!');
  } else {
    res.send(
      'Email is not registered in our scam database! If you believe this is a scam, please report it using the /report endpoint!'
    );
  }
});

export default router;
