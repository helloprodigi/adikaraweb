"use client";

import styles from "./RevealLock.module.css";
import { formatRevealCountdown } from "./revealSchedule";

export function RevealLock({ remainingMs }: { remainingMs: number }) {
  return (
    <main className={styles.overlay} aria-labelledby="reveal-lock-title">
      <div className={styles.pattern} aria-hidden="true" />
      <div className={styles.content}>
        <h1 id="reveal-lock-title">Finalis akan diumumkan dalam</h1>
        <p className={styles.countdown} aria-live="off">
          {formatRevealCountdown(remainingMs)}
        </p>
      </div>
    </main>
  );
}
