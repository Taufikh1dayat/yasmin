'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, Search, BookOpen, ExternalLink, Filter, Calendar } from 'lucide-react';
import Link from 'next/link';

interface PublicationItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: number;
  author: string;
  description: string;
  fileUrl: string;
  coverImage?: string;
  downloadCount: number;
  pageCount?: number;
  fileSize?: string;
  docCode?: string;
  themeColor?: 'crimson' | 'navy' | 'emerald' | 'teal' | 'charcoal';
}

const DEFAULT_PUBLICATIONS: PublicationItem[] = [
  {
    id: 'pub-1',
    title: 'Laporan Catatan Tahunan 2025: Potret Kerentanan & Akses Keadilan Pekerja Migran Indonesia',
    slug: 'catahu-2025-potret-kerentanan-pmi',
    category: 'Laporan Tahunan',
    year: 2025,
    author: 'Divisi Riset & Dokumentasi Data YASMIN',
    description: 'Dokumentasi komprehensif atas 1.420 kasus pekerja migran yang didampingi sepanjang tahun 2025, mencakup analisis jeratan utang, kekerasan majikan, dan evaluasi bantuan hukum di negara penempatan.',
    fileUrl: '#',
    downloadCount: 342,
    pageCount: 148,
    fileSize: '4.8 MB',
    docCode: 'DOC-YSM/2025/CTH-01',
    themeColor: 'crimson',
  },
  {
    id: 'pub-2',
    title: 'Kertas Kebijakan: Evaluasi Implementasi UU No. 18 Tahun 2017 tentang Pelindungan PMI',
    slug: 'kertas-kebijakan-evaluasi-uu-18-2017',
    category: 'Kertas Kebijakan',
    year: 2024,
    author: 'Tim Advokasi Kebijakan Publik YASMIN',
    description: 'Analisis kritis atas efektivitas Layanan Terpadu Satu Atap (LTSA) dan jaminan perlindungan sosial bagi pekerja migran sektor domestik pasca 7 tahun pengesahan UU PPMI.',
    fileUrl: '#',
    downloadCount: 518,
    pageCount: 64,
    fileSize: '2.1 MB',
    docCode: 'DOC-YSM/2024/PB-04',
    themeColor: 'navy',
  },
  {
    id: 'pub-3',
    title: 'Buku Saku Advokasi: Hak-Hak Hukum PMI di Sektor Domestik & Perkebunan',
    slug: 'buku-saku-advokasi-hak-hukum-pmi',
    category: 'Panduan Advokasi',
    year: 2024,
    author: 'Divisi Bantuan Hukum & Paralegal Desa',
    description: 'Buku panduan saku praktis bagi calon pekerja migran, keluarga di kampung halaman, serta paralegal desa mengenai hak upah, hak cuti, verifikasi kontrak kerja, dan kontak darurat.',
    fileUrl: '#',
    downloadCount: 890,
    pageCount: 88,
    fileSize: '3.4 MB',
    docCode: 'DOC-YSM/2024/GDE-02',
    themeColor: 'emerald',
  },
  {
    id: 'pub-4',
    title: 'Riset Penanganan Korban TPPO Jalur Non-Prosedural di Perbatasan RI - Malaysia',
    slug: 'riset-penanganan-korban-tppo-perbatasan',
    category: 'Riset & Studi',
    year: 2023,
    author: 'Tim Riset Lapangan YASMIN & Jaringan Perbatasan',
    description: 'Studi mendalam mengenai modus operandi sindikat perdagangan orang jalur tikus perbatasan darat dan laut serta rekomendasi sistem deteksi dini berbasis komunitas.',
    fileUrl: '#',
    downloadCount: 421,
    pageCount: 112,
    fileSize: '3.9 MB',
    docCode: 'DOC-YSM/2023/RST-07',
    themeColor: 'teal',
  },
  {
    id: 'pub-5',
    title: 'Amicus Curiae: Penuntutan Hak Restitusi bagi PMI Korban Penyiksaan Majikan Luar Negeri',
    slug: 'amicus-curiae-restitusi-korban-penyiksaan-pmi',
    category: 'Amicus Curiae',
    year: 2024,
    author: 'Lembaga Bantuan Hukum YASMIN',
    description: 'Pendapat hukum sebagai sahabat pengadilan (Amicus Curiae) dalam mendorong ganti rugi materil dan pemulihan psikososial menyeluruh bagi buruh migran korban eksploitasi berat.',
    fileUrl: '#',
    downloadCount: 275,
    pageCount: 42,
    fileSize: '1.6 MB',
    docCode: 'DOC-YSM/2024/AMC-01',
    themeColor: 'charcoal',
  }
];

