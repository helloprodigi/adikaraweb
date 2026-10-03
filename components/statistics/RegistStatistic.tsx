"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { onViewportEnter, subscribeToScroll } from "@/components/scrollTicker";
import { useStatistics } from "./StatisticsContext";
import { PLACEHOLDER, YEARS } from "./statsData";
import styles from "./statistics.module.css";

export function RegistStatistic() {
  const heroRef = useRef<HTMLElement>(null);
  const { year, setYear, data } = useStatistics();
  const [animatedValues, setAnimatedValues] = useState<(number | null)[]>(
    () => data.summary.map((stat) => stat.value)
  );
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  const currentSummaryStats = data.summary;

  // "value" shows the animated figures, "placeholder" shows ??? once the
  // count-down has finished.
  const [phase, setPhase] = useState<"value" | "placeholder">("value");

  const displayValues =
    phase === "placeholder"
      ? currentSummaryStats.map((stat) => stat.value)
      : animatedValues;

  const handlePrevYear = () => {
    setYear(YEARS[(YEARS.indexOf(year) - 1 + YEARS.length) % YEARS.length]);
  };

  const handleNextYear = () => {
    setYear(YEARS[(YEARS.indexOf(year) + 1) % YEARS.length]);
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

    const targets = currentSummaryStats.map((stat) => stat.value);
    const isPlaceholder = targets.every((target) => target === null);
    // Switching to a year with no published figures counts the old numbers
    // down to zero first, then swaps in the placeholder.
    const duration = isPlaceholder ? 420 : 1200;

    let animationFrame = 0;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.max(0, Math.min((now - startTime) / duration, 1));

      if (isPlaceholder) {
        setAnimatedValues((previous) =>
          previous.map((value) =>
            value === null ? null : Math.max(0, Math.round(value * (1 - progress)))
          )
        );

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setPhase("placeholder");
        }
        return;
      }

      setPhase("value");

      if (progress === 1) {
        setAnimatedValues(targets);
        return;
      }

      const easedProgress = 1 - Math.pow(2, -10 * progress);
      setAnimatedValues(
        targets.map((target) =>
          target === null ? null : Math.floor(target * easedProgress)
        )
      );
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [year, isHeroVisible]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    // The wings only move while the hero is on screen, so the scroll work is
    // switched off entirely once it scrolls away.
    let onScreen = true;
    let lastOffset = -1;

    const stopWatching = onViewportEnter(
      hero,
      () => {
        onScreen = true;
      },
      () => {
        onScreen = false;
      },
      "120px"
    );

    const unsubscribe = subscribeToScroll((scrollY) => {
      if (!onScreen) return;

      const offset = Math.min(scrollY, 720);
      if (offset === lastOffset) return;
      lastOffset = offset;

      hero.style.setProperty("--statistics-parallax", `${offset}px`);
    });

    return () => {
      stopWatching();
      unsubscribe();
    };
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
        <p className={styles.dataTimestamp}>
          Realtime data overview of all ADIKARA Participants.
        </p>
        <div className={styles.yearSelector} aria-label="Registration year">
          <button
            type="button"
            className={styles.yearArrowBtn}
            onClick={handlePrevYear}
            aria-label="Previous year"
          >
            <Image className={styles.yearArrowLeft} src="/statistics/arrow.svg" alt="" width={76} height={59} />
          </button>
          <span>{year}</span>
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
              <strong
                className={
                  phase === "placeholder" ? styles.isPlaceholder : undefined
                }
              >
                {displayValues[index] === null || displayValues[index] === undefined
                  ? PLACEHOLDER
                  : displayValues[index]!.toLocaleString("en-US")}
              </strong>
              <span className={styles.statCaption}>{stat.caption}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
