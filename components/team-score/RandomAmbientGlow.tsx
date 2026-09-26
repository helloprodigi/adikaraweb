"use client";

import { useEffect, useRef } from "react";
import styles from "./RandomAmbientGlow.module.css";

type BlobState = "FADE_IN" | "HOLD" | "FADE_OUT";

interface LightBlob {
  id: number;
  rgb: [number, number, number];
  x: number;
  y: number;
  r: number;
  alpha: number;
  targetX: number;
  targetY: number;
  targetR: number;
  targetAlpha: number;
  state: BlobState;
  stateTimer: number;
  holdDuration: number;
  swaySeed: number;
  swaySpeed: number;
  delay: number;
}

// 3 distinct ambient color light sources: Crimson Red, Radiant Orange, Golden Yellow
const COLORS: Array<[number, number, number]> = [
  [225, 29, 72],   // Crimson Red
  [249, 115, 22],  // Radiant Orange
  [245, 158, 11],  // Golden Yellow
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Pick a truly random location anywhere across 100% full section width & height
function getRandomLocation(w: number, h: number) {
  const x = (0.04 + Math.random() * 0.92) * w;
  const y = (0.12 + Math.random() * 0.76) * h;
  return { x, y };
}

export function RandomAmbientGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animId = 0;
    let width = 0;
    let height = 0;
    let lastTime = performance.now();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let blobs: LightBlob[] = [];

    const initBlobs = (w: number, h: number): LightBlob[] => {
      return COLORS.map((rgb, i) => {
        const loc = getRandomLocation(w, h);
        const baseR = Math.min(w, h) * (0.35 + Math.random() * 0.25);
        const targetA = 0.08 + Math.random() * 0.09;

        return {
          id: i,
          rgb,
          x: loc.x,
          y: loc.y,
          r: baseR * 0.8,
          alpha: 0.001,
          targetX: loc.x,
          targetY: loc.y,
          targetR: baseR,
          targetAlpha: targetA,
          state: "FADE_IN",
          stateTimer: 0,
          holdDuration: 2500 + Math.random() * 3000,
          swaySeed: Math.random() * 100,
          swaySpeed: 0.6 + Math.random() * 0.5,
          delay: i * 2200 + Math.random() * 800, // Staggered initial entry
        };
      });
    };

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || 600;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (blobs.length === 0) {
        blobs = initBlobs(width, height);
      }
    };

    const draw = (now: number) => {
      const dt = Math.min(now - lastTime, 100);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      for (const blob of blobs) {
        // Countdown initial stagger delay if present
        if (blob.delay > 0) {
          blob.delay -= dt;
          continue;
        }

        blob.stateTimer += dt;
        const swayX = Math.sin(blob.swaySeed + now * 0.0005 * blob.swaySpeed) * 25;
        const swayY = Math.cos(blob.swaySeed * 1.3 + now * 0.0004 * blob.swaySpeed) * 20;

        if (blob.state === "FADE_IN") {
          blob.x = lerp(blob.x, blob.targetX, 0.02);
          blob.y = lerp(blob.y, blob.targetY, 0.02);
          blob.r = lerp(blob.r, blob.targetR, 0.02);
          blob.alpha = lerp(blob.alpha, blob.targetAlpha, 0.02);

          if (Math.abs(blob.alpha - blob.targetAlpha) < 0.008) {
            blob.alpha = blob.targetAlpha;
            blob.state = "HOLD";
            blob.stateTimer = 0;
          }
        } else if (blob.state === "HOLD") {
          blob.x = lerp(blob.x, blob.targetX + swayX, 0.012);
          blob.y = lerp(blob.y, blob.targetY + swayY, 0.012);

          if (blob.stateTimer >= blob.holdDuration) {
            blob.state = "FADE_OUT";
            blob.stateTimer = 0;
          }
        } else if (blob.state === "FADE_OUT") {
          blob.alpha = lerp(blob.alpha, 0, 0.02);
          blob.x = lerp(blob.x, blob.targetX + swayX, 0.008);
          blob.y = lerp(blob.y, blob.targetY + swayY, 0.008);

          if (blob.alpha < 0.004) {
            blob.alpha = 0;
            // Pick a BRAND NEW TRULY RANDOM location anywhere across full section!
            const newLoc = getRandomLocation(width, height);

            blob.targetX = newLoc.x;
            blob.targetY = newLoc.y;
            blob.x = newLoc.x + (Math.random() - 0.5) * 40;
            blob.y = newLoc.y + (Math.random() - 0.5) * 40;
            blob.targetR = Math.min(width, height) * (0.35 + Math.random() * 0.25);
            blob.r = blob.targetR * 0.8;
            blob.targetAlpha = 0.08 + Math.random() * 0.09;
            blob.holdDuration = 2500 + Math.random() * 3500;
            blob.state = "FADE_IN";
            blob.stateTimer = 0;
            blob.delay = 0;
          }
        }

        if (blob.alpha <= 0.001) continue;

        const [r, g, b] = blob.rgb;
        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${blob.alpha})`);
        grad.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${blob.alpha * 0.5})`);
        grad.addColorStop(0.75, `rgba(${r}, ${g}, ${b}, ${blob.alpha * 0.15})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduced) {
        animId = requestAnimationFrame(draw);
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    if (reduced) {
      draw(1);
    } else {
      animId = requestAnimationFrame(draw);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
