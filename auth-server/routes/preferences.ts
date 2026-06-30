import { Router, Response } from "express";
import { Pool } from "pg";
import { AuthenticatedRequest, requireAuth } from "./middleware.js";

const router = Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Get preferences
router.get("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM user_preferences WHERE user_id = $1",
      [req.userId]
    );

    if (result.rows.length === 0) {
      // Return defaults
      return res.json({
        preferences: {
          theme: "system",
          preferredTranslation: null,
        },
      });
    }

    res.json({ preferences: result.rows[0] });
  } catch (error) {
    console.error("Get preferences error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update preferences
router.put("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { theme, preferredTranslation } = req.body;

    const result = await pool.query(
      `INSERT INTO user_preferences (user_id, theme, preferred_translation)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id)
       DO UPDATE SET
         theme = COALESCE($2, user_preferences.theme),
         preferred_translation = COALESCE($3, user_preferences.preferred_translation),
         updated_at = now()
       RETURNING *`,
      [req.userId, theme || null, preferredTranslation || null]
    );

    res.json({ preferences: result.rows[0] });
  } catch (error) {
    console.error("Update preferences error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
