import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <>
      <SiteNav
        brandName={s.brandName}
        brandTagline={s.brandTagline}
        links={s.navLinks}
        ctaLabel={s.ctaLabel}
        ctaHref={s.ctaHref}
      />
      <main>{children}</main>
      <SiteFooter
        brandName={s.brandName}
        brandTagline={s.brandTagline}
        links={s.footerLinks}
        left={s.footerLeft}
        right={s.footerRight}
      />
    </>
  );
}
