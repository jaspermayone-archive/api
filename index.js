import { createHttpTerminator } from "http-terminator";
import express from "express";
import actuator from "express-actuator";
//import createLightship from "lightship";
import bodyParser from "body-parser";
import compression from "compression";

import chalk from "chalk";
import ora from "ora";
import logSymbols from "log-symbols";
import "dotenv/config";

import checkoutRoutes from "./routes/checkout.js";
import webhookRoutes from "./routes/webhook.js";
import usageRoutes from "./routes/usage.js";
import apiRoutes from "./routes/api.js";
import adminRoutes from "./routes/admin.js";

import { handle404, logErrors, handleErrors } from "./handleErrors.js";

//const lightship = createLightship();
const PORT = process.env.PORT;
const app = express();

// Actuator provides the /health endpoint
// Actuator provides the /info endpoint
// Actuator provides the /metrics endpoint
const actuatorOptions = {
  basePath: "/admin",
  infoGitMode: "full",
  infoBuildOptions: null, // extra information you want to expose in the build object. Requires an object.
  infoDateFormat: null, // by default, git.commit.time will show as is defined in git.properties. If infoDateFormat is defined, moment will format git.commit.time. See https://momentjs.com/docs/#/displaying/format/.
  customEndpoints: [],
};
app.use(cacheWithRedis("1 hour"));
app.use(bodyParser.json());
app.use(compression());
app.use(actuator(actuatorOptions));

app.use(handle404);
app.use(logErrors);
app.use(handleErrors);

app.use("/checkout", checkoutRoutes);
app.use("/webhook", webhookRoutes);
app.use("/usage", usageRoutes);
// app.use('/files', express.static(path.join(__dirname, 'files')))
app.use("/api", apiRoutes);
app.use("/admin", adminRoutes);

const server = app.listen(PORT, () => {
  // lightship.signalReady();
  console.log(
    chalk.green(
      logSymbols.success,
      `Server started on http://localhost:${PORT}`
    )
  );
});

const httpTerminator = createHttpTerminator({
  server,
});

export default apicache;

// CALL BELLOW LINE TO TERMINATE SERVER
// await httpTerminator.terminate();
