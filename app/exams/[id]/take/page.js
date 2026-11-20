import { notFound } from 'next/navigation';
import ExamRunner from '@/components/ExamRunner';
import { getPublicExam } from '@/lib/exams';
import { requireUser } from '@/lib/auth';

export const metadata = { title: 'در حال آزمون', robots: { index: false } };

export default async function TakeExamPage({ params }) {
  await requireUser(`/exams/${params.id}/take`);
  const exam = getPublicExam(params.id); // answers are stripped
  if (!exam) notFound();
  return <ExamRunner exam={exam} />;
}
