// lib/auth.ts
// JWT helpers for admin authentication. Tokens are stored as HTTP-only cookies.

import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "fallback_secret_do_not_use_in_prod";

export interface AdminPayload {
  user: string;
  role: "admin";
}

/** Signs a JWT with the admin payload — expires in 8 hours. */
export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "8h" });
}

/** Verifies a JWT and returns the payload, or null if invalid/expired. */
export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, SECRET) as AdminPayload;
  } catch {
    return null;
  }
}
