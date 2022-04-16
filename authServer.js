import express from "express";
import actuator from "express-actuator";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import cors from 'cors';
import jsonwebtoken from "jsonwebtoken";
const jwt = jsonwebtoken;
import bcryptjs from "bcryptjs";
const bcrypt = bcryptjs;
import "dotenv/config";

import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import loginRoute from "./routes/authRoutes/login.js";

const authServer = express();

authServer.use(Sentry.Handlers.requestHandler());
authServer.use(Sentry.Handlers.tracingHandler());
authServer.use(Sentry.Handlers.errorHandler());

authServer.use(express.json());
authServer.use(bodyParser.json());
authServer.use(compression());
authServer.use(actuator());
authServer.use(helmet());
authServer.use(cors())


authServer.use("/login", loginRoute);

export default authServer;
