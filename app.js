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
import { isAdmin } from "./utils/isAdmin.js";

import apiRoute from "./routes/api.js";
import adminRoutes from "./routes/admin.js";
import loginRoute from "./routes/login.js";

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
  res.send(
    `<h1>Welcome to the API</h1>
    <p>You can find the API documentation <a href="/api/docs">here</a></p>`
  );
});

app.use("/login", loginRoute);
app.use("/api/v0", authToken, apiRoute);
app.use("/admin", isAdmin, adminRoutes);


export default app;
