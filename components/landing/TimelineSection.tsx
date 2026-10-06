"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { subscribeToScroll } from "@/components/scrollTicker";

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

function getMaxLineProgress(
  items: Array<{ start: string; end: string }>,
  now: Date | null
): number {
  if (!now) return 1;

  const totalItems = items.length;
  if (totalItems <= 1) return 1;

  const todayMs = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

  let activeIndex = -1;
  let currentRatio = 0;

  for (let i = 0; i < totalItems; i++) {
    const startMs = Date.parse(`${items[i].start}T00:00:00Z`);
    const endMs = Date.parse(`${items[i].end}T23:59:59Z`);

    if (todayMs > endMs) {
      activeIndex = i;
    } else if (todayMs >= startMs && todayMs <= endMs) {
      activeIndex = i;
      const totalDuration = Math.max(1, endMs - startMs);
      const elapsed = Math.max(0, todayMs - startMs);
      currentRatio = elapsed / totalDuration;
      break;
    } else {
      break;
    }
  }

  if (activeIndex < 0) {
    return 0;
  }

  const stepSize = 1 / (totalItems - 1);
  const baseProgress = activeIndex * stepSize;
  const progressWithinStep = currentRatio * (stepSize * 0.4);

  return Math.min(1, baseProgress + progressWithinStep);
}

export function TimelineSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState<Date | null>(null);
  const nowRef = useRef<Date | null>(null);
  const updateRef = useRef<() => void>(() => {});

  useEffect(() => {
    nowRef.current = now;
    updateRef.current();
  }, [now]);

  // Resolve "today" on the client so server and client markup match
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // Scroll-driven timeline line progress.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let top = 0;
    let height = 0;
    let lastValue = -1;

    const measure = () => {
      const rect = track.getBoundingClientRect();
      top = rect.top + window.scrollY;
      height = rect.height;
    };

    const update = (scrollY: number, viewportHeight: number) => {
      if (height === 0) return;

      const startPoint = viewportHeight * 0.75;
      const scrollProgress = Math.min(Math.max((startPoint - (top - scrollY)) / height, 0), 1);
      
      const maxProgress = getMaxLineProgress(timelineItems, nowRef.current);
      const effectiveProgress = Math.min(scrollProgress, maxProgress);

      const value = Math.round(effectiveProgress * 1000) / 1000;

      if (value !== lastValue) {
        lastValue = value;
        track.style.setProperty("--line-progress", String(value));
      }
    };

    updateRef.current = () => update(window.scrollY, window.innerHeight);

    measure();

    const resizeObserver = new ResizeObserver(() => {
      measure();
      update(window.scrollY, window.innerHeight);
    });
    resizeObserver.observe(track);

    const unsubscribe = subscribeToScroll(update);

    return () => {
      unsubscribe();
      resizeObserver.disconnect();
    };
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
          <div className="timeline-line-progress" aria-hidden="true" />
          {timelineItems.map((item) => {
            const status: PhaseStatus = now
              ? getPhaseStatus(item, now)
              : "upcoming";
            const isCurrent = status === "current";

            return (
              <div
                className={`timeline-item ${isCurrent ? "is-current" : ""} phase-${status}`}
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