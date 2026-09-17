"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function MyProdigiSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -100px 0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`myprodigi-section ${isVisible ? "is-visible" : ""}`}
      id="myprodigi"
      aria-labelledby="myprodigi-title"
      ref={sectionRef}
    >
      <div className="myprodigi-content">
        <div className="myprodigi-copy">
          <h2 id="myprodigi-title">
            Find Your Team
            <br />
            on MyProdigi
          </h2>
          <a
            className="button myprodigi-button myprodigi-btn-desktop"
            href="https://my.helloprodigi.pro/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open MyProdigi
          </a>
        </div>

        <Image
          className="myprodigi-mockup"
          src="/landing/myprodigi-mockup.svg"
          alt="MyProdigi mobile application preview"
          width={629}
          height={722}
        />

        <a
          className="button myprodigi-button myprodigi-btn-mobile"
          href="https://my.helloprodigi.pro/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open MyProdigi
        </a>
      </div>
    </section>
  );
}
