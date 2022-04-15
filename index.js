import mongoose from "mongoose";
import chalk from "chalk";
import "dotenv/config";

import server from "./mainServer.js";
import authServer from "./authServer.js";
import adminServer from "./adminServer.js";

const serverPort = process.env.SERVER_PORT;
const authServerPort = process.env.AUTH_SERVER_PORT;
const adminServerPort = process.env.ADMIN_SERVER_PORT;

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

server.listen(serverPort, () => {
  console.log(chalk.green(`API running at http://localhost:${serverPort}`));
});

authServer.listen(authServerPort, () => {
  console.log(
    chalk.green(`Auth Server running at http://localhost:${authServerPort}`)
  );
});

adminServer.listen(adminServerPort, () => {
  console.log(
    chalk.green(`Admin Server running at http://localhost:${adminServerPort}`)
  );
});
