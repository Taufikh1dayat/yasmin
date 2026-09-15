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
  ExternalLink
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
  const [activeTab, setActiveTab] = useState<'transfer' | 'qris'>('transfer');
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
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          aria-label="Tutup Dialog Donasi"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Modal */}
        <div className="space-y-2 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
            <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
            <span>Solidaritas Kemanusiaan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Donasi Solidaritas Pekerja Migran
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Dukungan Anda membiayai bantuan hukum pro bono, pemulihan darurat korban TPPO, dan operasional rumah aman YASMIN di berbagai titik perbatasan.
          </p>
        </div>

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
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-rose-50/80 border-rose-500 text-rose-900 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Input Nominal Lain */}
          <div className="pt-1">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
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
                className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Tab Metode Pembayaran */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            2. Rekening Resmi & Kanal Penyaluran
          </label>

          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('transfer')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'transfer'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Transfer Rekening Bank</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('qris')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'qris'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QRIS Instan (Semua E-Wallet & Bank)</span>
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
        </div>

        {/* Form Konfirmasi Donasi (Opsional) */}
        <form onSubmit={handleWhatsAppConfirm} className="space-y-3 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            3. Konfirmasi Pengiriman (Opsional / Bukti Tanda Terima)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nama Anda (atau biarkan kosong jika Anonim)"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <input
              type="text"
              placeholder="No. WhatsApp / Email"
              value={donorContact}
              onChange={(e) => setDonorContact(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <textarea
            rows={2}
            placeholder="Pesan solidaritas atau doa bagi rekan buruh migran..."
            value={donorMessage}
            onChange={(e) => setDonorMessage(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Diaudit akuntan publik & transparan</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5"
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
  );
}
