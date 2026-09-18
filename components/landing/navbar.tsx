"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const navigationItems = [
  { label: "Overview", href: "#overview" },
  { label: "Timeline", href: "#timeline" },
  { label: "Competition", href: "#competition" },
  { label: "Team", href: "#myprodigi" },
  { label: "Guidebook", href: "#download-resource" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("#overview");
  const [isScrolled, setIsScrolled] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef(false);
  const activeRef = useRef("#overview");

  const handleNavClick = (href: string) => {
    setActiveItem(href);
    setIsOpen(false);
  };

  useEffect(() => {
    const progressInner = progressRef.current;
    const body = document.body;
    const targets = navigationItems
      .map((item) => ({ href: item.href, el: document.querySelector<HTMLElement>(item.href) }))
      .filter((t) => t.el !== null);

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

      let current = "#overview";
      for (const target of targets) {
        if (target.el && target.el.getBoundingClientRect().top <= 170) {
          current = target.href;
        }
      }
      if (current !== activeRef.current) {
        activeRef.current = current;
        setActiveItem(current);
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

    // Release the scripted hero entrance once it has fully played out so the
    // navbar can slide in/out and the hero can settle into idle motion.
    const idleTimer = setTimeout(() => {
      body.classList.remove("hero-animate");
      body.classList.add("hero-idle");
    }, 6200);

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(idleTimer);
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

        <a className="brand" href="#overview" aria-label="Adikara 2026 home">
          <Image
            src="/navbar/adikara-logo.svg"
            alt="Adikara Logo"
            width={286}
            height={72}
            priority
          />
        </a>

        <nav className="nav-links">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={activeItem === item.href ? "is-active" : ""}
              onClick={() => handleNavClick(item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a className="button button-small nav-register-btn" href="#register">
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
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <a
            className="button button-small sidebar-register-btn"
            href="#register"
            onClick={() => setIsOpen(false)}
          >
            Register Now
          </a>
        </div>
      </aside>
    </>
  );
}