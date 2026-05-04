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

// ── FONT PAIRINGS ────────────────────────────────────────────────────────
// Curated pairings inspired by fontjoy.com + popular Google Fonts combos.
// Each pairing is a heading + body that has been visually tested together.

type FontPairing = {
  heading: string;
  body: string;
  tags: string[];
  headingRationale: string;
  bodyRationale: string;
};

const gFontUrl = (family: string) =>
  `https://fonts.google.com/specimen/${family.replace(/ /g, "+")}`;

const FONT_PAIRINGS: FontPairing[] = [
  // ── ELEGANT / EDITORIAL / LUXURY ──────────────────────────────────
  {
    heading: "Playfair Display", body: "DM Sans",
    tags: ["elegan", "mewah", "modern"],
    headingRationale: "Serif kontras tinggi yang sophisticated dan editorial.",
    bodyRationale: "Sans-serif clean yang menyeimbangkan heading dramatis.",
  },
  {
    heading: "Cormorant Garamond", body: "Source Sans 3",
    tags: ["elegan", "mewah", "tradisional"],
    headingRationale: "Serif klasik bergaya literary, timeless dan premium.",
    bodyRationale: "Sans netral yang nyaman untuk paragraf panjang.",
  },
  {
    heading: "Libre Baskerville", body: "Inter",
    tags: ["mewah", "elegan", "tradisional"],
    headingRationale: "Serif premium dengan presisi klasik.",
    bodyRationale: "Sans modern untuk readability di layar.",
  },
  {
    heading: "EB Garamond", body: "Lato",
    tags: ["tradisional", "mewah", "elegan"],
    headingRationale: "Serif Garamond klasik untuk kesan literary.",
    bodyRationale: "Sans humanis yang seimbang dan elegan.",
  },
  {
    heading: "Crimson Pro", body: "Inter",
    tags: ["elegan", "hangat", "tradisional"],
    headingRationale: "Serif elegan dengan presisi modern.",
    bodyRationale: "Sans modern untuk konten kontemporer.",
  },
  {
    heading: "Lora", body: "Inter",
    tags: ["elegan", "hangat", "modern"],
    headingRationale: "Serif kontemporer dengan kalligrafis subtle.",
    bodyRationale: "Sans modern untuk kontras yang seimbang.",
  },

  // ── MODERN / TECH / MINIMALIS ────────────────────────────────────
  {
    heading: "Space Grotesk", body: "IBM Plex Sans",
    tags: ["modern", "inovatif", "profesional"],
    headingRationale: "Sans-serif modern dengan karakter distinctif.",
    bodyRationale: "Sans institusional yang trustworthy dan precise.",
  },
  {
    heading: "Inter", body: "Inter",
    tags: ["minimalis", "profesional", "modern"],
    headingRationale: "Sans-serif modern, super readable di semua ukuran.",
    bodyRationale: "Konsisten heading-body untuk minimal aesthetic.",
  },
  {
    heading: "Outfit", body: "Inter",
    tags: ["modern", "minimalis", "ramah"],
    headingRationale: "Geometric sans yang clean dan kontemporer.",
    bodyRationale: "Sans modern yang sangat legible.",
  },
  {
    heading: "Sora", body: "Inter",
    tags: ["inovatif", "modern", "profesional"],
    headingRationale: "Sans-serif futuristik dengan karakter geometric fresh.",
    bodyRationale: "Sans clean untuk membaca panjang.",
  },
  {
    heading: "DM Sans", body: "DM Sans",
    tags: ["minimalis", "profesional", "modern"],
    headingRationale: "Sans-serif bersih tanpa ornamen.",
    bodyRationale: "Konsisten dan efisien untuk tampilan clean.",
  },
  {
    heading: "Manrope", body: "Manrope",
    tags: ["modern", "profesional", "minimalis"],
    headingRationale: "Sans-serif modern yang well-balanced.",
    bodyRationale: "Body yang seragam dan harmonis dengan heading.",
  },
  {
    heading: "IBM Plex Sans", body: "IBM Plex Mono",
    tags: ["terpercaya", "profesional", "inovatif"],
    headingRationale: "Sans institusional yang menegaskan kredibilitas.",
    bodyRationale: "Mono untuk aksen teknis dan precise.",
  },

  // ── BOLD / IMPACT ────────────────────────────────────────────────
  {
    heading: "Archivo Black", body: "Archivo",
    tags: ["berani", "modern"],
    headingRationale: "Bold dan impactful — langsung mencuri perhatian.",
    bodyRationale: "Sans-serif netral yang menyeimbangkan heading tebal.",
  },
  {
    heading: "Unbounded", body: "Work Sans",
    tags: ["berani", "playful", "inovatif"],
    headingRationale: "Sans ultra-bold yang tidak biasa dan berani.",
    bodyRationale: "Sans geometric yang versatile.",
  },
  {
    heading: "Bebas Neue", body: "Source Sans 3",
    tags: ["berani", "modern"],
    headingRationale: "Display compact untuk headline yang strong.",
    bodyRationale: "Sans netral untuk teks pendukung.",
  },
  {
    heading: "Anton", body: "Inter",
    tags: ["berani", "modern"],
    headingRationale: "Display extra-condensed yang dramatis.",
    bodyRationale: "Sans modern yang legible untuk body.",
  },
  {
    heading: "Bricolage Grotesque", body: "Inter",
    tags: ["modern", "berani", "playful"],
    headingRationale: "Display grotesque yang playful dan modern.",
    bodyRationale: "Sans clean untuk seimbangkan karakter heading.",
  },

  // ── FRIENDLY / PLAYFUL ───────────────────────────────────────────
  {
    heading: "Poppins", body: "Open Sans",
    tags: ["ramah", "playful", "modern"],
    headingRationale: "Geometric sans yang ramah dan approachable.",
    bodyRationale: "Sans humanis yang ramah dibaca.",
  },
  {
    heading: "Fredoka", body: "Nunito",
    tags: ["playful", "ramah", "hangat"],
    headingRationale: "Bentuk rounded yang playful dan memorable.",
    bodyRationale: "Sans bulat yang hangat dan friendly.",
  },
  {
    heading: "Quicksand", body: "Open Sans",
    tags: ["ramah", "modern", "minimalis"],
    headingRationale: "Sans-serif rounded yang fresh dan light.",
    bodyRationale: "Sans humanis yang neutral dan readable.",
  },
  {
    heading: "Rubik", body: "Rubik",
    tags: ["ramah", "modern", "playful"],
    headingRationale: "Sans-serif slightly rounded yang friendly.",
    bodyRationale: "Konsisten untuk tone yang playful tapi clean.",
  },
  {
    heading: "Nunito", body: "Open Sans",
    tags: ["ramah", "hangat", "playful"],
    headingRationale: "Sans bulat yang sangat ramah dan approachable.",
    bodyRationale: "Sans humanis yang netral dan hangat.",
  },

  // ── WARM / EDITORIAL / TRUSTWORTHY ───────────────────────────────
  {
    heading: "Merriweather", body: "Open Sans",
    tags: ["hangat", "tradisional", "terpercaya"],
    headingRationale: "Serif hangat yang membumi, cocok untuk narasi.",
    bodyRationale: "Sans humanis yang nyaman untuk teks panjang.",
  },
  {
    heading: "Bitter", body: "Source Sans 3",
    tags: ["hangat", "terpercaya", "tradisional"],
    headingRationale: "Slab serif yang strong dan grounded.",
    bodyRationale: "Sans neutral yang menyeimbangkan slab serif.",
  },

  // ── DISTINCTIVE / CREATIVE ───────────────────────────────────────
  {
    heading: "Syne", body: "Inter",
    tags: ["inovatif", "berani", "modern"],
    headingRationale: "Display geometric experimental untuk brand creative.",
    bodyRationale: "Sans clean untuk kontras yang functional.",
  },
  {
    heading: "Bricolage Grotesque", body: "DM Sans",
    tags: ["modern", "playful", "inovatif"],
    headingRationale: "Display grotesque dengan karakter unik.",
    bodyRationale: "Sans clean yang seimbangkan ekspresif heading.",
  },
  {
    heading: "Karla", body: "Karla",
    tags: ["modern", "ramah", "minimalis"],
    headingRationale: "Sans grotesque yang friendly dan distinctive.",
    bodyRationale: "Konsisten untuk feel modern dan cohesive.",
  },
  {
    heading: "Big Shoulders Display", body: "Inter",
    tags: ["berani", "inovatif", "modern"],
    headingRationale: "Condensed display untuk statement editorial yang kuat.",
    bodyRationale: "Sans modern untuk kontras yang seimbang.",
  },

  // ── INSTITUTIONAL / VERSATILE ────────────────────────────────────
  {
    heading: "Roboto", body: "Roboto",
    tags: ["profesional", "modern", "terpercaya"],
    headingRationale: "Sans-serif neutral yang versatile untuk semua context.",
    bodyRationale: "Konsisten heading-body untuk tampilan profesional.",
  },
  {
    heading: "Work Sans", body: "Work Sans",
    tags: ["modern", "minimalis", "profesional"],
    headingRationale: "Sans geometric yang versatile dan bersih.",
    bodyRationale: "Konsisten untuk tampilan minimal dan modern.",
  },
];

