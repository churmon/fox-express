// server/src/middleware/requireAuth.ts
import { auth } from "../lib/auth.js";
import { toNodeHandler } from "better-auth/node";

export const requireAuth = async (req,res,next) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    console.error("Unauthorized access attempt");
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  // Attach user to request
  req.user = session.user;
  req.session = session.session;
  next();
};