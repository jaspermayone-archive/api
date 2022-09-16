import express from "express";
import { MetricsModel } from "../../models/Metrics";
import { getLocationDetails } from "../../utils/getLocationDetails";

const router = express.Router();

router.get("/location", async (req, res) => {
  const queryResult = await MetricsModel.find({
    dateCreated: { $lt: Date.now() },
  })
    .limit(1)
    .exec();

  if (queryResult.length == 0) {
    return res.send("Couldn't track latest location!");
  }

  const latestLocation = getLocationDetails(queryResult[0]);
  return res.status(200).json(latestLocation);
});

export default router;
