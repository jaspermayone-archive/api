import app from "./app.js";
import mongoose from "mongoose";
// started implementing testing following this guide:
// https://dev.to/franciscomendes10866/testing-express-api-with-jest-and-supertest-3gf
import { request } from "supertest";
import chalk from "chalk";
import "dotenv/config";

const PORT = process.env.PORT;

const start = (port) => {
  try {
    mongoose.connect(process.env.MONGODB_URI_REMOTE, {
      useNewUrlParser: true,
    });
    console.log(
      chalk.green(
        "API Connected to MongoDB Instance at: " +
          chalk.blue(process.env.MONGODB_URI_REMOTE)
      )
    );
  } catch (error) {
    console.log(chalk.red(error));
  }

  try {
    app.listen(port, () => {
      console.log(chalk.green(`API running at http://localhost:${port}`));
    });
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

start(PORT);
