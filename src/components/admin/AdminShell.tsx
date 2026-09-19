'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FileText, 
  Building2, 
  Newspaper, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  User, 
  ShieldAlert,
  Inbox,
  Scale,
  Settings
} from 'lucide-react';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Jika sedang di halaman login, tampilkan tanpa shell sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  const navItems: NavItem[] = [
    { name: 'Ringkasan Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manajemen Pengaduan', href: '/admin/pengaduan', icon: Inbox },
    { name: 'Warta & Berita', href: '/admin/berita', icon: Newspaper },
    { name: 'Katalog Publikasi', href: '/admin/publikasi', icon: FileText },
    { name: 'Kantor Helpdesk', href: '/admin/cabang', icon: Building2 },
    { name: 'Pengaturan & Akun', href: '/admin/pengaturan', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-2">
          <div className="bg-white px-2 py-1 rounded-lg">
            <img src="/images/yasmin_logo.png" alt="YASMIN" className="h-8 w-auto object-contain" />
          </div>
          <span className="font-extrabold text-sm">YASMIN Admin</span>
        </div>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-1 text-slate-300">
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        ${isMobileOpen ? 'block' : 'hidden'} md:block
        w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col justify-between p-5 z-20
      `}>
        <div className="space-y-6">
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 pb-5 border-b border-slate-800">
            <div className="bg-white px-3 py-2 rounded-2xl shadow-sm">
              <img src="/images/yasmin_logo.png" alt="YASMIN" className="h-12 w-auto object-contain" />
            </div>
            <div>
              <span className="text-sm font-black text-white block">PANEL ADMIN</span>
              <span className="text-[10px] text-emerald-400 font-semibold">Yayasan Studi Migran</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions Bottom */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <Link 
            href="/admin/pengaturan"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 transition-colors group cursor-pointer"
            title="Kelola Akun & Kata Sandi"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30 flex items-center justify-center font-bold text-xs transition-colors">
              <User className="w-4 h-4" />
            </div>
            <div className="truncate text-xs flex-1">
              <span className="text-white font-bold block truncate group-hover:text-emerald-300 transition-colors">Admin YASMIN</span>
              <span className="text-slate-400 text-[10px] truncate block">admin@yasmin.or.id</span>
            </div>
            <Settings className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              target="_blank"
              className="py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-colors"
            >
              <span>Web Publik</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="py-2 px-2.5 rounded-lg bg-red-900/40 hover:bg-red-900/60 text-red-300 hover:text-red-200 text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 py-3.5 px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
              Fase 2: Sistem Admin Aktif
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-500 hidden sm:inline">
              Database: <strong className="font-mono text-emerald-700">yasmin_portal_db</strong>
            </span>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 font-bold text-brand-blue-900 hover:text-emerald-700 transition-colors"
            >
              <span>Lihat Web Pengunjung</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Page Children Container */}
        <div className="p-6 sm:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
