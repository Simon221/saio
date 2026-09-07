"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser, audit } from "@/lib/adminAction";
import { str, bool } from "@/lib/forms";

function normSource(s: string) {
  const v = s.trim().replace(/^\/+/, "");
  return "/" + v;
}

export async function createRedirect(fd: FormData) {
  const user = await requireUser();
  const source = normSource(str(fd, "source"));
  const target = str(fd, "target");
  if (source === "/" || !target) return;
  await db.redirect.upsert({
    where: { source },
    create: { source, target, permanent: bool(fd, "permanent"), active: bool(fd, "active"), note: str(fd, "note") },
    update: { target, permanent: bool(fd, "permanent"), active: bool(fd, "active"), note: str(fd, "note") },
  });
  await audit(user, "create", "redirect", source, `Redirection ${source} → ${target}`);
  revalidatePath("/admin/redirects");
  redirect("/admin/redirects");
}

export async function updateRedirect(fd: FormData) {
  const user = await requireUser();
  const id = str(fd, "id");
  await db.redirect.update({
    where: { id },
    data: {
      source: normSource(str(fd, "source")),
      target: str(fd, "target"),
      permanent: bool(fd, "permanent"),
      active: bool(fd, "active"),
      note: str(fd, "note"),
    },
  });
  await audit(user, "update", "redirect", id, `Redirection modifiée`);
  revalidatePath("/admin/redirects");
  redirect("/admin/redirects");
}

export async function deleteRedirect(fd: FormData) {
  const user = await requireUser();
  const id = str(fd, "id");
  const r = await db.redirect.delete({ where: { id } });
  await audit(user, "delete", "redirect", id, `Redirection supprimée : ${r.source}`);
  revalidatePath("/admin/redirects");
}
