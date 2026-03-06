import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedPublicRoutes = ['/', '/apps', '/portfolio', '/submit'];
const ADMIN_PATHS = ['/zartan'];

function pathMatches(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const hasAdminSession = Boolean(token);

  if (pathMatches(pathname, ADMIN_PATHS) && !hasAdminSession) {
    return NextResponse.redirect(new URL('/destro', request.url));
  }

  if (!pathMatches(pathname, protectedPublicRoutes)) return NextResponse.next();
  if (hasAdminSession) return NextResponse.next();

  const accessCookie = request.cookies.get('vibe_site_access')?.value;
  if (accessCookie === 'granted') return NextResponse.next();

  if (pathname === '/submit') return NextResponse.next();
  return NextResponse.redirect(new URL('/submit', request.url));
}

export const config = {
  matcher: ['/', '/apps/:path*', '/portfolio/:path*', '/submit', '/zartan/:path*']
};
