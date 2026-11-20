import Link from 'next/link';
import Icon from '@/components/Icon';

export const metadata = { title: 'درباره ما' };

const VALUES = [
  { icon: 'shield', title: 'شفافیت در نمره', text: 'می‌گوییم نمره‌ها چطور محاسبه می‌شوند و کجا فقط تخمینی هستند.' },
  { icon: 'target', title: 'تمرین هدف‌مند', text: 'هر آزمون باید نشان دهد دقیقاً کجا ضعف داری و چه چیزی را تمرین کنی.' },
  { icon: 'users', title: 'دسترسی برابر', text: 'یک محیط ساده و رایگان برای همهٔ داوطلبان، از هر شهر و با هر دستگاه.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-ink-900 py-16 text-white">
        <div className="container-x max-w-3xl">
          <h1 className="text-3xl font-extrabold leading-snug sm:text-4xl">درباره آزمون‌یار</h1>
          <p className="mt-5 text-lg leading-9 text-ink-300">
            آزمون‌یار را ساختیم تا داوطلبان آزمون‌های بین‌المللی زبان، پیش از روز آزمون اصلی، در شرایطی
            شبیه واقعیت تمرین کنند و ببینند دقیقاً کجا ایستاده‌اند.
          </p>
        </div>
      </section>

      <section className="container-x grid gap-10 py-16 lg:grid-cols-2">
        <div>
          <h2 className="section-title">ماجرا از کجا شروع شد؟</h2>
          <div className="mt-5 space-y-4 leading-9 text-ink-700">
            <p>
              بیشتر داوطلبان تا هفته‌های آخر نمی‌دانند نمرهٔ واقعی‌شان چقدر است. کتاب‌ها و فایل‌های
              پراکنده زمان و فشار آزمون را شبیه‌سازی نمی‌کنند و بازخورد فوری هم ندارند.
            </p>
            <p>
              ما یک مسیر ساده ساختیم: ثبت‌نام، آزمون با زمان واقعی، تصحیح فوری و داشبوردی که نشان
              می‌دهد از آزمونی به آزمون بعدی چقدر پیشرفت کرده‌ای.
            </p>
          </div>
        </div>

        <div className="card self-start p-6">
          <h3 className="font-extrabold">نمره‌دهی چطور کار می‌کند؟</h3>
          <ul className="mt-4 space-y-3 text-sm leading-8 text-ink-700">
            <li className="flex gap-3"><Icon name="check" className="mt-1.5 h-4 w-4 shrink-0 text-accent-600" />سؤال‌های تستی و پاسخ‌کوتاه روی سرور تصحیح می‌شوند.</li>
            <li className="flex gap-3"><Icon name="check" className="mt-1.5 h-4 w-4 shrink-0 text-accent-600" />درصد پاسخ‌های درست به مقیاس هر آزمون (آیلتس ۰–۹، پی‌تی‌ای ۱۰–۹۰، تافل ۰–۱۲۰) تبدیل می‌شود.</li>
            <li className="flex gap-3"><Icon name="alert" className="mt-1.5 h-4 w-4 shrink-0 text-amber-600" />بخش Writing خودکار نمره‌دهی نمی‌شود و فقط ذخیره می‌گردد.</li>
            <li className="flex gap-3"><Icon name="alert" className="mt-1.5 h-4 w-4 shrink-0 text-amber-600" />نمره‌ها تخمینی‌اند و جایگزین نتیجهٔ رسمی آزمون نیستند.</li>
          </ul>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x">
          <h2 className="section-title">چیزهایی که برایمان مهم است</h2>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {VALUES.map((v) => (
              <li key={v.title}>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600"><Icon name={v.icon} className="h-6 w-6" /></span>
                <h3 className="mt-4 text-lg font-extrabold">{v.title}</h3>
                <p className="mt-2 text-sm leading-8 text-ink-500">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-x py-16 text-center">
        <h2 className="section-title">سؤالی دارید؟</h2>
        <p className="mx-auto mt-3 max-w-lg text-ink-500">برای مشاوره، همکاری یا گزارش مشکل با ما در تماس باشید.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/contact" className="btn-primary">تماس با ما</Link>
          <Link href="/register" className="btn-outline">ثبت‌نام</Link>
        </div>
      </section>
    </>
  );
}
