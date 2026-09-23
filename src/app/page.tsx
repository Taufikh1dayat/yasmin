import React from 'react';
import { prisma } from '@/lib/prisma';
import HeroSection from '@/components/HeroSection';
import InteractiveMap from '@/components/InteractiveMap';
import PublicationSection from '@/components/PublicationSection';
import ComplaintSection from '@/components/ComplaintSection';
import ArticlesSection from '@/components/ArticlesSection';
import { Scale, BookOpen, Users, ShieldCheck, HeartHandshake, FileSearch, ArrowRight, GraduationCap, Megaphone } from 'lucide-react';
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

      {/* 2. Empat Program Pokok YASMIN */}
      <section id="mandat-advokasi" className="scroll-mt-20 py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">
              Program Umum & Ruang Lingkup Kerja
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Empat Program Pokok Advokasi YASMIN
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Fokus kerja terpadu Yayasan Studi Migran Indonesia untuk mempengaruhi kebijakan dan menciptakan kedaulatan serta pelindungan yang adil bagi migran, purna migran, dan keluarga.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Penelitian */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-blue-700 transition-colors">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-blue-100 text-brand-blue-900 flex items-center justify-center font-bold">
                  <FileSearch className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  1. Penelitian
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mengetahui dan memahami situasi migrasi yang dialami oleh migran, purna migran, dan keluarga secara politik, ekonomi, budaya, dan sosial.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200">
                <Link href="/publikasi" className="text-xs font-bold text-brand-blue-900 flex items-center gap-1 hover:text-brand-blue-950">
                  <span>Lihat Hasil Riset</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 2. Pemberdayaan */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-teal-700 transition-colors">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  2. Pemberdayaan
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mengembangkan dan meningkatkan potensi komunitas migran secara mandiri dan kolektif melalui pendidikan, pelatihan, dan kemitraan.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200">
                <Link href="/profil#profil" className="text-xs font-bold text-teal-800 flex items-center gap-1 hover:text-teal-900">
                  <span>Program Komunitas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 3. Advokasi */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-emerald-600 transition-colors">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  3. Advokasi
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Advokasi peraturan perundang-undangan serta pendampingan langsung pengaduan kasus ketenagakerjaan buruh migran.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200">
                <Link href="/pengaduan" className="text-xs font-bold text-emerald-800 flex items-center gap-1 hover:text-emerald-900">
                  <span>Layanan Pengaduan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 4. Media & Kampanye */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-amber-600 transition-colors">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Megaphone className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  4. Media & Kampanye
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pengelolaan media komunikasi serta penyebarluasan informasi dan isu-isu penting migrasi sebagai rujukan masyarakat umum.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200">
                <Link href="/#berita-terupdate" className="text-xs font-bold text-amber-800 flex items-center gap-1 hover:text-amber-900">
                  <span>Warta & Informasi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pusat Berita Terupdate & Update Berita Langsung di Beranda */}
      <ArticlesSection articles={articles.length > 0 ? articles : undefined} />

      {/* 4. Peta Interaktif Sebaran Cabang */}
      <InteractiveMap branches={branches.length > 0 ? branches : undefined} />

      {/* 5. Layanan Pengaduan Kasus Online & Live Ticket Tracking */}
      <ComplaintSection branches={branches} />

      {/* 6. Pusat Publikasi & Riset */}
      <PublicationSection publications={publications.length > 0 ? publications : undefined} />
    </div>
  );
}
