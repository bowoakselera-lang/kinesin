import type { BrandIdentity } from "./types";

export type Mockup = {
  id: string;
  name: string;
  svg: string;
};

function logoDataUrl(logoSvg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(logoSvg)}`;
}

function businessCard(logoSvg: string, identity: BrandIdentity): string {
  const primary = identity.palette[0]?.hex ?? "#111";
  const dark = identity.palette[3]?.hex ?? "#18181B";
  const light = identity.palette[4]?.hex ?? "#F5F5F4";
  const logoUrl = logoDataUrl(logoSvg);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${dark}" stop-opacity="1"/>
        <stop offset="100%" stop-color="${primary}" stop-opacity="0.85"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
        <feOffset dx="0" dy="6" result="offsetblur"/>
        <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect width="600" height="400" fill="url(#bgGrad)"/>
    <!-- Front card -->
    <g filter="url(#shadow)">
      <rect x="80" y="90" width="440" height="250" rx="10" fill="${light}"/>
      <image href="${logoUrl}" x="130" y="140" width="340" height="150" preserveAspectRatio="xMidYMid meet"/>
    </g>
    <!-- Bottom bar -->
    <rect x="80" y="325" width="440" height="15" rx="0" fill="${primary}"/>
  </svg>`;
}

function laptop(logoSvg: string, identity: BrandIdentity): string {
  const dark = identity.palette[3]?.hex ?? "#18181B";
  const primary = identity.palette[0]?.hex ?? "#111";
  const accent = identity.palette[4]?.hex ?? "#FAFAF9";
  const logoUrl = logoDataUrl(logoSvg);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
    <rect width="600" height="400" fill="${accent}"/>
    <!-- Laptop screen body -->
    <rect x="100" y="70" width="400" height="240" rx="12" fill="#1a1a1a"/>
    <rect x="115" y="85" width="370" height="210" rx="4" fill="${primary}"/>
    <!-- Logo on screen -->
    <image href="${logoUrl}" x="160" y="115" width="280" height="150" preserveAspectRatio="xMidYMid meet"/>
    <!-- Base -->
    <path d="M 70 310 L 530 310 L 560 340 L 40 340 Z" fill="#2a2a2a"/>
    <rect x="260" y="310" width="80" height="6" fill="#0a0a0a"/>
    <!-- Reflection dots -->
    <circle cx="300" cy="78" r="2" fill="#333"/>
  </svg>`;
}

function tshirt(logoSvg: string, identity: BrandIdentity): string {
  const primary = identity.palette[0]?.hex ?? "#111";
  const bg = identity.palette[4]?.hex ?? "#F5F5F4";
  const logoUrl = logoDataUrl(logoSvg);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <rect width="600" height="600" fill="${bg}"/>
    <!-- T-shirt silhouette -->
    <path d="M 170 140
             L 230 100
             C 250 130, 350 130, 370 100
             L 430 140
             L 480 220
             L 430 260
             L 430 500
             L 170 500
             L 170 260
             L 120 220 Z"
          fill="${primary}"/>
    <!-- Neckline -->
    <path d="M 250 110 C 270 140, 330 140, 350 110" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="3"/>
    <!-- Logo on chest -->
    <image href="${logoUrl}" x="225" y="220" width="150" height="100" preserveAspectRatio="xMidYMid meet"/>
  </svg>`;
}

