import jsonwebtoken from "jsonwebtoken";

const jwt = jsonwebtoken;

/**
 *
 * @param req
 * @param res
 */
export async function getUserInfo(req, res) {

    const authHeader = req.headers["authorization"];
    if (!authHeader) {return res.status(401).send("No authorization header!");}
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {return res.status(401).send("No token provided!");}
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const { userId, email, role } = decoded as {
        userId: string;
        email: string;
        role: string;
    };
    return { userId, email, role };
}