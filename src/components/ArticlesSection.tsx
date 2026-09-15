'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Newspaper, 
  ArrowRight, 
  Calendar, 
  User, 
  MapPin, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  X, 
  CheckCircle2, 
  Clock, 
  Send,
  Lock,
  ImageIcon,
  Upload
} from 'lucide-react';

export interface ArticleItem {
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
  imageUrl?: string;
}

const DEFAULT_ARTICLES: ArticleItem[] = [
  {
    id: 'art-1',
    title: 'YASMIN Dampingi Pemulangan dan Pemulihan Hak 14 PMI Korban TPPO dari Jalur Transit Perbatasan',
    slug: 'pemulangan-14-pmi-korban-tppo',
    category: 'Siaran Pers Resmi',
    locationTag: 'Jakarta & Entikong',
    dispatchNo: 'SP-YSM/2026/03-01',
    imageUrl: '/images/imigran.jpg',
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
    imageUrl: '/images/imigran.jpg',
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
    imageUrl: '/images/imigran.jpg',
    excerpt: 'Tingginya angka penelantaran anak buah kapal (ABK) dan penahanan upah di perairan internasional menuntut harmonisasi izin manning agency dan jaminan asuransi kecelakaan berstandar ILO.',
    content: `JAKARTA — Tim Riset Kebijakan YASMIN resmi menerbitkan lembar rekomendasi kepada Kementerian Ketenagakerjaan dan Badan Pelindungan Pekerja Migran Indonesia (BP2MI) terkait maraknya kasus sengketa upah ABK migran.

Berdasarkan kompilasi aduan sepanjang 2025, lebih dari 65% kasus ABK terjadi karena kontrak kerja ganda (double contracts) yang disodorkan manning agency tidak berizin resmi.

YASMIN mendorong dibentuknya basis data digital terpadu bagi pelaut perikanan dan penegakan sanksi pencabutan izin bagi agen yang melanggar standar keselamatan kerja di laut lepas.`,
    author: 'Redaksi Riset & Kebijakan Publik',
    publishedAt: '2026-02-15',
  }
];

