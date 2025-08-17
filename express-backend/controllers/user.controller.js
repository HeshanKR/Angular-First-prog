//file: user.controller.js
const db = require("../db/db");
const xss = require("xss");

const updateUserRole = async (req, res) => {
  const userId = xss(req.params.id);
  const role = xss(req.body.role);

  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const [result] = await db.query("UPDATE users SET role = ? WHERE id = ?", [
      role,
      userId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User role updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateUserRole };
