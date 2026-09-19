import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET: Ambil daftar kantor posko helpdesk
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get('all') === 'true';

    const branches = await prisma.branch.findMany({
      where: includeAll ? {} : { isActive: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json({ error: 'Gagal memuat posko helpdesk' }, { status: 500 });
  }
}

// POST: Tambah posko cabang baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      region, 
      province, 
      city, 
      address, 
      phone, 
      hotline, 
      email, 
      lat, 
      lng, 
      isActive = true 
    } = body;

    if (!name || !region || !city || !address || !hotline || !email) {
      return NextResponse.json(
        { error: 'Nama posko, wilayah, kota, alamat, nomor WhatsApp hotline, dan email wajib diisi.' },
        { status: 400 }
      );
    }

    const branch = await prisma.branch.create({
      data: {
        name,
        region,
        province: province || region,
        city,
        address,
        phone: phone || null,
        hotline,
        email,
        lat: parseFloat(lat?.toString() || '-6.200000'),
        lng: parseFloat(lng?.toString() || '106.816666'),
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    console.error('Error creating branch:', error);
    return NextResponse.json({ error: 'Gagal membuat posko helpdesk baru' }, { status: 500 });
  }
}

// PATCH: Perbarui data posko cabang
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { 
      id, 
      name, 
      region, 
      province, 
      city, 
      address, 
      phone, 
      hotline, 
      email, 
      lat, 
      lng, 
      isActive 
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID posko helpdesk wajib disertakan' }, { status: 400 });
    }

    const updated = await prisma.branch.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(region !== undefined ? { region } : {}),
        ...(province !== undefined ? { province } : {}),
        ...(city !== undefined ? { city } : {}),
        ...(address !== undefined ? { address } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(hotline !== undefined ? { hotline } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(lat !== undefined ? { lat: parseFloat(lat.toString()) } : {}),
        ...(lng !== undefined ? { lng: parseFloat(lng.toString()) } : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating branch:', error);
    return NextResponse.json({ error: 'Gagal memperbarui posko helpdesk' }, { status: 500 });
  }
}

// DELETE: Hapus posko cabang
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID posko helpdesk wajib disertakan' }, { status: 400 });
    }

    // Cek apakah ada pengaduan yang terhubung
    const complaintCount = await prisma.complaint.count({
      where: { branchId: id },
    });

    if (complaintCount > 0) {
      // Lepas relasi pengaduan ke null terlebih dahulu agar tidak constraint error
      await prisma.complaint.updateMany({
        where: { branchId: id },
        data: { branchId: null },
      });
    }

    await prisma.branch.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Posko helpdesk berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting branch:', error);
    return NextResponse.json({ error: 'Gagal menghapus posko helpdesk' }, { status: 500 });
  }
}
