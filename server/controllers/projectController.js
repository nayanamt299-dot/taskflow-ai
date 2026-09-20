import mongoose from "mongoose";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import Activity from "../models/Activity.js";

async function projectWithStats(project) {
  const tasks = await Task.find({ project: project._id }).lean();
  const completed = tasks.filter(t => t.status === "Done").length;
  return {
    ...project.toObject ? project.toObject() : project,
    taskCount: tasks.length,
    completedTasks: completed,
    progress: tasks.length ? Math.round((completed / tasks.length) * 100) : 0
  };
}

export async function listProjects(req, res) {
  const projects = await Project.find({ $or: [{ owner: req.user._id }, { members: req.user._id }] })
    .sort({ updatedAt: -1 });
  const result = await Promise.all(projects.map(projectWithStats));
  res.json({ projects: result });
}

export async function createProject(req, res) {
  const project = await Project.create({ ...req.body, owner: req.user._id, members: [req.user._id] });
  await Activity.create({ user: req.user._id, project: project._id, action: "created", description: `Created project "${project.name}".` });
  res.status(201).json({ project: await projectWithStats(project) });
}

export async function getProject(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid project ID." });
  const project = await Project.findOne({ _id: req.params.id, $or: [{ owner: req.user._id }, { members: req.user._id }] }).populate("owner members", "name email");
  if (!project) return res.status(404).json({ message: "Project not found." });
  const tasks = await Task.find({ project: project._id }).populate("assignedTo", "name email").sort({ createdAt: -1 });
  const activity = await Activity.find({ project: project._id }).populate("user", "name").sort({ createdAt: -1 }).limit(30);
  const stats = await projectWithStats(project);
  res.json({ project: { ...stats, tasks, activity } });
}

export async function updateProject(req, res) {
  const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
  if (!project) return res.status(404).json({ message: "Project not found or you are not the owner." });
  Object.assign(project, req.body);
  await project.save();
  await Activity.create({ user: req.user._id, project: project._id, action: "updated", description: `Updated project "${project.name}".` });
  res.json({ project: await projectWithStats(project) });
}

export async function deleteProject(req, res) {
  const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
  if (!project) return res.status(404).json({ message: "Project not found or you are not the owner." });
  await Task.deleteMany({ project: project._id });
  await Activity.deleteMany({ project: project._id });
  await project.deleteOne();
  res.json({ message: "Project deleted successfully." });
}
