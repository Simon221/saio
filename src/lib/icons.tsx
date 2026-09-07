import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Icônes de secteur — clé stockée dans Sector.iconKey */
export const SECTOR_ICONS: Record<string, (p: IconProps) => React.ReactNode> = {
  gov: (p) => (
    <Svg {...p}>
      <path d="M12 3 3 8h18L12 3Z" />
      <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8" />
      <path d="M3 21h18" />
    </Svg>
  ),
  edu: (p) => (
    <Svg {...p}>
      <path d="M12 4 2 9l10 5 10-5-10-5Z" />
      <path d="M6 11.5V16c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-4.5" />
      <path d="M22 9v5" />
    </Svg>
  ),
  transport: (p) => (
    <Svg {...p}>
      <rect x="4" y="4" width="16" height="12" rx="2" />
      <path d="M4 11h16" />
      <circle cx="8" cy="18.5" r="1.6" />
      <circle cx="16" cy="18.5" r="1.6" />
      <path d="M7 20h10" />
    </Svg>
  ),
  health: (p) => (
    <Svg {...p}>
      <path d="M4 13h3l2 4 3-9 2 5h6" />
      <path d="M20.5 8.5A4.6 4.6 0 0 0 12 6a4.6 4.6 0 0 0-8.5 2.5" />
    </Svg>
  ),
  commerce: (p) => (
    <Svg {...p}>
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
      <path d="M3 4h2l2.4 12.5A2 2 0 0 0 9.4 18H18l2-8H6.2" />
    </Svg>
  ),
  agri: (p) => (
    <Svg {...p}>
      <path d="M12 21c0-6 0-9 0-12" />
      <path d="M12 12C9 12 6 10 6 6c4 0 6 2 6 6Z" />
      <path d="M12 10c0-3 2-5 6-5 0 4-3 5-6 5Z" />
    </Svg>
  ),
  finance: (p) => (
    <Svg {...p}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 14h4" />
    </Svg>
  ),
};

export const ICON_KEYS = Object.keys(SECTOR_ICONS);

export function SectorIcon({ iconKey, size = 26 }: { iconKey: string; size?: number }) {
  const render = SECTOR_ICONS[iconKey] ?? SECTOR_ICONS.gov;
  return <>{render({ size, stroke: "#2B2B33" })}</>;
}

export function ArrowRight({ size = 18 }: { size?: number }) {
  return (
    <Svg size={size} strokeWidth={2}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </Svg>
  );
}

export function CheckBadge({ size = 15 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#12924F" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" fill="#DCF3E4" stroke="none" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

export const ATOUT_ICONS = [
  <Svg key="0" size={22} strokeWidth={1.8}>
    <path d="M2 9a15 15 0 0 1 20 0" />
    <path d="M5 12.5a10 10 0 0 1 14 0" />
    <path d="M8.5 15.5a5 5 0 0 1 7 0" />
    <circle cx="12" cy="18.6" r="1" />
  </Svg>,
  <Svg key="1" size={22} strokeWidth={1.8}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3.4" />
    <path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22" />
  </Svg>,
  <Svg key="2" size={22} strokeWidth={1.8}>
    <path d="M5 15c-1.6 1.6-2 5-2 5s3.4-.4 5-2" />
    <path d="M14 5c3-3 6-2 6-2s1 3-2 6l-7 7-4-4 7-7Z" />
    <circle cx="14.4" cy="9.6" r="1.3" />
  </Svg>,
  <Svg key="3" size={22} strokeWidth={1.8}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
    <path d="M16 6a3 3 0 0 1 0 6M20.5 19a5 5 0 0 0-4-4.9" />
  </Svg>,
];
