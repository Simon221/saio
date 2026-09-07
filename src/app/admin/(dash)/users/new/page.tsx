import { requireAdmin } from "@/lib/auth";
import UserForm from "../UserForm";
import { createUser } from "../actions";

export default async function NewUserPage() {
  await requireAdmin();
  return (
    <>
      <div className="adm-top">
        <h1>Nouvel utilisateur</h1>
      </div>
      <div className="adm-card">
        <UserForm action={createUser} />
      </div>
    </>
  );
}
