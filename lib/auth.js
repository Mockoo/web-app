import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_NAME, SESSION_MAX_AGE, signToken, verifyToken } from '@/lib/token';
import { db } from '@/lib/db';

export async function createSession(userId) {
  const token = await signToken({ sub: userId });
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE !== 'false',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export function destroySession() {
  cookies().delete(COOKIE_NAME);
}

/** Returns the logged-in user (without passwordHash) or null. */
export async function getCurrentUser() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.sub) return null;
  const user = db.findUserById(payload.sub);
  if (!user) return null;
  // eslint-disable-next-line no-unused-vars
  const { passwordHash, ...safe } = user;
  return safe;
}

/** For server components: redirect to /login when there is no session. */
export async function requireUser(nextPath = '/dashboard') {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return user;
}
