import { IMetrics } from "../models/Metrics";

export function getLocationDetails(metrics: any): Partial<IMetrics> {
  const locationInfo = {
    city: metrics.city,
    region: metrics.region,
    country: metrics.country,
  };
  return locationInfo;
}
