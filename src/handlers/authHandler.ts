import crypto from "crypto";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

export const authHandler = (data: any): boolean => {
  const { hash, ...authData } = data;
  const secret = crypto.createHash("sha256").update(BOT_TOKEN).digest();

  const checkString = Object.keys(authData)
    .sort()
    .map((key) => `${key}=${authData[key]}`)
    .join("\n");

  const hmac = crypto
    .createHmac("sha256", secret)
    .update(checkString)
    .digest("hex");

  return hmac === hash;
};
