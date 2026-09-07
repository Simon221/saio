import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const svc = await db.service.findUnique({ where: { id } });
  if (!svc?.redirectUrl) {
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  }
  db.service.update({ where: { id }, data: { clicks: { increment: 1 } } }).catch(() => {});
  return NextResponse.redirect(svc.redirectUrl);
}
