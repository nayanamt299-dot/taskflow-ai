import { Router } from "express";
import { listProjects, createProject, getProject, updateProject, deleteProject } from "../controllers/projectController.js";
import { projectRules } from "../validators/project.js";
import { validate } from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/", listProjects);
router.post("/", projectRules, validate, createProject);
router.get("/:id", getProject);
router.put("/:id", projectRules, validate, updateProject);
router.delete("/:id", deleteProject);
export default router;
