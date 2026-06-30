import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { Pool } from "pg";
import { auth } from "./auth.js";
import translateRouter from "./routes/translate.js";
import progressRouter from "./routes/progress.js";
import bookmarksRouter from "./routes/bookmarks.js";
import notesRouter from "./routes/notes.js";
import preferencesRouter from "./routes/preferences.js";

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  ssl: { rejectUnauthorized: false },
});

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "https://marjan-ahmed.github.io",
    "https://humanoid-textbook.up.railway.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Custom session endpoint — MUST be before Better Auth catch-all.
// Reads Bearer token from Authorization header since cross-port cookies don't work.
app.get("/api/auth/session", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({ user: null, session: null });
    }
    const token = authHeader.slice(7);

    const { rows } = await pool.query(
      `SELECT s.id as sid, s."userId", s."expiresAt", s."createdAt" as screated,
              u.id as uid, u.name, u.email, u.image,
              u."softwareBackground", u."hardwareBackground", u."githubUsername"
       FROM "session" s
       JOIN "user" u ON s."userId" = u.id
       WHERE s.token = $1 AND s."expiresAt" > NOW()`,
      [token]
    );

    if (rows.length === 0) {
      return res.json({ user: null, session: null });
    }

    const row = rows[0];
    res.json({
      user: {
        id: row.uid,
        name: row.name,
        email: row.email,
        image: row.image,
        softwareBackground: row.softwareBackground,
        hardwareBackground: row.hardwareBackground,
        githubUsername: row.githubUsername,
      },
      session: {
        id: row.id,
        userId: row.userId,
        expiresAt: row.expiresAt,
        createdAt: row.createdAt,
      },
    });
  } catch (error) {
    console.error("Session check error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Better Auth handler (catch-all for sign-in, sign-up, sign-out, etc.)
app.all("/api/auth/*", toNodeHandler(auth));

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "auth-server" });
});

app.use("/api/translate", translateRouter);
app.use("/api/progress", progressRouter);
app.use("/api/bookmarks", bookmarksRouter);
app.use("/api/notes", notesRouter);
app.use("/api/preferences", preferencesRouter);

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Auth endpoint: http://localhost:${PORT}/api/auth`);
});
