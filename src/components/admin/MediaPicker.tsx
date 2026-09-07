"use client";

import { useState } from "react";

export type MediaItem = { id: string; url: string; filename: string; kind?: string };

export default function MediaPicker({
  name,
  label,
  media,
  defaultValue,
  hint,
}: {
  name: string;
  label: string;
  media: MediaItem[];
  defaultValue?: string | null;
  hint?: string;
}) {
  const [list, setList] = useState<MediaItem[]>(media);
  const [selected, setSelected] = useState<string>(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const current = list.find((m) => m.id === selected);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || "Échec de l'envoi.");
      return;
    }
    const m: MediaItem = await res.json();
    setList((l) => [m, ...l]);
    setSelected(m.id);
  }

  return (
    <div className="adm-field">
      <label>{label}</label>
      <input type="hidden" name={name} value={selected} readOnly />
      {hint && <span className="hint">{hint}</span>}

      <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap", marginTop: 6 }}>
        <div
          style={{
            width: 150,
            height: 100,
            borderRadius: 10,
            border: "1px solid var(--adm-line)",
            background: "#F1F1F2",
            overflow: "hidden",
            display: "grid",
            placeItems: "center",
            fontSize: 11,
            color: "#9A9AA1",
          }}
        >
          {current ? <img src={current.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "Aucune image"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <select value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value="">— Aucune —</option>
            {list.map((m) => (
              <option key={m.id} value={m.id}>
                {m.filename}
              </option>
            ))}
          </select>
          <label className="adm-btn ghost sm" style={{ cursor: "pointer" }}>
            {busy ? "Envoi…" : "Téléverser une image"}
            <input type="file" accept="image/*" hidden onChange={onUpload} disabled={busy} />
          </label>
          {err && <span style={{ color: "#B91C1C", fontSize: 12 }}>{err}</span>}
        </div>
      </div>
    </div>
  );
}
