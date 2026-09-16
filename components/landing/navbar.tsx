import Image from "next/image";

const navigationItems = [
  { label: "Overview", href: "#overview" },
  { label: "Timeline", href: "#timeline" },
  { label: "Competition", href: "#competition" },
  { label: "Team", href: "#team" },
  { label: "Guidebook", href: "#guidebook" },
];

export function Navbar() {
  return (
    <header className="floating-navbar" aria-label="Main navigation">
      <a className="brand" href="#overview" aria-label="Adikara 2026 home">
        <Image
          src="/navbar/adikara-logo.svg"
          alt=""
          width={286}
          height={72}
          priority
        />
      </a>

      <nav className="nav-links">
        {navigationItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <a className="button button-small" href="#register">
        Register Now
      </a>
    </header>
  );
}