import { db } from "./db";
import type { SessionUser } from "./auth";

export async function logAction(
  actor: SessionUser | null,
  action: "create" | "update" | "delete" | "login" | "logout",
  entity: string,
  entityId: string | null,
  summary: string,
) {
  try {
    await db.auditLog.create({
      data: {
        userId: actor?.id ?? null,
        actorName: actor?.name ?? "système",
        action,
        entity,
        entityId,
        summary,
      },
    });
  } catch {
    // l'audit ne doit jamais casser une opération métier
  }
}
