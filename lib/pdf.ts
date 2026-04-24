import jsPDF from "jspdf";
import type { BrandProject, MockupOverlayState } from "./types";
import { generateLogos, svgToPngDataUrl } from "./logo";
import { generateMockups } from "./mockups";

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
  logoSvg: string;
};

async function loadImageDataUrl(src: string): Promise<string> {
  const url = src.startsWith("http") || src.startsWith("data:")
    ? src
    : new URL(src, window.location.origin).href;
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function composeMockup(
  photoUrl: string,
  overlay: MockupOverlayState,
  logoSvg: string
): Promise<string> {
  const photoDataUrl = await loadImageDataUrl(photoUrl);
  const logoPngUrl = await svgToPngDataUrl(logoSvg, 1000, 1000);
  const [photo, logo] = await Promise.all([
    loadImage(photoDataUrl),
    loadImage(logoPngUrl),
  ]);
  const canvas = document.createElement("canvas");
  canvas.width = photo.width;
  canvas.height = photo.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas 2d unavailable");
  ctx.drawImage(photo, 0, 0);

  const x = (overlay.x / 100) * photo.width;
  const y = (overlay.y / 100) * photo.height;
  const w = (overlay.w / 100) * photo.width;
  const h = (overlay.h / 100) * photo.height;
  const rot = ((overlay.rotate ?? 0) * Math.PI) / 180;
  const skewY = ((overlay.rotateX ?? 0) * Math.PI) / 180 / 4;
  const skewX = ((overlay.rotateY ?? 0) * Math.PI) / 180 / 4;

  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(rot);
  ctx.transform(1, Math.tan(skewY), Math.tan(skewX), 1, 0, 0);
  ctx.drawImage(logo, -w / 2, -h / 2, w, h);
  ctx.restore();

  return canvas.toDataURL("image/jpeg", 0.88);
}

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

async function renderCover({ doc, project, logoSvg }: Ctx) {
  const { brief, identity } = project;
  fillPage(doc, "#0a0a0c");

  // Soft spotlight (concentric fading rings for gradient approximation)
  const primary = identity.palette[0]?.hex ?? "#4F46E5";
  const { r, g, b } = hexToRgb(primary);
  for (let i = 12; i >= 0; i--) {
    const radius = 40 + i * 22;
    const alpha = 0.04 + (12 - i) * 0.008;
    doc.setFillColor(r, g, b);
    doc.setGState(doc.GState({ opacity: alpha }));
    doc.circle(A4_W / 2, A4_H / 2 - 40, radius, "F");
  }
  doc.setGState(doc.GState({ opacity: 1 }));

  const ink = { r: 255, g: 255, b: 255 };

  // Top bar
  setTextRgb(doc, ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("— BRAND GUIDELINE", 48, 56, { charSpace: 3 });
  doc.text(
    String(new Date(project.createdAt).getFullYear()),
    A4_W - 48,
    56,
    { align: "right", charSpace: 3 }
  );
  setFillRgb(doc, ink);
  doc.rect(48, 64, A4_W - 96, 0.4, "F");

  // Logo
  try {
    const png = await svgToPngDataUrl(logoSvg, 1000, 1000);
    const size = 180;
    doc.addImage(png, "PNG", (A4_W - size) / 2, A4_H / 2 - 130, size, size);
  } catch {}

  // Brand name caps
  setTextRgb(doc, ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(48);
  doc.text(brief.brandName.toUpperCase(), A4_W / 2, A4_H / 2 + 100, {
    align: "center",
  });

  // Tagline subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  setTextRgb(doc, { r: 200, g: 200, b: 210 });
  doc.text(identity.tagline, A4_W / 2, A4_H / 2 + 130, { align: "center" });

  // Bottom bar
  setFillRgb(doc, ink);
  doc.rect(48, A4_H - 64, A4_W - 96, 0.4, "F");
  setTextRgb(doc, ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("VISUAL IDENTITY SYSTEM", 48, A4_H - 44, { charSpace: 3 });
  doc.text(brief.industry.toUpperCase(), A4_W - 48, A4_H - 44, {
    align: "right",
    charSpace: 3,
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

async function renderLogoHero({ doc, project, logoSvg }: Ctx) {
  doc.addPage();
  fillPage(doc, "#0a0a0c");
  const primary = project.identity.palette[0]?.hex ?? "#4F46E5";
  const { r, g, b } = hexToRgb(primary);

  // Spotlight rings behind the logo
  for (let i = 10; i >= 0; i--) {
    const radius = 60 + i * 28;
    const alpha = 0.05 + (10 - i) * 0.01;
    doc.setFillColor(r, g, b);
    doc.setGState(doc.GState({ opacity: alpha }));
    doc.circle(A4_W / 2, A4_H / 2, radius, "F");
  }
  doc.setGState(doc.GState({ opacity: 1 }));

  const ink = { r: 255, g: 255, b: 255 };
  setTextRgb(doc, ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("— IDENTITY MARK", 48, 72, { charSpace: 3 });
  doc.text("PRIMARY", A4_W - 48, 72, { align: "right", charSpace: 3 });
  setFillRgb(doc, ink);
  doc.rect(48, 80, A4_W - 96, 0.4, "F");

  try {
    const png = await svgToPngDataUrl(logoSvg, 1200, 1200);
    const size = 300;
    doc.addImage(png, "PNG", (A4_W - size) / 2, (A4_H - size) / 2 - 30, size, size);
  } catch {}

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  setTextRgb(doc, { r: 200, g: 200, b: 210 });
  const rat = doc.splitTextToSize(
    `Identitas visual ${project.brief.brandName} merefleksikan ${project.brief.personality.join(", ").toLowerCase()}.`,
    A4_W - 240
  );
  let y = A4_H - 130;
  rat.forEach((line: string) => {
    doc.text(line, A4_W / 2, y, { align: "center" });
    y += 14;
  });

  setFillRgb(doc, ink);
  doc.rect(48, A4_H - 64, A4_W - 96, 0.4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setTextRgb(doc, ink);
  doc.text("02 / LOGO", 48, A4_H - 44, { charSpace: 3 });
  doc.text(project.brief.brandName.toUpperCase(), A4_W - 48, A4_H - 44, {
    align: "right",
    charSpace: 3,
  });
}

async function renderLogoGrid({ doc, project, logoSvg }: Ctx) {
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

  // Show same selected logo on 4 different backgrounds (primary / light / dark / accent)
  const bgs = [
    { label: "PRIMARY", color: primary },
    { label: "LIGHT", color: light },
    { label: "DARK", color: project.identity.palette[3]?.hex ?? "#18181B" },
    { label: "ACCENT", color: project.identity.palette[2]?.hex ?? primary },
  ];

  const gap = 14;
  const cellW = (A4_W - 96 - gap) / 2;
  const cellH = 210;
  const startY = 320;

  let png: string | null = null;
  try {
    png = await svgToPngDataUrl(logoSvg, 900, 900);
  } catch {}

  for (let i = 0; i < bgs.length; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 48 + col * (cellW + gap);
    const y = startY + row * (cellH + 40);
    const bgRgb = hexToRgb(bgs[i].color);
    const bgInk = readableOn(bgs[i].color);

    setFillRgb(doc, bgRgb);
    doc.rect(x, y, cellW, cellH, "F");

    if (png) {
      const s = Math.min(cellW, cellH) - 60;
      doc.addImage(png, "PNG", x + (cellW - s) / 2, y + (cellH - s) / 2, s, s);
    }

    // Label at corner of cell
    setTextRgb(doc, bgInk);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(bgs[i].label, x + 12, y + 20, { charSpace: 3 });
    doc.setFont("helvetica", "normal");
    doc.text(bgs[i].color.toUpperCase(), x + cellW - 12, y + 20, {
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

// ── NEW PAGES ─ Behance case-study style ─────────────────────────────────

function renderManifesto({ doc, project }: Ctx) {
  doc.addPage();
  fillPage(doc, "#0a0a0c");
  const ink = { r: 255, g: 255, b: 255 };
  const primary = project.identity.palette[0]?.hex ?? "#4F46E5";
  const accentRgb = hexToRgb(primary);

  setTextRgb(doc, ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("— MANIFESTO", 48, 72, { charSpace: 3 });
  doc.text(
    project.brief.brandName.toUpperCase(),
    A4_W - 48,
    72,
    { align: "right", charSpace: 3 }
  );

  // Accent dot (bullet)
  setFillRgb(doc, accentRgb);
  doc.circle(A4_W / 2, 200, 6, "F");

  // Centered big quote
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  setTextRgb(doc, ink);
  const quoteLines = doc.splitTextToSize(
    `"${project.identity.tagline}"`,
    A4_W - 160
  );
  let y = 280;
  quoteLines.forEach((line: string) => {
    doc.text(line, A4_W / 2, y, { align: "center" });
    y += 36;
  });

  // Essence paragraph
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const essLines = doc.splitTextToSize(
    project.identity.essence,
    A4_W - 220
  );
  y += 30;
  essLines.forEach((line: string) => {
    doc.text(line, A4_W / 2, y, { align: "center" });
    y += 16;
  });

  // Bottom divider
  setFillRgb(doc, ink);
  doc.rect(A4_W / 2 - 30, A4_H - 90, 60, 0.8, "F");
  doc.setFontSize(8);
  doc.text(
    project.brief.industry.toUpperCase(),
    A4_W / 2,
    A4_H - 60,
    { align: "center", charSpace: 3 }
  );
}

async function renderMockupsSection({ doc, project, logoSvg }: Ctx) {
  const scenes = generateMockups(project.identity);

  for (const scene of scenes) {
    const overlay = project.mockupOverlays?.[scene.id] ?? {
      x: scene.overlays[0].x,
      y: scene.overlays[0].y,
      w: scene.overlays[0].w,
      h: scene.overlays[0].h,
      rotate: scene.overlays[0].rotate ?? 0,
    };

    doc.addPage();
    fillPage(doc, "#0a0a0c");

    try {
      const composed = await composeMockup(scene.photo, overlay, logoSvg);
      const img = await loadImage(composed);
      // Fit image inside A4 with margin, maintain aspect ratio
      const margin = 40;
      const maxW = A4_W - margin * 2;
      const maxH = A4_H - 180;
      const ratio = img.width / img.height;
      let w = maxW;
      let h = w / ratio;
      if (h > maxH) {
        h = maxH;
        w = h * ratio;
      }
      const x = (A4_W - w) / 2;
      const yTop = 110;
      doc.addImage(composed, "JPEG", x, yTop, w, h);
    } catch {
      // skip on fetch error
    }

    // Header
    setTextRgb(doc, { r: 255, g: 255, b: 255 });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("— APPLICATIONS", 48, 72, { charSpace: 3 });
    doc.text(scene.name.toUpperCase(), A4_W - 48, 72, {
      align: "right",
      charSpace: 3,
    });
    setFillRgb(doc, { r: 255, g: 255, b: 255 });
    doc.rect(48, 80, A4_W - 96, 0.4, "F");

    // Footer caption
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setTextRgb(doc, { r: 180, g: 180, b: 190 });
    doc.text(
      `Brand identity applied on ${scene.name.toLowerCase()}.`,
      A4_W / 2,
      A4_H - 60,
      { align: "center" }
    );
  }
}

function renderBackCover({ doc, project }: Ctx) {
  doc.addPage();
  const primary = project.identity.palette[0]?.hex ?? "#111";
  fillPage(doc, primary);
  const ink = readableOn(primary);

  setTextRgb(doc, ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("— THE END", 48, 72, { charSpace: 3 });
  doc.text(
    `${String(new Date(project.createdAt).getFullYear())} © ${project.brief.brandName.toUpperCase()}`,
    A4_W - 48,
    72,
    { align: "right", charSpace: 3 }
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(48);
  doc.text("Thank you.", A4_W / 2, A4_H / 2 - 20, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(project.identity.tagline, A4_W / 2, A4_H / 2 + 20, {
    align: "center",
  });

  setFillRgb(doc, ink);
  doc.rect(48, A4_H - 64, A4_W - 96, 0.5, "F");
  doc.setFontSize(8);
  doc.text("BRAND GUIDELINE — END OF DOCUMENT", A4_W / 2, A4_H - 44, {
    align: "center",
    charSpace: 3,
  });
}

// ── MAIN ─────────────────────────────────────────────────────────────────

export async function buildBrandPDF(
  project: BrandProject,
  logoSvg?: string
): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const logos = generateLogos(project.brief, project.identity);
  const resolvedLogoSvg =
    logoSvg ?? project.customLogoSvg ?? logos[0]?.svg ?? "";
  const ctx: Ctx = { doc, project, logoSvg: resolvedLogoSvg };

  await renderCover(ctx);
  renderManifesto(ctx);
  renderIndex(ctx);
  renderEssence(ctx);
  await renderLogoHero(ctx);
  await renderLogoGrid(ctx);
  await renderMockupsSection(ctx);
  renderColorPalette(ctx);
  renderTypography(ctx);
  renderTone(ctx);
  renderBackCover(ctx);

  return doc;
}

export async function exportBrandPDF(project: BrandProject, logoSvg?: string) {
  const doc = await buildBrandPDF(project, logoSvg);
  doc.save(`${slugify(project.brief.brandName)}-brand-guideline.pdf`);
}

export async function previewBrandPDF(
  project: BrandProject,
  logoSvg?: string
): Promise<string> {
  const doc = await buildBrandPDF(project, logoSvg);
  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
}

export function brandPdfFilename(project: BrandProject): string {
  return `${slugify(project.brief.brandName)}-brand-guideline.pdf`;
}
