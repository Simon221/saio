import SectorForm from "../SectorForm";
import { createSector } from "../actions";
import { listMediaItems } from "@/lib/media";

export default async function NewSectorPage() {
  const media = await listMediaItems("image");
  return (
    <>
      <div className="adm-top">
        <h1>Nouveau secteur</h1>
      </div>
      <div className="adm-card">
        <SectorForm media={media} action={createSector} />
      </div>
    </>
  );
}
