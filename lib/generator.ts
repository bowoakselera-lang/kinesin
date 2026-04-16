import type { BrandBrief, BrandIdentity, ColorItem, TypographyItem } from "./types";

// ── SEEDED DETERMINISTIC RANDOMNESS ──────────────────────────────────────

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Seeded pseudo-random 0–1 (Mulberry32)
function seededRng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── COLOR UTILS ──────────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function blendHex(hexA: string, hexB: string, t: number): string {
  const [hA, sA, lA] = hexToHsl(hexA);
  const [hB, sB, lB] = hexToHsl(hexB);
  // Hue needs circular blend
  let dh = hB - hA;
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;
  return hslToHex(hA + dh * t, sA + (sB - sA) * t, lA + (lB - lA) * t);
}

function shiftHue(hex: string, deg: number): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h + deg, s, l);
}

function adjustSaturation(hex: string, factor: number): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s * factor, l);
}

function adjustLightness(hex: string, delta: number): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, Math.max(0, Math.min(1, l + delta)));
}

// ── PALETTES ─────────────────────────────────────────────────────────────

type RawPalette = { name: string; colors: [string, string, string, string, string] };

const PALETTES: Record<string, RawPalette> = {
  profesional: { name: "Corporate Navy",     colors: ["#1E3A8A", "#3B82F6", "#F59E0B", "#1F2937", "#F3F4F6"] },
  ramah:       { name: "Warm Sunshine",       colors: ["#F97316", "#FBBF24", "#EF4444", "#44403C", "#FEF3C7"] },
  modern:      { name: "Modern Monochrome",   colors: ["#111827", "#6366F1", "#10B981", "#374151", "#F9FAFB"] },
  elegan:      { name: "Elegant Noir",        colors: ["#0F172A", "#B45309", "#9CA3AF", "#1E293B", "#F8FAFC"] },
  playful:     { name: "Playful Pop",         colors: ["#EC4899", "#8B5CF6", "#FACC15", "#1F2937", "#FDF4FF"] },
  berani:      { name: "Bold Contrast",       colors: ["#DC2626", "#000000", "#FBBF24", "#18181B", "#FAFAFA"] },
  minimalis:   { name: "Minimal Stone",       colors: ["#57534E", "#A8A29E", "#0EA5E9", "#292524", "#FAFAF9"] },
  hangat:      { name: "Warm Terracotta",     colors: ["#B45309", "#D97706", "#65A30D", "#44403C", "#FEF3C7"] },
  inovatif:    { name: "Tech Forward",        colors: ["#7C3AED", "#06B6D4", "#22C55E", "#0F172A", "#F1F5F9"] },
  tradisional: { name: "Classic Heritage",    colors: ["#7C2D12", "#A16207", "#166534", "#292524", "#FEF3C7"] },
  mewah:       { name: "Luxe Gold",           colors: ["#18181B", "#CA8A04", "#881337", "#27272A", "#FAFAF9"] },
  terpercaya:  { name: "Trust Blue",          colors: ["#0369A1", "#14B8A6", "#F59E0B", "#1F2937", "#F0F9FF"] },
};

// ── INDUSTRY → HUE BIAS ─────────────────────────────────────────────────

const INDUSTRY_HUE_BIAS: Record<string, number> = {
  "food & beverage":       15,   // warm
  "coffee shop":           20,   // warm
  "restoran":              15,
  "fashion & apparel":     -5,   // slight cool
  "beauty & skincare":     -10,
  "kesehatan & wellness":   5,
  "teknologi / saas":     -20,   // cool
  "e-commerce":           -10,
  "pendidikan":            0,
  "konsultan & agensi":   -5,
  "jasa profesional":      0,
  "konstruksi & properti": 10,
  "otomotif":              5,
  "travel & hospitality":  10,
  "event & entertainment": 0,
  "seni & kreatif":        0,
  "pertanian & agribisnis": 20,
  "manufaktur":            5,
  "finansial":            -15,
  "logistik":             -10,
  "non-profit / komunitas": 5,
  "lainnya":               0,
};

