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
          x: 43,
          y: 40,
          w: 14,
          h: 10,
          blendMode: "multiply",
          opacity: 0.92,
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
    {
      id: "business-card",
      name: "Kartu Nama",
      photo: UNSPLASH("1606293926075-91d2c1c44b96"),
      credit: "Unsplash",
      overlays: [
        {
          x: 28,
          y: 38,
          w: 22,
          h: 14,
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
          x: 41,
          y: 46,
          w: 18,
          h: 14,
          blendMode: "multiply",
          opacity: 0.9,
        },
      ],
    },
    {
      id: "storefront",
      name: "Signage Toko",
      photo: UNSPLASH("1567521464027-f127ff144326"),
      credit: "Unsplash",
      overlays: [
        {
          x: 35,
          y: 22,
          w: 30,
          h: 12,
          bgColor: primary,
          bgRadius: 3,
          opacity: 0.95,
        },
      ],
    },
  ];
}
