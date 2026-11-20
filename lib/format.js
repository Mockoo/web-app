// Persian-digit formatting helpers (safe for server and client components).

export const fa = (n, options) => Number(n ?? 0).toLocaleString('fa-IR', options);

export const faDate = (iso) =>
  new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });

export const faDateTime = (iso) =>
  new Date(iso).toLocaleString('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

/** 125 -> ۰۲:۰۵ */
export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const two = { minimumIntegerDigits: 2 };
  return `${fa(Math.floor(s / 60), two)}:${fa(s % 60, two)}`;
}

/** 3725 -> "۱ ساعت و ۲ دقیقه" */
export function formatMinutes(totalMinutes) {
  const m = Math.round(totalMinutes);
  if (m < 60) return `${fa(m)} دقیقه`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${fa(h)} ساعت و ${fa(r)} دقیقه` : `${fa(h)} ساعت`;
}

export const formatPrice = (toman) => `${fa(toman)} تومان`;
