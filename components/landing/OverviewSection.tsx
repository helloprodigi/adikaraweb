"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function OverviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [participants, setParticipants] = useState(0);
  const [teams, setTeams] = useState(0);

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -100px 0px" }
    );

    const statsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      sectionObserver.observe(sectionRef.current);
    }
    if (statsRef.current) {
      statsObserver.observe(statsRef.current);
    }

    return () => {
      sectionObserver.disconnect();
      statsObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    const duration = 1400;
    const startTime = performance.now();

    const animateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setParticipants(Math.floor(easeProgress * 1100));
      setTeams(Math.floor(easeProgress * 360));

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setParticipants(1100);
        setTeams(360);
      }
    };

    requestAnimationFrame(animateCount);
  }, [hasStarted]);

  // Autoplay on load. Start muted to pass browser policy, then unmute once
  // the video is actually playing.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    video.muted = true;

    const tryPlay = () => {
      const promise = video.play();
      if (promise !== undefined) promise.catch(() => {});
    };

    const unmute = () => {
      if (video.muted) {
        video.muted = false;
        setIsMuted(false);
      }
    };

    const handlePlaying = () => {
      setTimeout(unmute, 150);
    };

    const handleInteraction = () => {
      unmute();
      tryPlay();
    };

    video.addEventListener("playing", handlePlaying);
    tryPlay();
    window.addEventListener("pointerdown", handleInteraction, {
      passive: true,
      once: true,
    });
    window.addEventListener("keydown", handleInteraction, {
      passive: true,
      once: true,
    });

    return () => {
      video.removeEventListener("playing", handlePlaying);
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    if (!video.muted) {
      const promise = video.play();
      if (promise !== undefined) promise.catch(() => {});
    }
  };

  return (
    <section
      className={`overview-section ${isVisible ? "is-visible" : ""}`}
      id="overview-details"
      aria-labelledby="overview-title"
      ref={sectionRef}
    >
      <Image
        className="overview-decor overview-decor-left"
        src="/landing/horizontal-decor.svg"
        alt=""
        width={520}
        height={430}
      />
      <Image
        className="overview-decor overview-decor-right"
        src="/landing/horizontal-decor.svg"
        alt=""
        width={520}
        height={430}
      />

      <div className="overview-content">
        <h2 id="overview-title">Overview Of ADIKARA 2026</h2>

        <div className="overview-video" aria-label="Adikara 2026 video preview">
          <video
            className="overview-iframe"
            ref={videoRef}
            src="/landing/adikaraTrailer.mp4"
            muted
            playsInline
            loop
            preload="metadata"
            aria-label="ADIKARA 2026 Trailer"
          />
          <button
            className={`overview-sound-toggle ${isMuted ? "is-muted" : ""}`}
            type="button"
            aria-label={isMuted ? "Unmute overview video" : "Mute overview video"}
            onClick={toggleMute}
          >
            <svg
              className="sound-icon sound-on"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" />
            </svg>
            <svg
              className="sound-icon sound-off"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.59 3 3.88-3.88-1.42-1.42-3.88 3.88-3.88-3.88-1.42 1.42L13.17 12l-3.88 3.88 1.42 1.42 3.88-3.88 3.88 3.88 1.42-1.42L18.59 12z" />
            </svg>
          </button>
        </div>

        <div className="overview-stats" aria-label="Adikara 2025 statistics" ref={statsRef}>
          <div className="stat-frame">
            <Image
              src="/landing/frame-participants.svg"
              alt=""
              width={274}
              height={74}
            />
            <div className="stat-frame-content">
              <strong>{participants}+</strong>
              <span>Participants 2025</span>
            </div>
          </div>
          <div className="stat-frame">
            <Image
              src="/landing/frame-teams.svg"
              alt=""
              width={274}
              height={74}
            />
            <div className="stat-frame-content">
              <strong>{teams}+</strong>
              <span>Teams 2025</span>
            </div>
          </div>
        </div>

        <p className="overview-description">
          <strong>ADIKARA</strong> (Ajang Digital Kreatif dan Inovasi Informatika) is
          a competition organized by
          <br />
          the <strong>Faculty of Informatics</strong> at <strong>Telkom University</strong>.
          It aims to develop technical skills,
          <br />
          creativity, and an entrepreneurial spirit through a variety of challenging and
          <br />
          innovative competitions.
        </p>
      </div>
    </section>
  );
}