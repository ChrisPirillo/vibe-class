import { NextResponse } from 'next/server';
import { NETLIFY_IDENTITY_COOKIE, verifyNetlifyToken } from '@/lib/netlify-auth';

export async function POST(request: Request) {
  const { token } = (await request.json()) as { token?: string };
  const payload = await verifyNetlifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(NETLIFY_IDENTITY_COOKIE, token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(NETLIFY_IDENTITY_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0)
  });
  return response;
}
