// Edge-safe JWT helpers (used by middleware.js too – do NOT import fs/db here).
import { SignJWT, jwtVerify } from 'jose';

export const COOKIE_NAME = 'azmoonyar_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const secret = () =>
  new TextEncoder().encode(
    process.env.AUTH_SECRET || 'dev-only-secret-change-me-before-deploying'
  );

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret());
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload;
  } catch {
    return null;
  }
}
