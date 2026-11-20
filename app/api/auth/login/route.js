import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth';
import { clientIp, rateLimit } from '@/lib/rate-limit';

const fail = (error, status = 400) => NextResponse.json({ error }, { status });

export async function POST(request) {
  if (!rateLimit(`login:${clientIp(request)}`, 8)) {
    return fail('تلاش‌های ناموفق زیاد بود. یک دقیقه بعد دوباره امتحان کنید.', 429);
  }

  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? '').trim().toLowerCase();
  const password = String(body?.password ?? '');
  if (!email || !password) return fail('ایمیل و رمز عبور را وارد کنید.');

  const user = db.findUserByEmail(email);
  // Same message for unknown email and wrong password (no account enumeration).
  const valid = user && (await bcrypt.compare(password, user.passwordHash));
  if (!valid) return fail('ایمیل یا رمز عبور اشتباه است.', 401);

  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
