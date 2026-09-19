import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getCurrentAdminSession, createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: Ambil info profil admin saat ini
export async function GET() {
  try {
    const session = getCurrentAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Sesi Anda telah berakhir. Silakan login kembali.' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return NextResponse.json({ error: 'Gagal mengambil data profil admin.' }, { status: 500 });
  }
}

// POST: Ganti kata sandi admin
export async function POST(request: Request) {
  try {
    const session = getCurrentAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Sesi Anda telah berakhir. Silakan login kembali.' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword, name } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'Kata sandi saat ini, kata sandi baru, dan konfirmasi kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Kata sandi baru minimal harus terdiri dari 8 karakter.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Konfirmasi kata sandi baru tidak cocok.' },
        { status: 400 }
      );
    }

    // Ambil data user lengkap dari database
    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Akun admin tidak ditemukan atau tidak aktif.' }, { status: 404 });
    }

    // Verifikasi kata sandi saat ini
    const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: 'Kata sandi saat ini yang Anda masukkan salah.' },
        { status: 400 }
      );
    }

    // Hash kata sandi baru
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update data di database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
        ...(name && name.trim() ? { name: name.trim() } : {}),
      },
    });

    // Perbarui token sesi dengan data terbaru
    const token = createSessionToken({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Kata sandi akun admin berhasil diperbarui.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });

    // Set cookie sesi yang diperbarui
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Error changing admin password:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat memperbarui kata sandi.' },
      { status: 500 }
    );
  }
}
