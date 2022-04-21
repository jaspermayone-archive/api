import express from "express";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import mongoose from "mongoose";
import chalk from "chalk";
import "dotenv/config";

import app from "./app.js";
const PORT = process.env.PORT;

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

console.log(chalk.yellowBright('Sentry Connected!'));

mongoose.connect(process.env.MONGODB_URI_REMOTE, {
  useNewUrlParser: true,
});

// once connected to the database, print success message
mongoose.connection.on("open", () => {
  console.log(chalk.magenta("MongoDB Connected at: ") + chalk.blue(process.env.MONGODB_URI_REMOTE));
});

// on error, print error message
mongoose.connection.on("error", (err) => {
  console.log(chalk.redBright("MongoDB Error: ", err));
});

app.listen(PORT, () => {
  console.log(chalk.green(`API running at http://localhost:${PORT}`));
});