import express from "express";
import { isAdminOrAccessingOwnData } from "../../middleware/isAdminOrAccessingOwnData";
import { MetricsModel } from "../../models/Metrics";
import getHistory from "../../utils/getHistory";
import { getLocationDetails } from "../../utils/getLocationDetails";

const router = express.Router();

/**
 * @swagger
 * /v4/metrics/location/{userId}:
 *    get:
 *      tags:
 *        - /v4/metrics
 *      parameters:
 *        - in: path
 *          name: userId
 *      summary: Fetch latest location of current calling user
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            type: "object"
 *            properties:
 *              city:
 *                type: string
 *              region:
 *                type: string
 *              country:
 *                type: string
 *        401:
 *          description: Unauthorized (No token provided)
 */
router.get(
  "/location/:userId",
  isAdminOrAccessingOwnData,
  async (req: any, res) => {
    const latestLocation = getLocationDetails(req.ipinfo);
    return res.status(200).json(latestLocation);
  }
);

/**
 * @swagger
 * /v4/metrics/usage/{userId}:
 *    get:
 *      tags:
 *        - /v4/metrics
 *      parameters:
 *        - in: path
 *          name: userId
 *      summary: Details of api calls by count
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            type: object
 *            properties:
 *              totalApiCalls:
 *                type: number
 *              apiUsageInfo:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    url:
 *                      type: string
 *                    count:
 *                      type: number
 *        401:
 *          description: Unauthorized (No token provided)
 */
router.get(
  "/usage/:userId",
  isAdminOrAccessingOwnData,
  async (req: any, res) => {
    const queryResult = await MetricsModel.aggregate([
      {
        $match: { id: req.user.userId },
      },
    ])
      .sortByCount("urlAccessed")
      .exec();

    let totalApiCalls = 0;
    const response = queryResult.map((entity) => {
      totalApiCalls += entity.count;
      return {
        url: entity._id,
        count: entity.count,
      };
    });

    return res.status(200).json({
      apiUsageInfo: response,
      totalApiCalls: totalApiCalls,
    });
  }
);

/**
 * @swagger
 * /v4/metrics/history/{userId}:
 *    get:
 *      tags:
 *        - /v4/metrics
 *      parameters:
 *        - in: path
 *          name: userId
 *      summary: History of api usage along with location from where api was called
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                ip:
 *                  type: string
 *                city:
 *                  type: string
 *                region:
 *                  type: string
 *                country:
 *                  type: string
 *                url:
 *                  type: string
 *                time:
 *                  type: string
 *                  format: date
 *        401:
 *          description: Unauthorized (No token provided)
 */
router.get(
  "/history/:userId",
  isAdminOrAccessingOwnData,
  async (req: any, res) => {
    const fromDateISO: string =
      req.query.fromDate?.toString() ?? new Date().toISOString();
    const fromDate = new Date(fromDateISO);
    const limit = Math.min((req.query.limit ?? 10) as number, 10);
    const queryResult = await MetricsModel.find({
      id: req.user.userId,
      dateCreated: { $lt: fromDate },
    }).limit(limit);

    const history = queryResult.map(getHistory);

    return res.status(200).json({
      history: history,
    });
  }
);

export default router;
