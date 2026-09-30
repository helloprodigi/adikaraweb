"use client";

import type { CSSProperties } from "react";
import { useReveal } from "./useReveal";
import styles from "./statistics.module.css";

// Data belum tersedia, tampilkan placeholder sampai API statistics siap
const PLACEHOLDER = "???";

const categoryStats = [
  { name: "Innovations", registrations: null, participants: null },
  { name: "Competitive Programming", registrations: null, participants: null },
  { name: "Cyber Security", registrations: null, participants: null },
  { name: "Entrepreneurship", registrations: null, participants: null },
  { name: "Data Mining", registrations: null, participants: null },
];

const genderStats: { male: number | null; female: number | null } = {
  male: null,
  female: null,
};

const axisValues: number[] = [];
const chartMax: number | null = null;
const genderTotal =
  genderStats.male === null || genderStats.female === null
    ? null
    : genderStats.male + genderStats.female;
const maleShare =
  genderTotal === null || genderTotal === 0
    ? 50
    : (genderStats.male! / genderTotal) * 100;
const barWidth = (value: number | null) =>
  value === null || chartMax === null || chartMax === 0
    ? "0%"
    : `${Math.min((value / chartMax) * 100, 100)}%`;
const formatValue = (value: number | null) =>
  value === null ? PLACEHOLDER : value.toLocaleString("en-US");

export function RegistDistribution() {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`${styles.contentSection} ${isVisible ? styles.sectionVisible : ""}`}
      aria-labelledby="registration-distribution-title"
    >
      <h2 id="registration-distribution-title">Registration Distribution by Category</h2>

      <div className={styles.distributionGrid}>
        <section className={styles.chartCard} aria-labelledby="competition-registration-title">
          <div className={styles.cardHeadingRow}>
            <h3 id="competition-registration-title">Registrations by Competition</h3>
            <div className={styles.legend}>
              <span><i className={styles.registrationDot} />Registrations</span>
              <span><i className={styles.participantDot} />Estimated Participants</span>
            </div>
          </div>

          <div className={styles.barChart}>
            {categoryStats.map((category) => (
              <div className={styles.barRow} key={category.name}>
                <span className={styles.barLabel}>{category.name}</span>
                <div className={styles.barTrack}>
                  <div
                    className={`${styles.bar} ${styles.registrationBar}`}
                    style={{ width: barWidth(category.registrations) }}
                  >
                    <span>{formatValue(category.registrations)}</span>
                  </div>
                  <div
                    className={`${styles.bar} ${styles.participantBar}`}
                    style={{ width: barWidth(category.participants) }}
                  >
                    <span>{formatValue(category.participants)}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className={styles.axis} aria-hidden="true">
              {axisValues.map((value) => <span key={value}>{value}</span>)}
            </div>
          </div>
        </section>

        <section className={styles.chartCard} aria-labelledby="gender-title">
          <h3 id="gender-title">Gender</h3>
          <div
            className={styles.donut}
            role="img"
            aria-label={
              genderTotal === null
                ? "Data peserta belum tersedia"
                : `${genderTotal.toLocaleString("en-US")} participants: ${genderStats.male} male and ${genderStats.female} female`
            }
            style={{ "--male-share": `${maleShare}%` } as CSSProperties}
          >
            <div>
              <strong>
                {genderTotal === null ? PLACEHOLDER : genderTotal.toLocaleString("en-US")}
              </strong>
              <span>participant</span>
            </div>
          </div>
          <div className={styles.genderLegend}>
              <div><i className={styles.maleDot} /><span>Male</span><b>{genderTotal === null ? PLACEHOLDER : `${Math.round(maleShare)}%`}</b><b>{formatValue(genderStats.male)}</b></div>
              <div><i className={styles.femaleDot} /><span>Female</span><b>{genderTotal === null ? PLACEHOLDER : `${100 - Math.round(maleShare)}%`}</b><b>{formatValue(genderStats.female)}</b></div>
          </div>
        </section>
      </div>
    </section>
  );
}
