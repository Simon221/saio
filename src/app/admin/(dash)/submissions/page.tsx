import { db } from "@/lib/db";
import { setStatus, removeSubmission } from "./actions";

const NEXT: Record<string, { label: string; value: string }> = {
  new: { label: "Marquer comme lu", value: "read" },
  read: { label: "Archiver", value: "archived" },
  archived: { label: "Rouvrir", value: "new" },
};

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const rows = await db.contactSubmission.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  const counts = await db.contactSubmission.groupBy({ by: ["status"], _count: true });
  const countOf = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;

  return (
    <>
      <div className="adm-top">
        <h1>Demandes de contact</h1>
      </div>

      <div className="adm-actions" style={{ marginBottom: 16 }}>
        {[
          { k: "", l: "Toutes" },
          { k: "new", l: `Non lues (${countOf("new")})` },
          { k: "read", l: `Lues (${countOf("read")})` },
          { k: "archived", l: `Archivées (${countOf("archived")})` },
        ].map((f) => (
          <a
            key={f.k}
            href={`/admin/submissions${f.k ? `?status=${f.k}` : ""}`}
            className="adm-btn ghost sm"
            style={status === f.k || (!status && !f.k) ? { borderColor: "var(--violet)", color: "var(--violet)" } : undefined}
          >
            {f.l}
          </a>
        ))}
      </div>

      <div className="adm-grid" style={{ gap: 14 }}>
        {rows.map((r) => (
          <div className="adm-card" key={r.id}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <strong>{r.structure}</strong> — {r.contact}{" "}
                <span className={`adm-badge ${r.status === "new" ? "soon" : "off"}`}>{r.status}</span>
                <div className="hint">
                  <a className="adm-link" href={`mailto:${r.email}`}>
                    {r.email}
                  </a>
                  {r.brique ? ` · ${r.brique}` : ""} · {r.createdAt.toLocaleString("fr-FR")}
                </div>
              </div>
              <div className="adm-actions">
                <form action={setStatus} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value={NEXT[r.status]?.value ?? "read"} />
                  <button className="adm-btn ghost sm" type="submit">
                    {NEXT[r.status]?.label ?? "Marquer lu"}
                  </button>
                </form>
                <form action={removeSubmission} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={r.id} />
                  <button className="adm-btn danger sm" type="submit">
                    Supprimer
                  </button>
                </form>
              </div>
            </div>
            <p style={{ margin: "10px 0 0", fontSize: 14, whiteSpace: "pre-wrap" }}>{r.message}</p>
          </div>
        ))}
        {rows.length === 0 && <p className="hint">Aucune demande.</p>}
      </div>
    </>
  );
}
