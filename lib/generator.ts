import type { BrandBrief, BrandIdentity, ColorItem, TypographyItem } from "./types";

type Palette = { name: string; colors: ColorItem[] };
type FontPair = {
  heading: { family: string; url: string; rationale: string };
  body: { family: string; url: string; rationale: string };
};

const PALETTES: Record<string, Palette> = {
  profesional: {
    name: "Corporate Navy",
    colors: [
      { name: "Primary", hex: "#1E3A8A", role: "Warna utama untuk logo, header, dan CTA penting" },
      { name: "Secondary", hex: "#3B82F6", role: "Aksen sekunder untuk link dan elemen interaktif" },
      { name: "Accent", hex: "#F59E0B", role: "Aksen kontras untuk highlight dan notifikasi" },
      { name: "Neutral Dark", hex: "#1F2937", role: "Teks utama dan elemen gelap" },
      { name: "Neutral Light", hex: "#F3F4F6", role: "Background dan ruang kosong" },
    ],
  },
  ramah: {
    name: "Warm Sunshine",
    colors: [
      { name: "Primary", hex: "#F97316", role: "Warna utama untuk logo dan elemen hangat" },
      { name: "Secondary", hex: "#FBBF24", role: "Aksen kuning untuk suasana ceria" },
      { name: "Accent", hex: "#EF4444", role: "Aksen untuk CTA dan penegasan" },
      { name: "Neutral Dark", hex: "#44403C", role: "Teks utama" },
      { name: "Neutral Light", hex: "#FEF3C7", role: "Background lembut" },
    ],
  },
  modern: {
    name: "Modern Monochrome",
    colors: [
      { name: "Primary", hex: "#111827", role: "Warna utama minimalis yang kuat" },
      { name: "Secondary", hex: "#6366F1", role: "Aksen modern untuk elemen digital" },
      { name: "Accent", hex: "#10B981", role: "Aksen untuk status dan sukses" },
      { name: "Neutral Dark", hex: "#374151", role: "Teks sekunder" },
      { name: "Neutral Light", hex: "#F9FAFB", role: "Background bersih" },
    ],
  },
  elegan: {
    name: "Elegant Noir",
    colors: [
      { name: "Primary", hex: "#0F172A", role: "Warna utama mewah dan elegan" },
      { name: "Secondary", hex: "#B45309", role: "Aksen emas untuk sentuhan premium" },
      { name: "Accent", hex: "#9CA3AF", role: "Aksen perak untuk detail" },
      { name: "Neutral Dark", hex: "#1E293B", role: "Teks utama" },
      { name: "Neutral Light", hex: "#F8FAFC", role: "Background bersih" },
    ],
  },
  playful: {
    name: "Playful Pop",
    colors: [
      { name: "Primary", hex: "#EC4899", role: "Warna utama enerjik dan ceria" },
      { name: "Secondary", hex: "#8B5CF6", role: "Aksen ungu untuk sentuhan fun" },
      { name: "Accent", hex: "#FACC15", role: "Aksen kuning untuk highlight" },
      { name: "Neutral Dark", hex: "#1F2937", role: "Teks utama" },
      { name: "Neutral Light", hex: "#FDF4FF", role: "Background lembut" },
    ],
  },
  berani: {
    name: "Bold Contrast",
    colors: [
      { name: "Primary", hex: "#DC2626", role: "Warna utama yang tegas dan percaya diri" },
      { name: "Secondary", hex: "#000000", role: "Aksen hitam untuk kekuatan visual" },
      { name: "Accent", hex: "#FBBF24", role: "Aksen kuning untuk kontras" },
      { name: "Neutral Dark", hex: "#18181B", role: "Teks utama" },
      { name: "Neutral Light", hex: "#FAFAFA", role: "Background bersih" },
    ],
  },
  minimalis: {
    name: "Minimal Stone",
    colors: [
      { name: "Primary", hex: "#57534E", role: "Warna utama tenang dan bersih" },
      { name: "Secondary", hex: "#A8A29E", role: "Aksen netral hangat" },
      { name: "Accent", hex: "#0EA5E9", role: "Aksen biru untuk interaktivitas" },
      { name: "Neutral Dark", hex: "#292524", role: "Teks utama" },
      { name: "Neutral Light", hex: "#FAFAF9", role: "Background kosong" },
    ],
  },
  hangat: {
    name: "Warm Terracotta",
    colors: [
      { name: "Primary", hex: "#B45309", role: "Warna utama hangat dan membumi" },
      { name: "Secondary", hex: "#D97706", role: "Aksen oranye lembut" },
      { name: "Accent", hex: "#65A30D", role: "Aksen hijau untuk keseimbangan" },
      { name: "Neutral Dark", hex: "#44403C", role: "Teks utama" },
      { name: "Neutral Light", hex: "#FEF3C7", role: "Background lembut" },
    ],
  },
  inovatif: {
    name: "Tech Forward",
    colors: [
      { name: "Primary", hex: "#7C3AED", role: "Warna utama futuristik" },
      { name: "Secondary", hex: "#06B6D4", role: "Aksen cyan untuk kesan teknologi" },
      { name: "Accent", hex: "#22C55E", role: "Aksen hijau untuk sukses/progress" },
      { name: "Neutral Dark", hex: "#0F172A", role: "Teks utama" },
      { name: "Neutral Light", hex: "#F1F5F9", role: "Background bersih" },
    ],
  },
  tradisional: {
    name: "Classic Heritage",
    colors: [
      { name: "Primary", hex: "#7C2D12", role: "Warna utama klasik dan kaya" },
      { name: "Secondary", hex: "#A16207", role: "Aksen emas tua" },
      { name: "Accent", hex: "#166534", role: "Aksen hijau tua untuk keseimbangan" },
      { name: "Neutral Dark", hex: "#292524", role: "Teks utama" },
      { name: "Neutral Light", hex: "#FEF3C7", role: "Background kertas" },
    ],
  },
  mewah: {
    name: "Luxe Gold",
    colors: [
      { name: "Primary", hex: "#18181B", role: "Warna utama mewah" },
      { name: "Secondary", hex: "#CA8A04", role: "Aksen emas premium" },
      { name: "Accent", hex: "#881337", role: "Aksen merah anggur untuk detail eksklusif" },
      { name: "Neutral Dark", hex: "#27272A", role: "Teks utama" },
      { name: "Neutral Light", hex: "#FAFAF9", role: "Background elegan" },
    ],
  },
  terpercaya: {
    name: "Trust Blue",
    colors: [
      { name: "Primary", hex: "#0369A1", role: "Warna utama yang memancarkan kepercayaan" },
      { name: "Secondary", hex: "#14B8A6", role: "Aksen teal untuk kesan segar" },
      { name: "Accent", hex: "#F59E0B", role: "Aksen hangat untuk CTA" },
      { name: "Neutral Dark", hex: "#1F2937", role: "Teks utama" },
      { name: "Neutral Light", hex: "#F0F9FF", role: "Background lembut" },
    ],
  },
};

