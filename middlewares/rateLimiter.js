import { checkRateLimit } from "../utils/checkRateLimit.js";

export async function rateLimiter(req, res, next) {
  next();
}
