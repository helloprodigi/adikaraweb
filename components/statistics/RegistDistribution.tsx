"use client";

import type { CSSProperties } from "react";
import { useReveal } from "./useReveal";
import styles from "./statistics.module.css";

const categoryStats = [
  { name: "Innovations", registrations: 142, participants: 406 },
  { name: "Competitive Programming", registrations: 158, participants: 158 },
  { name: "Cyber Security", registrations: 137, participants: 137 },
  { name: "Entrepreneurship", registrations: 118, participants: 272 },
  { name: "Data Mining", registrations: 69, participants: 173 },
];

const genderStats = { male: 927, female: 218 };
const axisValues = [0, 100, 200, 300, 400, 500];
const chartMax = Math.max(
  axisValues.at(-1) ?? 0,
  ...categoryStats.flatMap((category) => [category.registrations, category.participants])
);
const genderTotal = genderStats.male + genderStats.female;
const maleShare = (genderStats.male / genderTotal) * 100;
const barWidth = (value: number) => `${Math.min((value / chartMax) * 100, 100)}%`;

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
                    <span>{category.registrations}</span>
                  </div>
                  <div
                    className={`${styles.bar} ${styles.participantBar}`}
                    style={{ width: barWidth(category.participants) }}
                  >
                    <span>{category.participants}</span>
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
            aria-label={`${genderTotal.toLocaleString("en-US")} participants: ${genderStats.male} male and ${genderStats.female} female`}
            style={{ "--male-share": `${maleShare}%` } as CSSProperties}
          >
            <div>
              <strong>{genderTotal.toLocaleString("en-US")}</strong>
              <span>participant</span>
            </div>
          </div>
          <div className={styles.genderLegend}>
              <div><i className={styles.maleDot} /><span>Male</span><b>{Math.round(maleShare)}%</b><b>{genderStats.male}</b></div>
              <div><i className={styles.femaleDot} /><span>Female</span><b>{100 - Math.round(maleShare)}%</b><b>{genderStats.female}</b></div>
          </div>
        </section>
      </div>
    </section>
  );
}
