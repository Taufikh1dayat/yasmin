import React from 'react';
import { prisma } from '@/lib/prisma';
import HeroSection from '@/components/HeroSection';
import InteractiveMap from '@/components/InteractiveMap';
import PublicationSection from '@/components/PublicationSection';
import ComplaintSection from '@/components/ComplaintSection';
import ArticlesSection from '@/components/ArticlesSection';
import { Scale, BookOpen, Users, ShieldCheck, HeartHandshake, FileSearch, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; // Dynamic data

export default async function HomePage() {
  // Ambil data langsung dari database PostgreSQL
  let branches: any[] = [];
  let publications: any[] = [];
  let articles: any[] = [];

  try {
    branches = await prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    publications = await prisma.publication.findMany({
      orderBy: { year: 'desc' },
      take: 6,
    });

    articles = await prisma.article.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 3,
    });
  } catch (error) {
    console.error('Error fetching data from PostgreSQL, using defaults:', error);
  }

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Mandat Pokok Advokasi YASMIN */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">
              Mandat & Ruang Lingkup Kerja
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Tiga Mandat Pokok Pelindungan Keadilan Migran
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Sinergi kerja advokasi bantuan hukum struktural, riset kebijakan berbasis data lapangan, serta pengorganisasian akar rumput di kantong-kantong migran Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mandat 1: Bantuan Hukum */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-emerald-600 transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Scale className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  1. Bantuan Hukum Litigasi & Pro Bono
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Layanan pendampingan hukum bebas biaya bagi buruh migran yang menghadapi kekerasan, sengketa hak, atau jeratan tindak pidana perdagangan orang.
                </p>

                <ul className="space-y-2 pt-2 border-t border-slate-200 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Pendampingan korban TPPO & pemulangan darurat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Somasi penahanan dokumen & upah tak terbayar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Koordinasi diplomatik KBRI / KJRI negara tujuan</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200">
                <Link href="/pengaduan" className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 hover:text-emerald-900">
                  <span>Konsultasi & Pengaduan Kasus</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Mandat 2: Riset Kebijakan */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-blue-700 transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-brand-blue-900 flex items-center justify-center font-bold">
                  <FileSearch className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  2. Riset Kebijakan Berbasis Bukti
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Menerbitkan kajian empiris dan kertas advokasi untuk mengawal tata kelola penempatan dan pengawasan regulasi ketenagakerjaan migran.
                </p>

                <ul className="space-y-2 pt-2 border-t border-slate-200 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue-700"></span>
                    <span>Catatan Tahunan (CATAHU) potret kerentanan PMI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue-700"></span>
                    <span>Kertas kebijakan evaluasi UU No. 18 Tahun 2017</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue-700"></span>
                    <span>Penyusunan Amicus Curiae untuk preseden peradilan</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200">
                <Link href="/publikasi" className="text-xs font-bold text-brand-blue-900 flex items-center gap-1.5 hover:text-brand-blue-950">
                  <span>Akses Repositori Publikasi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Mandat 3: Paralegal Komunitas */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-teal-600 transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  3. Penguatan Paralegal Desa
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Membangun ketahanan keluarga migran dan mencetak kader hukum komunitas sebagai garda terdepan sistem siaga dini di kantong asal.
                </p>

                <ul className="space-y-2 pt-2 border-t border-slate-200 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-700"></span>
                    <span>Pelatihan verifikasi kontrak & legalitas agen P3MI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-700"></span>
                    <span>Posko rujukan pertama tingkat desa & kecamatan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-700"></span>
                    <span>Pemberdayaan ekonomi keluarga purna buruh migran</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200">
                <Link href="/profil" className="text-xs font-bold text-teal-800 flex items-center gap-1.5 hover:text-teal-900">
                  <span>Profil & Wilayah Kerja</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Peta Interaktif Sebaran Cabang */}
      <InteractiveMap />

      {/* 4. Layanan Pengaduan Kasus Online & Live Ticket Tracking */}
      <ComplaintSection branches={branches} />

      {/* 5. Pusat Publikasi & Riset */}
      <PublicationSection publications={publications.length > 0 ? publications : undefined} />

      {/* 6. Kabar Advokasi & Berita */}
      <ArticlesSection articles={articles.length > 0 ? articles : undefined} />
    </div>
  );
}
