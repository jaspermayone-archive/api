import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import health from "express-ping";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";

import { apiSpecs } from "./functions/apiSpecs";
import errorLogger from "./logger";
import { authToken } from "./middleware/middleware";
import { rateLimiterMiddleware } from "./middleware/rateLimitController";
import apiRoute from "./routes/api";
import authRoutes from "./routes/auth";

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(helmet());
app.use(health.ping());
app.use(cors());

// redirect /v4 to new unversioned system
app.use("/v4", (req, res) => {
  res.redirect("/");
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(apiSpecs));
app.use("/auth", authRoutes);
app.use("/", rateLimiterMiddleware, authToken, apiRoute);

// catch all errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  const errorID = uuidv4();
  errorLogger(err, errorID, req);
  res.status(500).json({
    message:
      "Please contact a developer in our discord support server, and provide the information below.",
    error: err.message,
    errorID,
  });
});

export default app;
