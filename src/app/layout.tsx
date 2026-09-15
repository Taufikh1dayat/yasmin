import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "YASMIN - Yayasan Studi Migran Indonesia | Advokasi & Perlindungan Hukum PMI",
  description: "Portal resmi Yayasan Studi Migran Indonesia (YASMIN). Menyelenggarakan bantuan hukum struktural bebas biaya, riset kebijakan ketenagakerjaan migran, dan perlindungan terpadu bagi Pekerja Migran Indonesia.",
  keywords: ["YASMIN", "Yayasan Studi Migran Indonesia", "Pekerja Migran Indonesia", "PMI", "Bantuan Hukum", "Buruh Migran", "TPPO", "Advokasi Ketenagakerjaan"],
  icons: {
    icon: "/images/yasmin_logo.jpeg",
    apple: "/images/yasmin_logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
