import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/Icon';
import { getPublicExam } from '@/lib/exams';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { EXAM_TYPES, SKILLS, flattenQuestions, formatScore } from '@/lib/exam-meta';
import { fa, faDate } from '@/lib/format';

export function generateMetadata({ params }) {
  const exam = getPublicExam(params.id);
  return { title: exam ? exam.title : 'آزمون' };
}

const RULES = [
  'پس از شروع، تایمر متوقف نمی‌شود؛ با پایان وقت پاسخ‌ها خودکار ثبت می‌شود.',
  'اگر صفحه را ببندید یا رفرش کنید، پاسخ‌ها و زمان باقی‌مانده حفظ می‌شود.',
  'فایل‌های شنیداری حداکثر دو بار قابل پخش‌اند.',
  'بخش Writing نمره‌دهی خودکار ندارد و فقط ذخیره می‌شود.',
];

export default async function ExamIntroPage({ params }) {
  const exam = getPublicExam(params.id);
  if (!exam) notFound();

  const type = EXAM_TYPES[exam.type];
  const flat = flattenQuestions(exam);
  const user = await getCurrentUser();
  const previous = user ? db.listAttempts(user.id).filter((a) => a.examId === exam.id).slice(0, 5) : [];
  const startHref = `/exams/${exam.id}/take`;

  return (
    <section className="container-x py-12">
      <Link href="/exams" className="text-sm font-bold text-brand-600 hover:text-brand-800">بازگشت به فهرست آزمون‌ها</Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${type.badge}`}>
            {type.fa} <span dir="ltr">{exam.level}</span>
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-snug">{exam.title}</h1>
          <p className="mt-3 max-w-2xl leading-9 text-ink-500">{exam.description}</p>

          <h2 className="mt-10 text-lg font-extrabold">بخش‌های آزمون</h2>
          <ul className="mt-4 space-y-3">
            {exam.sections.map((s) => (
              <li key={s.id} className="card flex items-center gap-4 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name={SKILLS[s.skill].icon} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{SKILLS[s.skill].fa}</p>
                  <p dir="ltr" className="truncate text-left text-xs text-ink-500">{s.title}</p>
                </div>
                <span className="text-sm text-ink-500">{fa(s.questions.length)} سؤال</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-lg font-extrabold">قبل از شروع</h2>
          <ul className="mt-4 space-y-3 text-sm leading-8 text-ink-700">
            {RULES.map((r) => (
              <li key={r} className="flex gap-3">
                <Icon name="check" className="mt-2 h-4 w-4 shrink-0 text-accent-600" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-5 self-start lg:sticky lg:top-24">
          <div className="card p-6">
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between"><dt className="text-ink-500">مدت زمان</dt><dd className="font-bold">{fa(exam.durationMin)} دقیقه</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">تعداد سؤال</dt><dd className="font-bold">{fa(flat.length)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">مقیاس نمره</dt><dd className="font-bold">{type.scale}</dd></div>
            </dl>
            <Link
              href={user ? startHref : `/login?next=${encodeURIComponent(startHref)}`}
              className="btn-primary mt-6 w-full"
            >
              {user ? 'شروع آزمون' : 'ورود و شروع آزمون'}
            </Link>
            {!user && <p className="mt-3 text-center text-xs text-ink-500">برای ذخیرهٔ نتیجه باید وارد حساب خود شوید.</p>}
          </div>

          {previous.length > 0 && (
            <div className="card p-6">
              <h3 className="font-extrabold">تلاش‌های قبلی شما</h3>
              <ul className="mt-3 divide-y divide-ink-950/5 text-sm">
                {previous.map((a) => (
                  <li key={a.id}>
                    <Link href={`/results/${a.id}`} className="flex items-center justify-between py-3 hover:text-brand-700">
                      <span className="text-ink-500">{faDate(a.createdAt)}</span>
                      <span className="flex gap-3 font-bold"><span>{formatScore(a.examType, a.score)}</span><span className="text-ink-500">{fa(a.percent)}٪</span></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
