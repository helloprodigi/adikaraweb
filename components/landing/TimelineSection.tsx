"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const timelineItems = [
  { title: "Registration", date: "Date To Be Announced" },
  { title: "Kick Off", date: "5 October 2026" },
  { title: "Mentoring", date: "November 2026" },
  { title: "Qualifying Round", date: "1 - 21 November 2026" },
  { title: "Finals", date: "November 2026" },
  { title: "Awarding", date: "22 November 2026" },
];

export function TimelineSection() {
  const prizeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [lineProgress, setLineProgress] = useState(0);

  const [hasPrizeStarted, setHasPrizeStarted] = useState(false);
  const [cashPrize, setCashPrize] = useState(0);

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

    const duration = 1600;
    const startTime = performance.now();
    const targetPrize = 100000000;

    const animatePrize = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCashPrize(Math.floor(easeProgress * targetPrize));

      if (progress < 1) {
        requestAnimationFrame(animatePrize);
      } else {
        setCashPrize(targetPrize);
      }
    };

    requestAnimationFrame(animatePrize);
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
          <strong>Rp{cashPrize.toLocaleString("id-ID")}</strong>
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

            return (
              <div
                className={`timeline-item ${isReached ? "is-reached" : ""}`}
                key={item.title}
              >
                <span className="timeline-node" aria-hidden="true" />
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