import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth';
import { EXAM_TYPES } from '@/lib/exam-meta';
import { clientIp, rateLimit } from '@/lib/rate-limit';

const fail = (error, status = 400) => NextResponse.json({ error }, { status });

export async function POST(request) {
  if (!rateLimit(`register:${clientIp(request)}`, 10)) {
    return fail('تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید.', 429);
  }

  const body = await request.json().catch(() => null);
  const name = String(body?.name ?? '').trim().slice(0, 80);
  const email = String(body?.email ?? '').trim().toLowerCase().slice(0, 120);
  const password = String(body?.password ?? '');
  const targetExam = Object.hasOwn(EXAM_TYPES, body?.targetExam) ? body.targetExam : 'IELTS';

  if (name.length < 2) return fail('نام و نام خانوادگی را وارد کنید.');
  if (!/^\S+@\S+\.\S+$/.test(email)) return fail('ایمیل واردشده معتبر نیست.');
  if (password.length < 8) return fail('رمز عبور باید حداقل ۸ کاراکتر باشد.');
  if (db.findUserByEmail(email)) return fail('با این ایمیل قبلاً ثبت‌نام شده است.', 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = db.createUser({ name, email, passwordHash, targetExam });
  await createSession(user.id);
  return NextResponse.json({ ok: true }, { status: 201 });
}
