import { Request, Response, NextFunction } from "express";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  ssl: { rejectUnauthorized: false },
});

export interface AuthenticatedRequest extends Request {
  userId?: string;
  session?: any;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.slice(7);

    const { rows } = await pool.query(
      `SELECT s."userId", s."expiresAt",
              u.id as uid, u.name, u.email, u.image,
              u."softwareBackground", u."hardwareBackground", u."githubUsername"
       FROM "session" s
       JOIN "user" u ON s."userId" = u.id
       WHERE s.token = $1 AND s."expiresAt" > NOW()`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const row = rows[0];
    req.userId = row.uid;
    req.session = {
      user: {
        id: row.uid,
        name: row.name,
        email: row.email,
        image: row.image,
        softwareBackground: row.softwareBackground,
        hardwareBackground: row.hardwareBackground,
        githubUsername: row.githubUsername,
      },
    };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
}
