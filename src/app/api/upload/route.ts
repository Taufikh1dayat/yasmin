import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { getCurrentAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Megabytes

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
]);

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf']);

export async function POST(request: Request) {
  try {
    // 1. Verifikasi sesi admin aktif
    const session = getCurrentAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Sesi Anda telah berakhir atau Anda tidak memiliki akses admin.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah.' }, { status: 400 });
    }

    // 2. Validasi ukuran file
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran file melebihi batas maksimal yang diizinkan (maksimal 5 MB).' },
        { status: 400 }
      );
    }

    // 3. Validasi ekstensi dan MIME type
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext) || !ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Format berkas tidak diizinkan. Hanya mendukung berkas gambar (JPG, PNG, WEBP, GIF) dan dokumen PDF.' },
        { status: 400 }
      );
    }

    // 4. Buat nama file acak yang aman (mencegah path traversal)
    const randomSuffix = crypto.randomUUID().slice(0, 12);
    const safeFilename = `${Date.now()}_${randomSuffix}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    await fs.mkdir(uploadDir, { recursive: true });
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(path.join(uploadDir, safeFilename), buffer);

    return NextResponse.json({ 
      success: true, 
      url: '/uploads/' + safeFilename 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Gagal mengunggah berkas.' }, { status: 500 });
  }
}
