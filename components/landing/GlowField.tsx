"use client";

import { useEffect, useRef } from "react";

type Blob = {
  x: number;
  y: number;
  r: number;
  baseA: number;
  cycle: number;
  phase: number;
  vx: number;
  vy: number;
  sway: number;
  rgb: [number, number, number];
};

const BLOB_COLORS: Array<[number, number, number]> = [
  [222, 30, 47],
  [255, 45, 66],
  [233, 71, 88],
  [255, 77, 90],
];

export function GlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let blobs: Blob[] = [];
    let raf = 0;
    let running = false;
    let width = 0;
    let height = 0;
    let lastTime = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const makeBlobs = () => {
      const count = Math.max(4, Math.min(7, Math.round((width * height) / 220000)));
      const baseR = Math.max(90, Math.min(width * 0.12, 230));
      blobs = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: height * ((i + 0.4 + Math.random() * 0.35) / count),
        r: baseR * (0.7 + Math.random() * 0.5),
        baseA: 0.04 + Math.random() * 0.05,
        cycle: 0.00008 + Math.random() * 0.0001,
        phase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.016,
        vy: (Math.random() - 0.5) * 0.012,
        sway: 10 + Math.random() * 18,
        rgb: BLOB_COLORS[i % BLOB_COLORS.length],
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeBlobs();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const b of blobs) {
        const fade = 0.5 + 0.5 * Math.sin(time * b.cycle + b.phase);
        const alpha = b.baseA * (0.18 + 0.82 * fade);
        if (alpha < 0.008) continue;

        const x = b.x + Math.sin(time * 0.00005 + b.phase) * b.sway;
        const y = b.y + Math.sin(time * 0.00004 + b.phase * 1.3) * b.sway * 0.7;
        const [r, g, bl] = b.rgb;
        const c = (a: number) => `rgba(${r}, ${g}, ${bl}, ${a})`;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, b.r);
        grad.addColorStop(0, c(alpha));
        grad.addColorStop(0.35, c(alpha * 0.5));
        grad.addColorStop(0.7, c(alpha * 0.18));
        grad.addColorStop(1, c(0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (time: number) => {
      if (!running) return;

      const dt = Math.min(time - lastTime, 120);
      lastTime = time;

      for (const b of blobs) {
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        const m = b.r + 60;
        if (b.x < -m) b.x = width + m;
        if (b.x > width + m) b.x = -m;
        if (b.y < -m) b.y = height + m;
        if (b.y > height + m) b.y = -m;
      }

      draw(time);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      lastTime = performance.now();
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    resize();
    if (reduced) {
      draw(1);
    } else {
      start();
    }

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="glow-field" aria-hidden="true" />;
}