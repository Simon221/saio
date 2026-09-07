"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UploadButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setBusy(true);
    setErr("");
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j.error || "Échec de l’envoi.");
        break;
      }
    }
    setBusy(false);
    e.target.value = "";
    router.refresh();
  }

  return (
    <span className="adm-actions">
      <label className="adm-btn" style={{ cursor: "pointer" }}>
        {busy ? "Envoi…" : "+ Téléverser"}
        <input type="file" accept="image/*,video/mp4,video/webm" hidden multiple onChange={onChange} disabled={busy} />
      </label>
      {err && <span style={{ color: "#B91C1C", fontSize: 12 }}>{err}</span>}
    </span>
  );
}
