"use client";

import { useEffect, useState } from "react";
import { useReveal } from "./useReveal";
import styles from "./statistics.module.css";

const batchStats = [
  { label: "2026", value: 381 },
  { label: "2025", value: 143 },
  { label: "2024", value: 110 },
  { label: "2023", value: 10 },
];

const studyProgramStats = [
  { label: "S1 Informatics", value: 381 },
  { label: "S1 Data Science", value: 143 },
  { label: "S1 Software Engineering", value: 110 },
  { label: "S1 Information Technology", value: 10 },
];

const detailMax = 400;

type DetailCardProps = {
  title: string;
  firstColumn: string;
  items: { label: string; value: number }[];
  animatedValues: number[];
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
              <i style={{ width: `${(item.value / detailMax) * 100}%` }} />
            </div>
            <strong>{animatedValues[index]}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ParticipantDetail() {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    if (!isVisible) return;

    const targets = [...batchStats.map((item) => item.value), ...studyProgramStats.map((item) => item.value)];
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

      setAnimatedValues(targets.map((target) => Math.floor(target * easedProgress)));
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
