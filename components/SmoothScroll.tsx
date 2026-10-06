"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

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
// A glide is over once this long has passed without new input. Without this
// the loop can outlive its gesture: a route change replaces the document, the
// browser clamps the new page to its own (shorter) height, and the loop keeps
// easing towards a target that belonged to the old page, pinning the new page
// at the bottom. The value only has to outlast the easing tail, so a real
// gesture still lands on its target; the scroll listener below is what actually
// catches a route change, and it reacts on the first scroll event.
const GESTURE_TIMEOUT = 900; // ms

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SmoothScroll() {
  // Re-keyed on every route change so each page starts from the top with a
  // freshly measured scroll range, and no leftover target from the page the
  // visitor just left.
  const pathname = usePathname();

  useEffect(() => {
    // Reduced motion: no listeners attached, native scrolling only.
    if (prefersReducedMotion()) return;

    let targetScrollY = 0;
    let frame = 0;
    let lastTime = 0;
    let maxScroll = 0;
    let hoveringNativeScroll = false;
    let lastInputAt = performance.now();
    // The last offset this loop asked the browser for, used to tell its own
    // scrolling apart from scrolling it did not cause.
    let lastAppliedTop = 0;

    // Reading scrollHeight forces a synchronous layout. Doing it on every
    // wheel event meant each wheel tick threw away the frame the page had
    // just painted. It is cached instead and refreshed only when the page
    // can actually have changed height.
    const measure = () => {
      maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
    };

    const stop = () => {
      if (frame !== 0) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      lastTime = 0;
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
      if (hoveringNativeScroll || document.hidden) {
        stop();
        targetScrollY = window.scrollY;
        return;
      }

      // The gesture is over, so whatever distance is left is stale.
      if (time - lastInputAt > GESTURE_TIMEOUT) {
        stop();
        targetScrollY = window.scrollY;
        return;
      }

      const scale = timeScale(time);
      const currentScrollY = window.scrollY;
      const distance = targetScrollY - currentScrollY;

      if (Math.abs(distance) < SETTLE_DISTANCE) {
        stop();
        targetScrollY = currentScrollY;
        return;
      }

      const nextTop = currentScrollY + distance * SMOOTHING * scale;

      // "instant" bypasses the CSS `scroll-behavior: smooth` on <html>.
      // Letting each frame start its own tween would compound the lag into
      // something sluggish. Anchor links still smooth because the browser
      // drives those.
      lastAppliedTop = nextTop;
      window.scrollTo({ top: nextTop, behavior: "instant" });

      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      lastInputAt = performance.now();
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
      if (frame === 0) targetScrollY = window.scrollY;
      targetScrollY += delta;
      targetScrollY = Math.min(Math.max(targetScrollY, 0), maxScroll);
      start();
    };

    // Any scroll this loop did not cause (scrollbar drag, anchor jump,
    // focus scrolling, find-in-page, a route change swapping the document)
    // has to adopt the new position, or the next frame would pull the page
    // back to where it used to be.
    const handleScroll = () => {
      const y = window.scrollY;

      // Something outside this loop moved the page a long way while the loop
      // was still easing. Adopt it and stop, otherwise the glide would drag
      // the new position back towards a target from before the jump.
      const movedByOther =
        Math.abs(y - lastAppliedTop) > 2 && Math.abs(y - targetScrollY) > 24;

      if (movedByOther) {
        stop();
        measure();
        targetScrollY = y;
        return;
      }

      if (frame === 0) targetScrollY = y;
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

    const isTouch =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        window.innerWidth <= 900);

    const performScrollTo = (top: number) => {
      targetScrollY = top;
      if (isTouch) {
        window.scrollTo({ top, behavior: "smooth" });
      } else {
        start();
      }
    };

    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const id = hash.replace("#", "");
      const target = document.getElementById(id);
      if (target) {
        measure();
        const rect = target.getBoundingClientRect();
        const navbar = document.querySelector(".floating-navbar");
        const navbarOffset = navbar ? navbar.getBoundingClientRect().height + 16 : 80;
        const top = Math.min(Math.max(window.scrollY + rect.top - navbarOffset, 0), maxScroll);
        performScrollTo(top);
      }
    };

    const handleAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;

      const hashIndex = href.indexOf("#");
      if (hashIndex !== -1) {
        const hash = href.substring(hashIndex);
        const path = href.substring(0, hashIndex);
        if (!path || path === "/" || path === window.location.pathname) {
          const id = hash.replace("#", "");
          const target = document.getElementById(id);
          if (target) {
            measure();
            const rect = target.getBoundingClientRect();
            const navbar = document.querySelector(".floating-navbar");
            const navbarOffset = navbar ? navbar.getBoundingClientRect().height + 16 : 80;
            const top = Math.min(Math.max(window.scrollY + rect.top - navbarOffset, 0), maxScroll);
            performScrollTo(top);
          }
        }
      }
    };

    measure();
    targetScrollY = window.scrollY;

    if (window.location.hash) {
      // Retry sequence to catch layout changes before, during, and after curtain intro & asset load
      const delays = [50, 200, 500, 1200, 2500, 3300, 4200];
      delays.forEach((delay) => setTimeout(scrollToHash, delay));

      window.addEventListener("load", scrollToHash);
      if (typeof document !== "undefined" && "fonts" in document) {
        document.fonts.ready.then(scrollToHash);
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      targetScrollY = 0;
      lastAppliedTop = 0;
    }
    measure();

    const sizeObserver = new ResizeObserver(() => {
      const previousMax = maxScroll;
      measure();
      if (window.location.hash) {
        scrollToHash();
      } else if (frame !== 0 && targetScrollY > previousMax) {
        targetScrollY = Math.min(targetScrollY, maxScroll);
      }
    });
    sizeObserver.observe(document.body);

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    window.addEventListener("pointerout", handlePointerOut, { passive: true });
    window.addEventListener("click", handleAnchorClick);
    window.addEventListener("hashchange", scrollToHash);
    window.addEventListener("curtainDone", scrollToHash);

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      sizeObserver.disconnect();
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("hashchange", scrollToHash);
      window.removeEventListener("curtainDone", scrollToHash);
      window.removeEventListener("load", scrollToHash);
    };
  }, [pathname]);

  return null;
}
