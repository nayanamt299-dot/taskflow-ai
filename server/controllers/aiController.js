import { generateTasks, generateDescription, suggestions, prioritize } from "../services/aiService.js";

export async function tasks(req, res) {
  if (!req.body.goal?.trim()) return res.status(422).json({ message: "Project goal is required." });
  res.json(await generateTasks(req.body.goal));
}

export async function description(req, res) {
  if (!req.body.topic?.trim()) return res.status(422).json({ message: "Project topic is required." });
  res.json({ description: await generateDescription(req.body.topic) });
}

export async function productivity(req, res) {
  res.json({ suggestions: await suggestions(req.body.stats || {}) });
}

export async function priority(req, res) {
  res.json({ tasks: await prioritize(Array.isArray(req.body.tasks) ? req.body.tasks : []) });
}
