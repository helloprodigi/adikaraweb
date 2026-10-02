"use client";

import type { CSSProperties } from "react";
import { useReveal } from "./useReveal";
import { useStatistics } from "./StatisticsContext";
import { PLACEHOLDER } from "./statsData";
import styles from "./statistics.module.css";

const AXIS_VALUES = [0, 100, 200, 300, 400, 500];

export function RegistDistribution() {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const { data, year } = useStatistics();

  const { categories, gender } = data;

  const chartMax = Math.max(
    AXIS_VALUES.at(-1) ?? 0,
    ...categories.flatMap((c) => [
      c.registrations ?? 0,
      c.participants ?? 0,
    ])
  );

  const genderTotal =
    gender.male === null || gender.female === null
      ? null
      : gender.male + gender.female;
  const maleShare =
    genderTotal === null || genderTotal === 0
      ? 50
      : (gender.male! / genderTotal) * 100;

  const barWidth = (value: number | null) =>
    value === null || chartMax === 0
      ? "0%"
      : `${Math.min((value / chartMax) * 100, 100)}%`;
  const formatValue = (value: number | null) =>
    value === null ? PLACEHOLDER : value.toLocaleString("en-US");

  return (
    <section
      ref={ref}
      className={`${styles.contentSection} ${isVisible ? styles.sectionVisible : ""}`}
      aria-labelledby="participant-details-title"
    >
      <h2 id="participant-details-title">Participants Detail</h2>

      <div className={styles.distributionGrid}>
        <section className={styles.chartCard} aria-labelledby="competition-registration-title">
          <div className={styles.cardHeadingRow}>
            <h3 id="competition-registration-title">Registrations by Competition</h3>
            <div className={styles.legend}>
              <span><i className={styles.registrationDot} />Registrations</span>
              <span><i className={styles.participantDot} />Estimated Participants</span>
            </div>
          </div>

          <div className={styles.barChart} key={`bars-${year}`}>
            {categories.map((category) => (
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
              {AXIS_VALUES.map((value) => <span key={value}>{value}</span>)}
            </div>
          </div>
        </section>

        <section className={styles.chartCard} aria-labelledby="gender-title">
          <h3 id="gender-title">Gender</h3>
          <div
            className={styles.donut}
            key={`donut-${year}`}
            role="img"
            aria-label={
              genderTotal === null
                ? "Data peserta belum tersedia"
                : `${genderTotal.toLocaleString("en-US")} participants: ${gender.male} male and ${gender.female} female`
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
              <div><i className={styles.maleDot} /><span>Male</span><b>{genderTotal === null ? PLACEHOLDER : `${Math.round(maleShare)}%`}</b><b>{formatValue(gender.male)}</b></div>
              <div><i className={styles.femaleDot} /><span>Female</span><b>{genderTotal === null ? PLACEHOLDER : `${100 - Math.round(maleShare)}%`}</b><b>{formatValue(gender.female)}</b></div>
          </div>
        </section>
      </div>
    </section>
  );
}
