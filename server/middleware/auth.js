import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
    const token = req.cookies?.token || bearer;
    if (!token) return res.status(401).json({ message: "Authentication required." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: "User no longer exists." });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired authentication token." });
  }
}