// ── AUDIENCE → SATURATION FACTOR ─────────────────────────────────────────

const AUDIENCE_SAT: Record<string, number> = {
  "anak muda / gen z (17-24 tahun)":      1.15,  // lebih vibrant
  "profesional muda (25-35 tahun)":       1.0,
  "keluarga muda (30-45 tahun)":          0.95,
  "eksekutif / c-level":                  0.85,  // lebih muted
  "ibu rumah tangga":                     0.95,
  "pelajar / mahasiswa":                  1.1,
  "umkm / pemilik bisnis":                0.95,
  "komunitas hobi spesifik":              1.05,
  "wisatawan / traveler":                 1.05,
  "segmen premium / high-end":            0.8,   // muted = mewah
  "segmen menengah":                      1.0,
  "segmen mass market":                   1.1,
};

// ── FONT PAIRS ───────────────────────────────────────────────────────────

type FontEntry = {
  family: string;
  url: string;
  tags: string[]; // which traits this font suits
  headRationale: string;
  bodyRationale: string;
};

const HEADING_FONTS: FontEntry[] = [
  { family: "Inter",              url: "https://fonts.google.com/specimen/Inter",              tags: ["profesional", "modern", "minimalis", "terpercaya"],  headRationale: "Sans-serif modern yang bersih dan sangat readable.",           bodyRationale: "Font body netral yang sangat legible." },
  { family: "Poppins",            url: "https://fonts.google.com/specimen/Poppins",            tags: ["ramah", "playful", "modern"],                        headRationale: "Geometric sans-serif yang ramah dan approachable.",            bodyRationale: "Body friendly dengan bentuk geometrik bulat." },
  { family: "Space Grotesk",      url: "https://fonts.google.com/specimen/Space+Grotesk",      tags: ["modern", "inovatif", "berani"],                      headRationale: "Sans-serif modern dengan karakter distinctif.",                bodyRationale: "Body font kontemporer yang unik." },
  { family: "Playfair Display",   url: "https://fonts.google.com/specimen/Playfair+Display",   tags: ["elegan", "mewah", "tradisional"],                    headRationale: "Serif dengan kontras tinggi yang elegan dan sophisticated.",   bodyRationale: "Serif premium untuk teks editorial." },
  { family: "Fredoka",            url: "https://fonts.google.com/specimen/Fredoka",            tags: ["playful", "ramah"],                                  headRationale: "Bentuk rounded yang playful dan memorable.",                   bodyRationale: "Body ceria dengan karakter bulat." },
  { family: "Archivo Black",      url: "https://fonts.google.com/specimen/Archivo+Black",      tags: ["berani"],                                            headRationale: "Bold dan impactful — langsung mencuri perhatian.",             bodyRationale: "Font tebal untuk statement kuat." },
  { family: "DM Sans",            url: "https://fonts.google.com/specimen/DM+Sans",            tags: ["minimalis", "profesional", "modern"],                headRationale: "Sans-serif bersih yang minimal tanpa ornamen.",                bodyRationale: "Body clean dan efisien." },
  { family: "Merriweather",       url: "https://fonts.google.com/specimen/Merriweather",       tags: ["hangat", "tradisional", "terpercaya"],               headRationale: "Serif yang hangat dan membumi, cocok untuk narasi.",           bodyRationale: "Serif nyaman untuk membaca panjang." },
  { family: "Sora",               url: "https://fonts.google.com/specimen/Sora",               tags: ["inovatif", "modern", "berani"],                      headRationale: "Sans-serif futuristik dengan karakter geometrik fresh.",       bodyRationale: "Body font futuristik yang bersih." },
  { family: "Cormorant Garamond", url: "https://fonts.google.com/specimen/Cormorant+Garamond", tags: ["tradisional", "elegan", "mewah"],                    headRationale: "Serif klasik bergaya literary dan timeless.",                  bodyRationale: "Serif klasik untuk teks premium." },
  { family: "IBM Plex Sans",      url: "https://fonts.google.com/specimen/IBM+Plex+Sans",      tags: ["terpercaya", "profesional"],                         headRationale: "Sans-serif institusional yang menegaskan kredibilitas.",       bodyRationale: "Body font yang solid dan trustworthy." },
  { family: "Outfit",             url: "https://fonts.google.com/specimen/Outfit",             tags: ["modern", "ramah", "inovatif"],                       headRationale: "Geometric sans-serif yang clean dan kontemporer.",             bodyRationale: "Body geometric yang ramah dibaca." },
  { family: "Crimson Pro",        url: "https://fonts.google.com/specimen/Crimson+Pro",        tags: ["elegan", "hangat", "tradisional"],                   headRationale: "Serif elegan dengan presisi modern.",                          bodyRationale: "Serif nyaman untuk konten editorial." },
  { family: "Unbounded",          url: "https://fonts.google.com/specimen/Unbounded",          tags: ["berani", "playful", "inovatif"],                     headRationale: "Sans-serif ultra-bold yang tidak biasa dan berani.",           bodyRationale: "Body tebal untuk brand yang mencolok." },
];

