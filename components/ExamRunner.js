'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from './Icon';
import { EXAM_TYPES, SKILLS, flattenQuestions, isAnswered, countWords } from '@/lib/exam-meta';
import { fa, formatClock } from '@/lib/format';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];
const MAX_PLAYS = 2;
const storageKey = (id) => `azmoonyar:exam:${id}`;

/* ------------------------------------------------------------------ */
/* Listening: reads the section script aloud with the browser's TTS.   */
/* ------------------------------------------------------------------ */
function ListeningPlayer({ script, plays, onPlay }) {
  const [supported, setSupported] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => window.speechSynthesis?.cancel(); // stop audio when leaving the section
  }, []);

  const left = MAX_PLAYS - plays;

  function play() {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(script);
    u.lang = 'en-GB';
    u.rate = 0.92;
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
    onPlay();
    setPlaying(true);
    synth.speak(u);
  }

  function stop() {
    window.speechSynthesis.cancel();
    setPlaying(false);
  }

  if (!supported) {
    return (
      <div className="mt-5 rounded-xl bg-sun-100 p-4 text-sm text-amber-900">
        <p className="font-bold">مرورگر شما پخش صوتی را پشتیبانی نمی‌کند.</p>
        <p dir="ltr" className="mt-2 text-left leading-7">{script}</p>
      </div>
    );
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-4 rounded-xl bg-ink-900 p-4 text-white">
      <button
        type="button"
        onClick={playing ? stop : play}
        disabled={!playing && left <= 0}
        className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent-500 text-ink-950 transition-colors hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={playing ? 'توقف پخش' : 'پخش صوت'}
      >
        <Icon name={playing ? 'pause' : 'play'} />
      </button>
      <div className="text-sm">
        <p className="font-bold">{playing ? 'در حال پخش…' : 'پخش فایل شنیداری'}</p>
        <p className="text-ink-300">
          {left > 0 ? `${fa(left)} بار پخش باقی مانده` : 'سقف پخش این بخش تمام شده است'}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* One question                                                        */
/* ------------------------------------------------------------------ */
function Question({ n, q, value, onChange }) {
  const words = q.type === 'writing' ? countWords(value) : 0;

  return (
    <div id={`q-${q.id}`} className="scroll-mt-40">
      <div dir="ltr" className="flex gap-3 text-left">
        <span className="grid h-7 min-w-7 shrink-0 place-items-center rounded-lg bg-brand-600 px-1 text-xs font-bold text-white">
          {fa(n)}
        </span>
        <p className="font-semibold leading-7">{q.text}</p>
      </div>

      {q.type === 'mcq' && (
        <div dir="ltr" className="mt-3 grid gap-2 ps-10 sm:grid-cols-2">
          {q.options.map((opt, i) => {
            const on = value === i;
            return (
              <button
                key={i}
                type="button"
                aria-pressed={on}
                onClick={() => onChange(i)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                  on ? 'bg-brand-50 text-brand-800 ring-2 ring-brand-500' : 'bg-white ring-1 ring-ink-300/70 hover:ring-brand-400'
                }`}
              >
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${on ? 'bg-brand-600 text-white' : 'bg-paper text-ink-500'}`}>
                  {LETTERS[i]}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {q.type === 'text' && (
        <div dir="ltr" className="mt-3 ps-10">
          <input
            dir="ltr"
            className="input max-w-sm text-left"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      )}

      {q.type === 'writing' && (
        <div className="mt-3">
          <textarea
            dir="ltr"
            rows={11}
            className="input resize-y text-left leading-7"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Start writing here…"
            spellCheck
          />
          <p className={`mt-2 text-xs font-bold ${words >= q.minWords ? 'text-accent-700' : 'text-amber-700'}`}>
            تعداد کلمات: {fa(words)} از حداقل {fa(q.minWords)}
          </p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Runner                                                              */
/* ------------------------------------------------------------------ */
export default function ExamRunner({ exam }) {
  const router = useRouter();
  const totalSec = exam.durationMin * 60;
  const flat = useMemo(() => flattenQuestions(exam), [exam]);
  const type = EXAM_TYPES[exam.type];

  const [ready, setReady] = useState(false);
  const [answers, setAnswers] = useState({});
  const [plays, setPlays] = useState({});
  const [endAt, setEndAt] = useState(0);
  const [now, setNow] = useState(0);
  const [step, setStep] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const sent = useRef(false);

  // Restore an unfinished attempt (so a refresh never resets the clock).
  useEffect(() => {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(storageKey(exam.id)) || 'null');
    } catch {}
    const alive = saved && saved.endAt > Date.now();
    setAnswers(alive ? saved.answers || {} : {});
    setPlays(alive ? saved.plays || {} : {});
    setEndAt(alive ? saved.endAt : Date.now() + totalSec * 1000);
    setNow(Date.now());
    setReady(true);
  }, [exam.id, totalSec]);

  // Persist progress.
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey(exam.id), JSON.stringify({ endAt, answers, plays }));
    } catch {}
  }, [ready, endAt, answers, plays, exam.id]);

  // Clock.
  useEffect(() => {
    if (!ready) return undefined;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [ready]);

  const timeLeft = ready ? Math.max(0, Math.ceil((endAt - now) / 1000)) : totalSec;

  const submit = useCallback(async () => {
    if (sent.current) return;
    sent.current = true;
    setSubmitting(true);
    setConfirmOpen(false);
    setError('');
    try {
      const spent = Math.min(totalSec, Math.max(0, totalSec - Math.ceil((endAt - Date.now()) / 1000)));
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId: exam.id, answers, durationSec: spent }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'ثبت آزمون ناموفق بود.');
      localStorage.removeItem(storageKey(exam.id));
      router.push(`/results/${data.id}`);
    } catch (err) {
      sent.current = false;
      setSubmitting(false);
      setError(err.message);
    }
  }, [answers, endAt, exam.id, router, totalSec]);

  // Time is up -> submit automatically.
  useEffect(() => {
    if (ready && timeLeft === 0) submit();
  }, [ready, timeLeft, submit]);

  // Warn before closing the tab mid-exam.
  useEffect(() => {
    if (!ready || submitting) return undefined;
    const h = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [ready, submitting]);

  if (!ready) {
    return <div className="container-x py-24 text-center text-ink-500">در حال آماده‌سازی آزمون…</div>;
  }

  const section = exam.sections[step];
  const skill = SKILLS[section.skill];
  const answered = flat.filter((f) => isAnswered(answers[f.q.id])).length;
  const unanswered = flat.length - answered;
  const progress = Math.round((answered / flat.length) * 100);
  const lowTime = timeLeft <= 300;
  const last = exam.sections.length - 1;

  const setAnswer = (id, value) => setAnswers((a) => ({ ...a, [id]: value }));
  const jump = (si, qid) => {
    setStep(si);
    setTimeout(() => document.getElementById(`q-${qid}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
  };

  return (
    <div className="pb-16">
      {/* Sticky exam bar */}
      <div className="sticky top-16 z-30 border-b border-ink-950/5 bg-white/95 backdrop-blur">
        <div className="container-x flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold">{exam.title}</p>
            <p className="text-xs text-ink-500">
              {fa(answered)} از {fa(flat.length)} سؤال پاسخ داده شده
            </p>
          </div>
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-extrabold tabular-nums ${
              lowTime ? 'bg-red-50 text-red-700' : 'bg-brand-50 text-brand-800'
            }`}
            role="timer"
            aria-label="زمان باقی‌مانده"
          >
            <Icon name="clock" className="h-5 w-5" />
            <span dir="ltr">{formatClock(timeLeft)}</span>
          </div>
        </div>
        <div className="h-1 bg-ink-950/5">
          <div className={`h-full transition-all ${type.bar}`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="container-x mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <section className="card p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
              <Icon name={skill.icon} className="h-4 w-4" />
              {skill.fa}
            </span>
            <h2 dir="ltr" className="text-lg font-extrabold">{section.title}</h2>
          </div>

          {section.instructions && (
            <p dir="ltr" className="mt-3 text-left text-sm text-ink-500">{section.instructions}</p>
          )}

          {section.script && (
            <ListeningPlayer
              key={section.id}
              script={section.script}
              plays={plays[section.id] || 0}
              onPlay={() => setPlays((p) => ({ ...p, [section.id]: (p[section.id] || 0) + 1 }))}
            />
          )}

          {section.passage && (
            <div dir="ltr" className="mt-5 max-h-[26rem] overflow-auto whitespace-pre-line rounded-xl bg-paper p-5 text-left leading-8 text-ink-900 ring-1 ring-ink-950/5">
              {section.passage}
            </div>
          )}

          <div className="mt-8 space-y-9">
            {section.questions.map((q) => (
              <Question
                key={q.id}
                n={flat.find((f) => f.q.id === q.id).n}
                q={q}
                value={answers[q.id]}
                onChange={(v) => setAnswer(q.id, v)}
              />
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-ink-950/5 pt-6">
            <button type="button" className="btn-outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
              بخش قبل
            </button>
            {step < last ? (
              <button type="button" className="btn-primary" onClick={() => setStep(step + 1)}>
                بخش بعد
                <Icon name="arrow" className="h-4 w-4" />
              </button>
            ) : (
              <button type="button" className="btn-primary" onClick={() => setConfirmOpen(true)}>
                پایان و ثبت آزمون
              </button>
            )}
          </div>
        </section>

        {/* Question palette */}
        <aside className="space-y-4 lg:sticky lg:top-40 lg:self-start">
          <div className="card p-5">
            <h3 className="font-extrabold">پیمایش سؤال‌ها</h3>
            {exam.sections.map((s, si) => (
              <div key={s.id} className="mt-4">
                <button
                  type="button"
                  onClick={() => setStep(si)}
                  className={`text-xs font-bold ${si === step ? 'text-brand-700' : 'text-ink-500 hover:text-ink-700'}`}
                >
                  {SKILLS[s.skill].fa}
                </button>
                <div className="mt-2 flex flex-wrap gap-2">
                  {flat.filter((f) => f.section.id === s.id).map((f) => (
                    <button
                      key={f.q.id}
                      type="button"
                      onClick={() => jump(si, f.q.id)}
                      aria-label={`سؤال ${f.n}`}
                      className={`grid h-9 w-9 place-items-center rounded-lg text-sm font-bold transition-colors ${
                        isAnswered(answers[f.q.id])
                          ? 'bg-brand-600 text-white'
                          : 'bg-paper text-ink-700 ring-1 ring-ink-300/70 hover:ring-brand-400'
                      }`}
                    >
                      {fa(f.n)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="btn-primary w-full" onClick={() => setConfirmOpen(true)} disabled={submitting}>
            {submitting ? 'در حال ثبت…' : 'پایان و ثبت آزمون'}
          </button>
          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 ring-1 ring-red-100">
              {error}
            </p>
          )}
        </aside>
      </div>

      {/* Confirm dialog */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="card w-full max-w-md p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-sun-100 text-amber-700">
                <Icon name="alert" />
              </span>
              <h3 id="confirm-title" className="text-lg font-extrabold">آزمون را پایان می‌دهید؟</h3>
            </div>
            <p className="mt-4 text-sm leading-7 text-ink-500">
              {unanswered > 0
                ? `${fa(unanswered)} سؤال بدون پاسخ مانده است. پس از ثبت، امکان تغییر پاسخ‌ها وجود ندارد.`
                : 'همهٔ سؤال‌ها پاسخ داده شده‌اند. پس از ثبت، امکان تغییر پاسخ‌ها وجود ندارد.'}
            </p>
            <div className="mt-6 flex gap-3">
              <button type="button" className="btn-primary flex-1" onClick={submit}>ثبت نهایی</button>
              <button type="button" className="btn-outline flex-1" onClick={() => setConfirmOpen(false)}>ادامهٔ آزمون</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
