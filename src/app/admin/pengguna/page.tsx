'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  KeyRound, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Lock, 
  Mail, 
  User, 
  Shield, 
  Search, 
  ArrowLeft, 
  RefreshCw, 
  Eye, 
  EyeOff,
  Sparkles
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'LEGAL_STAFF';
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [resettingUser, setResettingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

  // Form state - Add
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'LEGAL_STAFF' | 'SUPER_ADMIN'>('LEGAL_STAFF');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form state - Edit
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'LEGAL_STAFF' | 'SUPER_ADMIN'>('LEGAL_STAFF');
  const [editIsActive, setEditIsActive] = useState(true);

  // Form state - Reset Password
  const [resetPasswordVal, setResetPasswordVal] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Feedback notifications
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setFeedback(null);
      const res = await fetch('/api/admin/users');

      if (res.status === 403) {
        setForbidden(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error('Gagal mengambil daftar pengguna');
      }

      const data = await res.json();
      setUsers(data.users || []);
      if (data.currentUserId) {
        setCurrentUserId(data.currentUserId);
      }
      setForbidden(false);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Gagal memuat data pengguna.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Generate random password aman
  const generateRandomPassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(result);
    setShowNewPassword(true);
  };

  // Submit Buat Pengguna Baru
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          role: newRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: 'error', message: data.error || 'Gagal membuat pengguna baru.' });
      } else {
        setFeedback({ type: 'success', message: data.message || 'Pengguna baru berhasil dibuat.' });
        setIsAddModalOpen(false);
        setNewName('');
        setNewEmail('');
        setNewPassword('');
        setNewRole('LEGAL_STAFF');
        fetchUsers();
      }
    } catch {
      setFeedback({ type: 'error', message: 'Terjadi kesalahan sistem saat membuat pengguna.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditIsActive(user.isActive);
  };

  // Submit Edit Pengguna
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setFeedback(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUser.id,
          name: editName,
          email: editEmail,
          role: editRole,
          isActive: editIsActive,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: 'error', message: data.error || 'Gagal memperbarui pengguna.' });
      } else {
        setFeedback({ type: 'success', message: data.message || 'Data pengguna berhasil diperbarui.' });
        setEditingUser(null);
        fetchUsers();
      }
    } catch {
      setFeedback({ type: 'error', message: 'Terjadi kesalahan sistem saat memperbarui pengguna.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUser) return;
    setFeedback(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: resettingUser.id,
          newPassword: resetPasswordVal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: 'error', message: data.error || 'Gagal mereset kata sandi.' });
      } else {
        setFeedback({
          type: 'success',
          message: `Kata sandi akun "${resettingUser.name}" berhasil direset. Silakan berikan kata sandi baru kepada staf terkait.`,
        });
        setResettingUser(null);
        setResetPasswordVal('');
      }
    } catch {
      setFeedback({ type: 'error', message: 'Terjadi kesalahan sistem saat mereset kata sandi.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Delete Pengguna
  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setFeedback(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/users?id=${deletingUser.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: 'error', message: data.error || 'Gagal menghapus pengguna.' });
      } else {
        setFeedback({ type: 'success', message: data.message || 'Pengguna berhasil dihapus.' });
        setDeletingUser(null);
        fetchUsers();
      }
    } catch {
      setFeedback({ type: 'error', message: 'Terjadi kesalahan sistem saat menghapus pengguna.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter pencarian
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  // Jika bukan Super Admin (403 Forbidden)
  if (forbidden) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-black tracking-widest text-red-600 uppercase">
            Akses Ditolak (403 Forbidden)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Hanya untuk Administrator Tertinggi
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            Halaman Manajemen Pengguna ini hanya dapat diakses oleh akun dengan tingkat peran <strong>SUPER_ADMIN</strong>. Akun staf operasional biasa tidak memiliki izin untuk mengelola atau membuat akun pengguna lain.
          </p>
        </div>
        <div>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Utama</span>
          </Link>
        </div>
      </div>
    );
  }

  // Statistik
  const totalUsers = users.length;
  const superAdminCount = users.filter((u) => u.role === 'SUPER_ADMIN').length;
  const legalStaffCount = users.filter((u) => u.role === 'LEGAL_STAFF').length;
  const activeCount = users.filter((u) => u.isActive).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hak Akses Administrator Tertinggi (Super Admin)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Manajemen Pengguna & Staf YASMIN
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Buat akun untuk staf pengurus, atur kewenangan hak akses, dan kelola kata sandi akun sistem.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shadow-xs"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              setNewName('');
              setNewEmail('');
              setNewPassword('');
              setNewRole('LEGAL_STAFF');
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Pengguna Baru</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Kartu Ringkasan Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total Akun Terdaftar</span>
          <div className="text-2xl font-black text-slate-900">{totalUsers}</div>
          <div className="text-[10px] text-slate-400">Seluruh staf & pengurus</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-700 uppercase">Super Admin</span>
          <div className="text-2xl font-black text-emerald-800">{superAdminCount}</div>
          <div className="text-[10px] text-slate-400">Pemilik akses penuh sistem</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-blue-700 uppercase">Staf Advokasi</span>
          <div className="text-2xl font-black text-blue-800">{legalStaffCount}</div>
          <div className="text-[10px] text-slate-400">Pengelola operasional kasus & warta</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-teal-700 uppercase">Akun Aktif</span>
          <div className="text-2xl font-black text-teal-800">{activeCount}</div>
          <div className="text-[10px] text-slate-400">Dapat login ke panel</div>
        </div>
      </div>

      {/* Tabel Daftar Pengguna */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar Pencarian */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, email, peran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Menampilkan <strong>{filteredUsers.length}</strong> dari {users.length} pengguna
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-100 tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Pengguna & Akun</th>
                <th className="py-3.5 px-6">Peran Akses</th>
                <th className="py-3.5 px-6">Status Akun</th>
                <th className="py-3.5 px-6">Terdaftar Pada</th>
                <th className="py-3.5 px-6 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Memuat daftar pengguna...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Tidak ditemukan data pengguna.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSelf = user.id === currentUserId;
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Nama & Email */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-white ${
                              user.role === 'SUPER_ADMIN'
                                ? 'bg-gradient-to-br from-emerald-600 to-teal-700 shadow-xs'
                                : 'bg-gradient-to-br from-slate-700 to-slate-900 shadow-xs'
                            }`}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-2">
                              <span>{user.name}</span>
                              {isSelf && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900">
                                  Akun Anda
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Peran */}
                      <td className="py-4 px-6">
                        {user.role === 'SUPER_ADMIN' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-900 font-bold text-[11px] border border-emerald-200">
                            <Shield className="w-3 h-3 text-emerald-700" />
                            <span>Super Admin</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-900 font-bold text-[11px] border border-blue-200">
                            <Users className="w-3 h-3 text-blue-700" />
                            <span>Staf Advokasi</span>
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-slate-400 font-bold text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                            Dinonaktifkan
                          </span>
                        )}
                      </td>

                      {/* Terdaftar Pada */}
                      <td className="py-4 px-6 text-slate-500 text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Aksi */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Reset Kata Sandi */}
                          <button
                            type="button"
                            onClick={() => {
                              setResettingUser(user);
                              setResetPasswordVal('');
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Reset Kata Sandi Pengguna Ini"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          {/* Edit Data */}
                          <button
                            type="button"
                            onClick={() => openEditModal(user)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Edit Peran atau Status"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Hapus Akun (Disabled jika akun sendiri) */}
                          {!isSelf && (
                            <button
                              type="button"
                              onClick={() => setDeletingUser(user)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                              title="Hapus Akun Pengguna"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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

      {/* ========================================================= */}
      {/* 1. MODAL TAMBAH PENGGUNA BARU */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-slate-900 text-base">Buat Akun Staf / Pengguna Baru</h3>
                <p className="text-xs text-slate-500">Tentukan identitas dan hak akses akun baru</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Staf
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rahmat Hidayat, S.H."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Alamat Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Email Resmi
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="nama.staf@yasmin.or.id"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Peran / Hak Akses */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tingkat Peran (Hak Akses)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewRole('LEGAL_STAFF')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      newRole === 'LEGAL_STAFF'
                        ? 'bg-blue-50 border-blue-600 text-blue-950 ring-1 ring-blue-600/30'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs">Staf Advokasi</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Kelola kasus & berita</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewRole('SUPER_ADMIN')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      newRole === 'SUPER_ADMIN'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600/30'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs">Super Admin</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Akses penuh + kelola user</div>
                  </button>
                </div>
              </div>

              {/* Kata Sandi Awal */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Kata Sandi Awal
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Buat Acak Aman</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimal 8 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Simpan dan berikan kata sandi ini kepada staf terkait setelah akun dibuat.
                </span>
              </div>

              {/* Tombol Aksi */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Buat Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. MODAL EDIT PENGGUNA */}
      {/* ========================================================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-slate-900 text-base">Edit Pengguna</h3>
                <p className="text-xs text-slate-500">Perbarui identitas, peran, atau status aktif</p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Email
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Peran */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tingkat Peran
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  disabled={editingUser.id === currentUserId}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white disabled:bg-slate-100"
                >
                  <option value="LEGAL_STAFF">Staf Advokasi (LEGAL_STAFF)</option>
                  <option value="SUPER_ADMIN">Administrator Tertinggi (SUPER_ADMIN)</option>
                </select>
                {editingUser.id === currentUserId && (
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Anda tidak dapat mengubah peran akun Anda sendiri.
                  </span>
                )}
              </div>

              {/* Status Keaktifan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Status Akun
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditIsActive(true)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      editIsActive
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Aktif
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (editingUser.id !== currentUserId) {
                        setEditIsActive(false);
                      }
                    }}
                    disabled={editingUser.id === currentUserId}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      !editIsActive
                        ? 'bg-red-50 border-red-600 text-red-950'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    } disabled:opacity-50`}
                  >
                    Nonaktif
                  </button>
                </div>
                {editingUser.id === currentUserId && (
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Anda tidak dapat menonaktifkan akun Anda sendiri.
                  </span>
                )}
              </div>

              {/* Tombol Aksi */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MODAL RESET PASSWORD PENGGUNA */}
      {/* ========================================================= */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-slate-900 text-base">Reset Kata Sandi Staf</h3>
                <p className="text-xs text-slate-500">
                  Untuk pengguna: <strong>{resettingUser.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setResettingUser(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                Sebagai Super Admin, Anda dapat langsung menetapkan kata sandi baru untuk staf ini tanpa perlu mengetahui kata sandi lamanya.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi Baru Pengguna
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showResetPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimal 8 karakter baru"
                    value={resetPasswordVal}
                    onChange={(e) => setResetPasswordVal(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showResetPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || resetPasswordVal.length < 8}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
                >
                  {submitting ? 'Mereset...' : 'Tetapkan Sandi Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. MODAL KONFIRMASI HAPUS PENGGUNA */}
      {/* ========================================================= */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">Hapus Akun Pengguna?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus akun <strong>{deletingUser.name}</strong> ({deletingUser.email})? Pengguna ini tidak akan bisa lagi mengakses portal admin.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={submitting}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors disabled:opacity-50"
              >
                {submitting ? 'Menghapus...' : 'Ya, Hapus Akun'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
