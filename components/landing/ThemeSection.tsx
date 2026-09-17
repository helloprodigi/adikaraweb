"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const fullText = "Empowering Next-Gen Digital Talents to Architect Sustainable Solutions for Human Wellbeing";

export function ThemeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasTextStarted, setHasTextStarted] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasTextStarted(true);
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -50px 0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasTextStarted) return;
    if (charIndex >= fullText.length) return;

    const timer = setTimeout(() => {
      setCharIndex((prev) => prev + 1);
    }, 35);

    return () => clearTimeout(timer);
  }, [hasTextStarted, charIndex]);

  const displayedText = fullText.slice(0, charIndex);

  return (
    <section
      className={`theme-section ${isVisible ? "is-visible" : ""}`}
      id="theme"
      aria-labelledby="theme-title"
      ref={sectionRef}
    >
      <Image
        className="theme-card theme-card-left"
        src="/landing/adikara-card.svg"
        alt=""
        width={434}
        height={454}
      />
      <Image
        className="theme-card theme-card-right"
        src="/landing/adikara-card.svg"
        alt=""
        width={434}
        height={454}
      />

      <div className="theme-content">
        <p>ADIKARA 2026 Theme</p>
        <h2 id="theme-title">
          {displayedText}
          <span className="typing-cursor" aria-hidden="true">|</span>
        </h2>
      </div>
    </section>
  );
}