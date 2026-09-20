import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import Activity from "../models/Activity.js";

dotenv.config();
await connectDB();

await Activity.deleteMany({});
await Task.deleteMany({});
await Project.deleteMany({});
await User.deleteMany({});

const password = await bcrypt.hash("Demo@12345", 12);
const user = await User.create({ name: "Demo User", email: "demo@taskflow.ai", password });

const projects = await Project.create([
  { name: "Website Launch", description: "Build and launch a polished marketing website.", status: "Active", priority: "High", owner: user._id, members: [user._id], startDate: new Date(), dueDate: new Date(Date.now() + 20 * 86400000) },
  { name: "AI Study Planner", description: "Create an AI-assisted study planning experience.", status: "Planning", priority: "Medium", owner: user._id, members: [user._id], startDate: new Date(), dueDate: new Date(Date.now() + 35 * 86400000) }
]);

await Task.create([
  { title: "Create landing page", description: "Build the hero and feature sections.", project: projects[0]._id, assignedTo: user._id, status: "Done", priority: "High", dueDate: new Date(Date.now() + 2 * 86400000) },
  { title: "Connect API", description: "Wire frontend data to the Express API.", project: projects[0]._id, assignedTo: user._id, status: "In Progress", priority: "Urgent", dueDate: new Date(Date.now() + 5 * 86400000) },
  { title: "Write documentation", project: projects[0]._id, assignedTo: user._id, status: "Todo", priority: "Medium", dueDate: new Date(Date.now() + 9 * 86400000) },
  { title: "Define planner workflow", project: projects[1]._id, assignedTo: user._id, status: "Todo", priority: "Medium", dueDate: new Date(Date.now() + 12 * 86400000) }
]);

for (const p of projects) {
  await Activity.create({ user: user._id, project: p._id, action: "created", description: `Created project "${p.name}".` });
}
console.log("Seed complete: demo@taskflow.ai / Demo@12345");
process.exit(0);
