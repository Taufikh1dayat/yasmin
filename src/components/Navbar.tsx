'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  PhoneCall, 
  ExternalLink, 
  FileText, 
  MapPin, 
  Info, 
  Send,
  Scale
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang YASMIN', href: '/profil' },
    { name: 'Helpdesk Wilayah', href: '/#posko-wilayah' },
    { name: 'Publikasi & Riset', href: '/publikasi' },
    { name: 'Pengaduan Kasus', href: '/pengaduan' },
  ];

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

      {/* Main Navigation Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3' 
          : 'bg-white shadow-sm py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Resmi YASMIN (Transparan & Diperbesar) */}
            <Link href="/" className="flex items-center group py-1">
              <img
                src="/images/yasmin_logo.png"
                alt="YASMIN - Yayasan Studi Migran Indonesia"
                className="h-14 sm:h-16 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? 'text-brand-green-700 bg-brand-green-50'
                        : 'text-slate-700 hover:text-brand-blue-900 hover:bg-slate-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Button */}
            <div className="hidden lg:flex items-center gap-3">
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
          <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100">
              <Link
                href="/pengaduan"
                onClick={() => setIsOpen(false)}
                className="w-full bg-gradient-to-r from-brand-green-600 to-brand-teal-600 text-white px-4 py-3 rounded-lg text-center font-bold block shadow"
              >
                Laporkan Kasus Sekarang
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
