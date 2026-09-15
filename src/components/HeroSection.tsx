import React from 'react';
import Link from 'next/link';
import { PhoneCall, FileText, ArrowRight, ShieldCheck, MapPin, Scale, AlertCircle } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden text-white bg-slate-950">
      {/* Background Image Dokumenter Otentik */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none scale-100"
        style={{ backgroundImage: "url('/images/imigran.jpg?v=2')" }}
      ></div>

      {/* Dark Vignette & Gradient Overlay yang Rapi dan Bermartabat */}
      <div className="absolute inset-0 bg-slate-950/80 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/80 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-3xl space-y-6">
          {/* Label Lembaga Resmi */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Lembaga Bantuan Hukum & Advokasi Hak Buruh Migran</span>
          </div>

          {/* Judul Utama yang Kuat & Lugas (Tanpa Teks Pelangi AI) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Pendampingan Hukum & Pembelaan Hak Pekerja Migran Indonesia
          </h1>

          {/* Penjelasan Ringkas & Humanis */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
            Yayasan Studi Migran Indonesia (YASMIN) menyelenggarakan bantuan hukum cuma-cuma (*pro bono*), advokasi kebijakan ketenagakerjaan, serta penguatan posko perlindungan bagi PMI dan keluarga di daerah asal maupun negara penempatan.
          </p>

          {/* Tombol Aksi Utama */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <Link
              href="/pengaduan"
              className="px-6 py-3.5 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
            >
              <span>Ajukan Pengaduan Kasus</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/#posko-wilayah"
              className="px-6 py-3.5 rounded-xl font-bold text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Kontak 11 Posko Daerah</span>
            </Link>

            <Link
              href="/publikasi"
              className="px-6 py-3.5 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <FileText className="w-4 h-4" />
              <span>Laporan Riset & CATAHU</span>
            </Link>
          </div>
        </div>

        {/* 3 Jalur Layanan Cepat (Bukan Statistik Palsu AI, tapi Layanan Nyata Lembaga) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 pt-8 border-t border-slate-800/80">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-800/60 text-emerald-400 flex-shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Bantuan Hukum Pro Bono</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Penanganan sengketa upah, penahanan dokumen, kekerasan majikan, dan pemulangan tanpa pungutan biaya.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-950 border border-blue-800/60 text-blue-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Kerahasiaan Korban Terjamin</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Pelapor dapat menggunakan opsi anonim demi keselamatan pribadi dan perlindungan saksi sesuai UU PDP.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-teal-950 border border-teal-800/60 text-teal-400 flex-shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Hotline Respons Cepat</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Terhubung langsung ke koordinator advokasi di nomor resmi WhatsApp: <span className="text-emerald-400 font-bold">0811-9876-5431</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
