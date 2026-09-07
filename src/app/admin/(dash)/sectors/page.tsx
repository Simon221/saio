import Link from "next/link";
import { db } from "@/lib/db";

export default async function SectorsPage() {
  const sectors = await db.sector.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
    include: { _count: { select: { services: true } } },
  });

  return (
    <>
      <div className="adm-top">
        <h1>Secteurs / briques</h1>
        <Link href="/admin/sectors/new" className="adm-btn">
          + Nouveau secteur
        </Link>
      </div>

      <table className="adm-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Slug</th>
            <th>Services</th>
            <th>Position</th>
            <th>Statut</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sectors.map((s) => (
            <tr key={s.id}>
              <td>
                <Link className="adm-link" href={`/admin/sectors/${s.id}`}>
                  {s.name}
                </Link>
                <div className="hint">{s.subtitle}</div>
              </td>
              <td>
                <code>{s.slug}</code>
              </td>
              <td>{s._count.services}</td>
              <td>{s.position}</td>
              <td>
                <span className={`adm-badge ${s.published ? "on" : "off"}`}>
                  {s.published ? "Publié" : "Masqué"}
                </span>
              </td>
              <td style={{ textAlign: "right" }}>
                <Link href={`/admin/sectors/${s.id}`} className="adm-btn ghost sm">
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
