import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AuditPage() {
  await requireAdmin();
  const rows = await db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 300 });

  return (
    <>
      <div className="adm-top">
        <h1>Journal d’activité</h1>
      </div>
      <table className="adm-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Acteur</th>
            <th>Action</th>
            <th>Objet</th>
            <th>Détail</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="hint" style={{ whiteSpace: "nowrap" }}>
                {r.createdAt.toLocaleString("fr-FR")}
              </td>
              <td>{r.actorName}</td>
              <td>
                <code>{r.action}</code>
              </td>
              <td>
                {r.entity}
                {r.entityId ? ` · ${r.entityId.slice(0, 8)}` : ""}
              </td>
              <td>{r.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
