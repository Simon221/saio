"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavLink = { label: string; href: string };

export default function SiteNav({
  brandName,
  brandTagline,
  links,
  ctaLabel,
  ctaHref,
}: {
  brandName: string;
  brandTagline: string;
  links: NavLink[];
  ctaLabel: string;
  ctaHref: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isOn = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="nav">
      <div className="nav-in">
        <Link className="brand" href="/">
          {brandName}
          <small>{brandTagline}</small>
        </Link>
        <nav className="nav-links">
          {links.map((l) => (
            <Link key={l.href} href={l.href} data-nav className={isOn(l.href) ? "on" : ""}>
              {l.label}
            </Link>
          ))}
        </nav>
        <Link className="cta" href={ctaHref}>
          {ctaLabel}
        </Link>
        <button className="burger" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#191A1E" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
      <div className={`mm-panel${open ? " open" : ""}`}>
        {links.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link href={ctaHref} onClick={() => setOpen(false)}>
          {ctaLabel}
        </Link>
      </div>
    </header>
  );
}
