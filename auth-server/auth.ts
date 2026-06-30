import "dotenv/config";
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const auth = betterAuth({
  database: pool,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    jwt(),
  ],
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://marjan-ahmed.github.io",
  ],
  user: {
    additionalFields: {
      softwareBackground: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      hardwareBackground: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      githubUsername: {
        type: "string",
        required: false,
        defaultValue: "",
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});

// Run migration if called directly
if (process.argv.includes("--migrate")) {
  console.log("Running migration...");
  auth.$context.then(async (ctx) => {
    console.log("Migration complete!");
    process.exit(0);
  }).catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
}

export type Session = typeof auth.$Infer.Session;
