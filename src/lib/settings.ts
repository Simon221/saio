import { db } from "./db";

export type SiteSettings = {
  brandName: string;
  brandTagline: string;
  navLinks: { label: string; href: string }[];
  ctaLabel: string;
  ctaHref: string;
  footerLinks: { label: string; href: string }[];
  footerLeft: string;
  footerRight: string;
  contactRecipient: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: "SAIO",
  brandTagline: "SENEGAL ALL IN ONE",
  navLinks: [
    { label: "Accueil", href: "/" },
    { label: "SAIO building blocks", href: "/briques" },
    { label: "Faits marquants", href: "/faits" },
    { label: "SAIO vision", href: "/vision" },
    { label: "Contacts", href: "/contact" },
  ],
  ctaLabel: "Intégrer la plateforme",
  ctaHref: "/contact",
  footerLinks: [
    { label: "Building blocks", href: "/briques" },
    { label: "e-Sénégal", href: "/e-senegal" },
    { label: "Faits marquants", href: "/faits" },
    { label: "Vision", href: "/vision" },
    { label: "Contacts", href: "/contact" },
  ],
  footerLeft: "Propulsé par l’État du Sénégal",
  footerRight: "Prototype de design · SAIO",
  contactRecipient: "",
};

export async function getSettings(): Promise<SiteSettings> {
  const row = await db.setting.findUnique({ where: { key: "site" } });
  if (!row) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...(row.value as Partial<SiteSettings>) };
}

export async function saveSettings(value: SiteSettings) {
  await db.setting.upsert({
    where: { key: "site" },
    create: { key: "site", value: value as object },
    update: { value: value as object },
  });
}
