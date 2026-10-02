"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    const update = () => {
      const distance = Math.min(Math.max(window.scrollY, 0), window.innerHeight);
      hero.style.setProperty("--hero-parallax", `${distance}px`);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          <Image
            src="/landing/hero/informatics-logo.svg"
            alt="Telkom University Faculty of Informatics"
            width={182}
            height={48}
          />
          <Image
            src="/landing/hero/prodigi-logo.svg"
            alt="Prodigi"
            width={142}
            height={48}
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
        <a
          className="button button-hero"
          href="https://helloprodigi.pro/PendaftaranAdikara2026"
          target="_blank"
          rel="noopener noreferrer"
        >
          Register Now
        </a>
      </div>
    </section>
  );
}