import http from "http";
import express from "express";
import actuator from "express-actuator";
//import createLightship from "lightship";
import bodyParser from "body-parser";
import compression from "compression";

import chalk from "chalk";
import "dotenv/config";

import checkoutRoutes from "./routes/checkout.js";
import webhookRoutes from "./routes/webhook.js";
import usageRoutes from "./routes/usage.js";
import apiRoutes from "./routes/api.js";

import { handle404, logErrors, handleErrors } from "./handleErrors.js";

//const lightship = createLightship();
const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(compression());
app.use(actuator())


app.get("/", (req, res) => {
  res.redirect("/api");
});

app.use("/checkout", checkoutRoutes);
app.use("/webhook", webhookRoutes);
app.use("/usage", usageRoutes);
// app.use('/files', express.static(path.join(__dirname, 'files')))
app.use("/api", apiRoutes);

app.use(handle404);
app.use(logErrors);
app.use(handleErrors);

const server = app.listen(PORT, () => {
  // lightship.signalReady();
  console.log(chalk.green(`Server started on http://localhost:${PORT}`));
});