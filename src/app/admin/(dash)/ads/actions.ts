"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser, audit } from "@/lib/adminAction";
import { str, bool, int, nullable, dateOrNull } from "@/lib/forms";

function readForm(fd: FormData) {
  return {
    title: str(fd, "title"),
    imageId: nullable(fd, "imageId"),
    imageUrl: str(fd, "imageUrl"),
    linkUrl: str(fd, "linkUrl"),
    placement: str(fd, "placement") || "home-mid",
    active: bool(fd, "active"),
    startsAt: dateOrNull(fd, "startsAt"),
    endsAt: dateOrNull(fd, "endsAt"),
    position: int(fd, "position", 0),
  };
}

export async function createAd(fd: FormData) {
  const user = await requireUser();
  const data = readForm(fd);
  if (!data.title || !data.linkUrl) return;
  const a = await db.ad.create({ data });
  await audit(user, "create", "ad", a.id, `Publicité créée : ${a.title}`);
  revalidatePath("/", "layout");
  redirect("/admin/ads");
}

export async function updateAd(fd: FormData) {
  const user = await requireUser();
  const id = str(fd, "id");
  const a = await db.ad.update({ where: { id }, data: readForm(fd) });
  await audit(user, "update", "ad", a.id, `Publicité modifiée : ${a.title}`);
  revalidatePath("/", "layout");
  redirect("/admin/ads");
}

export async function deleteAd(fd: FormData) {
  const user = await requireUser();
  const id = str(fd, "id");
  const a = await db.ad.delete({ where: { id } });
  await audit(user, "delete", "ad", id, `Publicité supprimée : ${a.title}`);
  revalidatePath("/", "layout");
  redirect("/admin/ads");
}

export async function toggleAd(fd: FormData) {
  const user = await requireUser();
  const id = str(fd, "id");
  const a = await db.ad.findUnique({ where: { id } });
  if (!a) return;
  await db.ad.update({ where: { id }, data: { active: !a.active } });
  await audit(user, "update", "ad", id, `${a.active ? "Désactivée" : "Activée"} : ${a.title}`);
  revalidatePath("/", "layout");
  revalidatePath("/admin/ads");
}
