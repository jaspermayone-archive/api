import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import mongoose from "mongoose";
import colors from "colors";

import "dotenv/config";

import { loadPM2 } from "./modules/loadPM2";

import app from "./app";
const PORT = process.env.PORT;

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.npm_package_version,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
  attachStacktrace: true,
  autoSessionTracking: true,
});

console.log(colors.yellow("Sentry Connected!"));

mongoose.connect(`${process.env.MONGODB_URI_REMOTE}`);

mongoose.connection.on("open", () => {
  console.log(colors.magenta("MongoDB Connected at: " + `${process.env.MONGODB_URI_REMOTE}`));
});

mongoose.connection.on("error", (err) => {
  console.log(colors.red(`MongoDB Error: \n${err}`));
});

app.listen(PORT, () => {
  console.log(colors.green(`API running at http://localhost:${PORT}`));
});