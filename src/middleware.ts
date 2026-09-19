import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'yasmin_admin_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lewati pengecekan untuk static assets dan api auth
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // Jika mencoba mengakses halaman login admin tapi sudah memiliki sesi login aktif
  if (pathname === '/admin/login') {
    if (sessionCookie) {
      const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/admin/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  // Jika mencoba mengakses rute admin (/admin/...) tanpa sesi
  if (pathname.startsWith('/admin')) {
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
