"use client";

import styles from "./RevealLock.module.css";
import { formatRevealCountdown } from "./revealGate";

export function RevealLock({ remainingMs }: { remainingMs: number }) {
  return (
    <main className={styles.overlay} aria-labelledby="reveal-lock-title">
      <div className={styles.pattern} aria-hidden="true" />
      <div className={styles.card}>
        <span className={styles.kicker}>PENGUMUMAN ADIKARA 2026</span>
        <h1 id="reveal-lock-title">Finalis akan diumumkan dalam</h1>
        <p className={styles.countdown} aria-live="off">
          {formatRevealCountdown(remainingMs)}
        </p>
        <p className={styles.note}>
          Halaman hasil dan pengecekan nilai akan dibuka setelah countdown selesai.
        </p>
      </div>
    </main>
  );
}
