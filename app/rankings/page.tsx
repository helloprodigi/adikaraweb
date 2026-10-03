"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/landing/navbar";
import { useScoreGate } from "@/components/rankings/ScoreGateProvider";
import { RandomAmbientGlow } from "@/components/team-score/RandomAmbientGlow";
import styles from "./rankings.module.css";

type RankingEntry = {
  teamId: string;
  teamName: string;
  description: string;
  score: number;
};

type RankingCategory = {
  id: string;
  label: string;
  rankings: RankingEntry[];
};

// Finalis belum diumumkan, tampilkan placeholder sampai data tersedia
const categories: RankingCategory[] = [
  { id: "innovation", label: "Innovation", rankings: [] },
  { id: "competitive-programming", label: "Competitive Programming", rankings: [] },
  { id: "cyber-security", label: "Cyber Security", rankings: [] },
  { id: "data-mining", label: "Data Mining", rankings: [] },
  { id: "entrepreneurship", label: "Entrepreneurship", rankings: [] },
];

const PLACEHOLDER_NAME = "Waiting for teams..";
const PLACEHOLDER_DESCRIPTION = "Waiting for you to be the finalist";
const PLACEHOLDER_SCORE = "??";

const NIM_REQUIRED_MESSAGE = "Wajib isi NIM untuk checking nilai tim.";

export default function RankingsPage() {
  const { openScoreGate } = useScoreGate();
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [isVisible, setIsVisible] = useState(false);
  const [rankingsVisible, setRankingsVisible] = useState(false);
  const [nim, setNim] = useState("");
  const [nimError, setNimError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  const rankingsRef = useRef<HTMLElement>(null);
  const category = categories.find((item) => item.id === activeCategory) ?? categories[0];

  useEffect(() => {
    const element = pageRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = rankingsRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRankingsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // True on the server and on the first client render alike, so the block ships
  // hidden and React has nothing to reconcile. It is only dropped once the
  // section has scrolled into view and the reveal animation starts.
  const isPending = !rankingsVisible;

  const handleNimChange = (value: string) => {
    setNim(value);
    if (nimError) setNimError("");
  };

  const handleScoreCheck = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNim = nim.trim();

    if (!trimmedNim) {
      setNimError(NIM_REQUIRED_MESSAGE);
      inputRef.current?.focus();
      return;
    }

    setNimError("");
    // The gate lives above the router, so the countdown and the drop keep
    // playing while the score page is loaded behind them.
    openScoreGate(trimmedNim);
  };

  return (
    <>
      <Navbar />
      <main ref={pageRef} className={`${styles.page} ${isVisible ? styles.pageVisible : ""}`}>
        <section className={styles.hero} aria-labelledby="rankings-title">
          <Image className={`${styles.sideWing} ${styles.leftWing}`} src="/landing/hero/hero-decor.svg" alt="" width={448} height={590} />
          <Image className={`${styles.sideWing} ${styles.rightWing}`} src="/landing/hero/hero-decor.svg" alt="" width={448} height={590} />
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>ADIKARA 2026</p>
            <h1 id="rankings-title">Finalis ADIKARA 2026</h1>
            <p>Congratulations To The Teams Advancing To The Final Round Of ADIKARA 2026.</p>
            <p>View Your Team&apos;s Detailed Evaluation On The Score Check Page.</p>
          </div>
        </section>

        <section
          ref={rankingsRef}
          className={`${styles.rankingsSection} ${
            isPending ? styles.rankingsPending : ""
          } ${rankingsVisible ? styles.rankingsVisible : ""}`}
          aria-labelledby="ranking-list-title"
        >
          <RandomAmbientGlow />
          <div className={styles.content}>
            <div className={styles.tabs} role="tablist" aria-label="Ranking categories">
              {categories.map((item) => (
                <button
                  className={`${styles.tab} ${item.id === activeCategory ? styles.activeTab : ""}`}
                  key={item.id}
                  onClick={() => setActiveCategory(item.id)}
                  role="tab"
                  type="button"
                  aria-selected={item.id === activeCategory}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className={styles.rankings}>
              <h2 id="ranking-list-title">Top 5 {category.label}</h2>
              <div className={styles.cardList} role="tabpanel">
                {category.rankings.length > 0
                  ? category.rankings.map((entry, index) => (
                      <article className={styles.rankingCard} key={entry.teamId}>
                        <div className={styles.rank}>{index + 1}</div>
                        <div className={styles.teamInfo}>
                          <h3>{entry.teamName}</h3>
                          <p>{entry.description}</p>
                        </div>
                        <div className={styles.score}>
                          <strong>{entry.score.toFixed(2)}</strong>
                          <span>Final Score</span>
                        </div>
                      </article>
                    ))
                  : Array.from({ length: 5 }, (_, index) => (
                      <article
                        className={`${styles.rankingCard} ${styles.placeholderCard}`}
                        key={`placeholder-${category.id}-${index}`}
                      >
                        <div className={styles.rank}>{index + 1}</div>
                        <div className={styles.teamInfo}>
                          <h3>{PLACEHOLDER_NAME}</h3>
                          <p>{PLACEHOLDER_DESCRIPTION}</p>
                        </div>
                        <div className={styles.score}>
                          <strong>{PLACEHOLDER_SCORE}</strong>
                          <span>Final Score</span>
                        </div>
                      </article>
                    ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.scoreSection} aria-labelledby="score-check-title">
          <div className={styles.panelContent}>
            <Image className={`${styles.panelOrnament} ${styles.panelOrnamentLeft}`} src="/landing/vertical-decor.svg" alt="" width={390} height={756} />
            <Image className={`${styles.panelOrnament} ${styles.panelOrnamentRight}`} src="/landing/vertical-decor.svg" alt="" width={390} height={756} />
            <h2 id="score-check-title">Check Your Team&apos;s Score</h2>
            <p>All Participants Can View Their Detailed Scores And Judges&apos; Feedback, Whether They Qualified For The Final Or Not.</p>
            <form
              className={styles.searchForm}
              onSubmit={handleScoreCheck}
              noValidate
            >
              <label
                className={`${styles.searchInput} ${nimError ? styles.searchInputError : ""}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span className={styles.srOnly}>NIM ketua tim</span>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  name="nim"
                  placeholder="Masukkan NIM ketua"
                  value={nim}
                  onChange={(event) => handleNimChange(event.target.value)}
                  aria-required="true"
                  aria-invalid={nimError ? "true" : "false"}
                  aria-describedby="score-check-result"
                />
              </label>
              <button type="submit">Cek Nilai</button>
            </form>
            <div
              className={`${styles.result} ${nimError ? styles.resultError : ""}`}
              id="score-check-result"
              aria-live="polite"
            >
              {nimError}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
