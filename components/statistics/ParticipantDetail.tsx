"use client";

import { useEffect, useState } from "react";
import { useReveal } from "./useReveal";
import styles from "./statistics.module.css";
import { useStatistics } from "./StatisticsContext";
import { PLACEHOLDER, type DetailItem } from "./statsData";

const DETAIL_MAX = 450;

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
          <div className={styles.detailRow} key={`${title}-${index}`}>
            <span>{item.label}</span>
            <div>
              <i
                style={{
                  width:
                    item.value === null
                      ? "0%"
                      : `${(item.value / DETAIL_MAX) * 100}%`,
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
  const { data, year } = useStatistics();
  const batchStats = data.batch;
  const studyProgramStats = data.studyProgram;
  const [animatedValues, setAnimatedValues] = useState<(number | null)[]>(
    () => [...data.batch, ...data.studyProgram].map((item) => item.value)
  );

  // Placeholder years have nothing to count up, so derive the display
  // values instead of reading stale state from the previous year.
  const allItems = [...batchStats, ...studyProgramStats];
  const hasFigures = allItems.some((item) => item.value !== null);
  const displayValues = hasFigures
    ? animatedValues
    : allItems.map((item) => item.value);

  useEffect(() => {
    if (!isVisible) return;

    const targets = [...batchStats, ...studyProgramStats].map(
      (item) => item.value
    );
    // Placeholder years render directly, nothing to count up.
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
  }, [isVisible, year]);

  return (
    <section
      ref={ref}
      className={`${styles.contentSection} ${isVisible ? styles.sectionVisible : ""}`}
      aria-labelledby="participant-details-title"
    >
      <h2 id="participant-details-title">Detail Angkatan &amp; Prodi (berdasarkan form)</h2>
      <div className={styles.detailsGrid}>
        <DetailCard
          title="Angkatan"
          firstColumn="Angkatan"
          items={batchStats}
          animatedValues={displayValues.slice(0, batchStats.length)}
        />
        <DetailCard
          title="Program Studi"
          firstColumn="Prodi"
          items={studyProgramStats}
          animatedValues={displayValues.slice(batchStats.length)}
        />
      </div>
    </section>
  );
}
