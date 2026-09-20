import { Router } from "express";
import { listTasks, createTask, getTask, updateTask, deleteTask, updateStatus } from "../controllers/taskController.js";
import { taskRules } from "../validators/task.js";
import { validate } from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/", listTasks);
router.post("/", taskRules, validate, createTask);
router.get("/:id", getTask);
router.put("/:id", taskRules, validate, updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/status", updateStatus);
export default router;
