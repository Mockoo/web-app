# AGENT.md — آزمون‌یار (Azmoonyar)

Guide for AI coding agents and new contributors. Read this before changing anything.

## 1. What this project is

A Persian (Farsi, RTL) website where people register, take **mock exams** (IELTS, PTE, TOEFL),
get instant scoring, and track progress over time on a dashboard.

- **Audience:** Persian-speaking exam candidates. UI copy is Persian; exam *content* is English (LTR).
- **Stack:** Next.js 14 (App Router) · React 18 · Tailwind CSS 3.4 · plain JavaScript (no TypeScript).
- **Auth:** email + password, bcrypt hashes, JWT in an httpOnly cookie (`jose`).
- **Storage:** a JSON file (`.data/db.json`) behind a tiny `db` object — zero setup, **dev/demo only**.

## 2. Commands

```bash
npm install
cp .env.example .env.local     # then set AUTH_SECRET (openssl rand -base64 32)
npm run dev                    # http://localhost:3000
npm run build && npm start     # production
```

Requires Node ≥ 18.17. `next/font/google` downloads Vazirmatn at build/dev time, so the first
run needs internet access.

If you run `next start` over plain http (LAN, no TLS), set `COOKIE_SECURE=false` or the
browser will drop the session cookie in production mode.

## 3. Project map

```
app/
  layout.js            <html lang="fa" dir="rtl">, Vazirmatn font, Navbar + Footer, site metadata
  globals.css          Tailwind layers + design-system classes (.btn-*, .card, .input, .container-x …)
  page.js              Home
  about/ courses/ contact/        Static-ish marketing pages
  login/ register/                Auth pages (redirect to /dashboard if already signed in)
  exams/page.js                   Exam list, filter via ?type=IELTS|PTE|TOEFL
  exams/[id]/page.js              Exam intro (rules, sections, previous attempts)
  exams/[id]/take/page.js         Runs <ExamRunner/> (protected)
  results/[id]/page.js            Score summary + answer review (protected, owner only)
  dashboard/page.js               Stats, trend chart, per-skill accuracy, history (protected)
  api/auth/{register,login,logout}/route.js
  api/attempts/route.js           Submit an exam → graded on the server
  api/contact/route.js            Contact form → stored in db.messages
components/
  ExamRunner.js        Client: timer, answers, listening player, palette, submit  ← most complex
  NavbarClient.js · Navbar.js    Navbar.js (server) reads session; NavbarClient (client) renders it
  AuthForm.js · AuthShell.js · ContactForm.js · CourseGrid.js
  ExamCard.js · ScoreChart.js (SVG line chart) · ScoreRing.js (SVG ring) · Icon.js · Logo.js · Footer.js
content/
  exams.js             THE EXAM BANK — contains correct answers (server only)
  courses.js           Course catalogue (placeholder data)
lib/
  db.js                JSON-file database  ← replace for production
  auth.js              createSession / getCurrentUser / requireUser (server only)
  token.js             JWT sign/verify — edge-safe, used by middleware.js
  exams.js             listExams / getExam / getPublicExam / gradeExam / sanitizeAnswers (server only)
  exam-meta.js         EXAM_TYPES, SKILLS, helpers — pure constants, safe for client components
  format.js            Persian digits, Jalali dates, clock/duration/price formatting
  rate-limit.js        In-memory limiter
middleware.js          Redirects anonymous users from /dashboard, /results/*, /exams/:id/take to /login
```

## 4. Architecture rules (do not break these)

1. **Answers never reach the browser.**
   - `content/exams.js` and `lib/exams.js` are server-only (`import 'server-only'` in the latter).
   - Pages that feed client components must use `getPublicExam()`, which strips `answer` and `explanation`.
   - **Never import `content/exams.js` or `lib/exams.js` from a `'use client'` file.** Put shared,
     answer-free helpers in `lib/exam-meta.js` instead.
2. **Grading happens only in `POST /api/attempts`.** The client sends `{examId, answers, durationSec}`;
   the server runs `sanitizeAnswers()` → `gradeExam()` and ignores any score/userId in the body.
