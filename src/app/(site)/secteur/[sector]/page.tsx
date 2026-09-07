import Link from "next/link";
import { notFound } from "next/navigation";
import { getSectorBySlug } from "@/lib/content";
import { ArrowRight } from "@/lib/icons";
import Chip from "@/components/site/Chip";
import AdSlot from "@/components/site/AdSlot";
import type { Stat } from "@/lib/content";

function serviceHref(sectorSlug: string, svc: { slug: string; linkPage: string | null }) {
  if (svc.linkPage === "esenegal") return "/e-senegal";
  return `/secteur/${sectorSlug}/${svc.slug}`;
}

export default async function SectorPage({
  params,
}: {
  params: Promise<{ sector: string }>;
}) {
  const { sector: slug } = await params;
  const sector = await getSectorBySlug(slug);
  if (!sector) notFound();

  const stats = (sector.stats as Stat[]) ?? [];
  const heroUrl = sector.heroImage?.url;

  return (
    <>
      <section className="page active">
        <div className="wrap">
          <div className="mhero">
            {heroUrl && <img src={heroUrl} alt={sector.heroAlt} />}
            <Link className="hero-back" href="/" aria-label="Accueil" />
          </div>

          {sector.lead && <p className="sector-lead">{sector.lead}</p>}

          {stats.length > 0 && (
            <div className="stats3">
              {stats.map((st, i) => (
                <div className={`stat${st.variant === "blue" ? " blue" : ""}`} key={i}>
                  <div className="big" style={st.color ? { color: st.color } : undefined}>
                    {st.value}
                  </div>
                  <p>{st.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="svc-grid">
            <div className="intro">
              <h2>{sector.introTitle || `Les services ${sector.name}`}</h2>
              {sector.introText && <p>{sector.introText}</p>}
            </div>

            {sector.services.map((v) => {
              const href = serviceHref(sector.slug, v);
              const isSoon = v.status === "SOON";
              return (
                <div className={`svc${v.highlighted ? " hl" : ""}${isSoon ? " soon" : ""}`} key={v.id}>
                  <Chip
                    monogram={v.monogram}
                    tint={sector.tint}
                    accent={sector.accent}
                    logoUrl={v.logoImage?.url}
                  />
                  <div className="svc-body">
                    <h3>
                      {isSoon ? (
                        v.name
                      ) : (
                        <Link className="svc-link" href={href}>
                          {v.name}
                        </Link>
                      )}
                    </h3>
                    <p>{v.cardText}</p>
                  </div>
                  <div className="svc-foot">
                    {isSoon ? (
                      <span className="badge-soon">Bientôt</span>
                    ) : (
                      <Link className="go" href={href} aria-label={`Découvrir ${v.name}`}>
                        <ArrowRight />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mnav">
            <Link className="mnav-home" href="/">
              ‹ Tous les modules
            </Link>
          </div>
        </div>
      </section>

      <AdSlot placement={`sector-${sector.slug}`} />
    </>
  );
}
