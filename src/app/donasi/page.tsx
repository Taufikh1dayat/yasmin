import React from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Building2, 
  QrCode, 
  CheckCircle, 
  Users, 
  Scale, 
  Home, 
  PhoneCall,
  Lock
} from 'lucide-react';
import Link from 'next/link';

export default function DonationPage() {
  const bankAccounts = [
    {
      bank: 'Bank Mandiri',
      accountNumber: '123-00-9876543-2',
      accountName: 'Yayasan Studi Migran Indonesia',
      branch: 'KC Salemba Jakarta',
    },
    {
      bank: 'Bank Central Asia (BCA)',
      accountNumber: '731-098-7654',
      accountName: 'Yayasan Studi Migran Indonesia',
      branch: 'KCU Matraman Jakarta',
    },
    {
      bank: 'Bank BNI',
      accountNumber: '089-123-4567',
      accountName: 'Yayasan Studi Migran Indonesia',
      branch: 'KC Kramat Raya',
    },
    {
      bank: 'Bank BRI',
      accountNumber: '0206-01-002345-50-8',
      accountName: 'Yayasan Studi Migran Indonesia',
      branch: 'KC Senen Jakarta',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
            <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
            <span>Solidaritas Kemanusiaan & Bantuan Hukum</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Donasi Solidaritas Buruh Migran
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Setiap rupiah donasi Anda menjadi energi nyata bagi pendampingan pro bono korban eksploitasi, perlindungan di rumah aman (safehouse), dan pemulangan darurat pekerja migran.
          </p>
        </div>

        {/* 3 Pilar Pemanfaatan Donasi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Bantuan Hukum Pro Bono</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Membiayai pendaftaran gugatan perdata, pendampingan sidang pidana TPPO, somasi hak upah, dan mediasi tanpa membebani biaya sepeser pun pada korban.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Home className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Rumah Aman (Safehouse)</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Menyediakan tempat tinggal perlindungan darurat, makanan bernutrisi, pemeriksaan kesehatan, dan konseling trauma healing bagi penyintas kekerasan.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue-100 text-brand-blue-800 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Paralegal Komunitas Desa</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Pendidikan advokasi dan operasional sistem siaga dini di kantong-kantong desa asal untuk mencegah penipuan mafia calo non-prosedural sejak dini.
            </p>
          </div>
        </div>

        {/* Rekening Resmi & QRIS */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">
              Rekening Resmi Lembaga
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Kanal Penyaluran Donasi Terverifikasi
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pastikan transfer hanya ditujukan ke rekening atas nama resmi Yayasan Studi Migran Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Daftar Rekening Bank */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>Transfer Bank Nasional</span>
              </h3>

              <div className="space-y-3">
                {bankAccounts.map((acc) => (
                  <div key={acc.bank} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="text-xs font-bold text-slate-900">{acc.bank}</div>
                    <div className="font-mono text-base font-extrabold text-slate-800 tracking-wider">
                      {acc.accountNumber}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      a.n. {acc.accountName} • {acc.branch}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QRIS Instan */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-700" />
                <span>Pembayaran Instan QRIS</span>
              </h3>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-4">
                <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl border border-slate-300 shadow-sm flex flex-col items-center justify-center">
                  <QrCode className="w-32 h-32 text-slate-800" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    QRIS YASMIN
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-800">
                    NMID: ID1020349812739
                  </div>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Mendukung semua aplikasi mobile banking (BCA, Mandiri, BRI, BNI) dan dompet digital (GoPay, OVO, Dana, ShopeePay).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Konfirmasi WhatsApp */}
          <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-emerald-950">
                Konfirmasi Tanda Terima & Laporan Donasi
              </h3>
              <p className="text-xs text-emerald-800">
                Kirimkan bukti transfer Anda ke nomor hotline keuangan resmi untuk mendapatkan tanda terima resmi lembaga dan laporan penyaluran berkala.
              </p>
            </div>

            <a
              href="https://wa.me/6281198765431?text=Halo%20Tim%20Keuangan%20YASMIN,%20saya%20telah%20menyalurkan%20donasi%20solidaritas%20dan%20ingin%20konfirmasi%20bukti%20transfer."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap flex items-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Konfirmasi via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Merchandise Komunitas Purna Migran */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block mb-1">
              Dukung Melalui Karya Komunitas
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Merchandise & Produk Komunitas Purna Migran
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Setiap pembelian produk karya buruh migran dan merchandise resmi YASMIN dialokasikan 100% untuk kas operasional bantuan hukum dan pendampingan korban TPPO.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Karya Komunitas</span>
                <h3 className="font-bold text-slate-900 text-base">Kopi Robusta Majenang</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kopi petik merah organik hasil budidaya kelompok tani purna buruh migran di Kecamatan Majenang, Cilacap (250gr).
                </p>
                <div className="text-base font-extrabold text-emerald-800 pt-1">Rp 45.000</div>
              </div>
              <a
                href="https://wa.me/6281198765431?text=Halo%20YASMIN,%20saya%20ingin%20memesan%20Kopi%20Robusta%20Purna%20Migran%20Majenang"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs text-center block transition-colors"
              >
                Pesan via WhatsApp
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-brand-blue-800">Merchandise Resmi</span>
                <h3 className="font-bold text-slate-900 text-base">Kaos Solidaritas Hak Buruh Migran</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kaos katun combed 24s premium bertema kampanye kedaulatan dan perlindungan pekerja migran Indonesia.
                </p>
                <div className="text-base font-extrabold text-emerald-800 pt-1">Rp 95.000</div>
              </div>
              <a
                href="https://wa.me/6281198765431?text=Halo%20YASMIN,%20saya%20ingin%20memesan%20Kaos%20Solidaritas%20Hak%20Buruh%20Migran"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs text-center block transition-colors"
              >
                Pesan via WhatsApp
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">Merchandise Resmi</span>
                <h3 className="font-bold text-slate-900 text-base">Tote Bag Kanvas Pelindungan PMI</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tas jinjing kanvas tebal ramah lingkungan dengan kutipan pesan advokasi YASMIN.
                </p>
                <div className="text-base font-extrabold text-emerald-800 pt-1">Rp 50.000</div>
              </div>
              <a
                href="https://wa.me/6281198765431?text=Halo%20YASMIN,%20saya%20ingin%20memesan%20Tote%20Bag%20Kanvas%20Solidaritas"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs text-center block transition-colors"
              >
                Pesan via WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Jaminan Transparansi & Akuntabilitas */}
        <div className="bg-brand-blue-900 text-white rounded-3xl p-8 sm:p-10 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Prinsip Akuntabilitas Publik YASMIN</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Yayasan Studi Migran Indonesia (YASMIN) berkomitmen terhadap transparansi pengelolaan dana publik. Seluruh penerimaan dan alokasi dana donasi diaudit setiap tahun buku oleh Kantor Akuntan Publik (KAP) independen dan dipublikasikan dalam Laporan Tahunan (CATAHU) yang dapat diakses secara terbuka oleh seluruh masyarakat.
          </p>
        </div>
      </div>
    </div>
  );
}
