export type BrandBrief = {
  brandName: string;
  industry: string;
  targetAudience: string;
  vision: string;
  mission: string;
  personality: string[];
};

export type ColorItem = {
  name: string;
  hex: string;
  role: string;
};

export type TypographyItem = {
  role: "heading" | "body";
  fontFamily: string;
  googleFontUrl: string;
  rationale: string;
};

export type BrandIdentity = {
  tagline: string;
  essence: string;
  palette: ColorItem[];
  typography: TypographyItem[];
  toneOfVoice: {
    do: string[];
    dont: string[];
  };
  rationale: string;
};

export type MockupOverlayState = {
  x: number;
  y: number;
  w: number;
  h: number;
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
};

export type BrandProject = {
  id: string;
  createdAt: number;
  brief: BrandBrief;
  identity: BrandIdentity;
  customLogoSvg?: string;
  customLogoName?: string;
  mockupOverlays?: Record<string, MockupOverlayState>;
};
