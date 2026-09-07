"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/adminAction";
import { str } from "@/lib/forms";

export async function setStatus(fd: FormData) {
  await requireUser();
  const id = str(fd, "id");
  const status = str(fd, "status");
  await db.contactSubmission.update({ where: { id }, data: { status } });
  revalidatePath("/admin/submissions");
}

export async function removeSubmission(fd: FormData) {
  await requireUser();
  await db.contactSubmission.delete({ where: { id: str(fd, "id") } });
  revalidatePath("/admin/submissions");
}
