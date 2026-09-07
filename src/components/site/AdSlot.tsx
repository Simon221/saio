import { getActiveAds } from "@/lib/content";
import { db } from "@/lib/db";

export default async function AdSlot({ placement }: { placement: string }) {
  const ads = await getActiveAds(placement);
  if (ads.length === 0) return null;

  // Comptage d'affichage (non bloquant)
  db.ad
    .updateMany({ where: { id: { in: ads.map((a) => a.id) } }, data: { impressions: { increment: 1 } } })
    .catch(() => {});

  return (
    <div className="wrap">
      {ads.map((ad) => {
        const src = ad.image?.url || ad.imageUrl;
        return (
          <div className="ad-slot" key={ad.id}>
            <div className="ad-tag">Publicité</div>
            <a href={`/go/ad/${ad.id}`} target="_blank" rel="noopener sponsored">
              {src ? (
                <img src={src} alt={ad.title} />
              ) : (
                <span className="ad-fallback">
                  <b>{ad.title}</b>
                  <span className="linkline">Découvrir →</span>
                </span>
              )}
            </a>
          </div>
        );
      })}
    </div>
  );
}
