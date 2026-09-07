import Link from "next/link";
import { getPage, mediaUrl } from "@/lib/content";
import { ArrowRight } from "@/lib/icons";

type EsData = {
  backLabel?: string;
  title?: string;
  logo?: string;
  ctaTitle?: string;
  ctaText?: string;
  ctaPill?: string;
  lead?: string;
  stats?: { value: string; label: string; variant?: string }[];
  ctaImageId?: string | null;
  statsImageId?: string | null;
};

export default async function ESenegalPage() {
  const page = await getPage("esenegal");
  const d = (page?.data as EsData) ?? {};
  const [ctaImg, statsImg] = await Promise.all([
    mediaUrl(d.ctaImageId),
    mediaUrl(d.statsImageId),
  ]);
  const stats = d.stats ?? [];

  return (
    <section className="page active">
      <div className="wrap">
        <Link className="mnav-home" href="/secteur/egov">
          {d.backLabel || "‹ e-Gouvernement"}
        </Link>

        <div className="es-head">
          <h1>{d.title}</h1>
          <div className="es-logo">{d.logo || "e-senegal"}</div>
        </div>

        <div className="es-cta">
          <div
            className="ph"
            style={ctaImg ? { backgroundImage: `url('${ctaImg}')` } : undefined}
          />
          <div className="body">
            <h2>{d.ctaTitle}</h2>
            <p>{d.ctaText}</p>
            <Link className="pill" href="/contact">
              <span className="dot">
                <ArrowRight />
              </span>{" "}
              {d.ctaPill || "En savoir plus"}
            </Link>
          </div>
        </div>

        {d.lead && <p className="es-lead">{d.lead}</p>}

        <div className="es-stats">
          <div
            className="ph"
            style={statsImg ? { backgroundImage: `url('${statsImg}')` } : undefined}
          />
          {stats.map((st, i) => (
            <div className={`stat${st.variant === "blue" ? " blue" : ""}`} key={i}>
              <div className="big">{st.value}</div>
              <p>{st.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
