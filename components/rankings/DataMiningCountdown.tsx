"use client";

import styles from "./DataMiningCountdown.module.css";
import { formatRevealCountdown } from "./revealSchedule";

export function DataMiningCountdown({
  remainingMs,
}: {
  remainingMs: number;
}) {
  return (
    <div className={styles.wrap} role="status" aria-live="off">
      <p className={styles.title}>Finalis akan diumumkan dalam</p>
      <p className={styles.countdown}>{formatRevealCountdown(remainingMs)}</p>
    </div>
  );
}
