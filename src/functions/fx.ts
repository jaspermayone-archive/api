import { IMetrics } from "../models/Metrics";

export function getToken(req) {
  // get berer token from header
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    return bearerToken;
  }
  return null; // if not found
}

export default function getHistory(metric: Partial<IMetrics>) {
  return {
    ip: metric.ip,
    city: metric.city,
    region: metric.region,
    country: metric.country,
    url: metric.urlAccessed,
    time: metric.dateCreated,
  };
}

export function getLatitudeAndLongidute(location: string) {
  const [latitude, longitude] = location.split(",");
  return {
    latitude: latitude,
    longitude: longitude,
  };
}

export function getLocationDetails(metrics: any): Partial<IMetrics> {
  const locationInfo = {
    city: metrics.city,
    region: metrics.region,
    country: metrics.country,
  };
  return locationInfo;
}
