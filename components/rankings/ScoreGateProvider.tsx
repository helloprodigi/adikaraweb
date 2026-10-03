"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { ScoreGateOverlay } from "./ScoreGateOverlay";

type ScoreGateContextValue = {
  // Starts the gate for a NIM and, once the countdown and the drop are done,
  // moves on to that team's score page.
  openScoreGate: (nim: string) => void;
};

const ScoreGateContext = createContext<ScoreGateContextValue | null>(null);

// The gate lives above the router instead of inside a page. A page-level
// overlay is unmounted the moment the route changes, which is exactly when it
// still needs to be on screen: keeping it here lets the navigation happen
// behind a fully covering overlay, so /rankings is never visible on the way
// out and /team-score is revealed by the overlay clearing.
export function ScoreGateProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [pendingNim, setPendingNim] = useState<string | null>(null);

  const openScoreGate = useCallback((nim: string) => {
    setPendingNim(nim);
  }, []);

  const handleNavigate = useCallback(() => {
    router.push(`/team-score?nim=${encodeURIComponent(pendingNim ?? "")}`);
  }, [pendingNim, router]);

  const handleFinish = useCallback(() => {
    setPendingNim(null);
  }, []);

  return (
    <ScoreGateContext.Provider value={{ openScoreGate }}>
      {children}
      {pendingNim !== null && (
        <ScoreGateOverlay
          nim={pendingNim}
          onNavigate={handleNavigate}
          onFinish={handleFinish}
        />
      )}
    </ScoreGateContext.Provider>
  );
}

export function useScoreGate() {
  const context = useContext(ScoreGateContext);

  if (!context) {
    throw new Error("useScoreGate must be used inside ScoreGateProvider");
  }

  return context;
}
