"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const timelineItems = [
  { title: "Kick Off", date: "5 Oktober 2026", start: "2026-10-05", end: "2026-10-05" },
  {
    title: "Pendaftaran",
    date: "5 Oktober - 31 Oktober 2026",
    start: "2026-10-05",
    end: "2026-10-31",
  },
  {
    title: "Penjurian",
    date: "1 November - 9 November 2026",
    start: "2026-11-01",
    end: "2026-11-09",
  },
  {
    title: "Pengumuman Finalis",
    date: "11 November 2026",
    start: "2026-11-11",
    end: "2026-11-11",
  },
  {
    title: "Final",
    date: "16 - 20 November 2026",
    start: "2026-11-16",
    end: "2026-11-20",
  },
  {
    title: "Awarding",
    date: "22 November 2026",
    start: "2026-11-22",
    end: "2026-11-22",
  },
];

type PhaseStatus = "done" | "current" | "upcoming";

function getPhaseStatus(
  item: { start: string; end: string },
  now: Date
): PhaseStatus {
  const today = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const start = Date.parse(`${item.start}T00:00:00Z`);
  const end = Date.parse(`${item.end}T23:59:59Z`);

  if (Number.isNaN(start) || Number.isNaN(end)) return "upcoming";
  if (today > end) return "done";
  if (today >= start) return "current";
  return "upcoming";
}

const TARGET_PRIZE = 100000000;

const CONFETTI_COLORS = [
  "#ed1c24",
  "#ff4b57",
  "#ffca28",
  "#ff6818",
  "#fff1a8",
  "#ffffff",
];

type ConfettiPiece = {
  id: number;
  x: number;
  yStart: number;
  rise: number;
  fall: number;
  drift: number;
  rot: number;
  color: string;
  width: number;
  height: number;
  delay: number;
  duration: number;
};

function createConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => {
    const spread = count > 1 ? i / (count - 1) : 0.5;

    return {
      id: i,
      x: 12 + spread * 76 + (Math.random() - 0.5) * 5,
      yStart: 42 + Math.random() * 20,
      rise: -(28 + Math.random() * 52),
      fall: 210 + Math.random() * 140,
      drift: (Math.random() - 0.5) * 70,
      rot: (Math.random() - 0.5) * 540,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      width: 6 + Math.random() * 3,
      height: 9 + Math.random() * 4,
      delay: Math.random() * 0.35,
      duration: 2.3 + Math.random() * 0.8,
    };
  });
}

export function TimelineSection() {
  const prizeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [lineProgress, setLineProgress] = useState(0);

  const [hasPrizeStarted, setHasPrizeStarted] = useState(false);
  const [cashPrize, setCashPrize] = useState(0);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [now, setNow] = useState<Date | null>(null);

  // Resolve "today" on the client so server and client markup match
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // IntersectionObserver for Prize Row
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasPrizeStarted(true);
        }
      },
      { threshold: 0.4 }
    );

    if (prizeRef.current) {
      observer.observe(prizeRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Cash Prize Count-up Effect (Rp 0 to Rp100.000.000)
  useEffect(() => {
    if (!hasPrizeStarted) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const duration = 1600;
    const startTime = performance.now();
    const targetPrize = TARGET_PRIZE;
    let confettiTimer: ReturnType<typeof setTimeout> | undefined;

    const animatePrize = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCashPrize(Math.floor(easeProgress * targetPrize));

      if (progress < 1) {
        requestAnimationFrame(animatePrize);
      } else {
        setCashPrize(targetPrize);

        // Confetti burst on the prize capsule once the full amount is reached
        if (!reducedMotion) {
          setConfetti(createConfetti(48));
          confettiTimer = setTimeout(() => setConfetti([]), 4200);
        }
      }
    };

    requestAnimationFrame(animatePrize);

    return () => {
      if (confettiTimer) clearTimeout(confettiTimer);
    };
  }, [hasPrizeStarted]);

  // Scroll-driven timeline line progress
  useEffect(() => {
    const handleScroll = () => {
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress as user scrolls into track
      const startPoint = windowHeight * 0.75;
      const totalDistance = rect.height;

      const currentProgress = (startPoint - rect.top) / totalDistance;
      const clampedProgress = Math.min(Math.max(currentProgress, 0), 1);

      setLineProgress(clampedProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="timeline-section"
      id="timeline"
      aria-labelledby="timeline-title"
    >
      <Image
        className="timeline-decor timeline-decor-left"
        src="/landing/vertical-decor.svg"
        alt=""
        width={390}
        height={756}
      />
      <Image
        className="timeline-decor timeline-decor-right"
        src="/landing/vertical-decor.svg"
        alt=""
        width={390}
        height={756}
      />

      <div className="timeline-content">
        <div className="prize-row" ref={prizeRef}>
          <span>Total cash prize pool</span>
          <strong className={cashPrize >= TARGET_PRIZE ? "is-complete" : ""}>
            Rp{cashPrize.toLocaleString("id-ID")}
            {confetti.length > 0 && (
              <span className="prize-confetti" aria-hidden="true">
                {confetti.map((piece) => (
                  <span
                    key={piece.id}
                    className="prize-confetti-piece"
                    style={
                      {
                        "--x": `${piece.x}%`,
                        "--y-start": `${piece.yStart}px`,
                        "--rise": `${piece.rise}px`,
                        "--fall": `${piece.fall}px`,
                        "--drift": `${piece.drift}px`,
                        "--rot": `${piece.rot}deg`,
                        "--confetti-color": piece.color,
                        "--confetti-w": `${piece.width}px`,
                        "--confetti-h": `${piece.height}px`,
                        "--delay": `${piece.delay}s`,
                        "--duration": `${piece.duration}s`,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </span>
            )}
          </strong>
        </div>

        <h2 id="timeline-title">Event Timeline</h2>

        <div className="timeline-track" ref={trackRef}>
          <div className="timeline-line-bg" aria-hidden="true" />
          <div
            className="timeline-line-progress"
            aria-hidden="true"
            style={
              {
                "--line-progress": `${lineProgress * 100}%`,
              } as React.CSSProperties
            }
          />
          {timelineItems.map((item, index) => {
            const itemThreshold = index / (timelineItems.length - 1);
            const isReached = lineProgress >= itemThreshold;
            const status: PhaseStatus = now
              ? getPhaseStatus(item, now)
              : "upcoming";
            const isCurrent = status === "current";

            return (
              <div
                className={`timeline-item ${
                  isReached ? "is-reached" : ""
                } ${isCurrent ? "is-current" : ""} phase-${status}`}
                key={item.title}
              >
                <span className="timeline-node" aria-hidden="true" />
                {isCurrent && (
                  <>
                    <span className="timeline-node-ring" aria-hidden="true" />
                    <span
                      className="timeline-node-ring timeline-node-ring-late"
                      aria-hidden="true"
                    />
                  </>
                )}
                <h3>{item.title}</h3>
                <p>{item.date}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}