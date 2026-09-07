import { getPage } from "@/lib/content";

type Pillar = { n: string; title: string; body: string };

export default async function VisionPage() {
  const page = await getPage("vision");
  const data = (page?.data as { pillars?: Pillar[]; note?: string }) ?? {};
  const pillars = data.pillars ?? [];

  return (
    <section className="page active">
      <div className="wrap">
        <div className="phead">
          <p className="eyebrow">{page?.eyebrow || "SAIO vision"}</p>
          <h1>{page?.title || "Un État numérique, au service de chaque citoyen"}</h1>
          {page?.intro && <p>{page.intro}</p>}
        </div>

        <div className="pillars">
          {pillars.map((p, i) => (
            <div className="pillar" key={i}>
              <span className="pn">{p.n}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>

        {data.note && <div className="note">{data.note}</div>}
      </div>
    </section>
  );
}
