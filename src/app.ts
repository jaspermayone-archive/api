import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import ExpressBrute from "express-brute";
import health from "express-ping";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";

import errorLogger from "./logger";
import { hasLockedAccess } from "./middleware/hasLockedAccess";
import { isAdmin } from "./middleware/isAdmin";
import { authToken } from "./middleware/middleware";
import adminRoutes from "./routes/admin";
import apiRoute from "./routes/api";
import authRoutes from "./routes/auth";
import lockedRoutes from "./routes/locked";
import { apiSpecs } from "./utils/apiSpecs";

const app = express();

const store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
const bruteforce = new ExpressBrute(store, {
  freeRetries: 5,
  minWait: 5 * 60 * 1000, // 5 minutes
  maxWait: 60 * 60 * 1000, // 1 hour
  failCallback: (req, res, nextValidRequestDate) => {
    res.status(429).json({
      error: "Too many requests, please try again later.",
      nextValidRequestDate: nextValidRequestDate,
    });
  },
});

app.use(express.json());
app.use(bodyParser.json());
app.use(helmet());
app.use(health.ping());
app.use(cors());

app.get("/", (req, res) => {
  res.redirect("/docs");
});

app.use("/auth", bruteforce.prevent, authRoutes);
app.use("/v4", bruteforce.prevent, authToken, apiRoute);
app.use("/locked/all", bruteforce.prevent, hasLockedAccess, lockedRoutes);
app.use("/admin", bruteforce.prevent, isAdmin, adminRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(apiSpecs));

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
