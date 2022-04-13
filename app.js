import express from "express";
import actuator from "express-actuator";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import cors from 'cors';

import chalk from "chalk";
//import winston from "winston";
import mongoose from "mongoose";
import "dotenv/config";

import webhookRoute from "./routes/webhook.js";
import checkoutRoute from "./routes/checkout.js";
import usageRoute from "./routes/usage.js";
import apiRoute from "./routes/api.js";
import adminRoutes from "./routes/admin.js";
import loginRoute from "./routes/login.js";

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(compression());
app.use(actuator());
app.use(helmet());
app.use(cors())

app.get("/", (req, res) => {
  res.redirect("/api");
});

app.use("/webhook", webhookRoute);
app.use("/checkout", checkoutRoute);
app.use("/usage", usageRoute);
// app.use('/files', express.stat ic(path.join(__dirname, 'files')))
app.use("/api", apiRoute);
app.use("/admin", adminRoutes);
app.use("/login", loginRoute);


export default app;