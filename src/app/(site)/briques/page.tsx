import Link from "next/link";
import { getPage, getSectors } from "@/lib/content";
import { SectorIcon, ArrowRight } from "@/lib/icons";

export default async function BriquesPage() {
  const [page, sectors] = await Promise.all([getPage("briques"), getSectors()]);

  return (
    <section className="page active">
      <div className="wrap">
        <div className="phead">
          <p className="eyebrow">{page?.eyebrow || "SAIO building blocks"}</p>
          <h1>{page?.title || "Les briques de la plateforme"}</h1>
          {page?.intro && <p>{page.intro}</p>}
        </div>

        <div className="brick-grid">
          {sectors.map((s) => (
            <Link className="brick" href={`/secteur/${s.slug}`} key={s.id}>
              <span className="modic" style={{ background: s.iconBg }}>
                <SectorIcon iconKey={s.iconKey} size={30} />
              </span>
              <h3>{s.name}</h3>
              <p>{s.subtitle}</p>
              <span className="brick-go">
                Explorer <ArrowRight />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
