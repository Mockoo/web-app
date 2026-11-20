import Link from 'next/link';

export const metadata = { title: 'صفحه پیدا نشد' };

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <p className="text-7xl font-extrabold text-brand-600">۴۰۴</p>
        <h1 className="mt-4 text-2xl font-extrabold">این صفحه وجود ندارد</h1>
        <p className="mt-2 text-ink-500">آدرس را بررسی کنید یا از صفحهٔ اصلی دوباره شروع کنید.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-primary">بازگشت به خانه</Link>
          <Link href="/exams" className="btn-outline">مشاهدهٔ آزمون‌ها</Link>
        </div>
      </div>
    </section>
  );
}
