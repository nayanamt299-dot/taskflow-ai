import bcrypt from "bcryptjs";
import User from "../models/User.js";

const safe = u => ({ id: u._id, name: u.name, email: u.email, createdAt: u.createdAt, updatedAt: u.updatedAt });

export async function listUsers(req, res) {
  const users = await User.find().select("name email createdAt").sort({ name: 1 });
  res.json({ users });
}

export async function getUser(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json({ user: safe(user) });
}

export async function updateUser(req, res) {
  if (String(req.user._id) !== String(req.params.id)) return res.status(403).json({ message: "You can update only your own profile." });
  const user = await User.findById(req.params.id).select("+password");
  if (!user) return res.status(404).json({ message: "User not found." });
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email.toLowerCase();
  if (req.body.currentPassword && req.body.newPassword) {
    const ok = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!ok) return res.status(401).json({ message: "Current password is incorrect." });
    if (req.body.newPassword.length < 8) return res.status(422).json({ message: "New password must be at least 8 characters." });
    user.password = await bcrypt.hash(req.body.newPassword, 12);
  }
  await user.save();
  res.json({ user: safe(user) });
}

export async function deleteUser(req, res) {
  if (String(req.user._id) !== String(req.params.id)) return res.status(403).json({ message: "You can delete only your own account." });
  await User.findByIdAndDelete(req.params.id);
  res.clearCookie("token");
  res.json({ message: "Account deleted." });
}
