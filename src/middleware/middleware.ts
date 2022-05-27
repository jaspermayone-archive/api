import jsonwebtoken from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { getToken } from "../utils/getToken";

const jwt = jsonwebtoken;

/**
 *
 * @param req
 * @param res
 * @param next
 */
export function authToken(req, res, next) {
  const token = getToken(req);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }
    req.user = user;
    next();
  });
}