3. **Two-layer auth.** `middleware.js` only checks that the JWT is valid (fast, edge-safe).
   Pages and routes still call `requireUser()` / `getCurrentUser()` which look the user up in the db.
   Result pages additionally check `attempt.userId === user.id`.
4. **`lib/token.js` must stay edge-safe** (only `jose`; no `fs`, no `lib/db`) because middleware imports it.
5. **All data access goes through the `db` object** in `lib/db.js`. Don't read/write `.data/db.json` elsewhere.

## 5. Data model (`.data/db.json`)

```
users:    { id, name, email (lowercase), passwordHash, targetExam, createdAt }
attempts: { id, userId, examId, examType, examTitle, createdAt, durationSec,
            answers, correct, total, percent, score, bySkill, detail, scaleLabel }
messages: { id, name, email, message, createdAt }
```

- `bySkill`: `{ listening: {correct,total}, … }` — writing is excluded (not auto-scored).
- `detail`: per-question `{ given, graded, isCorrect | words }`.
- `percent` (0–100) drives charts and averages; `score` is the converted exam score.

## 6. Exams and scoring

Exam shape (see header comment of `content/exams.js`):

```js
{ id, type: 'IELTS'|'PTE'|'TOEFL', level, title, description, durationMin,
  sections: [{ id, skill: 'listening'|'reading'|'grammar'|'writing', title, instructions,
               passage?, script?, questions: [...] }] }
```

Question types: `mcq` (`options`, `answer` = index) · `text` (`answer` string or array, case-insensitive) ·
`writing` (`minWords`; stored, **not scored**). Question ids must be unique within an exam.

- **Listening** uses the browser's `speechSynthesis` to read `section.script` aloud (max 2 plays,
  tracked in `ExamRunner`). If unsupported, the script text is shown instead.
- **Score conversion** (`percentToScore` in `lib/exams.js`) is a *linear approximation*, not an official
  band table: IELTS `round(p×9×2)/2`, PTE `10 + p×80`, TOEFL `p×120`. The UI says scores are estimates;
  keep that wording.
- **Progress safety:** `ExamRunner` saves `{endAt, answers, plays}` in `localStorage`
  (`azmoonyar:exam:<id>`) so refresh/close doesn't reset the clock. It auto-submits at 00:00.

### Add an exam
Append an object to `EXAMS` in `content/exams.js`. Nothing else is required — lists, intro page,
runner, grading, dashboard and results all derive from it. Run through the checklist in §9.

### Add a new exam *type* (e.g. Duolingo)
1. Add an entry to `EXAM_TYPES` in `lib/exam-meta.js` (use a Persian-only `scale` string, see §7).
2. Add its conversion branch to `percentToScore()` in `lib/exams.js`.
3. Add it to the allowed list used by the register form (it iterates `EXAM_TYPES`, so this is automatic).
4. Use full Tailwind class strings in the `badge/bar/panel` fields (they are scanned from `lib/`).

