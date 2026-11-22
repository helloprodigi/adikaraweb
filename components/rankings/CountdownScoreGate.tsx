"use client";

import { useEffect, useRef, useState } from "react";
import { DROP_STREAKS, dropStreakStyle } from "@/components/dropStreaks";
import styles from "./CountdownScoreGate.module.css";

const GATE_DURATION = 5;
const DESCENT_DURATION = 820;
const NAVIGATE_LEAD = 260;
const EXIT_DURATION = 420;

// Hitungan 5 → 1 dipakai khusus Data Mining, karena pengumumannya punya jadwal
// tersendiri. Untuk lomba lain cukup fade putih singkat.
export function CountdownScoreGate({
  nim,
  onNavigate,
  onFinish,
}: {
  nim: string;
  onNavigate: () => void;
  onFinish: () => void;
}) {
  const [remaining, setRemaining] = useState(GATE_DURATION);
  const [isDescending, setIsDescending] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onNavigate();
      onFinish();
      return;
    }

    const descendAt = GATE_DURATION * 1000;
    const navigateAt = descendAt + DESCENT_DURATION - NAVIGATE_LEAD;
    const leaveAt = descendAt + DESCENT_DURATION;
    const finishAt = leaveAt + EXIT_DURATION;

    const tick = setInterval(() => {
      setRemaining((value) => (value > 0 ? value - 1 : 0));
    }, 1000);

    const descend = setTimeout(() => setIsDescending(true), descendAt);
    const navigate = setTimeout(() => {
      if (hasNavigated.current) return;
      hasNavigated.current = true;
      onNavigate();
    }, navigateAt);
    const leave = setTimeout(() => setIsLeaving(true), leaveAt);
    const finish = setTimeout(onFinish, finishAt + 1500);

    return () => {
      clearInterval(tick);
      clearTimeout(descend);
      clearTimeout(navigate);
      clearTimeout(leave);
      clearTimeout(finish);
    };
  }, [onNavigate, onFinish]);

  return (
    <div
      className={`${styles.overlay} ${
        isDescending ? styles["is-dropping"] : ""
      } ${isLeaving ? styles.isLeaving : ""}`}
      role="alertdialog"
      aria-live="assertive"
      aria-label={`Memuat nilai tim ${nim}`}
    >
      <div className={styles.pattern} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      <div className="drop-streaks" aria-hidden="true">
        {DROP_STREAKS.map((streak) => (
          <span className="drop-streak" key={streak.x} style={dropStreakStyle(streak)} />
        ))}
      </div>

      <div className={styles.content}>
        <p className={styles.countdown} key={remaining}>
          {remaining}
        </p>

        <div className={styles.bar} aria-hidden="true">
          <span style={{ animationDuration: `${GATE_DURATION}s` }} />
        </div>
      </div>
    </div>
  );
}
