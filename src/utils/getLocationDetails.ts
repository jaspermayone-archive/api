import { IMetrics } from "../models/Metrics";

export function getLocationDetails(metrics: IMetrics): Partial<IMetrics> {
  const locationInfo = {
    city: metrics.city,
    region: metrics.region,
    country: metrics.country,
    latitude: metrics.latitude,
    longitude: metrics.longitude,
  };
  return locationInfo;
}
