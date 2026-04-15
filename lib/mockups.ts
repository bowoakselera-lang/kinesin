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
      name: "T-Shirt",
      photo: UNSPLASH("1521572163474-6864f9cf17ab"),
      credit: "Unsplash",
      overlays: [
        {
          x: 38,
          y: 38,
          w: 24,
          h: 18,
          blendMode: "multiply",
          opacity: 0.95,
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
          x: 32,
          y: 28,
          w: 36,
          h: 22,
          bgColor: light,
          bgRadius: 4,
          opacity: 0.97,
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
          x: 36,
          y: 32,
          w: 28,
          h: 32,
          bgColor: primary,
          bgRadius: 18,
          opacity: 0.95,
        },
      ],
    },
    {
      id: "business-card",
      name: "Kartu Nama",
      photo: UNSPLASH("1606293926075-91d2c1c44b96"),
      credit: "Unsplash",
      overlays: [
        {
          x: 22,
          y: 32,
          w: 28,
          h: 18,
          bgColor: light,
          bgRadius: 6,
          rotate: -4,
        },
      ],
    },
    {
      id: "tote",
      name: "Tote Bag",
      photo: UNSPLASH("1544816155-12df9643f363"),
      credit: "Unsplash",
      overlays: [
        {
          x: 36,
          y: 42,
          w: 28,
          h: 20,
          blendMode: "multiply",
          opacity: 0.92,
        },
      ],
    },
    {
      id: "mug",
      name: "Mug Kopi",
      photo: UNSPLASH("1509042239860-f550ce710b93"),
      credit: "Unsplash",
      overlays: [
        {
          x: 38,
          y: 40,
          w: 22,
          h: 18,
          blendMode: "multiply",
          opacity: 0.85,
        },
      ],
    },
    {
      id: "storefront",
      name: "Signage Toko",
      photo: UNSPLASH("1554118811-1e0d58224f24"),
      credit: "Unsplash",
      overlays: [
        {
          x: 30,
          y: 18,
          w: 40,
          h: 14,
          bgColor: primary,
          bgRadius: 4,
          opacity: 0.95,
        },
      ],
    },
  ];
}
