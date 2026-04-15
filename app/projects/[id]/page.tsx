"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProject } from "@/lib/storage";
import { exportBrandPDF } from "@/lib/pdf";
import { generateLogos, downloadSvg, downloadPng } from "@/lib/logo";
import { generateMockups } from "@/lib/mockups";
import type { BrandProject } from "@/lib/types";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<BrandProject | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedLogoId, setSelectedLogoId] = useState<string>("stacked");

  useEffect(() => {
    if (!params?.id) return;
    const p = getProject(params.id);
    if (!p) {
      router.replace("/projects");
      return;
    }
    setProject(p);
    setMounted(true);
  }, [params?.id, router]);

  if (!mounted || !project) return null;

  const { brief, identity } = project;
  const logos = generateLogos(brief, identity);

  const fontLinks = identity.typography
    .map((t) => encodeURIComponent(t.fontFamily.trim()).replace(/%20/g, "+"))
    .join("&family=");

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {fontLinks && (
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=${fontLinks}&display=swap`}
        />
      )}

      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <Link
            href="/projects"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            ← Semua Proyek
          </Link>
          <h1 className="text-3xl font-bold mt-1">{brief.brandName}</h1>
          <p className="text-slate-600">{identity.tagline}</p>
        </div>
        <button
          onClick={() => {
            void exportBrandPDF(project);
          }}
          className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
        >
          ⬇ Download PDF Guideline
        </button>
      </div>

      <Section title="Logo">
        <p className="text-slate-600 text-sm mb-4">
          Klik salah satu logo untuk melihat preview mockup-nya. Gunakan tombol
          di bawah untuk download SVG atau PNG.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {logos.map((logo) => {
            const active = logo.id === selectedLogoId;
            return (
              <div
                key={logo.id}
                className={`rounded-xl border bg-white overflow-hidden flex flex-col transition ${
                  active
                    ? "border-indigo-600 ring-2 ring-indigo-600/30 shadow-md"
                    : "border-slate-200 hover:border-slate-400"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedLogoId(logo.id)}
                  className="aspect-square bg-slate-50 flex items-center justify-center p-3 cursor-pointer relative"
                  dangerouslySetInnerHTML={{
                    __html:
                      logo.svg +
                      (active
                        ? `<div style="position:absolute;top:8px;right:8px;background:#4f46e5;color:#fff;font-size:10px;padding:2px 8px;border-radius:10px;font-family:sans-serif;font-weight:600">DIPILIH</div>`
                        : ""),
                  }}
                />
                <div className="p-3 border-t border-slate-200">
                  <div className="font-medium text-sm mb-2">{logo.name}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        downloadSvg(
                          logo.svg,
                          `${slugify(brief.brandName)}-${logo.id}.svg`
                        )
                      }
                      className="flex-1 px-2 py-1.5 text-xs rounded-md border border-slate-300 hover:bg-slate-50"
                    >
                      SVG
                    </button>
                    <button
                      onClick={() =>
                        downloadPng(
                          logo.svg,
                          `${slugify(brief.brandName)}-${logo.id}.png`
                        )
                      }
                      className="flex-1 px-2 py-1.5 text-xs rounded-md border border-slate-300 hover:bg-slate-50"
                    >
                      PNG
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Mockup Preview">
        <p className="text-slate-600 text-sm mb-4">
          Lihat bagaimana logo "{logos.find((l) => l.id === selectedLogoId)?.name}"
          diaplikasikan di berbagai media. Pilih logo lain di atas untuk
          mengganti preview.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {generateMockups(
            logos.find((l) => l.id === selectedLogoId)?.svg ?? logos[0].svg,
            identity
          ).map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden"
            >
              <div
                className="w-full"
                style={{ aspectRatio: "3 / 2" }}
                dangerouslySetInnerHTML={{ __html: m.svg }}
              />
              <div className="p-3 border-t border-slate-200 text-sm font-medium">
                {m.name}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Brand Essence">
        <p className="text-slate-700 leading-relaxed">{identity.essence}</p>
        <div className="grid md:grid-cols-2 gap-4 mt-6 text-sm">
          <InfoBlock label="Visi" value={brief.vision} />
          <InfoBlock label="Misi" value={brief.mission} />
          <InfoBlock label="Target Audiens" value={brief.targetAudience} />
          <InfoBlock
            label="Kepribadian"
            value={brief.personality.join(" · ")}
          />
        </div>
      </Section>

      <Section title="Palet Warna">
        <p className="text-slate-600 text-sm mb-4">{identity.rationale}</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {identity.palette.map((c) => (
            <div
              key={c.hex}
              className="rounded-xl overflow-hidden border border-slate-200 bg-white"
            >
              <div
                className="h-24"
                style={{ backgroundColor: c.hex }}
                title={c.hex}
              />
              <div className="p-3">
                <div className="font-medium text-sm">{c.name}</div>
                <button
                  onClick={() => navigator.clipboard.writeText(c.hex)}
                  className="text-xs text-slate-500 font-mono hover:text-indigo-600"
                  title="Klik untuk copy"
                >
                  {c.hex.toUpperCase()}
                </button>
                <div className="text-xs text-slate-500 mt-1">{c.role}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Tipografi">
        <div className="grid md:grid-cols-2 gap-4">
          {identity.typography.map((t) => (
            <div
              key={t.role}
              className="p-5 rounded-xl bg-white border border-slate-200"
            >
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                {t.role === "heading" ? "Heading" : "Body"}
              </div>
              <div
                className="text-3xl mb-1"
                style={{ fontFamily: `'${t.fontFamily}', sans-serif` }}
              >
                {t.fontFamily}
              </div>
              <div
                className="text-base text-slate-700 mb-3"
                style={{ fontFamily: `'${t.fontFamily}', sans-serif` }}
              >
                The quick brown fox jumps — 1234567890
              </div>
              <p className="text-sm text-slate-600 mb-2">{t.rationale}</p>
              <a
                href={t.googleFontUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-600 hover:underline"
              >
                Lihat di Google Fonts →
              </a>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Tone of Voice">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-green-50 border border-green-200">
            <div className="font-semibold text-green-800 mb-2">✓ Do</div>
            <ul className="space-y-1.5 text-sm text-green-900">
              {identity.toneOfVoice.do.map((d, i) => (
                <li key={i}>• {d}</li>
              ))}
            </ul>
          </div>
          <div className="p-5 rounded-xl bg-red-50 border border-red-200">
            <div className="font-semibold text-red-800 mb-2">✗ Don&apos;t</div>
            <ul className="space-y-1.5 text-sm text-red-900">
              {identity.toneOfVoice.dont.map((d, i) => (
                <li key={i}>• {d}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </section>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-lg bg-white border border-slate-200">
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
        {label}
      </div>
      <div className="text-slate-700">{value}</div>
    </div>
  );
}
