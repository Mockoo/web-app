import { fa } from '@/lib/format';

/**
 * Line chart of percent-correct over time. Pure SVG, no dependencies.
 * points: [{ label: string, value: 0-100, title?: string }]  (oldest -> newest)
 */
export default function ScoreChart({ points }) {
  const W = 680, H = 250;
  const pad = { t: 18, r: 18, b: 34, l: 44 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const x = (i) => pad.l + (points.length === 1 ? iw / 2 : (i * iw) / (points.length - 1));
  const y = (v) => pad.t + (1 - v / 100) * ih;

  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.value)}`).join(' ');
  const area = `${line} L${x(points.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
  const step = Math.max(1, Math.ceil(points.length / 7)); // avoid crowded x labels

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ direction: 'ltr' }}
      role="img"
      aria-label="نمودار روند درصد پاسخ‌های درست در آزمون‌ها"
    >
      <defs>
        <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6B5CF6" stopOpacity="0.28" />
          <stop offset="1" stopColor="#6B5CF6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 25, 50, 75, 100].map((g) => (
        <g key={g}>
          <line x1={pad.l} x2={W - pad.r} y1={y(g)} y2={y(g)} stroke="#17124A" strokeOpacity="0.08" />
          <text x={pad.l - 10} y={y(g) + 4} textAnchor="end" fontSize="11" fill="#6C6990">
            {fa(g)}٪
          </text>
        </g>
      ))}

      {points.length > 1 && <path d={area} fill="url(#chart-fill)" />}
      {points.length > 1 && (
        <path d={line} fill="none" stroke="#5642E8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      )}

      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.value)} r="5.5" fill="#fff" stroke="#5642E8" strokeWidth="3">
            <title>{p.title || `${p.label}: ${fa(p.value)}٪`}</title>
          </circle>
          {i % step === 0 && (
            <text x={x(i)} y={H - 10} textAnchor="middle" fontSize="11" fill="#6C6990">
              {p.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
