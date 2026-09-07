import type { CSSProperties } from "react";

export default function Chip({
  monogram,
  tint,
  accent,
  logoUrl,
  className = "",
  big = false,
}: {
  monogram: string;
  tint: string;
  accent: string;
  logoUrl?: string | null;
  className?: string;
  big?: boolean;
}) {
  if (logoUrl) {
    return (
      <span className={`chip ${big ? "bhchip" : ""} ${className}`}>
        <img className="lg" src={logoUrl} alt="" />
      </span>
    );
  }
  return (
    <span
      className={`chip showmono ${big ? "bhchip" : ""} ${className}`}
      style={{ ["--tint" as keyof CSSProperties]: tint } as CSSProperties}
    >
      <span className="mono" style={{ color: accent }}>
        {monogram}
      </span>
    </span>
  );
}
