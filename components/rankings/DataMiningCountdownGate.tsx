"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/landing/navbar";
import { DataMiningCountdown } from "./DataMiningCountdown";
import { useServerClock } from "./useServerClock";
import styles from "./DataMiningCountdownGate.module.css";

// Dipakai kalau NIM Data Mining dicek sebelum jam reveal-nya. Semua keputusan
// sudah diambil server; komponen ini cuma menampilkan countdown dari jam server
// dan me-refresh begitu waktunya tiba.
export function DataMiningCountdownGate({
  initialServerNow,
}: {
  initialServerNow: number;
}) {
  const router = useRouter();
  const { dataMining } = useServerClock(initialServerNow);

  useEffect(() => {
    if (dataMining.isRevealed) router.refresh();
  }, [dataMining.isRevealed, router]);

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <DataMiningCountdown remainingMs={dataMining.remainingMs} />
      </main>
      <Footer />
    </>
  );
}
