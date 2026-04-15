import { NextResponse } from "next/server";
import type { BrandBrief } from "@/lib/types";
import { generateBrandIdentity } from "@/lib/generator";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const brief = (await req.json()) as BrandBrief;
    const identity = generateBrandIdentity(brief);
    return NextResponse.json({ identity });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
