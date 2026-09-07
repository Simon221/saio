import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { listMediaItems } from "@/lib/media";
import ServiceForm from "../ServiceForm";
import { createService } from "../actions";

export default async function NewServicePage() {
  const [sectors, media] = await Promise.all([
    db.sector.findMany({ orderBy: { position: "asc" }, select: { id: true, name: true } }),
    listMediaItems("image"),
  ]);
  if (sectors.length === 0) redirect("/admin/sectors/new");

  return (
    <>
      <div className="adm-top">
        <h1>Nouveau service</h1>
      </div>
      <div className="adm-card">
        <ServiceForm sectors={sectors} media={media} action={createService} />
      </div>
    </>
  );
}
