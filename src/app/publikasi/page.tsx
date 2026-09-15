import React from 'react';
import { prisma } from '@/lib/prisma';
import PublicationSection from '@/components/PublicationSection';
import { BookOpen } from 'lucide-react';

export const revalidate = 0;

export default async function PublicationsPage() {
  let publications: any[] = [];
  try {
    publications = await prisma.publication.findMany({
      orderBy: { year: 'desc' },
    });
  } catch (e) {
    console.error('Error loading publications from DB:', e);
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PublicationSection publications={publications.length > 0 ? publications : undefined} />
      </div>
    </div>
  );
}
