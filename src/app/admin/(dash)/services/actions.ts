"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ServiceStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { requireUser, audit } from "@/lib/adminAction";
import { str, bool, int, nullable, jsonField, slugify } from "@/lib/forms";

function readForm(fd: FormData) {
  const name = str(fd, "name");
  const sectorId = str(fd, "sectorId");
  const slug = slugify(str(fd, "slug") || name);
  const [rawPoints] = jsonField<{ text: string }[]>(fd, "keyPoints", []);
  const keyPoints = rawPoints.map((p) => p.text).filter(Boolean);
  const status = (str(fd, "status") || "ACTIVE") as ServiceStatus;
  return {
    sectorId,
    slug,
    name,
    monogram: str(fd, "monogram"),
    cardText: str(fd, "cardText"),
    tagline: str(fd, "tagline"),
    about: str(fd, "about"),
    gradientFrom: str(fd, "gradientFrom") || "#1B44E4",
    gradientTo: str(fd, "gradientTo") || "#122F9F",
    redirectUrl: nullable(fd, "redirectUrl"),
    ctaLabel: nullable(fd, "ctaLabel"),
    linkPage: nullable(fd, "linkPage"),
    status,
    highlighted: bool(fd, "highlighted"),
    keyPoints,
    logoImageId: nullable(fd, "logoImageId"),
    position: int(fd, "position", 0),
    published: bool(fd, "published"),
  };
}

export async function createService(fd: FormData) {
  const user = await requireUser();
  const data = readForm(fd);
  if (!data.name || !data.slug || !data.sectorId) return;
  const s = await db.service.create({ data: { ...data, createdById: user.id } });
  await audit(user, "create", "service", s.id, `Service créé : ${s.name}`);
  revalidatePath("/", "layout");
  redirect("/admin/services");
}

export async function updateService(fd: FormData) {
  const user = await requireUser();
  const id = str(fd, "id");
  const data = readForm(fd);
  const s = await db.service.update({ where: { id }, data });
  await audit(user, "update", "service", s.id, `Service modifié : ${s.name}`);
  revalidatePath("/", "layout");
  redirect("/admin/services");
}

export async function deleteService(fd: FormData) {
  const user = await requireUser();
  const id = str(fd, "id");
  const s = await db.service.delete({ where: { id } });
  await audit(user, "delete", "service", id, `Service supprimé : ${s.name}`);
  revalidatePath("/", "layout");
  redirect("/admin/services");
}

export async function togglePublish(fd: FormData) {
  const user = await requireUser();
  const id = str(fd, "id");
  const svc = await db.service.findUnique({ where: { id } });
  if (!svc) return;
  await db.service.update({ where: { id }, data: { published: !svc.published } });
  await audit(user, "update", "service", id, `${svc.published ? "Dépublié" : "Publié"} : ${svc.name}`);
  revalidatePath("/", "layout");
  revalidatePath("/admin/services");
}