const BODY_FONTS: FontEntry[] = [
  { family: "Source Sans 3", url: "https://fonts.google.com/specimen/Source+Sans+3", tags: ["profesional", "terpercaya"],           headRationale: "", bodyRationale: "Font body netral dan nyaman untuk paragraf panjang." },
  { family: "Nunito",        url: "https://fonts.google.com/specimen/Nunito",        tags: ["ramah", "playful", "hangat"],          headRationale: "", bodyRationale: "Bentuk bulat yang hangat dan friendly." },
  { family: "Inter",         url: "https://fonts.google.com/specimen/Inter",         tags: ["modern", "minimalis", "inovatif"],     headRationale: "", bodyRationale: "Body font modern yang sangat legible di layar." },
  { family: "Lora",          url: "https://fonts.google.com/specimen/Lora",          tags: ["elegan", "hangat", "tradisional"],     headRationale: "", bodyRationale: "Serif hangat yang nyaman untuk teks panjang." },
  { family: "Archivo",       url: "https://fonts.google.com/specimen/Archivo",       tags: ["berani", "modern"],                   headRationale: "", bodyRationale: "Sans-serif netral yang menyeimbangkan heading tebal." },
  { family: "DM Sans",       url: "https://fonts.google.com/specimen/DM+Sans",       tags: ["minimalis", "profesional"],            headRationale: "", bodyRationale: "Konsisten untuk tampilan yang sangat clean." },
  { family: "Open Sans",     url: "https://fonts.google.com/specimen/Open+Sans",     tags: ["hangat", "ramah", "terpercaya"],       headRationale: "", bodyRationale: "Sans-serif netral yang ramah dibaca." },
  { family: "EB Garamond",   url: "https://fonts.google.com/specimen/EB+Garamond",   tags: ["tradisional", "mewah", "elegan"],      headRationale: "", bodyRationale: "Serif tradisional untuk teks nyaman dan premium." },
  { family: "Libre Baskerville", url: "https://fonts.google.com/specimen/Libre+Baskerville", tags: ["mewah", "elegan"],             headRationale: "", bodyRationale: "Serif klasik premium untuk teks pendukung." },
  { family: "IBM Plex Sans", url: "https://fonts.google.com/specimen/IBM+Plex+Sans", tags: ["terpercaya", "profesional", "inovatif"], headRationale: "", bodyRationale: "Body konsisten untuk komunikasi solid." },
  { family: "Work Sans",     url: "https://fonts.google.com/specimen/Work+Sans",     tags: ["modern", "minimalis", "profesional"],  headRationale: "", bodyRationale: "Sans-serif geometric yang versatile dan bersih." },
];

// Score a font against traits
function scoreFont(font: FontEntry, traits: string[]): number {
  let score = 0;
  const lowerTraits = traits.map((t) => t.toLowerCase());
  for (const tag of font.tags) {
    const idx = lowerTraits.indexOf(tag);
    if (idx >= 0) score += 3 - idx; // higher weight for earlier traits
  }
  return score;
}

