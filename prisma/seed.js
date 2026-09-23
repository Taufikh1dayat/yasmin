const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Mulai Seeding Data YASMIN (Yayasan Studi Migran Indonesia)...');

  // Bersihkan data lama jika ada
  await prisma.complaint.deleteMany({});
  await prisma.publication.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.branch.deleteMany({});
  await prisma.user.deleteMany({});

  // 0. Akun Default Admin YASMIN
  const hashedPassword = await bcrypt.hash('admin123456', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@yasmin.or.id',
      name: 'Administrator YASMIN Pusat',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });
  console.log(`✅ Berhasil seed Admin User: ${adminUser.email} (Password: admin123456)`);

  // 1. Data Kantor Cabang / Helpdesk Layanan Wilayah (Kantong PMI & Koridor Transit)
  const branchesData = [
    {
      name: "Sekretariat Nasional YASMIN Jakarta",
      region: "Jawa",
      province: "DKI Jakarta",
      city: "Jakarta Pusat",
      address: "Jl. Salemba Tengah No. 42, Paseban, Senen, Jakarta Pusat 10440",
      phone: "(021) 3908812",
      hotline: "081198765431",
      email: "seknas@yasmin.or.id",
      lat: -6.1934,
      lng: 106.8523,
    },
    {
      name: "YASMIN Helpdesk Jawa Barat (Indramayu & Cirebon)",
      region: "Jawa",
      province: "Jawa Barat",
      city: "Indramayu",
      address: "Jl. Mayor Dasuki No. 118, Jatibarang, Kab. Indramayu",
      phone: "(0234) 351299",
      hotline: "081222334451",
      email: "jabar@yasmin.or.id",
      lat: -6.3263,
      lng: 108.3200,
    },
    {
      name: "YASMIN Helpdesk Jawa Tengah (Cilacap)",
      region: "Jawa",
      province: "Jawa Tengah",
      city: "Cilacap",
      address: "Jl. Gatot Subroto No. 89, Cilacap Tengah, Kab. Cilacap",
      phone: "(0282) 534211",
      hotline: "081222334452",
      email: "jateng@yasmin.or.id",
      lat: -7.7056,
      lng: 109.0156,
    },
    {
      name: "YASMIN Helpdesk Jawa Timur (Surabaya & Malang)",
      region: "Jawa",
      province: "Jawa Timur",
      city: "Surabaya",
      address: "Jl. Gayungsari Barat No. 34, Wonocolo, Surabaya",
      phone: "(031) 8291433",
      hotline: "081222334453",
      email: "jatim@yasmin.or.id",
      lat: -7.3197,
      lng: 112.7241,
    },
    {
      name: "YASMIN Helpdesk NTB (Mataram & Lombok Timur)",
      region: "Bali-Nusa Tenggara",
      province: "Nusa Tenggara Barat",
      city: "Mataram",
      address: "Jl. Pejanggik No. 72, Cakranegara, Kota Mataram, NTB",
      phone: "(0370) 641209",
      hotline: "081222334454",
      email: "ntb@yasmin.or.id",
      lat: -8.5833,
      lng: 116.1167,
    },
    {
      name: "YASMIN Helpdesk NTT (Kupang)",
      region: "Bali-Nusa Tenggara",
      province: "Nusa Tenggara Timur",
      city: "Kupang",
      address: "Jl. Timor Raya Km. 7, Oesapa, Kelapa Lima, Kota Kupang, NTT",
      phone: "(0380) 855210",
      hotline: "081222334455",
      email: "ntt@yasmin.or.id",
      lat: -10.1772,
      lng: 123.6070,
    },
    {
      name: "YASMIN Helpdesk Sumatera Utara (Medan & Asahan)",
      region: "Sumatera",
      province: "Sumatera Utara",
      city: "Medan",
      address: "Jl. STM No. 58, Suka Maju, Medan Johor, Kota Medan",
      phone: "(061) 7864321",
      hotline: "081222334456",
      email: "sumut@yasmin.or.id",
      lat: 3.5512,
      lng: 98.6833,
    },
    {
      name: "YASMIN Helpdesk Lampung (Bandar Lampung)",
      region: "Sumatera",
      province: "Lampung",
      city: "Bandar Lampung",
      address: "Jl. Zainal Abidin Pagar Alam No. 25, Kedaton, Bandar Lampung",
      phone: "(0721) 701890",
      hotline: "081222334457",
      email: "lampung@yasmin.or.id",
      lat: -5.3831,
      lng: 105.2577,
    },
    {
      name: "YASMIN Helpdesk Kalimantan Barat (Sambas & Pontianak)",
      region: "Kalimantan",
      province: "Kalimantan Barat",
      city: "Pontianak",
      address: "Jl. Gusti Hamzah No. 19, Pontianak Kota, Kalimantan Barat",
      phone: "(0561) 745312",
      hotline: "081222334458",
      email: "kalbar@yasmin.or.id",
      lat: -0.0263,
      lng: 109.3425,
    },
    {
      name: "YASMIN Helpdesk Kepulauan Riau (Batam Corridor)",
      region: "Sumatera",
      province: "Kepulauan Riau",
      city: "Batam",
      address: "Ruko Mega Legenda Blok B No. 12, Batam Center, Kota Batam",
      phone: "(0778) 467812",
      hotline: "081222334459",
      email: "kepri@yasmin.or.id",
      lat: 1.1294,
      lng: 104.0530,
    },
    {
      name: "YASMIN Helpdesk Sulawesi Selatan (Makassar)",
      region: "Sulawesi",
      province: "Sulawesi Selatan",
      city: "Makassar",
      address: "Jl. Perintis Kemerdekaan Km. 10, Tamalanrea, Kota Makassar",
      phone: "(0411) 587123",
      hotline: "081222334460",
      email: "sulsel@yasmin.or.id",
      lat: -5.1354,
      lng: 119.4930,
    },
    {
      name: "YASMIN Helpdesk Kalimantan Timur (Samarinda)",
      region: "Kalimantan",
      province: "Kalimantan Timur",
      city: "Samarinda",
      address: "Jalan Sultan Sulaiman, Perum Citra Gading Blok B2 No. 9 Samarinda – Kalimantan Timur",
      phone: "(0541) 741289",
      hotline: "08125822715",
      email: "kaltim@yasmin.or.id",
      lat: -0.5022,
      lng: 117.1536,
    },
    {
      name: "YASMIN Helpdesk Bali (Denpasar)",
      region: "Bali-Nusa Tenggara",
      province: "Bali",
      city: "Denpasar",
      address: "Jl. Teuku Umar No. 88, Denpasar Barat, Kota Denpasar",
      phone: "(0361) 234567",
      hotline: "081222334462",
      email: "bali@yasmin.or.id",
      lat: -8.6705,
      lng: 115.2126,
    },
    {
      name: "YASMIN Helpdesk Papua (Jayapura & Merauke)",
      region: "Papua",
      province: "Papua",
      city: "Jayapura",
      address: "Jl. Raya Abepura No. 45, Kotaraja, Jayapura, Papua",
      phone: "(0967) 532109",
      hotline: "081222334461",
      email: "papua@yasmin.or.id",
      lat: -2.5916,
      lng: 140.6690,
    },
    {
      name: "YASMIN Helpdesk Sumatera Barat (Padang)",
      region: "Sumatera",
      province: "Sumatera Barat",
      city: "Padang",
      address: "Jl. Khatib Sulaiman No. 32, Ulak Karang Selatan, Kota Padang",
      phone: "(0751) 445566",
      hotline: "081222334463",
      email: "sumbar@yasmin.or.id",
      lat: -0.9242,
      lng: 100.3627,
    },
    {
      name: "YASMIN Helpdesk Sulawesi Utara (Manado & Bitung)",
      region: "Sulawesi",
      province: "Sulawesi Utara",
      city: "Manado",
      address: "Jl. Sam Ratulangi No. 120, Wanea, Kota Manado, Sulawesi Utara",
      phone: "(0431) 865432",
      hotline: "081222334464",
      email: "sulut@yasmin.or.id",
      lat: 1.4748,
      lng: 124.8428,
    },
    {
      name: "YASMIN Helpdesk Sulawesi Tengah (Palu)",
      region: "Sulawesi",
      province: "Sulawesi Tengah",
      city: "Palu",
      address: "Jl. Moh. Hatta No. 18, Lolu Utara, Kota Palu, Sulawesi Tengah",
      phone: "(0451) 421098",
      hotline: "081222334465",
      email: "sulteng@yasmin.or.id",
      lat: -0.8917,
      lng: 119.8707,
    },
    {
      name: "YASMIN Helpdesk Maluku (Ambon)",
      region: "Maluku",
      province: "Maluku",
      city: "Ambon",
      address: "Jl. Pattimura No. 15, Uritetu, Sirimau, Kota Ambon, Maluku",
      phone: "(0911) 354321",
      hotline: "081222334466",
      email: "maluku@yasmin.or.id",
      lat: -3.6954,
      lng: 128.1814,
    }
  ];

  const createdBranches = [];
  for (const b of branchesData) {
    const created = await prisma.branch.create({ data: b });
    createdBranches.push(created);
  }
  console.log(`✅ Berhasil seed ${createdBranches.length} Kantor Helpdesk YASMIN.`);

  // 2. Data Publikasi & Kajian Kebijakan
  const publicationsData = [
    {
      title: "Laporan Catatan Tahunan 2025: Potret Kerentanan & Akses Keadilan Pekerja Migran Indonesia",
      slug: "catahu-2025-potret-kerentanan-pmi",
      category: "Laporan Tahunan",
      year: 2025,
      author: "Divisi Riset & Data YASMIN",
      description: "Dokumentasi komprehensif atas 1.420 kasus pekerja migran yang didampingi sepanjang tahun 2025, mencakup analisis jeratan utang, kekerasan majikan, dan evaluasi bantuan hukum di negara penempatan.",
      fileUrl: "#",
      coverImage: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600",
      downloadCount: 342,
    },
    {
      title: "Kertas Kebijakan: Evaluasi Implementasi UU No. 18 Tahun 2017 tentang Pelindungan PMI",
      slug: "kertas-kebijakan-evaluasi-uu-18-2017",
      category: "Kertas Kebijakan",
      year: 2024,
      author: "Tim Advokasi Kebijakan YASMIN",
      description: "Analisis kritis atas pelaksanaan Layanan Terpadu Satu Atap (LTSA) dan jaminan perlindungan sosial bagi pekerja migran sektor domestik pasca 7 tahun pengesahan UU PPMI.",
      fileUrl: "#",
      coverImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600",
      downloadCount: 518,
    },
    {
      title: "Buku Saku Advokasi: Hak-Hak Hukum PMI di Sektor Domestik & Perkebunan",
      slug: "buku-saku-advokasi-hak-hukum-pmi",
      category: "Panduan Advokasi",
      year: 2024,
      author: "Divisi Bantuan Hukum YASMIN",
      description: "Buku panduan praktis dan mudah dipahami bagi calon pekerja migran, keluarga di kampung halaman, serta paralegal desa mengenai hak upah, hak cuti, kontrak kerja, dan kontak darurat.",
      fileUrl: "#",
      coverImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600",
      downloadCount: 890,
    },
    {
      title: "Riset Penanganan Korban TPPO Jalur Non-Prosedural di Perbatasan RI - Malaysia",
      slug: "riset-penanganan-korban-tppo-perbatasan",
      category: "Riset & Studi",
      year: 2023,
      author: "Tim Peneliti Migrasi YASMIN & Jaringan Perbatasan",
      description: "Studi mendalam mengenai modus operandi sindikat perdagangan orang jalur tikus perbatasan darat dan laut serta rekomendasi sistem deteksi dini berbasis komunitas.",
      fileUrl: "#",
      coverImage: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=600",
      downloadCount: 421,
    },
    {
      title: "Amicus Curiae: Penuntutan Hak Restitusi bagi PMI Korban Penyiksaan Majikan Luar Negeri",
      slug: "amicus-curiae-restitusi-korban-penyiksaan-pmi",
      category: "Amicus Curiae",
      year: 2024,
      author: "Lembaga Bantuan Hukum YASMIN",
      description: "Pendapat hukum sebagai sahabat pengadilan (Amicus Curiae) dalam mendorong ganti rugi materil dan pemulihan psikososial menyeluruh bagi buruh migran korban eksploitasi berat.",
      fileUrl: "#",
      coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600",
      downloadCount: 275,
    }
  ];

  for (const pub of publicationsData) {
    await prisma.publication.create({ data: pub });
  }
  console.log(`✅ Berhasil seed ${publicationsData.length} Dokumen Publikasi & Kajian.`);

  // 3. Data Berita & Kabar Advokasi
  const articlesData = [
    {
      title: "YASMIN Dampingi Pemulangan dan Pemulihan Hak 14 PMI Korban TPPO dari Jalur Transit",
      slug: "pemulangan-14-pmi-korban-tppo",
      category: "Advokasi Kasus",
      excerpt: "Melalui koordinasi lintas lembaga, tim advokasi YASMIN mendampingi pemulangan 14 pekerja migran asal NTB dan Jabar yang tertahan di wilayah transit dengan kondisi dokumen ditahan.",
      content: "Jakarta — Yayasan Studi Migran Indonesia (YASMIN) bersama jejaring paralegal di daerah berhasil memfasilitasi pemulangan 14 Pekerja Migran Indonesia (PMI) korban penipuan penempatan non-prosedural. Seluruh korban saat ini berada di bawah perlindungan rumah aman YASMIN untuk mendapatkan pemeriksaan kesehatan fisik, trauma healing, serta pendampingan hukum guna menuntut pertanggungjawaban agen ilegal.",
      imageUrl: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=800",
      author: "Tim Komunikasi YASMIN",
    },
    {
      title: "Pelatihan Paralegal Komunitas: Membangun Sistem Siaga Dini di 20 Desa Asal Migran",
      slug: "pelatihan-paralegal-desa-siaga-migran",
      category: "Edukasi Hak PMI",
      excerpt: "Sebanyak 45 kader desa dan anggota keluarga purna migran dilatih keterampilan dasar pendampingan hukum dan verifikasi kontrak kerja luar negeri.",
      content: "Indramayu — Sebagai langkah preventif melawan jebakan agen bodong, YASMIN menyelenggarakan Lokakarya Paralegal Komunitas di Kabupaten Indramayu. Kegiatan ini bertujuan mencetak paralegal desa yang mampu membaca klausul kontrak kerja, mengenali tanda-tanda jeratan utang, dan menjadi kontak pertama ketika terjadi kedaruratan di negara tujuan.",
      imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
      author: "Divisi Pemberdayaan Komunitas",
    },
    {
      title: "YASMIN Desak Pemerintah Perketat Pengawasan Klausul Kontrak Mandiri Sektor Perikanan",
      slug: "desakan-pengawasan-kontrak-abk-perikanan",
      category: "Kabar Kebijakan",
      excerpt: "Tingginya angka sengketa gaji tak dibayar pada ABK migran membutuhkan harmonisasi regulasi izin penempatan dan asuransi jaminan sosial internasional.",
      content: "Jakarta — Merespons berulangnya kasus Anak Buah Kapal (ABK) yang terlantar di perairan internasional tanpa upah berbulan-bulan, YASMIN melayangkan kertas rekomendasi resmi kepada kementerian terkait agar mewajibkan standarisasi perjanjian kerja laut terpadu dengan sanksi tegas bagi manning agency nakal.",
      imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
      author: "Redaksi Kebijakan YASMIN",
    }
  ];

  for (const art of articlesData) {
    await prisma.article.create({ data: art });
  }
  console.log(`✅ Berhasil seed ${articlesData.length} Berita & Artikel Edukasi.`);

  // 4. Data Aduan Contoh (untuk demo pelacakan tiket status kasus)
  const sampleComplaints = [
    {
      ticketCode: "YSM-2026-A109",
      complainantName: "Siti Rahmawati",
      isAnonymous: false,
      contact: "081299887766",
      email: "siti.rahmawati@gmail.com",
      workerLocation: "Kuala Lumpur, Malaysia",
      category: "Gaji Tidak Dibayar",
      chronology: "Bekerja selama 14 bulan di sektor rumah tangga, majikan menahan gaji 8 bulan terakhir dengan alasan potongan biaya penempatan yang tidak tercantum dalam kontrak.",
      status: "SEDANG_DITANGANI",
      adminNotes: "Tim YASMIN telah berkoordinasi dengan perwakilan KBRI di Kuala Lumpur dan melayangkan somasi resmi kepada pihak agen penyalur.",
      branchId: createdBranches[0].id,
    },
    {
      ticketCode: "YSM-2026-B220",
      complainantName: "Keluarga Alm. Ahmad",
      isAnonymous: false,
      contact: "085233445566",
      workerLocation: "Lombok Timur / Taiwan",
      category: "Kecelakaan Kerja & Hak Asuransi",
      chronology: "Pekerja mengalami kecelakaan fatal di pabrik perakitan. Pihak keluarga di Lombok belum menerima pencairan kompensasi dan klaim asuransi perlindungan tenaga kerja.",
      status: "MEDIASI_HUKUM",
      adminNotes: "Proses verifikasi dokumen ahli waris telah lengkap. Berkas klaim asuransi sedang diproses di instansi ketenagakerjaan.",
      branchId: createdBranches[4].id,
    }
  ];

  for (const comp of sampleComplaints) {
    await prisma.complaint.create({ data: comp });
  }
  console.log(`✅ Berhasil seed ${sampleComplaints.length} Data Aduan Percontohan.`);
  console.log('🎉 Seeding YASMIN Portal selesai!');
}

main()
  .catch((e) => {
    console.error('Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
