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

    // Jika parameter ticket diberikan, cari spesifik (untuk fitur lacak publik)
    if (ticket) {
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

      // Mask nomor kontak demi privasi pelapor publik
      const maskedContact = complaint.contact.length > 5 
        ? complaint.contact.substring(0, 4) + '****' + complaint.contact.substring(complaint.contact.length - 2)
        : '****';

      return NextResponse.json({
        ...complaint,
        contact: maskedContact,
      });
    }

    // Jika tanpa parameter ticket, kembalikan seluruh daftar untuk Admin Manajemen Kasus
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};
    if (status && status !== 'Semua') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { ticketCode: { contains: search, mode: 'insensitive' } },
        { complainantName: { contains: search, mode: 'insensitive' } },
        { workerLocation: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const complaints = await prisma.complaint.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            city: true,
            province: true,
          },
        },
      },
    });

    return NextResponse.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json({ error: 'Gagal memuat data pengaduan' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, adminNotes, branchId } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID pengaduan diperlukan' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (branchId !== undefined) updateData.branchId = branchId || null;

    const updated = await prisma.complaint.update({
      where: { id },
      data: updateData,
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, complaint: updated });
  } catch (error) {
    console.error('Error updating complaint:', error);
    return NextResponse.json({ error: 'Gagal memperbarui status pengaduan' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID pengaduan diperlukan' }, { status: 400 });
    }

    await prisma.complaint.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    return NextResponse.json({ error: 'Gagal menghapus pengaduan' }, { status: 500 });
  }
}
