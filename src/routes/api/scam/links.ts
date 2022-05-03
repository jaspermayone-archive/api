import express from 'express';
import 'dotenv/config';
import jsonwebtoken from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const jwt = jsonwebtoken;

import ScamLink from '../../../models/scam/Link';
import { getUserInfo } from '../../../utils/getUserInfo';

const router = express.Router();

/**
 * @swagger
 * /api/v0/scam/links/report:
 *   post:
 *     tags:
 *       - /api/v0
 *     summary: Report a link as scam
 *     produces: application/json
 *     parameters:
 *       - in: header
 *         name: link
 *         description: The URL you want to report
 *         schema:
 *           type: string
 *           example: scam.example.com
 *         required: true
 *       - in: header
 *         name: reportedBy
 *         description: User that is reporting the URL
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
 *               example: "Link reported!"
 *             link:
 *               type: string
 *             reportedBy:
 *               type: string
 *             id:
 *               type: string
 *             dateReported:
 *               type: string
 *               format: date
 *       400:
 *         description: Bad Request (Some error occurred, or link was already reported)
 *         schema:
 *           type: string
 *           example: Link already flagged!
 *       401:
 *         description: Unauthorized (No token provided)
 */
router.post('/report', async (req, res) => {
  const body = req.body;

let query = { link: body.link };

  const linkExists = await ScamLink.findOne(query);
  if (linkExists) return res.status(400).send('Link already flagged!');

  const user = await getUserInfo(req, res);

  const link = new ScamLink({
    _id: uuidv4(),
    link: body.link,
    type: body.type,
    reportedBy: body.reportedBy,
    reportedByID: user.userId,
  });

  try {
    const newLink = await link.save();
    res.send({
      message: 'Link reported!',
      link: newLink.link,
      type: newLink.type,
      reportedBy: newLink.reportedBy,
      reportedByID: newLink.reportedByID,
      dateReported: newLink.dateCreated,
    });
  } catch (err) {
    res.status(400).send("An error has occured. Please contact a developer.");
  }
});

/**
 * @swagger
 * /api/v0/scam/links/check:
 *   get:
 *     tags:
 *       - /api/v0
 *     summary: Check a link for scam
 *     produces: application/json
 *     parameters:
 *       - in: query
 *         name: url
 *         description: The URL you want to query
 *         type: string
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
 *        description: Unauthorized (No token provided)
 */
router.get('/check', async (req, res) => {
  const query = req.query;
  const body = req.body;

  const url = query.url;
  const link = body.link;

  let dbQuery = { link: link };

  if (!url) {
    if (!link) return res.status(400).send('No link provided!');

    const linkExists = await ScamLink.findOne(dbQuery);

    if (linkExists) {
      res.json({
        scamDetected: true,
      });
    } else {
      res.json({
        scamDetected: false,
      });
    }
  }
  if (url) {
    const linkExists = await ScamLink.findOne({ link: url });

    if (linkExists) {
      res.json({
        scamDetected: true,
      });
    } else {
      res.json({
        scamDetected: false,
      });
    }
  }
});

export default router;
