import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col bg-black text-white overflow-hidden -mt-[60px] pt-[60px]">
        {/* Background image */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="/tampilan-landing-2.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-90"
            style={{ objectPosition: "center bottom" }}
          />
          {/* Top fade to black */}
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black via-black/80 to-transparent" />
          {/* Bottom fade for text legibility */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent" />

        </div>

        {/* Top corner labels */}
        <div className="relative z-10 flex justify-between items-start px-8 pt-6 text-xs font-medium text-white/70">
          <span className="lowercase tracking-wide">brand identity</span>
          <span className="font-mono">{new Date().getFullYear()}©</span>
        </div>

        {/* Centered content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center pb-32">
          <div className="mb-6 text-sm font-bold tracking-[0.3em]">
            <span className="text-white">KINESIN</span>{" "}
            <span className="text-indigo-400">STUDIO</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] max-w-5xl">
            <span className="text-indigo-400">Bangun brand</span>{" "}
            <span className="text-white">yang</span>
            <br />
            <span className="text-indigo-400">bergerak</span>{" "}
            <span className="text-white">maju</span>
            <br />
            <span className="text-white">tanpa hambatan.</span>
          </h1>

          <p className="mt-8 text-sm md:text-base text-white/70 max-w-md leading-relaxed">
            Identitas visual, palet warna, tipografi, dan
            <br className="hidden md:block" />
            mockup brand — siap export jadi PDF guideline.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="/create"
              className="group relative px-8 py-4 rounded-full bg-white text-black font-bold text-base hover:scale-105 transition-transform"
            >
              Mulai Buat Brand
            </Link>
            <Link
              href="/projects"
              className="px-8 py-4 rounded-full border border-white/25 text-white font-medium text-base hover:bg-white/10 transition backdrop-blur-sm"
            >
              Proyek Tersimpan
            </Link>
          </div>
        </div>

        {/* Bottom-left tag */}
        <div className="absolute bottom-6 left-8 z-10 text-xs text-white/50 font-mono tracking-wider">
          [001] · scroll to explore ↓
        </div>
      </section>

      {/* ─── SHOWCASE ─── */}
      <section className="relative bg-slate-950 pb-24 -mt-1">
        <div className="max-w-6xl mx-auto px-6">
          {/* Sample palette strip */}
          <div className="flex rounded-2xl overflow-hidden h-20 md:h-28 shadow-2xl shadow-indigo-500/10">
            {[
              { hex: "#4F46E5", name: "Primary" },
              { hex: "#818CF8", name: "Secondary" },
              { hex: "#F59E0B", name: "Accent" },
              { hex: "#1E293B", name: "Dark" },
              { hex: "#F1F5F9", name: "Light" },
            ].map((c) => (
              <div
                key={c.hex}
                className="flex-1 flex items-end p-3 md:p-4 transition-all hover:flex-[2] cursor-default"
                style={{ backgroundColor: c.hex }}
              >
                <span
                  className="text-[10px] md:text-xs font-mono font-medium hidden md:block"
                  style={{
                    color:
                      c.hex === "#F1F5F9" || c.hex === "#F59E0B"
                        ? "#0f172a"
                        : "#fff",
                  }}
                >
                  {c.hex}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-indigo-600 tracking-widest uppercase mb-3">
              How it works
            </p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              Tiga langkah. Satu guideline.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-0 md:gap-px bg-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {[
              {
                num: "01",
                title: "Brief",
                desc: "Isi nama brand, industri, target audiens, visi-misi, dan pilih kepribadian brand dari daftar.",
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                ),
              },
              {
                num: "02",
                title: "Generate",
                desc: "Sistem otomatis merekomendasikan palet warna, tipografi, logo, dan tone of voice yang sesuai.",
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
              },
              {
                num: "03",
                title: "Export",
                desc: "Preview hasilnya, lalu unduh sebagai PDF brand guideline profesional — siap pakai.",
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                ),
              },
            ].map((s) => (
              <div
                key={s.num}
                className="bg-white p-8 md:p-10 flex flex-col"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 text-white flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="text-5xl font-black text-slate-100">
                    {s.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                label: "PALET WARNA",
                title: "5 warna harmonis + tints",
                desc: "Warna primer, sekunder, aksen, dan netral dipilih berdasar psikologi warna & kepribadian brand. Lengkap dengan gradasi 20–80%.",
                bg: "bg-gradient-to-br from-indigo-600 to-violet-700",
              },
              {
                label: "TIPOGRAFI",
                title: "Pasangan font Google Fonts",
                desc: "Heading & body font yang cocok, lengkap dengan specimen alfabet dan skala weight.",
                bg: "bg-gradient-to-br from-slate-800 to-slate-950",
              },
              {
                label: "LOGO",
                title: "3 variasi logo otomatis",
                desc: "Monogram, wordmark, dan negative space — semua bisa diunduh SVG & PNG. Preview langsung di mockup.",
                bg: "bg-gradient-to-br from-pink-600 to-rose-700",
              },
              {
                label: "PDF GUIDELINE",
                title: "Export editorial-style",
                desc: "PDF bergaya Behance case study: cover, essence, logo showcase, palette, typography, tone of voice.",
                bg: "bg-gradient-to-br from-amber-500 to-orange-600",
              },
            ].map((f) => (
              <div
                key={f.label}
                className={`${f.bg} rounded-2xl p-8 md:p-10 text-white flex flex-col justify-end min-h-[240px]`}
              >
                <p className="text-xs font-bold tracking-widest opacity-70 mb-2">
                  {f.label}
                </p>
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed opacity-80">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 bg-slate-950 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Siap bangun identitas
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
              brand-mu?
            </span>
          </h2>
          <p className="text-slate-400 mb-10 text-lg">
            Gratis, tanpa sign up, langsung jadi.
          </p>
          <Link
            href="/create"
            className="inline-block px-10 py-5 rounded-xl bg-white text-slate-900 font-bold text-lg hover:scale-105 transition-transform"
          >
            Mulai Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
