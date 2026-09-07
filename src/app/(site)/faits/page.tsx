import { getPage } from "@/lib/content";

type Item = { date: string; title: string; body: string };

export default async function FaitsPage() {
  const page = await getPage("faits");
  const items = ((page?.data as { timeline?: Item[] })?.timeline ?? []) as Item[];

  return (
    <section className="page active">
      <div className="wrap">
        <div className="phead">
          <p className="eyebrow">{page?.eyebrow || "Faits marquants"}</p>
          <h1>{page?.title || "Le numérique sénégalais en mouvement"}</h1>
          {page?.intro && <p>{page.intro}</p>}
        </div>

        <div className="tl">
          {items.map((it, i) => (
            <div className="tl-item" key={i}>
              <div className="tl-date">{it.date}</div>
              <div className="tl-body">
                <h3>{it.title}</h3>
                <p>{it.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
