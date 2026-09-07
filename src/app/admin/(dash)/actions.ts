"use server";

import { redirect } from "next/navigation";
import { destroySession, getCurrentUser } from "@/lib/auth";
import { logAction } from "@/lib/audit";

export async function logoutAction() {
  const user = await getCurrentUser();
  await logAction(user, "logout", "user", user?.id ?? null, "Déconnexion");
  await destroySession();
  redirect("/admin/login");
}
