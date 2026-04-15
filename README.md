# Kinesin

Aplikasi pembuat brand guideline berbasis AI. Isi brief singkat → dapatkan rekomendasi palet warna, tipografi, dan tone of voice → export PDF guideline.

## Setup (Langkah demi langkah)

### 1. Install dependencies
```bash
npm install
```

### 2. Buat file `.env.local`
Copy `.env.local.example` menjadi `.env.local`, lalu isi API key Anthropic:

```
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

Dapatkan API key di: https://console.anthropic.com/

### 3. Jalankan aplikasi
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Deploy ke Vercel

1. Push folder ini ke repository GitHub.
2. Buka [vercel.com](https://vercel.com), login dengan GitHub.
3. Klik **New Project** → pilih repository-nya.
4. Di bagian **Environment Variables**, tambahkan `ANTHROPIC_API_KEY`.
5. Klik **Deploy**.

Selesai! Website-mu langsung online dengan domain `.vercel.app`.

## Fitur

- Form brief brand (nama, industri, audiens, visi-misi, kepribadian)
- AI generate: tagline, palet warna (5 warna), 2 pilihan font Google Fonts, tone of voice
- Simpan proyek di browser (localStorage)
- Export PDF brand guideline

## Tech Stack

- Next.js 15 (App Router)
- TypeScript + Tailwind CSS
- Anthropic Claude API (Sonnet 4.6)
- jsPDF untuk export PDF
