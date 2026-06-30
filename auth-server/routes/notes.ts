import { Router, Response } from "express";
import { Pool } from "pg";
import { AuthenticatedRequest, requireAuth } from "./middleware.js";

const router = Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Get notes for a chapter
router.get("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chapterSlug } = req.query;
    if (!chapterSlug) {
      return res.status(400).json({ error: "chapterSlug is required" });
    }

    const result = await pool.query(
      "SELECT * FROM user_notes WHERE user_id = $1 AND chapter_slug = $2 ORDER BY created_at DESC",
      [req.userId, chapterSlug]
    );
    res.json({ notes: result.rows });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add note
router.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chapterSlug, sectionId, content } = req.body;
    if (!chapterSlug || !content) {
      return res.status(400).json({ error: "chapterSlug and content are required" });
    }

    const result = await pool.query(
      "INSERT INTO user_notes (user_id, chapter_slug, section_id, content) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.userId, chapterSlug, sectionId || null, content]
    );

    res.json({ note: result.rows[0] });
  } catch (error) {
    console.error("Add note error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update note
router.put("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "content is required" });
    }

    const result = await pool.query(
      "UPDATE user_notes SET content = $1, updated_at = now() WHERE id = $2 AND user_id = $3 RETURNING *",
      [content, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ note: result.rows[0] });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete note
router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM user_notes WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
