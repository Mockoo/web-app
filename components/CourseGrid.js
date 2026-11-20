'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from './Icon';
import { COURSES, COURSE_FILTERS } from '@/content/courses';
import { EXAM_TYPES } from '@/lib/exam-meta';
import { fa, formatPrice } from '@/lib/format';

export default function CourseGrid() {
  const [filter, setFilter] = useState('all');
  const items = COURSES.filter((c) => filter === 'all' || c.exam === filter);

  return (
    <>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="فیلتر دوره‌ها">
        {COURSE_FILTERS.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              filter === f.id ? 'bg-brand-600 text-white' : 'bg-white text-ink-700 ring-1 ring-ink-950/10 hover:bg-brand-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => {
          const type = EXAM_TYPES[c.exam];
          return (
            <article key={c.slug} className="card flex flex-col p-6">
              <div className="flex items-center justify-between">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${type ? type.badge : 'bg-paper text-ink-700 ring-ink-950/10'}`}>
                  {type ? type.fa : 'زبان عمومی'}
                </span>
                {c.popular && (
                  <span className="flex items-center gap-1 rounded-full bg-sun-100 px-3 py-1 text-xs font-bold text-amber-800">
                    <Icon name="star" className="h-3.5 w-3.5" /> پرطرفدار
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-lg font-extrabold">{c.title}</h3>
              <p className="mt-1 text-xs font-bold text-brand-600">{c.level}</p>
              <p className="mt-3 text-sm leading-7 text-ink-500">{c.description}</p>

              <ul className="mt-4 space-y-2 text-sm text-ink-700">
                {c.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Icon name="check" className="h-4 w-4 shrink-0 text-accent-600" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6">
                <p className="flex gap-4 text-xs text-ink-500">
                  <span className="flex items-center gap-1"><Icon name="clock" className="h-3.5 w-3.5" />{fa(c.weeks)} هفته</span>
                  <span className="flex items-center gap-1"><Icon name="users" className="h-3.5 w-3.5" />{fa(c.sessions)} جلسه</span>
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="font-extrabold text-ink-900">{formatPrice(c.price)}</p>
                  <Link href={`/contact?course=${c.slug}`} className="btn-outline !px-4 !py-2">
                    مشاوره و ثبت‌نام
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
