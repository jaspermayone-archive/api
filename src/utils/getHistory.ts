import { IMetrics } from "../models/Metrics";

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
