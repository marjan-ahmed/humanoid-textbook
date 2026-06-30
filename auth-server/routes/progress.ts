import { Router, Response } from "express";
import { Pool } from "pg";
import { AuthenticatedRequest, requireAuth } from "./middleware.js";

const router = Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Get progress for a chapter or all chapters
router.get("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chapterSlug } = req.query;

    if (chapterSlug) {
      const result = await pool.query(
        "SELECT * FROM reading_progress WHERE user_id = $1 AND chapter_slug = $2",
        [req.userId, chapterSlug]
      );
      return res.json({ progress: result.rows[0] || null });
    }

    const result = await pool.query(
      "SELECT * FROM reading_progress WHERE user_id = $1 ORDER BY last_read_at DESC",
      [req.userId]
    );
    res.json({ progress: result.rows });
  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update progress
router.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chapterSlug, sectionsCompleted, scrollPercent, completed } = req.body;
    if (!chapterSlug) {
      return res.status(400).json({ error: "chapterSlug is required" });
    }

    const result = await pool.query(
      `INSERT INTO reading_progress (user_id, chapter_slug, sections_completed, scroll_percent, completed)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, chapter_slug)
       DO UPDATE SET
         sections_completed = COALESCE($3, reading_progress.sections_completed),
         scroll_percent = COALESCE($4, reading_progress.scroll_percent),
         completed = COALESCE($5, reading_progress.completed),
         last_read_at = now()
       RETURNING *`,
      [req.userId, chapterSlug, sectionsCompleted || null, scrollPercent || null, completed || false]
    );

    res.json({ progress: result.rows[0] });
  } catch (error) {
    console.error("Update progress error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