### Add a course
Append to `COURSES` in `content/courses.js` (and a filter to `COURSE_FILTERS` if it's a new category).

## 7. UI conventions

- **RTL by default** (`dir="rtl"` on `<html>`). Use **logical** Tailwind utilities:
  `ms-/me-/ps-/pe-/start-/end-/text-start/text-end/border-s-`. Avoid `ml-/mr-/left-/right-`
  unless something is intentionally physical (SVG charts set `direction: ltr`).
- **English content is LTR:** wrap exam text in an element with `dir="ltr"` and `text-left`.
- **Persian digits:** format every user-visible number with `fa()` / helpers in `lib/format.js`.
  Dates use `faDate()` (Jalali via `fa-IR`).
- **Bidi pitfalls:** don't mix Latin and Persian words in one short label, and don't render signed
  numbers like `+۱۰٪` inline — the sign lands on the wrong side. Use words (“۱۰٪ بهتر”) instead.
- **Design tokens** live in `tailwind.config.js`: `ink` (deep indigo text/dark surfaces), `brand` (violet,
  primary), `accent` (mint, success), `sun` (amber, scores/highlights), `paper` (page background).
  Reuse the component classes in `globals.css` (`btn-primary`, `btn-outline`, `card`, `input`, `label`,
  `container-x`, `section-title`) rather than inventing new button/card styles.
- **Typography:** one family, Vazirmatn (variable font, `--font-vazir`). Body `line-height` is generous
  (1.85) because Persian script needs it. Headings use `text-balance`.
- **Layout:** the sticky navbar is `h-16`; the exam bar uses `sticky top-16` to sit beneath it.
- Keep motion minimal; `prefers-reduced-motion` is respected globally.
- Don't use `localStorage` for anything but the exam-progress snapshot.

## 8. Security notes

- Passwords: bcryptjs (cost 10), min 8 chars. Login errors are identical for unknown email / wrong
  password. Login/register/contact have a simple in-memory rate limit (per IP, per server instance).
- Session cookie: `httpOnly`, `sameSite=lax`, `secure` in production, 7-day JWT (HS256).
- **Set `AUTH_SECRET` in production.** Without it the code falls back to a hard-coded dev secret.
- Redirect targets after login (`?next=`) are restricted to same-site relative paths (`AuthForm.safeNext`).
- All API inputs are length-capped and validated; unknown answer ids / out-of-range options are dropped.

## 9. Testing checklist (no test framework is installed yet)

After changes, verify manually or add tests (Vitest/Playwright are good fits):

- [ ] Register → lands on `/dashboard`; duplicate email shows an error.
- [ ] Anonymous visit to `/dashboard`, `/results/x`, `/exams/<id>/take` redirects to `/login?next=…`.
- [ ] Take an exam: answer, switch sections, reload (answers + timer survive), submit → result page.
- [ ] Let the timer reach 00:00 → auto-submit happens exactly once.
- [ ] Result page of another user's attempt returns 404.
- [ ] Network tab on the take page: the exam payload contains **no** `answer` / `explanation` keys.
- [ ] Dashboard chart/averages update after a new attempt.
- [ ] Layout at 360px width: no horizontal scroll.

## 10. Known limitations / TODO

- **Database:** the JSON file doesn't work on read-only/serverless hosts (e.g. Vercel) and isn't safe for
  concurrent multi-process writes. Replace `lib/db.js` with Postgres/SQLite via Prisma or Drizzle;
  keep the same method names so no other file changes. Move the rate limiter to Redis at the same time.
- **Writing and Speaking are not auto-scored.** Writing is stored and shown back; there is no Speaking
  section. Ideas: teacher review queue, rubric self-assessment, AI feedback.
- **Listening audio** is synthetic browser TTS; replace with real audio files (`section.audio` URL +
  `<audio>`) for authentic accents and a server-enforced play limit.
- **Placeholder content:** course prices, contact details (`support@azmoonyar.example`, phone, address),
  and the sample score card on the home page are illustrative. The home-page stats are computed from the
  real exam bank. There are intentionally no testimonials — add real ones only.
- The exam bank is small (4 short mock exams) — grow it before launch.
- Missing features worth adding: email verification, password reset, profile page, dark mode,
  admin panel for exams/messages, per-question timing, flag-for-review, accessibility audit with a screen reader.
- No ESLint/Prettier/TypeScript config yet. If adding TypeScript, `lib/exam-meta.js` is the natural place
  to start defining the `Exam`, `Section`, `Question` and `Attempt` types.

## 11. Working agreements for agents

- Keep UI text in Persian and consistent in tone (informal “تو” in marketing/dashboard copy, as used now).
- Prefer small, focused changes; don't reformat unrelated files.
- Don't add dependencies without a clear need — the current set is intentionally tiny
  (`next`, `react`, `react-dom`, `jose`, `bcryptjs`, `server-only`, Tailwind toolchain).
- Never commit `.env*` files or `.data/`.
- When you change exam content or scoring, update §6 here as well.