// ── TONE OF VOICE MAP ────────────────────────────────────────────────────

const TONE_MAP: Record<string, { do: string[]; dont: string[] }> = {
  profesional: {
    do: ["Gunakan bahasa formal namun jelas", "Fokus pada data dan hasil konkret", "Tunjukkan kompetensi"],
    dont: ["Hindari slang berlebihan", "Jangan terdengar kaku dan robotik", "Hindari janji yang tidak bisa dipenuhi"],
  },
  ramah: {
    do: ["Sapa audiens seperti teman", "Gunakan kalimat hangat dan personal", "Tunjukkan empati"],
    dont: ["Hindari nada dingin atau korporat", "Jangan gunakan jargon teknis tanpa penjelasan", "Hindari bahasa menggurui"],
  },
  modern: {
    do: ["Gunakan kalimat singkat dan to-the-point", "Pilih kata kontemporer", "Berani tampil beda"],
    dont: ["Hindari frasa klise", "Jangan terdengar kuno", "Hindari pengulangan berlebihan"],
  },
  elegan: {
    do: ["Gunakan bahasa yang tersusun rapi", "Pilih diksi yang refined", "Fokus pada kualitas"],
    dont: ["Hindari bahasa vulgar atau kasar", "Jangan terlalu casual", "Hindari promosi agresif"],
  },
  playful: {
    do: ["Gunakan humor ringan", "Main-main dengan kata", "Gunakan emoji secukupnya"],
    dont: ["Jangan terdengar terlalu serius", "Hindari jargon berat", "Jangan kaku"],
  },
  berani: {
    do: ["Ambil posisi yang jelas", "Gunakan kalimat yang tegas", "Tantang status quo"],
    dont: ["Hindari keraguan dan hedging", "Jangan terlalu safe", "Hindari bahasa pasif"],
  },
  minimalis: {
    do: ["Tulis seringkas mungkin", "Hapus kata yang tidak perlu", "Satu pesan per kalimat"],
    dont: ["Hindari deskripsi panjang", "Jangan berlebihan di adjektif", "Hindari pengulangan"],
  },
  hangat: {
    do: ["Gunakan analogi yang dekat", "Bagikan cerita personal", "Tunjukkan sisi manusiawi"],
    dont: ["Hindari nada formal kaku", "Jangan terlalu korporat", "Hindari bahasa transaksional"],
  },
  inovatif: {
    do: ["Kedepankan visi ke depan", "Gunakan kata yang fresh", "Jelaskan ide baru dengan confident"],
    dont: ["Hindari bahasa konservatif", "Jangan terjebak pada cara lama", "Hindari buzzword kosong"],
  },
  tradisional: {
    do: ["Hormati warisan dan nilai", "Gunakan bahasa yang matang", "Fokus pada keaslian"],
    dont: ["Hindari tren sesaat", "Jangan gunakan slang baru", "Hindari terkesan generik"],
  },
  mewah: {
    do: ["Pilih kata yang exclusive", "Tekankan craftsmanship", "Ceritakan detail yang istimewa"],
    dont: ["Jangan obral diskon terlalu mencolok", "Hindari bahasa massal", "Hindari urgency murahan"],
  },
  terpercaya: {
    do: ["Sertakan bukti dan angka", "Gunakan bahasa yang konsisten", "Transparan tentang proses"],
    dont: ["Hindari klaim tanpa bukti", "Jangan janji berlebihan", "Hindari bahasa ambigu"],
  },
};

// ── TAGLINE TEMPLATES ────────────────────────────────────────────────────

