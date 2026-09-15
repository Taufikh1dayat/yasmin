import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'yasmin_admin_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lewati pengecekan untuk halaman login dan static assets
  if (pathname === '/admin/login' || pathname.startsWith('/_next') || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Jika mencoba mengakses rute admin (/admin/...)
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      // Belum login, alihkan ke halaman login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
