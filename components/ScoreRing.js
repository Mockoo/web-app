// Circular progress ring (pure SVG, server-component friendly).
export default function ScoreRing({ percent, size = 168, tone = 'stroke-brand-500', children }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="-rotate-90" role="img" aria-label={`${percent} درصد`}>
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="10" className="stroke-ink-950/10" />
        <circle
          cx="60" cy="60" r={r} fill="none" strokeWidth="10" strokeLinecap="round"
          className={tone}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(100, Math.max(0, percent)) / 100)}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}
