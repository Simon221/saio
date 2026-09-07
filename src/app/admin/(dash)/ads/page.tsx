import Link from "next/link";
import { db } from "@/lib/db";
import { toggleAd } from "./actions";

export default async function AdsPage() {
  const ads = await db.ad.findMany({
    orderBy: [{ active: "desc" }, { position: "asc" }, { createdAt: "desc" }],
    include: { image: true },
  });

  return (
    <>
      <div className="adm-top">
        <h1>Publicités</h1>
        <Link href="/admin/ads/new" className="adm-btn">
          + Nouvelle publicité
        </Link>
      </div>

      <table className="adm-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Emplacement</th>
            <th>Fenêtre</th>
            <th>Impr.</th>
            <th>Clics</th>
            <th>CTR</th>
            <th>Statut</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ads.map((a) => {
            const ctr = a.impressions ? ((a.clicks / a.impressions) * 100).toFixed(1) + " %" : "—";
            const win =
              a.startsAt || a.endsAt
                ? `${a.startsAt?.toLocaleDateString("fr-FR") ?? "…"} → ${a.endsAt?.toLocaleDateString("fr-FR") ?? "…"}`
                : "permanente";
            return (
              <tr key={a.id}>
                <td>
                  <Link className="adm-link" href={`/admin/ads/${a.id}`}>
                    {a.title}
                  </Link>
                </td>
                <td>
                  <code>{a.placement}</code>
                </td>
                <td className="hint">{win}</td>
                <td>{a.impressions}</td>
                <td>{a.clicks}</td>
                <td>{ctr}</td>
                <td>
                  <span className={`adm-badge ${a.active ? "on" : "off"}`}>{a.active ? "Active" : "Inactive"}</span>
                </td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <form action={toggleAd} style={{ display: "inline" }}>
                    <input type="hidden" name="id" value={a.id} />
                    <button className="adm-btn ghost sm" type="submit">
                      {a.active ? "Désactiver" : "Activer"}
                    </button>
                  </form>{" "}
                  <Link href={`/admin/ads/${a.id}`} className="adm-btn ghost sm">
                    Éditer
                  </Link>
                </td>
              </tr>
            );
          })}
          {ads.length === 0 && (
            <tr>
              <td colSpan={8} className="hint">
                Aucune publicité pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
