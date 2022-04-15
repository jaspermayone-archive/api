import jsonwebtoken from "jsonwebtoken";
const jwt = jsonwebtoken;

export function authToken(req, res, next) {

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.send(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.send(403);
    req.user = user;
    next();
  });
}