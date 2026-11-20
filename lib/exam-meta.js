// Pure constants + helpers – SAFE to import from client components.
// (Never import content/exams.js or lib/exams.js from the client: they hold answers.)
import { fa } from '@/lib/format';

export const EXAM_TYPES = {
  IELTS: {
    fa: 'آیلتس',
    full: 'IELTS',
    scale: 'باند ۰ تا ۹', // Persian-only on purpose: mixing Latin + Persian words scrambles under bidi
    desc: 'پرکاربردترین آزمون زبان برای مهاجرت و پذیرش دانشگاهی؛ نمره با باند ۰ تا ۹ اعلام می‌شود.',
    badge: 'bg-brand-50 text-brand-700 ring-brand-200',
    bar: 'bg-brand-500',
    panel: 'bg-brand-600 text-white',
  },
  PTE: {
    fa: 'پی‌تی‌ای',
    full: 'PTE Academic',
    scale: 'نمره ۱۰ تا ۹۰',
    desc: 'آزمون کاملاً کامپیوتری با تصحیح خودکار؛ نتیجه معمولاً چند روز بعد از آزمون آماده می‌شود.',
    badge: 'bg-accent-50 text-accent-700 ring-accent-200',
    bar: 'bg-accent-500',
    panel: 'bg-accent-600 text-white',
  },
  TOEFL: {
    fa: 'تافل',
    full: 'TOEFL iBT',
    scale: 'نمره ۰ تا ۱۲۰',
    desc: 'آزمون مرجع دانشگاه‌های آمریکا و کانادا با چهار مهارت و مقیاس ۱۲۰ نمره‌ای.',
    badge: 'bg-sun-100 text-amber-800 ring-amber-200',
    bar: 'bg-sun-400',
    panel: 'bg-ink-900 text-white',
  },
};

export const SKILLS = {
  listening: { fa: 'شنیداری', en: 'Listening', icon: 'headphones' },
  reading: { fa: 'خواندن', en: 'Reading', icon: 'book' },
  grammar: { fa: 'گرامر و واژگان', en: 'Grammar & Vocabulary', icon: 'sparkles' },
  writing: { fa: 'نوشتن', en: 'Writing', icon: 'pen' },
};

/** Format a stored numeric score for display: IELTS 7.0, PTE 65, TOEFL 98 */
export function formatScore(type, score) {
  if (type === 'IELTS') return fa(score, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return fa(score);
}

export function flattenQuestions(exam) {
  const out = [];
  let n = 0;
  for (const section of exam.sections) {
    for (const q of section.questions) out.push({ n: ++n, section, q });
  }
  return out;
}

export const isAnswered = (v) => v !== undefined && v !== null && String(v).trim() !== '';

export const countWords = (text) => (String(text || '').trim().match(/\S+/g) || []).length;
