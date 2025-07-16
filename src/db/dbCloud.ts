import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST_CLOUD,
  user: process.env.DB_USER_CLOUD,
  password: process.env.DB_PASSWORD_CLOUD,
  database: process.env.DB_NAME_CLOUD,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  ssl: {
    rejectUnauthorized: false,
  },
});
