import express from "express";
import "dotenv/config";


const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello from the metrics route!");
});

router.get('RequestsPerMinute', (req, res) => {
    // Calculate the number of requests per minute
    // and send it as a response
    res.send('Not implemented');
    //TODO: Implement RequestsPerMinute
});


router.get('latency', (req, res) => {
    // Calculate the average latency of the requests
    // and send it as a response
    res.send('Not implemented');
    //TODO: Implement latency
});

router.get('failureRate', (req, res) => {
    // Calculate the failure rate of the requests
    // and send it as a response
    res.send('Not implemented');
    //TODO: Implement failureRate
});

router.get('uptime', (req, res) => {
    // Calculate the uptime of the server
    // and send it as a response
    res.send('Not implemented');
    //TODO: Implement uptime
});

export default router;
