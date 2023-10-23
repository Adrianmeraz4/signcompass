"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    schema: "./schema.ts",
    out: "./drizzle",
    driver: 'mysql2',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL,
    },
    verbose: true,
};
