import mongoose, { Schema } from "mongoose";

interface IMetrics {
  id: string;
  ip: string;
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  urlAccessed: string;
  dateCreated: Date;
}

const metricsSchema = new Schema<IMetrics>({
  id: {
    type: String,
    required: true,
    unique: false,
  },
  ip: {
    type: String,
    required: true,
    unique: false,
  },
  city: {
    type: String,
    required: true,
    unique: false,
  },
  region: {
    type: String,
    required: true,
    unique: false,
  },
  country: {
    type: String,
    required: true,
    unique: false,
  },
  latitude: {
    type: Number,
    required: true,
    unique: false,
  },
  longitude: {
    type: Number,
    required: true,
    unique: false,
  },
  timezone: {
    type: String,
    required: true,
    unique: false,
  },
  urlAccessed: {
    type: String,
    required: true,
    unique: false,
  },
  dateCreated: {
    type: Date,
    required: true,
    unique: false,
    default: Date.now,
  },
});

//TODO: indexing
const MetricsModel = mongoose.model("Metrics", metricsSchema);

export { MetricsModel, IMetrics };
