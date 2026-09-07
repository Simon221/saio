import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { logoutAction } from "./actions";
import AdminNav from "@/components/admin/AdminNav";
import { SubmitButton } from "@/components/admin/SubmitButton";

export const dynamic = "force-dynamic";

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="adm">
      <aside className="adm-side">
        <Link href="/admin" className="adm-brand">
          SAIO<small>BACKOFFICE</small>
        </Link>
        <AdminNav isAdmin={user.role === "ADMIN"} />
        <div style={{ marginTop: "auto", paddingTop: 18 }}>
          <div style={{ fontSize: 12, color: "#8A8D96", padding: "0 12px 8px" }}>
            {user.name}
            <br />
            {user.email}
          </div>
          <div style={{ display: "flex", gap: 8, padding: "0 12px" }}>
            <Link href="/" className="adm-btn ghost sm" target="_blank">
              Voir le site
            </Link>
            <form action={logoutAction}>
              <SubmitButton className="adm-btn ghost sm">Déconnexion</SubmitButton>
            </form>
          </div>
        </div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
