import React from 'react';
import { prisma } from '@/lib/prisma';
import ComplaintSection from '@/components/ComplaintSection';
import { ShieldCheck, PhoneCall, HeartHandshake, AlertCircle } from 'lucide-react';

export const revalidate = 0;

export default async function PengaduanPage() {
  let branches: any[] = [];
  try {
    branches = await prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching branches for pengaduan page:', e);
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Info Banner Alur Bantuan Hukum */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
            Standar Operasional Pendampingan Kasus YASMIN
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-3xl leading-relaxed">
            Seluruh proses penerimaan laporan, konsultasi hukum, hingga pendampingan perkara diberikan secara <strong>Cuma-cuma (GRATIS)</strong> tanpa dipungut biaya apapun dari korban maupun keluarganya.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
              <span className="font-bold text-emerald-800 text-sm">1. Penerimaan Aduan</span>
              <p className="text-slate-600 leading-relaxed">
                Pengadu mengisi formulir online atau menghubungi hotline. Sistem otomatis menerbitkan kode tiket pelacakan.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
              <span className="font-bold text-brand-blue-800 text-sm">2. Verifikasi & Telaah</span>
              <p className="text-slate-600 leading-relaxed">
                Tim advokat YASMIN mengkaji kronologi berkas, memeriksa kontrak kerja, dan menentukan strategi hukum dalam 1x24 jam.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-1">
              <span className="font-bold text-teal-800 text-sm">3. Tindakan Pendampingan</span>
              <p className="text-slate-600 leading-relaxed">
                Koordinasi dengan KBRI/KJRI di luar negeri, mediasi dengan agen, atau proses pelaporan pidana ke pihak berwajib.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 text-sm">4. Pemulihan & Evaluasi</span>
              <p className="text-slate-600 leading-relaxed">
                Pemenuhan hak upah, bantuan restitusi korban, dan pemulangan aman ke kampung halaman.
              </p>
            </div>
          </div>
        </div>

        {/* Complaint Section Component */}
        <ComplaintSection branches={branches} />
      </div>
    </div>
  );
}
