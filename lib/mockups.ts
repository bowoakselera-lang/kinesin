import type { BrandIdentity } from "./types";

export type Mockup = {
  id: string;
  name: string;
  svg: string;
};

function logoDataUrl(logoSvg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(logoSvg)}`;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function businessCard(logoSvg: string, identity: BrandIdentity): string {
  const primary = identity.palette[0]?.hex ?? "#111";
  const dark = identity.palette[3]?.hex ?? "#18181B";
  const light = identity.palette[4]?.hex ?? "#F5F5F4";
  const accent = identity.palette[2]?.hex ?? primary;
  const url = logoDataUrl(logoSvg);
  const u = uid();

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
    <defs>
      <linearGradient id="bg${u}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${dark}"/>
        <stop offset="100%" stop-color="#0a0a0a"/>
      </linearGradient>
      <linearGradient id="card${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="${light}"/>
      </linearGradient>
      <linearGradient id="cardBack${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${primary}"/>
        <stop offset="100%" stop-color="${accent}"/>
      </linearGradient>
      <filter id="shadow${u}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="10"/>
        <feOffset dx="0" dy="14"/>
        <feComponentTransfer><feFuncA type="linear" slope="0.45"/></feComponentTransfer>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <radialGradient id="spot${u}" cx="0.5" cy="0.3" r="0.8">
        <stop offset="0%" stop-color="rgba(255,255,255,0.12)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
      </radialGradient>
    </defs>
    <rect width="800" height="500" fill="url(#bg${u})"/>
    <rect width="800" height="500" fill="url(#spot${u})"/>

    <!-- Back card (colored) -->
    <g transform="translate(420 140) rotate(8)" filter="url(#shadow${u})">
      <rect width="320" height="190" rx="8" fill="url(#cardBack${u})"/>
      <rect x="0" y="0" width="320" height="190" rx="8" fill="rgba(255,255,255,0.05)"/>
      <rect x="24" y="80" width="60" height="2" fill="rgba(255,255,255,0.6)"/>
      <text x="24" y="110" font-family="Helvetica, sans-serif" font-size="11" font-weight="700" fill="#fff" letter-spacing="2">BRAND</text>
      <text x="24" y="155" font-family="Helvetica, sans-serif" font-size="9" fill="rgba(255,255,255,0.8)">hello@brand.id · +62 812-000-000</text>
    </g>

    <!-- Front card (white) -->
    <g transform="translate(120 180) rotate(-6)" filter="url(#shadow${u})">
      <rect width="320" height="190" rx="8" fill="url(#card${u})"/>
      <image href="${url}" x="60" y="40" width="200" height="110" preserveAspectRatio="xMidYMid meet"/>
      <rect x="24" y="170" width="272" height="1" fill="rgba(0,0,0,0.1)"/>
    </g>
  </svg>`;
}

