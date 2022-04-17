import express from "express";
import actuator from "express-actuator";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";

import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import "dotenv/config";

import { authToken } from "./utils/authToken.js";

import apiRoute from "./routes/api.js";
import usersRoutes from "./routes/admin.js";
import loginRoute from "./routes/login.js";
import metricsRoutes from "./routes/admin/metrics.js";

const app = express();

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(actuator());
app.use(helmet());
app.use(cors());

app.get("/", (req, res) => {
  res.redirect("/api/v0");
});

// app.use('/files', express.stat ic(path.join(__dirname, 'files')))
app.use("/api/v0", authToken, apiRoute);
app.use("/login", loginRoute);
app.use("/users", usersRoutes);

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

export default app;
