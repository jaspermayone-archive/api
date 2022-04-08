import express from "express";
import actuator from "express-actuator";
import bodyParser from "body-parser";
import compression from "compression";


import chalk from "chalk";
//import winston from "winston";
import mongoose from "mongoose";
import "dotenv/config";

import authRoute from "./routes/auth.js";
import webhookRoute from "./routes/webhook.js";
import checkoutRoute from "./routes/checkout.js";
import usageRoute from "./routes/usage.js";
import apiRoute from "./routes/api.js";

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(compression());
app.use(actuator());

app.get("/", (req, res) => {
  res.redirect("/api");
});

app.use('/auth', authRoute);
app.use("/webhook", webhookRoute);
app.use("/checkout", checkoutRoute);
app.use("/usage", usageRoute);
// app.use('/files', express.stat ic(path.join(__dirname, 'files')))
app.use("/api", apiRoute);

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

const server = app.listen(PORT, "localhost", () => {
  console.log(chalk.green(`Server started on port ${PORT}`));
});
