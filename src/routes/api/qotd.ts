import express from "express";
const router = express.Router();

import Qotd from "../../models/Qotd";

router.get("/", (req, res) => {
    res.redirect("/api/v0/qotd/random");
});

router.get("/random", async (req, res) => {
    const targetRecord = await Qotd.aggregate([{ $sample: { size: 1 } }]);
    res.send(targetRecord[0]);
});

export default router;