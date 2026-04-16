"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProject } from "@/lib/storage";
import { exportBrandPDF, previewBrandPDF, brandPdfFilename } from "@/lib/pdf";
import { generateLogos, downloadSvg, downloadPng } from "@/lib/logo";
import { generateMockups } from "@/lib/mockups";
import type { BrandProject } from "@/lib/types";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<BrandProject | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedLogoId, setSelectedLogoId] = useState<string>("line-monogram");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

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
  const primary = identity.palette[0]?.hex ?? "#4F46E5";
  const dark = identity.palette[3]?.hex ?? "#18181B";
  const light = identity.palette[4]?.hex ?? "#FAFAF9";
  const primaryInk = isLight(primary) ? "#0f172a" : "#ffffff";
  const selectedLogo = logos.find((l) => l.id === selectedLogoId) ?? logos[0];
  const mockups = generateMockups(identity);

  const fontLinks = identity.typography
    .map((t) => encodeURIComponent(t.fontFamily.trim()).replace(/%20/g, "+"))
    .join("&family=");

  return (
    <div className="-mt-[60px]">
      {fontLinks && (
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=${fontLinks}:wght@300;400;500;700;900&display=swap`}
        />
      )}

      {/* ── PDF PREVIEW MODAL ── */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <div className="font-semibold">Preview Brand Guideline</div>
              <div className="flex gap-2">
                <a href={previewUrl} download={brandPdfFilename(project)} className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">⬇ Download</a>
                <button onClick={() => { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }} className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm hover:bg-slate-50">Tutup</button>
              </div>
            </div>
            <iframe src={previewUrl} className="flex-1 w-full" title="PDF Preview" />
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* HERO                                                                */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[80vh] flex items-center" style={{ backgroundColor: primary }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20" style={{ backgroundColor: light }} />
          <div className="absolute bottom-0 left-0 w-full h-32" style={{ background: `linear-gradient(to top, ${dark}22, transparent)` }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-8 w-full py-32">
          <Link href="/projects" className="text-sm opacity-60 hover:opacity-100 transition mb-6 inline-block" style={{ color: primaryInk }}>
            ← Semua Proyek
          </Link>
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4 opacity-50" style={{ color: primaryInk }}>
            Brand Identity
          </p>
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tight leading-[0.9] mb-6" style={{ color: primaryInk }}>
            {brief.brandName}
          </h1>
          <p className="text-xl md:text-2xl max-w-xl opacity-80 leading-relaxed" style={{ color: primaryInk }}>
            {identity.tagline}
          </p>
          <div className="flex flex-wrap gap-2 mt-8">
            {brief.personality.map((p) => (
              <span key={p} className="px-3 py-1 rounded-full text-xs font-medium border" style={{ borderColor: `${primaryInk}33`, color: primaryInk }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* BRAND ESSENCE                                                       */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-8">
          <SectionLabel num="01" label="Brand Essence" />
          <div className="grid md:grid-cols-[1fr_1fr] gap-16 mt-12">
            <div>
              <p className="text-2xl md:text-3xl font-bold leading-snug text-slate-900">
                &ldquo;{identity.essence}&rdquo;
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <InfoBlock label="Visi" value={brief.vision} accent={primary} />
              <InfoBlock label="Misi" value={brief.mission} accent={primary} />
              <InfoBlock label="Industri" value={brief.industry} accent={primary} />
              <InfoBlock label="Audiens" value={brief.targetAudience} accent={primary} />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* LOGO SHOWCASE                                                       */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: dark }}>
        {/* Hero logo display */}
        <div className="max-w-6xl mx-auto px-8 py-24">
          <SectionLabel num="02" label="Logo System" light />
          <div className="mt-12 flex flex-col items-center">
            <div
              className="w-full max-w-md aspect-square flex items-center justify-center p-8 [&>svg]:max-w-full [&>svg]:max-h-full"
              dangerouslySetInnerHTML={{ __html: selectedLogo.svg }}
            />
          </div>
        </div>

        {/* Logo picker strip */}
        <div className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-8 py-10">
            <div className="grid grid-cols-3 gap-4">
              {logos.map((logo) => {
                const active = logo.id === selectedLogoId;
                return (
                  <button
                    key={logo.id}
                    onClick={() => setSelectedLogoId(logo.id)}
                    className={`relative rounded-2xl p-4 aspect-square flex items-center justify-center transition-all [&>div>svg]:max-w-full [&>div>svg]:max-h-full ${
                      active
                        ? "ring-2 ring-white/40 bg-white/10"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div
                      className="w-full h-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: logo.svg }}
                    />
                    <div className="absolute bottom-3 left-0 right-0 text-center">
                      <span className={`text-xs font-medium ${active ? "text-white" : "text-white/50"}`}>
                        {logo.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3 justify-center mt-8">
              <button onClick={() => downloadSvg(selectedLogo.svg, `${slugify(brief.brandName)}-logo.svg`)} className="px-5 py-2 rounded-lg text-sm font-medium border border-white/20 text-white hover:bg-white/10 transition">
                Download SVG
              </button>
              <button onClick={() => downloadPng(selectedLogo.svg, `${slugify(brief.brandName)}-logo.png`)} className="px-5 py-2 rounded-lg text-sm font-medium border border-white/20 text-white hover:bg-white/10 transition">
                Download PNG
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MOCKUPS                                                             */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: light }} className="py-24">
        <div className="max-w-6xl mx-auto px-8">
          <SectionLabel num="03" label="Brand Applications" />
          <div className="mt-12 space-y-6">
            {mockups.map((m) => (
              <div key={m.id} className="rounded-3xl overflow-hidden shadow-xl">
                <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
                  <img src={m.photo} alt={m.name} className="absolute inset-0 w-full h-full object-cover" />
                  {m.overlays.map((ov, i) => (
                    <div
                      key={i}
                      className="absolute flex items-center justify-center"
                      style={{
                        left: `${ov.x}%`,
                        top: `${ov.y}%`,
                        width: `${ov.w}%`,
                        height: `${ov.h}%`,
                        transform: ov.rotate ? `rotate(${ov.rotate}deg)` : undefined,
                        mixBlendMode: ov.blendMode ?? "normal",
                        opacity: ov.opacity ?? 1,
                        backgroundColor: ov.bgColor,
                        borderRadius: ov.bgRadius ? `${ov.bgRadius}px` : undefined,
                        padding: ov.bgColor ? "6%" : 0,
                        boxShadow: ov.bgColor ? "0 8px 24px rgba(0,0,0,0.2)" : undefined,
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full" dangerouslySetInnerHTML={{ __html: selectedLogo.svg }} />
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-white flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">{m.name}</span>
                  {m.credit && <span className="text-xs text-slate-400">Foto: {m.credit}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* COLOR PALETTE                                                       */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ backgroundColor: dark }}>
        <div className="max-w-6xl mx-auto px-8">
          <SectionLabel num="04" label="Color System" light />
          <p className="text-slate-400 text-sm mt-4 max-w-2xl">{identity.rationale}</p>
          <div className="mt-12 space-y-3">
            {identity.palette.map((c, idx) => (
              <ColorBand key={c.hex} color={c} reverse={idx % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TYPOGRAPHY                                                          */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <SectionLabel num="05" label="Typography" />
          <div className="mt-12 rounded-3xl bg-slate-50 border border-slate-200 divide-y divide-slate-200 overflow-hidden">
            {identity.typography.map((t, idx) => (
              <TypographyRow
                key={t.role}
                index={idx + 1}
                font={t}
                accentColor={primary}
                showWeights={t.role === "body"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TONE OF VOICE                                                       */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ backgroundColor: light }}>
        <div className="max-w-6xl mx-auto px-8">
          <SectionLabel num="06" label="Tone of Voice" />
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="p-8 rounded-3xl bg-white border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: primary, color: primaryInk }}>✓</div>
                <h3 className="text-lg font-bold">Do</h3>
              </div>
              <ul className="space-y-4">
                {identity.toneOfVoice.do.map((d, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-700">
                    <span className="font-bold text-slate-300 text-xs mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 rounded-3xl bg-slate-950 text-white">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">✗</div>
                <h3 className="text-lg font-bold">Don&apos;t</h3>
              </div>
              <ul className="space-y-4">
                {identity.toneOfVoice.dont.map((d, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-400">
                    <span className="font-bold text-slate-600 text-xs mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* STICKY BOTTOM BAR                                                   */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <div className="sticky bottom-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-white/10">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="text-white">
            <div className="font-bold">{brief.brandName}</div>
            <div className="text-xs text-slate-400">Brand Guideline</div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={async () => {
                setPreviewLoading(true);
                try { setPreviewUrl(await previewBrandPDF(project)); } finally { setPreviewLoading(false); }
              }}
              disabled={previewLoading}
              className="px-5 py-2.5 rounded-xl border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition disabled:opacity-60"
            >
              {previewLoading ? "Menyiapkan..." : "Preview PDF"}
            </button>
            <button
              onClick={() => { void exportBrandPDF(project); }}
              className="px-5 py-2.5 rounded-xl text-sm font-bold transition"
              style={{ backgroundColor: primary, color: primaryInk }}
            >
              ⬇ Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── COMPONENTS ─────────────────────────────────────────────────────────────

function SectionLabel({ num, label, light }: { num: string; label: string; light?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <span className={`text-xs font-bold tracking-[0.3em] ${light ? "text-white/40" : "text-slate-300"}`}>{num}</span>
      <div className={`h-px flex-1 ${light ? "bg-white/10" : "bg-slate-200"}`} />
      <span className={`text-xs font-bold tracking-[0.2em] uppercase ${light ? "text-white/60" : "text-slate-500"}`}>{label}</span>
    </div>
  );
}

function hexToRgb(hex: string) {
  const c = hex.replace("#", "");
  const f = c.length === 3 ? c.split("").map((x) => x + x).join("") : c.padEnd(6, "0");
  return { r: parseInt(f.slice(0, 2), 16), g: parseInt(f.slice(2, 4), 16), b: parseInt(f.slice(4, 6), 16) };
}

function isLight(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

function tint(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const mix = (c: number) => Math.round(c * amount + 255 * (1 - amount));
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}

function ColorBand({ color, reverse }: { color: { name: string; hex: string; role: string }; reverse: boolean }) {
  const { r, g, b } = hexToRgb(color.hex);
  const ink = isLight(color.hex) ? "#0f172a" : "#ffffff";
  const tints = [80, 60, 40, 20];

  const Tints = (
    <div className="flex gap-1.5 px-3 py-3 items-end">
      {(reverse ? [...tints].reverse() : tints).map((t) => {
        const tintHex = tint(color.hex, t / 100);
        const tintInk = isLight(tintHex) ? "#0f172a" : "#ffffff";
        return (
          <div key={t} className="w-9 md:w-12 rounded-xl flex items-end justify-center pb-2" style={{ backgroundColor: tintHex, height: "100%", minHeight: 80 }}>
            <span className="text-[10px] md:text-xs font-semibold" style={{ color: tintInk, writingMode: "vertical-rl", transform: "rotate(180deg)" }}>{t}%</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch min-h-[140px]" style={{ backgroundColor: color.hex, color: ink }}>
      {reverse ? (
        <>
          <div className="flex-1 flex items-center px-6 py-8"><div className="w-full"><div className="text-2xl md:text-4xl font-bold">{color.name}</div><div className="text-xs md:text-sm mt-1 opacity-80">{color.role}</div></div></div>
          <div className="px-6 py-3 flex md:flex-col gap-4 md:gap-1 text-xs md:text-sm font-mono"><div><div className="opacity-60 text-[10px] uppercase tracking-wider">RGB</div><div>{r}, {g}, {b}</div></div><div><div className="opacity-60 text-[10px] uppercase tracking-wider">Hex</div><button onClick={() => navigator.clipboard.writeText(color.hex)} className="hover:underline" title="Copy">{color.hex.replace("#", "").toUpperCase()}</button></div></div>
          {Tints}
        </>
      ) : (
        <>
          {Tints}
          <div className="flex-1 flex items-center px-6 py-8"><div className="w-full"><div className="text-2xl md:text-4xl font-bold">{color.name}</div><div className="text-xs md:text-sm mt-1 opacity-80">{color.role}</div></div></div>
          <div className="px-6 py-3 flex md:flex-col gap-4 md:gap-1 text-xs md:text-sm font-mono"><div><div className="opacity-60 text-[10px] uppercase tracking-wider">RGB</div><div>{r}, {g}, {b}</div></div><div><div className="opacity-60 text-[10px] uppercase tracking-wider">Hex</div><button onClick={() => navigator.clipboard.writeText(color.hex)} className="hover:underline" title="Copy">{color.hex.replace("#", "").toUpperCase()}</button></div></div>
        </>
      )}
    </div>
  );
}

function TypographyRow({ index, font, accentColor, showWeights }: { index: number; font: { role: "heading" | "body"; fontFamily: string; googleFontUrl: string; rationale: string }; accentColor: string; showWeights: boolean }) {
  const family = `'${font.fontFamily}', sans-serif`;
  const num = String(index).padStart(2, "0");
  const weights = ["Light", "Regular", "Medium", "Bold", "Black"];
  const defaultWeightIdx = font.role === "heading" ? 3 : 1;

  return (
    <div className="p-6 md:p-10 grid md:grid-cols-[auto_1fr_1fr] gap-6 items-center">
      <div><span className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: accentColor }}>{num}</span></div>
      <div>
        <div className="leading-none" style={{ fontFamily: family, fontSize: "clamp(42px, 6vw, 72px)", fontWeight: font.role === "heading" ? 700 : 400 }}>
          {font.fontFamily}
          {font.role === "body" && <span className="text-slate-400 ml-2 font-normal" style={{ fontSize: "0.45em" }}>Family</span>}
        </div>
        <p className="text-xs text-slate-500 mt-3 max-w-md">{font.rationale}</p>
        <a href={font.googleFontUrl} target="_blank" rel="noreferrer" className="text-xs hover:underline mt-1 inline-block" style={{ color: accentColor }}>Google Fonts →</a>
      </div>
      <div>
        <div className="text-sm md:text-base leading-relaxed text-slate-800" style={{ fontFamily: family }}>
          abcdefghijklmnopqrstuvwxyz<br />ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />0123456789!@#$%&?
        </div>
        {showWeights && (
          <div className="mt-5">
            <div className="relative flex justify-between items-center">
              <div className="absolute left-3 right-3 top-1/2 h-px bg-slate-200" />
              {weights.map((w, i) => (
                <div key={w} className="relative flex flex-col items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: i === defaultWeightIdx ? accentColor : "#cbd5e1" }} />
                  <span className={`text-[10px] md:text-xs ${i === defaultWeightIdx ? "font-bold text-slate-900" : "text-slate-500"}`}>{w}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoBlock({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>{label}</div>
      <div className="text-sm text-slate-700 leading-relaxed">{value}</div>
    </div>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