const TAGLINE_TEMPLATES: Record<string, string[]> = {
  playful:     ["{name} — bikin hari lebih seru.", "{name} — karena hidup butuh warna.", "{name} — bermain serius."],
  elegan:      ["{name} — sentuhan istimewa.", "{name} — di mana detail bicara.", "{name} — keanggunan sejati."],
  mewah:       ["{name} — luxury redefined.", "{name} — pengalaman tanpa kompromi.", "{name} — eksklusif, autentik."],
  berani:      ["{name} — berani jadi berbeda.", "{name} — tanpa batas, tanpa ragu.", "{name} — lead, don't follow."],
  hangat:      ["{name} — dekat dan tulus.", "{name} — hangat di setiap momen.", "{name} — seperti rumah."],
  ramah:       ["{name} — teman di setiap langkah.", "{name} — selalu menyambut.", "{name} — untuk semua orang."],
  inovatif:    ["{name} — melangkah lebih dulu.", "{name} — masa depan dimulai di sini.", "{name} — think forward."],
  modern:      ["{name} — simply forward.", "{name} — desain untuk zaman.", "{name} — next-gen experience."],
  minimalis:   ["{name} — esensial, tanpa basa-basi.", "{name} — less is more.", "{name} — pure simplicity."],
  tradisional: ["{name} — warisan yang tetap relevan.", "{name} — dibangun dari akar.", "{name} — timeless value."],
  terpercaya:  ["{name} — pilihan yang bisa diandalkan.", "{name} — konsisten sejak hari pertama.", "{name} — your trusted partner."],
  profesional: ["{name} — standar tertinggi.", "{name} — presisi dan kualitas.", "{name} — the expert's choice."],
};

// ── MAIN GENERATOR ───────────────────────────────────────────────────────

