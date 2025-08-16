// express-backend/middlewares/csrf.js
const crypto = require("crypto");

const CSRF_COOKIE = "csrfToken";
const CSRF_HEADER = "x-csrf-token";

// 1) Issue a non-HttpOnly CSRF cookie if missing
function issueCsrfCookie(req, res, next) {
  if (!req.cookies[CSRF_COOKIE]) {
    const token = crypto.randomBytes(32).toString("hex");
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: false, // must be readable by Angular to send back in header
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
    });
  }
  next();
}

// 2) Require matching header+cookie on unsafe methods
function requireCsrf(req, res, next) {
  const unsafe = /^(POST|PUT|PATCH|DELETE)$/i.test(req.method);
  if (!unsafe) return next();

  const cookieToken = req.cookies[CSRF_COOKIE];
  const headerToken = req.get(CSRF_HEADER);

  if (cookieToken && headerToken && cookieToken === headerToken) {
    return next();
  }
  return res.status(403).json({ message: "CSRF token invalid or missing" });
}

// 3) Extra safety: validate Origin/Referer for unsafe methods
function checkOrigin(req, res, next) {
  const unsafe = /^(POST|PUT|PATCH|DELETE)$/i.test(req.method);
  if (!unsafe) return next();

  const origin = req.get("Origin") || req.get("Referer") || "";
  const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:4200";

  if (!origin) return next(); //temporary fix for postman testing, remove it later
  if (origin && origin.startsWith(allowedOrigin)) {
    return next();
  }
  return res.status(403).json({ message: "Invalid origin" });
}

module.exports = {
  issueCsrfCookie,
  requireCsrf,
  checkOrigin,
  CSRF_COOKIE,
  CSRF_HEADER,
};
