import healthCheck from "@nymdev/health-check";
import express from "express";
import { v4 as uuidv4 } from "uuid";

import errorLogger from "../logger";

import jokeRoutes from "./admin/jokes";
import qotdRoutes from "./admin/qotd";
import quoteRoutes from "./admin/quotes";
import restartRoute from "./admin/restart";
import userRoutes from "./admin/users";

const router = express.Router();

router.use(healthCheck({}));

router.use("/users", userRoutes);
router.use("/jokes", jokeRoutes);
router.use("/quotes", quoteRoutes);
router.use("/qotd", qotdRoutes);
router.use("/restart", restartRoute);

router.get("/error", (req, res) => {
    try {
        // code that will throw an error
        throw new Error("Test error from admin route");
      } catch (error) {
        const errorID = uuidv4();
        errorLogger(error, errorID);
        res.status(500).send({ error: `${error}`, errorID: `${errorID}` });
      }
});

export default router;
