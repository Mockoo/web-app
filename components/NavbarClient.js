'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';
import Icon from './Icon';

const LINKS = [
  { href: '/', label: 'خانه' },
  { href: '/exams', label: 'آزمون‌ها' },
  { href: '/courses', label: 'دوره‌ها' },
  { href: '/about', label: 'درباره ما' },
  { href: '/contact', label: 'تماس با ما' },
];

export default function NavbarClient({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setOpen(false);
    router.push('/');
    router.refresh();
  }

  const linkClass = (href) =>
    `rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
      isActive(href) ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-brand-50 hover:text-brand-700'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-ink-950/5 bg-white/85 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="منوی اصلی">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
          {user && (
            <Link href="/dashboard" className={linkClass('/dashboard')}>
              داشبورد
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <span className="text-sm text-ink-500">سلام، {user.name.split(' ')[0]}</span>
              <button onClick={logout} className="btn-outline !py-2">خروج</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost !py-2">ورود</Link>
              <Link href="/register" className="btn-primary !py-2">ثبت‌نام رایگان</Link>
            </>
          )}
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg text-ink-700 hover:bg-brand-50 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'بستن منو' : 'باز کردن منو'}
        >
          <Icon name={open ? 'x' : 'menu'} />
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-950/5 bg-white md:hidden">
          <nav className="container-x flex flex-col gap-1 py-3" aria-label="منوی موبایل">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={linkClass(l.href)}>
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className={linkClass('/dashboard')}>
                  داشبورد
                </Link>
                <button onClick={logout} className="btn-outline mt-2">خروج از حساب</button>
              </>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setOpen(false)} className="btn-outline">ورود</Link>
                <Link href="/register" onClick={() => setOpen(false)} className="btn-primary">ثبت‌نام</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
