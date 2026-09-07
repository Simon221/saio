import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/** Redirections courtes gérées dans le backoffice (modèle Redirect). */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const home = new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
  const source = "/" + slug.replace(/^\/+/, "");
  const r = await db.redirect.findFirst({ where: { source, active: true } });
  if (!r) return NextResponse.redirect(home);
  db.redirect.update({ where: { id: r.id }, data: { hits: { increment: 1 } } }).catch(() => {});
  return NextResponse.redirect(r.target, r.permanent ? 308 : 307);
}
