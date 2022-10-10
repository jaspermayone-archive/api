/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import express from "express";
import "dotenv/config";
import { body, validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";

import { checkExternal } from "../../functions/external/checkExternal";
import { reportExternal } from "../../functions/external/reportExternal";
import { flattenLink } from "../../functions/flattenLink";
import { getUserInfo } from "../../functions/getUserInfo";
import ScamLink from "../../models/Link";

const env = process.env.NODE_ENV;
const changelogUrl = process.env.DB_CHANGELOG_URL;
const avatarUrl = process.env.AVATAR_URL;

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

    const flatLink = await flattenLink(body.link);

    const query = { link: flatLink };

    const linkExists = await ScamLink.findOne(query);
    if (linkExists) {
      return res.status(400).send("Link already flagged!");
    }

    const user = await getUserInfo(req, res);
    const scamlink = flatLink;

    const reportExternalData = await reportExternal(scamlink);

    const link = new ScamLink({
      id: uuidv4(),
      link: scamlink,
      type: body.type,
      reportedBy: body.reportedBy,
      reportedByID: user.userId,
    });

    const newLink = await link.save();

    res.status(200).json({
      message: "Link reported!",
      link: newLink.link,
      type: newLink.type,
      reportedBy: newLink.reportedBy,
      reportedByID: newLink.reportedByID,
      dateReported: newLink.dateReported,
      externalReportData: reportExternalData,
    });

    axios.request({
      url: changelogUrl,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        username: "DB Changelog Reporter",
        avatar_url: avatarUrl,
        embeds: [
          {
            title: "New Scam Link Reported",
            description:
              `**Link:** ${newLink.link}` +
              `
**Type:** ${newLink.type}
**Reported By:** ${newLink.reportedBy}
**Reported By ID:** ${newLink.reportedByID}
**Date Reported:** ${newLink.dateReported}`,
            color: 16711680,
          },
        ],
      },
    });
  }
);

/**
 * @swagger
 * /v4/scam/links/report/bulk:
 *   post:
 *     tags:
 *       - /v4
 *     summary: Bulk report links as scam
 *     produces: application/json
 *     parameters:
 *       - in: header
 *         name: links
 *         description: array of links to report
 *         schema:
 *           type: array
 *           example: ["101nitro2.com", "1111sa2le.us"]
 *         required: true
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
// create bulk report endpoint
router.post(
  "/links/report/bulk",
  body("links").isArray(),
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const body = req.body;
    const links = body.links;
    const user = await getUserInfo(req, res);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reportedLinks: any = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reportExternalData: any = [];
    const alreadyReportedLinks: string[] = [];

    for (const link of links) {
      const flatLink = await flattenLink(link);

      const query = { link: flatLink };
      const linkExists = await ScamLink.findOne(query);
      if (linkExists) {
        alreadyReportedLinks.push(flatLink);
      } else {
        const scamlink = flatLink;
        const newLink = new ScamLink({
          id: uuidv4(),
          link: scamlink,
          type: "unknown",
          reportedBy: user.name,
          reportedByID: user.userId,
        });
        const savedLink = await newLink.save();
        reportedLinks.push(savedLink);

        const reportExternalDataRES = await reportExternal(scamlink);
        reportExternalData.push(reportExternalDataRES);
      }
    }
    res.status(200).json({
      message: "Links reported!",
      reportedLinks: reportedLinks,
      alreadyReportedLinks: alreadyReportedLinks,
      externalReportData: reportExternalData,
    });

    axios.request({
      url: changelogUrl,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        username: "DB Changelog Reporter",
        avatar_url: avatarUrl,
        embeds: [
          {
            title: "Bulk Scam Link Report",
            description: `**User:** ${user.name} (${user.userId})\n**Environment:** ${env}\n**Links:** ${links}`,
            color: 16711680,
          },
        ],
      },
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
  // eslint-disable-next-line init-declarations
  let flatLink;

  const dbQuery = { link: flatLink };

  if (!url) {
    scamlink = body.link;
    // eslint-disable-next-line require-atomic-updates
    flatLink = await flattenLink(scamlink);

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
      checkExternal(flatLink).then(async (result) => {
        if (!result) {
          return res.status(500).send("Error checking link!");
        }

        if (result.scamDetected === false) {
          res.json({
            scamDetected: false,
          });
        } else {
          const user = await getUserInfo(req, res);

          const link = new ScamLink({
            id: uuidv4(),
            link: flatLink,
            type: "unknown",
            reportedBy: result.source,
            reportedByID: user.userId,
          });

          await link.save();
          res.json({
            scamDetected: true,
            native: false,
            source: result.source,
          });
        }
      });
    }
  }

  if (url) {
    // eslint-disable-next-line require-atomic-updates
    scamlink = query.url;
    // eslint-disable-next-line require-atomic-updates
    flatLink = await flattenLink(scamlink);

    const urldbQuery = { link: flatLink };

    const linkExists = await ScamLink.findOne(urldbQuery);

    if (linkExists) {
      res.json({
        scamDetected: true,
        native: true,
      });
    } else {
      checkExternal(flatLink).then(async (result) => {
        if (!result) {
          return res.status(500).send("Error checking link!");
        }

        if (result.scamDetected === false) {
          res.json({
            scamDetected: false,
          });
        } else {
          const user = await getUserInfo(req, res);

          const link = new ScamLink({
            id: uuidv4(),
            link: flatLink,
            type: "unknown",
            reportedBy: result.source,
            reportedByID: user.userId,
          });

          await link.save();
          res.json({
            scamDetected: true,
            native: false,
            source: result.source,
          });
        }
      });
    }
  }
});

export default router;
