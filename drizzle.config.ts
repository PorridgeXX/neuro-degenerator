import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { config } from "./src/app/config";

export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schema.db.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: config.db.host,
    user: config.db.name,
    password: config.db.password,
    database: config.db.db,
    port: config.db.port,
    ssl: false,
  },
});
