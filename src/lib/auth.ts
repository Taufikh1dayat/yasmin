import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'yasmin_admin_session';
const SECRET_KEY = process.env.AUTH_SECRET || 'yasmin_super_secure_secret_key_2026';

// Buat token sesi aman (base64 payload + hmac signature)
export function createSessionToken(user: { id: string; email: string; name: string; role: string }) {
  const payload = JSON.stringify({
    ...user,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 hari
  });
  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

// Verifikasi token sesi
export function verifySessionToken(token: string | undefined | null) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(encodedPayload).digest('base64url');

  if (signature !== expectedSignature) {
    return null; // Signature palsu atau dimanipulasi
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Sesi kadaluarsa
    }
    return payload;
  } catch {
    return null;
  }
}

// Ambil sesi user saat ini dari request cookies (Server Component / API)
export function getCurrentAdminSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export { SESSION_COOKIE_NAME };
