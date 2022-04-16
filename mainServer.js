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

const server = express();

server.use(Sentry.Handlers.requestHandler());
server.use(Sentry.Handlers.tracingHandler());
server.use(Sentry.Handlers.errorHandler());

server.use(express.json());
server.use(bodyParser.json());
server.use(compression());
server.use(actuator());
server.use(helmet());
server.use(cors());

server.get("/", (req, res) => {
  res.redirect("/api");
});

// server.use('/files', express.stat ic(path.join(__dirname, 'files')))
server.use("/api", authToken, apiRoute);

export default server;
