import Link from 'next/link';
import Icon from '@/components/Icon';
import ExamCard from '@/components/ExamCard';
import { listExams } from '@/lib/exams';
import { EXAM_TYPES } from '@/lib/exam-meta';
import { fa } from '@/lib/format';

const FEATURES = [
  { icon: 'clock', title: 'زمان‌بندی واقعی', text: 'تایمر دقیق مثل آزمون اصلی. با تمام شدن وقت، پاسخ‌ها خودکار ثبت می‌شود.' },
  { icon: 'check', title: 'نمره‌دهی فوری', text: 'سؤال‌های تستی و پاسخ‌کوتاه همان لحظه تصحیح و به نمرهٔ تخمینی تبدیل می‌شوند.' },
  { icon: 'chart', title: 'داشبورد پیشرفت', text: 'روند نمره‌ها، میانگین و عملکرد هر مهارت را در یک نگاه ببین.' },
  { icon: 'headphones', title: 'شنیداری تعاملی', text: 'فایل صوتی با محدودیت دفعات پخش، درست مثل شرایط آزمون.' },
  { icon: 'target', title: 'شناسایی نقطه‌ضعف', text: 'مشخص می‌کنیم کدام مهارت بیشتر از بقیه به تمرین نیاز دارد.' },
  { icon: 'device', title: 'روی همهٔ دستگاه‌ها', text: 'از موبایل، تبلت یا کامپیوتر آزمون بده؛ پاسخ‌هایت در مرورگر ذخیره می‌ماند.' },
];

const STEPS = [
  { title: 'ثبت‌نام کن', text: 'با ایمیل حساب بساز و آزمون هدفت را انتخاب کن.' },
  { title: 'آزمون بده', text: 'یکی از آزمون‌های آزمایشی را شروع کن و در زمان مقرر پاسخ بده.' },
  { title: 'نتیجه را بررسی کن', text: 'نمره، پاسخ‌های درست و توضیح هر سؤال را ببین و دوباره تمرین کن.' },
];

const FAQ = [
  ['آزمون‌ها رایگان هستند؟', 'بله. همهٔ آزمون‌های آزمایشی موجود برای کاربران ثبت‌نام‌شده رایگان است.'],
  ['نمره‌ها چقدر دقیق‌اند؟', 'نمره‌ها تخمینی‌اند و از روی درصد پاسخ‌های درست به مقیاس هر آزمون تبدیل می‌شوند. بخش Writing خودکار نمره‌دهی نمی‌شود؛ پاسخ شما ذخیره می‌شود تا با مدرس یا نمونه‌پاسخ مقایسه کنید.'],
  ['اگر وسط آزمون صفحه را ببندم چه می‌شود؟', 'پاسخ‌ها و زمان باقی‌مانده در مرورگر ذخیره می‌شود. تا پیش از پایان وقت می‌توانید ادامه دهید.'],
  ['هر آزمون را چند بار می‌توانم بدهم؟', 'هر تعداد که بخواهید. همهٔ تلاش‌ها در داشبورد می‌مانند تا روند پیشرفتتان را ببینید.'],
  ['بخش شنیداری صدا ندارد، چه کنم؟', 'از Chrome، Edge یا Safari به‌روز استفاده کنید. اگر مرورگر پخش صوتی نداشته باشد، متن شنیداری نمایش داده می‌شود.'],
];

