import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

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
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Gagal mengambil data berita' }, { status: 500 });
  }
}

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
    const { id, title, category, excerpt, content, author, imageUrl } = body;

    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { error: 'Judul, ringkasan, dan isi berita wajib diisi.' },
        { status: 400 }
      );
    }

    if (id) {
      // Update existing article
      const updated = await prisma.article.update({
        where: { id },
        data: {
          title,
          category: category || 'Warta Advokasi',
          excerpt,
          content,
          author: author || 'Redaksi YASMIN',
          imageUrl: imageUrl || undefined,
        },
      });
      return NextResponse.json({ success: true, article: updated });
    }

    // Create new article
    let baseSlug = slugify(title);
    let finalSlug = baseSlug;
    let counter = 1;
    while (await prisma.article.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = baseSlug + '-' + counter;
      counter++;
    }

    const created = await prisma.article.create({
      data: {
        title,
        slug: finalSlug,
        category: category || 'Warta Advokasi',
        excerpt,
        content,
        author: author || 'Tim Redaksi YASMIN',
        imageUrl: imageUrl || '/images/imigran.jpg',
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, article: created });
  } catch (error) {
    console.error('Error saving article:', error);
    return NextResponse.json({ error: 'Gagal menyimpan berita' }, { status: 500 });
  }
}

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
      return NextResponse.json({ error: 'ID berita diperlukan' }, { status: 400 });
    }

    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Gagal menghapus berita' }, { status: 500 });
  }
}
