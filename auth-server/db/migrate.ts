import "dotenv/config";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { config } from "dotenv";
config({ path: resolve(__dirname, "../.env") });

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const migration = `
CREATE TABLE IF NOT EXISTS chapter_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  chapter_slug TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('ur', 'roman_ur')),
  translated_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, chapter_slug, language)
);

CREATE TABLE IF NOT EXISTS reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  chapter_slug TEXT NOT NULL,
  sections_completed TEXT[] DEFAULT '{}',
  scroll_percent REAL DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  last_read_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, chapter_slug)
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  chapter_slug TEXT NOT NULL,
  section_id TEXT,
  section_title TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  chapter_slug TEXT NOT NULL,
  section_id TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  preferred_translation TEXT CHECK (preferred_translation IN ('ur', 'roman_ur')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
`;

async function migrate() {
  console.log("Running migration...");
  try {
    await pool.query(migration);
    console.log("Migration complete! Tables created:");
    const res = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('chapter_translations', 'reading_progress', 'bookmarks', 'user_notes', 'user_preferences') ORDER BY table_name"
    );
    res.rows.forEach((r) => console.log(`  - ${r.table_name}`));
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
