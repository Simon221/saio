import Link from "next/link";
import { getPage, getSectors, mediaUrl } from "@/lib/content";
import { SectorIcon, ArrowRight, CheckBadge, ATOUT_ICONS } from "@/lib/icons";
import AdSlot from "@/components/site/AdSlot";

type Kpi = { value: string; label: string };
type Atout = { title: string; body: string };
type HomeData = {
  hero: { badge: string; title: string; text: string; imageAlt: string; imageId?: string | null };
  invest: {
    eyebrow: string;
    title: string;
    sub: string;
    kpis: Kpi[];
    atouts: Atout[];
    gsma: { tag: string; body: string; mini: { value: string; label: string }[] };
  };
};

export default async function HomePage() {
  const [page, sectors] = await Promise.all([getPage("home"), getSectors()]);
  const d = (page?.data as HomeData) ?? null;
  const hero = d?.hero;
  const inv = d?.invest;
  const heroUrl = await mediaUrl(hero?.imageId);

  return (
    <>
      <section className="page active">
        <div className="wrap">
          <div className="home-hero">
            <div className="hh-text">
              <span className="badge">
                <CheckBadge /> {hero?.badge}
              </span>
              <h1>{hero?.title}</h1>
              <p>{hero?.text}</p>
            </div>
            <div className="hh-img">
              {heroUrl && <img src={heroUrl} alt={hero?.imageAlt || ""} />}
            </div>
          </div>

          <div className="modrow-wrap">
            <div className="modrow">
              {sectors.map((s) => (
                <Link className="modcard" href={`/secteur/${s.slug}`} key={s.id}>
                  <span className="modic" style={{ background: s.iconBg }}>
                    <SectorIcon iconKey={s.iconKey} />
                  </span>
                  <span className="modlab">{s.name}</span>
                  <span className="modsub">{s.subtitle}</span>
                </Link>
              ))}
            </div>
          </div>

          {inv && (
            <section className="invest">
              <div className="inv-head">
                <p className="eyebrow">{inv.eyebrow}</p>
                <h2>{inv.title}</h2>
                <p className="inv-sub">{inv.sub}</p>
              </div>

              <div className="kpi-row">
                {inv.kpis?.map((k, i) => (
                  <div className="kpi" key={i}>
                    <div className="kpin">{k.value}</div>
                    <p>{k.label}</p>
                  </div>
                ))}
              </div>

              <div className="atout-grid">
                {inv.atouts?.map((a, i) => (
                  <div className="atout" key={i}>
                    <span className="ai">{ATOUT_ICONS[i % ATOUT_ICONS.length]}</span>
                    <h3>{a.title}</h3>
                    <p>{a.body}</p>
                  </div>
                ))}
              </div>

              {inv.gsma?.tag && (
                <div className="gsma">
                  <div className="gsma-tag">{inv.gsma.tag}</div>
                  <div className="gsma-body">
                    <p>{inv.gsma.body}</p>
                    <div className="gsma-mini">
                      {inv.gsma.mini?.map((m, i) => (
                        <div key={i}>
                          <b>{m.value}</b>
                          <span>{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="inv-cta">
                <Link className="cta" href="/contact">
                  Intégrer la plateforme
                </Link>
                <Link className="linkline" href="/briques">
                  Explorer les services <ArrowRight />
                </Link>
              </div>
            </section>
          )}
        </div>
      </section>

      <AdSlot placement="home-mid" />
    </>
  );
}
