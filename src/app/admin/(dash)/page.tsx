import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();
  const [sectors, services, activeServices, ads, activeAds, media, submissions, newSubmissions, users, recent] =
    await Promise.all([
      db.sector.count(),
      db.service.count(),
      db.service.count({ where: { published: true, status: "ACTIVE" } }),
      db.ad.count(),
      db.ad.count({ where: { active: true } }),
      db.media.count(),
      db.contactSubmission.count(),
      db.contactSubmission.count({ where: { status: "new" } }),
      db.user.count(),
      db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 12 }),
    ]);

  const topServices = await db.service.findMany({
    orderBy: { clicks: "desc" },
    take: 6,
    where: { clicks: { gt: 0 } },
    include: { sector: true },
  });

  const kpis = [
    { n: sectors, l: "Secteurs" },
    { n: services, l: "Services", sub: `${activeServices} actifs` },
    { n: activeAds, l: "Publicités actives", sub: `${ads} au total` },
    { n: media, l: "Médias" },
    { n: newSubmissions, l: "Demandes non lues", sub: `${submissions} au total` },
    { n: users, l: "Utilisateurs" },
  ];

  return (
    <>
      <div className="adm-top">
        <h1>Bonjour, {user.name.split(" ")[0]}</h1>
        <div className="adm-actions">
          <Link href="/admin/services/new" className="adm-btn">
            + Nouveau service
          </Link>
        </div>
      </div>

      <div className="adm-grid cols-3" style={{ marginBottom: 24 }}>
        {kpis.map((k) => (
          <div className="adm-kpi" key={k.l}>
            <div className="n">{k.n}</div>
            <div className="l">
              {k.l}
              {k.sub ? ` · ${k.sub}` : ""}
            </div>
          </div>
        ))}
      </div>

      <div className="adm-grid cols-2">
        <div className="adm-card">
          <h2 style={{ fontSize: 16, marginTop: 0 }}>Services les plus cliqués</h2>
          {topServices.length === 0 ? (
            <p className="hint">Aucun clic enregistré pour le moment.</p>
          ) : (
            <table className="adm-table">
              <tbody>
                {topServices.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <Link className="adm-link" href={`/admin/services/${s.id}`}>
                        {s.name}
                      </Link>
                      <div className="hint">{s.sector.name}</div>
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>{s.clicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="adm-card">
          <h2 style={{ fontSize: 16, marginTop: 0 }}>Activité récente</h2>
          <table className="adm-table">
            <tbody>
              {recent.map((a) => (
                <tr key={a.id}>
                  <td>
                    {a.summary || `${a.action} ${a.entity}`}
                    <div className="hint">
                      {a.actorName} · {a.createdAt.toLocaleString("fr-FR")}
                    </div>
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td className="hint">Aucune activité.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
