"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const quickLinks = [
  { label: "About Us", href: "#theme" },
  { label: "Timeline", href: "#timeline" },
  { label: "Competitions", href: "#categories" },
];

const categoriesLinks = [
  { label: "Competitive Programming", href: "#categories" },
  { label: "Data Mining", href: "#categories" },
  { label: "Cyber Security", href: "#categories" },
  { label: "Entrepreneurship", href: "#categories" },
  { label: "Innovation", href: "#categories" },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -60px 0px" }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer className={`site-footer ${isVisible ? "is-visible" : ""}`} id="contact" ref={footerRef}>
      <div className="footer-top">
        <div className="footer-container">
          {/* Column 1: Brand & Info */}
          <div className="footer-col footer-col-brand">
            <a className="footer-brand" href="#overview" aria-label="Adikara 2026 home">
              <Image
                src="/navbar/adikara-logo.svg"
                alt="ADIKARA 2026 - Lead With Character, Shape The Future."
                width={260}
                height={66}
              />
            </a>

            <p className="footer-description">
              Informatics Students&apos; Digital Creative and Innovation Competition.
              Organized by the Faculty of Informatics and the Digital Talent
              Centre Laboratory.
            </p>

            <div className="footer-socials" aria-label="Social links">
              <a
                className="social-icon"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              <a
                className="social-icon"
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                className="social-icon"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.54a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h3 className="footer-col-title">Quick Links</h3>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="footer-col">
            <h3 className="footer-col-title">Categories</h3>
            <ul className="footer-links">
              {categoriesLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="footer-col footer-col-contact">
            <h3 className="footer-col-title">Contact Us</h3>
            <address className="footer-address">
              Digital Talent Centre Lab, Telkom University Landmark Tower (TULT)
              15th floor, Jl. Telekomunikasi No. 1, Terusan Buahbatu, Bandung
              40257
            </address>
          </div>
        </div>
      </div>

      <Image
        className="footer-bg-card"
        src="/landing/adikara-card.svg"
        alt=""
        width={434}
        height={454}
      />

      {/* Bottom Red Bar */}
      <div className="footer-bottom">
        <p>
          &copy; 2026 ADIKARA. All rights reserved. || Designed &amp; Developed
          by <strong>Product Team PRODIGI</strong>
        </p>
      </div>
    </footer>
  );
}
