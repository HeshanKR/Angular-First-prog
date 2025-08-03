//file: user.routes.js
const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");

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

module.exports = router;
