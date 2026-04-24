import type { BrandIdentity } from "./types";

export type Overlay = {
  x: number; // % from left
  y: number; // % from top
  w: number; // % width
  h: number; // % height
  rotate?: number; // degrees
  blendMode?: "normal" | "multiply" | "overlay" | "screen" | "darken";
  opacity?: number;
  bgColor?: string; // optional colored backdrop behind the logo (e.g. business card)
  bgRadius?: number; // border radius in px for backdrop
};

export type MockupScene = {
  id: string;
  name: string;
  photo: string;
  credit?: string;
  overlays: Overlay[];
};

const UNSPLASH = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=85&auto=format&fit=crop`;

export function generateMockups(
  identity: BrandIdentity
): MockupScene[] {
  const primary = identity.palette[0]?.hex ?? "#111";
  const light = identity.palette[4]?.hex ?? "#FAFAF9";

  return [
    {
      id: "tshirt",
      name: "T-Shirt & Cap",
      photo: UNSPLASH("1588117305388-c2631a279f82"),
      credit: "Unsplash",
      overlays: [
        {
          x: 40,
          y: 6,
          w: 10,
          h: 7,
          blendMode: "multiply",
          opacity: 0.85,
        },
      ],
    },
    {
      id: "laptop",
      name: "Website / Laptop",
      photo: UNSPLASH("1496181133206-80ce9b88a853"),
      credit: "Unsplash",
      overlays: [
        {
          x: 39,
          y: 32,
          w: 22,
          h: 14,
          bgColor: light,
          bgRadius: 3,
          opacity: 0.95,
        },
      ],
    },
    {
      id: "phone",
      name: "Mobile App",
      photo: UNSPLASH("1592899677977-9c10ca588bbd"),
      credit: "Unsplash",
      overlays: [
        {
          x: 40,
          y: 38,
          w: 20,
          h: 22,
          bgColor: primary,
          bgRadius: 14,
          opacity: 0.95,
        },
      ],
    },
  ];
}
