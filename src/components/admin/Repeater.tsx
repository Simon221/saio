"use client";

import { useState } from "react";

export type RepeaterField = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number";
  placeholder?: string;
};

type Row = Record<string, string | number>;

export default function Repeater({
  name,
  label,
  fields,
  initial,
  addLabel = "Ajouter un élément",
}: {
  name: string;
  label: string;
  fields: RepeaterField[];
  initial: Row[];
  addLabel?: string;
}) {
  const [rows, setRows] = useState<Row[]>(initial ?? []);

  const update = (i: number, key: string, value: string) => {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)));
  };
  const add = () => setRows((r) => [...r, Object.fromEntries(fields.map((f) => [f.key, ""]))]);
  const remove = (i: number) => setRows((r) => r.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    setRows((r) => {
      const j = i + dir;
      if (j < 0 || j >= r.length) return r;
      const copy = [...r];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  };

  return (
    <div className="adm-field">
      <label>{label}</label>
      <input type="hidden" name={name} value={JSON.stringify(rows)} readOnly />
      <div className="adm-repeat">
        {rows.map((row, i) => (
          <div className="item" key={i}>
            <div className="grip">
              <span>#{i + 1}</span>
              <span style={{ display: "flex", gap: 6 }}>
                <button type="button" className="adm-btn ghost sm" onClick={() => move(i, -1)}>
                  ↑
                </button>
                <button type="button" className="adm-btn ghost sm" onClick={() => move(i, 1)}>
                  ↓
                </button>
                <button type="button" className="adm-btn danger sm" onClick={() => remove(i)}>
                  ✕
                </button>
              </span>
            </div>
            {fields.map((f) => (
              <div className="adm-field" key={f.key}>
                <label>{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea
                    rows={3}
                    value={String(row[f.key] ?? "")}
                    placeholder={f.placeholder}
                    onChange={(e) => update(i, f.key, e.target.value)}
                  />
                ) : (
                  <input
                    type={f.type === "number" ? "number" : "text"}
                    value={String(row[f.key] ?? "")}
                    placeholder={f.placeholder}
                    onChange={(e) => update(i, f.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button type="button" className="adm-btn ghost sm" onClick={add} style={{ marginTop: 10 }}>
        + {addLabel}
      </button>
    </div>
  );
}
