"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./statistics.module.css";

const summaryStats = [
  { label: "Total Registrations", value: 676 },
  { label: "Individual Registrations", value: 676 },
  { label: "Team Registrations", value: 676 },
  { label: "Estimated Participants", value: 1145, featured: true },
];

export function RegistStatistic() {
  const heroRef = useRef<HTMLElement>(null);
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0]);
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let animationFrame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setIsHeroVisible(true);
        observer.disconnect();
        const startTime = performance.now() + 650;
        const duration = 1400;
        const targets = summaryStats.map((stat) => stat.value);

        const animate = (now: number) => {
          const progress = Math.max(0, Math.min((now - startTime) / duration, 1));
          const easedProgress = 1 - Math.pow(2, -10 * progress);

          if (progress === 1) {
            setAnimatedValues(targets);
            return;
          }

          setAnimatedValues(targets.map((target) => Math.floor(target * easedProgress)));
          animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);
      },
      { threshold: 0.15 }
    );

    observer.observe(hero);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const updateParallax = () => {
      heroRef.current?.style.setProperty(
        "--statistics-parallax",
        `${Math.min(window.scrollY, 720)}px`
      );
    };

    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
    return () => window.removeEventListener("scroll", updateParallax);
  }, []);

  return (
    <section
      ref={heroRef}
      className={`${styles.hero} ${isHeroVisible ? styles.heroVisible : ""}`}
      aria-labelledby="statistics-title"
    >
      <Image
        className={`${styles.sideWing} ${styles.leftWing}`}
        src="/landing/hero/hero-decor.svg"
        alt=""
        width={448}
        height={590}
        priority
      />
      <Image
        className={`${styles.sideWing} ${styles.rightWing}`}
        src="/landing/hero/hero-decor.svg"
        alt=""
        width={448}
        height={590}
        priority
      />

      <div className={styles.heroContent}>
        <p className={styles.eyebrow}>ADIKARA</p>
        <h1 id="statistics-title">Registration Statistic</h1>
        <p>Realtime Data Overview Of All ADIKARA Participants.</p>
        <div className={styles.yearSelector} aria-label="Registration year">
          <Image className={styles.yearArrowLeft} src="/statistics/arrow.svg" alt="Previous year" width={76} height={59} />
          <span>2025</span>
          <Image className={styles.yearArrowRight} src="/statistics/arrow.svg" alt="Next year" width={76} height={59} />
        </div>
      </div>

      <div className={styles.summarySection}>
        <div className={styles.summaryGrid} aria-label="ADIKARA registration summary">
          {summaryStats.map((stat, index) => (
            <article
              className={`${styles.summaryCard} ${stat.featured ? styles.featuredCard : ""}`}
              key={stat.label}
            >
              <p>{stat.label}</p>
              <strong>{animatedValues[index].toLocaleString("en-US")}</strong>
              <span>Individuals and Teams</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
