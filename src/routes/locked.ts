import express from "express";

import ScamLink from "../models/Link";

const router = express.Router();

router.get("/scam/links", (req, res) => {
  // return an array of all Scam Links in the database
  ScamLink.find({}, (error, links) => {
    // get all the links from each link
    const allLinks = links.map((link) => {
      return link.link;
    });
    // return array of all links
    res.json(allLinks);
  });
});

export default router;
