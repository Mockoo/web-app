// Minimal in-memory limiter (per server instance). Use Redis/Upstash in production.
const hits = new Map();

export function rateLimit(key, limit = 8, windowMs = 60_000) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length <= limit;
}

export function clientIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
}
