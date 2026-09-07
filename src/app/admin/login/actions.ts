"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";
import { logAction } from "@/lib/audit";
import type { ActionState } from "@/lib/forms";
import { str } from "@/lib/forms";

export async function loginAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const email = str(fd, "email").toLowerCase();
  const password = str(fd, "password");
  const next = str(fd, "next") || "/admin";

  if (!email || !password) return { error: "Renseignez votre e-mail et votre mot de passe." };

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.active || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Identifiants invalides." };
  }

  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await createSession({ id: user.id, email: user.email, name: user.name, role: user.role });
  await logAction({ id: user.id, email: user.email, name: user.name, role: user.role }, "login", "user", user.id, "Connexion au backoffice");

  redirect(next.startsWith("/admin") ? next : "/admin");
}
