import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "@/app/config";
import * as schema from "@/db/schema.db";

const pool = new Pool({
  host: config.db.host,
  user: config.db.name,
  password: config.db.password,
  database: config.db.db,
  port: config.db.port,
});

export const db = drizzle(pool, { schema, logger: true });
