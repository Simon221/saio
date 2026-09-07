import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Garde légère : redirige vers /admin/login si aucun cookie de session.
 * La vérification cryptographique + le contrôle du rôle se font côté page
 * (requireUser / requireAdmin), ce middleware ne fait qu'un premier filtre.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const hasSession = req.cookies.has("saio_session");
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
