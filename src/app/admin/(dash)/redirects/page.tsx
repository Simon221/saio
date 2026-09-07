import { db } from "@/lib/db";
import { createRedirect, deleteRedirect } from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";

export default async function RedirectsPage() {
  const rows = await db.redirect.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <div className="adm-top">
        <h1>Redirections</h1>
      </div>

      <div className="adm-card" style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 15, marginTop: 0 }}>Nouvelle redirection</h2>
        <form action={createRedirect} className="adm-form" style={{ maxWidth: "none" }}>
          <div className="row">
            <div className="adm-field">
              <label htmlFor="source">Source</label>
              <input id="source" name="source" placeholder="/wave" required />
              <span className="hint">Accessible via /l/&lt;source&gt;. Ex : /l/wave</span>
            </div>
            <div className="adm-field">
              <label htmlFor="target">Cible (URL)</label>
              <input id="target" name="target" type="url" placeholder="https://www.wave.com" required />
            </div>
          </div>
          <div className="adm-field">
            <label htmlFor="note">Note</label>
            <input id="note" name="note" placeholder="Interne" />
          </div>
          <div className="adm-actions">
            <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13 }}>
              <input type="checkbox" name="permanent" defaultChecked /> Permanente (308)
            </label>
            <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13 }}>
              <input type="checkbox" name="active" defaultChecked /> Active
            </label>
            <SubmitButton>Ajouter</SubmitButton>
          </div>
        </form>
      </div>

      <table className="adm-table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Cible</th>
            <th>Type</th>
            <th>Hits</th>
            <th>Statut</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>
                <code>/l{r.source}</code>
                {r.note && <div className="hint">{r.note}</div>}
              </td>
              <td>
                <a href={r.target} target="_blank" rel="noopener" className="adm-link">
                  {r.target}
                </a>
              </td>
              <td>{r.permanent ? "308" : "307"}</td>
              <td>{r.hits}</td>
              <td>
                <span className={`adm-badge ${r.active ? "on" : "off"}`}>{r.active ? "Active" : "Inactive"}</span>
              </td>
              <td style={{ textAlign: "right" }}>
                <form action={deleteRedirect} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={r.id} />
                  <button className="adm-btn danger sm" type="submit">
                    Supprimer
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="hint">
                Aucune redirection.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
