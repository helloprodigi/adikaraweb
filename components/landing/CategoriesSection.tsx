"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

const categoryCards = [
  { name: "Innovation", src: "/landing/card-categories/card-innovation.svg" },
  {
    name: "Entrepreneurship",
    src: "/landing/card-categories/card-entrepreneurship.svg",
  },
  { name: "Data Mining", src: "/landing/card-categories/card-datamining.svg" },
  { name: "Capture The Flag", src: "/landing/card-categories/card-ctf.svg" },
  {
    name: "Competitive Programming",
    src: "/landing/card-categories/card-competitiveprogramming.svg",
  },
];

export function CategoriesSection() {
  const middleStart = categoryCards.length;
  const [activeIndex, setActiveIndex] = useState(middleStart);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);

  const selectedIndex = ((activeIndex % categoryCards.length) + categoryCards.length) % categoryCards.length;
  const cardWidth = Math.min(carouselWidth * 0.8, 1120);
  const cardGap = carouselWidth < 680 ? 12 : 16;
  const trackOffset = carouselWidth
    ? carouselWidth / 2 - cardWidth / 2 - activeIndex * (cardWidth + cardGap)
    : 0;

  const handleTrackTransitionEnd = () => {
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
    if (!carousel) return;

    const updateWidth = () => setCarouselWidth(carousel.clientWidth);
    const observer = new ResizeObserver(updateWidth);
    observer.observe(carousel);
    updateWidth();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => currentIndex + 1);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [isPlaying]);

  const moveSlide = (direction: number) => {
    setActiveIndex((currentIndex) => currentIndex + direction);
  };

  return (
    <section className="categories-section" id="competition" aria-labelledby="categories-title">
      <div className="categories-content">
        <h2 id="categories-title">Competition Categories</h2>

        <div className="category-carousel" aria-live="polite" ref={carouselRef}>
          <div
            className={`category-track ${isAnimating ? "" : "no-transition"}`}
            onTransitionEnd={handleTrackTransitionEnd}
            style={{ transform: `translate3d(${trackOffset}px, 0, 0)` } as CSSProperties}
          >
            {[...categoryCards, ...categoryCards, ...categoryCards].map((card, index) => (
              <Image
                className="category-card"
                key={`${card.name}-${index}`}
                src={card.src}
                alt={`${card.name} competition category`}
                width={1302}
                height={641}
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