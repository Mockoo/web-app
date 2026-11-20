import Link from 'next/link';

export default function Logo({ light = false }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="آزمون‌یار – صفحهٔ اصلی">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-soft">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 12.5l5 5L20 6.5" />
        </svg>
      </span>
      <span className={`text-xl font-extrabold ${light ? 'text-white' : 'text-ink-900'}`}>آزمون‌یار</span>
    </Link>
  );
}
