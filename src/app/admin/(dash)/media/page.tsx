import { db } from "@/lib/db";
import UploadButton from "@/components/admin/UploadButton";
import { updateAlt, deleteMedia } from "./actions";

export default async function MediaPage() {
  const media = await db.media.findMany({ orderBy: { createdAt: "desc" }, take: 400 });

  const refs = await Promise.all(
    media.map(async (m) => {
      const [h, l, a] = await Promise.all([
        db.sector.count({ where: { heroImageId: m.id } }),
        db.service.count({ where: { logoImageId: m.id } }),
        db.ad.count({ where: { imageId: m.id } }),
      ]);
      return { id: m.id, count: h + l + a };
    }),
  );
  const refMap = new Map(refs.map((r) => [r.id, r.count]));

  return (
    <>
      <div className="adm-top">
        <h1>Médiathèque</h1>
        <UploadButton />
      </div>

      <div className="adm-media-grid">
        {media.map((m) => {
          const used = refMap.get(m.id) ?? 0;
          return (
            <div className="m" key={m.id}>
              {m.kind === "video" ? (
                <video src={m.url} style={{ width: "100%", height: 110, objectFit: "cover", background: "#000" }} />
              ) : (
                <img src={m.url} alt={m.alt} />
              )}
              <div className="meta">
                <div style={{ marginBottom: 6, color: "#191A1E" }}>{m.filename}</div>
                <form action={updateAlt} style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                  <input type="hidden" name="id" value={m.id} />
                  <input
                    name="alt"
                    defaultValue={m.alt}
                    placeholder="Texte alternatif"
                    style={{ flex: 1, fontSize: 11, padding: "4px 6px", border: "1px solid var(--adm-line)", borderRadius: 6 }}
                  />
                  <button className="adm-btn ghost sm" type="submit">
                    OK
                  </button>
                </form>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{(m.size / 1024).toFixed(0)} Ko{used > 0 ? ` · utilisé ×${used}` : ""}</span>
                  {used === 0 && (
                    <form action={deleteMedia}>
                      <input type="hidden" name="id" value={m.id} />
                      <button className="adm-btn danger sm" type="submit">
                        ✕
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {media.length === 0 && <p className="hint">Aucun média. Téléversez une première image.</p>}
      </div>
    </>
  );
}
