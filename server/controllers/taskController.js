import mongoose from "mongoose";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import Activity from "../models/Activity.js";

async function accessibleProject(id, userId) {
  return Project.findOne({ _id: id, $or: [{ owner: userId }, { members: userId }] });
}

export async function listTasks(req, res) {
  const projects = await Project.find({ $or: [{ owner: req.user._id }, { members: req.user._id }] }).select("_id");
  const ids = projects.map(p => p._id);
  const filter = { project: { $in: ids } };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.project) filter.project = req.query.project;
  if (req.query.search) filter.$or = [
    { title: { $regex: req.query.search, $options: "i" } },
    { description: { $regex: req.query.search, $options: "i" } }
  ];
  let query = Task.find(filter).populate("project", "name").populate("assignedTo", "name email");
  const sort = req.query.sort === "due" ? { dueDate: 1 } : { createdAt: -1 };
  const tasks = await query.sort(sort);
  res.json({ tasks });
}

export async function createTask(req, res) {
  const project = await accessibleProject(req.body.project, req.user._id);
  if (!project) return res.status(403).json({ message: "You do not have access to this project." });
  if (req.body.assignedTo && !(String(project.members).includes(req.body.assignedTo) || String(project.owner) === req.body.assignedTo)) {
    return res.status(403).json({ message: "Assignee is not a member of this project." });
  }
  const task = await Task.create(req.body);
  await Activity.create({ user: req.user._id, project: project._id, action: "created", description: `Created task "${task.title}".` });
  const populated = await task.populate([{ path: "project", select: "name" }, { path: "assignedTo", select: "name email" }]);
  res.status(201).json({ task: populated });
}

export async function getTask(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid task ID." });
  const task = await Task.findById(req.params.id).populate("project", "name owner members").populate("assignedTo", "name email");
  if (!task) return res.status(404).json({ message: "Task not found." });
  const project = await accessibleProject(task.project._id, req.user._id);
  if (!project) return res.status(403).json({ message: "Access denied." });
  res.json({ task });
}

export async function updateTask(req, res) {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found." });
  const project = await accessibleProject(task.project, req.user._id);
  if (!project) return res.status(403).json({ message: "Access denied." });
  if (req.body.project && String(req.body.project) !== String(task.project)) {
    const target = await accessibleProject(req.body.project, req.user._id);
    if (!target) return res.status(403).json({ message: "Target project is not accessible." });
  }
  Object.assign(task, req.body);
  await task.save();
  await Activity.create({ user: req.user._id, project: project._id, action: "updated", description: `Updated task "${task.title}".` });
  const populated = await task.populate([{ path: "project", select: "name" }, { path: "assignedTo", select: "name email" }]);
  res.json({ task: populated });
}

export async function deleteTask(req, res) {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found." });
  const project = await accessibleProject(task.project, req.user._id);
  if (!project) return res.status(403).json({ message: "Access denied." });
  await task.deleteOne();
  await Activity.create({ user: req.user._id, project: project._id, action: "deleted", description: `Deleted task "${task.title}".` });
  res.json({ message: "Task deleted successfully." });
}

export async function updateStatus(req, res) {
  const { status } = req.body;
  if (!["Todo", "In Progress", "Done"].includes(status)) return res.status(422).json({ message: "Invalid task status." });
  return updateTask({ ...req, body: { status } }, res);
}
