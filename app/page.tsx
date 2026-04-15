import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium mb-6">
          Siap pakai · Tanpa login
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Bangun Identitas Brand-mu
          <br />
          <span className="text-indigo-600">dalam Hitungan Menit</span>
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
          Isi sedikit info tentang brand-mu — target audiens, visi, misi, dan
          kepribadian. Kami rekomendasikan palet warna, tipografi, dan tone of
          voice yang cocok. Langsung siap di-export jadi PDF guideline.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/create"
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Mulai Buat Brand
          </Link>
          <Link
            href="/projects"
            className="px-6 py-3 rounded-lg border border-slate-300 bg-white font-medium hover:bg-slate-50 transition"
          >
            Lihat Proyek Tersimpan
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-16">
        {[
          {
            title: "1. Isi Brief Brand",
            desc: "Ceritakan target audiens, visi-misi, dan kepribadian brand-mu.",
          },
          {
            title: "2. AI Merekomendasikan",
            desc: "Dapatkan palet warna, tipografi, dan tone of voice yang cocok.",
          },
          {
            title: "3. Export PDF",
            desc: "Unduh brand guideline siap pakai untuk tim atau klien.",
          },
        ].map((s) => (
          <div
            key={s.title}
            className="p-6 rounded-xl bg-white border border-slate-200"
          >
            <h3 className="font-semibold mb-2">{s.title}</h3>
            <p className="text-sm text-slate-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
