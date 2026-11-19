"use client";

import type { ReactNode } from "react";
import { RevealLock } from "./RevealLock";
import { useServerClock } from "./useServerClock";

export function RevealGate({
  initialServerNow,
  authorized,
  children,
}: {
  initialServerNow: number;
  authorized: boolean;
  children: ReactNode;
}) {
  const { isRevealed, remainingMs } = useServerClock(initialServerNow);

  // `authorized` hanya boleh berasal dari cookie bertanda tangan server yang
  // sudah diikat ke NIM yang dicek. Link langsung tanpa izin tetap terkunci.
  if (!isRevealed && !authorized) {
    return <RevealLock remainingMs={remainingMs} />;
  }

  return <>{children}</>;
}
