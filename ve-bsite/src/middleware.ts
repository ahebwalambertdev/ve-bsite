import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminSession } from '@/lib/admin/auth';

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow unauthenticated access to the login page and login API
  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  // 2. Extract and verify session token
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || 've-kampala-admin-secret-session-salt-2026';
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;

  const isAuthenticated = await verifyAdminSession(token, sessionSecret);

  // 3. Handle unauthorized requests
  if (!isAuthenticated) {
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }

    // Redirect browser requests to the admin login portal
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Authenticated: Proceed with strict security headers
  const response = NextResponse.next();
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');

  return response;
}
