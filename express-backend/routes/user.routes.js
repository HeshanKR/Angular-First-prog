//file: user.routes.js
const express = require("express");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");
const { body } = require("express-validator");
const { generalLimiter, strictLimiter } = require("../middlewares/rateLimiter");
const { redisClient } = require("../config/redisClient");
const { updateUserRole } = require("../controllers/user.controller");

const router = express.Router();

// 1. rate limiting middleware runs first
// 2. then auth token verification
// 3. then role authorization
// 4. finally, your route handler runs

// Middleware to check cache for GET /me
async function checkUserCache(req, res, next) {
  try {
    const cacheKey = `user:${req.user.id}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Cache hit for user:", req.user.id);
      return res.json(JSON.parse(cachedData));
    }
    console.log("Cache miss for user:", req.user.id);
    next();
  } catch (err) {
    console.error("Redis cache check failed:", err);
    next(); // Don't block request if Redis fails
  }
}

// router.get("/me", generalLimiter, authenticateToken, (req, res) => {
//   // req.user comes from the token payload
//   res.json({
//     id: req.user.id,
//     name: req.user.name,
//     email: req.user.email,
//     role: req.user.role,
//   });
// });

// // PATCH /:id/role - Admin only
// router.patch(
//   "/:id/role",
//   strictLimiter,
//   authenticateToken,
//   authorizeRoles("admin"),
//   [
//     body("role")
//       .exists()
//       .withMessage("Role is required")
//       .isIn(["admin", "user"])
//       .withMessage("Role must be either 'admin' or 'user'"),
//   ],
//   (req, res, next) => {
//     // Run the validations and check for errors
//     const errors = require("express-validator").validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   },
//   updateUserRole
// );

router.get(
  "/me",
  generalLimiter,
  authenticateToken,
  checkUserCache,
  (req, res) => {
    const userData = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    };

    // Save to Redis for future requests
    redisClient.setEx(`user:${req.user.id}`, 3600, JSON.stringify(userData)); // 1h TTL

    res.json(userData);
  }
);

router.patch(
  "/:id/role",
  strictLimiter,
  authenticateToken,
  authorizeRoles("admin"),
  [
    body("role")
      .exists()
      .withMessage("Role is required")
      .isIn(["admin", "user"])
      .withMessage("Role must be either 'admin' or 'user'"),
  ],
  (req, res, next) => {
    const errors = require("express-validator").validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  async (req, res, next) => {
    await updateUserRole(req, res);

    // Invalidate cache for that user
    try {
      await redisClient.del(`user:${req.params.id}`);
      console.log("Cache invalidated for user:", req.params.id);
    } catch (err) {
      console.error("Failed to invalidate cache:", err);
    }
  }
);

module.exports = router;
