"use client";

import { useState } from "react";

type Field = { label: string; placeholder?: string };

const KEYS = ["structure", "contact", "email", "brique", "message"] as const;

export default function ContactForm({ fields }: { fields: Field[] }) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  const f = (i: number, fallback: string) => fields[i]?.label || fallback;
  const p = (i: number, fallback: string) => fields[i]?.placeholder || fallback;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(KEYS.map((k) => [k, String(fd.get(k) || "")]));
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setStatus("ok");
      (e.target as HTMLFormElement).reset();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Une erreur est survenue.");
      setStatus("err");
    }
  }

  if (status === "ok") {
    return (
      <div className="note" style={{ background: "#DCF3E4", borderColor: "#B7E4C7", color: "#12924F" }}>
        Merci, votre demande a bien été envoyée. L’équipe SAIO vous recontactera.
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="c1">{f(0, "Nom de la structure")}</label>
        <input id="c1" name="structure" type="text" required placeholder={p(0, "Votre organisation")} />
      </div>
      <div className="field">
        <label htmlFor="c2">{f(1, "Personne à contacter")}</label>
        <input id="c2" name="contact" type="text" required placeholder={p(1, "Prénom et nom")} />
      </div>
      <div className="field">
        <label htmlFor="c3">{f(2, "E-mail")}</label>
        <input id="c3" name="email" type="email" required placeholder={p(2, "nom@structure.sn")} />
      </div>
      <div className="field">
        <label htmlFor="c4">{f(3, "Brique concernée")}</label>
        <input id="c4" name="brique" type="text" placeholder={p(3, "e-Gouvernement, e-Santé…")} />
      </div>
      <div className="field full">
        <label htmlFor="c5">{f(4, "Votre message")}</label>
        <textarea id="c5" name="message" rows={4} required placeholder={p(4, "Décrivez votre service…")} />
      </div>
      {status === "err" && (
        <div className="field full" style={{ color: "#B91C1C", fontSize: 13 }}>
          {error}
        </div>
      )}
      <button className="cta" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Envoi…" : "Envoyer la demande"}
      </button>
    </form>
  );
}
