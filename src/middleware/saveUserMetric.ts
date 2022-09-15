import errorLogger from "../logger";
import Metrics from "../models/Metrics";
import { getLatitudeAndLongidute } from "../utils/getLatitudeAndLongitude";

export async function saveUserMetrics(req, res, next) {
  if (req.ipinfo.bogon) {
    const errorMessage = `Bogon IP!`;
    errorLogger(errorMessage, 400, req);
    return next();
  }
  const { ip, city, region, country, timezone, loc } = req.ipinfo;
  const metric = new Metrics({
    id: req.user.userId,
    ip: ip,
    city: city,
    region: region,
    country: country,
    timezone: timezone,
    ...getLatitudeAndLongidute(loc),
    urlAccessed: req.url,
  });
  console.log("Metric obj", metric);
  await metric.save();
  next();
}
