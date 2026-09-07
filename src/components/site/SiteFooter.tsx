import Link from "next/link";

export default function SiteFooter({
  brandName,
  brandTagline,
  links,
  left,
  right,
}: {
  brandName: string;
  brandTagline: string;
  links: { label: string; href: string }[];
  left: string;
  right: string;
}) {
  return (
    <footer className="foot">
      <div className="foot-in">
        <Link className="brand" href="/" style={{ color: "#fff" }}>
          {brandName}
          <small>{brandTagline}</small>
        </Link>
        <nav className="foot-links">
          {links.map((l) => (
            <Link key={l.href + l.label} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="foot-base">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </footer>
  );
}
