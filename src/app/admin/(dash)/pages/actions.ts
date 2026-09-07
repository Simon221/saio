"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser, audit } from "@/lib/adminAction";
import { str, nullable, jsonField } from "@/lib/forms";

function j<T>(fd: FormData, key: string, fallback: T): T {
  return jsonField<T>(fd, key, fallback)[0];
}

function buildData(slug: string, fd: FormData): Record<string, unknown> {
  switch (slug) {
    case "home":
      return {
        slug: "home",
        hero: {
          badge: str(fd, "hero_badge"),
          title: str(fd, "hero_title"),
          text: str(fd, "hero_text"),
          imageAlt: str(fd, "hero_imageAlt"),
          imageId: nullable(fd, "hero_imageId"),
        },
        invest: {
          eyebrow: str(fd, "inv_eyebrow"),
          title: str(fd, "inv_title"),
          sub: str(fd, "inv_sub"),
          kpis: j<{ value: string; label: string }[]>(fd, "kpis", []),
          atouts: j<{ title: string; body: string }[]>(fd, "atouts", []),
          gsma: {
            tag: str(fd, "gsma_tag"),
            body: str(fd, "gsma_body"),
            mini: j<{ value: string; label: string }[]>(fd, "gsma_mini", []),
          },
        },
      };
    case "esenegal":
      return {
        slug: "esenegal",
        backLabel: str(fd, "backLabel"),
        title: str(fd, "es_title"),
        logo: str(fd, "logo"),
        ctaTitle: str(fd, "ctaTitle"),
        ctaText: str(fd, "ctaText"),
        ctaPill: str(fd, "ctaPill"),
        lead: str(fd, "lead"),
        ctaImageId: nullable(fd, "ctaImageId"),
        statsImageId: nullable(fd, "statsImageId"),
        stats: j<{ value: string; label: string; variant?: string }[]>(fd, "stats", []),
      };
    case "faits":
      return { timeline: j<{ date: string; title: string; body: string }[]>(fd, "timeline", []) };
    case "vision":
      return {
        pillars: j<{ n: string; title: string; body: string }[]>(fd, "pillars", []),
        note: str(fd, "note"),
      };
    case "contact":
      return {
        fields: j<{ label: string; placeholder: string }[]>(fd, "fields", []),
        info: j<{ title: string; body: string }[]>(fd, "info", []),
      };
    default:
      return {};
  }
}

export async function savePage(fd: FormData) {
  const user = await requireUser();
  const slug = str(fd, "slug");
  const existing = await db.page.findUnique({ where: { slug } });
  const data = buildData(slug, fd);
  const finalData = slug === "briques" ? (existing?.data ?? {}) : data;

  await db.page.update({
    where: { slug },
    data: {
      title: str(fd, "title"),
      eyebrow: str(fd, "eyebrow"),
      intro: str(fd, "intro"),
      data: finalData as object,
    },
  });
  await audit(user, "update", "page", slug, `Page éditoriale modifiée : ${slug}`);
  revalidatePath("/", "layout");
  redirect("/admin/pages");
}
