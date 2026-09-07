import Link from "next/link";
import { db } from "@/lib/db";

const LABELS: Record<string, string> = {
  home: "Accueil",
  esenegal: "e-Sénégal",
  briques: "SAIO building blocks",
  faits: "Faits marquants",
  vision: "SAIO vision",
  contact: "Contacts",
};

export default async function PagesListPage() {
  const pages = await db.page.findMany({ orderBy: { slug: "asc" } });

  return (
    <>
      <div className="adm-top">
        <h1>Pages éditoriales</h1>
      </div>
      <table className="adm-table">
        <thead>
          <tr>
            <th>Page</th>
            <th>Slug</th>
            <th>Dernière modification</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pages.map((p) => (
            <tr key={p.id}>
              <td>
                <Link className="adm-link" href={`/admin/pages/${p.slug}`}>
                  {LABELS[p.slug] ?? p.title}
                </Link>
              </td>
              <td>
                <code>{p.slug}</code>
              </td>
              <td className="hint">{p.updatedAt.toLocaleString("fr-FR")}</td>
              <td style={{ textAlign: "right" }}>
                <Link href={`/admin/pages/${p.slug}`} className="adm-btn ghost sm">
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
