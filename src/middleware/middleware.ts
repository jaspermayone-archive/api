import * as jwt from "jsonwebtoken";

import { getToken } from "../utils/getToken";

/**
 *
 * @param req
 * @param res
 * @param next
 */
export async function authToken(req, res, next) {
  const token = await getToken(req);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }
    req.user = user;

    next();
  });
}
