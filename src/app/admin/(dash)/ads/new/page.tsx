import { listMediaItems } from "@/lib/media";
import { knownPlacements } from "@/lib/placements";
import AdForm from "../AdForm";
import { createAd } from "../actions";

export default async function NewAdPage() {
  const [media, placements] = await Promise.all([listMediaItems("image"), knownPlacements()]);
  return (
    <>
      <div className="adm-top">
        <h1>Nouvelle publicité</h1>
      </div>
      <div className="adm-card">
        <AdForm media={media} placements={placements} action={createAd} />
      </div>
    </>
  );
}
