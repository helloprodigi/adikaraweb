"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./jordan.module.css";

const JORDAN_IMAGES = [
  { src: "/jordan/genjor.png", alt: "Genjor" },
  { src: "/jordan/jorbaldheadahh.png", alt: "Jor Bald Head" },
  { src: "/jordan/jordan-gold-medalist.png", alt: "Jordan Gold Medalist" },
];

export function JordanEasterEgg() {
  const [index, setIndex] = useState(0);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeState("out");
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % JORDAN_IMAGES.length);
        setFadeState("in");
      }, 800);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % JORDAN_IMAGES.length);
      setIsSpinning(false);
    }, 750);
  };

  const currentImage = JORDAN_IMAGES[index];

  return (
    <div className={styles.container}>
      <Link href="/rankings" className={styles.backBtn}>
        ← Back
      </Link>
      <div
        className={styles.imageWrapper}
        onClick={handleClick}
        title="Click for funny animation!"
      >
        <Image
          src={currentImage.src}
          alt={currentImage.alt}
          width={320}
          height={320}
          priority
          className={`${styles.jordanImage} ${
            fadeState === "in" ? styles.fadeIn : styles.fadeOut
          } ${styles.idleFunny} ${isSpinning ? styles.funnyClickSpin : ""}`}
        />
      </div>
      <p className={styles.caption}>jorgenjorbigjor123</p>
    </div>
  );
}
