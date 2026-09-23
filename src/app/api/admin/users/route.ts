import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { requireSuperAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: Ambil daftar seluruh pengguna (khusus SUPER_ADMIN)
export async function GET() {
  try {
    const session = requireSuperAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Akses ditolak. Fitur ini hanya dapat diakses oleh Administrator Tertinggi (Super Admin).' },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json({ users, currentUserId: session.id });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: 'Gagal mengambil data daftar pengguna.' }, { status: 500 });
  }
}

// POST: Buat pengguna baru (khusus SUPER_ADMIN)
export async function POST(request: Request) {
  try {
    const session = requireSuperAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Akses ditolak. Fitur ini hanya dapat diakses oleh Administrator Tertinggi (Super Admin).' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nama lengkap, alamat email, dan kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Validasi format email dasar
    if (!normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
      return NextResponse.json({ error: 'Format alamat email tidak valid.' }, { status: 400 });
    }

    // Validasi panjang kata sandi
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Kata sandi minimal harus terdiri dari 8 karakter.' },
        { status: 400 }
      );
    }

    // Periksa apakah email sudah terdaftar
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Alamat email ini sudah terdaftar sebagai pengguna lain.' },
        { status: 400 }
      );
    }

    // Tetapkan peran (hanya SUPER_ADMIN atau LEGAL_STAFF)
    const validRole = role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'LEGAL_STAFF';

    // Hash kata sandi dengan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: validRole,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Pengguna baru "${newUser.name}" berhasil dibuat.`,
      user: newUser,
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem saat membuat pengguna.' }, { status: 500 });
  }
}

// PUT: Perbarui data pengguna / ubah peran / status / reset sandi (khusus SUPER_ADMIN)
export async function PUT(request: Request) {
  try {
    const session = requireSuperAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Akses ditolak. Fitur ini hanya dapat diakses oleh Administrator Tertinggi (Super Admin).' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, name, email, role, isActive, newPassword } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID Pengguna wajib disertakan.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan.' }, { status: 404 });
    }

    // Proteksi: Super Admin tidak boleh menonaktifkan akun sendiri
    if (existingUser.id === session.id && isActive === false) {
      return NextResponse.json(
        { error: 'Anda tidak dapat menonaktifkan akun Anda sendiri.' },
        { status: 400 }
      );
    }

    // Proteksi: Super Admin tidak boleh menurunkan perannya sendiri
    if (existingUser.id === session.id && role && role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Anda tidak dapat menurunkan peran akun Anda sendiri dari Super Admin.' },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (name && name.trim()) {
      updateData.name = name.trim();
    }

    if (email && email.toLowerCase().trim() !== existingUser.email) {
      const normalizedEmail = email.toLowerCase().trim();
      const emailTaken = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (emailTaken && emailTaken.id !== existingUser.id) {
        return NextResponse.json(
          { error: 'Alamat email ini sudah digunakan oleh pengguna lain.' },
          { status: 400 }
        );
      }
      updateData.email = normalizedEmail;
    }

    if (role && (role === 'SUPER_ADMIN' || role === 'LEGAL_STAFF')) {
      updateData.role = role;
    }

    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }

    // Reset password jika diisi
    if (newPassword && newPassword.trim()) {
      if (newPassword.trim().length < 8) {
        return NextResponse.json(
          { error: 'Kata sandi baru minimal harus terdiri dari 8 karakter.' },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(newPassword.trim(), 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Data pengguna "${updatedUser.name}" berhasil diperbarui.`,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating admin user:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem saat memperbarui data pengguna.' }, { status: 500 });
  }
}

// DELETE: Hapus pengguna (khusus SUPER_ADMIN)
export async function DELETE(request: Request) {
  try {
    const session = requireSuperAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Akses ditolak. Fitur ini hanya dapat diakses oleh Administrator Tertinggi (Super Admin).' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID Pengguna wajib disertakan.' }, { status: 400 });
    }

    // Proteksi: Tidak boleh menghapus akun sendiri
    if (id === session.id) {
      return NextResponse.json(
        { error: 'Anda tidak dapat menghapus akun Anda sendiri demi keamanan sistem.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan.' }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Akun pengguna "${existingUser.name}" (${existingUser.email}) berhasil dihapus dari sistem.`,
    });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem saat menghapus pengguna.' }, { status: 500 });
  }
}
