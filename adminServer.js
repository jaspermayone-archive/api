import express from "express";
import actuator from "express-actuator";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import "dotenv/config";

import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import usersRoutes from "./routes/admin.js";
import metricsRoutes from "./routes/admin/metrics.js";

const adminServer = express();

adminServer.use(Sentry.Handlers.requestHandler());
adminServer.use(Sentry.Handlers.tracingHandler());
adminServer.use(Sentry.Handlers.errorHandler());

adminServer.use(express.json());
adminServer.use(bodyParser.json());
adminServer.use(helmet());

adminServer.use("/metrics", metricsRoutes);
adminServer.use("/users", usersRoutes);

adminServer.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

export default adminServer;
