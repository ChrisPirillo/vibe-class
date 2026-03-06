import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPublicRoutes = ['/', '/apps', '/portfolio', '/submit'];
const ADMIN_PATHS = ['/zartan'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isAdminPath = ADMIN_PATHS.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const sessionCookie = request.cookies.get('authjs.session-token')?.value || request.cookies.get('__Secure-authjs.session-token')?.value;

  if (isAdminPath && !sessionCookie) {
    return NextResponse.redirect(new URL('/destro', request.url));
  }

  const isProtectedPublic = protectedPublicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  if (!isProtectedPublic) return NextResponse.next();

  if (sessionCookie) return NextResponse.next();

  const accessCookie = request.cookies.get('vibe_site_access')?.value;
  if (accessCookie === 'granted') {
    return NextResponse.next();
  }

  if (pathname === '/submit') return NextResponse.next();
  return NextResponse.redirect(new URL('/submit', request.url));
}

export const config = {
  matcher: ['/', '/apps/:path*', '/portfolio/:path*', '/submit', '/zartan/:path*']
};
