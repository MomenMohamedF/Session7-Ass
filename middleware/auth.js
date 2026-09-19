import { verifyToken } from "../config/jwt.js";
import User from "../models/User.js";

export async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "no token" });
  try {
    req.user = verifyToken(token);
    const user = await User.findById(decoded.userId);
    if (user.logoutTime && user.logoutTime > new Date(decoded.iat * 1000)) {
      return res
        .status(401)
        .json({ message: "Token has been invalidated due to logout" });
    }
    next();
  } catch (error) {
    res.status(401).json({ msg: "invalid token" });
  }
}
