import Link from 'next/link';
import Logo from './Logo';
import { EXAM_TYPES } from '@/lib/exam-meta';

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink-950 text-ink-300">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-8">
            آزمون‌یار محیطی برای تمرین آزمون‌های بین‌المللی زبان انگلیسی است؛ با زمان‌بندی واقعی،
            تصحیح فوری و گزارش پیشرفت.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white">آزمون‌ها</h3>
          <ul className="space-y-2 text-sm">
            {Object.entries(EXAM_TYPES).map(([key, t]) => (
              <li key={key}>
                <Link href={`/exams?type=${key}`} className="hover:text-white">
                  {t.fa} ({t.full})
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white">دسترسی سریع</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/courses" className="hover:text-white">دوره‌ها</Link></li>
            <li><Link href="/about" className="hover:text-white">درباره ما</Link></li>
            <li><Link href="/contact" className="hover:text-white">تماس با ما</Link></li>
            <li><Link href="/login" className="hover:text-white">ورود</Link></li>
            <li><Link href="/register" className="hover:text-white">ثبت‌نام</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs sm:flex-row">
          <p>© آزمون‌یار؛ تمام حقوق محفوظ است.</p>
          <p>نمره‌ها تخمینی‌اند و جایگزین نتیجهٔ رسمی آزمون نیستند.</p>
        </div>
      </div>
    </footer>
  );
}
