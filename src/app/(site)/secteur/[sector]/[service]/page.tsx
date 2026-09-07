import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/content";
import { ArrowRight } from "@/lib/icons";
import Chip from "@/components/site/Chip";
import AdSlot from "@/components/site/AdSlot";

export default async function ServicePage({
  params,
}: {
  params: Promise<{ sector: string; service: string }>;
}) {
  const { sector, service } = await params;
  const svc = await getServiceBySlug(sector, service);
  if (!svc) notFound();

  const keyPoints = (svc.keyPoints as string[]) ?? [];
  const paragraphs = (svc.about || "").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const ctaLabel = svc.ctaLabel || `Accéder à ${svc.name}`;

  return (
    <>
      <section className="page active">
        <div className="wrap">
          <Link className="mnav-home" href={`/secteur/${svc.sector.slug}`}>
            ‹ {svc.sector.name}
          </Link>

          <div
            className="brand-hero"
            style={{
              background: `linear-gradient(135deg,${svc.gradientFrom} 0%,${svc.gradientTo} 100%)`,
            }}
          >
            <div className="bh-badge">
              <Chip big monogram={svc.monogram} tint={svc.sector.tint} accent={svc.sector.accent} logoUrl={svc.logoImage?.url} />
            </div>
            <h1>{svc.name}</h1>
            <p className="bh-tag2">{svc.tagline}</p>
            <div className="bh-actions">
              {svc.redirectUrl ? (
                <a className="bh-cta" href={`/go/service/${svc.id}`} target="_blank" rel="noopener">
                  {ctaLabel} <ArrowRight />
                </a>
              ) : (
                <span className="bh-cta off">Lien à renseigner</span>
              )}
            </div>
          </div>

          <div className="brand-body">
            <div className="bb-about">
              <h2>À propos</h2>
              {paragraphs.length > 0 ? (
                paragraphs.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p>{svc.tagline}</p>
              )}
              <p className="bb-tag">
                {svc.sector.name} ·{" "}
                <Link href={`/secteur/${svc.sector.slug}`}>voir les autres services</Link>
              </p>
            </div>

            {keyPoints.length > 0 && (
              <div className="bb-side">
                <h3>Points clés</h3>
                <ul className="pts">
                  {keyPoints.map((pt, i) => (
                    <li key={i}>
                      <span className="pdot" style={{ background: svc.sector.accent }} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      <AdSlot placement={`service-${svc.slug}`} />
    </>
  );
}
