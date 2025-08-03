//file: admin.routes.js
const express = require("express");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  authenticateToken,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: `Welcome to the admin dashboard, ${req.user.name}!` });
  }
);

module.exports = router;
