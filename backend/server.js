require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

const PORT = Number(process.env.PORT) || 5000;

// =========================
// Middleware
// =========================

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

// =========================
// PostgreSQL
// =========================

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL error:", error);
});

// =========================
// Health Check
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "TechFlow backend is running 🚀",
  });
});

// =========================
// Get All Users
// GET /api/users
// =========================

app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id DESC");

    res.json(result.rows);
  } catch (error) {
    console.error("GET /api/users:", error);

    res.status(500).json({
      error: "Failed to fetch users",
    });
  }
});

// =========================
// Get Single User
// GET /api/users/:id
// =========================

app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("GET /api/users/:id:", error);

    res.status(500).json({
      error: "Failed to fetch user",
    });
  }
});

// =========================
// Create User
// POST /api/users
// =========================

app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({
        error: "Name and email are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO users (name, email)
       VALUES ($1, $2)
       RETURNING *`,
      [name.trim(), email.trim()],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("POST /api/users:", error);

    res.status(500).json({
      error: "Failed to add user",
    });
  }
});

// =========================
// Update User
// PATCH /api/users/:id
// =========================

app.patch("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({
        error: "Name and email are required",
      });
    }

    const result = await pool.query(
      `UPDATE users
       SET name = $1,
           email = $2
       WHERE id = $3
       RETURNING *`,
      [name.trim(), email.trim(), id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("PATCH /api/users/:id:", error);

    res.status(500).json({
      error: "Failed to update user",
    });
  }
});

// =========================
// Delete User
// DELETE /api/users/:id
// =========================

app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("DELETE /api/users/:id:", error);

    res.status(500).json({
      error: "Failed to delete user",
    });
  }
});

// =========================
// 404
// =========================

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// =========================
// Server
// =========================

app.listen(PORT, () => {
  console.log(`TechFlow backend running at http://localhost:${PORT}`);
});
