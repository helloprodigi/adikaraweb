"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getDataMiningRevealStatus,
  getRevealStatus,
  type RevealStatus,
} from "./revealSchedule";

type ClockSnapshot = RevealStatus & {
  serverNow: number;
  dataMining: RevealStatus;
};

function snapshotAt(serverNow: number): ClockSnapshot {
  return {
    serverNow,
    ...getRevealStatus(serverNow),
    dataMining: getDataMiningRevealStatus(serverNow),
  };
}

export function useServerClock(initialServerNow: number): ClockSnapshot {
  // Baseline berasal dari server. `performance.now()` monotonic, jadi mengubah
  // jam device tidak bisa memutar mundur/maju countdown.
  const baseline = useRef({ server: initialServerNow, perf: 0 });
  const [snapshot, setSnapshot] = useState<ClockSnapshot>(() =>
    snapshotAt(initialServerNow)
  );

  const readClock = useCallback(() => {
    const { server, perf } = baseline.current;
    return server + (performance.now() - perf);
  }, []);

  const sync = useCallback(async () => {
    try {
      const response = await fetch("/api/reveal-status", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as { serverNow?: number };
      if (typeof data.serverNow !== "number") return;
      baseline.current = { server: data.serverNow, perf: performance.now() };
      setSnapshot(snapshotAt(data.serverNow));
    } catch {
      // Gagal sync tidak mengubah baseline terakhir yang valid dari server.
    }
  }, []);

  useEffect(() => {
    baseline.current = { server: initialServerNow, perf: performance.now() };
    const tick = window.setInterval(() => {
      const serverNow = readClock();
      setSnapshot(snapshotAt(serverNow));
    }, 1000);
    const resync = window.setInterval(() => {
      void sync();
    }, 10000);
    const initialSync = window.setTimeout(() => {
      void sync();
    }, 0);
    return () => {
      window.clearInterval(tick);
      window.clearInterval(resync);
      window.clearTimeout(initialSync);
    };
  }, [initialServerNow, readClock, sync]);

  return snapshot;
}
