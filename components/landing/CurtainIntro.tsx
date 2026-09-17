"use client";

import { useEffect, useState } from "react";

export function CurtainIntro() {
  const [stage, setStage] = useState<"closed" | "opening" | "done">("closed");

  useEffect(() => {
    // Force browser to not restore previous scroll position on refresh
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Always scroll to top (Hero section) immediately on page load / refresh
    window.scrollTo(0, 0);

    // Lock scrolling while curtain animation plays
    document.body.style.overflow = "hidden";

    // Hold closed for 500ms then start opening and trigger hero entrance animation
    const timer1 = setTimeout(() => {
      setStage("opening");
      document.body.classList.add("hero-animate");
    }, 500);

    // Unmount curtain after it completely slides out
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
    <div className={`curtain-wrapper ${stage === "opening" ? "is-opening" : ""}`}>
      {/* Left Red Curtain Panel */}
      <div className="curtain-panel curtain-left">
        <div className="curtain-texture" />
      </div>

      {/* Right Red Curtain Panel */}
      <div className="curtain-panel curtain-right">
        <div className="curtain-texture" />
      </div>
    </div>
  );
}
