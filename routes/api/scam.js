import express from "express";
const router = express.Router();

import linksRoute from './scam/links.js';

router.get('/', (req, res) => {
    res.send(
        `<h1>Welcome to the API</h1>
        <p>You can find the API documentation <a href="/api/docs">here</a></p>`
    );
});

router.use('/links', linksRoute);

export default router;
