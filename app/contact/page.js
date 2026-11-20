import Icon from '@/components/Icon';
import ContactForm from '@/components/ContactForm';
import { COURSES } from '@/content/courses';

export const metadata = { title: 'تماس با ما' };

const INFO = [
  { icon: 'mail', label: 'ایمیل', value: 'support@azmoonyar.example', ltr: true },
  { icon: 'phone', label: 'تلفن', value: '۰۲۱-۰۰۰۰۰۰۰۰', ltr: false },
  { icon: 'pin', label: 'نشانی', value: 'تهران، خیابان نمونه، پلاک ۱۲', ltr: false },
  { icon: 'clock', label: 'ساعت پاسخ‌گویی', value: 'شنبه تا چهارشنبه، ۹ تا ۱۷', ltr: false },
];

export default function ContactPage({ searchParams }) {
  const course = COURSES.find((c) => c.slug === searchParams?.course);
  const defaultMessage = course ? `سلام، برای دورهٔ «${course.title}» مشاوره و اطلاعات ثبت‌نام می‌خواهم.` : '';

  return (
    <section className="container-x py-14">
      <h1 className="text-3xl font-extrabold sm:text-4xl">تماس با ما</h1>
      <p className="mt-3 max-w-xl text-ink-500">پیام بگذارید؛ معمولاً ظرف یک روز کاری پاسخ می‌دهیم.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6 sm:p-8">
          <ContactForm defaultMessage={defaultMessage} />
        </div>
        <ul className="space-y-5 self-start">
          {INFO.map((i) => (
            <li key={i.label} className="card flex items-center gap-4 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><Icon name={i.icon} /></span>
              <div>
                <p className="text-xs text-ink-500">{i.label}</p>
                <p className="font-bold" dir={i.ltr ? 'ltr' : undefined}>{i.value}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
