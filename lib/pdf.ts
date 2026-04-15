import jsPDF from "jspdf";
import type { BrandProject } from "./types";
import { generateLogos, svgToPngDataUrl } from "./logo";

const A4_W = 595.28;
const A4_H = 841.89;

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean.padEnd(6, "0");
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function luminance({ r, g, b }: { r: number; g: number; b: number }) {
  const norm = [r, g, b].map((v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * norm[0] + 0.7152 * norm[1] + 0.0722 * norm[2];
}

function readableOn(hex: string): { r: number; g: number; b: number } {
  return luminance(hexToRgb(hex)) > 0.55
    ? { r: 20, g: 20, b: 25 }
    : { r: 255, g: 255, b: 255 };
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type Ctx = {
  doc: jsPDF;
  project: BrandProject;
};

function fillPage(doc: jsPDF, hex: string) {
  const { r, g, b } = hexToRgb(hex);
  doc.setFillColor(r, g, b);
  doc.rect(0, 0, A4_W, A4_H, "F");
}

function setTextRgb(doc: jsPDF, rgb: { r: number; g: number; b: number }) {
  doc.setTextColor(rgb.r, rgb.g, rgb.b);
}

function setFillRgb(doc: jsPDF, rgb: { r: number; g: number; b: number }) {
  doc.setFillColor(rgb.r, rgb.g, rgb.b);
}

// ── PAGES ────────────────────────────────────────────────────────────────

async function renderCover({ doc, project }: Ctx) {
  const { brief, identity } = project;
  const primary = identity.palette[0]?.hex ?? "#111111";
  fillPage(doc, primary);
  const ink = readableOn(primary);

  // Top bar
  setTextRgb(doc, ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("BRAND GUIDELINE", 48, 56, { charSpace: 2 });
  doc.text(
    String(new Date(project.createdAt).getFullYear()),
    A4_W - 48,
    56,
    { align: "right", charSpace: 2 }
  );

  // Thin line
  setFillRgb(doc, ink);
  doc.rect(48, 64, A4_W - 96, 0.6, "F");

  // Logo
  const logos = generateLogos(brief, identity);
  const logo = logos.find((l) => l.id === "stacked") ?? logos[0];
  try {
    const png = await svgToPngDataUrl(logo.svg, 700, 700);
    const size = 220;
    doc.addImage(png, "PNG", (A4_W - size) / 2, 230, size, size);
  } catch {}

  // Brand name
  setTextRgb(doc, ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(56);
  const nameLines = doc.splitTextToSize(
    brief.brandName.toUpperCase(),
    A4_W - 96
  );
  doc.text(nameLines, A4_W / 2, 560, { align: "center" });

  // Tagline
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.text(identity.tagline, A4_W / 2, 600 + nameLines.length * 10, {
    align: "center",
  });

  // Bottom
  setFillRgb(doc, ink);
  doc.rect(48, A4_H - 64, A4_W - 96, 0.6, "F");
  doc.setFontSize(9);
  doc.text("VISUAL IDENTITY SYSTEM", 48, A4_H - 48, { charSpace: 2 });
  doc.text(brief.industry.toUpperCase(), A4_W - 48, A4_H - 48, {
    align: "right",
    charSpace: 2,
  });
}

function renderIndex({ doc, project }: Ctx) {
  doc.addPage();
  const dark = project.identity.palette[3]?.hex ?? "#111111";
  fillPage(doc, dark);
  const ink = readableOn(dark);
  setTextRgb(doc, ink);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("INDEX", 48, 72, { charSpace: 3 });
  doc.text("01 — 05", A4_W - 48, 72, { align: "right", charSpace: 3 });

  setFillRgb(doc, ink);
  doc.rect(48, 80, A4_W - 96, 0.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(64);
  const title = "VISUAL\nIDENTITY\nSYSTEM";
  let y = 200;
  title.split("\n").forEach((line) => {
    doc.text(line, 48, y);
    y += 68;
  });

  const items = [
    ["01", "Brand Essence"],
    ["02", "Logo System"],
    ["03", "Color Palette"],
    ["04", "Typography"],
    ["05", "Tone of Voice"],
  ];
  y = 520;
  doc.setFontSize(11);
  items.forEach(([n, label]) => {
    doc.setFont("helvetica", "bold");
    doc.text(n, 48, y, { charSpace: 2 });
    doc.setFont("helvetica", "normal");
    doc.text(label, 100, y);
    setFillRgb(doc, ink);
    doc.rect(48, y + 8, A4_W - 96, 0.3, "F");
    y += 32;
  });
}

function renderEssence({ doc, project }: Ctx) {
  doc.addPage();
  const light = project.identity.palette[4]?.hex ?? "#FAFAF9";
  fillPage(doc, light);
  const ink = readableOn(light);
  const primary = project.identity.palette[0]?.hex ?? "#111";
  const primaryRgb = hexToRgb(primary);

  setTextRgb(doc, ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("01 / ESSENCE", 48, 72, { charSpace: 2 });
  doc.text(
    project.brief.brandName.toUpperCase(),
    A4_W - 48,
    72,
    { align: "right", charSpace: 2 }
  );
  setFillRgb(doc, ink);
  doc.rect(48, 80, A4_W - 96, 0.4, "F");

  // Huge tagline
  setTextRgb(doc, primaryRgb);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(48);
  const tag = doc.splitTextToSize(`"${project.identity.tagline}"`, A4_W - 96);
  let y = 180;
  tag.forEach((line: string) => {
    doc.text(line, 48, y);
    y += 52;
  });

  // Essence body
  setTextRgb(doc, ink);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const essLines = doc.splitTextToSize(
    project.identity.essence,
    A4_W - 96
  );
  y += 20;
  essLines.forEach((line: string) => {
    doc.text(line, 48, y);
    y += 18;
  });

  // 3-col grid for visi/misi/audiens
  const gridY = A4_H - 280;
  const colW = (A4_W - 96 - 32) / 3;
  const cols = [
    { label: "VISI", value: project.brief.vision },
    { label: "MISI", value: project.brief.mission },
    { label: "AUDIENS", value: project.brief.targetAudience },
  ];
  cols.forEach((c, i) => {
    const x = 48 + i * (colW + 16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    setTextRgb(doc, primaryRgb);
    doc.text(c.label, x, gridY, { charSpace: 2 });
    setFillRgb(doc, primaryRgb);
    doc.rect(x, gridY + 6, 30, 1.5, "F");
    setTextRgb(doc, ink);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const vLines = doc.splitTextToSize(c.value, colW);
    vLines.slice(0, 8).forEach((line: string, li: number) => {
      doc.text(line, x, gridY + 30 + li * 14);
    });
  });

  // Personality chips
  const pY = A4_H - 90;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setTextRgb(doc, primaryRgb);
  doc.text("PERSONALITY", 48, pY, { charSpace: 2 });
  let px = 48;
  const py = pY + 18;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  project.brief.personality.forEach((trait) => {
    const w = doc.getTextWidth(trait) + 20;
    setFillRgb(doc, primaryRgb);
    doc.roundedRect(px, py - 10, w, 18, 9, 9, "F");
    setTextRgb(doc, readableOn(primary));
    doc.text(trait, px + 10, py + 1);
    px += w + 8;
  });
}

async function renderLogoHero({ doc, project }: Ctx) {
  doc.addPage();
  const primary = project.identity.palette[0]?.hex ?? "#111";
  fillPage(doc, primary);
  const ink = readableOn(primary);
  setTextRgb(doc, ink);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("02 / LOGO", 48, 72, { charSpace: 2 });
  doc.text("PRIMARY MARK", A4_W - 48, 72, {
    align: "right",
    charSpace: 2,
  });
  setFillRgb(doc, ink);
  doc.rect(48, 80, A4_W - 96, 0.4, "F");

  const logos = generateLogos(project.brief, project.identity);
  const main = logos.find((l) => l.id === "stacked") ?? logos[0];
  try {
    const png = await svgToPngDataUrl(main.svg, 800, 800);
    const size = 320;
    doc.addImage(png, "PNG", (A4_W - size) / 2, 220, size, size);
  } catch {}

  setTextRgb(doc, ink);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const rat = doc.splitTextToSize(
    `Logo utama ${project.brief.brandName} dibangun dari kombinasi ikon dan wordmark yang merefleksikan kepribadian brand: ${project.brief.personality.join(", ").toLowerCase()}.`,
    A4_W - 200
  );
  let y = A4_H - 140;
  rat.forEach((line: string) => {
    doc.text(line, A4_W / 2, y, { align: "center" });
    y += 16;
  });
}

async function renderLogoGrid({ doc, project }: Ctx) {
  doc.addPage();
  const light = project.identity.palette[4]?.hex ?? "#FAFAF9";
  fillPage(doc, light);
  const ink = readableOn(light);
  const primary = project.identity.palette[0]?.hex ?? "#111";

  setTextRgb(doc, ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("02 / LOGO", 48, 72, { charSpace: 2 });
  doc.text("VARIATIONS", A4_W - 48, 72, {
    align: "right",
    charSpace: 2,
  });
  setFillRgb(doc, ink);
  doc.rect(48, 80, A4_W - 96, 0.4, "F");

  doc.setFontSize(42);
  doc.setFont("helvetica", "bold");
  doc.text("LOGO\nFAMILY", 48, 160);

  const logos = generateLogos(project.brief, project.identity);
  const cellW = (A4_W - 96 - 24) / 3;
  const cellH = 160;
  const startY = 300;

  for (let i = 0; i < logos.length; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 48 + col * (cellW + 12);
    const y = startY + row * (cellH + 50);

    // Alternate bg (primary on odd, light on even)
    const alt = i % 2 === 1;
    if (alt) {
      setFillRgb(doc, hexToRgb(primary));
      doc.rect(x, y, cellW, cellH, "F");
    } else {
      doc.setDrawColor(ink.r, ink.g, ink.b);
      doc.setLineWidth(0.4);
      doc.rect(x, y, cellW, cellH, "S");
    }

    try {
      const png = await svgToPngDataUrl(logos[i].svg, 600, 600);
      const s = Math.min(cellW, cellH) - 40;
      doc.addImage(png, "PNG", x + (cellW - s) / 2, y + (cellH - s) / 2, s, s);
    } catch {}

    setTextRgb(doc, ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(logos[i].name.toUpperCase(), x, y + cellH + 16, { charSpace: 1 });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(`0${i + 1} / 0${logos.length}`, x + cellW, y + cellH + 16, {
      align: "right",
      charSpace: 1,
    });
  }
}

function renderColorPalette({ doc, project }: Ctx) {
  doc.addPage();
  const palette = project.identity.palette;

  // Top header strip
  doc.setFillColor(245, 245, 240);
  doc.rect(0, 0, A4_W, 110, "F");
  doc.setTextColor(20, 20, 25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("03 / COLOR PALETTE", 48, 48, { charSpace: 2 });
  doc.text(`${palette.length} COLORS`, A4_W - 48, 48, {
    align: "right",
    charSpace: 2,
  });
  doc.setFontSize(36);
  doc.text("CHROMATIC\nSYSTEM", 48, 90);

  // Full-bleed horizontal color bars
  const bandTop = 110;
  const bandH = (A4_H - bandTop) / palette.length;
  palette.forEach((c, i) => {
    const y = bandTop + i * bandH;
    const { r, g, b } = hexToRgb(c.hex);
    doc.setFillColor(r, g, b);
    doc.rect(0, y, A4_W, bandH, "F");

    const ink = readableOn(c.hex);
    setTextRgb(doc, ink);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(c.name.toUpperCase(), 48, y + bandH / 2 - 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(c.role, 48, y + bandH / 2 + 16, {
      maxWidth: A4_W / 2 - 60,
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(c.hex.toUpperCase(), A4_W - 48, y + bandH / 2 - 4, {
      align: "right",
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`RGB ${r} · ${g} · ${b}`, A4_W - 48, y + bandH / 2 + 16, {
      align: "right",
    });

    // index
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`0${i + 1}`, A4_W - 48, y + 24, {
      align: "right",
      charSpace: 2,
    });
  });
}

function renderTypography({ doc, project }: Ctx) {
  const typo = project.identity.typography;
  const primary = project.identity.palette[0]?.hex ?? "#111";

  typo.forEach((t, idx) => {
    doc.addPage();
    const isDark = idx === 0;
    const bgHex = isDark ? primary : project.identity.palette[4]?.hex ?? "#FAFAF9";
    fillPage(doc, bgHex);
    const ink = readableOn(bgHex);
    setTextRgb(doc, ink);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("04 / TYPOGRAPHY", 48, 72, { charSpace: 2 });
    doc.text(
      t.role === "heading" ? "PRIMARY / HEADING" : "SECONDARY / BODY",
      A4_W - 48,
      72,
      { align: "right", charSpace: 2 }
    );
    setFillRgb(doc, ink);
    doc.rect(48, 80, A4_W - 96, 0.4, "F");

    // Giant Aa
    doc.setFont("helvetica", "bold");
    doc.setFontSize(380);
    doc.text("Aa", 48, 460);

    // Alphabet row
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 48, 520);
    doc.text("abcdefghijklmnopqrstuvwxyz 0123456789", 48, 544);

    // Family name block
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(
      t.role === "heading" ? "FONT FAMILY — HEADING" : "FONT FAMILY — BODY",
      48,
      A4_H - 200,
      { charSpace: 2 }
    );
    doc.setFontSize(48);
    doc.text(t.fontFamily.toUpperCase(), 48, A4_H - 150);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const rat = doc.splitTextToSize(t.rationale, A4_W - 96);
    let y = A4_H - 110;
    rat.forEach((l: string) => {
      doc.text(l, 48, y);
      y += 14;
    });

    doc.setFontSize(9);
    doc.text(t.googleFontUrl, 48, A4_H - 48);
  });
}

function renderTone({ doc, project }: Ctx) {
  doc.addPage();
  const light = project.identity.palette[4]?.hex ?? "#FAFAF9";
  fillPage(doc, light);
  const ink = readableOn(light);
  const primary = project.identity.palette[0]?.hex ?? "#111";
  const primaryRgb = hexToRgb(primary);

  setTextRgb(doc, ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("05 / TONE OF VOICE", 48, 72, { charSpace: 2 });
  doc.text("DO · DON'T", A4_W - 48, 72, {
    align: "right",
    charSpace: 2,
  });
  setFillRgb(doc, ink);
  doc.rect(48, 80, A4_W - 96, 0.4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(56);
  doc.text("HOW WE\nSPEAK", 48, 180);

  const colW = (A4_W - 96 - 24) / 2;
  const colY = 360;

  // DO column
  setTextRgb(doc, primaryRgb);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.text("DO", 48, colY);
  setFillRgb(doc, primaryRgb);
  doc.rect(48, colY + 10, 40, 2.5, "F");
  setTextRgb(doc, ink);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  let y = colY + 46;
  project.identity.toneOfVoice.do.forEach((d, i) => {
    doc.setFont("helvetica", "bold");
    doc.text(`0${i + 1}`, 48, y, { charSpace: 2 });
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(d, colW - 28);
    lines.forEach((line: string, li: number) => {
      doc.text(line, 76, y + li * 14);
    });
    y += lines.length * 14 + 16;
  });

  // DON'T column
  const x2 = 48 + colW + 24;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(180, 40, 40);
  doc.text("DON'T", x2, colY);
  doc.setFillColor(180, 40, 40);
  doc.rect(x2, colY + 10, 40, 2.5, "F");
  setTextRgb(doc, ink);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  y = colY + 46;
  project.identity.toneOfVoice.dont.forEach((d, i) => {
    doc.setFont("helvetica", "bold");
    doc.text(`0${i + 1}`, x2, y, { charSpace: 2 });
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(d, colW - 28);
    lines.forEach((line: string, li: number) => {
      doc.text(line, x2 + 28, y + li * 14);
    });
    y += lines.length * 14 + 16;
  });

  // Footer
  setFillRgb(doc, ink);
  doc.rect(48, A4_H - 64, A4_W - 96, 0.4, "F");
  setTextRgb(doc, ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(
    `${project.brief.brandName.toUpperCase()} · BRAND GUIDELINE`,
    48,
    A4_H - 48,
    { charSpace: 2 }
  );
  doc.text("END OF DOCUMENT", A4_W - 48, A4_H - 48, {
    align: "right",
    charSpace: 2,
  });
}

// ── MAIN ─────────────────────────────────────────────────────────────────

export async function exportBrandPDF(project: BrandProject) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const ctx: Ctx = { doc, project };

  await renderCover(ctx);
  renderIndex(ctx);
  renderEssence(ctx);
  await renderLogoHero(ctx);
  await renderLogoGrid(ctx);
  renderColorPalette(ctx);
  renderTypography(ctx);
  renderTone(ctx);

  doc.save(`${slugify(project.brief.brandName)}-brand-guideline.pdf`);
}
