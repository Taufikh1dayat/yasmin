'use client';

import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Scale, 
  Building2, 
  Phone, 
  Mail, 
  User, 
  MapPin, 
  X, 
  Send, 
  Edit3, 
  Trash2,
  ExternalLink,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  city: string;
  province?: string;
}

interface Complaint {
  id: string;
  ticketCode: string;
  complainantName: string;
  isAnonymous: boolean;
  contact: string;
  email: string | null;
  workerLocation: string;
  category: string;
  chronology: string;
  evidenceUrl: string | null;
  status: string;
  adminNotes: string | null;
  branchId: string | null;
  branch?: Branch | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_OPTIONS = [
  { value: 'MENUNGGU_VERIFIKASI', label: 'Menunggu Verifikasi', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { value: 'SEDANG_DITANGANI', label: 'Sedang Ditangani', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'MEDIASI_HUKUM', label: 'Mediasi Hukum', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'SELESAI', label: 'Selesai', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
];

export default function AdminPengaduanPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [search, setSearch] = useState('');

  // Modal Detail & Update
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');
  const [updateBranchId, setUpdateBranchId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/complaints');
      if (res.ok) {
        const data = await res.json();
        setComplaints(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Gagal mengambil data pengaduan:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await fetch('/api/branches');
      if (res.ok) {
        const data = await res.json();
        setBranches(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Gagal mengambil cabang:', e);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchBranches();
  }, []);

  const handleOpenDetail = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setUpdateStatus(complaint.status);
    setUpdateNotes(complaint.adminNotes || '');
    setUpdateBranchId(complaint.branchId || '');
    setAlertMessage(null);
    setIsModalOpen(true);
  };

  const handleUpdateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setSubmitting(true);
    setAlertMessage(null);

    try {
      const res = await fetch('/api/complaints', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedComplaint.id,
          status: updateStatus,
          adminNotes: updateNotes,
          branchId: updateBranchId || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAlertMessage('Status penanganan kasus berhasil diperbarui.');
        fetchComplaints();
        setTimeout(() => {
          setIsModalOpen(false);
        }, 1200);
      } else {
        setAlertMessage(data.error || 'Gagal memperbarui status pengaduan');
      }
    } catch {
      setAlertMessage('Koneksi server gagal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, ticketCode: string) => {
    if (!confirm(`Hapus pengaduan berkas tiket ${ticketCode}?`)) return;

    try {
      const res = await fetch(`/api/complaints?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setComplaints(complaints.filter((c) => c.id !== id));
      } else {
        alert('Gagal menghapus berkas pengaduan');
      }
    } catch {
      alert('Koneksi server gagal');
    }
  };

  // Filter pengaduan
  const filtered = complaints.filter((c) => {
    const matchStatus = statusFilter === 'Semua' || c.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      c.ticketCode.toLowerCase().includes(q) ||
      c.complainantName.toLowerCase().includes(q) ||
      c.workerLocation.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.contact.toLowerCase().includes(q);

    return matchStatus && matchSearch;
  });

  // Ekspor CSV
  const handleExportCSV = () => {
    if (filtered.length === 0) {
      alert('Tidak ada data yang dapat diekspor.');
      return;
    }

    const headers = ['Kode Tiket', 'Nama Pelapor', 'Kontak WhatsApp', 'Email', 'Lokasi Kerja', 'Kategori Kasus', 'Status', 'Posko Wilayah', 'Catatan Advokasi', 'Tanggal Masuk'];
    const rows = filtered.map((c) => [
      `"${c.ticketCode}"`,
      `"${c.complainantName}"`,
      `"${c.contact}"`,
      `"${c.email || '-'}"`,
      `"${c.workerLocation}"`,
      `"${c.category}"`,
      `"${c.status}"`,
      `"${c.branch?.name || 'Sekretariat Pusat'}"`,
      `"${(c.adminNotes || '').replace(/"/g, '""')}"`,
      `"${new Date(c.createdAt).toLocaleDateString('id-ID')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Kasus_YASMIN_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manajemen Berkas & Pengaduan Kasus
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fase 3: Pantau laporan pengaduan masuk, ubah status penanganan hukum, dan disposisikan ke posko wilayah.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Ekspor Data (CSV)</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['Semua', 'MENUNGGU_VERIFIKASI', 'SEDANG_DITANGANI', 'MEDIASI_HUKUM', 'SELESAI'].map((statusKey) => {
            const label = statusKey === 'Semua' 
              ? 'Semua' 
              : STATUS_OPTIONS.find((s) => s.value === statusKey)?.label || statusKey;
            const count = statusKey === 'Semua' 
              ? complaints.length 
              : complaints.filter((c) => c.status === statusKey).length;

            return (
              <button
                key={statusKey}
                onClick={() => setStatusFilter(statusKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  statusFilter === statusKey
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === statusKey ? 'bg-emerald-800 text-emerald-200' : 'bg-slate-200 text-slate-700'
                }`}>
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
            placeholder="Cari tiket, nama, lokasi, kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Tabel Pengaduan */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Kode Tiket</th>
                <th className="px-5 py-3.5">Pelapor & Kontak</th>
                <th className="px-5 py-3.5">Kategori & Lokasi PMI</th>
                <th className="px-5 py-3.5">Posko Penanganan</th>
                <th className="px-5 py-3.5">Tanggal</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                    Memuat daftar pengaduan dari database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                    Tidak ada berkas pengaduan yang sesuai dengan kriteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const statusInfo = STATUS_OPTIONS.find((s) => s.value === item.status) || {
                    label: item.status,
                    color: 'bg-slate-100 text-slate-700 border-slate-200',
                  };

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-mono font-extrabold text-xs text-brand-blue-900 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                          {item.ticketCode}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{item.complainantName}</span>
                          {item.isAnonymous && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-semibold">
                              Anonim
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{item.contact}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 max-w-xs">
                        <div className="font-semibold text-slate-900">{item.category}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{item.workerLocation}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="text-slate-800 font-medium">
                          {item.branch ? item.branch.name : 'Sekretariat Nasional (Pusat)'}
                        </div>
                        {item.branch && (
                          <div className="text-[10px] text-slate-400">{item.branch.city}</div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDetail(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors flex items-center gap-1"
                            title="Kelola & Tindak Lanjut"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Tindak Lanjut</span>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.ticketCode)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Hapus Berkas"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail & Tindak Lanjut Kasus */}
      {isModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 relative">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-brand-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                    {selectedComplaint.ticketCode}
                  </span>
                  <span className="text-xs text-slate-500">
                    Masuk: {new Date(selectedComplaint.createdAt).toLocaleString('id-ID')}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1.5">
                  Tindak Lanjut Penanganan Kasus
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alert Message */}
            {alertMessage && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                alertMessage.includes('berhasil')
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {alertMessage}
              </div>
            )}

            {/* Identitas Kasus & Pelapor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block">Nama Pelapor:</span>
                <span className="font-bold text-slate-900 text-sm">{selectedComplaint.complainantName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Nomor WhatsApp Pelapor:</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-bold text-slate-900">{selectedComplaint.contact}</span>
                  <a
                    href={`https://wa.me/${selectedComplaint.contact.replace(/^0/, '62').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Halo ${selectedComplaint.complainantName}, kami dari Tim Bantuan Hukum YASMIN terkait pengaduan dengan kode tiket ${selectedComplaint.ticketCode}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                  >
                    <span>Hubungi WA</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <div>
                <span className="text-slate-400 block">Kategori Masalah:</span>
                <span className="font-bold text-slate-900">{selectedComplaint.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Lokasi PMI / Penempatan:</span>
                <span className="font-bold text-slate-900">{selectedComplaint.workerLocation}</span>
              </div>
            </div>

            {/* Kronologi Kejadian */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Kronologi Kejadian (Keterangan Pelapor):
              </label>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                {selectedComplaint.chronology}
              </div>
            </div>

            {/* Form Update Status & Catatan Advokasi */}
            <form onSubmit={handleUpdateComplaint} className="space-y-4 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Perbarui Status Kasus *
                  </label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-bold text-slate-800"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Disposisi Posko Wilayah
                  </label>
                  <select
                    value={updateBranchId}
                    onChange={(e) => setUpdateBranchId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-xs text-slate-700"
                  >
                    <option value="">Sekretariat Nasional (Pusat)</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Catatan Progres Tim Advokat (Terbaca oleh Pelapor saat Lacak Tiket) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tuliskan catatan kemajuan pendampingan, pemanggilan saksi, somasi, atau hasil mediasi di sini..."
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
                <span className="text-[11px] text-slate-400 block mt-1">
                  Catatan ini akan langsung tampil secara transparan pada pelacak tiket online publik.
                </span>
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
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
