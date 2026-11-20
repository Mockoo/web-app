import Link from 'next/link';
import ExamCard from '@/components/ExamCard';
import { listExams } from '@/lib/exams';
import { EXAM_TYPES } from '@/lib/exam-meta';

export const metadata = { title: 'آزمون‌های آزمایشی' };

export default function ExamsPage({ searchParams }) {
  const type = Object.hasOwn(EXAM_TYPES, searchParams?.type) ? searchParams.type : null;
  const exams = listExams(type);

  const tab = (active) =>
    `rounded-full px-4 py-2 text-sm font-bold transition-colors ${
      active ? 'bg-brand-600 text-white' : 'bg-white text-ink-700 ring-1 ring-ink-950/10 hover:bg-brand-50'
    }`;

  return (
    <>
      <section className="bg-ink-900 py-14 text-white">
        <div className="container-x">
          <h1 className="text-3xl font-extrabold sm:text-4xl">آزمون‌های آزمایشی</h1>
          <p className="mt-4 max-w-2xl leading-9 text-ink-300">
            یک آزمون انتخاب کن، وقت را تنظیم کن و شروع کن. نتیجهٔ هر آزمون در داشبورد ذخیره می‌شود.
          </p>
        </div>
      </section>

      <section className="container-x py-10">
        <nav className="flex flex-wrap gap-2" aria-label="فیلتر نوع آزمون">
          <Link href="/exams" className={tab(!type)}>همه</Link>
          {Object.entries(EXAM_TYPES).map(([key, t]) => (
            <Link key={key} href={`/exams?type=${key}`} className={tab(type === key)}>{t.fa}</Link>
          ))}
        </nav>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((e) => <ExamCard key={e.id} exam={e} />)}
        </div>
        {exams.length === 0 && <p className="mt-10 text-center text-ink-500">آزمونی برای این دسته وجود ندارد.</p>}
      </section>
    </>
  );
}
