import jsPDF from "jspdf";
import type { BrandProject, MockupOverlayState } from "./types";
import { generateLogos, svgToPngDataUrl } from "./logo";
import { generateMockups } from "./mockups";

const PAGE_W = 1200;
const INFO_H = 1700;

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

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const toHex = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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

function mix(hex: string, towards: { r: number; g: number; b: number }, t: number) {
  const c = hexToRgb(hex);
  return {
    r: c.r + (towards.r - c.r) * t,
    g: c.g + (towards.g - c.g) * t,
    b: c.b + (towards.b - c.b) * t,
  };
}

function lighten(hex: string, amount: number) {
  return rgbToHex(mix(hex, { r: 255, g: 255, b: 255 }, amount));
}
function darken(hex: string, amount: number) {
  return rgbToHex(mix(hex, { r: 0, g: 0, b: 0 }, amount));
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

async function ensureFontLoaded(family: string, weights: number[] = [400, 700]) {
  if (typeof document === "undefined" || !document.fonts) return;
  await Promise.all(
    weights.map((w) =>
      document.fonts.load(`${w} 64px '${family}'`).catch(() => undefined)
    )
  );
}

type TextPng = { dataUrl: string; w: number; h: number };

function renderTextPng(opts: {
  text: string;
  family: string;
  weight: number;
  size: number;
  color: string;
  italic?: boolean;
}): TextPng {
  const dpr = 2;
  const fontSpec = `${opts.italic ? "italic " : ""}${opts.weight} ${opts.size}px '${opts.family}', sans-serif`;
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d")!;
  measureCtx.font = fontSpec;
  const metrics = measureCtx.measureText(opts.text);
  const ascent =
    (metrics as TextMetrics & { actualBoundingBoxAscent?: number }).actualBoundingBoxAscent ??
    opts.size * 0.8;
  const descent =
    (metrics as TextMetrics & { actualBoundingBoxDescent?: number }).actualBoundingBoxDescent ??
    opts.size * 0.25;
  const padX = Math.ceil(opts.size * 0.1);
  const padY = Math.ceil(opts.size * 0.15);
  const w = Math.ceil(metrics.width) + padX * 2;
  const h = Math.ceil(ascent + descent) + padY * 2;

  const canvas = document.createElement("canvas");
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  ctx.font = fontSpec;
  ctx.fillStyle = opts.color;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(opts.text, padX, padY + ascent);
  return { dataUrl: canvas.toDataURL("image/png"), w, h };
}

function fillPage(doc: jsPDF, hex: string, w: number, h: number) {
  const { r, g, b } = hexToRgb(hex);
  doc.setFillColor(r, g, b);
  doc.rect(0, 0, w, h, "F");
}

function setTextRgb(doc: jsPDF, rgb: { r: number; g: number; b: number }) {
  doc.setTextColor(rgb.r, rgb.g, rgb.b);
}

function setFillRgb(doc: jsPDF, rgb: { r: number; g: number; b: number }) {
  doc.setFillColor(rgb.r, rgb.g, rgb.b);
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

// ── MOCKUP PAGES (variable aspect ratio, full bleed) ─────────────────────

async function renderMockups({ doc, project, logoSvg }: Ctx, isFirst: boolean) {
  const scenes = generateMockups(project.identity);

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];

    const overlay = project.mockupOverlays?.[scene.id] ?? {
      x: scene.overlays[0].x,
      y: scene.overlays[0].y,
      w: scene.overlays[0].w,
      h: scene.overlays[0].h,
      rotate: scene.overlays[0].rotate ?? 0,
    };

    let composed: string | null = null;
    let ratio = 16 / 9;
    try {
      composed = await composeMockup(scene.photo, overlay, logoSvg);
      const img = await loadImage(composed);
      ratio = img.width / img.height;
    } catch {}

    const pageW = 1200;
    const pageH = Math.round(pageW / ratio);
    if (isFirst && i === 0) {
      doc.deletePage(1);
    }
    doc.addPage([pageW, pageH], pageW > pageH ? "landscape" : "portrait");

    doc.setFillColor(10, 10, 12);
    doc.rect(0, 0, pageW, pageH, "F");

    if (composed) {
      doc.addImage(composed, "JPEG", 0, 0, pageW, pageH);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(scene.name.toUpperCase(), 28, 32, { charSpace: 3 });
    doc.text(
      `0${i + 1} / 0${scenes.length}`,
      pageW - 28,
      32,
      { align: "right", charSpace: 2 }
    );
  }
}

// ── INFO PAGES (1200 × 1700 portrait, screenshot-style) ──────────────────

function pageHeader(
  doc: jsPDF,
  inkRgb: { r: number; g: number; b: number },
  number: string,
  label: string
) {
  setTextRgb(doc, inkRgb);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(number, 80, 80, { charSpace: 2 });
  setFillRgb(doc, inkRgb);
  doc.setGState(doc.GState({ opacity: 0.25 }));
  doc.rect(120, 76, PAGE_W - 280, 1, "F");
  doc.setGState(doc.GState({ opacity: 1 }));
  doc.text(label, PAGE_W - 80, 80, { align: "right", charSpace: 3 });
}

function renderColorSystem({ doc, project }: Ctx) {
  doc.addPage([PAGE_W, INFO_H], "portrait");
  fillPage(doc, "#0a0a0c", PAGE_W, INFO_H);
  const ink = { r: 240, g: 240, b: 245 };

  pageHeader(doc, ink, "0.0", "COLOR SYSTEM");

  // Lead paragraph (uses generator's palette rationale)
  setTextRgb(doc, { r: 200, g: 200, b: 210 });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  const lead = doc.splitTextToSize(
    project.identity.rationale ?? project.identity.essence ?? "",
    PAGE_W - 160
  );
  let y = 130;
  lead.slice(0, 3).forEach((line: string) => {
    doc.text(line, 80, y);
    y += 22;
  });

  // Color cards stack
  const palette = project.identity.palette;
  const cardX = 80;
  const cardW = PAGE_W - 160;
  const stackTop = 240;
  const stackBottom = INFO_H - 80;
  const gap = 18;
  const cardH = (stackBottom - stackTop - gap * (palette.length - 1)) / palette.length;

  palette.forEach((c, i) => {
    const cardY = stackTop + i * (cardH + gap);
    const bg = hexToRgb(c.hex);
    const ink = readableOn(c.hex);

    // Card background
    setFillRgb(doc, bg);
    doc.roundedRect(cardX, cardY, cardW, cardH, 16, 16, "F");

    // Tint strips on the left (4 darker for light cards, lighter for dark cards)
    const isLight = ink.r === 20;
    const stripCount = 4;
    const stripW = 60;
    const stripGap = 8;
    const stripsTotalW = stripCount * stripW + (stripCount - 1) * stripGap;
    const stripsX = cardX + 24;
    const stripsY = cardY + 20;
    const stripsH = cardH - 40;
    for (let s = 0; s < stripCount; s++) {
      const t = 0.18 + s * 0.16;
      const stripHex = isLight ? darken(c.hex, t) : lighten(c.hex, t);
      const stripRgb = hexToRgb(stripHex);
      setFillRgb(doc, stripRgb);
      doc.roundedRect(
        stripsX + s * (stripW + stripGap),
        stripsY,
        stripW,
        stripsH,
        8,
        8,
        "F"
      );
      // tint percentage
      setTextRgb(doc, readableOn(stripHex));
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(
        `${Math.round((1 - t) * 100)}%`,
        stripsX + s * (stripW + stripGap) + 8,
        stripsY + stripsH - 12,
        { charSpace: 1 }
      );
    }

    // Center text block
    const textX = stripsX + stripsTotalW + 48;
    setTextRgb(doc, ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(34);
    doc.text(c.name, textX, cardY + cardH / 2 - 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    setGStateOpacity(doc, 0.85);
    const roleLines = doc.splitTextToSize(c.role, cardW - (textX - cardX) - 240);
    roleLines.slice(0, 2).forEach((line: string, li: number) => {
      doc.text(line, textX, cardY + cardH / 2 + 22 + li * 16);
    });
    setGStateOpacity(doc, 1);

    // Right side: hex + RGB
    const rightX = cardX + cardW - 24;
    setTextRgb(doc, ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`${bg.r}, ${bg.g}, ${bg.b}`, rightX, cardY + 30, {
      align: "right",
      charSpace: 1,
    });
    setGStateOpacity(doc, 0.75);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("RGB", rightX, cardY + 46, { align: "right", charSpace: 2 });
    setGStateOpacity(doc, 1);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(c.hex.toUpperCase(), rightX, cardY + cardH - 24, {
      align: "right",
      charSpace: 1,
    });
  });
}

function setGStateOpacity(doc: jsPDF, opacity: number) {
  doc.setGState(doc.GState({ opacity }));
}

function drawCheck(
  doc: jsPDF,
  cx: number,
  cy: number,
  size: number,
  rgb: { r: number; g: number; b: number }
) {
  doc.setDrawColor(rgb.r, rgb.g, rgb.b);
  doc.setLineWidth(2.4);
  doc.setLineCap("round");
  doc.setLineJoin("round");
  doc.lines(
    [
      [size * 0.45, size * 0.5],
      [size * 0.95, -size * 1.0],
    ],
    cx - size * 0.7,
    cy,
    [1, 1],
    "S"
  );
}

function drawCross(
  doc: jsPDF,
  cx: number,
  cy: number,
  size: number,
  rgb: { r: number; g: number; b: number }
) {
  doc.setDrawColor(rgb.r, rgb.g, rgb.b);
  doc.setLineWidth(2.4);
  doc.setLineCap("round");
  doc.line(cx - size, cy - size, cx + size, cy + size);
  doc.line(cx + size, cy - size, cx - size, cy + size);
}

async function renderTypographySection({ doc, project }: Ctx) {
  doc.addPage([PAGE_W, INFO_H], "portrait");
  fillPage(doc, "#f4f4f6", PAGE_W, INFO_H);
  const ink = { r: 24, g: 24, b: 30 };

  pageHeader(doc, ink, "0.0", "TYPOGRAPHY");

  const typo = project.identity.typography;
  const primary = project.identity.palette[0]?.hex ?? "#4F46E5";
  const primaryRgb = hexToRgb(primary);

  const cardX = 80;
  const cardW = PAGE_W - 160;
  const cardTop = 180;
  const cardGap = 36;
  const cardH = (INFO_H - cardTop - 80 - cardGap * (typo.length - 1)) / typo.length;

  for (let i = 0; i < typo.length; i++) {
    const t = typo[i];
    const cardY = cardTop + i * (cardH + cardGap);

    // White rounded card
    setFillRgb(doc, { r: 255, g: 255, b: 255 });
    doc.roundedRect(cardX, cardY, cardW, cardH, 28, 28, "F");

    // Index badge
    const badgeX = cardX + 50;
    const badgeY = cardY + 50;
    setFillRgb(doc, primaryRgb);
    doc.circle(badgeX, badgeY, 22, "F");
    setTextRgb(doc, readableOn(primary));
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(String(i + 1).padStart(2, "0"), badgeX, badgeY + 4, {
      align: "center",
      charSpace: 1,
    });

    // Make sure the actual font is loaded before rasterising
    await ensureFontLoaded(t.fontFamily, [300, 400, 500, 700, 900]);

    // Big font name rendered IN the actual font
    try {
      const heading = renderTextPng({
        text: t.fontFamily,
        family: t.fontFamily,
        weight: t.role === "heading" ? 700 : 400,
        size: 130,
        color: "#141419",
      });
      const maxW = cardW * 0.55;
      let dispW = heading.w;
      let dispH = heading.h;
      if (dispW > maxW) {
        const k = maxW / dispW;
        dispW = maxW;
        dispH = heading.h * k;
      }
      doc.addImage(heading.dataUrl, "PNG", badgeX + 50, cardY + 60, dispW, dispH);

      if (t.role === "body") {
        // tiny "Family" label after the name
        const family = renderTextPng({
          text: "Family",
          family: t.fontFamily,
          weight: 300,
          size: 60,
          color: "#9aa0a6",
          italic: true,
        });
        const k = (dispH * 0.5) / family.h;
        doc.addImage(
          family.dataUrl,
          "PNG",
          badgeX + 50 + dispW + 12,
          cardY + 60 + dispH * 0.45,
          family.w * k,
          family.h * k
        );
      }
    } catch {
      // Fallback to native font
      setTextRgb(doc, ink);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(64);
      doc.text(t.fontFamily, badgeX + 50, cardY + 130);
    }

    // Rationale + google fonts link
    setTextRgb(doc, { r: 90, g: 90, b: 110 });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const rationale = doc.splitTextToSize(t.rationale, cardW * 0.5);
    let ry = cardY + cardH - 110;
    rationale.slice(0, 2).forEach((line: string) => {
      doc.text(line, badgeX + 50, ry);
      ry += 14;
    });
    setTextRgb(doc, primaryRgb);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Google Fonts →", badgeX + 50, ry + 14, { charSpace: 1 });

    // Right side: alphabet sample in the actual font
    try {
      const sampleLines = [
        "abcdefghijklmnopqrstuvwxyz",
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "0123456789!@#$%&?",
      ];
      const lineH = 38;
      let sy = cardY + 70;
      for (const line of sampleLines) {
        const png = renderTextPng({
          text: line,
          family: t.fontFamily,
          weight: t.role === "heading" ? 400 : 400,
          size: 26,
          color: "#3a3a44",
        });
        const maxW = cardW * 0.4;
        let w = png.w;
        let h = png.h;
        if (w > maxW) {
          const k = maxW / w;
          w = maxW;
          h = png.h * k;
        }
        doc.addImage(png.dataUrl, "PNG", cardX + cardW * 0.55, sy, w, h);
        sy += lineH;
      }

      // Weight scale row (only for body)
      if (t.role === "body") {
        const weights: Array<{ label: string; w: number }> = [
          { label: "Light", w: 300 },
          { label: "Regular", w: 400 },
          { label: "Medium", w: 500 },
          { label: "Bold", w: 700 },
          { label: "Black", w: 900 },
        ];
        const rowY = cardY + cardH - 70;
        const rowX = cardX + cardW * 0.55;
        const rowW = cardW * 0.4 - 20;
        const stepX = rowW / (weights.length - 1);
        // Connector line
        setFillRgb(doc, { r: 210, g: 210, b: 220 });
        doc.rect(rowX + 6, rowY + 8, rowW - 12, 1, "F");
        weights.forEach((w, wi) => {
          const cx = rowX + wi * stepX;
          const isActive = wi === 1;
          setFillRgb(doc, isActive ? primaryRgb : { r: 210, g: 210, b: 220 });
          doc.circle(cx, rowY + 8, 4, "F");
          setTextRgb(doc, isActive ? { r: 24, g: 24, b: 30 } : { r: 140, g: 140, b: 150 });
          doc.setFont("helvetica", isActive ? "bold" : "normal");
          doc.setFontSize(9);
          doc.text(w.label, cx, rowY + 30, { align: "center" });
        });
      }
    } catch {}
  }
}

function renderToneOfVoice({ doc, project }: Ctx) {
  doc.addPage([PAGE_W, INFO_H], "portrait");
  fillPage(doc, "#f4f4f6", PAGE_W, INFO_H);
  const ink = { r: 24, g: 24, b: 30 };

  pageHeader(doc, ink, "0.0", "TONE OF VOICE");

  const primary = project.identity.palette[0]?.hex ?? "#4F46E5";
  const primaryRgb = hexToRgb(primary);
  const dont = { r: 220, g: 70, b: 90 };

  const cardX = 80;
  const cardW = (PAGE_W - 160 - 32) / 2;
  const cardY = 200;
  const cardH = INFO_H - cardY - 100;

  // ── DO card (light) ────────────────────────────────────
  setFillRgb(doc, { r: 255, g: 255, b: 255 });
  doc.roundedRect(cardX, cardY, cardW, cardH, 28, 28, "F");

  // checkmark badge
  setFillRgb(doc, primaryRgb);
  doc.circle(cardX + 56, cardY + 60, 20, "F");
  drawCheck(doc, cardX + 56, cardY + 60, 11, readableOn(primary));

  setTextRgb(doc, ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("Do", cardX + 92, cardY + 70);

  // bullet list
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  setTextRgb(doc, { r: 60, g: 60, b: 70 });
  let y = cardY + 130;
  project.identity.toneOfVoice.do.forEach((item) => {
    setFillRgb(doc, primaryRgb);
    doc.circle(cardX + 40, y - 4, 3, "F");
    const lines = doc.splitTextToSize(item, cardW - 80);
    lines.forEach((l: string, li: number) => {
      doc.text(l, cardX + 56, y + li * 16);
    });
    y += lines.length * 16 + 14;
  });

  // ── DON'T card (dark) ──────────────────────────────────
  const x2 = cardX + cardW + 32;
  setFillRgb(doc, { r: 14, g: 14, b: 18 });
  doc.roundedRect(x2, cardY, cardW, cardH, 28, 28, "F");

  setFillRgb(doc, dont);
  doc.circle(x2 + 56, cardY + 60, 20, "F");
  drawCross(doc, x2 + 56, cardY + 60, 9, { r: 255, g: 255, b: 255 });

  setTextRgb(doc, { r: 245, g: 245, b: 250 });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("Don't", x2 + 92, cardY + 70);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  setTextRgb(doc, { r: 200, g: 200, b: 210 });
  y = cardY + 130;
  project.identity.toneOfVoice.dont.forEach((item) => {
    setFillRgb(doc, dont);
    doc.circle(x2 + 40, y - 4, 3, "F");
    const lines = doc.splitTextToSize(item, cardW - 80);
    lines.forEach((l: string, li: number) => {
      doc.text(l, x2 + 56, y + li * 16);
    });
    y += lines.length * 16 + 14;
  });
}

// ── MAIN ─────────────────────────────────────────────────────────────────

export async function buildBrandPDF(
  project: BrandProject,
  logoSvg?: string
): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "pt", format: [PAGE_W, INFO_H] });
  const logos = generateLogos(project.brief, project.identity);
  const resolvedLogoSvg =
    logoSvg ?? project.customLogoSvg ?? logos[0]?.svg ?? "";
  const ctx: Ctx = { doc, project, logoSvg: resolvedLogoSvg };

  await renderMockups(ctx, true);
  try { renderColorSystem(ctx); } catch (e) { console.error("[pdf] renderColorSystem failed:", e); }
  try { await renderTypographySection(ctx); } catch (e) { console.error("[pdf] renderTypographySection failed:", e); }
  try { renderToneOfVoice(ctx); } catch (e) { console.error("[pdf] renderToneOfVoice failed:", e); }

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
