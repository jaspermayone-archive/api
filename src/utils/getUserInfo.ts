import jsonwebtoken from "jsonwebtoken";

import { getToken } from "./getToken";

const jwt = jsonwebtoken;

/**
 *
 * @param req
 * @param res
 */
export async function getUserInfo(req) {
  const token = await getToken(req);

  const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const { userId, name, email, accountType, hasLockedAccess, dateCreated } = decoded as {
    userId: string;
    name: string;
    email: string;
    accountType: string;
    hasLockedAccess: boolean;
    dateCreated: Date;
  };
  return { userId, name, email, accountType, hasLockedAccess, dateCreated };
}
