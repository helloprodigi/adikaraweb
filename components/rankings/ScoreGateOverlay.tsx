"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ScoreGateOverlay.module.css";

// Reveal sudah lewat, jadi tidak perlu hitungan mundur atau efek drop.
// Cukup tutup layar dengan fade putih, pindah halaman di belakangnya, lalu
// buka lagi dengan fade yang sama.
const FADE_IN_DURATION = 500;
const NAVIGATE_AT = FADE_IN_DURATION + 20;
const LEAVE_AT = NAVIGATE_AT + 200;
const EXIT_DURATION = 420;

export function ScoreGateOverlay({
  nim,
  onNavigate,
  onFinish,
}: {
  nim: string;
  onNavigate: () => void;
  onFinish: () => void;
}) {
  const [isLeaving, setIsLeaving] = useState(false);
  // React strict mode mounts effects twice in development; navigasi hanya
  // boleh terjadi sekali dari mount yang bertahan.
  const hasNavigated = useRef(false);

  useEffect(() => {
    // Untuk preferensi reduced motion langsung ke tujuan tanpa animasi.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onNavigate();
      onFinish();
      return;
    }

    const navigate = setTimeout(() => {
      if (hasNavigated.current) return;
      hasNavigated.current = true;
      onNavigate();
    }, NAVIGATE_AT);
    const leave = setTimeout(() => setIsLeaving(true), LEAVE_AT);
    // Safety net: jangan biarkan layar tertutup jika navigasi mandek.
    const finish = setTimeout(onFinish, LEAVE_AT + EXIT_DURATION + 1200);

    return () => {
      clearTimeout(navigate);
      clearTimeout(leave);
      clearTimeout(finish);
    };
  }, [onNavigate, onFinish]);

  return (
    <div
      className={`${styles.overlay} ${isLeaving ? styles.isLeaving : ""}`}
      role="alertdialog"
      aria-live="polite"
      aria-label={`Memuat nilai tim ${nim}`}
    />
  );
}
