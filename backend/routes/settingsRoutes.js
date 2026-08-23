const express = require("express");

const pool = require("../db/database");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =========================
// Get Settings
// GET /api/settings
// Protected
// =========================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        email_notifications AS "emailNotifications",
        user_notifications AS "userNotifications",
        maintenance_mode AS "maintenanceMode",
        compact_mode AS "compactMode"
      FROM admin_settings
      WHERE id = 1
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Settings not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("GET /api/settings:", error);

    res.status(500).json({
      error: "Failed to fetch settings",
    });
  }
});

// =========================
// Update Settings
// PATCH /api/settings
// Protected
// =========================

router.patch("/", authMiddleware, async (req, res) => {
  try {
    const {
      emailNotifications,
      userNotifications,
      maintenanceMode,
      compactMode,
    } = req.body;

    if (
      typeof emailNotifications !== "boolean" ||
      typeof userNotifications !== "boolean" ||
      typeof maintenanceMode !== "boolean" ||
      typeof compactMode !== "boolean"
    ) {
      return res.status(400).json({
        error: "All settings must be boolean values",
      });
    }

    const result = await pool.query(
      `
      UPDATE admin_settings
      SET
        email_notifications = $1,
        user_notifications = $2,
        maintenance_mode = $3,
        compact_mode = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING
        email_notifications AS "emailNotifications",
        user_notifications AS "userNotifications",
        maintenance_mode AS "maintenanceMode",
        compact_mode AS "compactMode"
      `,
      [emailNotifications, userNotifications, maintenanceMode, compactMode],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Settings not found",
      });
    }

    res.json({
      message: "Settings updated successfully",
      settings: result.rows[0],
    });
  } catch (error) {
    console.error("PATCH /api/settings:", error);

    res.status(500).json({
      error: "Failed to update settings",
    });
  }
});

module.exports = router;
