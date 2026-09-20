import { Router } from "express";
import { tasks, description, productivity, priority } from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.post("/generate-tasks", tasks);
router.post("/generate-description", description);
router.post("/suggestions", productivity);
router.post("/prioritize", priority);
export default router;
