'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Search, CheckCircle2, ChevronRight, Building2, Globe2 } from 'lucide-react';
import Link from 'next/link';

interface BranchItem {
  id: string;
  name: string;
  region: string;
  province: string;
  city: string;
  address: string;
  phone: string | null;
  hotline: string;
  email: string;
  corridorType?: string; // 'Kantong Asal PMI' | 'Koridor Transit / Perbatasan' | 'Pusat Koordinasi'
}

const OFFICIAL_BRANCHES: BranchItem[] = [
  {
    id: 'b-jkt',
    name: 'Sekretariat Nasional YASMIN Jakarta',
    region: 'Jawa',
    province: 'DKI Jakarta',
    city: 'Jakarta Pusat',
    address: 'Jl. Salemba Tengah No. 42, Paseban, Senen, Jakarta Pusat 10440',
    phone: '(021) 3908812',
    hotline: '081198765431',
    email: 'seknas@yasmin.or.id',
    corridorType: 'Pusat Koordinasi Nasional',
  },
  {
    id: 'b-jbr',
    name: 'YASMIN Helpdesk Jawa Barat (Indramayu & Cirebon)',
    region: 'Jawa',
    province: 'Jawa Barat',
    city: 'Indramayu',
    address: 'Jl. Mayor Dasuki No. 118, Jatibarang, Kab. Indramayu',
    phone: '(0234) 351299',
    hotline: '081222334451',
    email: 'jabar@yasmin.or.id',
    corridorType: 'Kantong Utama PMI Domestik',
  },
  {
    id: 'b-jtg',
    name: 'YASMIN Helpdesk Jawa Tengah (Cilacap & Brebes)',
    region: 'Jawa',
    province: 'Jawa Tengah',
    city: 'Cilacap',
    address: 'Jl. Gatot Subroto No. 89, Cilacap Tengah, Kab. Cilacap',
    phone: '(0282) 534211',
    hotline: '081222334452',
    email: 'jateng@yasmin.or.id',
    corridorType: 'Kantong PMI Perikanan & ABK',
  },
  {
    id: 'b-jtm',
    name: 'YASMIN Helpdesk Jawa Timur (Surabaya & Malang)',
    region: 'Jawa',
    province: 'Jawa Timur',
    city: 'Surabaya',
    address: 'Jl. Gayungsari Barat No. 34, Wonocolo, Surabaya',
    phone: '(031) 8291433',
    hotline: '081222334453',
    email: 'jatim@yasmin.or.id',
    corridorType: 'Kantong PMI Asia Timur',
  },
  {
    id: 'b-ntb',
    name: 'YASMIN Helpdesk NTB (Mataram & Lombok Timur)',
    region: 'Nusa Tenggara',
    province: 'Nusa Tenggara Barat',
    city: 'Mataram',
    address: 'Jl. Pejanggik No. 72, Cakranegara, Kota Mataram, NTB',
    phone: '(0370) 641209',
    hotline: '081222334454',
    email: 'ntb@yasmin.or.id',
    corridorType: 'Kantong Utama PMI Malaysia & Timur Tengah',
  },
  {
    id: 'b-ntt',
    name: 'YASMIN Helpdesk NTT (Kupang & Flores)',
    region: 'Nusa Tenggara',
    province: 'Nusa Tenggara Timur',
    city: 'Kupang',
    address: 'Jl. Timor Raya Km. 7, Oesapa, Kelapa Lima, Kota Kupang, NTT',
    phone: '(0380) 855210',
    hotline: '081222334455',
    email: 'ntt@yasmin.or.id',
    corridorType: 'Fokus Penanganan TPPO & Perkebunan',
  },
  {
    id: 'b-smt',
    name: 'YASMIN Helpdesk Sumatera Utara (Medan & Asahan)',
    region: 'Sumatera',
    province: 'Sumatera Utara',
    city: 'Medan',
    address: 'Jl. STM No. 58, Suka Maju, Medan Johor, Kota Medan',
    phone: '(061) 7864321',
    hotline: '081222334456',
    email: 'sumut@yasmin.or.id',
    corridorType: 'Koridor Transit Selat Malaka',
  },
  {
    id: 'b-lmp',
    name: 'YASMIN Helpdesk Lampung (Bandar Lampung)',
    region: 'Sumatera',
    province: 'Lampung',
    city: 'Bandar Lampung',
    address: 'Jl. Zainal Abidin Pagar Alam No. 25, Kedaton, Bandar Lampung',
    phone: '(0721) 701890',
    hotline: '081222334457',
    email: 'lampung@yasmin.or.id',
    corridorType: 'Kantong Asal PMI Sumatera',
  },
  {
    id: 'b-btm',
    name: 'YASMIN Helpdesk Kepulauan Riau (Batam & Tanjungpinang)',
    region: 'Sumatera',
    province: 'Kepulauan Riau',
    city: 'Batam',
    address: 'Ruko Mega Legenda Blok B No. 12, Batam Center, Kota Batam',
    phone: '(0778) 467812',
    hotline: '081222334459',
    email: 'kepri@yasmin.or.id',
    corridorType: 'Titik Tanggap Darurat Deportasi & Transit',
  },
  {
    id: 'b-klb',
    name: 'YASMIN Helpdesk Kalimantan Barat (Sambas & Entikong)',
    region: 'Kalimantan',
    province: 'Kalimantan Barat',
    city: 'Pontianak',
    address: 'Jl. Gusti Hamzah No. 19, Pontianak Kota, Kalimantan Barat',
    phone: '(0561) 745312',
    hotline: '081222334458',
    email: 'kalbar@yasmin.or.id',
    corridorType: 'Posko Siaga Perbatasan Darat Sarawak',
  },
  {
    id: 'b-sls',
    name: 'YASMIN Helpdesk Sulawesi Selatan (Makassar & Parepare)',
    region: 'Sulawesi',
    province: 'Sulawesi Selatan',
    city: 'Makassar',
    address: 'Jl. Perintis Kemerdekaan Km. 10, Tamalanrea, Kota Makassar',
    phone: '(0411) 587123',
    hotline: '081222334460',
    email: 'sulsel@yasmin.or.id',
    corridorType: 'Pusat Pendampingan Indonesia Timur',
  }
];

