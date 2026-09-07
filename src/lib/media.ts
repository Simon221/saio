import { db } from "./db";
import type { MediaItem } from "@/components/admin/MediaPicker";

export async function listMediaItems(kind?: "image" | "video"): Promise<MediaItem[]> {
  const rows = await db.media.findMany({
    where: kind ? { kind } : {},
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return rows.map((m) => ({ id: m.id, url: m.url, filename: m.filename, kind: m.kind }));
}
