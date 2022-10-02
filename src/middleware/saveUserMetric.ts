import errorLogger from "../logger";
import { MetricsModel } from "../models/Metrics";
import { getLatitudeAndLongidute } from "../utils/getLatitudeAndLongitude";
import { v4 as uuidv4 } from "uuid";

export async function saveUserMetrics(req, res, next) {
  if (req.ipinfo.bogon) {
    const errorMessage = `Error: Bogon IP!`;
    console.log(req.ipinfo.IP);
    errorLogger({ message: errorMessage }, uuidv4(), req);
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
    longitude: getLatitudeAndLongidute(loc).longitude,
    latitude: getLatitudeAndLongidute(loc).latitude,
    urlAccessed: req.originalUrl,
  });
  // handle exception for await metric.save()
  try {
    await metric.save();
  } catch (error) {
    errorLogger(error, uuidv4(), req);
  }
  next();
}
