"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin, audit } from "@/lib/adminAction";
import { hashPassword } from "@/lib/auth";
import { str, bool } from "@/lib/forms";

export async function createUser(fd: FormData) {
  const admin = await requireAdmin();
  const email = str(fd, "email").toLowerCase();
  const name = str(fd, "name");
  const password = str(fd, "password");
  const role = (str(fd, "role") || "EDITOR") as Role;
  if (!email || !name || password.length < 8) return;

  const exists = await db.user.findUnique({ where: { email } });
  if (exists) return;

  const u = await db.user.create({
    data: { email, name, role, active: bool(fd, "active"), passwordHash: await hashPassword(password) },
  });
  await audit(admin, "create", "user", u.id, `Utilisateur créé : ${u.email} (${u.role})`);
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUser(fd: FormData) {
  const admin = await requireAdmin();
  const id = str(fd, "id");
  const role = (str(fd, "role") || "EDITOR") as Role;
  const active = bool(fd, "active");
  const password = str(fd, "password");

  // Ne pas se rétrograder / se désactiver soi-même
  const patch: Record<string, unknown> = { name: str(fd, "name"), email: str(fd, "email").toLowerCase() };
  if (id !== admin.id) {
    patch.role = role;
    patch.active = active;
  }
  if (password) {
    if (password.length < 8) return;
    patch.passwordHash = await hashPassword(password);
  }

  // Garder au moins un admin actif
  if (id !== admin.id && (role !== "ADMIN" || !active)) {
    const otherAdmins = await db.user.count({
      where: { role: "ADMIN", active: true, id: { not: id } },
    });
    if (otherAdmins === 0) return;
  }

  const u = await db.user.update({ where: { id }, data: patch });
  await audit(admin, "update", "user", u.id, `Utilisateur modifié : ${u.email}`);
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUser(fd: FormData) {
  const admin = await requireAdmin();
  const id = str(fd, "id");
  if (id === admin.id) return;
  const target = await db.user.findUnique({ where: { id } });
  if (target?.role === "ADMIN") {
    const otherAdmins = await db.user.count({ where: { role: "ADMIN", active: true, id: { not: id } } });
    if (otherAdmins === 0) return;
  }
  await db.user.delete({ where: { id } });
  await audit(admin, "delete", "user", id, `Utilisateur supprimé : ${target?.email ?? id}`);
  revalidatePath("/admin/users");
}