export default function ArticlesSection({ articles = DEFAULT_ARTICLES }: { articles?: ArticleItem[] }) {
  const [items, setItems] = useState<ArticleItem[]>(articles);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  // State Modal Update / Tambah Berita Baru
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Siaran Pers Resmi',
    locationTag: 'Jakarta',
    author: 'Biro Advokasi YASMIN',
    imageUrl: '/images/imigran.jpg',
    excerpt: '',
    content: '',
  });

  const categories = [
    'Siaran Pers Resmi',
    'Advokasi Kasus',
    'Kabar Komunitas',
    'Kajian Regulasi',
    'Edukasi Hak PMI',
  ];

  // Refresh data berita dari API
  const refreshArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      }
    } catch (e) {
      console.error('Gagal memperbarui berita:', e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Tampilkan preview instan
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, imageUrl: previewUrl }));

    setUploadingImage(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (res.ok && result.url) {
        setFormData((prev) => ({ ...prev, imageUrl: result.url }));
      } else {
        alert(result.error || 'Gagal mengunggah gambar');
      }
    } catch {
      alert('Koneksi upload gambar gagal');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'Siaran Pers Resmi',
      locationTag: 'Jakarta',
      author: 'Biro Advokasi YASMIN',
      imageUrl: '/images/imigran.jpg',
      excerpt: '',
      content: '',
    });
    setFormMessage(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (art: ArticleItem) => {
    setEditingId(art.id);
    setFormData({
      title: art.title,
      category: art.category,
      locationTag: art.locationTag || 'Jakarta',
      author: art.author,
      imageUrl: art.imageUrl || '/images/imigran.jpg',
      excerpt: art.excerpt,
      content: art.content || art.excerpt,
    });
    setFormMessage(null);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus berita: "${title}"?`)) return;
    try {
      const res = await fetch(`/api/articles?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setItems(items.filter((item) => item.id !== id));
      } else {
        alert('Gagal menghapus berita');
      }
    } catch {
      alert('Koneksi ke server gagal');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormMessage(null);

    try {
      const payload = {
        ...(editingId ? { id: editingId } : {}),
        ...formData,
      };

      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setFormMessage('Berita berhasil dipublikasikan ke beranda!');
        setTimeout(() => {
          setIsEditorOpen(false);
          refreshArticles();
        }, 1200);
      } else {
        setFormMessage(data.error || 'Gagal menyimpan berita');
      }
    } catch {
      setFormMessage('Koneksi server gagal');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <section id="berita-terupdate" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Seksi Berita Terupdate */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-brand-blue-900 text-xs font-bold border border-blue-200">
              <Newspaper className="w-3.5 h-3.5 text-brand-blue-800" />
              <span>Pusat Berita Terupdate YASMIN</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Warta Advokasi & Siaran Pers Terkini
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Kanal resmi pembaruan kasus lapangan, rekomendasi kebijakan perlindungan migran, dan agenda paralegal komunitas.
            </p>
          </div>

          {/* Tombol Tempat Update Berita Langsung di Beranda */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            <button
              onClick={handleOpenNew}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Update / Tulis Berita Baru</span>
            </button>

            <Link
              href="/admin/login"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Portal Admin CMS</span>
            </Link>
          </div>
        </div>

        {/* Grid Kartu Berita Terupdate */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((art) => (
            <article
              key={art.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/60 transition-all flex flex-col justify-between overflow-hidden group"
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
                <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-800 transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                  {art.excerpt}
                </p>
              </div>

              {/* Footer Penulis & Aksi Manajemen */}
              <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium truncate max-w-[130px]">
                  {art.author}
                </span>

                <div className="flex items-center gap-2">
                  {/* Aksi Edit Langsung */}
                  <button
                    onClick={() => handleOpenEdit(art)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    title="Edit Berita Ini"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Aksi Hapus */}
                  <button
                    onClick={() => handleDelete(art.id, art.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                    title="Hapus Berita"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setSelectedArticle(art)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-900 ml-1"
                  >
                    <span>Baca</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* MODAL TEMPAT UPDATE / TULIS BERITA BARU (LANGSUNG DI BERANDA) */}
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {editingId ? 'Edit Berita Beranda' : 'Update & Tulis Berita Baru di Beranda'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Berita yang disimpan akan langsung terbit di halaman beranda YASMIN.
                  </p>
                </div>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formMessage && (
                <div className={`p-3 rounded-xl text-xs font-bold ${
                  formMessage.includes('berhasil')
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {formMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Judul Siaran Pers / Berita *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: YASMIN Kawal Pemenuhan Hak Gaji 12 ABK di Pelabuhan Benoa"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Kategori *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Lokasi / Posko
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Jakarta / Indramayu"
                      value={formData.locationTag}
                      onChange={(e) => setFormData({ ...formData, locationTag: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Penulis / Divisi
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Biro Advokasi Kasus"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Input Foto / Gambar Berita */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-700" />
                      <span>Foto / Gambar Utama Berita</span>
                    </label>
                    {uploadingImage && (
                      <span className="text-[11px] text-emerald-700 font-semibold animate-pulse">
                        Mengunggah gambar...
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {/* Pratinjau Thumbnail */}
                    <div className="w-28 h-20 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 flex-shrink-0 flex items-center justify-center relative shadow-sm">
                      {formData.imageUrl ? (
                        <img
                          src={formData.imageUrl}
                          alt="Pratinjau"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      {/* Tombol Upload File dari Komputer */}
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto dari Komputer</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[11px] text-slate-400 font-medium">atau ketik tautan/path:</span>
                      </div>

                      {/* Input URL Gambar */}
                      <input
                        type="text"
                        placeholder="Contoh: /images/imigran.jpg atau https://..."
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Ringkasan Singkat (Muncul di Kartu Beranda) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Ringkasan 1-2 kalimat mengenai pokok berita..."
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Isi Lengkap Berita / Siaran Pers *
                  </label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Tuliskan isi kronologi, pernyataan resmi, dan tuntutan hukum lengkap di sini..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{formSubmitting ? 'Menerbitkan...' : 'Publikasikan ke Beranda'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL BACA SIARAN PERS LENGKAP */}
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

              {/* Gambar Berita di Modal Baca */}
              {selectedArticle.imageUrl && (
                <div className="relative h-60 w-full rounded-2xl overflow-hidden shadow-sm bg-slate-100">
                  <img
                    src={selectedArticle.imageUrl}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                  {selectedArticle.locationTag && (
                    <div className="absolute bottom-3 left-3 text-xs font-bold text-white px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur-sm shadow flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{selectedArticle.locationTag}</span>
                    </div>
                  )}
                </div>
              )}

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


