import * as jwt from "jsonwebtoken";

import { getToken } from "./getToken";

/**
 *
 * @param req
 * @param res
 */
export async function getUserInfo(req, res) {
  const token = await getToken(req);

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const { userId, name, email, accountType, hasLockedAccess, dateCreated } =
    decoded as {
      userId: string;
      name: string;
      email: string;
      accountType: string;
      hasLockedAccess: boolean;
      dateCreated: Date;
    };
  return { userId, name, email, accountType, hasLockedAccess, dateCreated };
}
