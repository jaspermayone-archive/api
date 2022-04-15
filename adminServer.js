import express from "express";
import actuator from "express-actuator";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import cors from 'cors';
import "dotenv/config";

import adminRoutes from "./routes/admin.js";

const adminServer = express();

adminServer.use(express.json());
adminServer.use(bodyParser.json());
adminServer.use(compression());
adminServer.use(actuator());
adminServer.use(helmet());
adminServer.use(cors())

adminServer.use("/", adminRoutes);

export default adminServer;