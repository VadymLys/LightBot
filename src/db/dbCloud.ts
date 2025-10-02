import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();
const dbUrl = process.env.DB_URL || process.env.DATABASE_URL;
export const pool = neon(dbUrl!);
