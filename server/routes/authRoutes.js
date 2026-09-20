import { Router } from "express";
import { register, login, me, logout } from "../controllers/authController.js";
import { registerRules, loginRules } from "../validators/auth.js";
import { validate } from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.post("/register", registerRules, validate, register);
router.post("/login", loginRules, validate, login);
router.get("/me", protect, me);
router.post("/logout", logout);
export default router;
