'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  PhoneCall, 
  Send, 
  ChevronDown, 
  Heart,
  ShieldCheck
} from 'lucide-react';
import DonationModal from './DonationModal';

interface SubItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href?: string;
  children?: SubItem[];
}

const navItems: NavItem[] = [
  { 
    name: 'Beranda', 
    href: '/' 
  },
  {
    name: 'Tentang',
    children: [
      { name: 'Profil', href: '/profil#profil' },
      { name: 'Struktur Organisasi', href: '/profil#struktur-organisasi' },
      { name: 'Anggota', href: '/profil#anggota' },
      { name: 'Paralegal', href: '/profil#paralegal' },
    ],
  },
  {
    name: 'Publikasi',
    children: [
      { name: 'Laporan Tahunan / CATAHU', href: '/publikasi?category=Laporan%20Tahunan' },
      { name: 'Kertas Kebijakan', href: '/publikasi?category=Kertas%20Kebijakan' },
      { name: 'Panduan Advokasi', href: '/publikasi?category=Panduan%20Advokasi' },
      { name: 'Riset & Studi', href: '/publikasi?category=Riset%20%26%20Studi' },
    ],
  },
  {
    name: 'Kerja Kami',
    children: [
      { name: 'Bantuan Hukum & Litigasi', href: '/#mandat-advokasi' },
      { name: 'Posko Wilayah', href: '/#posko-wilayah' },
      { name: 'Pengorganisasian Desa', href: '/profil#paralegal' },
    ],
  },
  {
    name: 'Informasi',
    children: [
      { name: 'Warta & Siaran Pers', href: '/#berita-terupdate' },
      { name: 'Catatan Kasus', href: '/#berita-terupdate' },
      { name: 'Kabar Kebijakan', href: '/publikasi' },
    ],
  },
  { 
    name: 'Pengaduan', 
    href: '/pengaduan' 
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const pathname = usePathname();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);

  // Periksa apakah ada sesi admin aktif
  useEffect(() => {
    fetch('/api/admin/change-password')
      .then((res) => {
        if (res.ok) setIsAdminLoggedIn(true);
        else setIsAdminLoggedIn(false);
      })
      .catch(() => setIsAdminLoggedIn(false));
  }, [pathname]);

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Tutup dropdown jika klik di luar navbar atau tekan Escape
  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [pathname]);

  const handleMouseEnter = (name: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const toggleMobileSubmenu = (name: string) => {
    setMobileExpanded((prev) => (prev === name ? null : name));
  };

  // Sembunyikan navbar publik di seluruh rute admin (setelah semua hooks dipanggil)
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Top Banner Kedaruratan & Hotline */}
      <div className="bg-gradient-to-r from-brand-blue-900 via-brand-teal-700 to-brand-green-700 text-white text-xs py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
            </span>
            <span className="font-medium tracking-wide">
              Hotline Kedaruratan PMI 24 Jam:
            </span>
            <a 
              href="https://wa.me/6281198765431" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold underline hover:text-emerald-200 transition-colors flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3 inline" /> 0811-9876-5431 (WhatsApp)
            </a>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px] text-emerald-100">
            <span>Senin – Minggu (Layanan Respons Cepat)</span>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-white transition-colors">
              Portal Staf
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Header: Basis Putih dengan Efek Frosted Blur */}
      <header 
        ref={navContainerRef}
        className={`sticky top-0 z-50 transition-all duration-300 border-b backdrop-blur-md ${
          isScrolled 
            ? 'bg-white/90 shadow-md border-slate-200/80 py-2 sm:py-3' 
            : 'bg-white/95 shadow-sm border-slate-100 py-2 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Resmi YASMIN */}
            <Link href="/" className="flex items-center group py-0.5">
              <img
                src="/images/yasmin_logo.png"
                alt="YASMIN - Yayasan Studi Migran Indonesia"
                className="h-10 sm:h-16 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </Link>

            {/* Desktop Menu with Dropdowns */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const hasChildren = Boolean(item.children && item.children.length > 0);
                const isDropdownOpen = activeDropdown === item.name;
                const isActive = item.href ? pathname === item.href : false;

                if (!hasChildren && item.href) {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                        isActive
                          ? 'text-brand-green-700 bg-brand-green-50 font-bold'
                          : 'text-slate-700 hover:text-brand-blue-900 hover:bg-slate-100/80'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                }

                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() => toggleDropdown(item.name)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                        isDropdownOpen
                          ? 'text-brand-green-800 bg-slate-100/90 font-bold'
                          : 'text-slate-700 hover:text-brand-blue-900 hover:bg-slate-100/80'
                      }`}
                      aria-expanded={isDropdownOpen}
                    >
                      <span>{item.name}</span>
                      <ChevronDown 
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isDropdownOpen ? 'rotate-180 text-brand-green-700' : 'text-slate-500'
                        }`} 
                      />
                    </button>

                    {/* Floating Dropdown Card */}
                    {isDropdownOpen && (
                      <div 
                        className="absolute left-0 top-full pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                        onMouseEnter={() => handleMouseEnter(item.name)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="w-60 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200/90 py-2.5 px-1.5">
                          {item.children?.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              onClick={() => setActiveDropdown(null)}
                              className="block px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:text-brand-blue-900 hover:bg-emerald-50/70 rounded-lg transition-colors"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Action Buttons: Donasi & Laporkan Kasus */}
            <div className="hidden lg:flex items-center gap-2.5">
              {isAdminLoggedIn && (
                <Link
                  href="/admin/dashboard"
                  className="bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700 px-3 py-2 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                  title="Kembali ke Panel Admin"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Panel Admin</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => setIsDonationOpen(true)}
                className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:via-amber-700 hover:to-orange-600 text-white px-3.5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
              >
                <Heart className="w-4 h-4 fill-white/90 text-white" />
                <span>Donasi</span>
              </button>

              <Link
                href="/pengaduan"
                className="bg-gradient-to-r from-brand-green-600 to-brand-teal-600 hover:from-brand-green-700 hover:to-brand-teal-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Laporkan Kasus</span>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-xl px-4 pt-3 pb-6 space-y-1.5 max-h-[85vh] overflow-y-auto">
            {navItems.map((item) => {
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const isExpanded = mobileExpanded === item.name;

              if (!hasChildren && item.href) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3.5 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    {item.name}
                  </Link>
                );
              }

              return (
                <div key={item.name} className="rounded-lg overflow-hidden border border-slate-100">
                  <button
                    type="button"
                    onClick={() => toggleMobileSubmenu(item.name)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-base font-semibold text-slate-700 bg-slate-50/70 hover:bg-slate-100 transition-colors"
                  >
                    <span>{item.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-brand-green-700' : 'text-slate-400'}`} />
                  </button>

                  {isExpanded && (
                    <div className="bg-white px-2 py-1.5 space-y-1 border-t border-slate-100">
                      {item.children?.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          onClick={() => setIsOpen(false)}
                          className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-green-800 hover:bg-emerald-50/60 rounded-md transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsDonationOpen(true);
                }}
                className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:via-amber-700 hover:to-orange-600 text-white px-3 py-2.5 rounded-lg text-center font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow"
              >
                <Heart className="w-4 h-4 fill-white/90 text-white" />
                <span>Donasi</span>
              </button>

              <Link
                href="/pengaduan"
                onClick={() => setIsOpen(false)}
                className="w-full bg-gradient-to-r from-brand-green-600 to-brand-teal-600 text-white px-3 py-2.5 rounded-lg text-center font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow"
              >
                <Send className="w-4 h-4" />
                <span>Laporkan</span>
              </Link>
            </div>

            {isAdminLoggedIn && (
              <div className="pt-2">
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-slate-900 text-emerald-400 border border-slate-700 px-3 py-2.5 rounded-lg text-center font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Kembali ke Panel Admin</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Dialog Modal Donasi Interaktif */}
      <DonationModal 
        isOpen={isDonationOpen} 
        onClose={() => setIsDonationOpen(false)} 
      />
    </>
  );
}
