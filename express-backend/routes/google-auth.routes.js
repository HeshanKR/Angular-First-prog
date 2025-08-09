// file: google-auth.routes.js
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { generalLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

// 1️⃣ Redirect user to Google login
router.get(
  "/google",
  generalLimiter,
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2️⃣ Handle callback from Google
router.get(
  "/google/callback",
  generalLimiter,
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login", // your frontend login route
  }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🧁 Send token in secure HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    // ✅ Redirect to Angular frontend
    res.redirect("http://localhost:4200/dashboard");
  }
);

module.exports = router;
