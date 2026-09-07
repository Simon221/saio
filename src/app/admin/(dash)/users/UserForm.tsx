import Link from "next/link";
import type { User } from "@prisma/client";
import { TextField, SelectField, CheckField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

export default function UserForm({
  user,
  isSelf,
  action,
}: {
  user?: User | null;
  isSelf?: boolean;
  action: (fd: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action} className="adm-form">
      {user && <input type="hidden" name="id" value={user.id} />}

      <div className="row">
        <TextField label="Nom" name="name" defaultValue={user?.name} required />
        <TextField label="E-mail" name="email" type="email" defaultValue={user?.email} required />
      </div>

      <div className="row">
        <SelectField
          label="Rôle"
          name="role"
          defaultValue={user?.role ?? "EDITOR"}
          options={[
            { value: "EDITOR", label: "Éditeur (publie du contenu)" },
            { value: "ADMIN", label: "Administrateur (accès complet)" },
          ]}
          hint={isSelf ? "Vous ne pouvez pas modifier votre propre rôle." : undefined}
        />
        <TextField
          label={user ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
          name="password"
          type="password"
          required={!user}
          hint="8 caractères minimum"
        />
      </div>

      <CheckField
        label="Compte actif"
        name="active"
        defaultChecked={user?.active ?? true}
        hint={isSelf ? "Vous ne pouvez pas désactiver votre propre compte." : undefined}
      />

      <div className="adm-actions">
        <SubmitButton>{user ? "Enregistrer" : "Créer l’utilisateur"}</SubmitButton>
        <Link href="/admin/users" className="adm-btn ghost">
          Annuler
        </Link>
      </div>
    </form>
  );
}
