"use client";

import { useEffect, useState } from "react";

const CURTAIN_COLUMNS = 2;
const CURTAIN_ROWS = 5;
const CURTAIN_CENTER = CURTAIN_COLUMNS / 2;

export function CurtainIntro() {
  const [stage, setStage] = useState<"closed" | "opening" | "done">("closed");

  useEffect(() => {
    // Force browser to not restore previous scroll position on refresh
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Always scroll to top (Hero section) immediately on page load / refresh
    window.scrollTo(0, 0);

    // Respect reduced-motion: skip the intro and entrance sequence entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const skipTimer = setTimeout(() => {
        setStage("done");
        document.body.classList.add("hero-animate");
      }, 0);
      return () => clearTimeout(skipTimer);
    }

    // Lock scrolling while curtain animation plays
    document.body.style.overflow = "hidden";

    // Hold closed for 500ms then start opening and trigger hero entrance animation
    const timer1 = setTimeout(() => {
      setStage("opening");
      document.body.classList.add("hero-animate");
    }, 500);

    // Unmount curtain after it completely opens
    const timer2 = setTimeout(() => {
      setStage("done");
      document.body.style.overflow = "";
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      document.body.style.overflow = "";
    };
  }, []);

  if (stage === "done") return null;

  return (
    <div
      className={`curtain-wrapper ${stage === "opening" ? "is-opening" : ""}`}
      aria-hidden="true"
    >
      <div
        className="curtain-grid"
        style={
          {
            "--curtain-columns": CURTAIN_COLUMNS,
            "--curtain-rows": CURTAIN_ROWS,
          } as React.CSSProperties
        }
      >
        {Array.from({ length: CURTAIN_COLUMNS * CURTAIN_ROWS }, (_, i) => {
          const row = Math.floor(i / CURTAIN_COLUMNS);
          const col = i % CURTAIN_COLUMNS;
          const isLeft = col < CURTAIN_CENTER;
          const distanceFromCenter = isLeft
            ? CURTAIN_CENTER - 1 - col
            : col - CURTAIN_CENTER;

          return (
            <span
              className="curtain-cell"
              key={i}
              style={
                {
                  "--cell-delay": `${(row + distanceFromCenter) * 0.1}s`,
                  "--pull-x": isLeft ? "-101%" : "101%",
                } as React.CSSProperties
              }
            >
              <span className="curtain-cell-fill" />
            </span>
          );
        })}
      </div>
    </div>
  );
}
