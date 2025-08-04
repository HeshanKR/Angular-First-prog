//file: authMiddleware.js
const jwt = require("jsonwebtoken");
const { isTokenBlacklisted } = require("../controllers/auth.controller");

const authenticateToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  if (isTokenBlacklisted(token)) {
    return res.status(403).json({ message: "Token is blacklisted" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user;
    next();
  });
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };
