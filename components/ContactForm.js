'use client';

import { useState } from 'react';

export default function ContactForm({ defaultMessage = '' }) {
  const [form, setForm] = useState({ name: '', email: '', message: defaultMessage });
  const [status, setStatus] = useState({ type: 'idle', text: '' });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ type: 'loading', text: '' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'ارسال پیام ناموفق بود.');
      setStatus({ type: 'ok', text: 'پیام شما ثبت شد. در اولین فرصت پاسخ می‌دهیم.' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="label">نام</label>
          <input id="c-name" className="input" required value={form.name} onChange={set('name')} />
        </div>
        <div>
          <label htmlFor="c-email" className="label">ایمیل</label>
          <input id="c-email" type="email" dir="ltr" className="input text-left" required value={form.email} onChange={set('email')} />
        </div>
      </div>
      <div>
        <label htmlFor="c-msg" className="label">پیام شما</label>
        <textarea id="c-msg" rows={6} className="input resize-y" required value={form.message} onChange={set('message')} />
      </div>

      {status.text && (
        <p
          role={status.type === 'error' ? 'alert' : 'status'}
          className={`rounded-xl px-4 py-3 text-sm font-bold ring-1 ${
            status.type === 'ok' ? 'bg-accent-50 text-accent-700 ring-accent-200' : 'bg-red-50 text-red-700 ring-red-100'
          }`}
        >
          {status.text}
        </p>
      )}

      <button type="submit" disabled={status.type === 'loading'} className="btn-primary">
        {status.type === 'loading' ? 'در حال ارسال…' : 'ارسال پیام'}
      </button>
    </form>
  );
}
