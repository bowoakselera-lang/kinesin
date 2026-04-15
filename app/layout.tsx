import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kinesin — Buat Brand Guideline Instan",
  description:
    "Aplikasi untuk membuat identitas brand: palet warna, tipografi, dan tone of voice, lengkap dengan export PDF.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg tracking-tight">
              <span className="text-indigo-600">●</span> Kinesin
            </Link>
            <nav className="flex gap-6 text-sm text-slate-600">
              <Link href="/create" className="hover:text-slate-900">
                Buat Baru
              </Link>
              <Link href="/projects" className="hover:text-slate-900">
                Proyek Tersimpan
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
          Kinesin · Buat brand guideline yang konsisten dan rapi
        </footer>
      </body>
    </html>
  );
}