// Score a pairing against brand traits — higher score for earlier-listed traits
function scorePairing(pair: FontPairing, traits: string[]): number {
  let score = 0;
  for (const tag of pair.tags) {
    const idx = traits.indexOf(tag);
    if (idx >= 0) score += 3 - Math.min(idx, 2); // 3 for first trait, 2, 1, 1, ...
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

  // ── 5. PICK FONT PAIRING via scoring (curated fontjoy-inspired pairs) ─
  const pairCandidates = FONT_PAIRINGS
    .map((p) => ({ pair: p, score: scorePairing(p, lowerTraits) }))
    .sort((a, b) => b.score - a.score);

  // Top N pairings, pick one based on seed for variety
  const topPairs = pairCandidates.filter((c) => c.score > 0).slice(0, 5);
  if (topPairs.length === 0) topPairs.push(pairCandidates[0]);
  const pickedPair = topPairs[Math.floor(rng() * topPairs.length)].pair;

  const typography: TypographyItem[] = [
    {
      role: "heading",
      fontFamily: pickedPair.heading,
      googleFontUrl: gFontUrl(pickedPair.heading),
      rationale: pickedPair.headingRationale,
    },
    {
      role: "body",
      fontFamily: pickedPair.body,
      googleFontUrl: gFontUrl(pickedPair.body),
      rationale: pickedPair.bodyRationale,
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
