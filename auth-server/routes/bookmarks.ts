import { Router, Response } from "express";
import { Pool } from "pg";
import { AuthenticatedRequest, requireAuth } from "./middleware.js";

const router = Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Get bookmarks
router.get("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chapterSlug } = req.query;

    if (chapterSlug) {
      const result = await pool.query(
        "SELECT * FROM bookmarks WHERE user_id = $1 AND chapter_slug = $2 ORDER BY created_at DESC",
        [req.userId, chapterSlug]
      );
      return res.json({ bookmarks: result.rows });
    }

    const result = await pool.query(
      "SELECT * FROM bookmarks WHERE user_id = $1 ORDER BY created_at DESC",
      [req.userId]
    );
    res.json({ bookmarks: result.rows });
  } catch (error) {
    console.error("Get bookmarks error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add bookmark
router.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chapterSlug, sectionId, sectionTitle } = req.body;
    if (!chapterSlug) {
      return res.status(400).json({ error: "chapterSlug is required" });
    }

    const result = await pool.query(
      "INSERT INTO bookmarks (user_id, chapter_slug, section_id, section_title) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.userId, chapterSlug, sectionId || null, sectionTitle || null]
    );

    res.json({ bookmark: result.rows[0] });
  } catch (error) {
    console.error("Add bookmark error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete bookmark
router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM bookmarks WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Delete bookmark error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
