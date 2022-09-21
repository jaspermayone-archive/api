export async function isAdminOrAccessingOwnData(req, res, next) {
  const { userId } = req.params;
  if (!userId) {
    return next();
  }

  if (
    req.user.accountType.toLowerCase() === "admin" ||
    userId == req.user.userId
  ) {
    return next();
  }

  return res.status(401).send("UNAUTHORIZED!");
}
