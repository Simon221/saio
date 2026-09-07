"use server";

import { revalidatePath } from "next/cache";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { db } from "@/lib/db";
import { requireUser, audit } from "@/lib/adminAction";
import { str } from "@/lib/forms";

export async function updateAlt(fd: FormData) {
  const user = await requireUser();
  const id = str(fd, "id");
  await db.media.update({ where: { id }, data: { alt: str(fd, "alt") } });
  await audit(user, "update", "media", id, "Texte alternatif modifié");
  revalidatePath("/admin/media");
}

export async function deleteMedia(fd: FormData) {
  const user = await requireUser();
  const id = str(fd, "id");
  const [asHero, asLogo, asAd] = await Promise.all([
    db.sector.count({ where: { heroImageId: id } }),
    db.service.count({ where: { logoImageId: id } }),
    db.ad.count({ where: { imageId: id } }),
  ]);
  if (asHero + asLogo + asAd > 0) {
    // Référencé : on ne supprime pas
    return;
  }
  const m = await db.media.findUnique({ where: { id } });
  await db.media.delete({ where: { id } });
  if (m?.url?.startsWith("/uploads/")) {
    unlink(join(process.cwd(), "public", m.url)).catch(() => {});
  }
  await audit(user, "delete", "media", id, `Média supprimé : ${m?.filename ?? id}`);
  revalidatePath("/admin/media");
}
