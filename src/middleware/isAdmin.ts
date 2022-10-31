import * as jwt from "jsonwebtoken";

import { getToken } from "../functions/getToken";

export async function isAdmin(req, res, next) {
  const token = getToken(req);

  const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  // if jwt is invalid
  if (!decodedToken) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (decodedToken.accountType !== "admin") {
    return res.status(401).send("UNATHORIZED. Admin only");
  } else {
    next();
  }
}
