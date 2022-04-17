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

// once db is connected
mongoose.connection.once("open", () => {
  console.log(
    chalk.magenta("Connected to Database at: " + process.env.MONGODB_URI_REMOTE)
  );
});

mongoose.connection.on("error", (err) => {
  console.log(
    chalk.red(
      "Error Connecting to MongoDB Instance at: " +
        chalk.blue(process.env.MONGODB_URI_REMOTE)
    )
  );
  console.log(chalk.red(err));
});

app.listen(PORT, () => {
  console.log(chalk.green(`API running at http://localhost:${PORT}`));
});