const FONT_PAIRS: Record<string, FontPair> = {
  profesional: {
    heading: {
      family: "Inter",
      url: "https://fonts.google.com/specimen/Inter",
      rationale: "Sans-serif modern yang bersih dan sangat readable — pas untuk brand profesional.",
    },
    body: {
      family: "Source Sans 3",
      url: "https://fonts.google.com/specimen/Source+Sans+3",
      rationale: "Font body yang netral dan nyaman dibaca dalam paragraf panjang.",
    },
  },
  ramah: {
    heading: {
      family: "Poppins",
      url: "https://fonts.google.com/specimen/Poppins",
      rationale: "Geometric sans-serif yang ramah dan approachable.",
    },
    body: {
      family: "Nunito",
      url: "https://fonts.google.com/specimen/Nunito",
      rationale: "Bentuk bulat yang hangat dan friendly.",
    },
  },
  modern: {
    heading: {
      family: "Space Grotesk",
      url: "https://fonts.google.com/specimen/Space+Grotesk",
      rationale: "Sans-serif modern dengan karakter distinctif untuk brand kontemporer.",
    },
    body: {
      family: "Inter",
      url: "https://fonts.google.com/specimen/Inter",
      rationale: "Body font modern yang sangat legible di layar.",
    },
  },
  elegan: {
    heading: {
      family: "Playfair Display",
      url: "https://fonts.google.com/specimen/Playfair+Display",
      rationale: "Serif dengan kontras tinggi yang elegan dan sophisticated.",
    },
    body: {
      family: "Lora",
      url: "https://fonts.google.com/specimen/Lora",
      rationale: "Serif hangat yang nyaman untuk teks panjang.",
    },
  },
  playful: {
    heading: {
      family: "Fredoka",
      url: "https://fonts.google.com/specimen/Fredoka",
      rationale: "Bentuk rounded yang playful dan memorable.",
    },
    body: {
      family: "Nunito",
      url: "https://fonts.google.com/specimen/Nunito",
      rationale: "Body friendly yang senada dengan heading playful.",
    },
  },
  berani: {
    heading: {
      family: "Archivo Black",
      url: "https://fonts.google.com/specimen/Archivo+Black",
      rationale: "Bold dan impactful — langsung mencuri perhatian.",
    },
    body: {
      family: "Archivo",
      url: "https://fonts.google.com/specimen/Archivo",
      rationale: "Sans-serif netral yang menyeimbangkan heading tebal.",
    },
  },
  minimalis: {
    heading: {
      family: "DM Sans",
      url: "https://fonts.google.com/specimen/DM+Sans",
      rationale: "Sans-serif bersih yang minimal tanpa banyak ornamen.",
    },
    body: {
      family: "DM Sans",
      url: "https://fonts.google.com/specimen/DM+Sans",
      rationale: "Konsisten untuk tampilan yang sangat clean.",
    },
  },
  hangat: {
    heading: {
      family: "Merriweather",
      url: "https://fonts.google.com/specimen/Merriweather",
      rationale: "Serif yang hangat dan membumi, cocok untuk narasi brand.",
    },
    body: {
      family: "Open Sans",
      url: "https://fonts.google.com/specimen/Open Sans",
      rationale: "Sans-serif netral yang ramah dibaca.",
    },
  },
  inovatif: {
    heading: {
      family: "Sora",
      url: "https://fonts.google.com/specimen/Sora",
      rationale: "Sans-serif futuristik dengan karakter geometrik yang fresh.",
    },
    body: {
      family: "Inter",
      url: "https://fonts.google.com/specimen/Inter",
      rationale: "Body font modern berkarakter teknologi.",
    },
  },
  tradisional: {
    heading: {
      family: "Cormorant Garamond",
      url: "https://fonts.google.com/specimen/Cormorant+Garamond",
      rationale: "Serif klasik bergaya literary dan timeless.",
    },
    body: {
      family: "EB Garamond",
      url: "https://fonts.google.com/specimen/EB+Garamond",
      rationale: "Serif tradisional untuk teks panjang yang nyaman.",
    },
  },
  mewah: {
    heading: {
      family: "Cormorant",
      url: "https://fonts.google.com/specimen/Cormorant",
      rationale: "Serif dengan kontras ekstrem yang memancarkan kemewahan.",
    },
    body: {
      family: "Libre Baskerville",
      url: "https://fonts.google.com/specimen/Libre+Baskerville",
      rationale: "Serif klasik premium untuk teks pendukung.",
    },
  },
  terpercaya: {
    heading: {
      family: "IBM Plex Sans",
      url: "https://fonts.google.com/specimen/IBM+Plex+Sans",
      rationale: "Sans-serif institusional yang menegaskan kredibilitas.",
    },
    body: {
      family: "IBM Plex Sans",
      url: "https://fonts.google.com/specimen/IBM+Plex+Sans",
      rationale: "Body konsisten untuk komunikasi yang solid dan trustworthy.",
    },
  },
};

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

