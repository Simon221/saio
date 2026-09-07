import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { listMediaItems } from "@/lib/media";
import SectorForm from "../SectorForm";
import { updateSector, deleteSector } from "../actions";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function EditSectorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [sector, media] = await Promise.all([
    db.sector.findUnique({ where: { id }, include: { _count: { select: { services: true } } } }),
    listMediaItems("image"),
  ]);
  if (!sector) notFound();

  return (
    <>
      <div className="adm-top">
        <h1>{sector.name}</h1>
        <div className="adm-actions">
          <Link href={`/secteur/${sector.slug}`} target="_blank" className="adm-btn ghost sm">
            Voir sur le site
          </Link>
          {sector._count.services === 0 && <DeleteButton action={deleteSector} id={sector.id} />}
        </div>
      </div>
      {sector._count.services > 0 && (
        <div className="adm-msg" style={{ background: "#FEF3C7", color: "#92600C" }}>
          Ce secteur contient {sector._count.services} service(s). Déplacez ou supprimez-les avant de pouvoir le supprimer.
        </div>
      )}
      <div className="adm-card">
        <SectorForm sector={sector} media={media} action={updateSector} />
      </div>
    </>
  );
}
