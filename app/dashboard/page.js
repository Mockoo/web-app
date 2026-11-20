import Link from 'next/link';
import Icon from '@/components/Icon';
import ScoreChart from '@/components/ScoreChart';
import ExamCard from '@/components/ExamCard';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { listExams } from '@/lib/exams';
import { EXAM_TYPES, SKILLS, formatScore } from '@/lib/exam-meta';
import { fa, faDate, formatMinutes } from '@/lib/format';

export const metadata = { title: 'داشبورد پیشرفت', robots: { index: false } };

function Stat({ icon, label, value, hint }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 text-ink-500">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600"><Icon name={icon} /></span>
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-4 text-2xl font-extrabold">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}

export default async function DashboardPage() {
  const user = await requireUser('/dashboard');
  const attempts = db.listAttempts(user.id); // newest first
  const count = attempts.length;

  const avg = count ? Math.round(attempts.reduce((s, a) => s + a.percent, 0) / count) : 0;
  const best = count ? attempts.reduce((b, a) => (a.percent > b.percent ? a : b)) : null;
  const minutes = attempts.reduce((s, a) => s + a.durationSec, 0) / 60;
  const delta = count > 1 ? attempts[0].percent - attempts[1].percent : null;
  // Words instead of a signed number: "+" / "−" get scrambled by the bidi algorithm in RTL text.
  const deltaText =
    delta === null
      ? undefined
      : delta === 0
        ? 'بدون تغییر نسبت به آزمون قبل'
        : `${fa(Math.abs(delta))}٪ ${delta > 0 ? 'بهتر' : 'ضعیف‌تر'} از آزمون قبل`;

  // Per-skill accuracy across all attempts
  const skillAgg = {};
  for (const a of attempts) {
    for (const [skill, s] of Object.entries(a.bySkill || {})) {
      const t = (skillAgg[skill] ||= { correct: 0, total: 0 });
      t.correct += s.correct;
      t.total += s.total;
    }
  }
  const skills = Object.entries(skillAgg)
    .map(([key, s]) => ({ key, percent: Math.round((s.correct / s.total) * 100) }))
    .sort((a, b) => a.percent - b.percent);
  const weakest = skills[0];

  // Goal: best score in the user's target exam
  const target = EXAM_TYPES[user.targetExam];
  const bestInTarget = attempts
    .filter((a) => a.examType === user.targetExam)
    .reduce((b, a) => (!b || a.percent > b.percent ? a : b), null);

  const points = [...attempts].reverse().map((a, i) => ({
    label: fa(i + 1),
    value: a.percent,
    title: `${a.examTitle} – ${faDate(a.createdAt)}: ${fa(a.percent)}٪`,
  }));

  const doneIds = new Set(attempts.map((a) => a.examId));
  const suggestions = listExams(user.targetExam).filter((e) => !doneIds.has(e.id)).slice(0, 3);

  return (
    <section className="container-x py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">سلام، {user.name.split(' ')[0]}</h1>
          <p className="mt-1 flex flex-wrap gap-x-5 text-ink-500">
            <span>آزمون هدف: <span className="font-bold text-ink-900">{target?.fa}</span></span>
            {bestInTarget && <span>بهترین نتیجه در آن: <span className="font-bold text-ink-900">{formatScore(bestInTarget.examType, bestInTarget.score)}</span></span>}
          </p>
        </div>
        <Link href="/exams" className="btn-primary">شروع آزمون جدید</Link>
      </div>

      {count === 0 ? (
        <div className="card mt-10 p-10 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600"><Icon name="chart" className="h-7 w-7" /></span>
          <h2 className="mt-5 text-xl font-extrabold">هنوز آزمونی نداده‌ای</h2>
          <p className="mx-auto mt-2 max-w-md text-ink-500">اولین آزمونت را بده تا نمودار پیشرفت و تحلیل مهارت‌ها اینجا ساخته شود.</p>
          <Link href="/exams" className="btn-primary mt-6">انتخاب آزمون</Link>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon="book" label="آزمون‌های انجام‌شده" value={fa(count)} />
            <Stat icon="chart" label="میانگین پاسخ درست" value={`${fa(avg)}٪`} hint={deltaText} />
            <Stat icon="trophy" label="بهترین نتیجه" value={formatScore(best.examType, best.score)} hint={`${fa(best.percent)}٪ پاسخ درست در ${EXAM_TYPES[best.examType]?.fa}`} />
            <Stat icon="clock" label="زمان تمرین" value={formatMinutes(minutes)} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="card p-6">
              <h2 className="font-extrabold">روند نتایج</h2>
              <p className="mb-4 text-xs text-ink-500">درصد پاسخ درست در هر آزمون، از قدیمی به جدید</p>
              <ScoreChart points={points} />
            </div>

            <div className="card p-6">
              <h2 className="font-extrabold">عملکرد در مهارت‌ها</h2>
              <div className="mt-5 space-y-4">
                {skills.map((s) => (
                  <div key={s.key}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="font-bold">{SKILLS[s.key]?.fa || s.key}</span>
                      <span className="text-ink-500">{fa(s.percent)}٪</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-ink-950/5">
                      <div className={`h-full rounded-full ${s === weakest ? 'bg-sun-400' : 'bg-brand-500'}`} style={{ width: `${s.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              {weakest && skills.length > 1 && (
                <p className="mt-6 rounded-xl bg-sun-100 px-4 py-3 text-sm leading-7 text-amber-900">
                  ضعیف‌ترین مهارت تو «{SKILLS[weakest.key]?.fa}» است؛ در تمرین بعدی روی آن بیشتر وقت بگذار.
                </p>
              )}
            </div>
          </div>

          <div className="card mt-6 overflow-hidden">
            <div className="p-6 pb-3"><h2 className="font-extrabold">آخرین آزمون‌ها</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] text-sm">
                <thead className="bg-paper text-ink-500">
                  <tr>
                    <th className="px-6 py-3 text-start font-bold">آزمون</th>
                    <th className="px-4 py-3 text-start font-bold">تاریخ</th>
                    <th className="px-4 py-3 text-start font-bold">نمره</th>
                    <th className="px-4 py-3 text-start font-bold">درصد</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-950/5">
                  {attempts.slice(0, 10).map((a) => (
                    <tr key={a.id}>
                      <td className="px-6 py-4 font-bold">{a.examTitle}</td>
                      <td className="px-4 py-4 text-ink-500">{faDate(a.createdAt)}</td>
                      <td className="px-4 py-4 font-bold">{formatScore(a.examType, a.score)}</td>
                      <td className="px-4 py-4">{fa(a.percent)}٪</td>
                      <td className="px-6 py-4 text-end"><Link href={`/results/${a.id}`} className="font-bold text-brand-600 hover:text-brand-800">مشاهده</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {suggestions.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-extrabold">پیشنهاد برای تمرین بعدی</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((e) => <ExamCard key={e.id} exam={e} />)}
          </div>
        </div>
      )}
    </section>
  );
}
