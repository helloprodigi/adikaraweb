"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function MyProdigiSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const tiltEl = tiltRef.current;
    const section = sectionRef.current;
    if (!tiltEl || !section) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const lerp = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      tiltEl.style.transform = `rotateX(${currentX.toFixed(3)}deg) rotateY(${currentY.toFixed(3)}deg)`;

      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        raf = requestAnimationFrame(lerp);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = tiltEl.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = py * -7;
      targetY = px * 9;
      if (!raf) raf = requestAnimationFrame(lerp);
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!raf) raf = requestAnimationFrame(lerp);
    };

    section.addEventListener("mousemove", onMove, { passive: true });
    section.addEventListener("mouseleave", onLeave);

    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      tiltEl.style.transform = "";
    };
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

        <div className="myprodigi-mockup-wrap">
          <div className="myprodigi-mockup-float">
            <div className="myprodigi-mockup-tilt" ref={tiltRef}>
              <Image
                className="myprodigi-mockup"
                src="/landing/myprodigi-mockup.svg"
                alt="MyProdigi mobile application preview"
                width={629}
                height={722}
              />
            </div>
          </div>
        </div>

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
