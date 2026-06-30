import { Router, Response } from "express";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { AuthenticatedRequest, requireAuth } from "./middleware.js";

const router = Router();

const TRANSLATIONS_DIR = join(process.cwd(), "..", "book_content", "translations");

function slugToFileMap(slug: string): string {
  const parts = slug.split("/");
  return parts[parts.length - 1];
}

function getPreMadeTranslation(chapterSlug: string, language: string): string | null {
  const fileName = slugToFileMap(chapterSlug) + ".md";
  const filePath = join(TRANSLATIONS_DIR, language, fileName);
  if (existsSync(filePath)) {
    return readFileSync(filePath, "utf-8");
  }
  return null;
}

router.get("/cache", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chapterSlug, language } = req.query;
    if (!chapterSlug || !language) {
      return res.status(400).json({ error: "chapterSlug and language are required" });
    }
    if (language !== "ur" && language !== "roman_ur") {
      return res.status(400).json({ error: "language must be 'ur' or 'roman_ur'" });
    }

    const preMade = getPreMadeTranslation(chapterSlug as string, language);
    if (preMade) {
      return res.json({ translatedContent: preMade, updatedAt: new Date().toISOString(), cached: true });
    }

    return res.status(404).json({ error: "Translation not found" });
  } catch (error) {
    console.error("Get translation cache error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chapterSlug, language } = req.body;
    if (!chapterSlug || !language) {
      return res.status(400).json({ error: "chapterSlug and language are required" });
    }
    if (language !== "ur" && language !== "roman_ur") {
      return res.status(400).json({ error: "language must be 'ur' or 'roman_ur'" });
    }

    const preMade = getPreMadeTranslation(chapterSlug, language);
    if (preMade) {
      return res.json({ translatedContent: preMade, cached: true });
    }

    return res.status(404).json({ error: "Translation not available for this chapter" });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Translation failed" });
  }
});

export default router;
