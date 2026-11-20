import Link from 'next/link';
import Icon from './Icon';
import { EXAM_TYPES, SKILLS } from '@/lib/exam-meta';
import { fa } from '@/lib/format';

// `exam` is a summary object from listExams().
export default function ExamCard({ exam }) {
  const type = EXAM_TYPES[exam.type];
  return (
    <Link
      href={`/exams/${exam.id}`}
      className="card group flex flex-col p-6 transition-shadow hover:shadow-soft"
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${type.badge}`}>
          {type.fa} <span dir="ltr">{exam.level}</span>
        </span>
        <span className="flex items-center gap-1 text-xs text-ink-500">
          <Icon name="clock" className="h-4 w-4" />
          {fa(exam.durationMin)} دقیقه
        </span>
      </div>

      <h3 className="mt-4 text-lg font-extrabold leading-8">{exam.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-7 text-ink-500">{exam.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {exam.skills.map((s) => (
          <span key={s} className="flex items-center gap-1 rounded-lg bg-paper px-2.5 py-1 text-xs text-ink-700 ring-1 ring-ink-950/5">
            <Icon name={SKILLS[s].icon} className="h-3.5 w-3.5" />
            {SKILLS[s].fa}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-6 text-sm">
        <span className="text-ink-500">{fa(exam.questionCount)} سؤال</span>
        <span className="flex items-center gap-1.5 font-bold text-brand-600 group-hover:text-brand-800">
          مشاهده و شروع
          <Icon name="arrow" className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
