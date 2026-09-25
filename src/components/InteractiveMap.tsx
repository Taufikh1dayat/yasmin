'use client';

import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Search, 
  ChevronRight, 
  ChevronLeft,
  Building2, 
  ExternalLink,
  X,
  Compass,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { INDONESIA_MAP_SVG_INNER } from './indonesiaMapData';

export interface BranchItem {
  id: string;
  name: string;
  region: string;
  province: string;
  city: string;
  address: string;
  phone: string | null;
  hotline: string;
  email: string;
  lat?: number;
  lng?: number;
  corridorType?: string;
  isActive?: boolean;
}

export const OFFICIAL_BRANCHES: BranchItem[] = [
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
    lat: -6.1934,
    lng: 106.8523,
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
    lat: -6.3263,
    lng: 108.3200,
    corridorType: 'Kantong Utama PMI Domestik',
  },
  {
    id: 'b-jtg',
    name: 'YASMIN Helpdesk Jawa Tengah (Cilacap)',
    region: 'Jawa',
    province: 'Jawa Tengah',
    city: 'Cilacap',
    address: 'Jl. Gatot Subroto No. 89, Cilacap Tengah, Kab. Cilacap',
    phone: '(0282) 534211',
    hotline: '081222334452',
    email: 'jateng@yasmin.or.id',
    lat: -7.7056,
    lng: 109.0156,
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
    lat: -7.3197,
    lng: 112.7241,
    corridorType: 'Kantong PMI Asia Timur',
  },
  {
    id: 'b-bli',
    name: 'YASMIN Helpdesk Bali (Denpasar)',
    region: 'Bali-Nusa Tenggara',
    province: 'Bali',
    city: 'Denpasar',
    address: 'Jl. Teuku Umar No. 88, Denpasar Barat, Kota Denpasar',
    phone: '(0361) 234567',
    hotline: '081222334462',
    email: 'bali@yasmin.or.id',
    lat: -8.6705,
    lng: 115.2126,
    corridorType: 'Posko PMI Pariwisata & Kapal Pesiar',
  },
  {
    id: 'b-ntb',
    name: 'YASMIN Helpdesk NTB (Mataram & Lombok Timur)',
    region: 'Bali-Nusa Tenggara',
    province: 'Nusa Tenggara Barat',
    city: 'Mataram',
    address: 'Jl. Pejanggik No. 72, Cakranegara, Kota Mataram, NTB',
    phone: '(0370) 641209',
    hotline: '081222334454',
    email: 'ntb@yasmin.or.id',
    lat: -8.5833,
    lng: 116.1167,
    corridorType: 'Kantong Utama PMI Malaysia & Timur Tengah',
  },
  {
    id: 'b-ntt',
    name: 'YASMIN Helpdesk NTT (Kupang)',
    region: 'Bali-Nusa Tenggara',
    province: 'Nusa Tenggara Timur',
    city: 'Kupang',
    address: 'Jl. Timor Raya Km. 7, Oesapa, Kelapa Lima, Kota Kupang, NTT',
    phone: '(0380) 855210',
    hotline: '081222334455',
    email: 'ntt@yasmin.or.id',
    lat: -10.1772,
    lng: 123.6070,
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
    lat: 3.5512,
    lng: 98.6833,
    corridorType: 'Koridor Transit Selat Malaka',
  },
  {
    id: 'b-smb',
    name: 'YASMIN Helpdesk Sumatera Barat (Padang)',
    region: 'Sumatera',
    province: 'Sumatera Barat',
    city: 'Padang',
    address: 'Jl. Khatib Sulaiman No. 32, Ulak Karang Selatan, Kota Padang',
    phone: '(0751) 445566',
    hotline: '081222334463',
    email: 'sumbar@yasmin.or.id',
    lat: -0.9242,
    lng: 100.3627,
    corridorType: 'Kantong Asal PMI Kawasan Barat',
  },
  {
    id: 'b-btm',
    name: 'YASMIN Helpdesk Kepulauan Riau (Batam Corridor)',
    region: 'Sumatera',
    province: 'Kepulauan Riau',
    city: 'Batam',
    address: 'Ruko Mega Legenda Blok B No. 12, Batam Center, Kota Batam',
    phone: '(0778) 467812',
    hotline: '081222334459',
    email: 'kepri@yasmin.or.id',
    lat: 1.1294,
    lng: 104.0530,
    corridorType: 'Titik Tanggap Darurat Deportasi & Transit',
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
    lat: -5.3831,
    lng: 105.2577,
    corridorType: 'Kantong Asal PMI Sumatera',
  },
  {
    id: 'b-klb',
    name: 'YASMIN Helpdesk Kalimantan Barat (Sambas & Pontianak)',
    region: 'Kalimantan',
    province: 'Kalimantan Barat',
    city: 'Pontianak',
    address: 'Jl. Gusti Hamzah No. 19, Pontianak Kota, Kalimantan Barat',
    phone: '(0561) 745312',
    hotline: '081222334458',
    email: 'kalbar@yasmin.or.id',
    lat: -0.0263,
    lng: 109.3425,
    corridorType: 'Posko Siaga Perbatasan Darat Sarawak',
  },
  {
    id: 'b-klt',
    name: 'YASMIN Helpdesk Kalimantan Timur (Samarinda)',
    region: 'Kalimantan',
    province: 'Kalimantan Timur',
    city: 'Samarinda',
    address: 'Jalan Sultan Sulaiman, Perum Citra Gading Blok B2 No. 9 Samarinda – Kalimantan Timur',
    phone: '(0541) 741289',
    hotline: '08125822715',
    email: 'kaltim@yasmin.or.id',
    lat: -0.5022,
    lng: 117.1536,
    corridorType: 'Koridor Siaga Perbatasan Sabah & Transit',
  },
  {
    id: 'b-sls',
    name: 'YASMIN Helpdesk Sulawesi Selatan (Makassar)',
    region: 'Sulawesi',
    province: 'Sulawesi Selatan',
    city: 'Makassar',
    address: 'Jl. Perintis Kemerdekaan Km. 10, Tamalanrea, Kota Makassar',
    phone: '(0411) 587123',
    hotline: '081222334460',
    email: 'sulsel@yasmin.or.id',
    lat: -5.1354,
    lng: 119.4930,
    corridorType: 'Pusat Pendampingan Indonesia Timur',
  },
  {
    id: 'b-slt',
    name: 'YASMIN Helpdesk Sulawesi Tengah (Palu)',
    region: 'Sulawesi',
    province: 'Sulawesi Tengah',
    city: 'Palu',
    address: 'Jl. Moh. Hatta No. 18, Lolu Utara, Kota Palu, Sulawesi Tengah',
    phone: '(0451) 421098',
    hotline: '081222334465',
    email: 'sulteng@yasmin.or.id',
    lat: -0.8917,
    lng: 119.8707,
    corridorType: 'Posko Pendampingan Kawasan Teluk Tomini',
  },
  {
    id: 'b-slu',
    name: 'YASMIN Helpdesk Sulawesi Utara (Manado & Bitung)',
    region: 'Sulawesi',
    province: 'Sulawesi Utara',
    city: 'Manado',
    address: 'Jl. Sam Ratulangi No. 120, Wanea, Kota Manado, Sulawesi Utara',
    phone: '(0431) 865432',
    hotline: '081222334464',
    email: 'sulut@yasmin.or.id',
    lat: 1.4748,
    lng: 124.8428,
    corridorType: 'Posko Pengawasan Perbatasan Laut Filipina',
  },
  {
    id: 'b-mlk',
    name: 'YASMIN Helpdesk Maluku (Ambon)',
    region: 'Maluku',
    province: 'Maluku',
    city: 'Ambon',
    address: 'Jl. Pattimura No. 15, Uritetu, Sirimau, Kota Ambon, Maluku',
    phone: '(0911) 354321',
    hotline: '081222334466',
    email: 'maluku@yasmin.or.id',
    lat: -3.6954,
    lng: 128.1814,
    corridorType: 'Posko PMI Sektor Kelautan & Perikanan',
  },
  {
    id: 'b-pap',
    name: 'YASMIN Helpdesk Papua (Jayapura & Merauke)',
    region: 'Papua',
    province: 'Papua',
    city: 'Jayapura',
    address: 'Jl. Raya Abepura No. 45, Kotaraja, Jayapura, Papua',
    phone: '(0967) 532109',
    hotline: '081222334461',
    email: 'papua@yasmin.or.id',
    lat: -2.5916,
    lng: 140.6690,
    corridorType: 'Posko Siaga Perbatasan Darat PNG',
  }
];

