import './globals.css';
import { Vazirmatn } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const vazir = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-vazir',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'آزمون‌یار | آزمون آزمایشی آیلتس، پی‌تی‌ای و تافل',
    template: '%s | آزمون‌یار',
  },
  description:
    'آزمون‌های آزمایشی آیلتس، پی‌تی‌ای و تافل با تایمر واقعی، نمره‌دهی فوری و داشبورد پیشرفت. ثبت‌نام کن و سطح واقعی‌ات را بسنج.',
  openGraph: {
    title: 'آزمون‌یار',
    description: 'شبیه‌ساز آزمون‌های بین‌المللی زبان انگلیسی',
    locale: 'fa_IR',
    type: 'website',
  },
};

export const viewport = { themeColor: '#17124A' };

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
