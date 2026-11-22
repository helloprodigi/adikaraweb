"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import {
  isDataMiningCompetition,
  type ScoreCompetitionId,
} from "./scoreCompetition";
import { CountdownScoreGate } from "./CountdownScoreGate";
import { ScoreGateOverlay } from "./ScoreGateOverlay";

type PendingScore = {
  nim: string;
  competition: ScoreCompetitionId;
};

type ScoreGateContextValue = {
  // Starts the gate for a NIM and, once the fade is done, moves on to that
  // team's score page for the competition the visitor chose.
  openScoreGate: (nim: string, competition: ScoreCompetitionId) => void;
};

const ScoreGateContext = createContext<ScoreGateContextValue | null>(null);

// The gate lives above the router instead of inside a page. A page-level
// overlay is unmounted the moment the route changes, which is exactly when it
// still needs to be on screen: keeping it here lets the navigation happen
// behind a fully covering overlay, so /rankings is never visible on the way
// out and /team-score is revealed by the overlay clearing.
export function ScoreGateProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [pending, setPending] = useState<PendingScore | null>(null);

  const openScoreGate = useCallback(
    (nim: string, competition: ScoreCompetitionId) => {
      setPending({ nim, competition });
    },
    []
  );

  const handleNavigate = useCallback(() => {
    if (!pending) return;
    router.push(
      `/team-score?nim=${encodeURIComponent(pending.nim)}&competition=${pending.competition}`
    );
  }, [pending, router]);

  const handleFinish = useCallback(() => {
    setPending(null);
  }, []);

  return (
    <ScoreGateContext.Provider value={{ openScoreGate }}>
      {children}
      {pending && (
        <>
          {isDataMiningCompetition(pending.competition) ? (
            <CountdownScoreGate
              nim={pending.nim}
              onNavigate={handleNavigate}
              onFinish={handleFinish}
            />
          ) : (
            <ScoreGateOverlay
              nim={pending.nim}
              onNavigate={handleNavigate}
              onFinish={handleFinish}
            />
          )}
        </>
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
