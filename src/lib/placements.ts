import { db } from "./db";

export async function knownPlacements(): Promise<string[]> {
  const [sectors, services] = await Promise.all([
    db.sector.findMany({ select: { slug: true }, orderBy: { position: "asc" } }),
    db.service.findMany({ select: { slug: true }, orderBy: { position: "asc" } }),
  ]);
  return [
    "home-mid",
    ...sectors.map((s) => `sector-${s.slug}`),
    ...services.slice(0, 8).map((s) => `service-${s.slug}`),
  ];
}
