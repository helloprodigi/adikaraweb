"use client";

// One shared scroll pipeline for every scroll-driven effect on the site.
//
// Before this, each consumer attached its own passive `scroll` listener and
// ran its own requestAnimationFrame. During a glide scroll the browser fires a
// scroll event per frame, so that meant several listeners reading layout and
// several independent frames writing styles in the same vsync. The extra
// layout reads and duplicate style writes are what made scrolling feel choppy.
//
// Now there is exactly one listener, one rAF loop and one `window.scrollY`
// read per frame, fanned out to callbacks that only touch a custom property or
// a transform. The loop parks itself once scrolling settles, so an idle page
// costs nothing.

export type ScrollCallback = (scrollY: number, viewportHeight: number) => void;

const subscribers = new Set<ScrollCallback>();

let frame = 0;
let dirty = false;
let idleTimer = 0;
let attached = false;

const notify = () => {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;

  for (const callback of subscribers) {
    callback(scrollY, viewportHeight);
  }
};

const tick = () => {
  if (dirty) {
    dirty = false;
    notify();
  }

  frame = requestAnimationFrame(tick);
};

const wake = () => {
  dirty = true;

  if (frame === 0) {
    frame = requestAnimationFrame(tick);
  }

  window.clearTimeout(idleTimer);
  // Long enough to cover the tail of a glide scroll, short enough that the
  // loop is not left running after the page goes quiet.
  idleTimer = window.setTimeout(() => {
    if (frame !== 0) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }, 220);
};

const handleScroll = () => wake();
const handleVisibility = () => {
  if (document.hidden && frame !== 0) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
};

const attach = () => {
  if (attached) return;
  attached = true;
  window.addEventListener("scroll", handleScroll, { passive: true });
  document.addEventListener("visibilitychange", handleVisibility);
};

const detach = () => {
  if (!attached) return;
  attached = false;
  window.removeEventListener("scroll", handleScroll);
  document.removeEventListener("visibilitychange", handleVisibility);
  window.clearTimeout(idleTimer);
  if (frame !== 0) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
};

export function subscribeToScroll(callback: ScrollCallback) {
  subscribers.add(callback);
  attach();

  // Give the first subscriber the current position without waiting for a
  // scroll event.
  callback(window.scrollY, window.innerHeight);

  return () => {
    subscribers.delete(callback);
    if (subscribers.size === 0) detach();
  };
}

// Elements that are offscreen do not need scroll-driven work at all. Pair this
// with `subscribeToScroll` so a section costs nothing until it is near view.
export function onViewportEnter(
  element: Element,
  onEnter: () => void,
  onLeave: () => void,
  rootMargin = "200px"
) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        onEnter();
      } else {
        onLeave();
      }
    },
    { rootMargin }
  );

  observer.observe(element);

  return () => observer.disconnect();
}