// Presisi koordinat titik pin pada peta SVG Indonesia (viewBox 2021x922)
const COORDINATE_PRESETS: Record<string, { x: number; y: number }> = {
  // Posko spesifik
  'Sekretariat Nasional YASMIN Jakarta': { x: 26.5, y: 75.4 },
  'YASMIN Helpdesk Jawa Barat (Indramayu & Cirebon)': { x: 28.7, y: 76.5 },
  'YASMIN Helpdesk Jawa Tengah (Cilacap)': { x: 31.4, y: 80.5 },
  'YASMIN Helpdesk Jawa Tengah (Cilacap & Brebes)': { x: 31.4, y: 80.5 },
  'YASMIN Helpdesk Jawa Timur (Surabaya & Malang)': { x: 37.4, y: 80.8 },
  'YASMIN Helpdesk Bali (Denpasar)': { x: 42.3, y: 86.2 },
  'YASMIN Helpdesk NTB (Mataram & Lombok Timur)': { x: 44.8, y: 86.8 },
  'YASMIN Helpdesk NTT (Kupang)': { x: 61.4, y: 91.1 },
  'YASMIN Helpdesk NTT (Kupang & Flores)': { x: 61.4, y: 91.1 },
  'YASMIN Helpdesk Sumatera Utara (Medan & Asahan)': { x: 8.7, y: 26.0 },
  'YASMIN Helpdesk Sumatera Barat (Padang)': { x: 12.0, y: 47.0 },
  'YASMIN Helpdesk Kepulauan Riau (Batam Corridor)': { x: 17.8, y: 40.1 },
  'YASMIN Helpdesk Kepulauan Riau (Batam & Tanjungpinang)': { x: 17.8, y: 40.1 },
  'YASMIN Helpdesk Lampung (Bandar Lampung)': { x: 20.5, y: 68.3 },
  'YASMIN Helpdesk Kalimantan Barat (Sambas & Pontianak)': { x: 29.2, y: 49.9 },
  'YASMIN Helpdesk Kalimantan Barat (Sambas & Entikong)': { x: 29.2, y: 49.9 },
  'YASMIN Helpdesk Kalimantan Timur (Samarinda)': { x: 39.3, y: 46.6 },
  'YASMIN Helpdesk Kalimantan Timur (Samarinda & Balikpapan)': { x: 39.3, y: 46.6 },
  'YASMIN Helpdesk Sulawesi Selatan (Makassar)': { x: 48.7, y: 71.6 },
  'YASMIN Helpdesk Sulawesi Selatan (Makassar & Parepare)': { x: 48.7, y: 71.6 },
  'YASMIN Helpdesk Sulawesi Tengah (Palu)': { x: 51.0, y: 53.0 },
  'YASMIN Helpdesk Sulawesi Utara (Manado & Bitung)': { x: 58.4, y: 34.7 },
  'YASMIN Helpdesk Maluku (Ambon)': { x: 69.0, y: 61.0 },
  'YASMIN Helpdesk Papua (Jayapura & Merauke)': { x: 94.5, y: 57.5 },

  // Wilayah / Provinsi fallback
  'DKI Jakarta': { x: 26.5, y: 75.4 },
  'Jawa Barat': { x: 28.7, y: 76.5 },
  'Jawa Tengah': { x: 31.4, y: 80.5 },
  'DI Yogyakarta': { x: 32.8, y: 81.0 },
  'Jawa Timur': { x: 37.4, y: 80.8 },
  'Bali': { x: 42.3, y: 86.2 },
  'Nusa Tenggara Barat': { x: 44.8, y: 86.8 },
  'Nusa Tenggara Timur': { x: 61.4, y: 91.1 },
  'Aceh': { x: 4.5, y: 15.0 },
  'Sumatera Utara': { x: 8.7, y: 26.0 },
  'Sumatera Barat': { x: 12.0, y: 47.0 },
  'Riau': { x: 15.5, y: 42.0 },
  'Kepulauan Riau': { x: 17.8, y: 40.1 },
  'Jambi': { x: 17.0, y: 51.0 },
  'Bengkulu': { x: 14.5, y: 60.0 },
  'Sumatera Selatan': { x: 18.5, y: 57.0 },
  'Lampung': { x: 20.5, y: 68.3 },
  'Kalimantan Barat': { x: 29.2, y: 49.9 },
  'Kalimantan Tengah': { x: 35.6, y: 53.0 },
  'Kalimantan Selatan': { x: 37.6, y: 59.0 },
  'Kalimantan Timur': { x: 39.3, y: 46.6 },
  'Kalimantan Utara': { x: 40.5, y: 35.0 },
  'Sulawesi Selatan': { x: 48.7, y: 71.6 },
  'Sulawesi Barat': { x: 47.0, y: 60.0 },
  'Sulawesi Tengah': { x: 51.0, y: 53.0 },
  'Sulawesi Tenggara': { x: 55.4, y: 66.5 },
  'Gorontalo': { x: 57.5, y: 42.0 },
  'Sulawesi Utara': { x: 58.4, y: 34.7 },
  'Maluku': { x: 69.0, y: 61.0 },
  'Maluku Utara': { x: 69.5, y: 43.0 },
  'Papua Barat': { x: 76.5, y: 53.0 },
  'Papua': { x: 94.5, y: 57.5 },
};

