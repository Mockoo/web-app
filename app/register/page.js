import { redirect } from 'next/navigation';
import AuthShell from '@/components/AuthShell';
import AuthForm from '@/components/AuthForm';
import { getCurrentUser } from '@/lib/auth';

export const metadata = { title: 'ثبت‌نام' };

export default async function RegisterPage({ searchParams }) {
  if (await getCurrentUser()) redirect('/dashboard');
  return (
    <AuthShell title="ساخت حساب رایگان" subtitle="با چند ثانیه ثبت‌نام، اولین آزمونت را شروع کن.">
      <AuthForm mode="register" next={searchParams?.next} />
    </AuthShell>
  );
}
