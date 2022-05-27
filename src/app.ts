import path from "path";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import correlator from "express-correlation-id";
import health from "express-ping";
import rateLimit from "express-rate-limit";
import status from "express-status-monitor";
import helmet from "helmet";
import favicon from "serve-favicon";
import swaggerUi from "swagger-ui-express";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";

import errorLogger from "./logger";
import { isAdmin } from "./middleware/isAdmin";
import { authToken } from "./middleware/middleware";
import adminRoutes from "./routes/admin";
import apiRoute from "./routes/api";
import authRoutes from "./routes/auth";
import { apiSpecs } from "./utils/apiSpecs";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(health.ping());
app.use(cors());
app.use(correlator());
app.use(status());

app.get("/", (req, res) => {
  res.redirect("/docs");
});

app.get("/api/docs", (req, res) => {
  res.redirect("/docs");
});

app.use("/auth", limiter, authRoutes);
app.use("/api/v0", limiter, authToken, apiRoute);
app.use("/admin", limiter, isAdmin, adminRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(apiSpecs));

// catch all errors
app.use((err, req, res, next) => {
  const errorID = uuidv4();
  errorLogger(err, errorID, req);
  res.status(500).json({
    message:
      "Please contact a developer in our discord support server, and provide the information below.",
    error: err.message,
    errorID,
    requestID: req.correlationId(),
  });
});

export default app;
