const express = require("express");

const { loginAdmin, registerAdmin } = require("../controllers/authControllers");

const router = express.Router();

// =========================
// Admin Login
// POST /api/auth/login
// =========================

router.post("/login", loginAdmin);

// =========================
// Admin Register
// POST /api/auth/register
// =========================

router.post("/register", registerAdmin);

module.exports = router;
