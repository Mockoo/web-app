import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/Icon';
import ScoreRing from '@/components/ScoreRing';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getExam } from '@/lib/exams';
import { EXAM_TYPES, SKILLS, flattenQuestions, formatScore } from '@/lib/exam-meta';
import { fa, faDateTime, formatMinutes } from '@/lib/format';

export const metadata = { title: 'نتیجه آزمون', robots: { index: false } };

function answerText(q, given) {
  if (given === null || given === undefined || given === '') return null;
  return q.type === 'mcq' ? q.options[given] : String(given);
}

const correctText = (q) => (q.type === 'mcq' ? q.options[q.answer] : [].concat(q.answer)[0]);

export default async function ResultPage({ params }) {
  const user = await requireUser(`/results/${params.id}`);
  const attempt = db.getAttempt(params.id);
  if (!attempt || attempt.userId !== user.id) notFound();

  const exam = getExam(attempt.examId); // may be null if the exam was removed later
  const type = EXAM_TYPES[attempt.examType];
  const flat = exam ? flattenQuestions(exam) : [];
  const unanswered = attempt.total - Object.values(attempt.detail).filter((d) => d.graded && d.given !== null).length;

  return (
    <section className="container-x py-12">
      <p className="text-sm text-ink-500">{faDateTime(attempt.createdAt)}</p>
      <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">{attempt.examTitle}</h1>

      {/* Summary */}
      <div className="card mt-8 grid gap-8 p-6 sm:p-8 md:grid-cols-[auto_1fr] md:items-center">
        <ScoreRing percent={attempt.percent}>
          <div>
            <p className="text-3xl font-extrabold text-brand-700">{formatScore(attempt.examType, attempt.score)}</p>
            <p className="text-xs text-ink-500">{type?.scale}</p>
          </div>
        </ScoreRing>

        <div>
          <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div><dt className="text-ink-500">پاسخ درست</dt><dd className="text-lg font-extrabold">{fa(attempt.correct)} از {fa(attempt.total)}</dd></div>
            <div><dt className="text-ink-500">درصد</dt><dd className="text-lg font-extrabold">{fa(attempt.percent)}٪</dd></div>
            <div><dt className="text-ink-500">بدون پاسخ</dt><dd className="text-lg font-extrabold">{fa(unanswered)}</dd></div>
            <div><dt className="text-ink-500">زمان صرف‌شده</dt><dd className="text-lg font-extrabold">{formatMinutes(attempt.durationSec / 60)}</dd></div>
          </dl>

          <div className="mt-6 space-y-3">
            {Object.entries(attempt.bySkill).map(([skill, s]) => {
              const pct = Math.round((s.correct / s.total) * 100);
              return (
                <div key={skill}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-bold">{SKILLS[skill]?.fa || skill}</span>
                    <span className="text-ink-500">{fa(s.correct)} از {fa(s.total)}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-ink-950/5">
                    <div className={`h-full rounded-full ${type?.bar || 'bg-brand-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs leading-7 text-ink-500">
        نمره تخمینی است و از روی درصد پاسخ‌های درست محاسبه شده؛ بخش Writing در آن لحاظ نشده است.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/exams/${attempt.examId}`} className="btn-primary">تکرار این آزمون</Link>
        <Link href="/dashboard" className="btn-outline">داشبورد پیشرفت</Link>
        <Link href="/exams" className="btn-ghost">آزمون‌های دیگر</Link>
      </div>

      {/* Review */}
      {exam && (
        <div className="mt-14">
          <h2 className="text-xl font-extrabold">مرور پاسخ‌ها</h2>
          <ol className="mt-6 space-y-4">
            {flat.map(({ n, section, q }) => {
              const d = attempt.detail[q.id] || {};
              const given = answerText(q, d.given);

              if (q.type === 'writing') {
                return (
                  <li key={q.id} className="card p-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-ink-500">
                      <Icon name="pen" className="h-4 w-4" /> سؤال {fa(n)} از بخش {SKILLS[section.skill].fa}
                    </div>
                    <p dir="ltr" className="mt-3 text-left font-semibold leading-7">{q.text}</p>
                    <div dir="ltr" className="mt-3 whitespace-pre-line rounded-xl bg-paper p-4 text-left text-sm leading-7 ring-1 ring-ink-950/5">
                      {given || <span className="text-ink-300">No response</span>}
                    </div>
                    <p className="mt-3 text-xs text-ink-500">
                      {fa(d.words || 0)} کلمه (حداقل {fa(q.minWords)}). این بخش نمره‌دهی خودکار ندارد؛ آن را با مدرس یا نمونه‌پاسخ مقایسه کنید.
                    </p>
                  </li>
                );
              }

              return (
                <li key={q.id} className={`card border-s-4 p-5 ${d.isCorrect ? 'border-accent-500' : 'border-red-400'}`}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-ink-500">سؤال {fa(n)} از بخش {SKILLS[section.skill].fa}</span>
                    <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${d.isCorrect ? 'bg-accent-50 text-accent-700' : 'bg-red-50 text-red-700'}`}>
                      {d.isCorrect ? 'درست' : given ? 'نادرست' : 'بدون پاسخ'}
                    </span>
                  </div>
                  <p dir="ltr" className="mt-3 text-left font-semibold leading-7">{q.text}</p>
                  <dl dir="ltr" className="mt-3 grid gap-1 text-left text-sm sm:grid-cols-2">
                    <div><dt className="inline text-ink-500">Your answer: </dt><dd className="inline font-bold">{given || '—'}</dd></div>
                    {!d.isCorrect && <div><dt className="inline text-ink-500">Correct answer: </dt><dd className="inline font-bold text-accent-700">{correctText(q)}</dd></div>}
                  </dl>
                  {q.explanation && <p className="mt-3 rounded-lg bg-brand-50 px-4 py-3 text-sm leading-7 text-brand-900">{q.explanation}</p>}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </section>
  );
}
