'use client';

import React, { useState } from 'react';
import { 
  Send, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Copy, 
  FileText, 
  PhoneCall, 
  Lock, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface BranchOption {
  id: string;
  name: string;
  city: string;
}

export default function ComplaintSection({ branches = [] }: { branches?: BranchOption[] }) {
  const [activeTab, setActiveTab] = useState<'form' | 'track'>('form');

  // State Form Baru
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formData, setFormData] = useState({
    complainantName: '',
    contact: '',
    email: '',
    workerLocation: '',
    category: 'Gaji Tidak Dibayar',
    branchId: '',
    chronology: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // State Pelacakan Tiket
  const [ticketInput, setTicketInput] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  const categories = [
    'Gaji Tidak Dibayar / Ditahan',
    'Kekerasan Fisik / Psikis Majikan',
    'Penipuan Penempatan / TPPO (Perdagangan Orang)',
    'Pemotongan Upah Berlebih (Overcharging)',
    'Dokumen / Paspor Ditahan Agen atau Majikan',
    'Kecelakaan Kerja & Klaim Asuransi',
    'Pemulangan Jenazah / PMI Sakit',
    'Lainnya',
  ];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          isAnonymous,
          complainantName: isAnonymous ? 'Anonim' : formData.complainantName,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitSuccess(data.ticketCode);
        setFormData({
          complainantName: '',
          contact: '',
          email: '',
          workerLocation: '',
          category: 'Gaji Tidak Dibayar',
          branchId: '',
          chronology: '',
        });
      } else {
        alert(data.error || 'Terjadi kesalahan');
      }
    } catch (err) {
      alert('Gagal mengirimkan pengaduan. Pastikan koneksi server aktif.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackTicket = async (codeToSearch?: string) => {
    const code = (codeToSearch || ticketInput).trim();
    if (!code) return;
    setIsTracking(true);
    setTrackingError(null);
    setTrackingResult(null);

    try {
      const res = await fetch(`/api/complaints?ticket=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (res.ok) {
        setTrackingResult(data);
      } else {
        setTrackingError(data.error || 'Tiket tidak ditemukan');
      }
    } catch (err) {
      setTrackingError('Gagal menghubungkan ke server pelacakan.');
    } finally {
      setIsTracking(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Kode tiket ${text} berhasil disalin ke clipboard!`);
  };

  return (
    <section id="pengaduan" className="py-20 bg-slate-50 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Kerahasiaan Terjamin & Bebas Biaya</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Layanan Pengaduan Kasus Buruh Migran
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Sampaikan pengaduan hukum Anda atau lacak perkembangan kasus yang sedang didampingi secara transparan dengan kode tiket unik.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-white p-1.5 shadow-sm border border-slate-200 max-w-md mx-auto mb-8">
          <button
            onClick={() => {
              setActiveTab('form');
              setSubmitSuccess(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'form'
                ? 'bg-brand-green-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Formulir Aduan Baru</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'track'
                ? 'bg-brand-blue-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Lacak Status Tiket</span>
          </button>
        </div>

        {/* TAB 1: FORM PENGADUAN BARU */}
        {activeTab === 'form' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80">
            {submitSuccess ? (
              <div className="text-center py-8 space-y-5">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Laporan Pengaduan Berhasil Dikirim!
                </h3>
                <p className="text-sm text-slate-600 max-w-lg mx-auto">
                  Terima kasih atas laporan Anda. Tim advokasi YASMIN akan segera meneliti kronologi kasus dan menghubungi Anda melalui kontak yang diberikan.
                </p>

                <div className="p-4 bg-slate-50 border-2 border-dashed border-emerald-500 rounded-2xl max-w-sm mx-auto space-y-2">
                  <span className="text-xs text-slate-500 font-medium block">
                    KODE TIKET PELACAKAN ANDA:
                  </span>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl font-black tracking-wider text-emerald-700 font-mono">
                      {submitSuccess}
                    </span>
                    <button
                      onClick={() => copyToClipboard(submitSuccess)}
                      className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
                      title="Salin Kode Tiket"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    *Simpan kode tiket ini untuk mengecek status tindak lanjut aduan Anda kapan saja.
                  </p>
                </div>

                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setTicketInput(submitSuccess);
                      setActiveTab('track');
                      handleTrackTicket(submitSuccess);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-brand-blue-900 hover:bg-brand-blue-950 text-white font-bold text-xs"
                  >
                    Lihat Status Tiket Sekarang
                  </button>
                  <button
                    onClick={() => setSubmitSuccess(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Kirim Aduan Lain
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Anonymous Protection Switcher */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="anonymousCheck"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <label htmlFor="anonymousCheck" className="text-sm font-bold text-slate-800 cursor-pointer">
                      Rahasiakan Identitas Saya (Lapor Sebagai Anonim)
                    </label>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Centang opsi ini jika Anda merasa terancam atau ingin nama Anda disamarkan di seluruh sistem pelaporan kami.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Nama Pelapor */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Nama Lengkap Pelapor / Korban {!isAnonymous && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      disabled={isAnonymous}
                      required={!isAnonymous}
                      placeholder={isAnonymous ? 'Disamarkan (Anonim)' : 'Contoh: Siti Rahmawati'}
                      value={formData.complainantName}
                      onChange={(e) => setFormData({ ...formData, complainantName: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                    />
                  </div>

                  {/* Nomor WhatsApp Kontak */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Nomor WhatsApp / Kontak Aktif <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Lokasi / Negara Penempatan */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Negara Penempatan / Daerah Asal <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Malaysia, Taiwan, Arab Saudi, atau Kab. Indramayu"
                      value={formData.workerLocation}
                      onChange={(e) => setFormData({ ...formData, workerLocation: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  {/* Kategori Permasalahan */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Kategori Permasalahan <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pilih Helpdesk Terdekat jika ada */}
                {branches.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Pilih Kantor Helpdesk Terdekat / Tujuan (Opsional)
                    </label>
                    <select
                      value={formData.branchId}
                      onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="">-- Diteruskan ke Sekretariat Pusat --</option>
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Kronologi Masalah */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Kronologi Kejadian / Deskripsi Masalah <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Ceritakan secara singkat kronologi peristiwa: sejak kapan bekerja, nama majikan/agen jika tahu, hak apa yang dirugikan, dan bantuan apa yang Anda butuhkan..."
                    value={formData.chronology}
                    onChange={(e) => setFormData({ ...formData, chronology: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  ></textarea>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    🔒 Laporan Anda dienkripsi dan hanya dapat diakses oleh tim advokasi YASMIN.
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Mengirim Laporan...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Kirim Laporan Pengaduan</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: LACAK STATUS TIKET PENGADUAN */}
        {activeTab === 'track' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8">
            <div className="max-w-xl mx-auto text-center space-y-4">
              <h3 className="text-xl font-bold text-slate-900">
                Lacak Status Kasus Pengaduan
              </h3>
              <p className="text-xs text-slate-600">
                Masukkan kode tiket pengaduan yang Anda peroleh saat mendaftar untuk melihat perkembangan pendampingan hukum.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Contoh: YSM-2026-A109"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-2.5 text-sm font-mono font-bold tracking-wide uppercase rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue-800 bg-slate-50 focus:bg-white"
                />
                <button
                  onClick={() => handleTrackTicket()}
                  disabled={isTracking || !ticketInput}
                  className="px-6 py-2.5 rounded-xl bg-brand-blue-900 hover:bg-brand-blue-950 text-white font-bold text-xs disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isTracking ? 'Melacak...' : 'Lacak Kasus'}
                </button>
              </div>

              {/* Demo Quick Chips */}
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
                <span>Coba kode contoh:</span>
                <button
                  type="button"
                  onClick={() => {
                    setTicketInput('YSM-2026-A109');
                    handleTrackTicket('YSM-2026-A109');
                  }}
                  className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100"
                >
                  YSM-2026-A109
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTicketInput('YSM-2026-B220');
                    handleTrackTicket('YSM-2026-B220');
                  }}
                  className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 hover:bg-blue-100"
                >
                  YSM-2026-B220
                </button>
              </div>
            </div>

            {/* Tracking Error */}
            {trackingError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-center max-w-xl mx-auto text-xs text-red-700">
                {trackingError}
              </div>
            )}

            {/* Tracking Result Card */}
            {trackingResult && (
              <div className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-slate-50 space-y-6 max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Nomor Tiket:</span>
                    <span className="text-xl font-black font-mono text-brand-blue-950 block">
                      {trackingResult.ticketCode}
                    </span>
                  </div>
                  <div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                      trackingResult.status === 'SELESAI'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : trackingResult.status === 'MEDIASI_HUKUM'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : trackingResult.status === 'SEDANG_DITANGANI'
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-slate-200 text-slate-800 border-slate-300'
                    }`}>
                      Status: {trackingResult.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Info Rincian */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block font-medium">Nama Pelapor:</span>
                    <span className="font-bold text-slate-800">{trackingResult.complainantName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Lokasi Kerja / Penempatan:</span>
                    <span className="font-bold text-slate-800">{trackingResult.workerLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Kategori Kasus:</span>
                    <span className="font-bold text-slate-800">{trackingResult.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Kantor Penanggung Jawab:</span>
                    <span className="font-bold text-slate-800">
                      {trackingResult.branch ? trackingResult.branch.name : 'Sekretariat Nasional Pusat'}
                    </span>
                  </div>
                </div>

                {/* Catatan Advokasi */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Catatan Resmi Tim Pendamping YASMIN:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {trackingResult.adminNotes || 'Belum ada catatan baru dari tim hukum.'}
                  </p>
                </div>

                {/* WhatsApp Helpdesk Action */}
                {trackingResult.branch && trackingResult.branch.hotline && (
                  <div className="pt-2 text-center">
                    <a
                      href={`https://wa.me/62${trackingResult.branch.hotline.replace(/^0/, '')}?text=Halo%20YASMIN%2C%20saya%20ingin%20menanyakan%20perkembangan%20tiket%20${trackingResult.ticketCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-xl transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Hubungi Hotline Penangan Kasus ({trackingResult.branch.hotline})</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
