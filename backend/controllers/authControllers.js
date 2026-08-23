const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("../db/database");

// =========================
// Admin Login
// =========================

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const result = await pool.query(
      `SELECT id, name, email, password_hash, role
       FROM admins
       WHERE LOWER(email) = $1`,
      [cleanEmail],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const admin = result.rows[0];

    const passwordValid = await bcrypt.compare(password, admin.password_hash);

    if (!passwordValid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      error: "Login failed",
    });
  }
};

// =========================
// Admin Register
// =========================

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        error: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    const existing = await pool.query(
      `SELECT id FROM admins WHERE LOWER(email) = $1`,
      [cleanEmail],
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        error: "Admin email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO admins
        (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [cleanName, cleanEmail, passwordHash, "Administrator"],
    );

    res.status(201).json({
      message: "Admin created successfully",
      admin: result.rows[0],
    });
  } catch (error) {
    console.error("Admin registration error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Admin email already exists",
      });
    }

    res.status(500).json({
      error: "Failed to create admin",
    });
  }
};

module.exports = {
  loginAdmin,
  registerAdmin,
};
