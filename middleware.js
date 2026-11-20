import { NextResponse } from 'next/server';
import { COOKIE_NAME, verifyToken } from '@/lib/token';

// Redirects anonymous visitors to /login for protected areas.
// (Pages re-check the user against the database with requireUser().)
export async function middleware(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session) {
    const { pathname, search } = request.nextUrl;
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/results/:path*', '/exams/:id/take'],
};
