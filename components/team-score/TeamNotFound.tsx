"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DROP_STREAKS, dropStreakStyle } from "@/components/dropStreaks";
import styles from "./TeamNotFound.module.css";

// Shown when the submitted NIM is not in the registry. No navbar, no footer,
// no score card: just the organiser/partner marks and the sentence explaining
// that the team does not exist. The Telkom and Prodigi wordmarks sit side by
// side on top, with the Adikara emblem centred underneath them.
const partnerLogos = [
  {
    name: "Fakultas Informatika Telkom University",
    src: "/landing/hero/informatics-logo.svg",
    width: 244,
    height: 47,
  },
  {
    name: "Prodigi",
    src: "/landing/hero/prodigi-logo.webp",
    width: 621,
    height: 147,
  },
];

const emblem = {
  name: "ADIKARA 2026",
  src: "/landing/hero/adikara-icon.svg",
  width: 167,
  height: 260,
};

export function TeamNotFound({ nim }: { nim: string }) {
  // The page arrives with the same drop the score gate countdown ends on:
  // speed lines sweep down and the whole block falls into place, blurred.
  const [isDropping, setIsDropping] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsDropping(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <main className={`${styles.page} ${isDropping ? "is-dropping" : ""}`}>
      <div className="drop-streaks" aria-hidden="true">
        {DROP_STREAKS.map((streak) => (
          <span className="drop-streak" key={streak.x} style={dropStreakStyle(streak)} />
        ))}
      </div>

      <div className={styles.logsDrop}>
        <div className={styles.logos}>
          <Link
            className={styles.partnerRow}
            href="/"
            aria-label="Kembali ke beranda ADIKARA"
          >
            {partnerLogos.map((logo) => (
              <Image
                alt={logo.name}
                height={logo.height}
                key={logo.name}
                priority
                sizes="(max-width: 640px) 40vw, 240px"
                src={logo.src}                width={logo.width}
              />
            ))}
          </Link>

          <Link href="/" aria-label="Kembali ke beranda ADIKARA">
            <Image
              alt={emblem.name}
              className={styles.emblem}
              height={emblem.height}
              priority
              sizes="(max-width: 640px) 30vw, 170px"
              src={emblem.src}
              width={emblem.width}
            />
          </Link>
        </div>

        <p className={styles.message} role="status">
          <span>Tim dengan NIM:</span> <strong>{nim}</strong> tidak terdaftar.
        </p>
      </div>
    </main>
  );
}
