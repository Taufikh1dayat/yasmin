import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-4);
}

// GET: Ambil daftar publikasi
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = {};
    if (category && category !== 'Semua') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    const publications = await prisma.publication.findMany({
      where,
      orderBy: { year: 'desc' },
    });

    return NextResponse.json(publications);
  } catch (error) {
    console.error('Error fetching publications:', error);
    return NextResponse.json({ error: 'Gagal mengambil data publikasi' }, { status: 500 });
  }
}

// POST: Tambah publikasi baru
export async function POST(request: Request) {
  try {
    const session = getCurrentAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Sesi Anda telah berakhir atau Anda tidak memiliki akses admin.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      title, 
      category, 
      year, 
      author, 
      description, 
      fileUrl, 
      coverImage 
    } = body;

    if (!title || !category || !year || !description) {
      return NextResponse.json(
        { error: 'Judul, kategori, tahun, dan deskripsi wajib diisi.' },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);

    const newPublication = await prisma.publication.create({
      data: {
        title,
        slug,
        category,
        year: parseInt(year.toString(), 10) || new Date().getFullYear(),
        author: author || 'Tim Riset & Advokasi YASMIN',
        description,
        fileUrl: fileUrl || '/docs/sample-publication.pdf',
        coverImage: coverImage || '/images/pub-cover-default.jpg',
      },
    });

    return NextResponse.json(newPublication, { status: 201 });
  } catch (error) {
    console.error('Error creating publication:', error);
    return NextResponse.json({ error: 'Gagal menyimpan publikasi baru' }, { status: 500 });
  }
}

// PATCH: Perbarui data publikasi
export async function PATCH(request: Request) {
  try {
    const session = getCurrentAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Sesi Anda telah berakhir atau Anda tidak memiliki akses admin.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      id, 
      title, 
      category, 
      year, 
      author, 
      description, 
      fileUrl, 
      coverImage 
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID publikasi wajib disertakan' }, { status: 400 });
    }

    const updated = await prisma.publication.update({
      where: { id },
      data: {
        ...(title ? { title } : {}),
        ...(category ? { category } : {}),
        ...(year ? { year: parseInt(year.toString(), 10) } : {}),
        ...(author ? { author } : {}),
        ...(description ? { description } : {}),
        ...(fileUrl ? { fileUrl } : {}),
        ...(coverImage ? { coverImage } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating publication:', error);
    return NextResponse.json({ error: 'Gagal memperbarui publikasi' }, { status: 500 });
  }
}

// DELETE: Hapus data publikasi
export async function DELETE(request: Request) {
  try {
    const session = getCurrentAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Sesi Anda telah berakhir atau Anda tidak memiliki akses admin.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID publikasi wajib disertakan' }, { status: 400 });
    }

    await prisma.publication.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Publikasi berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting publication:', error);
    return NextResponse.json({ error: 'Gagal menghapus berkas publikasi' }, { status: 500 });
  }
}
