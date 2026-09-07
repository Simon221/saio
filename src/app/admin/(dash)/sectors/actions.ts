"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser, audit } from "@/lib/adminAction";
import { str, bool, int, nullable, jsonField, slugify } from "@/lib/forms";

type Stat = { value: string; label: string; variant?: string };

function readForm(fd: FormData) {
  const name = str(fd, "name");
  const slug = slugify(str(fd, "slug") || name);
  const [stats] = jsonField<Stat[]>(fd, "stats", []);
  return {
    name,
    slug,
    subtitle: str(fd, "subtitle"),
    lead: str(fd, "lead"),
    introTitle: str(fd, "introTitle"),
    introText: str(fd, "introText"),
    heroAlt: str(fd, "heroAlt"),
    heroImageId: nullable(fd, "heroImageId"),
    iconKey: str(fd, "iconKey") || "gov",
    iconBg: str(fd, "iconBg") || "#C9CEF6",
    accent: str(fd, "accent") || "#1B44E4",
    tint: str(fd, "tint") || "#E7EBFB",
    stats: stats.filter((s) => s.value || s.label),
    position: int(fd, "position", 0),
    published: bool(fd, "published"),
  };
}

export async function createSector(fd: FormData) {
  const user = await requireUser();
  const data = readForm(fd);
  if (!data.name || !data.slug) return;
  const s = await db.sector.create({ data });
  await audit(user, "create", "sector", s.id, `Secteur créé : ${s.name}`);
  revalidatePath("/", "layout");
  redirect("/admin/sectors");
}

export async function updateSector(fd: FormData) {
  const user = await requireUser();
  const id = str(fd, "id");
  const data = readForm(fd);
  const s = await db.sector.update({ where: { id }, data });
  await audit(user, "update", "sector", s.id, `Secteur modifié : ${s.name}`);
  revalidatePath("/", "layout");
  redirect("/admin/sectors");
}

export async function deleteSector(fd: FormData) {
  const user = await requireUser();
  const id = str(fd, "id");
  const s = await db.sector.delete({ where: { id } });
  await audit(user, "delete", "sector", id, `Secteur supprimé : ${s.name}`);
  revalidatePath("/", "layout");
  redirect("/admin/sectors");
}
