import express from "express";
import Sentry from "@sentry/node";

const router = express.Router();

async function restart(req, res) {

    await Sentry.close(2000).then(function () {
        res.send("Restarting...");
    }).finally(function () {
        process.exit(0);
    });
}

router.post("/", (req, res) => {
    restart(req, res);}
);

export default router;