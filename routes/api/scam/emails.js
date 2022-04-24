import express from "express";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";

import ScamEmail from "../../../models/scam/Email.js";

const router = express.Router();

router.post("/report", async (req, res) => {

    const emailExists = await ScamEmail.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send("Email already flagged!");

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const email = new ScamEmail({
        _id: uuidv4(),
        email: req.body.email,
        reportedBy: req.body.reportedBy,
        reportedByID: decodedToken.userId,
    });

    try {
        const newEmail = await email.save();
        res.send({
            message: "Email reported!",
            email: newEmail.email,
            reportedBy: newEmail.reportedBy,
            reportedByID: newLink.reportedByID,
            dateReported: newEmail.dateCreated,
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/check", async (req, res) => {

    const email = req.body.email;
    if (!email) return res.status(400).send("No email provided!");

    const emailExists = await ScamEmail.findOne({ email: req.body.email });

    if (emailExists) {
        res.send("Email is a scam!");
    } else {
        res.send(
            "Email is not registered in our scam database! If you believe this is a scam, please report it using the /report endpoint!"
        );
    }
});

export default router;