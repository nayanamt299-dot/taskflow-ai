import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";

const safeUser = user => ({ id: user._id, name: user.name, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt });

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.COOKIE_SECURE === "true",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export async function register(req, res) {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "An account with this email already exists." });
  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hash });
  setAuthCookie(res, signToken(user._id.toString()));
  res.status(201).json({ user: safeUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }
  setAuthCookie(res, signToken(user._id.toString()));
  res.status(200).json({ user: safeUser(user) });
}

export async function me(req, res) {
  res.json({ user: safeUser(req.user) });
}

export function logout(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully." });
}
