import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import UserForm from "../UserForm";
import { updateUser, deleteUser } from "../actions";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireAdmin();
  const { id } = await params;
  const user = await db.user.findUnique({ where: { id } });
  if (!user) notFound();
  const isSelf = user.id === me.id;

  return (
    <>
      <div className="adm-top">
        <h1>{user.name}</h1>
        {!isSelf && <DeleteButton action={deleteUser} id={user.id} />}
      </div>
      <div className="adm-card">
        <UserForm user={user} isSelf={isSelf} action={updateUser} />
      </div>
    </>
  );
}
