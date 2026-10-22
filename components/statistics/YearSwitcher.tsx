"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStatistics } from "./StatisticsContext";
import { YEARS } from "./statsData";
import styles from "./statistics.module.css";

// Keeps the CSS animation and the JS cleanup timers in sync.
const SWAP_DURATION = 420;

// 1 = the year moves to the right (next year), -1 = it moves to the left.
type Direction = 1 | -1;

type YearLayer = {
  id: number;
  year: number;
  direction: Direction;
  exiting: boolean;
  initial: boolean;
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function YearSwitcher() {
  const { year, setYear } = useStatistics();
  const [layers, setLayers] = useState<YearLayer[]>([
    { id: 0, year, direction: 1, exiting: false, initial: true },
  ]);
  const layerId = useRef(0);
  const lastYear = useRef(year);

  const shift = useCallback(
    (direction: Direction) => {
      const index = YEARS.indexOf(year);
      if (index === -1) return;

      const nextYear = YEARS[(index + direction + YEARS.length) % YEARS.length];
      const id = ++layerId.current;

      // Reduced motion swaps the number without any sliding.
      if (prefersReducedMotion()) {
        lastYear.current = nextYear;
        setLayers([
          { id, year: nextYear, direction, exiting: false, initial: true },
        ]);
        setYear(nextYear);
        return;
      }

      lastYear.current = nextYear;
      setLayers((previous) => [
        ...previous.map((layer) =>
          layer.exiting ? layer : { ...layer, exiting: true, direction }
        ),
        { id, year: nextYear, direction, exiting: false, initial: false },
      ]);
      setYear(nextYear);
    },
    [year, setYear]
  );

  const handlePrevYear = useCallback(() => shift(-1), [shift]);
  const handleNextYear = useCallback(() => shift(1), [shift]);

  const removeLayer = useCallback((id: number) => {
    setLayers((previous) => previous.filter((layer) => layer.id !== id));
  }, []);

  // Safety net: if the animation never fires its end event (reduced motion,
  // background tab) the outgoing layer is still cleaned up.
  useEffect(() => {
    const exiting = layers.filter((layer) => layer.exiting);
    if (exiting.length === 0) return;

    const timers = exiting.map((layer) =>
      setTimeout(() => removeLayer(layer.id), SWAP_DURATION + 120)
    );

    return () => timers.forEach(clearTimeout);
  }, [layers, removeLayer]);

  // Keeps the capsule in sync when the year is changed from somewhere else.
  useEffect(() => {
    if (lastYear.current === year) return;
    lastYear.current = year;
    const id = ++layerId.current;
    setLayers([{ id, year, direction: 1, exiting: false, initial: true }]);
  }, [year]);

  const layerClass = (layer: YearLayer) => {
    if (layer.exiting) return `${styles.yearLayer} ${styles.yearLayerExit}`;
    if (layer.initial) return styles.yearLayer;
    return `${styles.yearLayer} ${styles.yearLayerEnter}`;
  };

  return (
    <div className={styles.yearSelector} role="group" aria-label="Registration year">
      <button
        type="button"
        className={styles.yearArrowBtn}
        onClick={handlePrevYear}
        aria-label="Previous year"
      >
        <Image
          className={styles.yearArrowLeft}
          src="/statistics/arrow.svg"
          alt=""
          width={76}
          height={59}
        />
      </button>

      <div className={styles.yearCapsule} aria-live="polite">
        {layers.map((layer) => (
          <span
            key={layer.id}
            className={layerClass(layer)}
            data-direction={layer.direction}
            aria-hidden={layer.exiting ? true : undefined}
            onAnimationEnd={
              layer.exiting ? () => removeLayer(layer.id) : undefined
            }
          >
            {layer.year}
          </span>
        ))}
      </div>

      <button
        type="button"
        className={styles.yearArrowBtn}
        onClick={handleNextYear}
        aria-label="Next year"
      >
        <Image
          className={styles.yearArrowRight}
          src="/statistics/arrow.svg"
          alt=""
          width={76}
          height={59}
        />
      </button>
    </div>
  );
}
