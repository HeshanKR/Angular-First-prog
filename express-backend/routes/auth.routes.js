//file: auth.routes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/auth.controller");
const { body } = require("express-validator");
const {
  loginLimiter,
  strictLimiter,
  generalLimiter,
} = require("../middlewares/rateLimiter");

const router = express.Router();

// POST /register
router.post(
  "/register",
  strictLimiter,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  registerUser
);

// POST /login
router.post(
  "/login",
  loginLimiter,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginUser
);

// POST /logout
router.post("/logout", generalLimiter, logoutUser);

module.exports = router;
