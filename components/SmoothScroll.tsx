"use client";

import { useEffect } from "react";

// Two values drive the whole thing:
//
//   targetScrollY  where the input wants to be
//   currentScrollY where the page actually is (window.scrollY)
//
// Input moves the target immediately; the render loop eases the page
// toward it. No library does this in the project (no Lenis/GSAP/Framer
// Motion in package.json), so it is implemented directly rather than
// introducing a second scrolling system.
//
// This deliberately drives the real window scroll instead of transforming
// a wrapper element. That keeps anchor links, sticky positioning,
// scrollbars, focus scrolling and every existing IntersectionObserver
// reveal working untouched.
// Lower than the usual 0.15-0.2 on purpose: a smaller fraction means the
// page takes longer to reach the target, so it picks up speed instead of
// snapping straight to the input. 0.08 settles in roughly 400ms.
const SMOOTHING = 0.08;
const SETTLE_DISTANCE = 0.5; // px

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SmoothScroll() {
  useEffect(() => {
    // Reduced motion: no listeners attached, native scrolling only.
    if (prefersReducedMotion()) return;

    let targetScrollY = window.scrollY;
    let frame = 0;
    let lastTime = 0;
    let maxScroll = 0;
    let hoveringNativeScroll = false;

    const measure = () => {
      maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
    };

    // Scale the factor by elapsed time so the feel matches at 60Hz and
    // 120Hz. A raw per-frame fraction would halve the effect on 120Hz.
    const timeScale = (time: number) => {
      if (lastTime === 0) {
        lastTime = time;
        return 1;
      }
      const elapsed = Math.min(Math.max(time - lastTime, 1), 64);
      lastTime = time;
      return elapsed / 16.667;
    };

    const tick = (time: number) => {
      // Anything scrolling on its own owns the wheel while hovered, and the
      // page must not keep drifting towards a stale target underneath.
      if (hoveringNativeScroll) {
        frame = 0;
        lastTime = 0;
        targetScrollY = window.scrollY;
        return;
      }

      const scale = timeScale(time);
      const currentScrollY = window.scrollY;
      const distance = targetScrollY - currentScrollY;

      if (Math.abs(distance) < SETTLE_DISTANCE) {
        frame = 0;
        lastTime = 0;
        return;
      }

      // "instant" bypasses the CSS `scroll-behavior: smooth` on <html>.
      // Letting each frame start its own tween would compound the lag into
      // something sluggish. Anchor links still smooth because the browser
      // drives those.
      window.scrollTo({
        top: currentScrollY + distance * SMOOTHING * scale,
        behavior: "instant",
      });

      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame === 0) frame = requestAnimationFrame(tick);
    };

    // Wheel only. Touch and trackpad-drag keep native scrolling, which
    // already has momentum built in and must not get desktop inertia
    // forced on top of it.
    const handleWheel = (event: WheelEvent) => {
      // Leave browser zoom (ctrl+wheel) and horizontal gestures alone.
      if (event.ctrlKey) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      // Elements that scroll on their own (the download resource list)
      // keep their native behaviour instead of being hijacked by the page
      // smoother, otherwise hovering them and scrolling does nothing.
      const scrollRegion = (event.target as HTMLElement | null)?.closest?.(
        "[data-native-scroll]"
      );
      if (scrollRegion) return;
      event.preventDefault();
      measure();

      // deltaMode 1 = lines, 2 = pages. Normalise to pixels.
      const scale =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? window.innerHeight
            : 1;

      // Idle means the previous gesture fully settled, so start from the
      // real position instead of stacking onto a stale target.
      if (frame === 0) targetScrollY = window.scrollY;

      targetScrollY += event.deltaY * scale;
      targetScrollY = Math.min(Math.max(targetScrollY, 0), maxScroll);

      start();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const el = event.target as HTMLElement | null;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;

      const page = window.innerHeight * 0.9;
      let delta: number;

      switch (event.key) {
        case "ArrowDown":
          delta = 120;
          break;
        case "ArrowUp":
          delta = -120;
          break;
        case "PageDown":
          delta = page;
          break;
        case "PageUp":
          delta = -page;
          break;
        case " ":
          delta = event.shiftKey ? -page : page;
          break;
        case "Home":
          event.preventDefault();
          measure();
          targetScrollY = 0;
          start();
          return;
        case "End":
          event.preventDefault();
          measure();
          targetScrollY = maxScroll;
          start();
          return;
        default:
          return;
      }

      event.preventDefault();
      measure();
      if (frame === 0) targetScrollY = window.scrollY;
      targetScrollY += delta;
      targetScrollY = Math.min(Math.max(targetScrollY, 0), maxScroll);
      start();
    };

    // Any scroll this loop did not cause (scrollbar drag, anchor jump,
    // focus scrolling, find-in-page) has to adopt the new position, or the
    // next frame would pull the page back to where it used to be.
    const handleScroll = () => {
      if (frame === 0) targetScrollY = window.scrollY;
    };

    const handleResize = () => {
      measure();
      targetScrollY = Math.min(Math.max(targetScrollY, 0), maxScroll);
    };

    // Track hover on self-scrolling regions so the page stops drifting the
    // moment the pointer enters one, and resumes normally on leave.
    const handlePointerOver = (event: PointerEvent) => {
      const region = (event.target as HTMLElement | null)?.closest?.(
        "[data-native-scroll]"
      );
      if (!region) return;

      hoveringNativeScroll = true;
      if (frame !== 0) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      lastTime = 0;
      targetScrollY = window.scrollY;
    };

    const handlePointerOut = (event: PointerEvent) => {
      const region = (event.target as HTMLElement | null)?.closest?.(
        "[data-native-scroll]"
      );
      if (!region) return;

      // relatedTarget null means the pointer left the window entirely.
      const next = event.relatedTarget as HTMLElement | null;
      if (next && region.contains(next)) return;

      hoveringNativeScroll = false;
    };

    measure();
    targetScrollY = window.scrollY;

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    window.addEventListener("pointerout", handlePointerOut, { passive: true });

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerout", handlePointerOut);
    };
  }, []);

  return null;
}
