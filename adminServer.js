import express from "express";
import actuator from "express-actuator";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import "dotenv/config";

import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import adminRoutes from "./routes/admin.js";

const adminServer = express();

adminServer.use(Sentry.Handlers.requestHandler());
adminServer.use(Sentry.Handlers.tracingHandler());
adminServer.use(Sentry.Handlers.errorHandler());

adminServer.use(express.json());
adminServer.use(bodyParser.json());
adminServer.use(compression());
adminServer.use(actuator());
adminServer.use(helmet());
adminServer.use(cors());

adminServer.use("/", adminRoutes);

adminServer.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

export default adminServer;
