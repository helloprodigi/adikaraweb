"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { subscribeToScroll } from "@/components/scrollTicker";

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

  // Resetting the scroll on navigation is handled centrally by SmoothScroll,
  // which owns the glide. A second scrollTo here would only fight it.

  useEffect(() => {
    const progressInner = progressRef.current;

    // The scrollbar progress bar needs the full page height. Reading it every
    // frame forced a synchronous layout on each scroll tick, so it is cached
    // and refreshed only when the page actually changes height.
    let maxScroll = 0;
    const measure = () => {
      maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
    };

    measure();
    const sizeObserver = new ResizeObserver(measure);
    sizeObserver.observe(document.body);

    const update = (y: number) => {
      if (maxScroll <= 0) measure();

      const progress = maxScroll > 0 ? Math.min(y / maxScroll, 1) : 0;

      if (progressInner) {
        const rounded = Math.round(progress * 1000) / 1000;
        progressInner.style.transform = `scaleX(${rounded})`;
      }

      const nextScrolled = y > 24;
      if (nextScrolled !== scrolledRef.current) {
        scrolledRef.current = nextScrolled;
        setIsScrolled(nextScrolled);
      }
    };

    const unsubscribe = subscribeToScroll(update);

    return () => {
      unsubscribe();
      sizeObserver.disconnect();
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
            src="/navbar/adikara-logo.webp"
            alt="Adikara Logo"
            width={286}
            height={72}
            sizes="(max-width: 900px) 130px, 240px"
            priority
            // Mirrors the CSS (.brand img is sized by width) so next/image can
            // see that the aspect ratio is preserved.
            style={{ height: "auto" }}
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
            className="brand-logo"
            src="/navbar/adikara-logo.webp"
            alt="Adikara Logo"
            width={286}
            height={72}
            priority
            sizes="(max-width: 900px) 130px, 240px"
            // Mirrors the CSS (.brand img is sized by width) so next/image can
            // see that the aspect ratio is preserved.
            style={{ height: "auto" }}
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