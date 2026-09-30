"use client";

import { useEffect, useState } from "react";
import { useReveal } from "./useReveal";
import styles from "./statistics.module.css";

// Data belum tersedia, tampilkan placeholder sampai API statistics siap
const PLACEHOLDER = "???";

const batchStats = [
  { label: "2026", value: null },
  { label: "2025", value: null },
  { label: "2024", value: null },
  { label: "2023", value: null },
];

const studyProgramStats = [
  { label: "S1 Informatics", value: null },
  { label: "S1 Data Science", value: null },
  { label: "S1 Software Engineering", value: null },
  { label: "S1 Information Technology", value: null },
];

const detailMax = 400;

type DetailItem = { label: string; value: number | null };

type DetailCardProps = {
  title: string;
  firstColumn: string;
  items: DetailItem[];
  animatedValues: (number | null)[];
};

function DetailCard({ title, firstColumn, items, animatedValues }: DetailCardProps) {
  return (
    <section className={styles.detailCard} aria-label={title}>
      <h3>{title}</h3>
      <div className={styles.detailHeader}>
        <span>{firstColumn}</span>
        <span>Number</span>
      </div>
      <div>
        {items.map((item, index) => (
          <div className={styles.detailRow} key={item.label}>
            <span>{item.label}</span>
            <div>
              <i
                style={{
                  width:
                    item.value === null
                      ? "0%"
                      : `${(item.value / detailMax) * 100}%`,
                }}
              />
            </div>
            <strong>
              {animatedValues[index] === null || animatedValues[index] === undefined
                ? PLACEHOLDER
                : animatedValues[index]}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ParticipantDetail() {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const [animatedValues, setAnimatedValues] = useState<(number | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  useEffect(() => {
    if (!isVisible) return;

    const targets = [...batchStats, ...studyProgramStats].map(
      (item) => item.value
    );
    // Lewati animasi count-up kalau datanya belum ada
    if (targets.every((target) => target === null)) return;

    const startTime = performance.now() + 300;
    const duration = 1400;
    let animationFrame = 0;

    const animate = (now: number) => {
      const progress = Math.max(0, Math.min((now - startTime) / duration, 1));
      const easedProgress = 1 - Math.pow(2, -10 * progress);

      if (progress === 1) {
        setAnimatedValues(targets);
        return;
      }

      setAnimatedValues(
        targets.map((target) =>
          target === null ? null : Math.floor(target * easedProgress)
        )
      );
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible]);

  return (
    <section
      ref={ref}
      className={`${styles.contentSection} ${isVisible ? styles.sectionVisible : ""}`}
      aria-labelledby="participant-details-title"
    >
      <h2 id="participant-details-title">Participant Details</h2>
      <div className={styles.detailsGrid}>
        <DetailCard
          title="Batch (Year of Entry)"
          firstColumn="Batch"
          items={batchStats}
          animatedValues={animatedValues.slice(0, batchStats.length)}
        />
        <DetailCard
          title="Study Program"
          firstColumn="Program"
          items={studyProgramStats}
          animatedValues={animatedValues.slice(batchStats.length)}
        />
      </div>
    </section>
  );
}
