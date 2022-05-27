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

  const { userId, email, role } = decoded as {
    userId: string;
    email: string;
    role: string;
  };
  return { userId, email, role };
}
