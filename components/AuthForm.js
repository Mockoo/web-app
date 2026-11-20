'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EXAM_TYPES } from '@/lib/exam-meta';

// Only allow same-site relative redirects.
const safeNext = (n) => (typeof n === 'string' && n.startsWith('/') && !n.startsWith('//') ? n : '/dashboard');

export default function AuthForm({ mode, next }) {
  const isRegister = mode === 'register';
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', targetExam: 'IELTS' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'خطایی رخ داد. دوباره تلاش کنید.');
      router.push(safeNext(next));
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {isRegister && (
        <div>
          <label htmlFor="name" className="label">نام و نام خانوادگی</label>
          <input id="name" className="input" autoComplete="name" required value={form.name} onChange={set('name')} placeholder="مثلاً سارا محمدی" />
        </div>
      )}

      <div>
        <label htmlFor="email" className="label">ایمیل</label>
        <input id="email" type="email" dir="ltr" className="input text-left" autoComplete="email" required value={form.email} onChange={set('email')} placeholder="name@example.com" />
      </div>

      <div>
        <label htmlFor="password" className="label">رمز عبور</label>
        <input
          id="password"
          type="password"
          dir="ltr"
          className="input text-left"
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          required
          minLength={8}
          value={form.password}
          onChange={set('password')}
          placeholder={isRegister ? 'حداقل ۸ کاراکتر' : '••••••••'}
        />
      </div>

      {isRegister && (
        <div>
          <label htmlFor="targetExam" className="label">آزمون هدف</label>
          <select id="targetExam" className="input" value={form.targetExam} onChange={set('targetExam')}>
            {Object.entries(EXAM_TYPES).map(([key, t]) => (
              <option key={key} value={key}>{t.fa} ({t.full})</option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 ring-1 ring-red-100">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'لطفاً صبر کنید…' : isRegister ? 'ساخت حساب' : 'ورود به حساب'}
      </button>

      <p className="text-center text-sm text-ink-500">
        {isRegister ? 'قبلاً ثبت‌نام کرده‌اید؟' : 'هنوز حساب ندارید؟'}{' '}
        <Link
          href={isRegister ? '/login' : '/register'}
          className="font-bold text-brand-600 hover:text-brand-800"
        >
          {isRegister ? 'وارد شوید' : 'ثبت‌نام کنید'}
        </Link>
      </p>
    </form>
  );
}
