'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, Phone, Mail, MapPin, ShieldCheck, HeartHandshake, FileText, ArrowUpRight, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t-4 border-brand-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Kolom 1: Profil & Identitas */}
          <div className="space-y-4">
            <div className="inline-block bg-white px-4 py-3 rounded-2xl shadow-md">
              <img
                src="/images/yasmin_logo.png"
                alt="Logo YASMIN"
                className="h-14 sm:h-16 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Lembaga advokasi independen yang berdedikasi mewujudkan keadilan, perlindungan hukum komprehensif, dan martabat bagi Pekerja Migran Indonesia (PMI) serta keluarganya.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Pendampingan Hukum Bebas Biaya (Pro Bono)</span>
            </div>
          </div>

          {/* Kolom 2: Kontak Kantor Resmi YASMIN */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base border-l-4 border-brand-green-500 pl-2.5">
              Kantor Pusat YASMIN
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span>Jalan Marta Atmaja, Kecamatan Majenang, Kabupaten Cilacap, Jawa Tengah, Indonesia</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href="mailto:studi.migran@gmail.com" className="hover:text-emerald-300 transition-colors">
                  studi.migran@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 pt-1 text-xs">
                <a
                  href="https://instagram.com/studimigran"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                >
                  IG: @studimigran
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                >
                  FB: studi migran
                </a>
              </li>
              <li className="pt-1.5">
                <a
                  href="https://wa.me/6281198765431"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 rounded-md transition-colors"
                >
                  Hotline WhatsApp 24 Jam <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Tautan Cepat */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base border-l-4 border-brand-blue-500 pl-2.5">
              Layanan & Riset
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/pengaduan" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Formulir Pengaduan Kasus
                </Link>
              </li>
              <li>
                <Link href="/pengaduan?tab=tracking" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Lacak Status Aduan (Cek Tiket)
                </Link>
              </li>
              <li>
                <Link href="/publikasi" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Catatan Tahunan (CATAHU) 2025
                </Link>
              </li>
              <li>
                <Link href="/publikasi?category=Panduan+Advokasi" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Buku Saku Hak Buruh Migran
                </Link>
              </li>
              <li>
                <Link href="/#posko-wilayah" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Direktori 11 Helpdesk Daerah
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Perlindungan Kerahasiaan & Hukum */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base border-l-4 border-amber-500 pl-2.5">
              Kerahasiaan Pelapor
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              YASMIN menerapkan standar perlindungan saksi dan korban yang ketat. Seluruh identitas pelapor, komunikasi, dan dokumen bukti dilindungi di bawah asas kerahasiaan bantuan hukum serta ketentuan UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.
            </p>
            <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>Didukung jejaring paralegal dan serikat buruh migran internasional.</span>
            </div>
          </div>
        </div>

        {/* Garis batas & Hak Cipta */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Yayasan Studi Migran Indonesia (YASMIN). Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-6">
            <Link href="/profil" className="hover:text-slate-400">Kode Etik Advokasi</Link>
            <Link href="/profil" className="hover:text-slate-400">Kebijakan Privasi</Link>
            <Link href="/pengaduan" className="hover:text-slate-400">SOP Pelaporan</Link>
            <Link href="/admin/login" className="text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1 font-semibold">
              <Lock className="w-3 h-3" />
              <span>Portal Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
