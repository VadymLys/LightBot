import { verifyJwt } from "../handlers/jwthandler.js";
import { ResponseHandler } from "../handlers/responseHandler.js";

export const isAuthorized = (event: any): boolean => {
  const authHeader = event.headers.Authorization || event.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) return false;

  const token = authHeader.slice(7);

  try {
    const decoded = verifyJwt(token);
    console.log("🚀 ~ isAuthorized ~ decoded:", decoded);

    return true;
  } catch (err) {
    return ResponseHandler.error(err);
  }
};
