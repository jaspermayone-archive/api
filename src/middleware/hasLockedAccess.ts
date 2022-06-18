import jsonwebtoken from "jsonwebtoken";

import { getToken } from "../utils/getToken";

const jwt = jsonwebtoken;

export async function hasLockedAccess(req, res, next) {
    const token = getToken(req);

    const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decodedToken.hasLockedAccess !== "true") {
        return res.status(401).send("UNATHORIZED. Special Access only.");
    } else {
        next();
    }
}
