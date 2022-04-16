import express from "express";
import actuator from "express-actuator";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import cors from 'cors';
import jsonwebtoken from "jsonwebtoken";
const jwt = jsonwebtoken;
import bcryptjs from "bcryptjs";
const bcrypt = bcryptjs;
import "dotenv/config";

import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import { loginValidation } from "./utils/validation.js";
import User from "./models/User.js";

const authServer = express();

authServer.use(Sentry.Handlers.requestHandler());
authServer.use(Sentry.Handlers.tracingHandler());
authServer.use(Sentry.Handlers.errorHandler());

authServer.use(express.json());
authServer.use(bodyParser.json());
authServer.use(compression());
authServer.use(actuator());
authServer.use(helmet());
authServer.use(cors())


function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  }

authServer.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Can not find user");

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = generateAccessToken({ id: user._id });

      res.json({
        accessToken: accessToken,
      });
    } else {
      res.send("Not allowed");
    }
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
});

export default authServer;
