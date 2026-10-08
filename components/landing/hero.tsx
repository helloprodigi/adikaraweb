"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { subscribeToScroll } from "@/components/scrollTicker";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastDistance = -1;

    return subscribeToScroll((scrollY, viewportHeight) => {
      const distance = Math.min(Math.max(scrollY, 0), viewportHeight);

      // The offset saturates at one viewport height, so past that point there
      // is nothing to write and the custom property is left alone.
      if (distance === lastDistance) return;
      lastDistance = distance;

      hero.style.setProperty("--hero-parallax", `${distance}px`);
    });
  }, []);

  return (
    <section ref={heroRef} className="hero" id="overview" aria-labelledby="hero-title">
      <Image
        className="hero-decor hero-decor-left"
        src="/landing/hero/hero-decor.svg"
        alt=""
        width={448}
        height={590}
        priority
      />
      <Image
        className="hero-decor hero-decor-right"
        src="/landing/hero/hero-decor.svg"
        alt=""
        width={448}
        height={590}
        priority
      />

      <div className="hero-content">
        <div className="partner-logos" aria-label="Event partners">
          {/* Declared at the size they are actually rendered at (CSS pins the
              height to 48px), which keeps next/image from warning about a
              one-sided override and from fetching an oversized variant. */}
          <Image
            src="/landing/hero/informatics-logo.svg"
            alt="Telkom University Faculty of Informatics"
            width={249}
            height={48}
            sizes="(max-width: 900px) 150px, 249px"
          />
          <Image
            src="/landing/hero/prodigi-logo.webp"
            alt="Prodigi"
            width={203}
            height={48}
            sizes="(max-width: 900px) 115px, 203px"
          />
        </div>

        <Image
          className="hero-icon"
          src="/landing/hero/adikara-icon.svg"
          alt="Adikara emblem"
          width={142}
          height={190}
          priority
        />
        <h1 id="hero-title">
          ADIKARA <span>2026</span>
        </h1>
        <div className="hero-buttons">
          <a
            className="button button-hero"
            href="https://helloprodigi.pro/PendaftaranAdikara2026"
            target="_blank"
            rel="noopener noreferrer"
          >
            Register Now
          </a>
          <a
            className="button button-hero button-hero-secondary"
            href="#download-resource"
          >
            Important Link
          </a>
        </div>
      </div>
    </section>
  );
}