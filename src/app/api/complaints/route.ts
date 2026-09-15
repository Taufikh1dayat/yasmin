import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Generate random ticket code, e.g. YSM-2026-X8B9
function generateTicketCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `YSM-2026-${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      complainantName,
      isAnonymous,
      contact,
      email,
      workerLocation,
      category,
      chronology,
      branchId,
    } = body;

    if (!contact || !category || !chronology) {
      return NextResponse.json(
        { error: 'Kontak, kategori masalah, dan kronologi wajib diisi.' },
        { status: 400 }
      );
    }

    let ticketCode = generateTicketCode();
    // Pastikan kode tiket unik
    let existing = await prisma.complaint.findUnique({ where: { ticketCode } });
    while (existing) {
      ticketCode = generateTicketCode();
      existing = await prisma.complaint.findUnique({ where: { ticketCode } });
    }

    const complaint = await prisma.complaint.create({
      data: {
        ticketCode,
        complainantName: isAnonymous ? 'Anonim / Terlindungi' : (complainantName || 'Anonim'),
        isAnonymous: Boolean(isAnonymous),
        contact,
        email: email || null,
        workerLocation: workerLocation || 'Tidak disebutkan',
        category,
        chronology,
        branchId: branchId || null,
        status: 'MENUNGGU_VERIFIKASI',
        adminNotes: 'Laporan Anda telah berhasil diterima di sistem pengaduan YASMIN. Tim advokasi kami akan segera menelaah berkas dalam 1x24 jam kerja.',
      },
    });

    return NextResponse.json({
      success: true,
      ticketCode: complaint.ticketCode,
      complaint,
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    return NextResponse.json({ error: 'Gagal memproses pengaduan' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticket = searchParams.get('ticket');

    if (!ticket) {
      return NextResponse.json({ error: 'Kode tiket harus disertakan' }, { status: 400 });
    }

    const complaint = await prisma.complaint.findUnique({
      where: { ticketCode: ticket.trim().toUpperCase() },
      include: {
        branch: {
          select: {
            name: true,
            city: true,
            hotline: true,
            email: true,
          },
        },
      },
    });

    if (!complaint) {
      return NextResponse.json({ error: 'Tiket pengaduan tidak ditemukan. Mohon periksa kembali kode tiket Anda.' }, { status: 404 });
    }

    // Mask nomor kontak demi privasi pelapor
    const maskedContact = complaint.contact.length > 5 
      ? complaint.contact.substring(0, 4) + '****' + complaint.contact.substring(complaint.contact.length - 2)
      : '****';

    return NextResponse.json({
      ...complaint,
      contact: maskedContact,
    });
  } catch (error) {
    console.error('Error fetching complaint ticket:', error);
    return NextResponse.json({ error: 'Gagal melacak tiket' }, { status: 500 });
  }
}
