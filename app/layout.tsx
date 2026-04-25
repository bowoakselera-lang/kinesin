import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "700"],
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
    <html lang="id" className={`${inter.variable} ${oswald.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/kinesis-logo.png"
                alt="Kinesin"
                className="h-8 w-auto"
              />
            </Link>
            <nav className="flex gap-6 text-sm">
              <Link
                href="/create"
                className="text-slate-300 hover:text-white transition"
              >
                Buat Baru
              </Link>
              <Link
                href="/projects"
                className="text-slate-300 hover:text-white transition"
              >
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
