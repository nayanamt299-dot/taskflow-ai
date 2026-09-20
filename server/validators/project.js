import { body } from "express-validator";

const statuses = ["Planning", "Active", "On Hold", "Completed"];
const priorities = ["Low", "Medium", "High", "Urgent"];

export const projectRules = [
  body("name").trim().isLength({ min: 2, max: 120 }).withMessage("Project name must be 2-120 characters."),
  body("description").optional().isLength({ max: 2000 }).withMessage("Description is too long."),
  body("status").optional().isIn(statuses).withMessage("Invalid project status."),
  body("priority").optional().isIn(priorities).withMessage("Invalid priority."),
  body("startDate").optional({ values: "falsy" }).isISO8601().withMessage("Invalid start date."),
  body("dueDate").optional({ values: "falsy" }).isISO8601().withMessage("Invalid due date.")
];
