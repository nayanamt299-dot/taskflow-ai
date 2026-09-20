import { Router } from "express";
import { stats, activity } from "../controllers/dashboardController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/stats", stats);
router.get("/activity", activity);
export default router;
