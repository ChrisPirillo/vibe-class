import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyNetlifyToken, NETLIFY_IDENTITY_COOKIE } from '@/lib/netlify-auth';

const protectedPublicRoutes = ['/', '/apps', '/portfolio', '/submit'];
const ADMIN_PATHS = ['/zartan'];

function pathMatches(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const identityCookie = request.cookies.get(NETLIFY_IDENTITY_COOKIE)?.value;
  const adminPayload = await verifyNetlifyToken(identityCookie);
  const hasAdminSession = Boolean(adminPayload);

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
