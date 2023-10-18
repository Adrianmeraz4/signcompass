import "dotenv/config";

import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import * as schema from "./schema";

if (!process.env.DATABASE_HOST) {
    throw new Error('DATABASE_HOST environment variable is not set: ' + process.env.DATABASE_HOST);
}

// create the connection
const connection = connect({
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
});

export const db = drizzle(connection, { schema });