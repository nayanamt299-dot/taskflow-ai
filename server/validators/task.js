import { body } from "express-validator";
import mongoose from "mongoose";

export const taskRules = [
  body("title").trim().isLength({ min: 2, max: 160 }).withMessage("Task title must be 2-160 characters."),
  body("description").optional().isLength({ max: 3000 }).withMessage("Description is too long."),
  body("project").custom(v => mongoose.isValidObjectId(v)).withMessage("Valid project ID is required."),
  body("assignedTo").optional({ values: "falsy" }).custom(v => mongoose.isValidObjectId(v)).withMessage("Invalid assignee ID."),
  body("status").optional().isIn(["Todo", "In Progress", "Done"]).withMessage("Invalid task status."),
  body("priority").optional().isIn(["Low", "Medium", "High", "Urgent"]).withMessage("Invalid task priority."),
  body("dueDate").optional({ values: "falsy" }).isISO8601().withMessage("Invalid due date.")
];
