import { redirect } from 'next/navigation';
import AuthShell from '@/components/AuthShell';
import AuthForm from '@/components/AuthForm';
import { getCurrentUser } from '@/lib/auth';

export const metadata = { title: 'ورود' };

export default async function LoginPage({ searchParams }) {
  if (await getCurrentUser()) redirect('/dashboard');
  return (
    <AuthShell title="ورود به حساب" subtitle="برای ادامهٔ آزمون‌ها و دیدن پیشرفتت وارد شو.">
      <AuthForm mode="login" next={searchParams?.next} />
    </AuthShell>
  );
}
