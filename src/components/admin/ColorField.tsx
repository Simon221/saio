"use client";

import { useState } from "react";

export default function ColorField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
}) {
  const [val, setVal] = useState(defaultValue || "");
  const valid = /^#[0-9a-fA-F]{6}$/.test(val);
  return (
    <div className="adm-field">
      <label htmlFor={name}>{label}</label>
      <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="color"
          value={valid ? val : "#6C2BD9"}
          onChange={(e) => setVal(e.target.value)}
          style={{ width: 44, height: 38, padding: 2, border: "1px solid var(--adm-line)", borderRadius: 8 }}
        />
        <input
          id={name}
          name={name}
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="#RRGGBB"
        />
      </span>
    </div>
  );
}
