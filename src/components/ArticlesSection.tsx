'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  ArrowRight, 
  X,
  FileText,
  Building2,
  Share2
} from 'lucide-react';
import Link from 'next/link';

export interface ArticleItem {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  excerpt: string;
  content?: string;
  author: string;
  imageUrl?: string;
  dispatchNo?: string;
  locationTag?: string;
}

const DEFAULT_ARTICLES: ArticleItem[] = [
  {
    id: 'art-1',
    title: 'YASMIN Desak Pemerintah Perketat Pengawasan Klausul Kontrak Mandiri Sektor Perikanan',
    category: 'Kabar Kebijakan',
    publishedAt: '2026-09-15',
    excerpt: 'Tingginya angka sengketa gaji tak dibayar pada ABK migran membutuhkan harmonisasi regulasi izin penempatan dan asuransi jaminan sosial internasional.',
    content: `CILACAP – Yayasan Studi Migran Indonesia (YASMIN) secara resmi melayangkan nota rekomendasi kebijakan kepada kementerian terkait menyusul berulangnya kasus penelantaran anak buah kapal (ABK) asal Indonesia di perairan internasional.

Direktur YASMIN, Retno Dewi, menegaskan bahwa celah hukum pada skema kontrak kerja mandiri (direct hiring) kerap dimanfaatkan oleh agensi perekrut nakal untuk melepaskan tanggung jawab perlindungan hukum saat sengketa upah dan kecelakaan kerja terjadi di laut lepas.

"Kami menemukan puluhan berkas kontrak yang tidak mencantumkan klausul asuransi kecelakaan kerja internasional sesuai standar ILO C-188. Tanpa perlindungan terpadu sejak pra-pemberangkatan, ABK migran kita terus berada pada posisi tawar yang rentan," ujar Retno dalam keterangan pers di Sekretariat Nasional YASMIN, Majenang, Cilacap.

YASMIN mendesak dibentuknya gugus tugas bersama antara Kementerian Ketenagakerjaan dan Kementerian Kelautan dan Perikanan guna memastikan setiap sertifikasi perjanjian kerja laut melewati audit hukum yang ketat sebelum izin berlayar diterbitkan.`,
    author: 'Redaksi Kebijakan YASMIN',
    imageUrl: '/images/imigran.jpg',
    dispatchNo: 'YSM/RLS/2026/09-01',
    locationTag: 'Cilacap, Jawa Tengah'
  },
  {
    id: 'art-2',
    title: 'Pemberdayaan Purna PMI: Pelatihan Kewirausahaan & Literasi Keuangan Desa Berbasis Komunitas',
    category: 'Kabar Komunitas',
    publishedAt: '2026-09-11',
    excerpt: 'Mendorong kemandirian ekonomi keluarga buruh migran agar remitansi yang dihasilkan mampu dikelola menjadi unit usaha produktif berkelanjutan.',
    content: `INDRAMAYU – Divisi Pemberdayaan Komunitas YASMIN menyelenggarakan lokakarya literasi keuangan dan perintisan usaha mikro bagi 45 mantan pekerja migran perempuan di wilayah sentra migrasi Jawa Barat.

Manager Program YASMIN, Nadia Nurul, menyampaikan bahwa remitansi luar negeri seringkali habis untuk kebutuhan konsumtif dalam waktu singkat jika tidak diimbangi dengan pendampingan pengelolaan arus kas keluarga dan pelatihan keterampilan berusaha di kampung halaman.

"Tujuan utama program pemberdayaan ini adalah memastikan para purna migran tidak terpaksa kembali bermigrasi non-prosedural karena jeratan utang atau kegagalan usaha di desa. Kami mendampingi pembentukan koperasi simpan pinjam dan kelompok usaha olahan pangan berbasis potensi lokal," jelas Nadia.

Program ini didukung oleh jaringan paralegal desa yang bertugas memantau perkembangan usaha serta menyediakan konsultasi perlindungan hukum bagi aset-aset hasil remitansi keluarga pekerja migran.`,
    author: 'Divisi Pemberdayaan Komunitas YASMIN',
    imageUrl: '/images/merchandise.jpg',
    dispatchNo: 'YSM/RLS/2026/09-02',
    locationTag: 'Indramayu, Jawa Barat'
  },
  {
    id: 'art-3',
    title: 'Posko Bantuan Hukum YASMIN Dampingi Pemulangan & Tuntutan Hak 8 PMI dari Malaysia',
    category: 'Advokasi Kasus',
    publishedAt: '2026-09-06',
    excerpt: 'Setelah 7 bulan penahanan paspor oleh majikan di Selangor, tim advokasi hukum berhasil memfasilitasi repatriasi dan pelunasan seluruh tunggakan upah.',
    content: `JAKARTA – Tim Advokasi Lembaga Bantuan Hukum YASMIN berhasil mengawal pemulangan delapan pekerja migran sektor domestik asal Jawa Timur dan Nusa Tenggara Barat yang sempat tertahan dokumennya di wilayah Selangor, Malaysia.

Manager Advokasi YASMIN, Vicky, memaparkan bahwa pendampingan dilakukan secara maraton melalui koordinasi lintas batas dengan KBRI Kuala Lumpur dan jejaring serikat buruh migran setempat pasca keluarga korban melapor melalui saluran siaga pengaduan online YASMIN.

"Selain memastikan dokumen SPLP (Surat Perjalanan Laksana Paspor) diterbitkan dan kepulangan aman tiba di tanah air, tim kuasa hukum YASMIN juga berhasil menuntut pemenuhan hak upah tertunggak senilai total RM 64.000 dari pihak majikan," tegas Vicky di Terminal 3 Bandara Soekarno-Hatta.

YASMIN terus mengingatkan kepada calon pekerja migran dan keluarganya agar senantiasa mendokumentasikan salinan perjanjian penempatan dan kontrak kerja resmi guna memudahkan proses advokasi jika terjadi pelanggaran hak ketenagakerjaan di negara tujuan.`,
    author: 'Tim Advokasi Hukum YASMIN',
    imageUrl: '/images/imigran.jpg',
    dispatchNo: 'YSM/RLS/2026/09-03',
    locationTag: 'Jakarta & Selangor'
  }
];

