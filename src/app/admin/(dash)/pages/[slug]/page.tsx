import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { listMediaItems } from "@/lib/media";
import PageEditor from "../PageEditor";
import { savePage } from "../actions";

const PREVIEW: Record<string, string> = {
  home: "/",
  esenegal: "/e-senegal",
  briques: "/briques",
  faits: "/faits",
  vision: "/vision",
  contact: "/contact",
};

export default async function EditPagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [page, media] = await Promise.all([
    db.page.findUnique({ where: { slug } }),
    listMediaItems("image"),
  ]);
  if (!page) notFound();

  return (
    <>
      <div className="adm-top">
        <h1>Éditer : {page.title}</h1>
        <Link href={PREVIEW[slug] ?? "/"} target="_blank" className="adm-btn ghost sm">
          Aperçu
        </Link>
      </div>
      <div className="adm-card">
        <PageEditor page={page} media={media} action={savePage} />
      </div>
    </>
  );
}
