import * as Sentry from "@sentry/node";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import express from "express";
import actuator from "express-actuator";
import {rateLimit} from "express-rate-limit";
import {routeCheck} from "express-suite";
import helmet from "helmet";
import errorHandler from "node-error-handler";
import "dotenv/config";

import swaggerUi from "swagger-ui-express";

import {authToken} from "./middlewear/authToken";
import {isAdmin} from "./middlewear/isAdmin";
import adminRoutes from "./routes/admin";
import apiRoute from "./routes/api";
import authRoutes from "./routes/auth";
import {apiSpecs} from "./utils/apiSpecs";

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
app.use(errorHandler({debug: true, trace: true, camel_case: true}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(compression());
app.use(actuator());
app.use(helmet());
app.use(cors(corsOptions));
app.use(limiter);

app.get("/", (req, res) => {
  res.redirect("/docs");
});

app.get("/api/docs", (req, res) => {
  res.redirect("/docs");
});

app.use("/auth", authRoutes);
app.use("/api/v0", authToken, apiRoute);
app.use("/admin", isAdmin, adminRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(apiSpecs));

app.use(routeCheck(app));

export default app;
