import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface RateLimitRecord {
  attempts: number;
  lockUntil: number;
}

// In-memory rate limiting store (per IP / Email)
const loginAttempts = new Map<string, RateLimitRecord>();

function getClientIdentifier(request: Request, email?: string): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'local';
  return `${ip}_${email ? email.toLowerCase().trim() : 'anon'}`;
}

function checkRateLimit(key: string): { blocked: boolean; retryAfterSeconds: number } {
  const record = loginAttempts.get(key);
  const now = Date.now();

  if (record) {
    if (record.lockUntil > now) {
      return {
        blocked: true,
        retryAfterSeconds: Math.ceil((record.lockUntil - now) / 1000),
      };
    }
    // Jika masa penguncian sudah lewat, reset
    if (record.lockUntil > 0 && record.lockUntil <= now) {
      loginAttempts.delete(key);
    }
  }

  return { blocked: false, retryAfterSeconds: 0 };
}

function recordFailedAttempt(key: string) {
  const now = Date.now();
  const record = loginAttempts.get(key) || { attempts: 0, lockUntil: 0 };
  record.attempts += 1;

  // Jika gagal 5 kali berturut-turut, kunci selama 15 menit (900 detik)
  if (record.attempts >= 5) {
    record.lockUntil = now + 15 * 60 * 1000;
  }

  loginAttempts.set(key, record);
}

function resetAttempts(key: string) {
  loginAttempts.delete(key);
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi.' }, { status: 400 });
    }

    const rateLimitKey = getClientIdentifier(request, email);
    const rateLimit = checkRateLimit(rateLimitKey);

    if (rateLimit.blocked) {
      const minutes = Math.ceil(rateLimit.retryAfterSeconds / 60);
      return NextResponse.json(
        { 
          error: `Terlalu banyak percobaan masuk yang salah. Demi keamanan, akun dibatasi sementara. Silakan coba kembali dalam ${minutes} menit.` 
        }, 
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.isActive) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
    }

    // Login sukses: reset batas percobaan
    resetAttempts(rateLimitKey);

    // Buat token sesi
    const token = createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set HTTP-Only Cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem saat login.' }, { status: 500 });
  }
}
