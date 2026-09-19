'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Search, 
  Download, 
  ExternalLink, 
  X, 
  Send,
  Calendar,
  BookOpen,
  Filter
} from 'lucide-react';
import Link from 'next/link';

interface Publication {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: number;
  author: string;
  description: string;
  fileUrl: string;
  coverImage: string;
  downloadCount: number;
  createdAt: string;
}

const CATEGORIES = [
  'Laporan Tahunan',
  'Kertas Kebijakan',
  'Panduan Advokasi',
  'Riset & Studi',
  'Amicus Curiae',
];

export default function AdminPublikasiPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Laporan Tahunan',
    year: new Date().getFullYear(),
    author: 'Tim Riset & Advokasi YASMIN',
    description: '',
    fileUrl: '/docs/sample-publication.pdf',
    coverImage: '/images/pub-cover-default.jpg',
  });

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/publications');
      if (res.ok) {
        const data = await res.json();
        setPublications(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Gagal memuat publikasi:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'Laporan Tahunan',
      year: new Date().getFullYear(),
      author: 'Tim Riset & Advokasi YASMIN',
      description: '',
      fileUrl: '/docs/sample-publication.pdf',
      coverImage: '/images/pub-cover-default.jpg',
    });
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pub: Publication) => {
    setEditingId(pub.id);
    setFormData({
      title: pub.title,
      category: pub.category,
      year: pub.year,
      author: pub.author,
      description: pub.description,
      fileUrl: pub.fileUrl || '/docs/sample-publication.pdf',
      coverImage: pub.coverImage || '/images/pub-cover-default.jpg',
    });
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus berkas dokumen publikasi: "${title}"?`)) return;

    try {
      const res = await fetch(`/api/publications?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPublications(publications.filter((p) => p.id !== id));
      } else {
        alert('Gagal menghapus berkas publikasi');
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

      const res = await fetch('/api/publications', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage(
          editingId ? 'Dokumen publikasi berhasil diperbarui.' : 'Publikasi baru berhasil diterbitkan.'
        );
        fetchPublications();
        setTimeout(() => {
          setIsModalOpen(false);
        }, 1200);
      } else {
        setStatusMessage(data.error || 'Gagal menyimpan publikasi');
      }
    } catch {
      setStatusMessage('Koneksi server gagal');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Filter publikasi
  const filtered = publications.filter((p) => {
    const matchCategory = categoryFilter === 'Semua' || p.category === categoryFilter;
    const q = search.toLowerCase();
    const matchSearch =
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q);

    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-emerald-700" />
            <span>Katalog Publikasi & Riset Kebijakan</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fase 4: Kelola berkas laporan tahunan CATAHU, kertas kebijakan publik, modul advokasi hukum, dan studi migrasi ketenagakerjaan.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Publikasi Baru</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['Semua', ...CATEGORIES].map((cat) => {
            const count =
              cat === 'Semua'
                ? publications.length
                : publications.filter((p) => p.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  categoryFilter === cat
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    categoryFilter === cat
                      ? 'bg-emerald-800 text-emerald-200'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul, penulis, deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Tabel Publikasi */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Dokumen Publikasi</th>
                <th className="px-5 py-3.5">Kategori</th>
                <th className="px-5 py-3.5">Tahun</th>
                <th className="px-5 py-3.5">Penulis / Divisi</th>
                <th className="px-5 py-3.5">Unduhan</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    Memuat daftar publikasi...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    Tidak ada dokumen publikasi yang sesuai kriteria.
                  </td>
                </tr>
              ) : (
                filtered.map((pub) => (
                  <tr key={pub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 max-w-sm sm:max-w-md">
                      <div className="font-bold text-slate-900 leading-snug">{pub.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {pub.description}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {pub.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-slate-600 font-bold">
                      {pub.year}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 whitespace-nowrap">
                      {pub.author}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 font-mono">
                      {pub.downloadCount} kali
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(pub)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          title="Edit Dokumen"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pub.id, pub.title)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          title="Hapus Dokumen"
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

      {/* Modal Tambah / Edit Publikasi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {editingId ? 'Edit Dokumen Publikasi' : 'Tambah Publikasi Baru'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publikasi yang tersimpan akan tampil pada katalog publik YASMIN.
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
              <div
                className={`p-3 rounded-xl text-xs font-bold ${
                  statusMessage.includes('berhasil')
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Judul Dokumen / Publikasi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Laporan Catatan Tahunan 2025: Potret Kerentanan PMI"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kategori Dokumen *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Tahun Penerbitan *
                  </label>
                  <input
                    type="number"
                    required
                    min={2000}
                    max={2035}
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value, 10) || new Date().getFullYear() })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Penulis / Tim Penyusun *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Divisi Riset & Dokumentasi Data YASMIN"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tautan File Dokumen (PDF) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: /docs/catahu-2025.pdf atau https://..."
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ringkasan Eksekutif / Deskripsi Dokumen *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Jelaskan ringkasan pokok temuan penelitian, metodologi, dan tujuan rilis dokumen..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  <span>{formSubmitting ? 'Menyimpan...' : 'Simpan Dokumen'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
