import { body } from "express-validator";

export const registerRules = [
  body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name must be 2-80 characters."),
  body("email").isEmail().withMessage("Enter a valid email.").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
];

export const loginRules = [
  body("email").isEmail().withMessage("Enter a valid email.").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required.")
];
