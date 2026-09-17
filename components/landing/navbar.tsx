"use client";

import Image from "next/image";
import { useState } from "react";

const navigationItems = [
  { label: "Overview", href: "#overview" },
  { label: "Timeline", href: "#timeline" },
  { label: "Competition", href: "#competition" },
  { label: "Team", href: "#team" },
  { label: "Guidebook", href: "#guidebook" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("#overview");

  const handleNavClick = (href: string) => {
    setActiveItem(href);
    setIsOpen(false);
  };

  return (
    <>
      <header className="floating-navbar" aria-label="Main navigation">
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
              onClick={() => setActiveItem(item.href)}
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