function getCoordinates(branch: BranchItem): { x: number; y: number } {
  if (COORDINATE_PRESETS[branch.name]) {
    return COORDINATE_PRESETS[branch.name];
  }
  if (COORDINATE_PRESETS[branch.province]) {
    return COORDINATE_PRESETS[branch.province];
  }
  if (branch.lat !== undefined && branch.lng !== undefined && branch.lat !== 0 && branch.lng !== 0) {
    const xPct = Math.max(3, Math.min(97, ((branch.lng - 95.0) / 46.0) * 100));
    const yPct = Math.max(8, Math.min(92, ((6.0 - branch.lat) / 17.0) * 100));
    return { x: xPct, y: yPct };
  }
  return { x: 50, y: 50 };
}

export default function InteractiveMap({ branches = OFFICIAL_BRANCHES }: { branches?: BranchItem[] }) {
  // Set default posko terpilih ke Kalimantan Timur (Samarinda) atau posko pertama
  const initialBranch = branches.find((b) => b.province.includes('Kalimantan Timur')) || branches[0];
  const [selectedBranch, setSelectedBranch] = useState<BranchItem>(initialBranch);
  const [isPopoverOpen, setIsPopoverOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Semua');
  const [isShowingAll, setIsShowingAll] = useState(false);

  const regions = ['Semua', 'Sumatera', 'Jawa', 'Bali-Nusa Tenggara', 'Kalimantan', 'Sulawesi', 'Maluku', 'Papua'];

  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      const matchesRegion =
        selectedRegion === 'Semua' ||
        b.region.toLowerCase().includes(selectedRegion.toLowerCase()) ||
        (selectedRegion === 'Bali-Nusa Tenggara' && (b.region.includes('Bali') || b.region.includes('Nusa Tenggara')));

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.province.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q);

      return matchesRegion && matchesSearch;
    });
  }, [branches, selectedRegion, searchQuery]);

  const activeCoord = getCoordinates(selectedBranch);

  const currentIndex = branches.findIndex((b) => b.id === selectedBranch.id);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;

  const handlePrevBranch = () => {
    const prevIdx = (safeIndex - 1 + branches.length) % branches.length;
    setSelectedBranch(branches[prevIdx]);
    setIsPopoverOpen(true);
  };

  const handleNextBranch = () => {
    const nextIdx = (safeIndex + 1) % branches.length;
    setSelectedBranch(branches[nextIdx]);
    setIsPopoverOpen(true);
  };

  const handleSelectBranch = (b: BranchItem) => {
    setSelectedBranch(b);
    setIsPopoverOpen(true);
  };

  const handleCardClick = (b: BranchItem) => {
    setSelectedBranch(b);
    setIsPopoverOpen(true);
    const mapEl = document.getElementById('peta-interaktif-indonesia');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section id="posko-wilayah" className="py-12 sm:py-24 bg-[#1f0d38] text-white overflow-hidden relative border-t border-purple-900/40">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-10">
        {/* Title Header */}
        <div className="text-center max-w-4xl mx-auto space-y-2 sm:space-y-3 px-2">
          <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase text-purple-300 bg-purple-900/60 px-3 py-1 rounded-full border border-purple-500/30 inline-flex items-center gap-1.5 shadow-sm">
            <Compass className="w-3.5 h-3.5 text-pink-400 shrink-0" />
            <span>JARINGAN KERJA LAPANGAN & ADVOKASI</span>
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-5xl font-black uppercase tracking-tight text-white drop-shadow-md leading-tight">
            {branches.length} Kantor Helpdesk & Posko YASMIN di Indonesia
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-2xl mx-auto leading-relaxed">
            Klik atau sentuh titik posko pada peta di bawah ini untuk melihat sekretariat posko, kontak hotline darurat, serta rujukan bantuan hukum setempat.
          </p>
        </div>

        {/* CONTAINER PETA INTERAKTIF INDONESIA */}
        <div 
          id="peta-interaktif-indonesia"
          className="relative w-full rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#250f45] via-[#1f0c3a] to-[#18082e] border border-purple-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Inner Padding Wrap untuk Peta */}
          <div className="relative w-full p-2 sm:p-6">
            {/* Petunjuk sentuh di mobile */}
            <div className="sm:hidden absolute top-4 left-4 z-10 pointer-events-none">
              <span className="text-[10px] font-semibold text-purple-300/90 bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-500/30 backdrop-blur-sm shadow-sm">
                Sentuh titik pulau untuk melihat posko
              </span>
            </div>

            {/* Peta Background & Pinpoints Container (Strict Aspect Ratio) */}
            <div className="relative w-full aspect-[2021/922] select-none mx-auto max-w-5xl">
            {/* Gambar Siluet Putih Peta Indonesia (Inline SVG Vektor Bebas Error) */}
            <svg
              viewBox="0 0 2021 922"
              className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.55)] select-none"
              style={{
                fillRule: 'evenodd',
                clipRule: 'evenodd',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeMiterlimit: 1.5,
              }}
              dangerouslySetInnerHTML={{ __html: INDONESIA_MAP_SVG_INNER }}
            />

            {/* Titik-titik Pinpoint Posko di Peta */}
            {branches.map((b) => {
              const coord = getCoordinates(b);
              const isSelected = selectedBranch.id === b.id;

              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleSelectBranch(b)}
                  onMouseEnter={() => handleSelectBranch(b)}
                  aria-label={b.name}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group focus:outline-none p-1.5 sm:p-2"
                  style={{
                    left: `${coord.x}%`,
                    top: `${coord.y}%`,
                  }}
                >
                  {/* Ping animasi HANYA untuk titik yang sedang aktif */}
                  {isSelected && (
                    <span className="absolute inset-1 sm:inset-0.5 rounded-full bg-pink-400 opacity-75 animate-ping" />
                  )}
                  
                  {/* Dot Utama */}
                  <span className={`relative block rounded-full transition-all duration-200 ${
                    isSelected 
                      ? 'w-2.5 h-2.5 sm:w-4 sm:h-4 bg-pink-300 border-[1.5px] border-white shadow-[0_0_10px_#f472b6] scale-125' 
                      : 'w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-pink-500 border border-white/80 shadow-sm group-hover:scale-125 group-hover:bg-pink-300'
                  }`} />
                </button>
              );
            })}

            {/* KARTU POPOVER KANTOR TERPILIH - KHUSUS DESKTOP (Floating Info Card) */}
            {isPopoverOpen && selectedBranch && (
              <div 
                className="hidden sm:block absolute z-30 p-5 rounded-2xl bg-[#2a1048]/95 backdrop-blur-md border border-purple-400/40 text-white shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all animate-in fade-in duration-200 sm:w-80 md:w-88"
                style={{
                  left: (activeCoord.x > 55 ? undefined : `${Math.max(2, activeCoord.x + 1.5)}%`),
                  right: (activeCoord.x > 55 ? `${Math.max(2, 100 - activeCoord.x + 1.5)}%` : undefined),
                  top: `${Math.max(6, Math.min(58, activeCoord.y - 10))}%`,
                }}
              >
                {/* Header Card dengan Badge Wilayah & Tombol Tutup */}
                <div className="flex items-start justify-between gap-2 border-b border-purple-800/80 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-pink-300 bg-pink-900/50 px-2 py-0.5 rounded border border-pink-500/30">
                      {selectedBranch.province}
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-white leading-snug mt-1">
                      {selectedBranch.name}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setIsPopoverOpen(false)}
                    className="p-1 rounded-lg text-purple-300 hover:text-white hover:bg-purple-800/60 transition-colors shrink-0"
                    title="Tutup Kartu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body Card: Alamat & Hotline */}
                <div className="py-3 space-y-2.5 text-xs">
                  <div className="flex items-start gap-2 text-purple-200/90 leading-relaxed">
                    <MapPin className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                    <span>{selectedBranch.address}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-pink-200 pt-1 border-t border-purple-900/60">
                    <Phone className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    <span>Hotline: <strong className="font-mono text-white text-sm">{selectedBranch.hotline}</strong></span>
                  </div>

                  {selectedBranch.phone && (
                    <div className="text-[11px] text-purple-300 pl-5.5">
                      Telepon Kantor: <span className="font-mono text-white">{selectedBranch.phone}</span>
                    </div>
                  )}
                </div>

                {/* Tombol Aksi: Contact / Hubungi (White Button Style) */}
                <div className="pt-2 space-y-2">
                  <a
                    href={`https://wa.me/62${selectedBranch.hotline.replace(/^0/, '').replace(/[^0-9]/g, '')}?text=Halo%20YASMIN%2C%20saya%20membutuhkan%20informasi%20bantuan%20hukum%20untuk%20Pekerja%20Migran.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#1f0d38] font-black text-xs text-center flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                  >
                    <span>Contact / Hubungi</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#1f0d38]" />
                  </a>

                  <Link
                    href={`/pengaduan?branch=${encodeURIComponent(selectedBranch.name)}`}
                    className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] text-center block transition-colors border border-white/10"
                  >
                    Ajukan Kasus ke Posko Ini
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE DEDICATED POSKO CARD (KHUSUS SMARTPHONE) */}
          {/* Diletakkan di bawah peta sehingga peta Indonesia tetap terlihat 100% utuh tanpa tertutup kartu */}
          {selectedBranch && (
            <div className="block sm:hidden p-4 bg-[#1f0b37] border-t border-purple-500/30 transition-all duration-200">
              {/* Header Posko Mobile dengan Navigasi Next/Prev */}
              <div className="flex items-center justify-between gap-2 border-b border-purple-800/70 pb-2.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider text-pink-300 bg-pink-900/60 px-2 py-0.5 rounded border border-pink-500/30">
                    {selectedBranch.province}
                  </span>
                  <span className="text-[10px] font-bold text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded">
                    {selectedBranch.region}
                  </span>
                </div>

                {/* Tombol Ganti Posko Cepat di Mobile */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={handlePrevBranch}
                    className="p-1.5 rounded-lg bg-purple-900/70 hover:bg-purple-800 text-purple-200 active:scale-90 transition-transform"
                    aria-label="Posko Sebelumnya"
                    title="Posko Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-mono font-bold text-pink-300 px-1">
                    {safeIndex + 1}/{branches.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextBranch}
                    className="p-1.5 rounded-lg bg-purple-900/70 hover:bg-purple-800 text-purple-200 active:scale-90 transition-transform"
                    aria-label="Posko Selanjutnya"
                    title="Posko Selanjutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Judul & Detail Cabang Mobile */}
              <div className="pt-2.5 pb-1.5 space-y-1.5">
                <h3 className="font-extrabold text-sm text-white leading-snug">
                  {selectedBranch.name.replace('YASMIN Helpdesk ', '')}
                </h3>
                <div className="flex items-start gap-2 text-[11px] text-purple-200/90 leading-relaxed">
                  <MapPin className="w-3.5 h-3.5 text-pink-400 mt-0.5 shrink-0" />
                  <span>{selectedBranch.address}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-pink-200 pt-0.5">
                  <Phone className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span>Hotline: <strong className="font-mono text-white text-xs">{selectedBranch.hotline}</strong></span>
                </div>
              </div>

              {/* Tombol Aksi di Mobile */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/62${selectedBranch.hotline.replace(/^0/, '').replace(/[^0-9]/g, '')}?text=Halo%20YASMIN%2C%20saya%20membutuhkan%20informasi%20bantuan%20hukum%20untuk%20Pekerja%20Migran.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-[#1f0d38] font-black text-xs text-center flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
                >
                  <span>Hubungi WA</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#1f0d38]" />
                </a>

                <Link
                  href={`/pengaduan?branch=${encodeURIComponent(selectedBranch.name)}`}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs text-center flex items-center justify-center transition-all shadow-md active:scale-95"
                >
                  Ajukan Kasus
                </Link>
              </div>
            </div>
          )}

          {/* Baris Informasi Petunjuk di Bawah Peta */}
          <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#18072b] border-t border-purple-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-purple-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse shrink-0 inline-block" />
              <span className="text-[11px] sm:text-xs">Titik merah muda menunjukkan 18 posko aktif YASMIN.</span>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 text-[11px] sm:text-xs">
              <span className="font-mono text-pink-300 font-bold">{branches.length} Posko Terverifikasi</span>
              <a 
                href="#direktori-lengkap" 
                className="text-white hover:text-pink-300 underline font-semibold transition-colors"
              >
                Lihat Semua Direktori
              </a>
            </div>
          </div>
        </div>

        {/* SECTION DIREKTORI CABANG LENGKAP DI BAWAH PETA */}
        <div id="direktori-lengkap" className="pt-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-800/40 pb-5">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Direktori Seluruh Kantor & Posko Wilayah
              </h3>
              <p className="text-xs sm:text-sm text-purple-300 mt-1">
                Pilih wilayah atau gunakan pencarian untuk menemukan kantor helpdesk terdekat di kota Anda.
              </p>
            </div>

            {/* Kotak Pencarian */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                placeholder="Cari kota, provinsi, atau alamat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-purple-950/80 border border-purple-700/60 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Filter Wilayah Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => {
                  setSelectedRegion(reg);
                  setIsShowingAll(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedRegion === reg
                    ? 'bg-pink-600 text-white shadow-lg'
                    : 'bg-purple-950/60 text-purple-300 hover:bg-purple-900 border border-purple-800/60'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Grid Kartu Cabang */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBranches.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-purple-950/40 rounded-2xl border border-purple-800/40 text-purple-300 text-xs">
                Tidak ada kantor posko yang cocok dengan pencarian &quot;{searchQuery}&quot;.
              </div>
            ) : (
              (selectedRegion === 'Semua' && !isShowingAll ? filteredBranches.slice(0, 6) : filteredBranches).map((b) => {
                const isSelected = selectedBranch.id === b.id;

                return (
                  <div
                    key={b.id}
                    onClick={() => handleCardClick(b)}
                    className={`p-5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between border ${
                      isSelected
                        ? 'bg-purple-900/60 border-pink-500 ring-2 ring-pink-500/30 shadow-xl'
                        : 'bg-purple-950/40 border-purple-800/60 hover:border-purple-600 hover:bg-purple-900/40'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-pink-300 bg-pink-950/80 px-2 py-0.5 rounded border border-pink-600/40">
                          {b.province}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm text-white leading-snug">
                        {b.name.replace('YASMIN Helpdesk ', '')}
                      </h4>

                      <p className="text-xs text-purple-200/80 line-clamp-2 leading-relaxed flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                        <span>{b.address}</span>
                      </p>
                    </div>

                    <div className="pt-3 mt-4 border-t border-purple-800/60 flex items-center justify-between gap-3">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-purple-400 uppercase tracking-wider font-semibold mb-0.5">Hotline WA</span>
                        <span className="font-mono font-bold text-pink-200 text-xs sm:text-sm">{b.hotline}</span>
                      </div>

                      <a
                        href={`https://wa.me/62${b.hotline.replace(/^0/, '').replace(/[^0-9]/g, '')}?text=Halo%20YASMIN%2C%20saya%20ingin%20berkonsultasi.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="py-1.5 px-3 rounded-lg bg-pink-600/20 hover:bg-pink-600 text-pink-100 font-bold text-[11px] text-center transition-all flex items-center gap-1.5 border border-pink-500/50 hover:border-pink-600"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat WA</span>
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Tombol Lihat Selengkapnya (Khusus Tab Semua) */}
          {selectedRegion === 'Semua' && filteredBranches.length > 6 && (
            <div className="pt-8 pb-4 flex justify-center">
              <button
                onClick={() => setIsShowingAll(!isShowingAll)}
                className="px-6 py-2.5 rounded-full bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-bold border border-purple-700/50 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <span>{isShowingAll ? 'Tampilkan Lebih Sedikit' : `Lihat Selengkapnya (${filteredBranches.length - 6} Posko)`}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isShowingAll ? 'rotate-180 text-pink-400' : 'text-purple-400'}`} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
