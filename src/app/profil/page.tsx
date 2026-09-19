import React from 'react';
import { 
  Scale, 
  Users, 
  Shield, 
  Target, 
  Compass, 
  BookOpen, 
  CheckCircle, 
  HeartHandshake,
  FileSearch,
  Megaphone,
  GraduationCap,
  MapPin,
  Mail,
  PhoneCall
} from 'lucide-react';

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
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
            Yayasan Studi Migran Indonesia (YASMIN) didirikan oleh sekelompok aktivis buruh migran, purna migran, dan keluarganya dengan kesamaan pandangan dan tujuan. Pada tahun 2021, YASMIN resmi memperoleh pengesahan pendirian badan hukum oleh Kementerian Hukum dan HAM Republik Indonesia (Kemenkumham RI).
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            YASMIN adalah lembaga studi, non-profit, dan independen yang berkedudukan di Indonesia. Lembaga ini bertujuan mempengaruhi perubahan kebijakan untuk menciptakan pelindungan dan kedaulatan sosial, politik, dan ekonomi yang adil bagi migran, purna migran, serta keluarga migran.
          </p>
        </div>

        {/* Visi & Fokus Kerja */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Tujuan Strategis YASMIN</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mempengaruhi perubahan kebijakan ketenagakerjaan dan migrasi guna mewujudkan sistem pelindungan dan kedaulatan sosial, politik, dan ekonomi yang adil dan bermartabat bagi migran, purna migran, dan seluruh anggota keluarganya.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue-100 text-brand-blue-800 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Fokus Utama Gerakan</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Upaya pencapaian tujuan YASMIN difokuskan secara terpadu melalui empat pilar kegiatan berkesinambungan:
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Riset dan studi komprehensif kajian migrasi</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Advokasi kebijakan regulasi dan penanganan pengaduan kasus</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Pemberdayaan kemandirian komunitas buruh migran dan keluarga</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Kampanye publik dan distribusi informasi isu migrasi</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4 Program Pokok Umum YASMIN */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">
              Program Kerja Lembaga
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Empat Program Pokok YASMIN
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Kerangka kerja operasional YASMIN dalam melayani dan memberdayakan buruh migran Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Program 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-brand-blue-800 flex items-center justify-center font-bold">
                <FileSearch className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">1. Program Penelitian</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Penelitian terarah untuk mengetahui dan memahami situasi migrasi yang dialami oleh migran, purna migran, dan keluarga migran Indonesia secara politik, ekonomi, budaya, dan sosial.
              </p>
            </div>

            {/* Program 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">2. Program Pemberdayaan</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pemberdayaan untuk mengembangkan dan meningkatkan kemampuan serta potensi komunitas migran, purna migran, dan keluarga migran secara mandiri dan kolektif melalui pendidikan, pelatihan, pengorganisasian komunitas, dan kemitraan.
              </p>
            </div>

            {/* Program 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">3. Program Advokasi</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Advokasi undang-undang, peraturan kebijakan ketenagakerjaan migran di tingkat nasional maupun internasional, serta pendampingan langsung terhadap pengaduan kasus-kasus pelanggaran hak buruh migran.
              </p>
            </div>

            {/* Program 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Megaphone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">4. Media dan Kampanye</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pengelolaan kanal media komunikasi publik dan penyebarluasan informasi serta isu-isu strategis seputar migrasi yang akurat sebagai sumber edukasi bagi masyarakat umum.
              </p>
            </div>
          </div>
        </div>

        {/* Struktur Organisasi Resmi */}
        <div id="struktur-organisasi" className="scroll-mt-24 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">
              Tata Kelola Lembaga
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Struktur Kepengurusan YASMIN
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Susunan pimpinan dan manajer divisi pelaksana Yayasan Studi Migran Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Direktur */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                Direktur
              </span>
              <h3 className="font-bold text-slate-900 text-lg">Retno Dewi</h3>
              <p className="text-xs text-slate-500">Pimpinan Eksekutif YASMIN</p>
            </div>

            {/* Manager Program */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">
                Manager Program
              </span>
              <h3 className="font-bold text-slate-900 text-lg">Nadia Nurul</h3>
              <p className="text-xs text-slate-500">Koordinasi & Implementasi Program</p>
            </div>

            {/* Manager Penelitian */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-brand-blue-700 uppercase tracking-wider block">
                Manager Penelitian
              </span>
              <h3 className="font-bold text-slate-900 text-lg">Samsul Arifin</h3>
              <p className="text-xs text-slate-500">Riset Lapangan & Kajian Kebijakan</p>
            </div>

            {/* Manager Advokasi */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
                Manager Advokasi
              </span>
              <h3 className="font-bold text-slate-900 text-lg">Vicky</h3>
              <p className="text-xs text-slate-500">Advokasi Regulasi & Penanganan Kasus</p>
            </div>

            {/* Manager Media dan Kampanye */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                Manager Media dan Kampanye
              </span>
              <h3 className="font-bold text-slate-900 text-lg">BB Rozani</h3>
              <p className="text-xs text-slate-500">Pengelolaan Media & Kampanye Publik</p>
            </div>
          </div>
        </div>

        {/* Alamat & Kontak Resmi Lembaga */}
        <div id="kontak" className="scroll-mt-24 bg-brand-blue-900 text-white rounded-3xl p-8 sm:p-10 shadow-md space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest block mb-1">
              Sekretariat & Kantor Resmi
            </span>
            <h2 className="text-2xl font-extrabold">Hubungi Kantor YASMIN</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Layanan konsultasi, advokasi pengaduan, kemitraan riset, dan koordinasi jaringan migran.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <MapPin className="w-4 h-4" />
                <span>Alamat Kantor</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Jalan Marta Atmaja, Kecamatan Majenang, Kabupaten Cilacap, Jawa Tengah, Indonesia.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <Mail className="w-4 h-4" />
                <span>Surat Elektronik (Email)</span>
              </div>
              <a 
                href="mailto:studi.migran@gmail.com" 
                className="text-xs text-slate-200 hover:text-white underline block"
              >
                studi.migran@gmail.com
              </a>
              <div className="text-[11px] text-slate-400 pt-1">
                Kanal resmi komunikasi administrasi dan kerjasama riset.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <Users className="w-4 h-4" />
                <span>Media Sosial Resmi</span>
              </div>
              <p className="text-xs text-slate-200">
                Instagram: <strong className="text-white">@studimigran</strong>
              </p>
              <p className="text-xs text-slate-200">
                Facebook: <strong className="text-white">studi migran</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
