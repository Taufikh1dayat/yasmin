'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Search, 
  Phone, 
  MapPin, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  X, 
  Send,
  ExternalLink,
  Globe2
} from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  region: string;
  province: string;
  city: string;
  address: string;
  phone: string | null;
  hotline: string;
  email: string;
  lat: number;
  lng: number;
  isActive: boolean;
  createdAt: string;
}

const REGIONS = [
  'Sumatera',
  'Jawa',
  'Bali-Nusa Tenggara',
  'Kalimantan',
  'Sulawesi',
];

export default function AdminCabangPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('Semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    region: 'Jawa',
    province: '',
    city: '',
    address: '',
    phone: '',
    hotline: '',
    email: '',
    lat: -6.200000,
    lng: 106.816666,
    isActive: true,
  });

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/branches?all=true');
      if (res.ok) {
        const data = await res.json();
        setBranches(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Gagal memuat cabang:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      region: 'Jawa',
      province: 'Jawa Tengah',
      city: 'Cilacap',
      address: '',
      phone: '',
      hotline: '0811-9876-5431',
      email: 'posko@yasmin.or.id',
      lat: -7.3756,
      lng: 108.7612,
      isActive: true,
    });
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (branch: Branch) => {
    setEditingId(branch.id);
    setFormData({
      name: branch.name,
      region: branch.region,
      province: branch.province,
      city: branch.city,
      address: branch.address,
      phone: branch.phone || '',
      hotline: branch.hotline,
      email: branch.email,
      lat: branch.lat,
      lng: branch.lng,
      isActive: branch.isActive,
    });
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (branch: Branch) => {
    try {
      const res = await fetch('/api/branches', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: branch.id,
          isActive: !branch.isActive,
        }),
      });
      if (res.ok) {
        setBranches(
          branches.map((b) => (b.id === branch.id ? { ...b, isActive: !b.isActive } : b))
        );
      }
    } catch (e) {
      console.error('Gagal mengubah status aktif posko:', e);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus posko cabang helpdesk: "${name}"?`)) return;

    try {
      const res = await fetch(`/api/branches?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBranches(branches.filter((b) => b.id !== id));
      } else {
        alert('Gagal menghapus posko helpdesk');
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

      const res = await fetch('/api/branches', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage(
          editingId ? 'Data posko berhasil diperbarui.' : 'Posko helpdesk baru berhasil ditambahkan.'
        );
        fetchBranches();
        setTimeout(() => {
          setIsModalOpen(false);
        }, 1200);
      } else {
        setStatusMessage(data.error || 'Gagal menyimpan data posko');
      }
    } catch {
      setStatusMessage('Koneksi server gagal');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Filter posko
  const filtered = branches.filter((b) => {
    const matchRegion = regionFilter === 'Semua' || b.region === regionFilter;
    const q = search.toLowerCase();
    const matchSearch =
      b.name.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q) ||
      b.province.toLowerCase().includes(q) ||
      b.address.toLowerCase().includes(q) ||
      b.hotline.toLowerCase().includes(q);

    return matchRegion && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-emerald-700" />
            <span>Manajemen Kantor & Posko Helpdesk</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fase 4: Kelola 11 Posko Bantuan Hukum Daerah, koordinat GPS peta interaktif, status siaga, dan kontak darurat.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Posko Baru</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['Semua', ...REGIONS].map((reg) => {
            const count =
              reg === 'Semua'
                ? branches.length
                : branches.filter((b) => b.region === reg).length;

            return (
              <button
                key={reg}
                onClick={() => setRegionFilter(reg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  regionFilter === reg
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{reg}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    regionFilter === reg
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
            placeholder="Cari posko, kota, provinsi, alamat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Tabel Posko Cabang */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Nama Posko & Wilayah</th>
                <th className="px-5 py-3.5">Kota / Provinsi</th>
                <th className="px-5 py-3.5">Alamat Kantor</th>
                <th className="px-5 py-3.5">Hotline WhatsApp</th>
                <th className="px-5 py-3.5">Koordinat GPS</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                    Memuat daftar posko helpdesk...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                    Tidak ada kantor posko yang sesuai kriteria.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 max-w-xs">
                      <div className="font-bold text-slate-900 leading-snug">{b.name}</div>
                      <span className="inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        {b.region}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{b.city}</div>
                      <div className="text-[11px] text-slate-500">{b.province}</div>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs text-slate-600 leading-relaxed text-[11px]">
                      {b.address}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{b.hotline}</span>
                      </div>
                      <a
                        href={`https://wa.me/${b.hotline.replace(/^0/, '62').replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-emerald-700 hover:underline inline-flex items-center gap-1 mt-0.5"
                      >
                        <span>Uji Chat WA</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[11px] text-slate-500">
                      {b.lat.toFixed(4)}, {b.lng.toFixed(4)}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(b)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border transition-colors ${
                          b.isActive
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                        }`}
                        title="Klik untuk ubah status aktif/non-aktif"
                      >
                        {b.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>Siaga Aktif</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Non-Aktif</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          title="Edit Data Posko"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id, b.name)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          title="Hapus Posko"
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

      {/* Modal Tambah / Edit Posko */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {editingId ? 'Edit Data Posko Helpdesk' : 'Tambah Posko Helpdesk Baru'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Posko yang aktif akan muncul di peta interaktif dan formulir rujukan pengaduan.
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
                  Nama Posko / Cabang Helpdesk *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Posko Bantuan Hukum YASMIN Cilacap (Sekretariat Nasional)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Zona Wilayah *
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-semibold"
                  >
                    {REGIONS.map((reg) => (
                      <option key={reg} value={reg}>
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Provinsi *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jawa Tengah"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kota / Kabupaten *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Cilacap"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Alamat Lengkap Kantor Posko *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Contoh: Jalan Marta Atmaja, Kecamatan Majenang, Kabupaten Cilacap, Jawa Tengah"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nomor WhatsApp Hotline Darurat *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 0811-9876-5431"
                    value={formData.hotline}
                    onChange={(e) => setFormData({ ...formData, hotline: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Resmi Posko *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Contoh: studi.migran@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Koordinat Latitude (Peta) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="-7.3756"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Koordinat Longitude (Peta) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="108.7612"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500 border-slate-300"
                />
                <label htmlFor="isActiveToggle" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Posko Siaga Aktif (Ditampilkan pada peta interaktif publik)
                </label>
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
                  <span>{formSubmitting ? 'Menyimpan...' : 'Simpan Posko'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
