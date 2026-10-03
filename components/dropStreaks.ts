import type { CSSProperties } from "react";

// The vertical speed lines used by the dramatic drop. Shared so the score gate
// countdown and the "team not registered" page drop with exactly the same
// motion: same positions, same stagger, same weights and opacities.
export type DropStreak = {
  x: string;
  delay: number;
  duration: number;
  weight: number;
  alpha: number;
};

export const DROP_STREAKS: DropStreak[] = [
  { x: "6%", delay: 0, duration: 560, weight: 2, alpha: 1 },
  { x: "14%", delay: 40, duration: 640, weight: 4, alpha: 1 },
  { x: "19%", delay: 30, duration: 700, weight: 14, alpha: 0.35 },
  { x: "22%", delay: 10, duration: 520, weight: 2, alpha: 1 },
  { x: "31%", delay: 70, duration: 680, weight: 3, alpha: 1 },
  { x: "38%", delay: 20, duration: 580, weight: 5, alpha: 1 },
  { x: "41%", delay: 60, duration: 740, weight: 18, alpha: 0.3 },
  { x: "45%", delay: 90, duration: 620, weight: 2, alpha: 1 },
  { x: "52%", delay: 30, duration: 700, weight: 4, alpha: 1 },
  { x: "55%", delay: 10, duration: 660, weight: 12, alpha: 0.35 },
  { x: "58%", delay: 0, duration: 540, weight: 3, alpha: 1 },
  { x: "66%", delay: 60, duration: 660, weight: 2, alpha: 1 },
  { x: "70%", delay: 40, duration: 720, weight: 16, alpha: 0.3 },
  { x: "73%", delay: 20, duration: 600, weight: 5, alpha: 1 },
  { x: "80%", delay: 80, duration: 640, weight: 3, alpha: 1 },
  { x: "84%", delay: 30, duration: 680, weight: 12, alpha: 0.35 },
  { x: "87%", delay: 10, duration: 560, weight: 4, alpha: 1 },
  { x: "94%", delay: 50, duration: 620, weight: 2, alpha: 1 },
];

export function dropStreakStyle(streak: DropStreak): CSSProperties {
  return {
    "--drop-x": streak.x,
    "--drop-weight": `${streak.weight}px`,
    "--drop-alpha": streak.alpha,
    "--drop-duration": `${streak.duration}ms`,
    "--drop-delay": `${streak.delay}ms`,
  } as CSSProperties;
}
