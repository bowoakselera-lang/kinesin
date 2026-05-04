"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { useRef, useState } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export default function Home() {
  return (
    <div className="relative bg-black">
      <Hero />
      <Marquee />
      <ManifestoSection />
      <HowItWorks />
      <FeaturesGrid />
      <PaletteShowcase />
      <FinalCTA />
      <AudioToggle />
    </div>
  );
}

// ─── AUDIO TOGGLE — floating button (browsers block autoplay-with-sound) ─
function AudioToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/Bring%20Me%20The%20Horizon%20-%20LosT%20(Lyric%20Video).mp3"
        loop
        preload="auto"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-3 hover:bg-white/20 transition shadow-lg"
      >
        {isPlaying ? (
          <>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
            <span className="text-xs font-medium hidden sm:inline">Music On</span>
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "#f767bc" }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        ) : (
          <>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
            <span className="text-xs font-medium hidden sm:inline">Play Music</span>
          </>
        )}
      </button>
    </>
  );
}

// ─── HERO with sticky pin + parallax ────────────────────────────────────
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, 0]);

  // Mouse parallax — bg image shifts subtly as cursor moves
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 18, mass: 0.6 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 18, mass: 0.6 });
  const bgX = useTransform(smoothX, [-1, 1], ["-3%", "3%"]);
  const bgY = useTransform(smoothY, [-1, 1], ["-3%", "3%"]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x * 2 - 1);
    mouseY.set(y * 2 - 1);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-black text-white -mt-[60px] pt-[60px] overflow-hidden"
    >
      <div
        className="relative h-screen w-full overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background video — mouse parallax */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.video
            src="/bg%20animasi.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectPosition: "center",
              x: bgX,
              y: bgY,
              scale: 1.08,
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>

        {/* Top labels */}
        <motion.div
          className="relative z-10 flex justify-between items-start px-8 pt-6 text-xs font-medium text-white/70"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        >
          <span className="lowercase tracking-wide">brand identity</span>
          <span className="font-mono">{new Date().getFullYear()}©</span>
        </motion.div>

        {/* Main content */}
        <motion.div
          className="relative z-10 h-full flex flex-col items-end justify-center pl-6 pr-6 md:pr-10 lg:pr-16 pb-24 pt-12 text-right"
          style={{ y: textY, opacity: fade }}
        >
          <motion.div
            className="mb-6 text-sm font-bold tracking-[0.3em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="text-white">KINESIN</span>{" "}
            <span style={{ color: "#f767bc" }}>STUDIO</span>
          </motion.div>

          <h1
            className="uppercase text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-[5rem] tracking-tight leading-[0.95]"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            <HeroLine delay={0.4} weight={200} color="#f767bc">
              Bangun brand
            </HeroLine>
            <span className="block whitespace-nowrap">
              <HeroWord delay={0.6} weight={700} color="#fff" inline>
                yang
              </HeroWord>{" "}
              <HeroWord delay={0.75} weight={200} color="#f767bc" inline>
                bergerak
              </HeroWord>{" "}
              <HeroWord delay={0.9} weight={700} color="#fff" inline>
                maju
              </HeroWord>
            </span>
            <HeroLine delay={1.05} weight={700} color="#fff">
              tanpa hambatan.
            </HeroLine>
          </h1>

          <motion.p
            className="mt-8 text-sm md:text-base text-white/70 max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: EASE }}
          >
            Identitas visual, palet warna, tipografi, dan
            <br className="hidden md:block" />
            mockup brand — siap export jadi PDF guideline.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-10 justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6, ease: EASE }}
          >
            <Link
              href="/create"
              className="group relative px-8 py-4 rounded-full bg-white text-black font-bold text-base hover:scale-105 transition-transform"
            >
              Mulai Buat Brand
            </Link>
            <Link
              href="/projects"
              className="px-8 py-4 rounded-full border border-white/25 text-white font-medium text-base hover:bg-white/10 transition backdrop-blur-sm"
            >
              Proyek Tersimpan
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-8 z-10 text-xs text-white/50 font-mono tracking-wider flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
        >
          <span>[001] · scroll to explore</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}

function HeroLine({
  children,
  delay,
  weight,
  color,
}: {
  children: React.ReactNode;
  delay: number;
  weight: number;
  color: string;
}) {
  return (
    <motion.span
      className="block whitespace-nowrap overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay }}
      style={{ color, fontWeight: weight }}
    >
      <motion.span
        className="block"
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

function HeroWord({
  children,
  delay,
  weight,
  color,
  inline,
}: {
  children: React.ReactNode;
  delay: number;
  weight: number;
  color: string;
  inline?: boolean;
}) {
  return (
    <motion.span
      className={inline ? "inline-block overflow-hidden align-bottom" : "block overflow-hidden"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay }}
      style={{ color, fontWeight: weight }}
    >
      <motion.span
        className="inline-block"
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

// ─── MARQUEE ────────────────────────────────────────────────────────────
function Marquee() {
  const items = [
    "BRAND IDENTITY",
    "COLOR PALETTE",
    "TYPOGRAPHY",
    "LOGO SYSTEM",
    "TONE OF VOICE",
    "MOCKUP READY",
    "PDF GUIDELINE",
  ];
  const row = [...items, ...items];
  return (
    <section className="relative bg-black border-y border-white/10 overflow-hidden">
      <motion.div
        className="flex gap-12 py-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {row.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="text-3xl md:text-5xl font-black tracking-tight text-white/30 uppercase flex items-center gap-12"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            {label}
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: "#f767bc" }}
            />
          </span>
        ))}
      </motion.div>
    </section>
  );
}

