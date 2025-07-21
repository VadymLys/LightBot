import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();
export const pool = neon(process.env.DB_URL!);
console.log("🚀 ~ pool:", pool);
