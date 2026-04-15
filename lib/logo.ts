import type { BrandBrief, BrandIdentity } from "./types";

export type LogoVariant = {
  id: string;
  name: string;
  style: "monogram-circle" | "monogram-square" | "icon-wordmark" | "wordmark-dot" | "stacked" | "badge";
  svg: string;
};

function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) {
    const w = words[0];
    return (w.length >= 2 ? w.slice(0, 2) : w).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pickShape(traits: string[]): "circle" | "square" | "hex" | "triangle" | "leaf" | "spark" {
  const t = traits.map((x) => x.toLowerCase());
  if (t.includes("berani")) return "triangle";
  if (t.includes("modern") || t.includes("inovatif")) return "hex";
  if (t.includes("hangat") || t.includes("ramah")) return "leaf";
  if (t.includes("playful")) return "spark";
  if (t.includes("profesional") || t.includes("terpercaya") || t.includes("mewah")) return "square";
  return "circle";
}

function iconPath(shape: ReturnType<typeof pickShape>, color: string, cx = 60, cy = 60, size = 48): string {
  const r = size / 2;
  switch (shape) {
    case "circle":
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;
    case "square":
      return `<rect x="${cx - r}" y="${cy - r}" width="${size}" height="${size}" rx="10" fill="${color}"/>`;
    case "hex": {
      const pts: string[] = [];
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 2;
        pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
      }
      return `<polygon points="${pts.join(" ")}" fill="${color}"/>`;
    }
    case "triangle": {
      const p1 = `${cx},${cy - r}`;
      const p2 = `${cx - r},${cy + r * 0.85}`;
      const p3 = `${cx + r},${cy + r * 0.85}`;
      return `<polygon points="${p1} ${p2} ${p3}" fill="${color}"/>`;
    }
    case "leaf": {
      return `<path d="M ${cx} ${cy - r} C ${cx + r} ${cy - r}, ${cx + r} ${cy + r}, ${cx} ${cy + r} C ${cx - r} ${cy + r}, ${cx - r} ${cy - r}, ${cx} ${cy - r} Z" fill="${color}"/>`;
    }
    case "spark": {
      const arms = 4;
      const pts: string[] = [];
      for (let i = 0; i < arms * 2; i++) {
        const a = (Math.PI / arms) * i - Math.PI / 2;
        const rr = i % 2 === 0 ? r : r * 0.4;
        pts.push(`${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`);
      }
      return `<polygon points="${pts.join(" ")}" fill="${color}"/>`;
    }
  }
}

// Each variant returns an SVG string at 400x200 (or 200x200 for square-ish).
function monogramCircle(name: string, primary: string, light: string, fontFamily: string): string {
  const init = escapeXml(initials(name));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <rect width="200" height="200" fill="${light}"/>
    <circle cx="100" cy="100" r="72" fill="${primary}"/>
    <text x="100" y="100" text-anchor="middle" dominant-baseline="central" font-family="${fontFamily}, sans-serif" font-size="64" font-weight="700" fill="#ffffff">${init}</text>
  </svg>`;
}

function monogramSquare(name: string, primary: string, accent: string, light: string, fontFamily: string): string {
  const init = escapeXml(initials(name));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <rect width="200" height="200" fill="${light}"/>
    <rect x="30" y="30" width="140" height="140" rx="24" fill="${primary}"/>
    <rect x="30" y="30" width="24" height="140" fill="${accent}"/>
    <text x="112" y="100" text-anchor="middle" dominant-baseline="central" font-family="${fontFamily}, sans-serif" font-size="68" font-weight="700" fill="#ffffff">${init}</text>
  </svg>`;
}

