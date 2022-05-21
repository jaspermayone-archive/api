import { jsonwebtoken as jwt } from "jsonwebtoken";

import { getToken } from "./getToken";

/**
 *
 * @param req
 * @param res
 */
export async function getUserInfo(req, res, next) {
  const token = await getToken(req, res);

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const { userId, email, role } = decoded as {
    userId: string;
    email: string;
    role: string;
  };
  return { userId, email, role };

  next();
}
