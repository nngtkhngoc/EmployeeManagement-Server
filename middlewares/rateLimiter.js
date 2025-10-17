import { checkRateLimit } from "../utils/checkRateLimit.js";

export async function rateLimiter(req, res, next) {
  const userId = req.id;
  const allowed = await checkRateLimit(userId);

  if (!allowed) return res.status(429);

  next();
}
