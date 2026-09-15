import React from 'react';
import { Scale, Users, Shield, Target, Compass, BookOpen, CheckCircle, HeartHandshake } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Title */}
        <div id="profil" className="scroll-mt-24 text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Shield className="w-3.5 h-3.5 text-emerald-700" />
            <span>Tentang Lembaga</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Profil YASMIN
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Yayasan Studi Migran Indonesia (YASMIN) adalah organisasi masyarakat sipil independen yang bergerak di bidang riset kebijakan migrasi ketenagakerjaan, advokasi bantuan hukum struktural, dan pemberdayaan buruh migran beserta keluarganya.
          </p>
        </div>

        {/* Visi & Misi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Visi YASMIN</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Terwujudnya sistem migrasi ketenagakerjaan yang adil, manusiawi, dan bebas dari eksploitasi, di mana setiap Pekerja Migran Indonesia (PMI) dan keluarganya diakui hak asasi dan martabatnya, serta terlindungi secara hukum dari hulu hingga hilir.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue-100 text-brand-blue-800 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Misi YASMIN</h2>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                <span>Memberikan bantuan hukum gratis dan pendampingan litigasi/non-litigasi bagi PMI korban pelanggaran hak dan TPPO.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                <span>Melakukan riset kebijakan dan mempublikasikan data berkala guna mengawal reformasi perundang-undangan migrasi.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                <span>Membangun kapasitas paralegal komunitas dan serikat buruh migran di desa-desa kantong migran seluruh Indonesia.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Nilai-Nilai & Prinsip Organisasi */}
        <div className="bg-brand-blue-900 text-white rounded-3xl p-8 sm:p-12 shadow-md space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-extrabold">Prinsip Kerja Advokasi YASMIN</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Nilai utama yang menjadi pedoman tim dan paralegal kami dalam melayani masyarakat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-center space-y-2">
              <div className="font-bold text-base text-emerald-300">Berpihak pada Korban</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mengutamakan pemulihan hak fisik, psikososial, dan pemenuhan restitusi tanpa diskriminasi latar belakang atau status dokumen.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-center space-y-2">
              <div className="font-bold text-emerald-300 text-base">Integritas & Kerahasiaan</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Menjunjung tinggi kode etik advokasi publik dan kepatuhan ketat terhadap perlindungan data pribadi dan saksi.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-center space-y-2">
              <div className="font-bold text-emerald-300 text-base">Solidaritas Kolektif</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Membangun jejaring solidaritas erat bersama serikat buruh, akademisi, paralegal desa, dan lembaga donor internasional.
              </p>
            </div>
          </div>
        </div>

        {/* Struktur Organisasi */}
        <div id="struktur-organisasi" className="scroll-mt-24 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">
              Struktur Kepengurusan
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Struktur Organisasi Sekretariat Nasional
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tata kelola kepengurusan Yayasan Studi Migran Indonesia periode 2024 - 2028.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-emerald-700 uppercase">Dewan Pembina</span>
              <h4 className="font-bold text-slate-900 text-base mt-1">Dr. Maria Ulfah, S.H., M.Hum.</h4>
              <p className="text-xs text-slate-500 mt-0.5">Pakar Hukum Ketenagakerjaan Internasional</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-emerald-700 uppercase">Direktur Eksekutif</span>
              <h4 className="font-bold text-slate-900 text-base mt-1">Bambang Irawan, S.H.</h4>
              <p className="text-xs text-slate-500 mt-0.5">Koordinator Nasional Advokasi Migran</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-brand-blue-700 uppercase">Kepala Divisi Bantuan Hukum</span>
              <h4 className="font-bold text-slate-900 text-base mt-1">Nurul Hidayati, S.H., M.H.</h4>
              <p className="text-xs text-slate-500 mt-0.5">Advokat Publik & Pendamping Korban TPPO</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-brand-blue-700 uppercase">Kepala Divisi Riset & Kebijakan</span>
              <h4 className="font-bold text-slate-900 text-base mt-1">Faisal Tanjung, M.Si.</h4>
              <p className="text-xs text-slate-500 mt-0.5">Peneliti Sosiologi Migrasi & Kebijakan Publik</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-teal-700 uppercase">Koordinator Jaringan Paralegal</span>
              <h4 className="font-bold text-slate-900 text-base mt-1">Suhartono, S.Sos.</h4>
              <p className="text-xs text-slate-500 mt-0.5">Pemberdayaan Komunitas Kantong Migran</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-amber-700 uppercase">Sekretariat & Keuangan</span>
              <h4 className="font-bold text-slate-900 text-base mt-1">Dewi Lestari, S.E.</h4>
              <p className="text-xs text-slate-500 mt-0.5">Manajemen Operasional & Pelaporan Publik</p>
            </div>
          </div>
        </div>

        {/* Anggota & Tim Staf YASMIN */}
        <div id="anggota" className="scroll-mt-24 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-widest block mb-1">
              Jajaran Keanggotaan & Staf
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Anggota & Pengurus Tim Pelaksana
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tim profesional hukum, peneliti lapangan, dan staf operasional pendamping PMI di tingkat pusat maupun daerah.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded-full">Advokat Pendamping</span>
              <h4 className="font-bold text-slate-900 text-sm">Ahmad Fauzi, S.H.</h4>
              <p className="text-xs text-slate-500">Penanganan Litigasi Pidana & Perlindungan Hak Korban</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-blue-800 uppercase bg-blue-100 px-2 py-0.5 rounded-full">Analis Data Kebijakan</span>
              <h4 className="font-bold text-slate-900 text-sm">Rini Astuti, S.Sos.</h4>
              <p className="text-xs text-slate-500">Dokumentasi Kasus CATAHU & Publikasi Ilmiah</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-teal-800 uppercase bg-teal-100 px-2 py-0.5 rounded-full">Pendamping Kasus Luar Negeri</span>
              <h4 className="font-bold text-slate-900 text-sm">Hendra Gunawan</h4>
              <p className="text-xs text-slate-500">Koordinasi Diplomatik Perwakilan RI di Malaysia & Taiwan</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-amber-800 uppercase bg-amber-100 px-2 py-0.5 rounded-full">Fasilitator Komunitas</span>
              <h4 className="font-bold text-slate-900 text-sm">Siti Rahmawati</h4>
              <p className="text-xs text-slate-500">Pemberdayaan Kelompok Mantan PMI & Keluarga Asal</p>
            </div>
          </div>
        </div>

        {/* Jaringan Paralegal Komunitas Basis */}
        <div id="paralegal" className="scroll-mt-24 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-widest block mb-1">
              Garda Terdepan Komunitas
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Jaringan Paralegal Komunitas Desa
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Paralegal terlatih yang tinggal dan berakar di desa-desa kantong migran Indonesia, bertindak sebagai mediator awal dan sistem deteksi dini bahaya perdagangan manusia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-teal-50/60 border border-teal-200/80 space-y-3">
              <h4 className="font-bold text-slate-900 text-base">Verifikasi & Edukasi Pra-Penempatan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Membantu calon PMI dan keluarga memverifikasi izin P3MI, keabsahan surat perjanjian kerja (PK), visa kerja resmi, dan menolak pungutan liar jalur tikus.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
              <h4 className="font-bold text-slate-900 text-base">Penerimaan Aduan Awal & Mediasi</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menerima laporan keluarga PMI jika putus komunikasi, dugaan penahanan di agen, atau kekerasan di penampungan untuk segera diteruskan ke helpdesk YASMIN.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3">
              <h4 className="font-bold text-slate-900 text-base">Pemulihan Hak & Reintegrasi Sosial</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mendampingi kepulangan buruh migran yang mengalami trauma fisik maupun finansial agar mendapatkan bantuan sosial, rujukan medis, dan pemulihan martabat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
