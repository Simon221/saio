"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, audit } from "@/lib/adminAction";
import { saveSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { str, jsonField } from "@/lib/forms";

export async function saveSiteSettings(fd: FormData) {
  const admin = await requireAdmin();
  const [navLinks] = jsonField<{ label: string; href: string }[]>(fd, "navLinks", DEFAULT_SETTINGS.navLinks);
  const [footerLinks] = jsonField<{ label: string; href: string }[]>(fd, "footerLinks", DEFAULT_SETTINGS.footerLinks);

  await saveSettings({
    brandName: str(fd, "brandName") || DEFAULT_SETTINGS.brandName,
    brandTagline: str(fd, "brandTagline") || DEFAULT_SETTINGS.brandTagline,
    navLinks: navLinks.filter((l) => l.label && l.href),
    ctaLabel: str(fd, "ctaLabel") || DEFAULT_SETTINGS.ctaLabel,
    ctaHref: str(fd, "ctaHref") || DEFAULT_SETTINGS.ctaHref,
    footerLinks: footerLinks.filter((l) => l.label && l.href),
    footerLeft: str(fd, "footerLeft"),
    footerRight: str(fd, "footerRight"),
    contactRecipient: str(fd, "contactRecipient"),
  });
  await audit(admin, "update", "settings", "site", "Paramètres du site modifiés");
  revalidatePath("/", "layout");
  redirect("/admin/settings");
}
