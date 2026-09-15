'use client';

import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Search, 
  Upload, 
  ImageIcon, 
  X, 
  Send,
  Calendar,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
}

export default function AdminBeritaPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Siaran Pers Resmi',
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

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/articles');
      if (res.ok) {
        const data = await res.json();
        setArticles(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Gagal memuat berita:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'Siaran Pers Resmi',
      author: 'Biro Advokasi YASMIN',
      imageUrl: '/images/imigran.jpg',
      excerpt: '',
      content: '',
    });
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (art: Article) => {
    setEditingId(art.id);
    setFormData({
      title: art.title,
      category: art.category,
      author: art.author,
      imageUrl: art.imageUrl || '/images/imigran.jpg',
      excerpt: art.excerpt,
      content: art.content || art.excerpt,
    });
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm('Hapus berita: ' + title + '?')) return;
    try {
      const res = await fetch('/api/articles?id=' + encodeURIComponent(id), {
        method: 'DELETE',
      });
      if (res.ok) {
        setArticles((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert('Gagal menghapus berita');
      }
    } catch {
      alert('Koneksi server gagal');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setStatusMessage(null);

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
        setStatusMessage('Berita berhasil disimpan!');
        setTimeout(() => {
          setIsModalOpen(false);
          fetchArticles();
        }, 1000);
      } else {
        setStatusMessage(data.error || 'Gagal menyimpan berita');
      }
    } catch {
      setStatusMessage('Koneksi server gagal');
    } finally {
      setFormSubmitting(false);
    }
  };

  const filtered = articles.filter((art) => {
    const matchCat = categoryFilter === 'Semua' || art.category === categoryFilter;
    const matchSearch = art.title.toLowerCase().includes(search.toLowerCase()) ||
                        art.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manajemen Warta & Berita
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola publikasi siaran pers, catatan kasus advokasi, dan unggah foto dokumentasi kegiatan.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tulis Berita Baru</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['Semua', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={'px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ' + (
                categoryFilter === cat
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul berita..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Table Berita */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Foto</th>
                <th className="px-5 py-3.5">Judul & Ringkasan</th>
                <th className="px-5 py-3.5">Kategori</th>
                <th className="px-5 py-3.5">Penulis</th>
                <th className="px-5 py-3.5">Tanggal</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    Memuat data berita...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    Tidak ada berita ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3">
                      <div className="w-14 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center">
                        {art.imageUrl ? (
                          <img
                            src={art.imageUrl}
                            alt={art.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 max-w-xs sm:max-w-md">
                      <div className="font-bold text-slate-900 line-clamp-1">{art.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{art.excerpt}</div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {art.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                      {art.author}
                    </td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(art.publishedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(art)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          title="Edit Berita"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(art.id, art.title)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          title="Hapus Berita"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah/Edit Berita dengan Input Gambar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {editingId ? 'Edit Berita' : 'Tulis Berita Baru'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Berita yang disimpan akan langsung diperbarui di portal publik YASMIN.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusMessage && (
              <div className={'p-3 rounded-xl text-xs font-bold ' + (
                statusMessage.includes('berhasil')
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              )}>
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Judul Berita / Siaran Pers *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: YASMIN Kawal Pemulihan Hak 14 PMI Korban TPPO"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    Penulis / Divisi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Biro Advokasi YASMIN"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Input Foto / Gambar Berita di Halaman Admin */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
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

                    <input
                      type="text"
                      placeholder="Contoh: /images/imigran.jpg atau tautan https://..."
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ringkasan Singkat (Excerpt) *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Ringkasan 1-2 kalimat untuk preview di kartu beranda..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Isi Lengkap Berita *
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Tuliskan isi rilis lengkap, kronologi advokasi, atau sikap organisasi di sini..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                  <span>{formSubmitting ? 'Menyimpan...' : 'Simpan Berita'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
