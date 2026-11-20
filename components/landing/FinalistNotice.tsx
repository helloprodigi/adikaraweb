"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./FinalistNotice.module.css";

export function FinalistNotice() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside className={styles.notice} aria-labelledby="finalist-notice-title">
      <button
        type="button"
        className={styles.close}
        onClick={() => setDismissed(true)}
        aria-label="Tutup notifikasi"
      >
        ×
      </button>

      <h2 id="finalist-notice-title" className={styles.title}>
        Congratulations, Finalists!
      </h2>

      <p className={styles.body}>
        Selamat kepada tim dan peserta yang berhasil melaju ke Final ADIKARA
        2026! Hasil penjurian dan daftar tim finalis kini dapat dilihat melalui
        menu{" "}
        <Link href="/rankings" className={styles.link}>
          Rankings
        </Link>
        .
      </p>
    </aside>
  );
}
