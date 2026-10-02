"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navigationItems = [
  { label: "Overview", href: "/" },
  { label: "Statistics", href: "/statistics" },
  { label: "Rankings", href: "/rankings" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef(false);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    const progressInner = progressRef.current;

    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(y / max, 1) : 0;

      if (progressInner) {
        progressInner.style.transform = `scaleX(${progress})`;
      }

      const nextScrolled = y > 24;
      if (nextScrolled !== scrolledRef.current) {
        scrolledRef.current = nextScrolled;
        setIsScrolled(nextScrolled);
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <div className="scroll-progress-inner" ref={progressRef} />
      </div>

      <header
        className={`floating-navbar ${isScrolled ? "is-scrolled" : ""}`}
        aria-label="Main navigation"
      >
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          type="button"
        >
          <span className={`hamburger-bar ${isOpen ? "is-open" : ""}`} />
          <span className={`hamburger-bar ${isOpen ? "is-open" : ""}`} />
          <span className={`hamburger-bar ${isOpen ? "is-open" : ""}`} />
        </button>

        <Link className="brand" href="/" aria-label="Adikara 2026 home">
          <Image
            src="/navbar/adikara-logo.svg"
            alt="Adikara Logo"
            width={286}
            height={72}
            priority
          />
        </Link>

        <nav className="nav-links">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "is-active" : ""}
              onClick={handleNavClick}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          className="button button-small nav-register-btn"
          href="https://helloprodigi.pro/PendaftaranAdikara2026"
          target="_blank"
          rel="noopener noreferrer"
        >
          Register Now
        </a>
      </header>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`mobile-sidebar-backdrop ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen(false)}
      />
      <aside className={`mobile-sidebar ${isOpen ? "is-open" : ""}`} aria-label="Mobile navigation">
        <div className="sidebar-header">
          <Image
            src="/navbar/adikara-logo.svg"
            alt="Adikara Logo"
            width={150}
            height={38}
          />
          <button
            className="sidebar-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="sidebar-body">
          <nav className="sidebar-links">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href ? "is-active" : ""}
                onClick={handleNavClick}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <a
            className="button button-small sidebar-register-btn"
            href="https://helloprodigi.pro/PendaftaranAdikara2026"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleNavClick}
          >
            Register Now
          </a>
        </div>
      </aside>
    </>
  );
}