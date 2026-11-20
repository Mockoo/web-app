import CourseGrid from '@/components/CourseGrid';

export const metadata = { title: 'دوره‌های آموزشی' };

export default function CoursesPage() {
  return (
    <>
      <section className="bg-ink-900 py-14 text-white">
        <div className="container-x">
          <h1 className="text-3xl font-extrabold sm:text-4xl">دوره‌های آمادگی آزمون</h1>
          <p className="mt-4 max-w-2xl leading-9 text-ink-300">
            کلاس‌های هدف‌مند آیلتس، پی‌تی‌ای و تافل، همراه با آزمون آزمایشی و گزارش پیشرفت.
          </p>
        </div>
      </section>
      <section className="container-x py-12">
        <CourseGrid />
      </section>
    </>
  );
}
