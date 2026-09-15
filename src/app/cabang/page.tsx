import React from 'react';
import { prisma } from '@/lib/prisma';
import InteractiveMap from '@/components/InteractiveMap';
import { Building2, Phone, Mail, MessageCircle, MapPin } from 'lucide-react';

export const revalidate = 0;

export default async function CabangPage() {
  let branches: any[] = [];
  try {
    branches = await prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { province: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching branches:', e);
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Peta Interaktif */}
        <InteractiveMap />

        {/* Tabel / Grid Lengkap Direktori Cabang */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Direktori Lengkap Kantor Helpdesk YASMIN
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Daftar kontak telepon, hotline darurat, dan alamat sekretariat di seluruh wilayah Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((b) => (
              <div key={b.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100/70 px-2 py-0.5 rounded">
                    {b.province}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-2">{b.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{b.address}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/70 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp: {b.hotline}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{b.email}</span>
                  </div>
                  <a
                    href={`https://wa.me/62${b.hotline.replace(/^0/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center block text-[11px]"
                  >
                    Hubungi Cabang Ini
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
