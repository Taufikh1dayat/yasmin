import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdminSession } from '@/lib/auth';
import { getClientIp, checkRateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

// Generate random ticket code dengan entropi tinggi (6 karakter acak = 32^6 = 1+ miliar kombinasi)
function generateTicketCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let random = '';
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `YSM-2026-${random}`;
}

export async function POST(request: Request) {
  try {
    // 1. Proteksi Ukuran Payload (Tolak payload > 1 MB sebelum parsing untuk mencegah Memory Exhaustion)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 1024 * 1024) {
      return NextResponse.json(
        { error: 'Ukuran data pengaduan terlalu besar (maksimal 1 MB).' },
        { status: 413 }
      );
    }

    // 2. Rate Limiting IP: Maksimal 5 laporan per 10 menit per IP untuk mencegah DDoS spam DB
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`complaint_submit_${clientIp}`, 5, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: `Terlalu banyak laporan pengaduan yang dikirim. Demi stabilitas sistem, silakan coba kembali dalam ${Math.ceil(rateLimit.resetInSeconds / 60)} menit.` 
        },
        { status: 429 }
      );
    }

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
      website_hp, // Honeypot field (tersembunyi dari user asli, hanya diisi bot)
    } = body;

    // 3. Honeypot Anti-Bot: Jika bot mengisi field tersembunyi, gagalkan diam-diam tanpa membebani database
    if (website_hp) {
      return NextResponse.json({
        success: true,
        ticketCode: 'YSM-2026-OK',
      });
    }

    if (!contact || !category || !chronology) {
      return NextResponse.json(
        { error: 'Kontak, kategori masalah, dan kronologi wajib diisi.' },
        { status: 400 }
      );
    }

    if (
      contact.length > 50 || 
      (complainantName && complainantName.length > 150) || 
      chronology.length > 10000 ||
      (email && email.length > 150) ||
      (workerLocation && workerLocation.length > 150)
    ) {
      return NextResponse.json(
        { error: 'Ukuran input teks melebihi batas wajar.' },
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
      const clientIp = getClientIp(request);
      // Rate limiting: Maksimal 20 kali cek tiket per menit per IP
      const rateLimit = checkRateLimit(`ticket_lookup_${clientIp}`, 20, 60 * 1000);
      if (!rateLimit.allowed) {
        return NextResponse.json(
          { error: 'Terlalu banyak permintaan pengecekan tiket. Silakan coba kembali dalam 1 menit.' },
          { status: 429 }
        );
      }

      const cleanTicket = ticket.trim().toUpperCase();
      // Validasi format tiket sebelum query DB untuk mencegah DoS query invalid
      if (!/^[A-Z0-9-]{4,30}$/.test(cleanTicket)) {
        return NextResponse.json(
          { error: 'Format kode tiket tidak valid. Mohon periksa kembali kode tiket Anda.' },
          { status: 400 }
        );
      }

      const complaint = await prisma.complaint.findUnique({
        where: { ticketCode: cleanTicket },
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

    // Jika tanpa parameter ticket, kembalikan seluruh daftar khusus untuk Admin Manajemen Kasus
    const session = getCurrentAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Sesi Anda telah berakhir atau Anda tidak memiliki akses ke data internal.' },
        { status: 401 }
      );
    }

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
    const session = getCurrentAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Sesi Anda telah berakhir atau Anda tidak memiliki akses admin.' },
        { status: 401 }
      );
    }

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