function iconWordmark(name: string, traits: string[], primary: string, dark: string, light: string, fontFamily: string): string {
  const shape = pickShape(traits);
  const icon = iconPath(shape, primary, 50, 60, 56);
  const safeName = escapeXml(name);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 120" width="500" height="120">
    <rect width="500" height="120" fill="${light}"/>
    ${icon}
    <text x="100" y="60" dominant-baseline="central" font-family="${fontFamily}, sans-serif" font-size="44" font-weight="700" fill="${dark}">${safeName}</text>
  </svg>`;
}

function wordmarkDot(name: string, primary: string, dark: string, light: string, fontFamily: string): string {
  const safeName = escapeXml(name);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 120" width="500" height="120">
    <rect width="500" height="120" fill="${light}"/>
    <text x="30" y="60" dominant-baseline="central" font-family="${fontFamily}, sans-serif" font-size="48" font-weight="700" fill="${dark}">${safeName}</text>
    <circle cx="${40 + safeName.length * 14}" cy="60" r="10" fill="${primary}"/>
  </svg>`;
}

function stacked(name: string, traits: string[], primary: string, dark: string, light: string, fontFamily: string): string {
  const shape = pickShape(traits);
  const icon = iconPath(shape, primary, 100, 70, 80);
  const safeName = escapeXml(name);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <rect width="200" height="200" fill="${light}"/>
    ${icon}
    <text x="100" y="155" text-anchor="middle" font-family="${fontFamily}, sans-serif" font-size="22" font-weight="700" fill="${dark}" letter-spacing="1">${safeName.toUpperCase()}</text>
  </svg>`;
}

function badge(name: string, primary: string, light: string, fontFamily: string): string {
  const safeName = escapeXml(name);
  const year = new Date().getFullYear();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <rect width="200" height="200" fill="${light}"/>
    <circle cx="100" cy="100" r="78" fill="none" stroke="${primary}" stroke-width="4"/>
    <circle cx="100" cy="100" r="66" fill="none" stroke="${primary}" stroke-width="1"/>
    <text x="100" y="90" text-anchor="middle" font-family="${fontFamily}, sans-serif" font-size="22" font-weight="700" fill="${primary}" letter-spacing="1">${safeName.toUpperCase()}</text>
    <line x1="55" y1="110" x2="145" y2="110" stroke="${primary}" stroke-width="1.5"/>
    <text x="100" y="130" text-anchor="middle" font-family="${fontFamily}, sans-serif" font-size="12" font-weight="500" fill="${primary}" letter-spacing="3">EST · ${year}</text>
  </svg>`;
}

export function generateLogos(brief: BrandBrief, identity: BrandIdentity): LogoVariant[] {
  const primary = identity.palette[0]?.hex ?? "#1E3A8A";
  const accent = identity.palette[2]?.hex ?? primary;
  const dark = identity.palette[3]?.hex ?? "#1F2937";
  const light = identity.palette[4]?.hex ?? "#F3F4F6";
  const fontFamily = identity.typography[0]?.fontFamily ?? "Inter";
  const name = brief.brandName;

  return [
    {
      id: "monogram-circle",
      name: "Monogram Lingkaran",
      style: "monogram-circle",
      svg: monogramCircle(name, primary, light, fontFamily),
    },
    {
      id: "monogram-square",
      name: "Monogram Kotak",
      style: "monogram-square",
      svg: monogramSquare(name, primary, accent, light, fontFamily),
    },
    {
      id: "icon-wordmark",
      name: "Ikon + Wordmark",
      style: "icon-wordmark",
      svg: iconWordmark(name, brief.personality, primary, dark, light, fontFamily),
    },
    {
      id: "wordmark-dot",
      name: "Wordmark Minimal",
      style: "wordmark-dot",
      svg: wordmarkDot(name, primary, dark, light, fontFamily),
    },
    {
      id: "stacked",
      name: "Stacked",
      style: "stacked",
      svg: stacked(name, brief.personality, primary, dark, light, fontFamily),
    },
    {
      id: "badge",
      name: "Badge Klasik",
      style: "badge",
      svg: badge(name, primary, light, fontFamily),
    },
  ];
}

export function svgToDataUrl(svg: string): string {
  const encoded = encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22");
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

export async function svgToPngDataUrl(svg: string, width = 800, height = 400): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas 2D not available"));
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = svgToDataUrl(svg);
  });
}

export function downloadSvg(svg: string, filename: string) {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadPng(svg: string, filename: string, size = 1024) {
  const dataUrl = await svgToPngDataUrl(svg, size, size);
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
