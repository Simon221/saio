import "server-only";
import { requireUser, requireAdmin, type SessionUser } from "./auth";
import { logAction } from "./audit";

export { requireUser, requireAdmin };

export async function withUser<T>(fn: (user: SessionUser) => Promise<T>): Promise<T> {
  const user = await requireUser();
  return fn(user);
}

export async function audit(
  user: SessionUser | null,
  action: "create" | "update" | "delete",
  entity: string,
  id: string | null,
  summary: string,
) {
  await logAction(user, action, entity, id, summary);
}
