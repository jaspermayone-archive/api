export function getToken(req, res) {
  const authHeader = req.headers["authorization"];
  const headerToken = authHeader && authHeader.split(" ")[1];

  if (headerToken) {
    const token = headerToken;
    const type = "header";
    return token && type;
  } else {
    return res.status(401).send("No token provided");
  }
}
