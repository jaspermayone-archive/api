import express from "express";
import actuator from "express-actuator";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import errorHandler from "node-error-handler";
import { routeCheck } from 'express-suite';
import { rateLimit } from "express-rate-limit";
import * as Sentry from "@sentry/node";
import "dotenv/config";

import { authToken } from "./middlewear/authToken";
import { isAdmin } from "./middlewear/isAdmin";

import apiRoute from "./routes/api";
import adminRoutes from "./routes/admin";
import loginRoute from "./routes/login";

const corsOptions = {
  credentials: true,
  maxAge: 3600,
  preflightContinue: true,
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const app = express();

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler({ debug: true, trace: true, camel_case: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(actuator());
app.use(helmet());
app.use(cors(corsOptions));
app.use(limiter);

app.get("/", (req, res) => {
  res.send(
    `<h1>Welcome to the API</h1>
    <p>You can find the API documentation <a href="/api/docs">here</a></p>`
  );
});

app.use("/login", loginRoute);
app.use("/api/v0", authToken, apiRoute);
app.use("/admin", isAdmin, adminRoutes);

app.use(routeCheck(app));

export default app;