function pickKey(traits: string[], table: Record<string, unknown>): string {
  for (const t of traits) {
    const k = t.toLowerCase();
    if (table[k]) return k;
  }
  return "profesional";
}

function makeTagline(brief: BrandBrief): string {
  const name = brief.brandName.trim();
  const t = brief.personality.map((p) => p.toLowerCase());
  if (t.includes("playful")) return `${name} — bikin hari lebih seru.`;
  if (t.includes("elegan") || t.includes("mewah")) return `${name} — sentuhan istimewa setiap hari.`;
  if (t.includes("berani")) return `${name} — berani jadi berbeda.`;
  if (t.includes("hangat") || t.includes("ramah")) return `${name} — dekat dan tulus.`;
  if (t.includes("inovatif") || t.includes("modern")) return `${name} — melangkah lebih dulu.`;
  if (t.includes("minimalis")) return `${name} — esensial, tanpa basa-basi.`;
  if (t.includes("tradisional")) return `${name} — warisan yang tetap relevan.`;
  if (t.includes("terpercaya")) return `${name} — pilihan yang bisa diandalkan.`;
  return `${name} — ${brief.industry.toLowerCase()} yang lebih baik.`;
}

function makeEssence(brief: BrandBrief): string {
  const traits = brief.personality.slice(0, 3).join(", ").toLowerCase();
  return `${brief.brandName} adalah brand ${brief.industry.toLowerCase()} yang ${traits}. Kami hadir untuk ${brief.targetAudience.split(".")[0].toLowerCase()}, dengan komitmen ${brief.mission.toLowerCase().split(".")[0]}.`;
}

