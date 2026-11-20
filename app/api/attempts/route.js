import { NextResponse } from 'next/server';
import { db, uid } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getExam, gradeExam, sanitizeAnswers } from '@/lib/exams';

// Submit an exam. Grading happens ONLY here, on the server.
export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'برای ثبت آزمون باید وارد شوید.' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const exam = getExam(body?.examId);
  if (!exam) return NextResponse.json({ error: 'آزمون پیدا نشد.' }, { status: 404 });

  const answers = sanitizeAnswers(exam, body.answers);
  const result = gradeExam(exam, answers);
  const maxSec = exam.durationMin * 60 + 60;
  const durationSec = Math.min(maxSec, Math.max(0, Math.round(Number(body.durationSec) || 0)));

  const attempt = db.addAttempt({
    id: uid(),
    userId: user.id,
    examId: exam.id,
    examType: exam.type,
    examTitle: exam.title,
    createdAt: new Date().toISOString(),
    durationSec,
    answers,
    ...result,
  });

  return NextResponse.json({ id: attempt.id }, { status: 201 });
}
