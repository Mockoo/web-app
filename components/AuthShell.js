import Icon from './Icon';

// Two-column layout shared by /login and /register.
export default function AuthShell({ title, subtitle, children }) {
  return (
    <section className="container-x grid min-h-[calc(100vh-4rem)] items-center gap-10 py-10 lg:grid-cols-2 lg:py-16">
      <div className="relative hidden overflow-hidden rounded-3xl bg-ink-900 p-10 text-white lg:block">
        <div className="sheet-dots absolute inset-0" aria-hidden="true" />
        <div className="relative">
          <h2 className="text-balance text-3xl font-extrabold leading-snug">
            هر آزمون، یک قدم نزدیک‌تر به نمرهٔ هدف
          </h2>
          <ul className="mt-8 space-y-5 text-ink-300">
            {[
              ['clock', 'تایمر و فرمت مشابه آزمون واقعی'],
              ['check', 'تصحیح فوری و نمرهٔ تخمینی'],
              ['chart', 'نمودار پیشرفت و تحلیل مهارت‌ها'],
            ].map(([icon, text]) => (
              <li key={text} className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-accent-400">
                  <Icon name={icon} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
        <p className="mt-2 text-ink-500">{subtitle}</p>
        <div className="card mt-8 p-6 sm:p-8">{children}</div>
      </div>
    </section>
  );
}