export default function InteractiveMap({ branches = OFFICIAL_BRANCHES }: { branches?: BranchItem[] }) {
  const [selectedBranch, setSelectedBranch] = useState<BranchItem>(branches[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Semua');

  const regions = ['Semua', 'Jawa', 'Nusa Tenggara', 'Sumatera', 'Kalimantan', 'Sulawesi'];

  const filteredBranches = branches.filter((b) => {
    const matchesRegion = selectedRegion === 'Semua' || b.region === selectedRegion;
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.province.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <section id="posko-wilayah" className="py-20 bg-slate-100 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header yang Serius & Nyata */}
        <div className="max-w-3xl mb-12 space-y-2">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
            Jaringan Kerja Lapangan
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            11 Posko Layanan & Bantuan Hukum YASMIN di Daerah
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Posko kami ditempatkan secara strategis di kantong-kantong utama asal PMI, koridor transit perbatasan, dan pelabuhan kepulangan untuk pendampingan darurat serta pencegahan penipuan non-prosedural.
          </p>
        </div>

        {/* Filter Wilayah & Kotak Pencarian */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedRegion === region
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kota, kabupaten, atau provinsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
            />
          </div>
        </div>

        {/* Grid Direktori & Kartu Detail Kontak */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Daftar Posko Wilayah (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            {filteredBranches.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                Tidak ada posko yang cocok dengan pencarian &quot;{searchQuery}&quot;.
              </div>
            ) : (
              filteredBranches.map((b) => {
                const isSelected = selectedBranch.id === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBranch(b)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      isSelected
                        ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                          {b.province}
                        </span>
                        {b.corridorType && (
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {b.corridorType}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {b.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {b.address}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold text-emerald-700 block font-mono">
                        {b.hotline}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 inline-flex items-center gap-0.5">
                        Lihat Kontak <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Kartu Detail Posko Terpilih (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-sm sticky top-24 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                Informasi Posko Lapangan Terpilih
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                {selectedBranch.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Wilayah: {selectedBranch.province} • {selectedBranch.region}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-700 block">Alamat Kantor:</span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedBranch.address}
                </p>
              </div>

              {selectedBranch.phone && (
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Telepon Kantor:</span>
                  <span className="font-bold text-slate-800 font-mono">{selectedBranch.phone}</span>
                </div>
              )}

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Email Koordinator:</span>
                <span className="font-bold text-slate-800">{selectedBranch.email}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">WhatsApp Darurat:</span>
                <span className="font-black text-emerald-700 font-mono text-sm">{selectedBranch.hotline}</span>
              </div>
            </div>

            {/* Direct Action */}
            <div className="space-y-2.5 pt-2">
              <a
                href={`https://wa.me/62${selectedBranch.hotline.replace(/^0/, '')}?text=Halo%20YASMIN%2C%20saya%20membutuhkan%20informasi%20bantuan%20hukum%20untuk%20Pekerja%20Migran.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Hubungi Posko via WhatsApp</span>
              </a>

              <Link
                href={`/pengaduan?branch=${encodeURIComponent(selectedBranch.name)}`}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Ajukan Kasus ke Posko Ini</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
