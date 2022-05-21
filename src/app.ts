import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import health from "express-ping";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(limiter);
app.use(health.ping());
app.use(cors());

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

// catch all errors
app.use((err, req, res, next) => {
  const errorID = uuidv4();
  errorLogger(err, errorID);
  res.status(500).json({
    error: err.message,
    errorID,
  });
});

export default app;
