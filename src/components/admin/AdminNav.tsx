"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string };

const GROUPS: { title: string; items: Item[]; adminOnly?: boolean }[] = [
  {
    title: "Contenu",
    items: [
      { href: "/admin", label: "Tableau de bord" },
      { href: "/admin/sectors", label: "Secteurs / briques" },
      { href: "/admin/services", label: "Services / sites" },
      { href: "/admin/pages", label: "Pages éditoriales" },
      { href: "/admin/media", label: "Médiathèque" },
    ],
  },
  {
    title: "Diffusion",
    items: [
      { href: "/admin/ads", label: "Publicités" },
      { href: "/admin/redirects", label: "Redirections" },
      { href: "/admin/submissions", label: "Demandes de contact" },
    ],
  },
  {
    title: "Administration",
    adminOnly: true,
    items: [
      { href: "/admin/users", label: "Utilisateurs" },
      { href: "/admin/settings", label: "Paramètres du site" },
      { href: "/admin/audit", label: "Journal d’activité" },
    ],
  },
];

export default function AdminNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const on = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav className="adm-nav">
      {GROUPS.filter((g) => !g.adminOnly || isAdmin).map((g) => (
        <div key={g.title}>
          <div className="sep">{g.title}</div>
          {g.items.map((it) => (
            <Link key={it.href} href={it.href} className={on(it.href) ? "on" : ""}>
              {it.label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
