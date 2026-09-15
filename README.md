# YASMIN - Yayasan Studi Migran Indonesia

Portal Advokasi, Bantuan Hukum Pro Bono, dan Riset Kebijakan Pelindungan Pekerja Migran Indonesia (PMI).

Portal resmi Yayasan Studi Migran Indonesia (YASMIN) yang menyelenggarakan bantuan hukum pro bono, pelacakan kasus pengaduan online via tiket unik, repositori publikasi/monograf riset kebijakan (CATAHU, Policy Brief, Panduan Paralegal), direktori 11 posko helpdesk daerah, serta panel administrasi berbasis database PostgreSQL.

---

## Fitur Utama

1. Beranda Advokasi dan Mandat Lembaga:
   - Hero dokumenter dengan identitas resmi lembaga dan hotline darurat 24 jam.
   - Tiga pilar mandat: Bantuan Hukum Litigasi, Riset Kebijakan Berbasis Bukti, dan Penguatan Paralegal Desa.
2. Layanan Pengaduan Kasus Online dan Live Tracking:
   - Formulir pengaduan dengan opsi proteksi anonim bagi korban yang terancam.
   - Sistem tiket otomatis (misal YSM-2026-A109).
   - Fitur pelacakan publik untuk memantau status penanganan kasus dan catatan resmi advokat.
3. Pusat Publikasi dan Repositori Monograf Riset:
   - Sampul dokumen monograf resmi (Catatan Tahunan / CATAHU, Kertas Kebijakan, Panduan Hukum Saku, Amicus Curiae, Riset Investigasi).
   - Filter kategori dan pencarian instan judul/topik riset.
4. Warta Siaran Pers dan Catatan Lapangan:
   - Rilis resmi biro advokasi kasus dan dokumentasi kegiatan paralegal desa.
5. Direktori 11 Posko Layanan dan Helpdesk Daerah:
   - Kontak sekretariat nasional dan posko daerah di kantong-kantong PMI utama (Jabar, Jateng, Jatim, NTB, NTT, Sumut, Kepri, Kalbar, Sulsel).
6. Panel Admin dan Manajemen:
   - Autentikasi aman berbasis HMAC cookie session (/admin/login).
   - Dashboard analitik kasus aktif, statistik kategori, dan antrean aduan (/admin/dashboard).

---

## Tech Stack

- Framework: Next.js 14 (App Router, React 18, TypeScript)
- Styling: Tailwind CSS
- Icons: Lucide React
- ORM: Prisma ORM
- Database: PostgreSQL
- Keamanan: Bcrypt password hashing, session tokens, Edge Middleware route protection.

---

## Panduan Instalasi Lokal

### 1. Klon Repositori
`ash
git clone https://github.com/Taufikh1dayat/yasmin.git
cd yasmin
`

### 2. Pasang Dependensi
`ash
npm install
`

### 3. Konfigurasi Environment
Salin file .env.example menjadi .env:
`ash
cp .env.example .env
`
Sesuaikan string koneksi DATABASE_URL dengan database PostgreSQL lokal Anda.

### 4. Setup Database dan Seeding
`ash
# Push schema ke database
npx prisma db push

# Jalankan data seeding (Helpdesk, Publikasi, Berita, Contoh Kasus, Default Admin)
node prisma/seed.js
`

### 5. Jalankan Server Development
`ash
npm run dev
`
Buka http://localhost:3000 pada browser Anda.

---

## Akun Default Staf / Admin

- URL Login Admin: http://localhost:3000/admin/login
- Email: admin@yasmin.or.id
- Password: admin123456

---

## Lisensi
Hak Cipta (c) 2026 Yayasan Studi Migran Indonesia (YASMIN).
