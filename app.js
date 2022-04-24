import express from "express";
import actuator from "express-actuator";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import errorHandler from "node-error-handler";
import { routeCheck, emptyInputCheck } from 'express-suite';
import failExpress from "fail-express";

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
app.use(errorHandler({ debug: true, trace: true, camel_case: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(actuator());
app.use(helmet());
app.use(cors());

app.use(
  emptyInputCheck({
    checkGet: true, //Wether to check the GET requests or not
    emptyBodyMsg: 'Empty BODY', //Custom msg for empty body
    emptyFieldMsg: 'Empty FIELD', //Custom msg for missing fields
    supressFieldKey: false, //To supress the key of the missing field
  }),
);

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
app.use(failExpress());

export default app;