function laptop(logoSvg: string, identity: BrandIdentity): string {
  const primary = identity.palette[0]?.hex ?? "#111";
  const accent = identity.palette[4]?.hex ?? "#FAFAF9";
  const url = logoDataUrl(logoSvg);
  const u = uid();

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bg${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2c2c30"/>
        <stop offset="100%" stop-color="#131316"/>
      </linearGradient>
      <linearGradient id="bezel${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1c1c1f"/>
        <stop offset="100%" stop-color="#0a0a0b"/>
      </linearGradient>
      <linearGradient id="screen${u}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${primary}"/>
        <stop offset="100%" stop-color="${primary}" stop-opacity="0.85"/>
      </linearGradient>
      <linearGradient id="keyboardDeck${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2d2d30"/>
        <stop offset="100%" stop-color="#1a1a1d"/>
      </linearGradient>
      <linearGradient id="reflection${u}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="rgba(255,255,255,0.08)"/>
        <stop offset="50%" stop-color="rgba(255,255,255,0.02)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0.06)"/>
      </linearGradient>
      <filter id="sh${u}" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="18"/>
        <feOffset dy="20"/>
        <feComponentTransfer><feFuncA type="linear" slope="0.5"/></feComponentTransfer>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect width="900" height="600" fill="url(#bg${u})"/>

    <!-- Laptop screen -->
    <g filter="url(#sh${u})">
      <rect x="150" y="70" width="600" height="370" rx="14" fill="url(#bezel${u})"/>
      <rect x="168" y="88" width="564" height="334" rx="3" fill="url(#screen${u})"/>
      <!-- Screen reflection -->
      <rect x="168" y="88" width="564" height="334" rx="3" fill="url(#reflection${u})"/>
      <!-- Logo on screen -->
      <image href="${url}" x="240" y="160" width="420" height="190" preserveAspectRatio="xMidYMid meet"/>
      <!-- Camera dot -->
      <circle cx="450" cy="80" r="2.5" fill="#3a3a3a"/>
    </g>

    <!-- Keyboard deck -->
    <path d="M 120 440 L 780 440 L 820 480 L 80 480 Z" fill="url(#keyboardDeck${u})"/>
    <rect x="380" y="442" width="140" height="6" rx="2" fill="#0a0a0b"/>
    <!-- Base shadow -->
    <ellipse cx="450" cy="495" rx="400" ry="8" fill="rgba(0,0,0,0.4)"/>

    <!-- Subtle ground reflection -->
    <rect x="0" y="500" width="900" height="100" fill="rgba(255,255,255,0.015)"/>
  </svg>`;
}

function tshirt(logoSvg: string, identity: BrandIdentity): string {
  const primary = identity.palette[0]?.hex ?? "#111";
  const bg = identity.palette[4]?.hex ?? "#F5F5F4";
  const url = logoDataUrl(logoSvg);
  const u = uid();

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
    <defs>
      <radialGradient id="bg${u}" cx="0.5" cy="0.5" r="0.8">
        <stop offset="0%" stop-color="${bg}"/>
        <stop offset="100%" stop-color="#d4d4d0"/>
      </radialGradient>
      <linearGradient id="shirt${u}" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="${primary}" stop-opacity="0.95"/>
        <stop offset="40%" stop-color="${primary}"/>
        <stop offset="100%" stop-color="${primary}" stop-opacity="0.82"/>
      </linearGradient>
      <radialGradient id="shirtShade${u}" cx="0.5" cy="0.4" r="0.6">
        <stop offset="0%" stop-color="rgba(255,255,255,0.12)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.25)"/>
      </radialGradient>
      <filter id="sh${u}" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="14"/>
        <feOffset dy="16"/>
        <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect width="800" height="800" fill="url(#bg${u})"/>

    <!-- Hanger hook -->
    <path d="M 400 90 C 400 70, 420 60, 430 75" fill="none" stroke="#888" stroke-width="3" stroke-linecap="round"/>
    <!-- Hanger -->
    <path d="M 260 140 L 400 100 L 540 140" fill="none" stroke="#a0a0a0" stroke-width="4" stroke-linecap="round"/>

    <!-- Shirt -->
    <g filter="url(#sh${u})">
      <path d="M 230 160
               L 310 130
               C 340 180, 460 180, 490 130
               L 570 160
               L 640 270
               L 560 310
               L 560 680
               L 240 680
               L 240 310
               L 160 270 Z"
            fill="url(#shirt${u})"/>
      <path d="M 230 160
               L 310 130
               C 340 180, 460 180, 490 130
               L 570 160
               L 640 270
               L 560 310
               L 560 680
               L 240 680
               L 240 310
               L 160 270 Z"
            fill="url(#shirtShade${u})" opacity="0.55"/>
    </g>

    <!-- Collar shadow -->
    <path d="M 320 140 C 350 200, 450 200, 480 140" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="5"/>
    <!-- Stitching -->
    <path d="M 320 140 C 350 200, 450 200, 480 140" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="3 3"/>
    <!-- Fabric folds -->
    <path d="M 300 350 Q 350 420, 310 580" stroke="rgba(0,0,0,0.12)" stroke-width="2" fill="none"/>
    <path d="M 500 350 Q 450 420, 490 580" stroke="rgba(0,0,0,0.12)" stroke-width="2" fill="none"/>

    <!-- Logo on chest -->
    <image href="${url}" x="300" y="290" width="200" height="130" preserveAspectRatio="xMidYMid meet"/>
  </svg>`;
}

function keychain(logoSvg: string, identity: BrandIdentity): string {
  const dark = identity.palette[3]?.hex ?? "#18181B";
  const primary = identity.palette[0]?.hex ?? "#111";
  const light = identity.palette[4]?.hex ?? "#F5F5F4";
  const url = logoDataUrl(logoSvg);
  const u = uid();

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
    <defs>
      <radialGradient id="bg${u}" cx="0.5" cy="0.5" r="0.9">
        <stop offset="0%" stop-color="#1a1a1c"/>
        <stop offset="100%" stop-color="#050506"/>
      </radialGradient>
      <linearGradient id="ring${u}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#e8e8e8"/>
        <stop offset="50%" stop-color="#7a7a7d"/>
        <stop offset="100%" stop-color="#d4d4d4"/>
      </linearGradient>
      <linearGradient id="tagPrimary${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${primary}"/>
        <stop offset="100%" stop-color="${primary}" stop-opacity="0.75"/>
      </linearGradient>
      <linearGradient id="tagLight${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="${light}"/>
      </linearGradient>
      <filter id="sh${u}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="12"/>
        <feOffset dy="16"/>
        <feComponentTransfer><feFuncA type="linear" slope="0.55"/></feComponentTransfer>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <radialGradient id="glow${u}" cx="0.5" cy="0.4" r="0.6">
        <stop offset="0%" stop-color="rgba(255,255,255,0.08)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
      </radialGradient>
    </defs>
    <rect width="800" height="800" fill="url(#bg${u})"/>
    <rect width="800" height="800" fill="url(#glow${u})"/>

    <!-- Keychain 1 -->
    <g transform="translate(140 150) rotate(-8)" filter="url(#sh${u})">
      <!-- Ring -->
      <circle cx="100" cy="70" r="36" fill="none" stroke="url(#ring${u})" stroke-width="8"/>
      <circle cx="100" cy="70" r="36" fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="1"/>
      <!-- Split ring inner -->
      <circle cx="100" cy="70" r="28" fill="none" stroke="#555" stroke-width="2" opacity="0.5"/>
      <!-- Clasp -->
      <rect x="94" y="106" width="12" height="22" fill="url(#ring${u})" rx="2"/>
      <!-- Tag -->
      <rect x="20" y="128" width="160" height="300" rx="18" fill="url(#tagPrimary${u})"/>
      <!-- Logo punch hole -->
      <circle cx="100" cy="148" r="10" fill="#0a0a0b"/>
      <circle cx="100" cy="148" r="10" fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="1"/>
      <!-- Inner border -->
      <rect x="32" y="180" width="136" height="232" rx="10" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      <!-- Logo -->
      <image href="${url}" x="40" y="210" width="120" height="180" preserveAspectRatio="xMidYMid meet"/>
      <!-- Shine -->
      <rect x="20" y="128" width="160" height="40" rx="18" fill="rgba(255,255,255,0.08)"/>
    </g>

    <!-- Keychain 2 -->
    <g transform="translate(430 200) rotate(10)" filter="url(#sh${u})">
      <circle cx="100" cy="70" r="36" fill="none" stroke="url(#ring${u})" stroke-width="8"/>
      <circle cx="100" cy="70" r="36" fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="1"/>
      <circle cx="100" cy="70" r="28" fill="none" stroke="#555" stroke-width="2" opacity="0.5"/>
      <rect x="94" y="106" width="12" height="22" fill="url(#ring${u})" rx="2"/>
      <rect x="20" y="128" width="160" height="300" rx="18" fill="url(#tagLight${u})"/>
      <circle cx="100" cy="148" r="10" fill="${dark}"/>
      <rect x="32" y="180" width="136" height="232" rx="10" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>
      <image href="${url}" x="40" y="210" width="120" height="180" preserveAspectRatio="xMidYMid meet"/>
      <rect x="20" y="128" width="160" height="40" rx="18" fill="rgba(255,255,255,0.4)"/>
    </g>

    <!-- Ground shadow -->
    <ellipse cx="400" cy="700" rx="280" ry="20" fill="rgba(0,0,0,0.6)"/>
  </svg>`;
}

function tote(logoSvg: string, identity: BrandIdentity): string {
  const bg = identity.palette[4]?.hex ?? "#F5F5F4";
  const primary = identity.palette[0]?.hex ?? "#111";
  const url = logoDataUrl(logoSvg);
  const u = uid();

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
    <defs>
      <radialGradient id="bg${u}" cx="0.5" cy="0.5" r="0.8">
        <stop offset="0%" stop-color="${bg}"/>
        <stop offset="100%" stop-color="#c8c8c4"/>
      </radialGradient>
      <linearGradient id="bag${u}" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="${primary}" stop-opacity="0.92"/>
        <stop offset="50%" stop-color="${primary}"/>
        <stop offset="100%" stop-color="${primary}" stop-opacity="0.78"/>
      </linearGradient>
      <pattern id="fabric${u}" width="3" height="3" patternUnits="userSpaceOnUse">
        <rect width="3" height="3" fill="transparent"/>
        <path d="M 0 0 L 3 3 M 0 3 L 3 0" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
      </pattern>
      <filter id="sh${u}" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="16"/>
        <feOffset dy="18"/>
        <feComponentTransfer><feFuncA type="linear" slope="0.35"/></feComponentTransfer>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect width="800" height="800" fill="url(#bg${u})"/>

    <g filter="url(#sh${u})">
      <!-- Handles (behind) -->
      <path d="M 280 200 C 280 80, 520 80, 520 200" fill="none" stroke="${primary}" stroke-width="14" stroke-linecap="round"/>
      <path d="M 280 200 C 280 80, 520 80, 520 200" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3" stroke-linecap="round"/>

      <!-- Bag body -->
      <path d="M 200 220
               L 600 220
               L 640 720
               L 160 720 Z"
            fill="url(#bag${u})"/>
      <path d="M 200 220 L 600 220 L 640 720 L 160 720 Z" fill="url(#fabric${u})"/>

      <!-- Handle attachment (front) -->
      <rect x="270" y="210" width="20" height="30" rx="2" fill="${primary}" opacity="0.8"/>
      <rect x="510" y="210" width="20" height="30" rx="2" fill="${primary}" opacity="0.8"/>

      <!-- Stitching around top -->
      <path d="M 200 230 L 600 230" stroke="rgba(255,255,255,0.15)" stroke-width="1" stroke-dasharray="4 3"/>

      <!-- Fabric shadows / folds -->
      <path d="M 200 220 L 210 720" stroke="rgba(0,0,0,0.15)" stroke-width="2" fill="none"/>
      <path d="M 600 220 L 590 720" stroke="rgba(0,0,0,0.15)" stroke-width="2" fill="none"/>
      <path d="M 340 280 Q 360 500, 330 700" stroke="rgba(0,0,0,0.08)" stroke-width="1.5" fill="none"/>
      <path d="M 470 280 Q 450 500, 480 700" stroke="rgba(0,0,0,0.08)" stroke-width="1.5" fill="none"/>
    </g>

    <!-- Logo -->
    <image href="${url}" x="270" y="380" width="260" height="160" preserveAspectRatio="xMidYMid meet"/>

    <!-- Ground shadow -->
    <ellipse cx="400" cy="750" rx="260" ry="15" fill="rgba(0,0,0,0.25)"/>
  </svg>`;
}

function phone(logoSvg: string, identity: BrandIdentity): string {
  const primary = identity.palette[0]?.hex ?? "#111";
  const url = logoDataUrl(logoSvg);
  const u = uid();

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
    <defs>
      <linearGradient id="bg${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2a2a2e"/>
        <stop offset="100%" stop-color="#0d0d10"/>
      </linearGradient>
      <linearGradient id="phoneBody${u}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#2c2c30"/>
        <stop offset="50%" stop-color="#1a1a1d"/>
        <stop offset="100%" stop-color="#0a0a0c"/>
      </linearGradient>
      <linearGradient id="screen${u}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${primary}"/>
        <stop offset="100%" stop-color="${primary}" stop-opacity="0.88"/>
      </linearGradient>
      <linearGradient id="glass${u}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="rgba(255,255,255,0.12)"/>
        <stop offset="50%" stop-color="rgba(255,255,255,0)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0.05)"/>
      </linearGradient>
      <filter id="sh${u}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="22"/>
        <feOffset dy="24"/>
        <feComponentTransfer><feFuncA type="linear" slope="0.6"/></feComponentTransfer>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect width="800" height="800" fill="url(#bg${u})"/>

    <g transform="translate(260 80) rotate(-4)" filter="url(#sh${u})">
      <!-- Body -->
      <rect x="0" y="0" width="280" height="600" rx="52" fill="url(#phoneBody${u})"/>
      <!-- Inner bezel -->
      <rect x="10" y="10" width="260" height="580" rx="46" fill="#050506"/>
      <!-- Screen -->
      <rect x="16" y="16" width="248" height="568" rx="42" fill="url(#screen${u})"/>
      <!-- Glass reflection -->
      <rect x="16" y="16" width="248" height="568" rx="42" fill="url(#glass${u})"/>
      <!-- Dynamic island -->
      <rect x="102" y="30" width="76" height="22" rx="11" fill="#050506"/>
      <!-- Side button -->
      <rect x="278" y="160" width="4" height="60" rx="2" fill="#0a0a0c"/>
      <rect x="-2" y="140" width="4" height="40" rx="2" fill="#0a0a0c"/>
      <rect x="-2" y="200" width="4" height="70" rx="2" fill="#0a0a0c"/>
      <!-- Logo -->
      <image href="${url}" x="40" y="200" width="200" height="220" preserveAspectRatio="xMidYMid meet"/>
      <!-- Home indicator -->
      <rect x="100" y="560" width="80" height="5" rx="2.5" fill="rgba(255,255,255,0.55)"/>
    </g>

    <!-- Floor reflection -->
    <ellipse cx="400" cy="750" rx="260" ry="15" fill="rgba(0,0,0,0.5)"/>
  </svg>`;
}

function storefront(logoSvg: string, identity: BrandIdentity): string {
  const primary = identity.palette[0]?.hex ?? "#111";
  const dark = identity.palette[3]?.hex ?? "#18181B";
  const light = identity.palette[4]?.hex ?? "#FAFAF9";
  const url = logoDataUrl(logoSvg);
  const u = uid();

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="100%" height="100%">
    <defs>
      <linearGradient id="sky${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1a1a1d"/>
        <stop offset="100%" stop-color="#050507"/>
      </linearGradient>
      <linearGradient id="wall${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${light}"/>
        <stop offset="100%" stop-color="#b8b8b4"/>
      </linearGradient>
      <linearGradient id="sign${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${primary}"/>
        <stop offset="100%" stop-color="${primary}" stop-opacity="0.78"/>
      </linearGradient>
      <radialGradient id="light${u}" cx="0.5" cy="0.2" r="0.6">
        <stop offset="0%" stop-color="rgba(255,240,200,0.25)"/>
        <stop offset="100%" stop-color="rgba(255,240,200,0)"/>
      </radialGradient>
      <filter id="signSh${u}" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
        <feOffset dy="12"/>
        <feComponentTransfer><feFuncA type="linear" slope="0.5"/></feComponentTransfer>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="glow${u}">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <!-- Sky -->
    <rect width="900" height="380" fill="url(#sky${u})"/>
    <!-- Wall (warm-lit building facade) -->
    <rect x="60" y="90" width="780" height="330" fill="url(#wall${u})"/>
    <!-- Wall texture lines (bricks) -->
    <g opacity="0.08">
      <line x1="60" y1="140" x2="840" y2="140" stroke="#000" stroke-width="1"/>
      <line x1="60" y1="190" x2="840" y2="190" stroke="#000" stroke-width="1"/>
      <line x1="60" y1="240" x2="840" y2="240" stroke="#000" stroke-width="1"/>
      <line x1="60" y1="290" x2="840" y2="290" stroke="#000" stroke-width="1"/>
      <line x1="60" y1="340" x2="840" y2="340" stroke="#000" stroke-width="1"/>
    </g>

    <!-- Door frame -->
    <rect x="120" y="180" width="140" height="240" fill="${dark}" opacity="0.25"/>
    <rect x="130" y="190" width="120" height="230" fill="${dark}" opacity="0.5"/>
    <!-- Window -->
    <rect x="640" y="200" width="180" height="140" fill="${dark}" opacity="0.35"/>
    <rect x="650" y="210" width="160" height="120" fill="rgba(255,230,180,0.15)"/>

    <!-- Sign mounts -->
    <rect x="410" y="100" width="6" height="30" fill="#666"/>
    <rect x="486" y="100" width="6" height="30" fill="#666"/>

    <!-- Sign -->
    <g filter="url(#signSh${u})">
      <rect x="310" y="130" width="280" height="120" fill="url(#sign${u})" rx="2"/>
      <!-- Sign trim -->
      <rect x="310" y="130" width="280" height="4" fill="rgba(255,255,255,0.2)"/>
      <rect x="310" y="246" width="280" height="4" fill="rgba(0,0,0,0.3)"/>
      <!-- Logo -->
      <image href="${url}" x="340" y="145" width="220" height="90" preserveAspectRatio="xMidYMid meet"/>
    </g>

    <!-- Warm spotlight glow on sign -->
    <rect x="250" y="80" width="400" height="250" fill="url(#light${u})"/>

    <!-- Floor -->
    <rect y="380" width="900" height="220" fill="${dark}"/>
    <!-- Floor reflection -->
    <rect x="310" y="380" width="280" height="40" fill="${primary}" opacity="0.08"/>

    <!-- Floor shadow under sign -->
    <ellipse cx="450" cy="460" rx="220" ry="10" fill="rgba(0,0,0,0.7)"/>
  </svg>`;
}

export function generateMockups(
  logoSvg: string,
  identity: BrandIdentity
): Mockup[] {
  return [
    { id: "business-card", name: "Kartu Nama", svg: businessCard(logoSvg, identity) },
    { id: "laptop", name: "Website / Laptop", svg: laptop(logoSvg, identity) },
    { id: "tshirt", name: "T-Shirt", svg: tshirt(logoSvg, identity) },
    { id: "keychain", name: "Gantungan Kunci", svg: keychain(logoSvg, identity) },
    { id: "tote", name: "Tote Bag", svg: tote(logoSvg, identity) },
    { id: "phone", name: "Mobile App", svg: phone(logoSvg, identity) },
    { id: "storefront", name: "Signage Toko", svg: storefront(logoSvg, identity) },
  ];
}
