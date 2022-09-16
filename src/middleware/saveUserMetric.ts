import errorLogger from "../logger";
import { MetricsModel } from "../models/Metrics";
import { getLatitudeAndLongidute } from "../utils/getLatitudeAndLongitude";

export async function saveUserMetrics(req, res, next) {
  if (req.ipinfo.bogon) {
    const errorMessage = `Error: Bogon IP!`;
    errorLogger({ message: errorMessage }, 400, req);
    return next();
  }

  const { ip, city, region, country, timezone, loc } = req.ipinfo;
  const metric = new MetricsModel({
    id: req.user.userId,
    ip: ip,
    city: city,
    region: region,
    country: country,
    timezone: timezone,
    ...getLatitudeAndLongidute(loc),
    urlAccessed: req.url,
  });

  await metric.save(); // TODO: Handle exception
  next();
}
