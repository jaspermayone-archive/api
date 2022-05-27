export function getToken(req) {
  // get berer token from header
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    return bearerToken;
  }
  return null; // if not found
}
