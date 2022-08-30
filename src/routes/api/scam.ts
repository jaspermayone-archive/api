import axios from "axios";
import express from "express";
import "dotenv/config";
import { body, validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";

import ScamLink from "../../models/scam/Link";
import { checkExternal } from "../../utils/checkExternal";
import { getUserInfo } from "../../utils/getUserInfo";

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
  "/links/report",

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
    const scamlink = body.link;

    const link = new ScamLink({
      id: uuidv4(),
      link: scamlink,
      type: body.type,
      reportedBy: body.reportedBy,
      reportedByID: user.userId,
    });

    const newLink = await link.save();

    const reportWalshyAPI = await axios.post<{ message: string }>(
      "https://bad-domains.walshy.dev/report",
      {
        domain: scamlink,
      }
    );

    res.send({
      message: "Link reported!",
      link: newLink.link,
      type: newLink.type,
      reportedBy: newLink.reportedBy,
      reportedByID: newLink.reportedByID,
      dateReported: newLink.dateReported,
      walshyAPIresponse: reportWalshyAPI.data.message,
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
 *             native:
 *              type: boolean
 *       401:
 *        description: Unauthorized (No token provided)
 */
router.get("/links/check", async (req, res) => {
  const query = req.query;
  const body = req.body;

  const url = query.url;
  // eslint-disable-next-line init-declarations
  let scamlink;
  //const scamlink = body.link;

  const dbQuery = { link: scamlink };

  if (!url) {
    scamlink = body.link;

    if (!scamlink) {
      return res.status(400).send("No link provided!");
    }

    const linkExists = await ScamLink.findOne(dbQuery);

    if (linkExists) {
      res.json({
        scamDetected: true,
        native: true,
      });
    } else {
      checkExternal(scamlink).then(async (result) => {
        if (!result) {
          return res.status(500).send("Error checking link!");
        }

        if (result.scamDetected === false) {
          res.json({
            scamDetected: false,
          });
        } else {
          const user = await getUserInfo(req);

          const link = new ScamLink({
            id: uuidv4(),
            link: scamlink,
            type: "unknown",
            reportedBy: result.source,
            reportedByID: user.userId,
          });

          await link.save();
          res.json({
            scamDetected: true,
            native: false,
          });
        }
      });
    }
  }

  if (url) {
    // eslint-disable-next-line require-atomic-updates
    scamlink = query.url;

    const urldbQuery = { link: url };

    const linkExists = await ScamLink.findOne(urldbQuery);

    if (linkExists) {
      res.json({
        scamDetected: true,
        native: true,
      });
    } else {
      checkExternal(scamlink).then(async (result) => {
        if (!result) {
          return res.status(500).send("Error checking link!");
        }

        if (result.scamDetected === false) {
          res.json({
            scamDetected: false,
          });
        } else {
          const user = await getUserInfo(req);

          const link = new ScamLink({
            id: uuidv4(),
            link: scamlink,
            type: "unknown",
            reportedBy: result.source,
            reportedByID: user.userId,
          });

          await link.save();
          res.json({
            scamDetected: true,
            native: false,
          });
        }
      });
    }
  }
});

export default router;
