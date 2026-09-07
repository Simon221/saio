import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export default async function UsersPage() {
  const me = await requireAdmin();
  const users = await db.user.findMany({ orderBy: [{ role: "asc" }, { createdAt: "asc" }] });

  return (
    <>
      <div className="adm-top">
        <h1>Utilisateurs</h1>
        <Link href="/admin/users/new" className="adm-btn">
          + Nouvel utilisateur
        </Link>
      </div>

      <table className="adm-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>E-mail</th>
            <th>Rôle</th>
            <th>Dernière connexion</th>
            <th>Statut</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                <Link className="adm-link" href={`/admin/users/${u.id}`}>
                  {u.name}
                </Link>
                {u.id === me.id && <span className="hint"> (vous)</span>}
              </td>
              <td>{u.email}</td>
              <td>
                <span className={`adm-badge ${u.role === "ADMIN" ? "admin" : "off"}`}>
                  {u.role === "ADMIN" ? "Admin" : "Éditeur"}
                </span>
              </td>
              <td className="hint">{u.lastLoginAt ? u.lastLoginAt.toLocaleString("fr-FR") : "jamais"}</td>
              <td>
                <span className={`adm-badge ${u.active ? "on" : "off"}`}>{u.active ? "Actif" : "Inactif"}</span>
              </td>
              <td style={{ textAlign: "right" }}>
                <Link href={`/admin/users/${u.id}`} className="adm-btn ghost sm">
                  Éditer
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
