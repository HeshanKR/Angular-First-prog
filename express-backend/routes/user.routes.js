//file: user.routes.js
const express = require("express");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const { updateUserRole } = require("../controllers/user.controller");

const router = express.Router();

router.get("/me", authenticateToken, (req, res) => {
  // req.user comes from the token payload
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
});

// PATCH /:id/role - Admin only
router.patch(
  "/:id/role",
  authenticateToken,
  authorizeRoles("admin"),
  updateUserRole
);

module.exports = router;
