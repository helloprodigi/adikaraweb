"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RevealLock } from "./RevealLock";
import { useServerClock } from "./useServerClock";

// Dipakai sebelum reveal supaya data finalis tidak ikut terkirim ke browser.
// Begitu jam server mencapai reveal, halaman di-refresh agar server mengirim
// versi yang berisi daftar finalis.
export function CountdownGate({ initialServerNow }: { initialServerNow: number }) {
  const router = useRouter();
  const { isRevealed, remainingMs } = useServerClock(initialServerNow);

  useEffect(() => {
    if (isRevealed) router.refresh();
  }, [isRevealed, router]);

  return <RevealLock remainingMs={remainingMs} />;
}
