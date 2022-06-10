import express from "express";
import "dotenv/config";
import { body, validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";

import ScamLink from "../../../models/scam/Link";
import { getUserInfo } from "../../../utils/getUserInfo";

const router = express.Router();

/**
 * @swagger
 * /v4/scam/links/report:
 *   post:
 *     tags:
 *       - /v4
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
router.post(
  "/report",

  body("link").isString().isURL(),
  body("type").isString(),
  body("reportedBy").isString(),

  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const body = req.body;

    const query = { link: body.link };

    const linkExists = await ScamLink.findOne(query);
    if (linkExists) {
      return res.status(400).send("Link already flagged!");
    }

    const user = await getUserInfo(req);

    const link = new ScamLink({
      _id: uuidv4(),
      link: body.link,
      type: body.type,
      reportedBy: body.reportedBy,
      reportedByID: user.userId,
    });

    const newLink = await link.save();
    res.send({
      message: "Link reported!",
      link: newLink.link,
      type: newLink.type,
      reportedBy: newLink.reportedBy,
      reportedByID: newLink.reportedByID,
      dateReported: newLink.dateCreated,
    });
  }
);

/**
 * @swagger
 * /v4/scam/links/check:
 *   get:
 *     tags:
 *       - /v4
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
router.get("/check", async (req, res) => {
  const query = req.query;
  const body = req.body;

  const url = query.url;
  const link = body.link;

  const dbQuery = { link: link };

  if (!url) {
    if (!link) {
      return res.status(400).send("No link provided!");
    }

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
    const urldbQuery = { link: url };

    const linkExists = await ScamLink.findOne(urldbQuery);

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
