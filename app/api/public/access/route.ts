import { NextResponse } from 'next/server';
import { getSystemSettings } from '@/lib/queries';

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };
  const settings = await getSystemSettings();
  if (!settings) return NextResponse.json({ error: 'System not initialized' }, { status: 500 });

  if (!password || password !== settings.site_password) {
    return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set('vibe_site_access', 'granted', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 90
  });

  return response;
}