function mergeTone(traits: string[]) {
  const dos = new Set<string>();
  const donts = new Set<string>();
  for (const t of traits) {
    const k = t.toLowerCase();
    const map = TONE_MAP[k];
    if (!map) continue;
    map.do.forEach((x) => dos.add(x));
    map.dont.forEach((x) => donts.add(x));
  }
  if (dos.size === 0) {
    TONE_MAP.profesional.do.forEach((x) => dos.add(x));
    TONE_MAP.profesional.dont.forEach((x) => donts.add(x));
  }
  return {
    do: Array.from(dos).slice(0, 5),
    dont: Array.from(donts).slice(0, 5),
  };
}

export function generateBrandIdentity(brief: BrandBrief): BrandIdentity {
  const paletteKey = pickKey(brief.personality, PALETTES);
  const fontKey = pickKey(brief.personality, FONT_PAIRS);
  const palette = PALETTES[paletteKey];
  const fonts = FONT_PAIRS[fontKey];

  const typography: TypographyItem[] = [
    {
      role: "heading",
      fontFamily: fonts.heading.family,
      googleFontUrl: fonts.heading.url,
      rationale: fonts.heading.rationale,
    },
    {
      role: "body",
      fontFamily: fonts.body.family,
      googleFontUrl: fonts.body.url,
      rationale: fonts.body.rationale,
    },
  ];

  return {
    tagline: makeTagline(brief),
    essence: makeEssence(brief),
    palette: palette.colors,
    typography,
    toneOfVoice: mergeTone(brief.personality),
    rationale: `Palet "${palette.name}" dipilih karena selaras dengan kepribadian ${brief.personality.join(", ").toLowerCase()} yang kamu tentukan. Kombinasi warna dan tipografi ini membangun persepsi yang konsisten di mata ${brief.targetAudience.split(",")[0].toLowerCase()}.`,
  };
}