export function generateBrandIdentity(brief: BrandBrief): BrandIdentity {
  const seed = hashStr(brief.brandName + brief.industry + brief.targetAudience);
  const rng = seededRng(seed);
  const lowerTraits = brief.personality.map((t) => t.toLowerCase());

  // ── 1. BLEND PALETTE from top 3 traits ───────────────────────────────
  const matchedKeys = lowerTraits
    .filter((t) => PALETTES[t])
    .slice(0, 3);
  if (matchedKeys.length === 0) matchedKeys.push("profesional");

  const weights = matchedKeys.length === 1
    ? [1]
    : matchedKeys.length === 2
      ? [0.6, 0.4]
      : [0.5, 0.3, 0.2];

  const blendedHexes: string[] = [];
  for (let slot = 0; slot < 5; slot++) {
    let hex = PALETTES[matchedKeys[0]].colors[slot];
    for (let i = 1; i < matchedKeys.length; i++) {
      const ratio = weights.slice(0, i + 1).reduce((a, b) => a + b, 0);
      hex = blendHex(hex, PALETTES[matchedKeys[i]].colors[slot], weights[i] / ratio);
    }
    blendedHexes.push(hex);
  }

  // ── 2. APPLY INDUSTRY HUE SHIFT ──────────────────────────────────────
  const industryKey = brief.industry.toLowerCase();
  const hueBias = INDUSTRY_HUE_BIAS[industryKey] ?? 0;

  // ── 3. APPLY AUDIENCE SATURATION ──────────────────────────────────────
  const audienceKey = brief.targetAudience.toLowerCase();
  const satFactor = AUDIENCE_SAT[audienceKey] ?? 1.0;

  // ── 4. APPLY SEEDED HUE VARIATION (±12°) ─────────────────────────────
  const seedHueShift = (rng() - 0.5) * 24; // -12 to +12

  const COLOR_ROLES = [
    { name: "Primary",       role: `Warna utama ${brief.brandName} — logo, header, CTA` },
    { name: "Secondary",     role: "Aksen sekunder untuk elemen pendukung" },
    { name: "Accent",        role: "Aksen kontras untuk highlight dan interaksi" },
    { name: "Neutral Dark",  role: "Teks utama dan elemen gelap" },
    { name: "Neutral Light", role: "Background dan ruang kosong" },
  ];

  const palette: ColorItem[] = blendedHexes.map((hex, i) => {
    let adjusted = hex;
    // Only shift hue for primary, secondary, accent (not neutrals)
    if (i < 3) {
      adjusted = shiftHue(adjusted, hueBias + seedHueShift);
      adjusted = adjustSaturation(adjusted, satFactor);
    }
    // Slight lightness jitter for uniqueness
    if (i < 3) {
      adjusted = adjustLightness(adjusted, (rng() - 0.5) * 0.06);
    }
    return { name: COLOR_ROLES[i].name, hex: adjusted, role: COLOR_ROLES[i].role };
  });

  // Build palette name
  const paletteName = matchedKeys.length > 1
    ? `${PALETTES[matchedKeys[0]].name} × ${PALETTES[matchedKeys[1]].name}`
    : PALETTES[matchedKeys[0]].name;

  // ── 5. PICK FONTS via scoring ─────────────────────────────────────────
  const headingCandidates = [...HEADING_FONTS]
    .map((f) => ({ font: f, score: scoreFont(f, lowerTraits) }))
    .sort((a, b) => b.score - a.score);

  // Top N candidates, pick one based on seed
  const topHeadings = headingCandidates.filter((c) => c.score > 0).slice(0, 4);
  if (topHeadings.length === 0) topHeadings.push(headingCandidates[0]);
  const pickedHeading = topHeadings[Math.floor(rng() * topHeadings.length)].font;

  // Body font: exclude heading, score, pick
  const bodyCandidates = BODY_FONTS
    .filter((f) => f.family !== pickedHeading.family)
    .map((f) => ({ font: f, score: scoreFont(f, lowerTraits) }))
    .sort((a, b) => b.score - a.score);
  const topBodies = bodyCandidates.filter((c) => c.score > 0).slice(0, 3);
  if (topBodies.length === 0) topBodies.push(bodyCandidates[0]);
  const pickedBody = topBodies[Math.floor(rng() * topBodies.length)].font;

  const typography: TypographyItem[] = [
    {
      role: "heading",
      fontFamily: pickedHeading.family,
      googleFontUrl: pickedHeading.url,
      rationale: pickedHeading.headRationale,
    },
    {
      role: "body",
      fontFamily: pickedBody.family,
      googleFontUrl: pickedBody.url,
      rationale: pickedBody.bodyRationale,
    },
  ];

  // ── 6. TONE OF VOICE (merged from all traits) ─────────────────────────
  const dos = new Set<string>();
  const donts = new Set<string>();
  for (const t of lowerTraits) {
    const map = TONE_MAP[t];
    if (!map) continue;
    map.do.forEach((x) => dos.add(x));
    map.dont.forEach((x) => donts.add(x));
  }
  if (dos.size === 0) {
    TONE_MAP.profesional.do.forEach((x) => dos.add(x));
    TONE_MAP.profesional.dont.forEach((x) => donts.add(x));
  }

  // ── 7. TAGLINE (seeded pick from templates) ───────────────────────────
  const tagTrait = lowerTraits.find((t) => TAGLINE_TEMPLATES[t]) ?? "profesional";
  const templates = TAGLINE_TEMPLATES[tagTrait];
  const tagline = templates[Math.floor(rng() * templates.length)].replace("{name}", brief.brandName.trim());

  // ── 8. ESSENCE ─────────────────────────────────────────────────────────
  const traitStr = brief.personality.slice(0, 3).join(", ").toLowerCase();
  const essence = `${brief.brandName} adalah brand ${brief.industry.toLowerCase()} yang ${traitStr}. Kami hadir untuk ${brief.targetAudience.toLowerCase()}, dengan komitmen ${brief.mission.toLowerCase().split(".")[0]}.`;

  // ── 9. RATIONALE ───────────────────────────────────────────────────────
  const rationale = `Palet "${paletteName}" dihasilkan dari blending kepribadian ${brief.personality.join(", ").toLowerCase()}, disesuaikan dengan industri ${brief.industry} dan target ${brief.targetAudience.toLowerCase()}. Hue dan saturasi di-tuning agar cocok secara psikologis untuk audiens ini.`;

  return {
    tagline,
    essence,
    palette,
    typography,
    toneOfVoice: { do: Array.from(dos).slice(0, 5), dont: Array.from(donts).slice(0, 5) },
    rationale,
  };
}
