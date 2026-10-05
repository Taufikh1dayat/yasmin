import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const DEFAULT_SITE_SETTINGS = {
  hotline: '0811-9876-5431',
  whatsapp: '6281198765431',
  email: 'studi.migran@gmail.com',
  instagram: 'https://www.instagram.com/studi.migran?stkn=bTJhamFpZ2t0dWNu',
  facebook: 'https://www.facebook.com/share/14zwVKwALbg/',
};

// GET: Ambil pengaturan kontak & sosmed untuk publik
export async function GET() {
  try {
    const settings = await prisma.siteSetting.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      return NextResponse.json(DEFAULT_SITE_SETTINGS);
    }

    return NextResponse.json({
      hotline: settings.hotline || DEFAULT_SITE_SETTINGS.hotline,
      whatsapp: settings.whatsapp || DEFAULT_SITE_SETTINGS.whatsapp,
      email: settings.email || DEFAULT_SITE_SETTINGS.email,
      instagram: settings.instagram || DEFAULT_SITE_SETTINGS.instagram,
      facebook: settings.facebook || DEFAULT_SITE_SETTINGS.facebook,
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    // Kembalikan default jika database sedang kendala sesaat
    return NextResponse.json(DEFAULT_SITE_SETTINGS);
  }
}

// PUT: Perbarui pengaturan kontak & sosmed (khusus Admin)
export async function PUT(request: Request) {
  try {
    const session = getCurrentAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Sesi Anda telah berakhir atau Anda tidak memiliki akses admin.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { hotline, whatsapp, email, instagram, facebook } = body;

    // Bersihkan dan format nomor WhatsApp
    const cleanHotline = (hotline || DEFAULT_SITE_SETTINGS.hotline).trim();
    let cleanWhatsapp = (whatsapp || DEFAULT_SITE_SETTINGS.whatsapp).trim().replace(/[^0-9]/g, '');
    if (cleanWhatsapp.startsWith('0')) {
      cleanWhatsapp = '62' + cleanWhatsapp.substring(1);
    }

    if (
      cleanHotline.length > 50 ||
      cleanWhatsapp.length > 30 ||
      (email && email.length > 150) ||
      (instagram && instagram.length > 300) ||
      (facebook && facebook.length > 300)
    ) {
      return NextResponse.json(
        { error: 'Ukuran teks input melebihi batas yang diizinkan.' },
        { status: 400 }
      );
    }

    const updated = await prisma.siteSetting.upsert({
      where: { id: 'default' },
      update: {
        hotline: cleanHotline,
        whatsapp: cleanWhatsapp,
        email: (email || DEFAULT_SITE_SETTINGS.email).trim(),
        instagram: (instagram || DEFAULT_SITE_SETTINGS.instagram).trim(),
        facebook: (facebook || DEFAULT_SITE_SETTINGS.facebook).trim(),
      },
      create: {
        id: 'default',
        hotline: cleanHotline,
        whatsapp: cleanWhatsapp,
        email: (email || DEFAULT_SITE_SETTINGS.email).trim(),
        instagram: (instagram || DEFAULT_SITE_SETTINGS.instagram).trim(),
        facebook: (facebook || DEFAULT_SITE_SETTINGS.facebook).trim(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Pengaturan kontak dan hotline berhasil diperbarui.',
      settings: updated,
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat menyimpan pengaturan.' },
      { status: 500 }
    );
  }
}
