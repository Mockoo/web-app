import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clientIp, rateLimit } from '@/lib/rate-limit';

const fail = (error, status = 400) => NextResponse.json({ error }, { status });

export async function POST(request) {
  if (!rateLimit(`contact:${clientIp(request)}`, 5, 10 * 60_000)) {
    return fail('پیام‌های زیادی ارسال کرده‌اید. کمی بعد دوباره تلاش کنید.', 429);
  }

  const body = await request.json().catch(() => null);
  const name = String(body?.name ?? '').trim().slice(0, 80);
  const email = String(body?.email ?? '').trim().slice(0, 120);
  const message = String(body?.message ?? '').trim().slice(0, 3000);

  if (name.length < 2) return fail('نام را وارد کنید.');
  if (!/^\S+@\S+\.\S+$/.test(email)) return fail('ایمیل واردشده معتبر نیست.');
  if (message.length < 10) return fail('پیام باید حداقل ۱۰ کاراکتر باشد.');

  db.addMessage({ name, email, message });
  return NextResponse.json({ ok: true }, { status: 201 });
}
