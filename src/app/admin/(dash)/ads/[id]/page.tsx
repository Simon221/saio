import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { listMediaItems } from "@/lib/media";
import { knownPlacements } from "@/lib/placements";
import AdForm from "../AdForm";
import { updateAd, deleteAd } from "../actions";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function EditAdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [ad, media, placements] = await Promise.all([
    db.ad.findUnique({ where: { id } }),
    listMediaItems("image"),
    knownPlacements(),
  ]);
  if (!ad) notFound();

  return (
    <>
      <div className="adm-top">
        <h1>{ad.title}</h1>
        <DeleteButton action={deleteAd} id={ad.id} />
      </div>
      <div className="adm-card">
        <AdForm ad={ad} media={media} placements={placements} action={updateAd} />
      </div>
    </>
  );
}
