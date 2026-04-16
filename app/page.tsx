import Link from "next/link";

const COLORS = ["#4F46E5", "#EC4899", "#F59E0B", "#10B981", "#8B5CF6"];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-slate-950 text-white overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[140px] animate-pulse-slow" />
          <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-pink-600/15 blur-[120px] animate-pulse-slow [animation-delay:2s]" />
          <div className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] rounded-full bg-violet-500/15 blur-[100px] animate-pulse-slow [animation-delay:4s]" />
        </div>

        {/* Floating decorative shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Color swatches */}
          {COLORS.map((c, i) => (
            <div
              key={c}
              className="absolute rounded-xl animate-float"
              style={{
                width: 50 + i * 8,
                height: 50 + i * 8,
                backgroundColor: c,
                opacity: 0.15 + i * 0.04,
                left: `${12 + i * 18}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${6 + i}s`,
                transform: `rotate(${i * 15}deg)`,
              }}
            />
          ))}
          {/* Typography "Aa" floater */}
          <div className="absolute right-[8%] top-[18%] text-[180px] font-bold text-white/[0.04] animate-float [animation-delay:1s] [animation-duration:8s] select-none">
            Aa
          </div>
          {/* Circle ring */}
          <div className="absolute left-[6%] bottom-[20%] w-32 h-32 rounded-full border-2 border-white/[0.06] animate-float [animation-delay:3s] [animation-duration:10s]" />
          <div className="absolute right-[15%] bottom-[15%] w-20 h-20 rounded-full border border-indigo-500/20 animate-float [animation-delay:2s] [animation-duration:7s]" />
          {/* Grid dots */}
          <div className="absolute left-[12%] top-[60%] grid grid-cols-3 gap-2 opacity-10">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
            ))}
          </div>
        </div>

        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-slate-300">
              Gratis · Tanpa login · Langsung pakai
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[0.95] mb-6">
            <span className="bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent">
              Brand Identity
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Generator
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Masukkan visi dan kepribadian brand-mu. Dapatkan{" "}
            <span className="text-white font-medium">palet warna</span>,{" "}
            <span className="text-white font-medium">tipografi</span>,{" "}
            <span className="text-white font-medium">logo</span>,{" "}
            dan{" "}
            <span className="text-white font-medium">
              tone of voice
            </span>{" "}
            — lengkap export jadi PDF guideline.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="group relative px-8 py-4 rounded-xl bg-white text-slate-900 font-bold text-lg hover:scale-105 transition-transform"
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10" />
              Mulai Buat Brand
            </Link>
            <Link
              href="/projects"
              className="px-8 py-4 rounded-xl border border-white/15 text-white font-medium text-lg hover:bg-white/5 transition backdrop-blur-sm"
            >
              Proyek Tersimpan
            </Link>
          </div>

          {/* Scroll hint */}
          <div className="mt-20 animate-bounce">
            <svg
              className="w-6 h-6 mx-auto text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
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
