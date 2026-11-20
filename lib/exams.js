import 'server-only';
import { EXAMS } from '@/content/exams';
import { EXAM_TYPES, flattenQuestions, countWords } from '@/lib/exam-meta';

/* ---------- Reading the exam bank ---------- */

const countQuestions = (exam) => flattenQuestions(exam).length;
const skillsOf = (exam) => [...new Set(exam.sections.map((s) => s.skill))];

/** Lightweight list for cards (no questions, no answers). */
export function listExams(type) {
  return EXAMS.filter((e) => !type || e.type === type).map((e) => ({
    id: e.id,
    type: e.type,
    level: e.level,
    title: e.title,
    description: e.description,
    durationMin: e.durationMin,
    skills: skillsOf(e),
    questionCount: countQuestions(e),
  }));
}

/** Full exam INCLUDING answers – server only (grading + result review). */
export function getExam(id) {
  return EXAMS.find((e) => e.id === id) || null;
}

/** Exam safe to send to the browser: answers and explanations stripped. */
export function getPublicExam(id) {
  const exam = getExam(id);
  if (!exam) return null;
  return {
    ...exam,
    sections: exam.sections.map((s) => ({
      ...s,
      questions: s.questions.map(({ answer, explanation, ...q }) => q), // eslint-disable-line no-unused-vars
    })),
  };
}

/* ---------- Grading ---------- */

const norm = (s) => String(s ?? '').trim().toLowerCase().replace(/[.\s]+$/g, '').replace(/\s+/g, ' ');

/** Approximate conversion from percent-correct to each exam's official scale. */
export function percentToScore(type, percent) {
  const p = Math.min(100, Math.max(0, percent)) / 100;
  if (type === 'IELTS') return Math.round(p * 9 * 2) / 2;
  if (type === 'PTE') return Math.round(10 + p * 80);
  if (type === 'TOEFL') return Math.round(p * 120);
  return Math.round(p * 100);
}

/** Drop anything that is not a valid answer for the exam's questions. */
export function sanitizeAnswers(exam, raw) {
  const out = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const { q } of flattenQuestions(exam)) {
    const v = raw[q.id];
    if (q.type === 'mcq') {
      if (Number.isInteger(v) && v >= 0 && v < q.options.length) out[q.id] = v;
    } else if (typeof v === 'string' && v.trim()) {
      out[q.id] = v.slice(0, q.type === 'writing' ? 8000 : 200);
    }
  }
  return out;
}

export function gradeExam(exam, answers) {
  const detail = {};
  const bySkill = {};
  let correct = 0;
  let total = 0;

  for (const { section, q } of flattenQuestions(exam)) {
    const given = answers[q.id] ?? null;

    if (q.type === 'writing') {
      // Free writing is stored but not auto-scored.
      detail[q.id] = { given, graded: false, words: countWords(given) };
      continue;
    }

    let isCorrect = false;
    if (q.type === 'mcq') {
      isCorrect = given === q.answer;
    } else if (given !== null) {
      isCorrect = [].concat(q.answer).map(norm).includes(norm(given));
    }

    detail[q.id] = { given, graded: true, isCorrect };
    total += 1;
    if (isCorrect) correct += 1;
    const s = (bySkill[section.skill] ||= { correct: 0, total: 0 });
    s.total += 1;
    if (isCorrect) s.correct += 1;
  }

  const percent = total ? Math.round((correct / total) * 100) : 0;
  return {
    correct,
    total,
    percent,
    score: percentToScore(exam.type, percent),
    bySkill,
    detail,
    scaleLabel: EXAM_TYPES[exam.type]?.scale,
  };
}
