import Project from "../models/Project.js";
import Task from "../models/Task.js";
import Activity from "../models/Activity.js";

export async function stats(req, res) {
  const projects = await Project.find({ $or: [{ owner: req.user._id }, { members: req.user._id }] }).select("_id");
  const projectIds = projects.map(p => p._id);
  const tasks = await Task.find({ project: { $in: projectIds } }).lean();
  const completed = tasks.filter(t => t.status === "Done").length;
  const inProgress = tasks.filter(t => t.status === "In Progress").length;
  const todo = tasks.filter(t => t.status === "Todo").length;
  const urgent = tasks.filter(t => t.priority === "Urgent").length;
  res.json({
    stats: {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      completedTasks: completed,
      inProgressTasks: inProgress,
      pendingTasks: todo,
      urgentTasks: urgent,
      completionRate: tasks.length ? Math.round(completed / tasks.length * 100) : 0,
      statusDistribution: [
        { name: "Todo", value: todo },
        { name: "In Progress", value: inProgress },
        { name: "Done", value: completed }
      ],
      priorityDistribution: ["Low", "Medium", "High", "Urgent"].map(p => ({ name: p, value: tasks.filter(t => t.priority === p).length }))
    }
  });
}

export async function activity(req, res) {
  const projects = await Project.find({ $or: [{ owner: req.user._id }, { members: req.user._id }] }).select("_id");
  const items = await Activity.find({ project: { $in: projects.map(p => p._id) } })
    .populate("user", "name").populate("project", "name").sort({ createdAt: -1 }).limit(20);
  res.json({ activity: items });
}
