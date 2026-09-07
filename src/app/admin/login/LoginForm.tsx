"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(loginAction, {});

  return (
    <div className="adm-login">
      <form className="box" action={formAction}>
        <div className="adm-brand" style={{ padding: "0 0 18px", color: "#191A1E" }}>
          SAIO<small style={{ color: "#6C6F76" }}>BACKOFFICE</small>
        </div>
        <h1 style={{ fontSize: 18, margin: "0 0 16px" }}>Connexion</h1>

        {state.error && <div className="adm-msg err">{state.error}</div>}

        <input type="hidden" name="next" value={next} />
        <div className="adm-form" style={{ gap: 12 }}>
          <div className="adm-field">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" autoComplete="username" required />
          </div>
          <div className="adm-field">
            <label htmlFor="password">Mot de passe</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          <SubmitButton>Se connecter</SubmitButton>
        </div>
      </form>
    </div>
  );
}
