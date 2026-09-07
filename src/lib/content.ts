import { db } from "./db";

export type Stat = { value: string; label: string; variant?: string; color?: string | null };

export async function getSectors(includeUnpublished = false) {
  return db.sector.findMany({
    where: includeUnpublished ? {} : { published: true },
    orderBy: [{ position: "asc" }, { name: "asc" }],
    include: { heroImage: true },
  });
}

export async function getSectorBySlug(slug: string, includeUnpublished = false) {
  return db.sector.findFirst({
    where: { slug, ...(includeUnpublished ? {} : { published: true }) },
    include: {
      heroImage: true,
      services: {
        where: includeUnpublished ? {} : { published: true },
        orderBy: [{ position: "asc" }, { name: "asc" }],
        include: { logoImage: true },
      },
    },
  });
}

export async function getServiceBySlug(sectorSlug: string, serviceSlug: string) {
  return db.service.findFirst({
    where: { slug: serviceSlug, published: true, sector: { slug: sectorSlug, published: true } },
    include: { sector: true, logoImage: true },
  });
}

export async function getPage(slug: string) {
  return db.page.findUnique({ where: { slug } });
}

export async function mediaUrl(id: string | null | undefined): Promise<string | null> {
  if (!id) return null;
  const m = await db.media.findUnique({ where: { id } });
  return m?.url ?? null;
}

export async function getActiveAds(placement: string) {
  const now = new Date();
  return db.ad.findMany({
    where: {
      placement,
      active: true,
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
      AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
    },
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    include: { image: true },
  });
}
