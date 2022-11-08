import { promisify } from "util";
import colors from "colors";
import mongoose from "mongoose";
import redis from "redis";

import "dotenv/config";

import app from "./app";
import { validateEnv } from "./functions/validateEnv";

const PORT = process.env.PORT;

void (async () => {
  console.log(colors.yellow("Validating environment variables..."));
  const validatedEnv = await validateEnv();
  if (!validatedEnv.valid) {
    console.error(colors.red(validatedEnv.message));
    process.exit(1);
  }

  console.log(`Connecting to MongoDB...`.yellow);
  const connection = await mongoose.connect(`${process.env.MONGODB_URI}`);

  if (!connection) {
    console.error(`Error connecting to MongoDB`.red);
    process.exit(1);
  }

  console.log(`Connected to MongoDB`.green);

  mongoose.connection.on("error", (err) => {
    console.log(colors.red(`MongoDB Error: \n${err}`));
  });

  const application = await app.listen(PORT, () => {
    console.log(colors.green(`API running at http://localhost:${PORT}`));
  });

  if (!application || !connection) {
    console.error(colors.red("Error starting API"));
    process.exit(1);
  }
})();
