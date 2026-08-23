require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./db/database");
const authRoutes = require("./routes/authRoutes");

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
// Auth Routes
// =========================
// POST /api/auth/login
// POST /api/auth/register

app.use("/api/auth", authRoutes);

// =========================
// Health Check
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "TechFlow backend is running 🚀",
  });
});

// =========================
// Database Health Check
// GET /api/health
// =========================

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");

    res.json({
      status: "online",
      database: "connected",
      time: result.rows[0].current_time,
    });
  } catch (error) {
    console.error("Database health check:", error);

    res.status(500).json({
      status: "offline",
      database: "disconnected",
      error: "Database connection failed",
    });
  }
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

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    const result = await pool.query(
      `INSERT INTO users (name, email)
       VALUES ($1, $2)
       RETURNING *`,
      [cleanName, cleanEmail],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("POST /api/users:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

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

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    const result = await pool.query(
      `UPDATE users
       SET name = $1,
           email = $2
       WHERE id = $3
       RETURNING *`,
      [cleanName, cleanEmail, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("PATCH /api/users/:id:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

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
    path: req.originalUrl,
  });
});

// =========================
// Global Error Handler
// =========================

app.use((error, req, res, next) => {
  console.error("Unhandled server error:", error);

  res.status(500).json({
    error: "Internal server error",
  });
});

// =========================
// Server
// =========================

app.listen(PORT, () => {
  console.log(`TechFlow backend running at http://localhost:${PORT}`);
});
