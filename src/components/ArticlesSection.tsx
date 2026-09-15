'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Newspaper, ArrowRight, Calendar, User, MapPin, FileCheck, X } from 'lucide-react';

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content?: string;
  author: string;
  publishedAt: Date | string;
  locationTag?: string;
  dispatchNo?: string;
}

const DEFAULT_ARTICLES: ArticleItem[] = [
  {
    id: 'art-1',
    title: 'YASMIN Dampingi Pemulangan dan Pemulihan Hak 14 PMI Korban TPPO dari Jalur Transit Perbatasan',
    slug: 'pemulangan-14-pmi-korban-tppo',
    category: 'Siaran Pers Resmi',
    locationTag: 'Jakarta & Entikong',
    dispatchNo: 'SP-YSM/2026/03-01',
    excerpt: 'Melalui koordinasi lintas lembaga bersama KBRI dan perwakilan posko daerah, tim advokasi YASMIN mengawal proses pemulangan 14 pekerja migran asal NTB dan Jabar yang tertahan tanpa dokumen di wilayah transit.',
    content: `JAKARTA — Yayasan Studi Migran Indonesia (YASMIN) bersama jejaring paralegal di daerah berhasil memfasilitasi pemulangan 14 Pekerja Migran Indonesia (PMI) korban penipuan penempatan non-prosedural. Seluruh korban sempat ditahan paspornya oleh calo di wilayah transit sebelum akhirnya diamankan oleh posko perlindungan.

Saat ini ke-14 PMI telah ditempatkan di Rumah Perlindungan Trauma Center (RPTC) untuk pemeriksaan medis menyeluruh, pendampingan trauma healing, serta pengumpulan bukti guna penuntutan pidana perdagangan orang (TPPO) terhadap pihak perekrut nakal.

YASMIN mendesak aparat kepolisian mengusut tuntas rantai agen liar di tingkat desa dan menuntut ganti rugi materil (restitusi) bagi para korban dan keluarganya.`,
    author: 'Biro Advokasi Kasus & Litigasi',
    publishedAt: '2026-03-10',
  },
  {
    id: 'art-2',
    title: 'Lokakarya Paralegal Komunitas: Membangun Sistem Siaga Dini di 20 Desa Kantong Migran Utama',
    slug: 'pelatihan-paralegal-desa-siaga-migran',
    category: 'Kabar Komunitas',
    locationTag: 'Indramayu & Cirebon',
    dispatchNo: 'KBR-YSM/2026/02-04',
    excerpt: 'Sebanyak 45 kader desa dan anggota keluarga purna migran dilatih keterampilan verifikasi kontrak kerja, audit izin P3MI, serta mekanisme pelaporan cepat saat terjadi darurat di luar negeri.',
    content: `INDRAMAYU — Mengantisipasi maraknya jeratan rentenir dan calo penempatan ilegal, YASMIN menggelar pelatihan intensif paralegal desa selama tiga hari di Kabupaten Indramayu.

Peserta dibekali modul identifikasi klausul kontrak manipulatif, hak-hak upah standar menurut regulasi negara tujuan, serta tata cara memanfaatkan kanal pelaporan resmi hotline YASMIN dan perwakilan RI.

"Paralegal desa adalah benteng pertama pertahanan keluarga migran sebelum keberangkatan," tegas Koordinator Jaringan Komunitas YASMIN.`,
    author: 'Divisi Pengorganisasian Komunitas',
    publishedAt: '2026-02-28',
  },
  {
    id: 'art-3',
    title: 'Kertas Peringatan Kebijakan: Evaluasi Celah Hukum Kontrak Mandiri Sektor Pelaut & Perikanan (ABK)',
    slug: 'desakan-pengawasan-kontrak-abk-perikanan',
    category: 'Kajian Regulasi',
    locationTag: 'Sekretariat Nasional',
    dispatchNo: 'REG-YSM/2026/02-02',
    excerpt: 'Tingginya angka penelantaran anak buah kapal (ABK) dan penahanan upah di perairan internasional menuntut harmonisasi izin manning agency dan jaminan asuransi kecelakaan berstandar ILO.',
    content: `JAKARTA — Tim Riset Kebijakan YASMIN resmi menerbitkan lembar rekomendasi kepada Kementerian Ketenagakerjaan dan Badan Pelindungan Pekerja Migran Indonesia (BP2MI) terkait maraknya kasus sengketa upah ABK migran.

Berdasarkan kompilasi aduan sepanjang 2025, lebih dari 65% kasus ABK terjadi karena kontrak kerja ganda (double contracts) yang disodorkan manning agency tidak berizin resmi.

YASMIN mendorong dibentuknya basis data digital terpadu bagi pelaut perikanan dan penegakan sanksi pencabutan izin bagi agen yang melanggar standar keselamatan kerja di laut lepas.`,
    author: 'Redaksi Riset & Kebijakan Publik',
    publishedAt: '2026-02-15',
  }
];

export default function ArticlesSection({ articles = DEFAULT_ARTICLES }: { articles?: ArticleItem[] }) {
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-brand-blue-900 text-xs font-bold border border-blue-200 mb-3">
              <Newspaper className="w-3.5 h-3.5 text-brand-blue-800" />
              <span>Warta Resmi Lembaga</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Siaran Pers & Catatan Lapangan
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1 max-w-2xl">
              Publikasi kabar perkembangan penanganan perkara, sikap organisasi terhadap regulasi, dan dokumentasi program paralegal di akar rumput.
            </p>
          </div>
        </div>

        {/* Grid Articles Berformat Siaran Pers Resmi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/60 transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Header Kartu Siaran Pers */}
              <div className="p-5 pb-3 border-b border-slate-100 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-700 border border-slate-200">
                    {art.category}
                  </span>
                  {art.dispatchNo && (
                    <span className="font-mono text-[10px] text-slate-400 font-semibold">
                      {art.dispatchNo}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    {new Date(art.publishedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  {art.locationTag && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" /> {art.locationTag}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Konten Utama */}
              <div className="p-5 flex-1 space-y-3">
                <h3 className="font-bold text-slate-900 text-base leading-snug hover:text-emerald-700 transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                  {art.excerpt}
                </p>
              </div>

              {/* Footer Penulis & Aksi */}
              <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium truncate max-w-[160px]">
                  {art.author}
                </span>
                <button
                  onClick={() => setSelectedArticle(art)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-900 transition-colors"
                >
                  <span>Baca Rilis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Modal Baca Siaran Pers Lengkap */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {selectedArticle.category}
                  </span>
                  {selectedArticle.dispatchNo && (
                    <span className="text-xs font-mono text-slate-400 ml-2">
                      No: {selectedArticle.dispatchNo}
                    </span>
                  )}
                  <h3 className="text-xl font-black text-slate-900 mt-2 leading-tight">
                    {selectedArticle.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                    <span>{new Date(selectedArticle.publishedAt).toLocaleDateString('id-ID', { dateStyle: 'full' })}</span>
                    <span>•</span>
                    <span>{selectedArticle.author}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="prose prose-sm text-slate-700 leading-relaxed space-y-4">
                <p className="font-semibold text-slate-900 border-l-4 border-emerald-600 pl-3 italic text-xs sm:text-sm">
                  {selectedArticle.excerpt}
                </p>
                <div className="whitespace-pre-line text-xs sm:text-sm">
                  {selectedArticle.content || selectedArticle.excerpt}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Yayasan Studi Migran Indonesia (YASMIN)
                </span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
                >
                  Tutup Rilis
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

