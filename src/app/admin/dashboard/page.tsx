import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { 
  Inbox, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Scale, 
  Users, 
  Building2, 
  FileText, 
  ArrowUpRight,
  ChevronRight,
  Activity
} from 'lucide-react';

export const revalidate = 0; // Dynamic realtime data

export default async function AdminDashboardPage() {
  let totalComplaints = 0;
  let pendingCount = 0;
  let inProgressCount = 0;
  let mediationCount = 0;
  let completedCount = 0;
  let recentComplaints: any[] = [];
  let totalPublications = 0;
  let totalBranches = 0;

  try {
    totalComplaints = await prisma.complaint.count();
    pendingCount = await prisma.complaint.count({ where: { status: 'MENUNGGU_VERIFIKASI' } });
    inProgressCount = await prisma.complaint.count({ where: { status: 'SEDANG_DITANGANI' } });
    mediationCount = await prisma.complaint.count({ where: { status: 'MEDIASI_HUKUM' } });
    completedCount = await prisma.complaint.count({ where: { status: 'SELESAI' } });

    recentComplaints = await prisma.complaint.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        branch: { select: { name: true, city: true } }
      }
    });

    totalPublications = await prisma.publication.count();
    totalBranches = await prisma.branch.count();
  } catch (error) {
    console.error('Error fetching dashboard stats from PostgreSQL:', error);
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-blue-950 via-brand-blue-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Sistem Pemantauan Kasus Terintegrasi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Selamat Datang di Portal Admin YASMIN
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Pantau dan kelola seluruh berkas aduan perlindungan buruh migran, koordinasikan dengan kantor helpdesk wilayah, dan perbarui riset kebijakan dalam satu panel kendali.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12 pointer-events-none">
          <Scale className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* KPI Statistic Cards (Status Kasus Aduan) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Status Kasus Pengaduan (Real-Time PostgreSQL)
          </h2>
          <span className="text-xs text-slate-400">Total {totalComplaints} Kasus Terdaftar</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 block">Total Seluruh Aduan</span>
            <div className="text-3xl font-black text-slate-900">{totalComplaints}</div>
            <span className="text-[11px] text-slate-400 block">Tercatat di sistem</span>
          </div>

          {/* Card 2: Menunggu Verifikasi */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2 border-l-4 border-l-amber-500">
            <span className="text-xs font-bold text-amber-700 block">Menunggu Verifikasi</span>
            <div className="text-3xl font-black text-amber-600">{pendingCount}</div>
            <span className="text-[11px] text-amber-700 font-semibold block">Perlu telaah awal</span>
          </div>

          {/* Card 3: Sedang Ditangani */}
          <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-2 border-l-4 border-l-blue-600">
            <span className="text-xs font-bold text-brand-blue-800 block">Sedang Ditangani</span>
            <div className="text-3xl font-black text-brand-blue-700">{inProgressCount}</div>
            <span className="text-[11px] text-blue-600 block">Pendampingan aktif</span>
          </div>

          {/* Card 4: Mediasi Hukum */}
          <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-sm space-y-2 border-l-4 border-l-purple-600">
            <span className="text-xs font-bold text-purple-800 block">Mediasi & Somasi</span>
            <div className="text-3xl font-black text-purple-700">{mediationCount}</div>
            <span className="text-[11px] text-purple-600 block">Negosiasi hak PMI</span>
          </div>

          {/* Card 5: Selesai */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2 border-l-4 border-l-emerald-500">
            <span className="text-xs font-bold text-emerald-800 block">Kasus Selesai</span>
            <div className="text-3xl font-black text-emerald-600">{completedCount}</div>
            <span className="text-[11px] text-emerald-700 font-semibold block">Restitusi terpenuhi</span>
          </div>
        </div>
      </div>

      {/* Tabel Antrean Aduan Kasus Terbaru */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Antrean Pengaduan Kasus Terbaru
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Laporan aduan masyarakat yang baru masuk dan menunggu tindakan tim advokasi.
            </p>
          </div>
          <Link
            href="/admin/pengaduan"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors"
          >
            <span>Buka Semua Kasus</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-100 uppercase tracking-wider font-bold text-[10px]">
                <th className="py-3 px-6">Kode Tiket</th>
                <th className="py-3 px-6">Nama Pelapor</th>
                <th className="py-3 px-6">Lokasi Penempatan</th>
                <th className="py-3 px-6">Kategori Kasus</th>
                <th className="py-3 px-6">Status Penanganan</th>
                <th className="py-3 px-6">Tanggal Masuk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentComplaints.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Belum ada data aduan terdaftar.
                  </td>
                </tr>
              ) : (
                recentComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-brand-blue-900">
                      {c.ticketCode}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      {c.complainantName}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {c.workerLocation}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      <span className="truncate block max-w-xs">{c.category}</span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        c.status === 'SELESAI'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : c.status === 'MEDIASI_HUKUM'
                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                          : c.status === 'SEDANG_DITANGANI'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ringkasan Data Master Lainnya */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link 
          href="/admin/cabang" 
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-brand-blue-500/60 hover:shadow-md transition-all group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <span>Kantor Helpdesk</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="text-2xl font-black text-slate-900">{totalBranches} Wilayah Aktif</div>
            <p className="text-xs text-slate-400">Tersebar di kantong migran & koridor perbatasan</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue-800 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <Building2 className="w-6 h-6" />
          </div>
        </Link>

        <Link 
          href="/admin/publikasi" 
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-emerald-500/60 hover:shadow-md transition-all group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <span>Repositori Dokumen</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="text-2xl font-black text-slate-900">{totalPublications} Publikasi & CATAHU</div>
            <p className="text-xs text-slate-400">Kertas kebijakan & riset hukum ketenagakerjaan</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
            <FileText className="w-6 h-6" />
          </div>
        </Link>
      </div>
    </div>
  );
}