function keychain(logoSvg: string, identity: BrandIdentity): string {
  const dark = identity.palette[3]?.hex ?? "#18181B";
  const primary = identity.palette[0]?.hex ?? "#111";
  const logoUrl = logoDataUrl(logoSvg);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <rect width="600" height="600" fill="${dark}"/>
    <!-- Keychain 1 (primary color) -->
    <g transform="translate(150 180)">
      <!-- Ring -->
      <circle cx="70" cy="50" r="28" fill="none" stroke="#c0c0c0" stroke-width="5"/>
      <circle cx="70" cy="50" r="22" fill="none" stroke="#a0a0a0" stroke-width="2"/>
      <!-- Attachment -->
      <rect x="65" y="75" width="10" height="30" fill="#b0b0b0"/>
      <!-- Tag -->
      <rect x="10" y="105" width="120" height="200" rx="14" fill="${primary}"/>
      <!-- Hole -->
      <circle cx="70" cy="122" r="8" fill="${dark}"/>
      <!-- Logo -->
      <image href="${logoUrl}" x="25" y="150" width="90" height="140" preserveAspectRatio="xMidYMid meet"/>
    </g>
    <!-- Keychain 2 (inverse) -->
    <g transform="translate(330 180)">
      <circle cx="70" cy="50" r="28" fill="none" stroke="#c0c0c0" stroke-width="5"/>
      <circle cx="70" cy="50" r="22" fill="none" stroke="#a0a0a0" stroke-width="2"/>
      <rect x="65" y="75" width="10" height="30" fill="#b0b0b0"/>
      <rect x="10" y="105" width="120" height="200" rx="14" fill="#fafafa"/>
      <circle cx="70" cy="122" r="8" fill="${dark}"/>
      <image href="${logoUrl}" x="25" y="150" width="90" height="140" preserveAspectRatio="xMidYMid meet"/>
    </g>
  </svg>`;
}

function tote(logoSvg: string, identity: BrandIdentity): string {
  const bg = identity.palette[4]?.hex ?? "#F5F5F4";
  const primary = identity.palette[0]?.hex ?? "#111";
  const logoUrl = logoDataUrl(logoSvg);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <rect width="600" height="600" fill="${bg}"/>
    <!-- Tote bag body -->
    <path d="M 160 180
             L 440 180
             L 470 520
             L 130 520 Z"
          fill="${primary}"/>
    <!-- Handles -->
    <path d="M 220 180 C 220 100, 380 100, 380 180" fill="none" stroke="${primary}" stroke-width="10" stroke-linecap="round"/>
    <!-- Fabric folds -->
    <path d="M 160 180 L 180 520" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>
    <path d="M 440 180 L 420 520" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>
    <!-- Logo -->
    <image href="${logoUrl}" x="210" y="300" width="180" height="120" preserveAspectRatio="xMidYMid meet"/>
  </svg>`;
}

function phone(logoSvg: string, identity: BrandIdentity): string {
  const primary = identity.palette[0]?.hex ?? "#111";
  const bg = identity.palette[4]?.hex ?? "#F5F5F4";
  const logoUrl = logoDataUrl(logoSvg);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <rect width="600" height="600" fill="${bg}"/>
    <!-- Phone body -->
    <rect x="200" y="60" width="200" height="420" rx="36" fill="#1a1a1a"/>
    <rect x="212" y="72" width="176" height="396" rx="26" fill="${primary}"/>
    <!-- Notch -->
    <rect x="270" y="76" width="60" height="12" rx="6" fill="#0a0a0a"/>
    <!-- Logo -->
    <image href="${logoUrl}" x="225" y="180" width="150" height="180" preserveAspectRatio="xMidYMid meet"/>
    <!-- Home indicator -->
    <rect x="265" y="448" width="70" height="4" rx="2" fill="rgba(255,255,255,0.5)"/>
  </svg>`;
}

function storefront(logoSvg: string, identity: BrandIdentity): string {
  const primary = identity.palette[0]?.hex ?? "#111";
  const dark = identity.palette[3]?.hex ?? "#18181B";
  const light = identity.palette[4]?.hex ?? "#FAFAF9";
  const logoUrl = logoDataUrl(logoSvg);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
    <rect width="600" height="400" fill="${dark}"/>
    <!-- Wall -->
    <rect x="0" y="0" width="600" height="260" fill="${light}"/>
    <!-- Sign board -->
    <rect x="120" y="80" width="360" height="120" fill="${primary}"/>
    <!-- Sign mount -->
    <rect x="280" y="60" width="6" height="20" fill="#999"/>
    <rect x="314" y="60" width="6" height="20" fill="#999"/>
    <!-- Logo on sign -->
    <image href="${logoUrl}" x="150" y="95" width="300" height="90" preserveAspectRatio="xMidYMid meet"/>
    <!-- Floor -->
    <rect x="0" y="260" width="600" height="140" fill="${dark}"/>
    <!-- Spotlight glow -->
    <ellipse cx="300" cy="260" rx="220" ry="25" fill="rgba(255,255,255,0.05)"/>
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
