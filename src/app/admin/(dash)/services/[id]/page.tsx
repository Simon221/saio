import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { listMediaItems } from "@/lib/media";
import ServiceForm from "../ServiceForm";
import { updateService, deleteService } from "../actions";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [service, sectors, media] = await Promise.all([
    db.service.findUnique({ where: { id }, include: { sector: true } }),
    db.sector.findMany({ orderBy: { position: "asc" }, select: { id: true, name: true } }),
    listMediaItems("image"),
  ]);
  if (!service) notFound();

  return (
    <>
      <div className="adm-top">
        <h1>{service.name}</h1>
        <div className="adm-actions">
          <Link
            href={service.linkPage ? `/${service.linkPage}` : `/secteur/${service.sector.slug}/${service.slug}`}
            target="_blank"
            className="adm-btn ghost sm"
          >
            Voir sur le site
          </Link>
          <DeleteButton action={deleteService} id={service.id} />
        </div>
      </div>
      <div className="adm-card">
        <ServiceForm service={service} sectors={sectors} media={media} action={updateService} />
      </div>
    </>
  );
}