export default function ArticlesSection({ articles = DEFAULT_ARTICLES }: { articles?: ArticleItem[] }) {
  const [items] = useState<ArticleItem[]>(articles.length > 0 ? articles : DEFAULT_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  return (
    <section id="berita-terupdate" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Seksi Berita Terupdate (Bersih & Profesional) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>Siaran Pers & Warta Kebijakan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Warta Advokasi & Berita Terkini
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Catatan perkembangan kasus, siaran pers resmi lembaga, dan liputan kerja lapangan Yayasan Studi Migran Indonesia dalam memperjuangkan kedaulatan buruh migran.
            </p>
          </div>

          <Link
            href="/publikasi"
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs transition-colors flex items-center gap-2 self-start lg:self-auto shadow-sm"
          >
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>Lihat Semua Arsip & Publikasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid Kartu Berita Terupdate */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((art) => (
            <article
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/60 transition-all flex flex-col justify-between overflow-hidden group cursor-pointer"
            >
              {/* Foto Gambar Berita */}
              {art.imageUrl && (
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-brand-blue-900/90 text-white shadow-sm backdrop-blur-sm">
                      {art.category}
                    </span>
                  </div>
                  {art.locationTag && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-slate-800 shadow-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" /> {art.locationTag}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Header Kartu Berita */}
              <div className="p-5 pb-3 border-b border-slate-100 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    {new Date(art.publishedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  {art.dispatchNo && (
                    <span className="font-mono text-[10px] text-slate-400 font-semibold">
                      {art.dispatchNo}
                    </span>
                  )}
                </div>
              </div>

              {/* Konten Judul & Ringkasan */}
              <div className="p-5 flex-1 space-y-3">
                <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-800 hover:text-emerald-700 transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-4 group-hover:text-slate-800 transition-colors">
                  {art.excerpt}
                </p>
              </div>

              {/* Footer Penulis & Aksi Membaca */}
              <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium truncate max-w-[170px]">
                  {art.author}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedArticle(art);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-900 ml-1"
                >
                  <span>Baca</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* MODAL BACA SIARAN PERS LENGKAP (Clean & Elegan Tanpa Efek Scroll Kasar) */}
        {selectedArticle && (
          <div 
            onClick={() => setSelectedArticle(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 animate-in fade-in duration-150"
            style={{ overscrollBehavior: 'contain' }}
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 transform-gpu"
            >
              {/* Header Modal - Tetap di Atas (Fixed) */}
              <div className="p-6 sm:p-8 border-b border-slate-100 flex items-start justify-between gap-6 flex-shrink-0 bg-white">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {selectedArticle.category}
                    </span>
                    {selectedArticle.dispatchNo && (
                      <span className="text-xs font-mono text-slate-400">
                        No: {selectedArticle.dispatchNo}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                    {selectedArticle.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500">
                    <span className="font-medium">
                      {new Date(selectedArticle.publishedAt).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{selectedArticle.author}</span>
                    {selectedArticle.locationTag && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{selectedArticle.locationTag}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors flex-shrink-0"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Konten Scrollable - Luas, Ringan & Nyaman Dibaca */}
              <div 
                className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 modal-scroll"
                style={{ willChange: 'scroll-position' }}
              >
                {/* Gambar Berita di Modal Baca */}
                {selectedArticle.imageUrl && (
                  <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-2xl overflow-hidden shadow-sm bg-slate-100 flex-shrink-0">
                    <img
                      src={selectedArticle.imageUrl}
                      alt={selectedArticle.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                    {selectedArticle.locationTag && (
                      <div className="absolute bottom-4 left-4 text-xs font-bold text-white px-3.5 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-sm shadow flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{selectedArticle.locationTag}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-4 max-w-none text-slate-700 leading-relaxed">
                  <div className="p-4 rounded-xl bg-emerald-50/60 border-l-4 border-emerald-600 font-medium text-slate-900 text-sm sm:text-base leading-relaxed">
                    {selectedArticle.excerpt}
                  </div>
                  <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-800 space-y-3">
                    {selectedArticle.content || selectedArticle.excerpt}
                  </div>
                </div>
              </div>

              {/* Footer Modal - Tetap di Bawah (Fixed) */}
              <div className="p-4 sm:px-8 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs flex-shrink-0 rounded-b-3xl">
                <span className="text-slate-500 font-medium">
                  Yayasan Studi Migran Indonesia (YASMIN) • Rilis Advokasi Resmi
                </span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-sm"
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
