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
  const [carouselWidth, setCarouselWidth] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startXRef = useRef(0);
  const isPointerDownRef = useRef(false);

  const selectedIndex = ((activeIndex % categoryCards.length) + categoryCards.length) % categoryCards.length;
  const cardWidth = Math.min(carouselWidth * 0.8, 1120);
  const cardGap = carouselWidth < 680 ? 12 : 16;
  const trackOffset = carouselWidth
    ? carouselWidth / 2 - cardWidth / 2 - activeIndex * (cardWidth + cardGap)
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
    if (!carousel) return;

    const updateWidth = () => setCarouselWidth(carousel.clientWidth);
    const observer = new ResizeObserver(updateWidth);
    observer.observe(carousel);
    updateWidth();

    return () => observer.disconnect();
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

    const threshold = 40;
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
            style={{ transform: `translate3d(${trackOffset + dragOffset}px, 0, 0)` } as CSSProperties}
          >
            {[...categoryCards, ...categoryCards, ...categoryCards].map((card, index) => (
              <Image
                className={`category-card ${
                  index % categoryCards.length === selectedIndex ? "is-active" : ""
                }`}
                key={`${card.name}-${index}`}
                src={card.src}
                alt={`${card.name} competition category`}
                width={1302}
                height={641}
                priority={index === categoryCards.length}
                draggable={false}
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