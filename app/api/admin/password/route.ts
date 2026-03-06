import { NextResponse } from 'next/server';
import { getSystemSettings, setSitePassword } from '@/lib/queries';
import { getAdminPayloadFromCookies } from '@/lib/netlify-auth';

function randomPassword(length = 16) {
  const alphabet = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*';
  return Array.from({ length })
    .map(() => alphabet[Math.floor(Math.random() * alphabet.length)])
    .join('');
}

async function ensureAdmin() {
  const payload = await getAdminPayloadFromCookies();
  return Boolean(payload);
}

export async function GET() {
  if (!(await ensureAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const settings = await getSystemSettings();
  return NextResponse.json({ sitePassword: settings?.site_password ?? '' });
}

export async function POST(request: Request) {
  if (!(await ensureAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const input = String(formData.get('sitePassword') || '').trim();
  const generate = String(formData.get('generate') || '').trim() === '1';
  const sitePassword = generate ? randomPassword() : input;

  if (!sitePassword) {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 });
  }

  await setSitePassword(sitePassword);
  return NextResponse.redirect(new URL('/zartan', request.url));
}
