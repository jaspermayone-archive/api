import http from "http";
import express from "express";
import actuator from "express-actuator";
//import createLightship from "lightship";
import bodyParser from "body-parser";
import compression from "compression";

import chalk from "chalk";
//import winston from "winston";
import mongoose from "mongoose";
import "dotenv/config"

import checkoutRoutes from "./routes/checkout.js";
import webhookRoutes from "./routes/webhook.js";
import usageRoutes from "./routes/usage.js";
import apiRoutes from "./routes/api.js";

//const lightship = createLightship();
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(compression());
app.use(actuator());

app.get("/", (req, res) => {
  res.redirect("/api");
});

app.use("/checkout", checkoutRoutes);
app.use("/webhook", webhookRoutes);
app.use("/usage", usageRoutes);
// app.use('/files', express.static(path.join(__dirname, 'files')))
app.use("/api", apiRoutes);

app.use(logErrors);
app.use(handleErrors);

mongoose.connect(process.env.MONGODB_URI_REMOTE, {
  useNewUrlParser: true,
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error(chalk.red(error));
});

db.once("open", () => {
  console.log(
    chalk.green(
      "API Connected to MongoDB Instance at: " +
        chalk.blue(process.env.MONGODB_URI_REMOTE)
    )
  );
});

const server = app.listen(PORT, HOST, () => {
  // lightship.signalReady();
  console.log(chalk.green(`Server started on http://${HOST}:${PORT}`));
});
