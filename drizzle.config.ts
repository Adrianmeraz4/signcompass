import type { Config } from "drizzle-kit";
import "dotenv/config";
 

export default {
  schema: "./schema.ts",
  out: "./drizzle",
  driver: 'mysql2', 
  dbCredentials: {
    connectionString: process.env.DATABASE_URL as string,
  },
  verbose: true,
} satisfies Config;