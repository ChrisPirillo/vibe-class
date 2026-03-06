import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'netlify_identity_token';

function getJwtSecret() {
  const secret = process.env.NETLIFY_IDENTITY_JWT_SECRET || process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function verifyNetlifyToken(token?: string | null) {
  if (!token) return null;
  const secret = getJwtSecret();
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function getAdminPayloadFromCookies() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifyNetlifyToken(token);
}

export const NETLIFY_IDENTITY_COOKIE = COOKIE_NAME;
