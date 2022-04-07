import jsonwebtoken from "jsonwebtoken";

function auth(req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const verified = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(400).send("Invalid token.");
  }
}

export { auth };
