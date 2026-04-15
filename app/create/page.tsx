"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BrandBrief, BrandIdentity, BrandProject } from "@/lib/types";
import { saveProject } from "@/lib/storage";

const PERSONALITY_OPTIONS = [
  "Profesional",
  "Ramah",
  "Modern",
  "Elegan",
  "Playful",
  "Berani",
  "Minimalis",
  "Hangat",
  "Inovatif",
  "Tradisional",
  "Mewah",
  "Terpercaya",
];

export default function CreatePage() {
  const router = useRouter();
  const [brief, setBrief] = useState<BrandBrief>({
    brandName: "",
    industry: "",
    targetAudience: "",
    vision: "",
    mission: "",
    personality: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function togglePersonality(trait: string) {
    setBrief((b) => ({
      ...b,
      personality: b.personality.includes(trait)
        ? b.personality.filter((t) => t !== trait)
        : [...b.personality, trait],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (brief.personality.length === 0) {
      setError("Pilih minimal 1 kepribadian brand.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal generate brand.");

      const identity = data.identity as BrandIdentity;
      const project: BrandProject = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        brief,
        identity,
      };
      saveProject(project);
      router.push(`/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Buat Brand Baru</h1>
      <p className="text-slate-600 mb-8">
        Isi form di bawah. Makin spesifik, hasilnya makin pas.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Field label="Nama Brand" required>
          <input
            type="text"
            required
            value={brief.brandName}
            onChange={(e) => setBrief({ ...brief, brandName: e.target.value })}
            placeholder="cth. Kopi Senja"
            className="input"
          />
        </Field>

        <Field label="Industri / Kategori" required>
          <input
            type="text"
            required
            value={brief.industry}
            onChange={(e) => setBrief({ ...brief, industry: e.target.value })}
            placeholder="cth. Coffee shop, SaaS, Fashion"
            className="input"
          />
        </Field>

        <Field
          label="Target Audiens"
          hint="Siapa pengguna/pembeli ideal? Usia, profesi, lifestyle, kebiasaan."
          required
        >
          <textarea
            required
            rows={3}
            value={brief.targetAudience}
            onChange={(e) =>
              setBrief({ ...brief, targetAudience: e.target.value })
            }
            placeholder="cth. Profesional muda 25-35 tahun di kota besar yang suka ngopi pagi sebelum kerja..."
            className="input"
          />
        </Field>

        <Field label="Visi" hint="Gambaran besar jangka panjang." required>
          <textarea
            required
            rows={2}
            value={brief.vision}
            onChange={(e) => setBrief({ ...brief, vision: e.target.value })}
            placeholder="cth. Menjadi coffee shop rumahan yang menghangatkan setiap pagi..."
            className="input"
          />
        </Field>

        <Field label="Misi" hint="Cara konkret mencapai visi." required>
          <textarea
            required
            rows={2}
            value={brief.mission}
            onChange={(e) => setBrief({ ...brief, mission: e.target.value })}
            placeholder="cth. Menyajikan kopi lokal berkualitas dengan suasana hangat..."
            className="input"
          />
        </Field>

        <Field
          label="Kepribadian Brand"
          hint="Pilih sifat-sifat yang paling menggambarkan brand-mu."
          required
        >
          <div className="flex flex-wrap gap-2">
            {PERSONALITY_OPTIONS.map((p) => {
              const active = brief.personality.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePersonality(p)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    active
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </Field>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Sedang meracik brand-mu..." : "Generate Identitas Brand"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="font-medium mb-1">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </div>
      {hint && <div className="text-xs text-slate-500 mb-2">{hint}</div>}
      {children}
    </label>
  );
}