// ─── MANIFESTO ──────────────────────────────────────────────────────────
function ManifestoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section
      ref={ref}
      className="relative bg-black text-white py-32 md:py-48 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{ y: bgY }}
      >
        <motion.div
          className="absolute -left-40 top-1/4 w-[600px] h-[600px] rounded-full blur-2xl"
          style={{ backgroundColor: "#4F46E5" }}
          animate={{
            x: [0, 280, -120, 200, 0],
            y: [0, -180, 220, -100, 0],
            scale: [1, 1.25, 0.85, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -right-40 bottom-0 w-[500px] h-[500px] rounded-full blur-2xl"
          style={{ backgroundColor: "#f767bc" }}
          animate={{
            x: [0, -250, 180, -140, 0],
            y: [0, 150, -200, 120, 0],
            scale: [1, 0.85, 1.3, 0.95, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="text-xs md:text-sm font-bold tracking-[0.3em] text-white/50 mb-8 uppercase flex items-center gap-3"
        >
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: "#f767bc" }}
          />
          02 · Manifesto
        </motion.p>

        <motion.h2
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] uppercase max-w-5xl"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          {[
            "Brand bukan cuma logo.",
            "Tapi sistem yang konsisten,",
            "punya cerita, dan",
            "siap dipakai di mana pun.",
          ].map((line, i) => (
            <motion.span
              key={i}
              variants={fadeUp}
              className="block"
              style={{
                fontWeight: i === 2 ? 200 : 700,
                color: i === 2 ? "#f767bc" : "#fff",
              }}
            >
              {line}
            </motion.span>
          ))}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="mt-10 max-w-xl text-base md:text-lg text-white/60 leading-relaxed"
        >
          Kinesin bantu kamu generate identitas brand lengkap — dari palet warna
          sampai mockup — dalam hitungan menit, bukan minggu.
        </motion.p>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS — sticky number, scrolling content ───────────────────
function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Skater glides from off-screen left to off-screen right while user scrolls
  const charX = useTransform(scrollYProgress, [0, 1], ["-25vw", "115vw"]);
  // Slight rotation as it moves
  const charRotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);

  const steps = [
    {
      num: "01",
      title: "Brief",
      desc: "Isi nama brand, industri, target audiens, visi-misi, dan pilih kepribadian brand dari daftar.",
    },
    {
      num: "02",
      title: "Generate",
      desc: "Sistem otomatis merekomendasikan palet warna, tipografi, logo, dan tone of voice yang sesuai.",
    },
    {
      num: "03",
      title: "Export",
      desc: "Preview hasilnya, lalu unduh sebagai PDF brand guideline profesional — siap pakai.",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative bg-white py-32 md:py-48 overflow-hidden"
    >
      {/* Skateboarder gliding across the section as user scrolls */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          className="sticky top-1/2 left-0 w-fit"
          style={{ x: charX, y: "-50%", rotate: charRotate }}
        >
          <motion.img
            src="/object polosn.png"
            alt=""
            className="w-28 md:w-36 lg:w-44 select-none"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            draggable={false}
          />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="mb-20 text-center"
        >
          <p className="text-xs font-bold text-indigo-600 tracking-[0.3em] uppercase mb-4">
            03 · How it works
          </p>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-[1.05]"
            style={{ fontFamily: "var(--font-display), sans-serif", fontWeight: 700 }}
          >
            Tiga langkah.
            <br />
            <span style={{ color: "#f767bc", fontWeight: 200 }}>Satu guideline.</span>
          </h2>
        </motion.div>

        <div className="space-y-32">
          {steps.map((s, i) => (
            <Step key={s.num} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Step({
  num,
  title,
  desc,
  index,
}: {
  num: string;
  title: string;
  desc: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const numX = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const numScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 1.05]);

  return (
    <motion.div
      ref={ref}
      className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-16 items-center"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: EASE }}
    >
      <motion.div
        className="text-[8rem] md:text-[14rem] leading-none font-black select-none"
        style={{
          fontFamily: "var(--font-display), sans-serif",
          color: index % 2 === 0 ? "#0f172a" : "#f767bc",
          x: numX,
          scale: numScale,
        }}
      >
        {num}
      </motion.div>
      <div>
        <h3 className="text-3xl md:text-5xl font-black tracking-tight mb-4 uppercase">
          {title}
        </h3>
        <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-lg">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

// ─── FEATURES GRID with stagger ─────────────────────────────────────────
function FeaturesGrid() {
  const features = [
    {
      label: "PALET WARNA",
      title: "5 warna harmonis + tints",
      desc: "Warna primer, sekunder, aksen, dan netral dipilih berdasar psikologi warna & kepribadian brand. Lengkap dengan gradasi 20–80%.",
      bg: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
    },
    {
      label: "TIPOGRAFI",
      title: "Pasangan font Google Fonts",
      desc: "Heading & body font yang cocok, lengkap dengan specimen alfabet dan skala weight.",
      bg: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    },
    {
      label: "LOGO",
      title: "3 variasi logo otomatis",
      desc: "Monogram, wordmark, dan negative space — semua bisa diunduh SVG & PNG. Preview langsung di mockup.",
      bg: "linear-gradient(135deg, #F767BC 0%, #DB4DA1 100%)",
    },
    {
      label: "PDF GUIDELINE",
      title: "Export editorial-style",
      desc: "PDF bergaya Behance case study: cover, essence, logo showcase, palette, typography, tone of voice.",
      bg: "linear-gradient(135deg, #818CF8 0%, #6366F1 100%)",
    },
  ];

  return (
    <section className="bg-slate-50 py-32 md:py-40">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="mb-16"
        >
          <p className="text-xs font-bold text-indigo-600 tracking-[0.3em] uppercase mb-4">
            04 · Apa yang kamu dapat
          </p>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-[1.05]"
            style={{ fontFamily: "var(--font-display), sans-serif", fontWeight: 700 }}
          >
            Semua yang kamu butuhkan
            <br />
            <span style={{ color: "#f767bc", fontWeight: 200 }}>untuk satu brand.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.label}
              variants={fadeUp}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative rounded-2xl p-8 md:p-10 flex flex-col justify-end min-h-[280px] text-white overflow-hidden cursor-default"
              style={{ background: f.bg }}
            >
              <p className="text-xs font-bold tracking-widest opacity-70 mb-2">
                {f.label}
              </p>
              <h3 className="text-xl md:text-2xl font-bold mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed opacity-80 max-w-sm">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── PALETTE SHOWCASE — bars expand on view ─────────────────────────────
function PaletteShowcase() {
  const colors = [
    { hex: "#4F46E5", name: "Primary" },
    { hex: "#818CF8", name: "Secondary" },
    { hex: "#F767BC", name: "Accent" },
    { hex: "#1E293B", name: "Dark" },
    { hex: "#F1F5F9", name: "Light" },
  ];

  return (
    <section className="bg-slate-950 py-32 md:py-40 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="mb-12"
        >
          <p className="text-xs font-bold text-indigo-400 tracking-[0.3em] uppercase mb-4">
            05 · Palette preview
          </p>
          <h2
            className="text-4xl md:text-6xl uppercase tracking-tight leading-[1.05] text-white"
            style={{ fontFamily: "var(--font-display), sans-serif", fontWeight: 700 }}
          >
            Lima warna —
            <br />
            <span style={{ color: "#f767bc", fontWeight: 200 }}>
              tiap brand beda.
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="flex rounded-2xl overflow-hidden h-32 md:h-44 shadow-2xl"
        >
          {colors.map((c) => (
            <motion.div
              key={c.hex}
              variants={{
                hidden: { flex: "0 0 0%" },
                show: {
                  flex: "1 1 0%",
                  transition: { duration: 0.9, ease: EASE },
                },
              }}
              className="flex items-end p-4 md:p-6 overflow-hidden"
              style={{ backgroundColor: c.hex }}
            >
              <div className="text-[10px] md:text-xs font-mono whitespace-nowrap">
                <div
                  className="font-bold mb-1"
                  style={{
                    color: c.hex === "#F1F5F9" ? "#0f172a" : "#fff",
                  }}
                >
                  {c.name}
                </div>
                <div
                  style={{
                    color: c.hex === "#F1F5F9" ? "#475569" : "rgba(255,255,255,0.7)",
                  }}
                >
                  {c.hex}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── FINAL CTA ──────────────────────────────────────────────────────────
function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const blobScale = useTransform(scrollYProgress, [0, 1], [0.8, 1.4]);
  const blobOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0.5]);

  return (
    <section
      ref={ref}
      className="relative bg-black text-white py-40 md:py-56 text-center overflow-hidden"
    >
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(247,103,188,0.35) 0%, rgba(79,70,229,0.2) 40%, transparent 70%)",
          scale: blobScale,
          opacity: blobOpacity,
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="text-4xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-[1.05] mb-8"
          style={{ fontFamily: "var(--font-display), sans-serif", fontWeight: 700 }}
        >
          Siap bangun
          <br />
          <span style={{ color: "#f767bc", fontWeight: 200 }}>identitas brand-mu?</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="text-slate-400 mb-12 text-lg"
        >
          Gratis, tanpa sign up, langsung jadi.
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
        >
          <Link
            href="/create"
            className="inline-block px-12 py-5 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform"
          >
            Mulai Sekarang →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
