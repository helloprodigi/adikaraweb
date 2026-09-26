"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./statistics.module.css";

const YEARS = [2024, 2025, 2026];

const yearStatsData: Record<number, Array<{ label: string; value: number; featured?: boolean }>> = {
  2024: [
    { label: "Total Registrations", value: 512 },
    { label: "Individual Registrations", value: 512 },
    { label: "Team Registrations", value: 512 },
    { label: "Estimated Participants", value: 890, featured: true },
  ],
  2025: [
    { label: "Total Registrations", value: 676 },
    { label: "Individual Registrations", value: 676 },
    { label: "Team Registrations", value: 676 },
    { label: "Estimated Participants", value: 1145, featured: true },
  ],
  2026: [
    { label: "Total Registrations", value: 840 },
    { label: "Individual Registrations", value: 840 },
    { label: "Team Registrations", value: 840 },
    { label: "Estimated Participants", value: 1420, featured: true },
  ],
};

export function RegistStatistic() {
  const heroRef = useRef<HTMLElement>(null);
  const [yearIndex, setYearIndex] = useState(1); // 2025 is default index
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0]);
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  const activeYear = YEARS[yearIndex];
  const currentSummaryStats = yearStatsData[activeYear];

  const handlePrevYear = () => {
    setYearIndex((prev) => (prev > 0 ? prev - 1 : YEARS.length - 1));
  };

  const handleNextYear = () => {
    setYearIndex((prev) => (prev < YEARS.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeroVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isHeroVisible) return;

    let animationFrame = 0;
    const startTime = performance.now();
    const duration = 1200;
    const targets = currentSummaryStats.map((stat) => stat.value);

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
    return () => cancelAnimationFrame(animationFrame);
  }, [yearIndex, isHeroVisible]);

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
          <button
            type="button"
            className={styles.yearArrowBtn}
            onClick={handlePrevYear}
            aria-label="Previous year"
          >
            <Image className={styles.yearArrowLeft} src="/statistics/arrow.svg" alt="" width={76} height={59} />
          </button>
          <span>{activeYear}</span>
          <button
            type="button"
            className={styles.yearArrowBtn}
            onClick={handleNextYear}
            aria-label="Next year"
          >
            <Image className={styles.yearArrowRight} src="/statistics/arrow.svg" alt="" width={76} height={59} />
          </button>
        </div>
      </div>

      <div className={styles.summarySection}>
        <div className={styles.summaryGrid} aria-label="ADIKARA registration summary">
          {currentSummaryStats.map((stat, index) => (
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
