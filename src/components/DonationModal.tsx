'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  X, 
  Copy, 
  Check, 
  Building2, 
  QrCode, 
  ShieldCheck, 
  Send,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [
  { label: 'Rp 25.000', value: 25000, desc: 'Transport pendampingan kasus' },
  { label: 'Rp 50.000', value: 50000, desc: 'Bantuan logistik awal PMI' },
  { label: 'Rp 100.000', value: 100000, desc: 'Pemeriksaan medis & trauma' },
  { label: 'Rp 250.000', value: 250000, desc: 'Bantuan hukum & somasi pro bono' },
  { label: 'Rp 500.000', value: 500000, desc: 'Operasional safehouse 3 hari' },
];

const BANK_ACCOUNTS = [
  {
    bank: 'Bank Mandiri',
    accountNumber: '1230098765432',
    formattedNumber: '123-00-9876543-2',
    accountName: 'Yayasan Studi Migran Indonesia',
    branch: 'KC Salemba Jakarta',
  },
  {
    bank: 'BCA (Bank Central Asia)',
    accountNumber: '7310987654',
    formattedNumber: '731-098-7654',
    accountName: 'Yayasan Studi Migran Indonesia',
    branch: 'KCU Matraman Jakarta',
  },
  {
    bank: 'Bank BNI',
    accountNumber: '0891234567',
    formattedNumber: '089-123-4567',
    accountName: 'Yayasan Studi Migran Indonesia',
    branch: 'KC Kramat Raya',
  },
  {
    bank: 'Bank BRI',
    accountNumber: '020601002345508',
    formattedNumber: '0206-01-002345-50-8',
    accountName: 'Yayasan Studi Migran Indonesia',
    branch: 'KC Senen Jakarta',
  },
];

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'transfer' | 'qris' | 'merchandise'>('transfer');
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  // Form konfirmasi donatur
  const [donorName, setDonorName] = useState('');
  const [donorContact, setDonorContact] = useState('');
  const [donorMessage, setDonorMessage] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  if (!isOpen) return null;

  const currentAmountDisplay = customAmount 
    ? `Rp ${parseInt(customAmount || '0', 10).toLocaleString('id-ID')}`
    : selectedAmount 
      ? `Rp ${selectedAmount.toLocaleString('id-ID')}` 
      : 'Rp 0';

  const handleCopy = (bankName: string, number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedBank(bankName);
    setTimeout(() => {
      setCopiedBank(null);
    }, 2000);
  };

  const handleWhatsAppConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const nominal = customAmount || (selectedAmount ? selectedAmount.toString() : '0');
    const text = encodeURIComponent(
      `Halo Tim Keuangan YASMIN,\n\nSaya ingin konfirmasi donasi solidaritas:\n- Nama: ${donorName || 'Hamba Allah (Anonim)'}\n- Kontak: ${donorContact || '-'}\n- Nominal: Rp ${parseInt(nominal, 10).toLocaleString('id-ID')}\n- Pesan/Doa: ${donorMessage || '-'}\n\nMohon informasi verifikasi penerimaan. Terima kasih.`
    );
    window.open(`https://wa.me/6281198765431?text=${text}`, '_blank');
    setSubmittedMessage(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal - Pinned at top with attractive gradient */}
        <div className="relative p-6 pb-5 sm:px-8 sm:pt-7 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 text-white flex items-start justify-between gap-4 flex-shrink-0 overflow-hidden">
          {/* Subtle ambient light glows */}
          <div className="absolute -top-14 -right-14 w-48 h-48 bg-emerald-500/25 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-1.5 pr-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/15 backdrop-blur-sm shadow-sm">
              <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Solidaritas Kemanusiaan</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Donasi Solidaritas Pekerja Migran
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed">
              Dukungan Anda membiayai bantuan hukum pro bono, pemulihan darurat korban TPPO, dan operasional rumah aman YASMIN di berbagai titik perbatasan.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors flex-shrink-0 mt-0.5 relative z-10 backdrop-blur-sm"
            aria-label="Tutup Dialog Donasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto modal-scroll space-y-6">
          {/* Pilihan Nominal Donasi */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Pilih Nominal Donasi Solidaritas
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_AMOUNTS.map((item) => {
                const isSelected = selectedAmount === item.value && !customAmount;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(item.value);
                      setCustomAmount('');
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 border-transparent text-white shadow-md shadow-emerald-900/20 ring-2 ring-emerald-500/50 scale-[1.02]'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>{item.label}</div>
                    <div className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? 'text-emerald-100 font-medium' : 'text-slate-500'}`}>{item.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Input Nominal Lain */}
            <div className="pt-1">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-800">
                  Rp
                </span>
                <input
                  type="number"
                  min="10000"
                  step="5000"
                  placeholder="Nominal lainnya (misal: 150000)"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
                />
              </div>
            </div>

            {/* Display Nominal Terpilih dengan Gradasi Halus */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-amber-50/40 border border-emerald-200/80 flex items-center justify-between shadow-xs">
              <span className="text-xs font-bold text-slate-700">Nominal Disalurkan:</span>
              <span className="text-base sm:text-lg font-black bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 bg-clip-text text-transparent">
                {currentAmountDisplay}
              </span>
            </div>
          </div>

          {/* Tab Metode Pembayaran */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              2. Rekening Resmi & Kanal Penyaluran
            </label>

            <div className="flex flex-wrap rounded-xl bg-slate-100 p-1 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('transfer')}
                className={`flex-1 min-w-[110px] py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'transfer'
                    ? 'bg-white text-emerald-950 shadow-sm border border-slate-200/50'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className={`w-3.5 h-3.5 ${activeTab === 'transfer' ? 'text-emerald-700' : 'text-slate-500'}`} />
                <span>Transfer Bank</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('qris')}
                className={`flex-1 min-w-[110px] py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'qris'
                    ? 'bg-white text-emerald-950 shadow-sm border border-slate-200/50'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <QrCode className={`w-3.5 h-3.5 ${activeTab === 'qris' ? 'text-emerald-700' : 'text-slate-500'}`} />
                <span>QRIS Instan</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('merchandise')}
                className={`flex-1 min-w-[140px] py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'merchandise'
                    ? 'bg-white text-emerald-950 shadow-sm border border-slate-200/50'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className={`w-3.5 h-3.5 ${activeTab === 'merchandise' ? 'text-emerald-700' : 'text-slate-500'}`} />
                <span>Merchandise Komunitas</span>
              </button>
            </div>

            {activeTab === 'transfer' && (
              <div className="space-y-2.5">
                {BANK_ACCOUNTS.map((acc) => {
                  const isCopied = copiedBank === acc.bank;
                  return (
                    <div
                      key={acc.bank}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3"
                    >
                      <div>
                        <span className="text-[11px] font-bold text-slate-900 block">
                          {acc.bank}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-800 tracking-wider">
                          {acc.formattedNumber}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          a.n. {acc.accountName}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(acc.bank, acc.accountNumber)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          isCopied
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                        title="Salin Nomor Rekening"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'qris' && (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-4">
                <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border border-slate-300 shadow-sm flex flex-col items-center justify-center">
                  <QrCode className="w-36 h-36 text-slate-800" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    QRIS YASMIN
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-800">
                    NMID: ID1020349812739
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Dapat dipindai menggunakan BCA Mobile, Livin Mandiri, BRImo, BNI Mobile, GoPay, OVO, Dana, mau pun ShopeePay.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'merchandise' && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-900 leading-relaxed">
                  <strong>Dukungan Merchandise:</strong> 100% hasil penjualan produk karya komunitas purna migran dan merchandise resmi YASMIN dialokasikan untuk membiayai operasional bantuan hukum dan pendampingan buruh migran.
                </div>

                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Kopi Robusta Komunitas Purna Migran Majenang</h4>
                      <p className="text-[10px] text-slate-500">Kopi petik merah hasil budidaya kelompok tani purna migran Cilacap (250gr)</p>
                      <span className="text-xs font-extrabold text-emerald-800">Rp 45.000</span>
                    </div>
                    <a
                      href="https://wa.me/6281198765431?text=Halo%20YASMIN,%20saya%20ingin%20memesan%20Kopi%20Robusta%20Purna%20Migran%20Majenang"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold whitespace-nowrap transition-colors"
                    >
                      Pesan
                    </a>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Kaos Solidaritas Hak & Kedaulatan Buruh Migran</h4>
                      <p className="text-[10px] text-slate-500">Cotton combed 24s premium dengan pesan advokasi YASMIN</p>
                      <span className="text-xs font-extrabold text-emerald-800">Rp 95.000</span>
                    </div>
                    <a
                      href="https://wa.me/6281198765431?text=Halo%20YASMIN,%20saya%20ingin%20memesan%20Kaos%20Solidaritas%20Hak%20Buruh%20Migran"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold whitespace-nowrap transition-colors"
                    >
                      Pesan
                    </a>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Tote Bag Kanvas Kampanye Pelindungan PMI</h4>
                      <p className="text-[10px] text-slate-500">Tas kanvas ramah lingkungan bertema perlindungan dan kedaulatan migran</p>
                      <span className="text-xs font-extrabold text-emerald-800">Rp 50.000</span>
                    </div>
                    <a
                      href="https://wa.me/6281198765431?text=Halo%20YASMIN,%20saya%20ingin%20memesan%20Tote%20Bag%20Kanvas%20Solidaritas"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold whitespace-nowrap transition-colors"
                    >
                      Pesan
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Konfirmasi Donasi (Opsional) */}
          <form onSubmit={handleWhatsAppConfirm} className="space-y-3 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              3. Konfirmasi Pengiriman (Opsional / Bukti Tanda Terima)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Nama Anda (atau biarkan kosong jika Anonim)"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              />
              <input
                type="text"
                placeholder="No. WhatsApp / Email"
                value={donorContact}
                onChange={(e) => setDonorContact(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              />
            </div>

            <textarea
              rows={2}
              placeholder="Pesan solidaritas atau doa bagi rekan buruh migran..."
              value={donorMessage}
              onChange={(e) => setDonorMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Diaudit akuntan publik & transparan</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Konfirmasi via WhatsApp Resmi</span>
              </button>
            </div>
          </form>

          {submittedMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              Terima kasih! Tautan WhatsApp resmi layanan YASMIN telah dibuka untuk konfirmasi pengiriman bukti donasi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