export default function HomePage() {
  const exams = listExams();
  const totalQuestions = exams.reduce((s, e) => s + e.questionCount, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div className="sheet-dots absolute inset-0" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-40 start-[-8rem] h-96 w-96 rounded-full bg-brand-600/40 blur-3xl" aria-hidden="true" />
        <div className="container-x relative grid items-center gap-14 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <h1 className="text-balance text-4xl font-extrabold leading-[1.5] sm:text-5xl sm:leading-[1.5]">
              آزمون آزمایشی واقعی، برای رسیدن به نمرهٔ هدف
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-9 text-ink-300">
              آیلتس، پی‌تی‌ای و تافل را با تایمر و ساختار شبیه آزمون اصلی تمرین کن، نتیجه را همان لحظه
              ببین و روند پیشرفتت را در داشبورد دنبال کن.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/register" className="btn-light !px-7 !py-3.5 !text-base">ثبت‌نام رایگان</Link>
              <Link href="/exams" className="btn !px-7 !py-3.5 !text-base text-white ring-1 ring-white/30 hover:bg-white/10">
                مشاهدهٔ آزمون‌ها
              </Link>
            </div>
          </div>

          {/* Score sheet: the memorable element of the page */}
          <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
            <div className="rounded-3xl bg-white p-6 text-ink-900 shadow-2xl ring-1 ring-white/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-ink-500">نمونه گزارش آزمون</p>
                  <p className="mt-1 font-extrabold">IELTS Academic</p>
                </div>
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-sun-400 text-ink-950">
                  <div className="text-center leading-tight">
                    <p className="text-2xl font-extrabold">۷٫۰</p>
                    <p className="text-[10px] font-bold">Band</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  ['شنیداری', 85, 'bg-brand-500'],
                  ['خواندن', 72, 'bg-accent-500'],
                  ['نوشتن', 60, 'bg-sun-400'],
                ].map(([label, v, color]) => (
                  <div key={label}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="font-bold">{label}</span>
                      <span className="text-ink-500">{fa(v)}٪</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-ink-950/5">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3 rounded-xl bg-accent-50 px-4 py-3 text-sm font-bold text-accent-700">
                <Icon name="trophy" className="h-5 w-5" />
                نسبت به آزمون قبل ۱۲٪ بهتر شدی
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facts about the product (computed from real content) */}
      <section className="border-b border-ink-950/5 bg-white">
        <div className="container-x grid grid-cols-2 gap-6 py-8 text-center md:grid-cols-4">
          {[
            [fa(Object.keys(EXAM_TYPES).length), 'آزمون بین‌المللی'],
            [fa(exams.length), 'آزمون آزمایشی آماده'],
            [fa(totalQuestions), 'سؤال تصحیح‌شونده'],
            ['۴', 'مهارت: شنیداری، خواندن، گرامر، نوشتن'],
          ].map(([n, label]) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-brand-700">{n}</p>
              <p className="mt-1 text-sm text-ink-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Exam types */}
      <section className="container-x py-20">
        <h2 className="section-title">کدام آزمون را می‌خواهی بدهی؟</h2>
        <p className="section-sub">برای هر آزمون، ساختار و مقیاس نمره‌دهی همان آزمون در نظر گرفته شده است.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {Object.entries(EXAM_TYPES).map(([key, t]) => (
            <Link key={key} href={`/exams?type=${key}`} className={`group rounded-3xl p-7 transition-transform hover:-translate-y-1 ${t.panel}`}>
              <p className="text-3xl font-extrabold">{t.fa}</p>
              <p className="mt-1 text-sm opacity-80" dir="ltr">{t.full}</p>
              <p className="mt-6 text-sm leading-8 opacity-90">{t.desc}</p>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold">
                {t.scale}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features: plain list rather than a wall of cards */}
      <section className="bg-white py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="section-title">هرچه برای یک تمرین جدی لازم است</h2>
            <p className="section-sub">از زمان‌سنج تا تحلیل نتیجه؛ تا فقط روی یادگیری تمرکز کنی.</p>
          </div>
          <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name={f.icon} />
                </span>
                <div>
                  <h3 className="font-extrabold">{f.title}</h3>
                  <p className="mt-1 text-sm leading-7 text-ink-500">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Steps (a real sequence, so numbered) */}
      <section className="container-x py-20">
        <h2 className="section-title">از ثبت‌نام تا نتیجه در سه قدم</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border border-dashed border-brand-300 p-6">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 font-extrabold text-white">{fa(i + 1)}</span>
              <h3 className="mt-4 text-lg font-extrabold">{s.title}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-500">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Exams */}
      <section className="bg-brand-50/60 py-20">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="section-title">آزمون‌های آمادهٔ شروع</h2>
            <Link href="/exams" className="btn-outline">همهٔ آزمون‌ها</Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {exams.slice(0, 3).map((e) => (
              <ExamCard key={e.id} exam={e} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x py-20">
        <h2 className="section-title">پرسش‌های پرتکرار</h2>
        <div className="mt-8 max-w-3xl divide-y divide-ink-950/10 rounded-2xl bg-white ring-1 ring-ink-950/5">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group p-5">
              <summary className="cursor-pointer list-none font-bold marker:hidden [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {q}
                  <span className="text-xl text-brand-600 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-8 text-ink-500">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x pb-4">
        <div className="relative overflow-hidden rounded-3xl bg-brand-600 px-8 py-14 text-center text-white">
          <div className="sheet-dots absolute inset-0" aria-hidden="true" />
          <div className="relative">
            <h2 className="text-2xl font-extrabold sm:text-3xl">اولین آزمونت را همین امروز بده</h2>
            <p className="mx-auto mt-3 max-w-lg text-brand-100">ثبت‌نام چند ثانیه طول می‌کشد و نتیجهٔ هر آزمون برایت ذخیره می‌شود.</p>
            <Link href="/register" className="btn-light mt-8 !px-8 !py-3.5 !text-base">ساخت حساب رایگان</Link>
          </div>
        </div>
      </section>
    </>
  );
}
