import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'yasmin_admin_session';

function getSecretKey(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        '[SECURITY WARNING] Variabel lingkungan AUTH_SECRET belum disetel di mode produksi. Sangat disarankan menambahkan AUTH_SECRET acak yang kuat di file .env server produksi Anda.'
      );
    }
    return 'yasmin_super_secure_secret_key_2026_dev_only';
  }
  return secret;
}

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// Buat token sesi aman (base64 payload + hmac signature)
export function createSessionToken(user: { id: string; email: string; name: string; role: string }) {
  const payload = JSON.stringify({
    ...user,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 hari
  });
  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac('sha256', getSecretKey()).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

// Verifikasi token sesi
export function verifySessionToken(token: string | undefined | null) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', getSecretKey()).update(encodedPayload).digest('base64url');

  if (!safeCompare(signature, expectedSignature)) {
    return null; // Signature palsu atau dimanipulasi (terproteksi dari timing attack)
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

// Validasi bahwa sesi admin berstatus aktif dan memiliki hak akses SUPER_ADMIN
export function requireSuperAdminSession() {
  const session = getCurrentAdminSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return null;
  }
  return session;
}

export { SESSION_COOKIE_NAME };
