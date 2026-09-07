import "server-only";

export type ActionState = { ok?: boolean; error?: string; message?: string };

export function str(fd: FormData, key: string, fallback = ""): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : fallback;
}

export function bool(fd: FormData, key: string): boolean {
  const v = fd.get(key);
  return v === "on" || v === "true" || v === "1";
}

export function int(fd: FormData, key: string, fallback = 0): number {
  const n = Number(fd.get(key));
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

export function nullable(fd: FormData, key: string): string | null {
  const v = str(fd, key);
  return v === "" ? null : v;
}

export function dateOrNull(fd: FormData, key: string): Date | null {
  const v = str(fd, key);
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

/** JSON contenu dans un textarea. Renvoie [valeur, erreur]. */
export function jsonField<T>(fd: FormData, key: string, fallback: T): [T, string | null] {
  const raw = str(fd, key);
  if (!raw) return [fallback, null];
  try {
    return [JSON.parse(raw) as T, null];
  } catch {
    return [fallback, `Le champ ${key} n'est pas un JSON valide.`];
  }
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}
