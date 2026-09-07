import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

const MAX = 8 * 1024 * 1024; // 8 Mo
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier." }, { status: 400 });
  }
  if (file.size > MAX) {
    return NextResponse.json({ error: "Fichier trop volumineux (max 8 Mo)." }, { status: 413 });
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Format non pris en charge." }, { status: 415 });
  }

  const dir = join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const base = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(join(dir, base), buf);

  const media = await db.media.create({
    data: {
      filename: file.name || base,
      url: `/uploads/${base}`,
      mimeType: file.type,
      size: file.size,
      kind: file.type.startsWith("video/") ? "video" : "image",
      uploadedById: user.id,
    },
  });

  return NextResponse.json(media);
}
