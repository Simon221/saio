import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  structure: z.string().trim().min(2).max(200),
  contact: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(200),
  brique: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(5).max(5000),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Merci de vérifier les champs du formulaire." }, { status: 422 });
  }
  await db.contactSubmission.create({ data: parsed.data });
  return NextResponse.json({ ok: true });
}
