import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ResponseHandler } from "./responseHandler.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const generateAccessTokenTelegram = (
  telegramId: number,
  username?: string
): string => {
  if (!JWT_SECRET) {
    ResponseHandler.error(
      "JWT_SECRET is not defined in environment variables."
    );
  }

  return jwt.sign(
    {
      telegramId,
      username,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

export const verifyJwt = (authHeader?: string): { [key: string]: any } => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ResponseHandler.error("Unauthorized: No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as { [key: string]: any };
  } catch (err) {
    throw new Error("Unauthorized: Invalid or expired token");
  }
};
