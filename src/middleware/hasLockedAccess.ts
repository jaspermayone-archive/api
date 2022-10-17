import * as jwt from "jsonwebtoken";

import { getToken } from "../functions/fx";

export async function hasLockedAccess(req, res, next) {
  const token = getToken(req);

  const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  // if jwt is invalid
  if (!decodedToken) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  // check to see if has locked access is not true
  if (!decodedToken.hasLockedAccess) {
    return res.status(401).send("UNATHORIZED. Special Access only.");
  } else {
    next();
  }
}
