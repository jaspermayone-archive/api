import jsonwebtoken from "jsonwebtoken";

const jwt = jsonwebtoken;

/**
 *
 * @param req
 * @param res
 * @param next
 */
export async function isAdmin(req, res, next) {
  const authHeader = await req.headers["authorization"];
  const token = (await authHeader) && authHeader.split(" ")[1];
  if (token === null) {
    return res.status(401).send("No token provided");
  }

  const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (decodedToken.accountType !== "admin") {
    return res.status(401).send("UNATHORIZED. Admin only");
  } else {
    next();
  }
}
