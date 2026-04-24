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

export function generateMockups(
  _identity: BrandIdentity
): MockupScene[] {
  void _identity;
  return [
    {
      id: "tshirt",
      name: "T-Shirt",
      photo: "/mockup-baju-1.png",
      overlays: [
        {
          x: 35,
          y: 35,
          w: 18,
          h: 14,
          blendMode: "multiply",
          opacity: 0.9,
        },
      ],
    },
    {
      id: "laptop",
      name: "Website Hero",
      photo: "/mockup-ke-2.png",
      overlays: [
        {
          x: 9,
          y: 35,
          w: 24,
          h: 30,
          opacity: 1,
        },
      ],
    },
    {
      id: "phone",
      name: "Plang Toko",
      photo: "/mockup-plang.png",
      overlays: [
        {
          x: 24,
          y: 40,
          w: 34,
          h: 20,
          opacity: 1,
        },
      ],
    },
  ];
}
