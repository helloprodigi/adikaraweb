"use client";

import Image from "next/image";
import { memo, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

const categoryCards = [
  { name: "Innovation", src: "/landing/card-categories/card-innovation.webp" },
  {
    name: "Entrepreneurship",
    src: "/landing/card-categories/card-entrepreneurship.webp",
  },
  { name: "Data Mining", src: "/landing/card-categories/card-datamining.webp" },
  { name: "Capture The Flag", src: "/landing/card-categories/card-ctf.webp" },
  {
    name: "Competitive Programming",
    src: "/landing/card-categories/card-competitiveprogramming.webp",
  },
];

// Fifteen copies of the carousel exist at once and only two of them change
// state per slide. Memoising keeps a slide change to two image updates instead
// of fifteen, which is what used to cause a periodic hitch while scrolling.
const CategoryCard = memo(function CategoryCard({
  card,
  isActive,
  priority,
}: {
  card: (typeof categoryCards)[number];
  isActive: boolean;
  priority: boolean;
}) {
  return (
    <Image
      className={`category-card ${isActive ? "is-active" : ""}`}
      src={card.src}
      alt={`${card.name} competition category`}
      width={1302}
      height={641}
      priority={priority}
      draggable={false}
      sizes="(max-width: 680px) 80vw, (max-width: 1400px) 80vw, 1120px"
    />
  );
});

export function CategoriesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -100px 0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const middleStart = categoryCards.length;
  const [activeIndex, setActiveIndex] = useState(middleStart);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startXRef = useRef(0);
  const isPointerDownRef = useRef(false);

  const [layout, setLayout] = useState({
    cardWidth: 0,
    gap: 16,
    // Horizontal position of the visible centre, expressed in the track's own
    // coordinates.
    centreX: 0,
  });

  const selectedIndex = ((activeIndex % categoryCards.length) + categoryCards.length) % categoryCards.length;

  const trackOffset = layout.cardWidth
    ? layout.centreX -
      layout.cardWidth / 2 -
      activeIndex * (layout.cardWidth + layout.gap)
    : 0;

  const handleTrackTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;

    const middleEnd = categoryCards.length * 2 - 1;

    if (activeIndex > middleEnd) {
      setIsAnimating(false);
      setActiveIndex(middleStart);
    } else if (activeIndex < middleStart) {
      setIsAnimating(false);
      setActiveIndex(middleEnd);
    } else {
      return;
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setIsAnimating(true));
    });
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    const track = trackRef.current;
    if (!carousel || !track) return;

    // The card size comes from the stylesheet, which changes with breakpoints
    // (and used to disagree with the old hardcoded 80vw/16px guess). Measuring
    // it means the spotlighted card lands dead centre at every width, whatever
    // the CSS resolves to.
    const measure = () => {
      const card = track.firstElementChild as HTMLElement | null;
      if (!card) return;

      // offsetWidth is the laid-out width: unlike getBoundingClientRect it is
      // not divided by the scale() on the inactive cards.
      const cardWidth = card.offsetWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;

      // Layout offsets, not getBoundingClientRect: the carousel is scaled
      // slightly by its scroll reveal (scale(0.98) -> 1), and a transformed
      // rect would report the carousel as narrower than it is laid out, which
      // pushed the spotlight off centre by ~1% of the viewport.
      let layoutLeft = 0;
      let node: HTMLElement | null = carousel;
      while (node) {
        layoutLeft += node.offsetLeft;
        node = node.offsetParent as HTMLElement | null;
      }

      // clientWidth excludes a classic scrollbar while the full-bleed carousel
      // is sized in vw, so centring on the visible area keeps the card centred
      // in what the visitor can actually see.
      const centreX =
        document.documentElement.clientWidth / 2 - (layoutLeft - window.scrollX);

      setLayout((current) =>
        current.cardWidth === cardWidth &&
        current.gap === gap &&
        current.centreX === centreX
          ? current
          : { cardWidth, gap, centreX }
      );
    };

    const observer = new ResizeObserver(measure);
    observer.observe(carousel);
    observer.observe(track);
    measure();

    // Images decode after mount, so re-measure once they have settled.
    const onLoad = () => measure();
    window.addEventListener("load", onLoad);

    return () => {
      observer.disconnect();
      window.removeEventListener("load", onLoad);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || isDragging) return;

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => currentIndex + 1);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [isPlaying, isDragging]);

  const moveSlide = (direction: number) => {
    setActiveIndex((currentIndex) => currentIndex + direction);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== undefined && e.button !== 0) return;
    isPointerDownRef.current = true;
    startXRef.current = e.clientX;
    setIsDragging(true);
    setDragOffset(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    setDragOffset(deltaX);
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    // Scaled to the card so a swipe has to travel a real fraction of a card
    // before the carousel commits to a step. On a phone that stops a small
    // diagonal swipe from flicking to the next category while the visitor was
    // trying to scroll the page.
    const threshold = Math.max(48, layout.cardWidth * 0.16);
    if (dragOffset < -threshold) {
      setActiveIndex((currentIndex) => currentIndex + 1);
    } else if (dragOffset > threshold) {
      setActiveIndex((currentIndex) => currentIndex - 1);
    }

    setDragOffset(0);
    setIsDragging(false);
  };

  return (
    <section
      className={`categories-section ${isVisible ? "is-visible" : ""}`}
      id="competition"
      aria-labelledby="categories-title"
      ref={sectionRef}
    >
      <div className="categories-content">
        <h2 id="categories-title">Competition Categories</h2>

        <div
          className={`category-carousel ${isDragging ? "is-dragging" : ""}`}
          aria-live="polite"
          ref={carouselRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUpOrCancel}
          onPointerCancel={handlePointerUpOrCancel}
        >
          <div
            className={`category-track ${isAnimating && !isDragging ? "" : "no-transition"}`}
            onTransitionEnd={handleTrackTransitionEnd}
            ref={trackRef}
            style={{ transform: `translate3d(${trackOffset + dragOffset}px, 0, 0)` } as CSSProperties}
          >
            {[...categoryCards, ...categoryCards, ...categoryCards].map((card, index) => (
              <CategoryCard
                card={card}
                // Only the middle copy can ever be on screen, so only it counts
                // as the spotlight. Testing the modulo here would light up all
                // three copies of the active category.
                isActive={
                  index >= middleStart &&
                  index < middleStart + categoryCards.length &&
                  index - middleStart === selectedIndex
                }
                key={`${card.name}-${index}`}
                priority={index === categoryCards.length}
              />
            ))}
          </div>
        </div>

        <div className="category-controls" aria-label="Competition category controls">
          <div className="category-dots">
            {categoryCards.map((card, index) => (
              <button
                aria-label={`Show ${card.name}`}
                className={`category-dot ${index === selectedIndex ? "is-active" : ""}`}
                key={card.name}
                onClick={() => setActiveIndex(middleStart + index)}
                type="button"
              />
            ))}
          </div>
          <button
            aria-label={isPlaying ? "Pause category slideshow" : "Play category slideshow"}
            className="category-play"
            onClick={() => setIsPlaying((playing) => !playing)}
            type="button"
          >
            <span className={isPlaying ? "pause-icon" : "play-icon"} aria-hidden="true" />
          </button>
        </div>

        <div className="category-manual-controls">
          <button type="button" onClick={() => moveSlide(-1)} aria-label="Previous category">
            Previous
          </button>
          <button type="button" onClick={() => moveSlide(1)} aria-label="Next category">
            Next
          </button>
        </div>
      </div>
    </section>
  );
}