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

export function TimelineSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [lineProgress, setLineProgress] = useState(0);
  const [now, setNow] = useState<Date | null>(null);

  // Resolve "today" on the client so server and client markup match
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

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