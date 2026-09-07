import Link from "next/link";
import { db } from "@/lib/db";
import { togglePublish } from "./actions";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}) {
  const { sector } = await searchParams;
  const [sectors, services] = await Promise.all([
    db.sector.findMany({ orderBy: { position: "asc" } }),
    db.service.findMany({
      where: sector ? { sector: { slug: sector } } : {},
      orderBy: [{ sector: { position: "asc" } }, { position: "asc" }],
      include: { sector: true },
    }),
  ]);

  return (
    <>
      <div className="adm-top">
        <h1>Services / sites</h1>
        <Link href="/admin/services/new" className="adm-btn">
          + Nouveau service
        </Link>
      </div>

      <div className="adm-actions" style={{ marginBottom: 16 }}>
        <Link href="/admin/services" className={`adm-btn ghost sm ${!sector ? "on" : ""}`}>
          Tous
        </Link>
        {sectors.map((s) => (
          <Link
            key={s.id}
            href={`/admin/services?sector=${s.slug}`}
            className="adm-btn ghost sm"
            style={sector === s.slug ? { borderColor: "var(--violet)", color: "var(--violet)" } : undefined}
          >
            {s.name}
          </Link>
        ))}
      </div>

      <table className="adm-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Secteur</th>
            <th>Redirection</th>
            <th>Clics</th>
            <th>Statut</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id}>
              <td>
                <Link className="adm-link" href={`/admin/services/${s.id}`}>
                  {s.name}
                </Link>
                <div className="hint">
                  <code>{s.slug}</code>
                </div>
              </td>
              <td>{s.sector.name}</td>
              <td>
                {s.redirectUrl ? (
                  <a href={s.redirectUrl} target="_blank" rel="noopener" className="adm-link">
                    {new URL(s.redirectUrl).hostname}
                  </a>
                ) : (
                  <span className="hint">à renseigner</span>
                )}
              </td>
              <td>{s.clicks}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                {s.status === "SOON" && <span className="adm-badge soon">Bientôt</span>}{" "}
                <span className={`adm-badge ${s.published ? "on" : "off"}`}>
                  {s.published ? "Publié" : "Masqué"}
                </span>
              </td>
              <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                <form action={togglePublish} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={s.id} />
                  <button className="adm-btn ghost sm" type="submit">
                    {s.published ? "Masquer" : "Publier"}
                  </button>
                </form>{" "}
                <Link href={`/admin/services/${s.id}`} className="adm-btn ghost sm">
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
