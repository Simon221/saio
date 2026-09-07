import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await db.ad.findUnique({ where: { id } });
  const home = new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
  if (!ad?.linkUrl) return NextResponse.redirect(home);
  db.ad.update({ where: { id }, data: { clicks: { increment: 1 } } }).catch(() => {});
  return NextResponse.redirect(ad.linkUrl);
}
