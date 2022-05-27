import jsonwebtoken from "jsonwebtoken";

import { getToken } from "../utils/getToken";

const jwt = jsonwebtoken;

export async function isAdmin(req, res, next) {
  const token = getToken(req);

  const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (decodedToken.accountType !== "admin") {
    return res.status(401).send("UNATHORIZED. Admin only");
  } else {
    next();
  }
}
