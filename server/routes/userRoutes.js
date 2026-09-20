import { Router } from "express";
import { listUsers, getUser, updateUser, deleteUser } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/", listUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
export default router;