export default function PublicationSection({ publications = DEFAULT_PUBLICATIONS }: { publications?: PublicationItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [search, setSearch] = useState('');

  const categories = ['Semua', 'Laporan Tahunan', 'Kertas Kebijakan', 'Panduan Advokasi', 'Riset & Studi', 'Amicus Curiae'];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category') || params.get('cat');
      if (cat) {
        const found = categories.find((c) => c.toLowerCase() === cat.toLowerCase());
        if (found) setSelectedCategory(found);
      }
    }
  }, []);

  const filtered = publications.filter((p) => {
    const matchesCat = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="publikasi" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue-800 text-xs font-bold border border-blue-200 mb-3">
              <BookOpen className="w-3.5 h-3.5 text-brand-blue-700" />
              <span>Pusat Data & Kajian Migrasi</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Publikasi, Riset & Kertas Kebijakan
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
              Akses publik terbuka terhadap laporan tahunan, amicus curiae, dan panduan hukum ketenagakerjaan migran untuk advokasi berbasis data yang transparan.
            </p>
          </div>

          <Link
            href="/publikasi"
            className="self-start md:self-auto text-xs font-bold text-brand-green-700 hover:text-brand-green-800 flex items-center gap-1 group py-2"
          >
            <span>Lihat Semua Repositori</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Filter Categories & Search Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul dokumen atau riset..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.slice(0, 6).map((pub) => {
            // Skema warna sampul resmi berdasarkan kategori
            const isCatahu = pub.category === 'Laporan Tahunan' || pub.themeColor === 'crimson';
            const isPolicy = pub.category === 'Kertas Kebijakan' || pub.themeColor === 'navy';
            const isGuide = pub.category === 'Panduan Advokasi' || pub.themeColor === 'emerald';
            const isAmicus = pub.category === 'Amicus Curiae' || pub.themeColor === 'charcoal';

            const coverGradient = isCatahu
              ? 'from-red-950 via-slate-950 to-red-900 border-red-800/40 text-red-100'
              : isPolicy
              ? 'from-blue-950 via-slate-950 to-slate-900 border-blue-800/40 text-blue-100'
              : isGuide
              ? 'from-emerald-950 via-slate-950 to-teal-950 border-emerald-800/40 text-emerald-100'
              : isAmicus
              ? 'from-zinc-950 via-neutral-900 to-slate-950 border-amber-800/40 text-amber-100'
              : 'from-slate-950 via-teal-950 to-slate-900 border-teal-800/40 text-teal-100';

            const spineColor = isCatahu
              ? 'bg-red-700'
              : isPolicy
              ? 'bg-blue-600'
              : isGuide
              ? 'bg-emerald-600'
              : isAmicus
              ? 'bg-amber-600'
              : 'bg-teal-600';

            const badgeBg = isCatahu
              ? 'bg-red-900/90 text-red-200 border-red-700/60'
              : isPolicy
              ? 'bg-blue-900/90 text-blue-200 border-blue-700/60'
              : isGuide
              ? 'bg-emerald-900/90 text-emerald-200 border-emerald-700/60'
              : isAmicus
              ? 'bg-amber-900/90 text-amber-200 border-amber-700/60'
              : 'bg-teal-900/90 text-teal-200 border-teal-700/60';

            return (
              <div
                key={pub.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-lg hover:border-slate-300 transition-all flex flex-col group"
              >
                {/* Sampul Monograf Dokumen Resmi (Bukan Foto Stock AI) */}
                <div className={`relative h-60 p-5 bg-gradient-to-br ${coverGradient} border-b flex flex-col justify-between overflow-hidden`}>
                  {/* Efek Punggung Buku / Document Spine */}
                  <div className={`absolute top-0 left-0 bottom-0 w-2.5 ${spineColor} shadow-inner`}></div>

                  {/* Header Sampul */}
                  <div className="pl-2 space-y-1.5 z-10">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${badgeBg}`}>
                        {pub.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-300 font-semibold">
                        {pub.year}
                      </span>
                    </div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                      YAYASAN STUDI MIGRAN INDONESIA
                    </div>
                  </div>

                  {/* Judul Dokumen di Sampul */}
                  <div className="pl-2 my-auto z-10 space-y-1">
                    <h3 className="font-extrabold text-white text-sm sm:text-base leading-snug line-clamp-3 group-hover:text-emerald-300 transition-colors">
                      {pub.title}
                    </h3>
                    {pub.docCode && (
                      <span className="text-[10px] font-mono text-slate-400 block">
                        No. Registrasi: {pub.docCode}
                      </span>
                    )}
                  </div>

                  {/* Footer Sampul */}
                  <div className="pl-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 z-10">
                    <span>{pub.pageCount || 84} Halaman</span>
                    <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white font-bold">
                      PDF • {pub.fileSize || '3.2 MB'}
                    </span>
                  </div>

                  {/* Dekorasi Garis Halus Arsip */}
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full border border-white/5 pointer-events-none"></div>
                </div>

                {/* Ringkasan & Keterangan Dokumen */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-emerald-800 block">
                      {pub.author}
                    </span>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {pub.description}
                    </p>
                  </div>

                  {/* Download Action Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      {pub.downloadCount} kali diunduh
                    </span>
                    <button
                      onClick={() => alert(`Mengunduh dokumen: ${pub.title} (Format PDF Resmi YASMIN)`)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 font-bold transition-all shadow-sm text-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Dokumen PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
