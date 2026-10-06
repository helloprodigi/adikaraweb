"use client";

import { useEffect, useState } from "react";

const CURTAIN_COLUMNS = 2;
const CURTAIN_ROWS = 5;
const CURTAIN_CENTER = CURTAIN_COLUMNS / 2;

type IntroStatus = "idle" | "playing" | "played";
type IntroStage = "checking" | "closed" | "opening" | "done";

let introStatus: IntroStatus = "idle";
let activeLifecycle = 0;

export function CurtainIntro() {
  const [stage, setStage] = useState<IntroStage>("checking");

  useEffect(() => {
    const lifecycleId = ++activeLifecycle;

    if (introStatus !== "idle") return;

    introStatus = "playing";

    const previousScrollRestoration =
      "scrollRestoration" in window.history ? window.history.scrollRestoration : null;

    if (previousScrollRestoration) {
      window.history.scrollRestoration = "manual";
    }

    const restoreScrollRestoration = () => {
      if (previousScrollRestoration) {
        window.history.scrollRestoration = previousScrollRestoration;
      }
    };

    window.scrollTo(0, 0);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const skipTimer = setTimeout(() => {
        introStatus = "played";
        setStage("done");
        window.dispatchEvent(new Event("curtainDone"));
      }, 0);
      return () => {
        clearTimeout(skipTimer);
        restoreScrollRestoration();
      };
    }

    const closedTimer = setTimeout(() => setStage("closed"), 0);
    document.body.style.overflow = "hidden";

    const openingTimer = setTimeout(() => {
      setStage("opening");
      document.body.classList.add("hero-animate");
    }, 500);

    const curtainTimer = setTimeout(() => {
      setStage("done");
      document.body.style.overflow = "";
      restoreScrollRestoration();
      window.dispatchEvent(new Event("curtainDone"));
    }, 3200);

    const idleTimer = setTimeout(() => {
      document.body.classList.remove("hero-animate");
      document.body.classList.add("hero-idle");
    }, 6200);

    return () => {
      queueMicrotask(() => {
        if (activeLifecycle !== lifecycleId) return;

        introStatus = "played";
        clearTimeout(closedTimer);
        clearTimeout(openingTimer);
        clearTimeout(curtainTimer);
        clearTimeout(idleTimer);
        document.body.style.overflow = "";
        document.body.classList.remove("hero-animate", "hero-idle");
        restoreScrollRestoration();
      });
    };
  }, []);

  if (stage === "checking" || stage === "done") return null;

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
