'use client';

import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  ShieldAlert,
  Calendar,
  Check
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Form State
  const [adminName, setAdminName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Status feedback
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch profil saat ini
  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const res = await fetch('/api/admin/change-password');
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setAdminName(data.user.name || '');
      }
    } catch (err) {
      console.error('Failed to load admin profile', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!currentPassword) {
      setErrorMsg('Kata sandi saat ini wajib diisi.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg('Kata sandi baru minimal harus terdiri dari 8 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
          name: adminName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Gagal memperbarui kata sandi.');
      } else {
        setSuccessMsg(data.message || 'Kata sandi berhasil diperbarui.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        if (data.user) {
          setProfile((prev) => (prev ? { ...prev, ...data.user } : prev));
        }
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan koneksi saat memperbarui kata sandi.');
    } finally {
      setSaving(false);
    }
  };

  // Kalkulasi kekuatan kata sandi
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Lemah', color: 'bg-red-500 text-red-700' };
    if (score === 2) return { score: 2, label: 'Cukup', color: 'bg-amber-500 text-amber-700' };
    if (score === 3) return { score: 3, label: 'Kuat', color: 'bg-emerald-500 text-emerald-700' };
    return { score: 4, label: 'Sangat Kuat', color: 'bg-teal-500 text-teal-700' };
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Halaman */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80 mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Keamanan & Autentikasi Sistem</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Pengaturan Akun & Kata Sandi Admin
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Kelola kredensial akses, perbarui kata sandi, dan amankan akun administratif Yayasan Studi Migran Indonesia.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Profil & Panduan Keamanan */}
        <div className="space-y-6">
          {/* Kartu Profil Aktif */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Profil Pengguna Aktif</span>
            </h2>

            {loadingProfile ? (
              <div className="py-6 text-center text-xs text-slate-400">
                Memuat data akun...
              </div>
            ) : profile ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-lg shadow-sm">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-slate-900 text-sm block truncate">
                      {profile.name}
                    </span>
                    <span className="text-slate-500 text-xs block truncate">
                      {profile.email}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Peran Sistem:</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                      {profile.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Status Akun:</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Aktif & Terverifikasi
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Terdaftar Sejak:</span>
                    <span className="text-slate-700 font-medium">
                      {new Date(profile.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-red-500">Gagal memuat profil.</div>
            )}
          </div>

          {/* Panduan Kata Sandi Kuat */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 text-xs text-slate-600 space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Standar Keamanan Kata Sandi</span>
            </h3>
            <ul className="space-y-1.5 text-[11px] text-slate-500 list-disc list-inside">
              <li>Minimal 8 karakter (disarankan 12 karakter ke atas).</li>
              <li>Kombinasi huruf besar, huruf kecil, dan angka.</li>
              <li>Gunakan karakter simbol unik (contoh: @, #, $, !).</li>
              <li>Jangan gunakan kata sandi umum seperti "admin123456".</li>
            </ul>
          </div>
        </div>

        {/* Kolom Kanan: Form Ganti Kata Sandi */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-700" />
                <span>Formulir Pembaruan Kata Sandi</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Masukkan kata sandi lama Anda untuk memverifikasi identitas, kemudian tentukan kata sandi baru yang aman.
              </p>
            </div>

            {/* Notifikasi Error */}
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Notifikasi Sukses */}
            {successMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nama Admin */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Lengkap Administrator
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="Administrator YASMIN"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
                  />
                </div>
              </div>

              {/* Kata Sandi Saat Ini */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kata Sandi Saat Ini (Lama)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan kata sandi yang saat ini aktif"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Kata Sandi Baru */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 8 karakter baru"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Indikator Kekuatan Kata Sandi */}
                {newPassword && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Kekuatan Sandi:</span>
                      <span className="font-bold">{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-slate-200'}`}></div>
                      <div className={`h-full flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-slate-200'}`}></div>
                      <div className={`h-full flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-200'}`}></div>
                      <div className={`h-full flex-1 rounded-full ${strength.score >= 4 ? strength.color : 'bg-slate-200'}`}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Konfirmasi Kata Sandi Baru */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Konfirmasi Kata Sandi Baru
                </label>
                <div className="relative">
                  <CheckCircle2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi baru"
                    className={`w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 bg-white ${
                      confirmPassword && confirmPassword !== newPassword
                        ? 'border-red-300 focus:ring-red-500'
                        : confirmPassword && confirmPassword === newPassword
                          ? 'border-emerald-300 focus:ring-emerald-600'
                          : 'border-slate-200 focus:ring-emerald-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <span className="text-[11px] text-red-600 mt-1 block">
                    Konfirmasi kata sandi belum sesuai dengan kata sandi baru.
                  </span>
                )}
                {confirmPassword && confirmPassword === newPassword && (
                  <span className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    Kata sandi cocok.
                  </span>
                )}
              </div>

              {/* Tombol Simpan */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={saving || (confirmPassword !== '' && confirmPassword !== newPassword)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <span>Memperbarui Sandi...</span>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Perbarui Kata Sandi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
